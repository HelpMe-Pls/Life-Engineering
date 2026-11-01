---
name: turbopack-traces-whole-project-on-slug-read
description: A readFile whose path Turbopack can follow back to a request slug makes it trace the WHOLE project into the route; the build only warns, so the gate stays green — count .nft.json files
metadata:
  type: feedback
---

On 2026-10-08 (#1068) inlining `fs.readFile(path.join(dir, filename))` into `meetingSummaryResponse`, where `filename` came from the visitor's slug through a now-PRIVATE resolver, made `next build` (Turbopack) trace the whole project into BOTH Meetings routes: 1,295 / 1,385 files instead of 251 / 341 (app source, `supabase/migrations`, `e2e/tests`…). The only signal was a build WARNING, `Encountered unexpected file in NFT list`, so the pre-push gate passed.

**Why:** the tracer follows module-private call chains; once the path is partly known (slug → `${slug}.html`) but unbounded, it falls back to the project. An exported helper, or a read in its own function taking `filename` as a parameter, is opaque to it.

**How to apply:**
- After touching any route that reads files, grep the build log for `NFT list` and count `.next/server/app/<route>.js.nft.json` files (healthy here: /demo 142, ERD 252, Meetings 251/341). A small script grouping `files` by top folder shows the leak at once.
- Fix by keeping the read in its own function (measured). `turbopackIgnore` comments on the folder constant or on each fs call's argument did NOT help (measured three ways).
- Build in a SEPARATE worktree (`git worktree add` + `npm ci`, no `.env` needed for `next build`) when a review server runs from the main tree: a build there overwrites its `.next`.

Related: [[backgrounded-server-epipe-kills-render-worker]], [[minimal-gate-is-the-wanted-state]].
