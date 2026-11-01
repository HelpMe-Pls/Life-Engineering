---
name: altai-parity-gate-offset-must-be-measured
description: "The All Members red \"Short — needs a look\" was a stale hand-maintained constant, not a regression — diagnose parity alarms by trending the gate delta, and beware three traps this uncovered"
metadata: 
  node_type: memory
  type: project
  originSessionId: 5b2f3002-2505-49e4-9fe9-7b391b338943
  modified: 2026-07-28T04:49:38.812Z
---

2026-07-28: `/admin/altai-sync` showed All Members red. **False alarm — producer-side. Fixed and
merged: altai-hubspot-sync #19 (measured floor) + #20 (per-segment allowance).** Consumer unchanged
except docs; folded into [[stalled-queue1-variantA-pr319]]-style promotion PR #357.

**Cause.** The gate held HubSpot to `altaiLive − KNOWN_UNSYNCABLE_ALLMEMBERS`, a hand-set `5` from
2026-06, while the run measured **11** (`dataQuality.total` + `conflicts.total`). Now
`max(declared, measured)`, and the allowance is 1 record per thousand of target (floor 1) instead of
a flat ±5 — which was 12.2% of APAC (41) and 0.024% of All Members (20,527).

**The diagnostic move — trend the delta, don't read one run.** Nightly deltas ran `-3, -4, -4, -6`
against ±5: *a constant decaying into a cliff, not a regression.* One row looks like a real
shortfall; the trend proves it isn't.

## Three traps this uncovered — all still live elsewhere

1. **⚠ NEVER run the sync workflow with `dry_run=true`.** `buildAndPushHealth` has no dry-run guard,
   but `applyContactResolution` returns before any write — so rejects measure 0, the floor collapses
   to conflicts alone, and the page goes RED again. The page always renders the newest row.
2. **The workflow passes an explicit env ALLOWLIST.** A knob absent from it is unreachable in prod no
   matter what `config.ts` defaults to. Five count knobs were missing, which silently made two
   documented instructions impossible ("set `KNOWN_UNSYNCABLE_ALLMEMBERS` to 0…", "tune the wait…").
   **Check the allowlist before believing any env var is tunable.**
3. **Vacuous config tests.** `src/config.ts` does `import 'dotenv/config'` AND `loadConfig` memoises,
   so "defaults when unset" cases were testing whether the machine has a `.env` (green in CI, red
   locally) and were order-dependent. Fix = `vi.mock('dotenv/config')` + `vi.resetModules()` per case.
   Same shape as the non-vacuous-test rule in [[supabase-rls-read-path-traps]].

## Where the data lives (no Supabase MCP needed — see [[supabase-mcp-oauth-broken]])

- `altai-hubspot-sync/reports/run-*-validate.json` — counts, target, offset, evaluation. Offline.
- Live rows: throwaway tsx in `website/scripts/` + `dotenv` on `website/.env` + service-role client →
  `sync_health` by `finished_at`. **Print counts only** — those rows carry member emails
  ([[altai-sync-producer-contract-discipline]]).

## Standing

- The nightly gate **deliberately diverges** from `validate` (which writes nothing, so measures
  nothing). *When they disagree, the difference is the worklist.* Don't "fix" it.
- Records that vanish *without* being rejected or conflicted still blow the threshold — the gate
  keeps its teeth.
- Adversarial review earns its keep: 4 rounds found **4 separate false claims the branch itself
  wrote**, plus a composition that no test covered (reverting the gate left all 242 green). Mutation-
  check a "composition" test by breaking the thing it claims to cover.
- `gh` flipped to `HelpMe-Pls` mid-session again → `gh auth switch --user Kh0iLe`
  ([[gh-account-kh0ile-env-token]]).
