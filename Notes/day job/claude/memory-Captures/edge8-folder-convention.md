---
name: edge8-folder-convention
description: "Captures is a transient workspace (recordings, .vtt, ticket planning); since 13 Oct 2026 new meeting summaries go into the global-hubspot repo's docs/meetings (Documents/Edge8/Meetings is the old, stale home), sprint trackers in Documents/Edge8/Tickets, SOW scope pages in Documents/Edge8/Scopes, unattended-run prompts and reports in Documents/Edge8/AFK (Start, End), and Khôi's own human-in-the-loop steps in Documents/Edge8/HITL (Start = before a run, End = after it)"
metadata:
  node_type: memory
  type: project
  originSessionId: 915318af-1202-48ea-8ba3-4733b68a7c57
  modified: 2026-10-17T13:53:36.204Z
---

Since the evening of 2026-09-23 the user keeps these folders apart (Scopes added 2026-10-07, meeting summaries moved to the repo 2026-10-13):

| Folder | Role | Holds |
|---|---|---|
| `C:\Users\leekh\Videos\Captures` (this project) | Transient workspace | The `.mp4` recording (Windows Game Bar drops it here), the `.vtt` it is transcribed to, and any scratch used to plan tickets. The user empties it at will; on 2026-09-23 evening it held only `desktop.ini`. |
| `C:\Users\leekh\Documents\Repos\Edge8\global-hubspot\docs\meetings` | Deliverables, since 2026-10-13 | `Meeting Summary [YYYY-MM-DD].html`, one per Meeting date, served by the tracker's `/admin/meetings` to admins only. Holds 08-19 to 10-07, the corrected copies. See [[meeting-summary-workflow]]. |
| `C:\Users\leekh\Documents\Edge8\Meetings` | Old home, stale | The summaries up to 10-07, older than the repo copies (no Sourbutts fix of 8 Oct). Never write here or model on these again. |
| `C:\Users\leekh\Documents\Edge8\Tickets` | Deliverables | `Sprint Tickets [Y26 Sprint NN].html` trackers (Sprint 38 moved here on 2026-09-23). |
| `C:\Users\leekh\Documents\Edge8\Scopes` | Working pages | `Scope [<item>].html`, one per SOW item being scoped, laid out like the meeting summaries, facts pre-filled and pink "Card N decides" boxes for the card's open decisions. Created 2026-10-07 with `Scope [Chapter dashboard].html` and `Scope [Member renewal].html`, see [[sow1-priority2-scoping]]. Not in `additionalDirectories`; the user-level allow covers writes there. |
| `C:\Users\leekh\Documents\Edge8\Deliverables` | Kits for other people | A folder per kit plus its `.zip` to send on Lark. First: `meeting-summary-workflow\` and `meeting-summary-workflow.zip` (2026-10-14, Khôi's choice of folder), see [[meeting-summary-kit]]. Not in `additionalDirectories`; the user-level allow covers writes there. |
| `C:\Users\leekh\Documents\Edge8\AFK` | Unattended (away-from-keyboard) sessions, since 2026-10-16 | `Start\<source document> AFK prompt.md` (a sprint's is `Sprint Tickets [YNN Sprint NN] AFK prompt.md`), the two-message execution prompt with its launch command; `End\AFK Session Report [YYYY-MM-DD] <topic>.html`, what the run did, created at the run's start and kept current. Since 17 Oct 2026 the topic follows the date (`Sprint NN`, `Member renewal`), because two runs can end on one day. See [[afk-prompt-folders]], [[afk-prompts-keep-files-current]]. |
| `C:\Users\leekh\Documents\Edge8\HITL` | Human-in-the-loop steps, Khôi's own, created 2026-10-17 | `Start\HITL Pre-flight [YYYY-MM-DD] <topic>.html`, the steps only Khôi can do before an unattended run starts (a failed machine check, a refused `gh repo create`, secrets by name, a merge or another person's HubSpot step that must land first, then the launch itself), written by the setup session only when such a step exists; `End\HITL Session Report [YYYY-MM-DD] <topic>.html`, the steps only a person can do after the run (PRs left open with the migration SQL to run, 🧑 forks with the recommendation, handed-over card steps, cards to flip), same rows as the AFK report's "What to do" table plus the exact command or click path and where it runs. First file: `End\HITL Session Report [2026-10-17] Member renewal.html`. Both are 2-minute reports under the Reader-facing docs rule; they may hold local commands and paths because Khôi at this machine is the only reader. |

**Why:** the user moved every summary and the Sprint 38 tracker out of Captures on 2026-09-23 and asked for this convention from then on, so Captures can be cleared without losing work.

**How to apply:** sessions still start in Captures. Transcribe in place (the `.vtt` sits beside the video), but write every new summary into the repo's `docs\meetings`, every new tracker into Tickets, every new scope page into Scopes, every execution prompt and session report into AFK, and every page of steps that only Khôi can do into HITL (Start before the run, End after it), never beside the video. The sprint setup prompt that produces the AFK and HITL files is `# After sprint review` in the vault's `Notes/Daily Standup.md` (Khôi asked on 17 Oct 2026 that it also populate HITL "as necessary": a Pre-flight page only when a step before launch is his, a HITL Session Report always). When a prompt references `@"Meeting Summary [...].html"`, look for it in the repo's `docs\meetings` first. Never store a deliverable in Captures again. See [[meeting-summary-prompt]], [[meeting-summary-workflow]], [[events-api-ownership]].

**No permission prompts for the two Documents folders (user's ask, 2026-09-23):** `C:\Users\leekh\Videos\Captures\.claude\settings.json` lists both as `permissions.additionalDirectories`, so they count as working directories. The repo's `docs\meetings` is not in that list; the user-level allow covers writes there, as for Scopes. The `.claude` folder carries the Hidden attribute so an Explorer "select all, delete" in Captures leaves it alone. If the file is missing at session start (the user clears Captures at will), recreate it with exactly:

```json
{
  "permissions": {
    "additionalDirectories": [
      "C:/Users/leekh/Documents/Edge8/Meetings",
      "C:/Users/leekh/Documents/Edge8/Tickets"
    ]
  }
}
```

then `attrib +h C:\Users\leekh\Videos\Captures\.claude`. Note the user-level settings already allow Read, Write and Edit everywhere, so a prompt was unlikely even before this; the setting makes it certain. `desktop.ini` in Captures is Windows' own known-folder file (localized display name), not ours: leave it.
