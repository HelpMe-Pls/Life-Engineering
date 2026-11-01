---
name: meeting-summary-prompt
description: "On the \"Generate a meeting summary based on <video>. Refer to @\"Meeting Summary [...].html\"...\" prompt, re-transcribe the video with --force first, then write the summary into the global-hubspot repo's docs/meetings"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 915318af-1202-48ea-8ba3-4733b68a7c57
  modified: 2026-10-14T06:17:14.598Z
---

When the user sends this prompt template (the video and the reference summary vary):

> Generate a meeting summary based on <this video>. Refer to @"Meeting Summary [2026-09-23].html" for the desired output.

1. **Re-transcribe the video before anything else**, overwriting any existing `.vtt` beside it. The video normally sits in the transient `C:\Users\leekh\Videos\Captures` ([[edge8-folder-convention]]) and the `.vtt` stays beside it. Use the video's absolute path and run it in the background (`run_in_background: true`). It takes roughly 15 min per 50 min of audio.
   ```
   PYTHONIOENCODING=utf-8 HF_HUB_DISABLE_SYMLINKS_WARNING=1 /c/Users/leekh/.venvs/transcribe/Scripts/python -u /c/Users/leekh/.venvs/transcribe/transcribe.py "<absolute path to video>.mp4" --force
   ```
2. Wait for the completion notification, then check the `.vtt` for repeated-line loops (`uniq -c` on the cue text). Report any gap, and never summarise from a looped section.
3. Write `Meeting Summary [YYYY-MM-DD].html` into `C:\Users\leekh\Documents\Repos\Edge8\global-hubspot\docs\meetings`, never into the video's folder and no longer into `Documents\Edge8\Meetings` (Khôi's ask, 2026-10-13), dated from the video's `YYYYMMDD-HHMMSS` file name. The referenced summary lives in that repo folder too. Follow the folder's README: the exact name (anything else is silently left out of the list), one file per date, self-contained HTML with inline CSS, images as `data:` URIs and no scripts or forms (they are blocked). A private recording, such as Khôi's 1:1 with Dave, never goes there: ask him where it goes. The layout is the README's "What a summary looks like" section (since 14 Oct 2026: the Action Items table sits right below the Context box) with the CSS of the newest summary; see [[meeting-summary-workflow]]. Match the newest summary's plain-English style and carry its terms and decisions forward.
4. Before handing the page over, run Prettier with its defaults and `--end-of-line auto` (`node <repo>/website/node_modules/prettier/bin/prettier.cjs --write --end-of-line auto "<file>"`) and the render check (no sideways scroll at 375 and 1280, no script or form, no `#` before a digit, no local path), then read it cold as an EO Global admin.
5. Commit, push or open the docs PR (one per Meeting date) only when he asks. When he does, follow the repo's `.claude/skills/github-flow/SKILL.md`: branch `docs/meeting-summary-<yyyymmdd>` off `origin/dev`, one commit, push through the local gate, squash PR into `dev`, then the promotion PR `promote: dev to main — …` merged with a merge commit once the CI gate is green (#1102 and #1103 on 14 Oct 2026 are the model).

**Why:** the older .vtt files came from a tool that got stuck repeating one line and lost 5½ minutes of the 2026-09-23 call. The local re-transcription fixed it, and the user gave standing approval (2026-09-23) to overwrite old .vtt files this way. They chose to keep this rule in this project's memory, not in global CLAUDE.md.

**How to apply:** see [[local-transcription-setup]] for the script details and [[meeting-summary-workflow]] for the summary conventions.
