---
name: changing-an-invariant-means-grepping-the-sentence
description: "After changing a rule, grep the SENTENCE that stated the old one across the whole tree — a recorded count of how many places said it becomes the next session's search boundary"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: dd0580fc-e773-4808-aa7c-f4ba9ede96a6
  modified: 2026-09-04T10:26:12.710Z
---

**The single most repeated mistake of the #839 review: fixing the code, correcting the comments I happened to be looking at, and stopping.** Six rounds, and **every round found its worst defect inside the previous round's own fix** — usually not broken code but an explanation that had silently stopped being true.

**Why:** After changing an invariant, the diff is the wrong search surface. The old rule was written down in files the change never touches — a module header, an exported type's JSDoc, a test double, a sibling component, `CONTEXT.md`, and operator-executable SQL parked in `docs/plans/next-steps.md`. Every one of those is read BEFORE the code by someone deciding whether the new gate is necessary.

⚠ **And the specific trap that cost the most: recording a COUNT.** Round 6 wrote "three comments across `decide.ts` and `account-setup.ts` said an invite link is rejected for an existing user" and fixed three. Grepping the *sentence* found **six**, including the module header of the very file being fixed and the exported `mode` JSDoc that every call site hovers. A further pass found **ten**. The tally became the search. This is the same disease as [[report-that-names-its-own-fix-must-be-measured]] and the repo's own "no line counts in CLAUDE.md" rule.

**How to apply — after any invariant change:**

1. Write down the OLD rule as a literal sentence fragment ("is rejected for an existing", "always newer than the account", "only onto an account it just provisioned").
2. `grep -rn` that fragment and 2–3 paraphrases of it over `website/lib`, `website/app`, `website/tests`, `website/scripts`, `website/supabase`, `CONTEXT.md`, `docs/plans/next-steps.md` — and `.claude/` explicitly, because [[grep-tool-skips-dot-claude]].
3. Fix every hit or say why it stays. **Never record how many there were** — record the grep.
4. Check the exported TYPE's docstring specifically. It is the published contract, it is what an editor hovers, and it is the last place anyone looks.
5. Check the test DOUBLES: a fake that encodes the retired behaviour makes every mocked test in that file reason about a system that does not exist.

Prefer replacing an inference with a **constraint the database checks** — then the sentence cannot go stale behind you. See [[gotrue-invite-does-not-bounce-an-unconfirmed-account]] and [[status-word-is-not-evidence-tie-to-origin]].

## ⚠ THE RULE ABOVE WAS NOT ENOUGH — measured one round later, in the fix for it

Round 7 replaced the count with a grep and still missed sites. Round 8 found two more,
both the SAME disease wearing a different coat:

- **An ELEVENTH site, missed because I varied the paraphrase but not the VERB.** I grepped
  `rejects an invite`, `is rejected for`, `rejected by`. The surviving line said
  **"refuses an invite link for an existing user"**. Grep the CLAIM across synonyms of its
  verb — reject / refuse / bounce / block / disallow / error / 422 — or grep a distinctive
  NOUN phrase that no paraphrase can drop ("invite link", "existing user") and read every hit.
- **The replacement enumeration asserted its own completeness by counting.** I wrote
  "NO CALLER MAY TREAT A NULL ANSWER AS PROOF … AND **THREE** OF THEM DO" and listed three.
  There were five — two more in `submit.ts`, one of them a takeover gate whose backstop
  reads the same function, so a single failure mode disarms both. **Never write "N of them"
  in a list a reader will act on.** Write "every caller below does", and put the command that
  re-derives the list next to it. The operator-facing fork inherited the wrong count too, so
  the fix for a count became a new count in two places at once.

**The compressed rule: a count is a claim about a search, and it is the only kind of claim
that stops the next person searching.** Same family as [[report-that-names-its-own-fix-must-be-measured]]
and the repo's own no-line-counts rule in CLAUDE.md.
