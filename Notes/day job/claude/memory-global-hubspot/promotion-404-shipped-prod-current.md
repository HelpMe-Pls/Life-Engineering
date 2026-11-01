---
name: promotion-404-shipped-prod-current
description: "What promotion #404 (2026-07-28, 430a6b1) put into prod — DEC-TERM prospect copy, altai-sync gate rendering, row-override store, intake allowlist, Next 16.2.12 — plus the post-promotion doc-sweep lesson. NOT the current-prod pointer: #411 came after, and next-steps.md owns that"
metadata: 
  node_type: memory
  type: project
  originSessionId: 58f63850-aab2-474f-8edd-978da709ebb9
  modified: 2026-08-10T12:21:13.314Z
---

⚠ **THIS IS NOT THE CURRENT-PROD POINTER — do not read the headline as today's state.** Promotion **#411** followed on 2026-07-30 (`b784466`: the object map's plain-text list naming its systems, and the landing page dropping the CSV promise for ".xlsx"). **`next-steps.md` → Status owns "what prod has"; a memory cannot, because every promotion falsifies it — which is this file's own lesson, below.** Kept for what #404 contained and for that lesson.

**Promotion [#404] merged 2026-07-28 12:51:54Z, merge commit `430a6b1`, 44 commits.** `main` and `dev` both intact — merge commit, never squash, never `--delete-branch`.

What reached production with it, i.e. what is NO LONGER "on dev only":
- **DEC-TERM copy** (#397) — Hero, the three portal cards, `/privacy`, and the Welcome / StageChange / SignupRequestApproved emails all say "prospect(s)". Verified live. `StageOverview`'s *"Members get their welcome email"* is deliberately NOT part of it (CONTEXT.md reserves "member" for EO members as people).
- **`/admin/altai-sync` renders the producer's gate** (#400) — *"11 could not be copied · allowed to be out by 21"*. The producer's counterpart (#21) was already live, so this closed a cross-repo pair.
- **The row-override store** (#398) — `lib/use-row-overrides.ts`.
- **Intake hardening** — a storage-key ALLOWLIST (#395 + #405, see [[url-normalises-encoded-dot-segments]]) and `server-only` on the xlsx validator (#396, see [[server-only-means-rsc-graph-not-server]]).
- **Next `16.2.6` → `16.2.12`** (#393). ⚠ **Do not read the version as evidence the dropped post-`revalidatePath` navigation is fixed** — it was the measurement, and the answer was no (13/108 vs 11/108). Reverting it now would be its own prod-affecting promotion.
- `scripts/smoke-upload.ts` retired; the review of the promotion itself (#405/#407) and docs passes (#399–#403, #406, #408).

**Verification actually performed** (do not accept less next time): served-bytes marker flipped `member data` → `prospect data` ~75 s after merge · deployed public smoke 4/4 · seven public routes 200 · `X-Frame-Options: DENY` + `frame-ancestors 'none'` still set · all eight referenced issues already closed, so no auto-close was needed (none of the promoted commits used a closing keyword anyway).

**The lesson that generalises, and it cost four reviewers to find:** a promotion falsifies the handoff doc it was described in. #404's own `next-steps.md` was rewritten hours *before* the merge, so its banner, queue line, promotion paragraph, Next-bump warning, prod-carries line and DEC-TERM marker were all wrong the moment it landed — plus three claims OUTSIDE that file that nobody thought to check (`README.md`'s front-door one-liner and two stops in `docs/architecture/codebase-onboarding.md` still said "member spreadsheet", contradicting the shipped rename). **After any promotion, sweep for statements about what prod does or does not have, and do not restrict the sweep to next-steps.md.** Also: write those lines so they do not assert a commit count — the close-out commit itself makes `main..dev` non-zero again.

**The same rot hits the PROMOTION PR ITSELF, and its title, not just the docs** (measured on #477, 2026-08-10, during three rounds of review that kept growing the range): its body listed 5 of what became 17 commits and quoted a superseded gate figure; its title said "four /admin/altai-sync changes", then "two rounds of review" after there were three. Rewrite the body **and** the title after anything lands on `dev`, open with a line saying it is a snapshot plus the command to enumerate the range, and never write a count that the next merge invalidates ("7 of the 16 commits" → "seven commits"). ⚠ **And never predict the next PR number** — a parallel session takes it. Writing `#478` into `next-steps.md` produced `#479`; the fix is to open the PR first, read the number `gh` returns, then write it (#484 and #485 were both verified that way).

Related: [[deployed-smoke-baseurl-and-prod-marker]] (the CSS-marker recipe fails when `globals.css` is not in the diff — #404 is the worked case), [[promotion-merge-convention]], [[altai-sync-producer-contract-discipline]].
