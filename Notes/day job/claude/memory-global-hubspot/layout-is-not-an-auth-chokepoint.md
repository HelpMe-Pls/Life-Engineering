---
name: layout-is-not-an-auth-chokepoint
description: "A Next layout persists across client-side navigations so its guard does NOT re-run — yet on a HARD nav it renders FIRST and its redirect WINS. Both halves are load-bearing: every route must self-guard, and the layout must not own a bounce it cannot describe"
metadata:
  node_type: memory
  type: project
  originSessionId: 0fcbd5aa-c1b1-4a2f-906a-38f5821d6da0
  modified: 2026-08-23T06:28:54.516Z
---

**A Next.js layout is NOT an auth chokepoint.** It persists across client-side navigations, so a clicked link re-renders only the *page* segment and the layout's `requireAdmin()` never re-runs. **Every guarded route segment must call a guard itself.**

**Why:** `/admin`'s guard lived only in `app/admin/layout.tsx` and four pages relied on it — one with a comment saying an in-page guard was omitted *on purpose*. A removed admin could keep clicking between `/admin/*` routes; only a refresh or leaving the segment bounced them. Fixed in #446 (2026-08-03), one day after #445 fixed the revocation logic itself and left this half open.

## ⚠ THE OTHER HALF, measured 2026-08-23 (#616): on a HARD nav the layout renders FIRST, so its redirect WINS

The two facts sound contradictory and are not. A layout is **unreliable** (skipped on client-side navs) *and* **first** (rendered before its page on a full load, because React awaits the layout's own body before it reaches `children`). So:

- it can never be the thing that *stops* someone, **and**
- it is always the thing that *answers* on a deep link.

That combination broke #616 silently. `requireAdmin()` in the layout was the redirect that actually fired for every pasted URL — and a layout is precisely the caller that **cannot name its own pathname** ([[next16-gives-server-components-no-pathname]]). Every deep link therefore landed on a bare `/login` and the page's carefully-passed destination never mattered. **The E2E caught it; reasoning had not** — the unit tests all passed, because no unit test can see which of two guards renders first.

**The fix pattern:** the layout DEFERS ONLY the unauthenticated case to the page (`guardAdminShell` / `guardChapterShell` in `lib/auth/guards.ts` return `null` instead of redirecting) and keeps every other bounce — wrong role, `/update-password`. The caller must then `return <>{children}</>` on a null, so an unauthenticated request does no work and paints no chrome before the page's own redirect replaces the whole response.

⚠ **That removes a runtime backstop, so it needs a runtime replacement, not an argument.** The seam test proves *statically* that every route self-guards; a new E2E walks all five guarded routes anonymously and watches each one bounce **and name itself**. Do not put a redirect back into those layouts.

**How to apply:**
- **`page.goto()` in a Playwright test is a HARD navigation — it re-renders the layout and PASSES with the hole wide open.** A revocation/authorization test must **click a real nav link**. This is how #445 shipped believing it was done. To bounce a *clicked* nav without waiting an hour for a token to expire, `page.context().clearCookies()` then click.
- Enforced by `tests/admin-route-guard-seam.test.ts` (walks `app/admin` + `app/portal` for `page.tsx`/`route.ts`). Since #616 it asserts **two** things: an awaited `requireX(...)` call, *and* that the path handed over matches the route's own **filesystem** location — two independent sources, so a page copying its neighbour's literal fails. ⚠ Its matcher used to require **literally empty parens**, which made the zero-arg signature load-bearing; giving a guard a parameter turned it blind and reported every page as unguarded.
- **Auditing a security invariant by grep counts COMMENTS as coverage** — the one unguarded page mentioned `requireAdmin()` in prose and the first audit pass called it compliant. Match an awaited *call*, strip comments first, and give the matcher its own test on synthetic input.
- `resolveRole()` is `cache()`-wrapped, so the layout's call and the page's call share one resolution — a self-guarding page costs nothing on a full load.
- **Rejected: `app/admin/template.tsx`.** It would be one file instead of four and does re-run per navigation, but a template remounts the page subtree, and the tracker drives filters through URL params — it risks silently discarding client state.

Related: [[verified-token-proves-who-not-what-they-may-do]] (the same bug's first half), [[next16-gives-server-components-no-pathname]], [[test-suite-clean-minimal-standard]], [[shared-helper-contract-belongs-at-its-own-seam]].
