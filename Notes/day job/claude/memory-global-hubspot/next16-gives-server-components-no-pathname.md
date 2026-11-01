---
name: next16-gives-server-components-no-pathname
description: "Next 16 documents NO way for a server component to read its own pathname — but an interceptor DOES exist here (website/proxy.ts, and NextRequest has nextUrl.pathname), so the ban on using it is the TICKET's, not a technical limit. DEC-BOUNCE-PATH answered A and shipped: guards take the path"
metadata:
  node_type: memory
  type: project
  originSessionId: 1bd16e29-2985-4823-a18e-dc44185afb26
  modified: 2026-08-23T06:29:20.214Z
---

Measured 2026-08-23 against the bundled docs (`website/node_modules/next/dist/docs/`), which `website/AGENTS.md` requires reading first:

- `01-app/03-api-reference/03-file-conventions/layout.md` — *"Layouts do not re-render on navigation, so they do not access pathname which would otherwise become stale"*, and points to **`usePathname` in a Client Component**.
- `01-app/02-guides/authentication.md` — solves exactly the bounce-and-return problem with an interceptor (`req.nextUrl.pathname`).

## ⚠ TWO CORRECTIONS to what I first wrote here

**1. "This repo has no middleware" is FALSE as stated.** Next 16 renamed the convention — the bundled docs ship `03-file-conventions/proxy.md` — and **`website/proxy.ts` exists**, running on every matched request to refresh the Supabase session cookie via `updateSession`. So `NextRequest.nextUrl.pathname` *is* reachable here, and stamping the path into a header was a genuinely available shortcut. What rules it out is **#616's instruction** ("Do not introduce a middleware to centralise it"), not impossibility. Do not write "there is no middleware here" again — say "the interceptor exists and deliberately knows nothing about authorization".

   A guard test now pins that: `tests/post-login-destination.test.ts` asserts `proxy.ts` still contains `updateSession` (positive control) and does **not** reference the guards, the destination chain, `/login`, or `next=`. ⚠ Any check for "no interceptor" must cover **both** filenames — `middleware.ts` is the old spelling, and a check on that name alone waves a `proxy.ts` straight through.

   The substantive reason to keep it out: behind a `matcher` regex, the feature degrades **silently** for any route the pattern misses, and a client-supplied `x-pathname` becomes something the app reads.

**2. The blocking problem was not the pathname — it was WHICH GUARD FIRES.** On a hard navigation the layout renders before its page, so the layout's `requireAdmin()` was the redirect that actually fired, and a layout is the one caller that cannot name its path. Every deep link landed on a bare `/login`. **Only the E2E found this**; every unit test passed. Full account in [[layout-is-not-an-auth-chokepoint]].

## The resolution — DEC-BOUNCE-PATH = A, shipped

Guards take the path explicitly: `requireAdmin('/admin/settings')`, and `` requireAdmin(`/admin/chapters/${id}`) `` for the dynamic route. `lib/auth/post-login-destination.ts` owns the chain (explicit destination → role home; #617 inserts the remembered page) and re-checks the destination against the **current** role at sign-in, never at bounce time.

**Two measurements that sized it, both confirmed:**

- **75 guard calls across 29 files, but only 9 are real bounce points** (pages / layouts / route handlers) — of which the layout cannot answer and two `app/api/**` handlers should not (redirecting a `fetch` puts nobody in front of a form). Net: **6 static page call sites + 1 dynamic**. The rest are server actions with no page to return to.
- The seam test's empty-parens matcher was load-bearing, and rewriting it was the right move rather than a cost — it now compares each route's literal against its **filesystem** path.

⚠ **`safeInternalRedirect` (`lib/auth/internal-redirect.ts`, #612) still rejects a query string and a fragment on purpose.** A remembered page carrying board filters needs the helper EXTENDED with tests, never a looser check at a call site.

⚠ **The role rules are the guards' knowledge written twice**, unavoidably (#616 forbids letting a guard bounce them again). Expressed as three prefix rules — `/portal*` → chapter, `/admin/accounts` → master_admin, `/admin*` → admin — so a new page is covered on the SAFE side, and kept honest by a test that reads which guard each route file actually calls.

Related: [[verified-token-proves-who-not-what-they-may-do]], [[shared-helper-contract-belongs-at-its-own-seam]], [[recurring-bug-class-needs-enumeration]].
