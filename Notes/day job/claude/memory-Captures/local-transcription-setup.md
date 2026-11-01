---
name: local-transcription-setup
description: How meeting recordings (.mp4) in the transient Captures folder are transcribed to .vtt locally with faster-whisper
metadata:
  node_type: memory
  type: reference
  originSessionId: 915318af-1202-48ea-8ba3-4733b68a7c57
  modified: 2026-10-14T06:17:14.736Z
---

Local transcription script: `C:\Users\leekh\.venvs\transcribe\transcribe.py`, run with the venv's Python:
`/c/Users/leekh/.venvs/transcribe/Scripts/python -u /c/Users/leekh/.venvs/transcribe/transcribe.py REC.mp4 [--start MM:SS --end MM:SS] [-o out.vtt] [--force]`

- Set up 2026-09-23: faster-whisper 1.2.1, model large-v3-turbo, CPU int8 (no NVIDIA GPU; 24 cores). Runs ~3.5x realtime — a 51-min call took ~14 min. Run it in the background.
- Uses VAD filter + condition_on_previous_text=False to stop the repeated-line loops that broke earlier .vtt files, plus hotwords for EO names (HubSpot, Altai, Chargebee, Nisha, Thanh, Sourbutts…).
- Refuses to overwrite an existing .vtt without --force. The user has approved overwriting old .vtt files with re-transcriptions.
- Output has no speaker labels (diarization not installed).
- The recording and its `.vtt` are intermediates in `C:\Users\leekh\Videos\Captures`, which the user clears at will. The summary built from them goes to the repo's `docs\meetings` since 13 Oct 2026 ([[edge8-folder-convention]]).
- Timing: the 28.3-min call of 14 Oct 2026 took 7.1 min. The first 44 s of that recording are silence and so are minutes 5 to 6: a test slice must hold speech, or the `.vtt` has no cues (checked 14 Oct 2026; the script is fine).

**This machine's GPU cannot be used (Khôi asked on 14 Oct 2026).** It is an AMD Radeon 890M, the integrated GPU of the Ryzen AI 9 HX 370 (12 cores, 24 threads, 32 GB), with no NVIDIA driver. faster-whisper's engine, CTranslate2, runs on the CPU or on NVIDIA CUDA only; whisper.cpp with Vulkan could use the AMD GPU but is a different tool with different output, and the gain over 12 Zen 5 cores would be small. On an NVIDIA machine the path is `device="cuda", compute_type="float16"` with the PyPI wheels `nvidia-cublas-cu12` (553 MB) and `nvidia-cudnn-cu12==9.*` (737 MB, Windows wheels exist); faster-whisper's README says CUDA 12 + cuDNN 9.

**The kit's GPU-aware `transcribe.py`** (`C:\Users\leekh\Documents\Edge8\Deliverables\meeting-summary-workflow\files\transcribe.py`, see [[meeting-summary-kit]]) is this script plus `--device auto|cuda|cpu`: `auto` tries CUDA when `nvidia-smi` is on PATH, registers the NVIDIA wheels' DLL folders under `site-packages/nvidia/*/bin|lib` with `os.add_dll_directory`, proves the device on one second of silence, and falls back to CPU int8 with a printed reason. Its first line is `Device: cpu (int8, 16 threads)` here (smoke-tested 14 Oct 2026 on 00:44–01:14 of the 14 Oct recording: 10 cues). If Khôi runs the kit's setup on this machine, it replaces `~/.venvs/transcribe/transcribe.py` with that one after saving the old one as `transcribe.cpu.py`; behaviour here stays CPU.

Feeds [[meeting-summary-workflow]].

**Vietnamese audio crashes the progress print (15 Oct 2026).** On a Vietnamese call the script died at the first cue with `UnicodeEncodeError: 'charmap' codec` (Windows cp1252 stdout). Run it with `PYTHONIOENCODING=utf-8 PYTHONUTF8=1` in front; the 9.8-min Mai 1-1 then transcribed fine in Vietnamese.

**Timing, 21 Oct 2026:** the 54.6-min call (1.64 GB) decoded in 11 s and transcribed in about 16 min (started 09:58, wrote the .vtt at 10:14; 37.5% after 9 min), about 3.4x realtime; 246 cues, no looped lines (only "Yeah." x4 and "Okay." x3 repeat). The script's last line is `Wrote <path> in N.N min`, so a background wait can key on `^Wrote `.
