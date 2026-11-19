"""Transcribe a meeting recording to WebVTT with faster-whisper, on the NVIDIA GPU when
there is one, else on the CPU.

Usage:
    python transcribe.py RECORDING.mp4                      # whole file -> RECORDING.vtt
    python transcribe.py RECORDING.mp4 --start 23:00 --end 28:40
    python transcribe.py RECORDING.mp4 -o out.vtt --force   # overwrite an existing file
    python transcribe.py RECORDING.mp4 --device cpu         # leave the GPU alone

The first line printed names the device the run uses. CUDA needs the cuBLAS 12 and
cuDNN 9 wheels in this environment (pip install nvidia-cublas-cu12 "nvidia-cudnn-cu12==9.*");
their DLL folders are registered below. When CUDA fails for any reason the run falls
back to the CPU and says so, so a summary never waits on a driver.
"""

import argparse
import glob
import os
import shutil
import sys
import sysconfig
import time

import av
import numpy as np

SAMPLE_RATE = 16000

# Names and products the model otherwise mishears ("ChargeB", "Altair", "Saurbuts", ...).
HOTWORDS = (
    "EO, EO Global, HubSpot, Altai, Chargebee, Eventbrite, MyEO, Cloud Converge, "
    "Edge8, Nisha, Kyle, Dave, Thanh, Khoi, Sourbutts, Lauren"
)


def parse_time(value):
    """Accept SS, MM:SS or HH:MM:SS (fractions allowed) and return seconds."""
    seconds = 0.0
    for part in value.split(":"):
        seconds = seconds * 60 + float(part)
    return seconds


def format_time(t, with_hours):
    ms = round(t * 1000)
    h, ms = divmod(ms, 3_600_000)
    m, ms = divmod(ms, 60_000)
    s, ms = divmod(ms, 1000)
    if with_hours:
        return f"{h:02d}:{m:02d}:{s:02d}.{ms:03d}"
    return f"{m:02d}:{s:02d}.{ms:03d}"


def decode_audio(path, start=0.0, end=None):
    """Decode only the audio track between start and end into 16 kHz mono float32."""
    with av.open(path) as container:
        stream = container.streams.audio[0]
        duration = float(container.duration / av.time_base) if container.duration else None
        if start > 0:
            # Seeks to the nearest keyframe at or before `start`; trimmed exactly below.
            container.seek(int(start * av.time_base))
        resampler = av.AudioResampler(format="s16", layout="mono", rate=SAMPLE_RATE)
        chunks, first_time = [], None
        for frame in container.decode(stream):
            if frame.time is None:
                continue
            if end is not None and frame.time >= end:
                break
            if first_time is None:
                first_time = frame.time
            for out in resampler.resample(frame):
                chunks.append(out.to_ndarray().reshape(-1))
        for out in resampler.resample(None):
            chunks.append(out.to_ndarray().reshape(-1))

    audio = np.concatenate(chunks).astype(np.float32) / 32768.0
    lead = max(0, round((start - (first_time or 0.0)) * SAMPLE_RATE))
    audio = audio[lead:]
    if end is not None:
        audio = audio[: round((end - start) * SAMPLE_RATE)]
    return audio, duration


def default_output(recording, start, end):
    stem = os.path.splitext(recording)[0]
    if start or end is not None:
        tag = lambda t: f"{int(t // 60):02d}m{int(t % 60):02d}s"
        return f"{stem}.{tag(start)}-{tag(end) if end is not None else 'end'}.vtt"
    return f"{stem}.vtt"


def register_cuda_dlls():
    """Make the NVIDIA pip wheels' DLLs (nvidia/*/bin or lib under site-packages) loadable."""
    if not hasattr(os, "add_dll_directory"):
        return []
    found = []
    for sub in ("bin", "lib"):
        for folder in glob.glob(os.path.join(sysconfig.get_paths()["purelib"], "nvidia", "*", sub)):
            if glob.glob(os.path.join(folder, "*.dll")):
                os.add_dll_directory(folder)
                found.append(folder)
    return found


def load_model(name, device, threads):
    """Return (model, device, compute_type), falling back to the CPU when CUDA fails."""
    from faster_whisper import WhisperModel

    if device in ("auto", "cuda"):
        wanted = device == "cuda" or shutil.which("nvidia-smi") is not None
        if wanted:
            try:
                register_cuda_dlls()
                model = WhisperModel(name, device="cuda", compute_type="float16")
                # The CUDA libraries load lazily: a missing cuDNN only shows on the first
                # inference, so prove the device on one second of silence before the real run.
                segments, _ = model.transcribe(np.zeros(SAMPLE_RATE, dtype=np.float32), language="en")
                list(segments)
                return model, "cuda", "float16"
            except Exception as error:  # noqa: BLE001 - any CUDA failure means "use the CPU"
                print(f"CUDA failed ({type(error).__name__}: {str(error).splitlines()[0][:120]}), using the CPU.", flush=True)
        elif device == "auto":
            pass  # no NVIDIA driver on this machine
    model = WhisperModel(name, device="cpu", compute_type="int8", cpu_threads=threads)
    return model, "cpu", "int8"


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("recording")
    parser.add_argument("-o", "--output")
    parser.add_argument("--start", type=parse_time, default=0.0)
    parser.add_argument("--end", type=parse_time)
    parser.add_argument("--model", default="large-v3-turbo")
    parser.add_argument("--device", choices=("auto", "cuda", "cpu"), default="auto",
                        help="auto (default) uses CUDA when an NVIDIA driver is present, else the CPU")
    parser.add_argument("--threads", type=int, default=min(os.cpu_count() or 4, 16))
    parser.add_argument("--force", action="store_true", help="overwrite an existing output file")
    args = parser.parse_args()

    output = args.output or default_output(args.recording, args.start, args.end)
    if os.path.exists(output) and not args.force:
        sys.exit(f"Refusing to overwrite {output} (use --force).")

    model, device, compute_type = load_model(args.model, args.device, args.threads)
    detail = f"{args.threads} threads" if device == "cpu" else "NVIDIA GPU"
    print(f"Device: {device} ({compute_type}, {detail})", flush=True)

    t0 = time.time()
    audio, duration = decode_audio(args.recording, args.start, args.end)
    span = len(audio) / SAMPLE_RATE
    print(f"Decoded {span / 60:.1f} min of audio in {time.time() - t0:.0f}s", flush=True)

    segments, _ = model.transcribe(
        audio,
        language="en",
        beam_size=5,
        # Skip silence, and don't feed each window's text into the next: together these
        # stop the "same line repeated for five minutes" failure.
        vad_filter=True,
        vad_parameters={"min_silence_duration_ms": 500},
        condition_on_previous_text=False,
        hotwords=HOTWORDS,
    )

    with_hours = (args.end or duration or 0) >= 3600
    t1 = time.time()
    with open(output, "w", encoding="utf-8", newline="\n") as f:
        f.write("WEBVTT\n\n")
        for seg in segments:
            start = format_time(args.start + seg.start, with_hours)
            end = format_time(args.start + seg.end, with_hours)
            f.write(f"{start} --> {end}\n{seg.text.strip()}\n\n")
            f.flush()
            done = seg.end / span * 100 if span else 100
            print(f"[{done:5.1f}%] {start} {seg.text.strip()[:70]}", flush=True)

    print(f"Wrote {output} in {(time.time() - t1) / 60:.1f} min", flush=True)


if __name__ == "__main__":
    main()
