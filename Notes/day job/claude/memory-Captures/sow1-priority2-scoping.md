---
name: sow1-priority2-scoping
description: "SOW 1 (HubSpot v1.1) Priority 2 role features — what they are, each item's state, the standing decisions on the member renewal build (off until mid-March 2027), HubSpot lessons, and where the detail lives"
metadata:
  node_type: memory
  type: project
  originSessionId: 1d1c86ae-d4da-4d99-b5b5-49a28e369aa6
  modified: 2026-10-23T12:36:37.140Z
---

**What it is.** SOW 1 (https://www.edge8.ai/proposals/eo-global-sow/sow-1-hubspot-improvement.html, a draft, not contracted) has eight Priority 2 "light-lift role features": chapter dashboard, global intake, member renewal, SAP new and renewal, new member onboarding, Key Executive pipeline, nurture campaigns, forum view and moderator email. The 7 Oct 2026 call's "priority tool" was this list misheard.

**State (23 Oct 2026).**
- Chapter dashboard: scoped, template built on EO Vietnam 9 Oct (see [[apac-regional-dashboard]]).
- Member renewal: built in EO's live HubSpot 17 Oct, all off; story changes added 23 Oct (one deal per chapter with deal field Primary chapter, report counts primary only, Open skips On Leave). Switch-on waits for mid-March 2027.
- SAP new and renewal: not picked by EO's SOW stories; waits.
- The other five: parked, not scoped.

**Standing decisions on member renewal (Khôi, 17–23 Oct).**
- The board is the chapters' view and sends members nothing. EO's membership team (Team Renewals 91364841) runs the member side: its Renewals tickets 917643539 are the renewals@ help desk. Never link, edit or copy them.
- Only super admins use the build until release. Every workflow ends in an empty Create task as its switch-on lock.
- Lifecycle gate: the Lifecycle workflow goes on first, then EO switches off "Set lifecycle stage when a deal is created", never the reverse. The won switch is EO's choice. Without the fix, about 19,900 members would move to Opportunity.
- Sharing: a deal is shared with the team named exactly like the chapter. Each new chapter team gets its own path in Open the same day (rule in Open's HubSpot description and Documents\Edge8\Deliverables\Member renewal - new chapter team rule.html). Data-driven sharing to check before dozens of chapters have teams.

**HubSpot lessons from the build.**
- Altai writes two Chapter Membership kinds since ~17 Oct: the program term ("EO Membership"/"EO Global", no priority) and one per chapter (membership_name = chapter, chapter_priority).
- Workflow delays can't wait on an associated record's field; Edit record has no Deal stage (use "Deal pipeline and stage"); workflow access offers teams, not users.
- Test opens by record id with `.../view/test-flow?recordId=<id>`.

**Where the detail lives.** Scopes\Scope [Member renewal].html (live copy website/public/plans/member-renewal.html, PR 1138) and Scope [Member renewal user stories].html; AFK\End session reports of 17 Oct and 23 Oct (run 2) with their detail pages (ids, tests, counts); HITL\End report of 17 Oct; Tickets\[PROOF] Member renewal smoke test [2026-10-18] and [PROOF] Sprint Tickets [Y26 Sprint 42] Card 2 (demo).

**Why:** later sessions need the decisions and where things are, not the build log.

**How to apply:** read the scope and the newest session report before changing the build; keep Khôi's rules above; re-read the live SOW page before scoping another Priority 2 item. Don't add review gates ([[khoi-calls-the-shots]]).
