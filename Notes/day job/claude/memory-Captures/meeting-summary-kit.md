---
name: meeting-summary-kit
description: "The setup kit (Documents\\Edge8\\Deliverables\\meeting-summary-workflow + .zip, 14 Oct 2026) that gives another Edge8 developer the same summary flow in Claude Code (desktop app, Windows): SETUP.md for the agent, a user skill eo-meeting-summary, a GPU-aware transcribe.py; summaries only, no tickets; what Khôi settled in the grilling"
metadata:
  node_type: memory
  type: project
  originSessionId: c750551f-0027-4a03-97c6-c27ccf6c8fb9
  modified: 2026-10-14T06:20:17.307Z
---

On 2026-10-14 Khôi asked for "an agent-friendly doc" so another Claude user gets the `Transcribe the LATEST video then add its summary and tickets accordingly` flow. Settled in a grilling session the same day:

- **Recipient:** an Edge8 developer, contributor to EO-Vietnam/global-hubspot, on Windows, using Claude Code inside the Claude desktop app (the Code tab). **Summaries only, no tickets or tracker** ("JUST FOR THE MEETING SUMMARIES"). Khôi said he would run the setup on this machine himself to see how it goes.
- **Kit:** `C:\Users\leekh\Documents\Edge8\Deliverables\meeting-summary-workflow\` and `meeting-summary-workflow.zip` beside it: `README.txt` (for the human), `SETUP.md` (for the agent: two questions, winget installs, clone + `npm install` + Chromium, venv + faster-whisper, the skill, the settings file, a smoke test, the hand-over), `files\SKILL.md` (the user skill `eo-meeting-summary` with `{{RECORDINGS}}`, `{{REPO}}`, `{{VENV}}` placeholders the setup fills), `files\transcribe.py` (GPU-aware: `--device auto` tries CUDA when `nvidia-smi` exists, registers the NVIDIA pip wheels' DLL folders, falls back to CPU int8 and says so), `files\render-check.js`, `files\settings.json`.
- **The prompt that starts the setup:** New session with the unzipped folder as project folder, mode Accept edits, then `Read SETUP.md and follow its instructions.` After setup the recipient starts sessions in their recordings folder and sends `Transcribe the LATEST video then add its summary`; the skill also matches the long form with "and tickets accordingly" and says in one line that tickets are not part of that setup. The second prompt, after their own read-through, is `Open the docs PR for the <date> summary`, which follows the repo's `.claude/skills/github-flow/SKILL.md` with absolute paths (docs branch off dev, squash PR into dev, promotion PR to main with a merge commit), exactly as #1102 and #1103 went.
- **Decisions:** LATEST = newest recording by modified time; the Meeting date from a `YYYYMMDD` in the name, else the modified date; a non-EO recording makes the agent ask where the summary goes; the format is read from the repo's `docs/meetings/README.md` ("What a summary looks like", added 14 Oct 2026 in PR #1104) and the newest summary, not carried in the skill; Prettier defaults with `--end-of-line auto` before hand-over; the render check uses the clone's Playwright; the skill carries the names list, the mishearings, a short glossary and the two things Dave asked to keep from EO.
- **If Khôi installs the skill here:** it is silent about tickets, so the tracker still comes from memory ([[edge8-sprint-card-rules]]); the setup is idempotent (keeps the venv and clone, merges the Captures settings file, backs up `transcribe.py` as `transcribe.cpu.py` before replacing it).

**Why:** Khôi wants a colleague to get "the EXACT same flow" from one prompt, without Edge8-internal tracker machinery.

**How to apply:** when the kit changes, update the folder and re-zip; keep `files\SKILL.md` in step with [[meeting-summary-workflow]] and the README section, and keep tickets out of it. See [[local-transcription-setup]] for the transcriber and [[edge8-folder-convention]] for the Deliverables folder.
