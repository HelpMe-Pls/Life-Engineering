---
name: next-types-validator-stale-after-branch-switch
description: "typecheck fails on a route that doesn't exist on the current branch — stale .next generated validator, not a real error"
metadata: 
  node_type: memory
  type: project
  originSessionId: 0b818aa6-645a-4959-8064-84df187071b4
  modified: 2026-08-16T01:09:58.521Z
---

Switching between branches that add/remove App Router routes leaves Next 16's generated route validator behind, so `npm run typecheck` fails on a page that isn't on the current branch at all:

```
.next/dev/types/validator.ts(89,39): error TS2307: Cannot find module '../../../app/admin/altai-sync-prototype/page.js'
.next/types/validator.ts(89,39): error TS2307: ...
```

**Not a real type error — nothing in `website/` references it.** `tsconfig.json` includes `.next/**/*.ts`, and the validator is regenerated only by a dev/build run, so `tsc --noEmit` alone keeps reading the old one.

Fix: `rm -rf .next/types .next/dev/types` from `website/`, then re-run. (No need to nuke all of `.next`.) Note there are **two** copies — `.next/types` and `.next/dev/types` — and deleting only one leaves the error.

Expect this every time work hops between prototype branches (`proto/admin-altai-sync`, `proto/admin-notifications`, …), since each adds a throwaway route the others don't have. Rule out this cause before believing a typecheck failure on a route path you didn't touch.

---

**(2026-08-16) THE SAME SHARED-STATE HAZARD, THE OTHER DIRECTION: `npm run build` KILLS A LIVE `next dev`.** `.next/` is one mutable directory and both commands own it. Running the merge gate (which ends in `npm run build`) while a dev server is serving the operator's walkthrough overwrote `.next` underneath it; the dev worker pool then died and every route rendered:

```
Runtime Error: Jest worker encountered 2 child process exceptions, exceeding retry limit
```

⚠ **The tell is in the overlay's corner — `Next.js 16.2.12 (stale)`.** It is NOT an app bug and not a test-runner bug despite the word "Jest" (that is Next's own `jest-worker` render pool, unrelated to Jest-the-framework; this repo runs Vitest).

**Fix:** stop the dev server, `rm -rf .next` from `website/` (gitignored at `website/.gitignore:24`), restart. Recompiles in ~8s.

**Avoid:** never run the gate, `npm run build`, or the E2E suite (its `playwright.config.ts` webServer does `npm run build && npm run start`) while a `next dev` the operator is using is live. Either stop it first, or accept that you will have to restart it. ⚠ The dev server keeps answering `200` on already-compiled routes for a while after the clobber, so **a curl to `/` is not evidence it survived** — request a route that has to compile fresh.

⚠ **Restarting also makes the dev server's OWN log the best verifier available:** after a restart the operator's still-cookied browser re-requests, so a real signed-in `GET /admin/chapters/<id> 200` shows up in it. That beats an unauthenticated curl, which only ever proves the module graph compiled.
