---
name: hitl-minimal-with-chrome
description: "Khôi, 17 Oct 2026 - with Claude in Chrome available, an AFK run does every click it safely can itself; HITL only for permission-critical actions or steps no agent can do safely end to end; the boundary is \"The HITL line\", rule 4 of the sprint setup prompt"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 6d956e52-ea54-4e0c-98aa-482d6dbb86d4
  modified: 2026-10-17T14:16:40.412Z
---

On 17 Oct 2026 Khôi said: "Since YOU (Claude Code CLI) now have FULL ACCESS to your Chrome extension, I need the number of HITL tasks to be MINIMAL ... HITL should only be requested for those permission-critical actions and/or those tasks where it's IMPOSSIBLE for an agent to SAFELY go AFK e2e WITHOUT human intervention."

**Why:** every HITL row is time he spends reviewing and approving; Chrome holds his logins (HubSpot super admin, GitHub as Kh0iLe, the Supabase dashboard, Eventbrite), so a click a person used to make is now the run's own step.

**How to apply:** when writing or revising an AFK prompt, put each step on one side of the HITL line (standing rule 4 under `# After sprint review` in the vault's `Notes/Daily Standup.md`, with the full lists). Run's side: reads, HubSpot assets a card names (workflows Off behind a placeholder lock), sandbox checks and screenshots, Eventbrite test events in a test organisation, Dry-run dispatches, a repo created on github.com, additive production migrations in the Supabase SQL editor, CLI runs with the repo's own .env keys. His side: anything that reaches other people (a message is drafted ready to paste, he sends), bulk or destructive production writes, users, teams, seats, permissions, billing, brands and account settings, secrets by name, live-writing dispatches, classifier blocks, merges the scope says to leave open, one-way-door forks. Every other fork the run settles and builds. Each HITL row names the condition that put it there; a row an agent could have done is a defect. Confirmed by Khôi the same day: an additive production migration (CREATE, ADD COLUMN, INDEX, POLICY, FUNCTION, TRIGGER, GRANT; nothing that updates, deletes, drops, truncates, renames or backfills) is applied by the run in the Supabase SQL editor, "no need to confirm"; a destructive one still leaves the PR open for him. Where a repository's own docs say a person applies every production migration or dispatches every workflow, the standing rule wins and the run never stops to ask; Message 1 quotes each such sentence. Related: [[afk-prompts-confirm-bulk-writes]], [[afk-prompts-keep-files-current]], [[claude-in-chrome-afk-facts]], [[edge8-folder-convention]].
