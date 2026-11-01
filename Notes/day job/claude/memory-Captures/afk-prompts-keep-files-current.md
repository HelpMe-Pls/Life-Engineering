---
name: afk-prompts-keep-files-current
description: Every AFK start prompt must make the unattended session keep ALL files that describe its work current as it goes (after each milestone and before any stop), not only at the end; name each file and how to edit it
metadata:
  type: feedback
---

On 17 Oct 2026, while Claude wrote the Member Renewal AFK prompt, Khôi added: "make sure that the prompts keep ALL relevant files current with its implementation as it goes".

**Why:** an unattended run can stop at any point (a turn cap, a blocked action, Chrome dropping), and every page that describes the work must match reality at that moment.

**How to apply:** each AFK prompt names every file that states the work's state, with how to edit it and its checks: the scope in Documents\Edge8\Scopes (800-word cap, render check, keep his hand edits), its live copy in a repo (one PR left open when EO reads that page), the tracker's card or parked line, other scopes that depend on it, the memory note, and the session report in Documents\Edge8\AFK\End (created at the session's start). The session updates them after each milestone and before any stop, then searches for any other line that states the build state. Records of their own day (meeting summaries, the Evidence folder, Sprint review pages, older AFK files) stay untouched. Example: the "Keep the files current" part of AFK\Start\Scope [Member renewal] AFK prompt.md. Related: [[sow1-priority2-scoping]], [[claude-in-chrome-afk-facts]].
