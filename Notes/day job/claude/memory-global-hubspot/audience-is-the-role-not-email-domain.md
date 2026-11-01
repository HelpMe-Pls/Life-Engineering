---
name: audience-is-the-role-not-email-domain
description: "When scoping who may see an admin surface, the operator treats the ROLE as the audience; never propose vetting the admin roster by email domain (gmail.com / eonetwork.org) as a pre-publish check"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 0b9510c6-539e-4483-960c-f74580574388
  modified: 2026-10-07T09:44:41.682Z
---

For "who can see this admin page/content", the audience is whoever holds the `admin` role, full stop. Don't add "identify the gmail.com admin" or "confirm the eonetwork.org admins are EO Global staff" steps.

**Why:** on 2026-10-07, triaging #1052 (the `/admin/meetings` area), I counted production admins by email domain (11: 5 Edge8, 5 `eonetwork.org`, 1 `gmail.com`) and turned it into an operator checklist. Asked about the `eonetwork.org` half, the operator answered: _"No need to care which domain they are. All we need to make sure here is the ones who has `admin` role can view the summaries."_ Recorded as `DEC-MEETINGS-AREA`; it pairs with `DEC-ROLE-PARITY` (the two admin tiers differ only by `/admin/accounts`).

**How to apply:** scope an admin surface to the role and stop there. A chapter-vs-admin boundary is still worth stating (chapters must never reach admin content). Who holds the role is the operator's business, not a pre-publish gate. The GitHub-readers question for content committed to the repo is a separate door and still worth one question. Related: [[triage-ask-before-reversing-a-standing-rule]].
