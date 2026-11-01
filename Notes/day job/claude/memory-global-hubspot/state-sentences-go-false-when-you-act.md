---
name: state-sentences-go-false-when-you-act
description: "A sentence describing branch/PR state goes false the moment you act on it — re-read the handoff doc AFTER every merge, delete or push; and every next-steps edit is MINIMAL (operator stressed it 2026-09-27 and again 2026-10-06: Prod line = number + sha + date, no what-shipped, no counts)"
metadata:
  node_type: memory
  type: feedback
  originSessionId: f33e2f03-4bb6-4391-b361-3adc3cf4a1e7
  modified: 2026-10-26T15:14:24.475Z
---

**Any sentence that describes the CURRENT state of a branch, a PR or a deployment is a claim with an expiry date, and the action you are about to take is usually what expires it.** Re-read the handoff doc **after** the merge/delete/push, and grep it for the thing you just changed.

**Measured 2026-09-05, and this is why it is written down.** In one session I wrote `⚠ **`wip` is therefore NOT stale and NOT deleted.**` into `docs/plans/next-steps.md`, then merged the PR and deleted `wip` **one commit later** — while that same session was explicitly auditing the file for sentences that had quietly gone false. Two others in the same session: `It sits level with `dev`` was false when written (the previous commit had already moved HEAD), and `the close-out PR is opened from it` described a PR that did not exist yet.

**Why knowing the failure mode is not protection:** all three were written BY the pass that was hunting for exactly this class. Vigilance does not catch it; a re-read after the action does.

**How to apply:**
- After any merge, branch delete, or push, grep the spine for the branch name, the PR number, and words like "open", "not deleted", "level with", "is opened".
- Prefer wording that survives the action: "`wip` is deleted when THAT merges" (an instruction) outlives "`wip` is NOT deleted" (a state).
- Write state as a POINTER, never a copy — `git log --oneline main..dev`, `gh pr view N --json state` — which is the same rule as [[changing-an-invariant-means-grepping-the-sentence]] and the spine's own "never carry a count you did not just count".
- A settled paragraph does not get a retraction appended; it collapses. "Settled means gone, the same session it settles."
- **A closed ▶ step is DELETED, not rewritten as a "done (#N): …" paragraph** — broken again 2026-09-27: I closed ▶ step 4 (connector spec, #1015) by rewriting it into a done-line record plus a "Step 4's done line holds" lead-in, and added 🧑/⚡ bullets that restated the spec. Operator: _"it's ABSOLUTELY CRITICAL that you keep the next-steps.md MINIMAL and CURRENT as you go"_. Fix: delete the step (keep later step numbers — ▶ 5.3 is cited from outside), and every added line = the open action + a pointer into the doc that records it, nothing the pointed-at doc already says. "As you go" = on every edit, not in an end-of-session sweep.
- **Broken a THIRD time, 2026-10-06**, after promotion #1048: my first draft of the Prod line listed what the promotion shipped, the Suites line carried file and test counts plus which specs ran, and the Events 🧑 bullets still held the dry-run undo, the self-check results and the scope change. Operator, mid-turn: _"It is ABSOLUTELY CRITICAL that you keep the @docs/plans/next-steps.md MINIMUM and up-to-date"_. The minimal shapes: **Prod** = number, merge sha, date (what shipped is `git log`); **Suites** = date + "0 failed, 0 skipped"; a 🧑 bullet = the open action, its owner and date, a pointer. Draft it minimal BEFORE the commit; trimming afterwards cost a second commit and gate run.
- **2026-10-12 (#1090): the Prod line became a LOOKUP**, `git log -1 --format="%h %ad %s" --date=short origin/main`, after the operator asked for the spine "CURRENT and kept to its ABSOLUTE MINIMUM before promoting". A pointer cannot go stale at the promotion, so no post-promotion "prod is #N" docs PR is needed any more. Keep it a pointer; only the schema level (no repo record) stays a dated number.
- **2026-10-26, after promotion #1163:** I deleted my own checked-off ⚡ line but left #1160's, which an earlier session had shipped in #1161 and never removed. Operator: _"Why this line is still in the spine? Pls make sure that it's minimal and up-to-date"_. At every promotion, drop EVERY checked-off ⚡ line already on `main`, not only mine, and re-check the Suites line against `gh run list` (cite the newest full run as date + "0 failed, 0 skipped", no counts).

Related: [[settled-decision-must-be-unsaid-in-both-places]], [[next-steps-parallel-edits-sync-first]], [[check-off-acceptance-criteria-before-closing]].
