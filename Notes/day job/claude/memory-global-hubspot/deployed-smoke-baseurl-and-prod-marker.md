---
name: deployed-smoke-baseurl-and-prod-marker
description: The dev→main promotion deployed-smoke needs BASE_URL set (else it hits localhost:5173 and fails); confirm the deploy is live by MATCHING the served ?dpl= id to the Vercel status on the merge commit — diff-independent, unlike the content markers that had nothing to grep twice
metadata: 
  node_type: memory
  type: reference
  originSessionId: 55fd3dff-9999-4374-9302-c8552fb14ef9
  modified: 2026-08-04T11:46:05.203Z
---

Post-promotion outage-guardrail steps (while `CI_BILLING_OUTAGE=1` makes the CI post-deploy smoke skip), verified working 2026-07-17 on promotion #315:

**1. Confirm the new prod deploy is LIVE (carries your code), not the old one.**

**⭐ DEFAULT (2026-08-04, promotions #443 + #460 — use this first): match the served `?dpl=` id to the Vercel status on the MERGE COMMIT.** Every `/_next` asset href carries `?dpl=dpl_…`, and the merge commit's commit-status names the deployment Vercel built for that sha. If they match, the bytes being served were built from *your* commit:

```bash
curl -s https://eochapterhubspotrollout.com | grep -o 'dpl_[A-Za-z0-9]*' | sort -u
env -u GH_TOKEN gh api repos/EO-Vietnam/global-hubspot/commits/<merge-sha>/status \
  --jq '.state, (.statuses[] | {context, target_url})'      # target_url ENDS in the dpl id
```

**Why this beats every marker: it needs nothing from your diff.** #443 touched neither public copy nor `globals.css`, so *both* documented marker recipes below had literally nothing to grep — and #460 was admin-only copy, same problem. The dpl id is always present. It also answers a question a marker cannot: comparing the id against the *previous* prod id proves only that **something** deployed, which is not the same as your commit deploying — matching it to the commit status is what closes that gap.

⚠ **Use `commits/<sha>/status`, NOT `deployments?sha=`.** The deployments query came back EMPTY for #404's merge commit (Vercel's git integration does not always create a deployment record); the commit-status endpoint returned the Vercel entry directly for #460, in one call instead of two.

The marker recipes below still have one advantage — they prove actual shipped *behaviour* rather than build provenance — so reach for them when the diff happens to carry a public copy change and you want that stronger claim. Both are FALLBACKS now.

⚠ **`curl` is USUALLY BLOCKED** — context-mode redirects `curl`/`wget` to stdout (it did on 2026-07-28 / promotion #357, though not on #315, so don't count on either). Don't fight it: use `ctx_execute` with `fetch`, which has full network access and keeps the body out of context:
```js
const html = await (await fetch(BASE + '/login')).text()
const css = [...new Set([...html.matchAll(/\/_next\/static\/chunks\/[^"'\s>]+\.css[^"'\s>]*/g)].map(m => m[0]))]
for (const h of css) console.log(h, (await (await fetch(BASE + h)).text()).includes('<your-marker>'))
```
⚠ The CSS lives under **`/_next/static/chunks/`** (Turbopack), NOT `/_next/static/css/` — a regex for the latter silently matches nothing and reads as "old build still served".

⚠ **A GitHub deployment record is not a finished build.** `gh api repos/<r>/deployments` shows the sha within seconds of the merge; check `…/deployments/<id>/statuses` for `success` AND still do the marker check — the marker is the only thing that proves the bytes being served are yours.
`globals.css` is loaded on EVERY page (public too), so a new CSS custom property (e.g. `--adm-bd-gray-300`, `--color-brand-on-primary`) is a reliable "is my code deployed" marker even for admin-only features. The `?dpl=dpl_...` query on the href is the Vercel deployment id.

⚠ **BUT THE CSS TRICK ONLY WORKS IF `globals.css` IS IN THE DIFF — and often it is not.** Promotion #404 (2026-07-28) touched 43 files and none of them was `globals.css`, so there was nothing to grep and the documented recipe had no marker to offer. **Prefer a user-facing COPY change on a public page whenever the diff has one** — it is strictly better evidence: it is the actual shipped behaviour rather than a proxy for it, it needs no auth, and it survives any bundler change. #404 carried the DEC-TERM rename, so the marker was one string on `/`:

```bash
curl -s "https://eochapterhubspotrollout.com/?cb=$i" | grep -oE "chapter&#x27;s (member|prospect) data"
```

Note the HTML entity — an apostrophe in JSX renders as `&#x27;`, so a grep for the plain `'` form silently matches nothing and reads as "old build". Poll it in a bounded loop: the flip happened **~75 s after the merge**, and the first poll at +49 s still served the OLD build — so a single early check would have reported a stale deploy and sent the session chasing a Vercel problem that did not exist. `curl` DID work this time (2026-07-28), so try it first and fall back to `ctx_execute` + `fetch`.

**(2026-07-30, promotion #411) The copy-marker recipe worked again and is now the default — but the DELAY VARIES, so the bounded poll is the load-bearing part.** #404 flipped at ~75 s (old build at +49 s); #411 flipped at **~30 s**, with the polls at +10 s and +20 s still serving old. So never conclude from one check, and never assume a fixed wait either. Pick a marker with **no apostrophe or quote** and the entity problem disappears — #411's was a plain heading, so a bare grep sufficed:
```bash
curl -s https://eochapterhubspotrollout.com | grep -o "From [a-zA-Z]* to go-live"   # "From CSV" -> "From spreadsheet"
```
Two extra checks that cost nothing once the marker flips, and together are what "verified live" should mean: assert the OLD strings are **gone** (`grep -c` → 0, catching a partial deploy that serves both) and re-confirm the app-wide invariants — 7/7 public routes 200, `X-Frame-Options: DENY` + `frame-ancestors 'none'`, `eoglobalhubspot.com` → 308. `curl` worked here too (third session running), so try it before `ctx_execute`.

**A GitHub deployments query can come back EMPTY** (`gh api repos/<r>/deployments?sha=<sha>` returned nothing for #404's merge commit) — Vercel's git integration does not always create one. That is not evidence of a failed deploy; the served-bytes marker is, and it is the only check worth blocking on.

**2. Run the deployed smoke — `BASE_URL` is REQUIRED.** `npm run test:e2e:deployed` (= `playwright test --config playwright.deployed.config.ts`) reads `process.env.BASE_URL`; if unset/empty it defaults to `http://localhost:5173` and all 4 tests fail with `ERR_CONNECTION_REFUSED`. Set it to the canonical domain:
```
cd website && BASE_URL=https://eochapterhubspotrollout.com npm run test:e2e:deployed   # → 4 passed
```
The 4 smoke tests are read-only public/protection checks (request-access renders, anon /admin+/portal gated to /login, /signup→/request-access) — no local Supabase needed.

Related: [[canonical-domain-eochapterhubspotrollout.com]], [[e2e-cicd-local-supabase-prod-safety]], [[local-browser-verify-recipe]].
