---
name: gate-speed-vs-action-minutes
description: "Two operator constraints on the #704 gate work that pull against each other — merge→prod under 2 min, and minimum billed Action minutes"
metadata: 
  node_type: memory
  type: project
  originSessionId: 52df529f-f6ac-49e0-bce4-3505f1052d0a
  modified: 2026-08-28T03:47:11.424Z
---

Two operator constraints on the [#704] gate-speed effort, both stated 2026-08-27, and they are **not** the same constraint:

1. **Merge → prod under 2 minutes, and a broken deploy is acceptable.** Verbatim: _"It doesn't matter if it's broken at the deployment moment or not, because that's gonna be taken care of by the nightly job."_ A short-tempered contributor seeing their work live beats a red caught before the button.
2. **Minimize billed Action minutes.** `global-hubspot` is the org's top consumer (2,499 of 3,000 included minutes used in the month to 2026-08-27; $8.14 gross vs `altai-hubspot-sync` $5.29 and `eo-vietnam` $1.66).

**Why they pull against each other:** parallel jobs cut WALL time and MULTIPLY billed minutes — every extra job pays its own checkout + `npm ci` setup, and GitHub bills the sum, not the max. #707's brief says "the fast half in parallel jobs"; one job may well already be under 2 minutes AND cheaper. Measure before splitting, and treat a split that costs minutes as a fork to put to the operator.

Same trap on the other side: a nightly full run is ~12 min × 30 = ~360 min/month against a 3,000-min allowance. The nightly is the agreed cover for (1), so the question is its SCHEDULE, not its existence.

**How to apply:** when sizing any CI change here, state both numbers — wall time and billed minutes — never just the fast one. **Why:** the whole reason the old gate was cut (DEC-LOCAL-GATE) was minutes, and re-spending them to buy wall time would undo it without anybody noticing.

## Where it landed, and the model that predicted it (measured 2026-08-27)

**11 min 57 s / ~26 billed → 1 min 49 s / 9 billed** (run `33069190091`), in four legs: static checks 77 s, build 75 s, two Vitest shards 105 s / 97 s, aggregate 2 s. Every leg pays **~28 s of checkout + `npm ci`**, which is what makes "more legs" stop paying.

**The model, and it was accurate to 2 seconds:** `CI wall ≈ (sum of Vitest's per-phase worker-CPU seconds) / vCPU`. Locally the fast half is 550 s of worker-work; a 4-vCPU `ubuntu-latest` turned that into 139 s, and 550/4 = 137. So a shard can be **priced before it is pushed** — run `--shard=i/n` locally, add up the duration line's phases, divide by 4.

**Split only the leg that BINDS.** Parallelism buys nothing past the longest leg. The five-leg shape (a runner each for format/typecheck/lint) was priced at **zero** wall gain — those three total 42 s in one leg — for one more billed minute. A third Vitest shard re-pays Vitest's fixed per-run cost (602 s of work vs 548 s) to save ~5 s for **two** more billed minutes. Two shards balanced to 4 s of each other **by file count alone**.

⚠ **`--shard=1/2` alone is a green run over half the files** and looks identical to a correct gate. Assert the shard set is complete (numerators = 1..N) with a non-vacuity floor — removing sharding entirely is safe, and a guard that cannot tell those apart is not a guard.

## The other half of the clock: merge → live is ~60 s, and it is measurable without Vercel

The operator's constraint is what a contributor experiences, so the gate is only half the number. **Merge → production live measured 57 / 60 / 60 / 67 s** across the last four promotions (`1db2ef4`, `c1083b9`, `e4dd55a`, `57dc082`, read 2026-08-28). So the full path is **gate 1 m 49 s + deploy ~60 s ≈ 2 m 49 s**.

**How to measure it with no Vercel access**, since the CLI/MCP are read-only here and the dashboard is a human step: compare the **merge commit's `%cI`** to the **`created_at` of the GitHub Deployment record** — `gh api "repos/{o}/{r}/deployments?environment=Production"`. ⚠ **Do not use the deployment's `statuses` endpoint**: Vercel records only the terminal `success`, at essentially the same second, so a status-to-status delta reads as 0 and looks like an instant deploy.

**How to apply:** when asked whether a change makes the pipeline slower, separate the two halves — a change that adds no static pages and imports no new file (a `force-dynamic` route reading a traced folder, e.g. `/demo`) adds **zero** to either half, and the count of statically generated pages in the `next build` output is the check that proves it.

Related: [[action-minutes-read-billing-usage-not-timing]], [[open-promotion-pr-taxes-every-dev-push]], [[policy-guardrails-this-repo]].
