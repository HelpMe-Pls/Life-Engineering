---
name: triage-ask-before-reversing-a-standing-rule
description: "A triage request that would reverse an operator's standing design rule gets a question first, never a ready-for-agent label with the reversal only flagged in the brief"
metadata:
  node_type: memory
  type: feedback
  originSessionId: f33e2f03-4bb6-4391-b361-3adc3cf4a1e7
  modified: 2026-10-07T07:52:30.035Z
---

When `/triage` turns up a recorded operator rule that the request would reverse (a page's header comment, `docs/engineering/recorded-decisions.md`, the spine), ask the operator "keep the rule or reverse it?" before applying `ready-for-agent`. Flagging the reversal inside the agent brief is not enough.

**Why:** on 2026-09-29, #1025 (the account-detail form on `/admin/people`) went to `ready-for-agent` with the reversal of that page's "reads and never writes" rule (operator, 2026-09-20) only flagged in the brief and the reply. Reminded, the operator closed it as `wontfix` within the hour: "now that you reminded me that page only allows "read and never write"". It cost an issue, a brief, a docs PR (#1027) and its partial revert (#1028).

**How to apply:** in triage step 2 (Recommend), name the rule, where it is recorded and what the request would reverse, then wait for the answer before labelling. That rule is now `DEC-PEOPLE-READ-ONLY`. A rejected enhancement in this repo is recorded in `recorded-decisions.md`, not in the skill's `.out-of-scope/` folder (`FOLDER-STRUCTURE.md` forbids new top-level folders).

**Worked, 2026-10-06 (#1050):** the standing rule can live only in a CODE COMMENT. #912's D2 ("the same set-password email") was recorded nowhere in `docs/`; the redundancy check found it in the Events apply module's header ("ACCOUNTS COME FROM THE EXISTING PIPELINE, UNCHANGED (D2)"). So grep the touched module's header comment, not just `recorded-decisions.md`. The operator was away, so the issue was filed `needs-triage` with the brief already posted; their answer (reverse D2) was then a relabel plus `DEC-EVENTS-APPLICANT-SET-PASSWORD`.

**Worked, 2026-10-07 (#1052): the reversal can be in MY OWN recommendation, not the request.** Asked who may open a new `/admin/meetings` area, I offered "Edge8 only (master admins)" as the RECOMMENDED option before grepping `recorded-decisions.md`; `DEC-ROLE-PARITY` forbids any master-only gate outside `/admin/accounts`. The operator happened not to answer, so nothing shipped on it. Grep the DEC catalogue BEFORE writing the options of an `AskUserQuestion`, not only before labelling. Read the rule's exact words too: DEC-ROLE-PARITY forbids a master-ONLY gate, not every narrower audience (a reviewer caught me overstating it).
