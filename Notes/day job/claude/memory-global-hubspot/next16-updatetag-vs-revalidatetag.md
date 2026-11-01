---
name: next16-updatetag-vs-revalidatetag
description: Next 16 split cache invalidation - revalidateTag is stale-while-revalidate and serves the OLD value to the very next reader; updateTag is the read-your-own-writes one
metadata: 
  node_type: memory
  type: reference
  originSessionId: 305aade5-04bb-4208-b126-4e7a1f184bcc
  modified: 2026-08-31T20:54:45.175Z
---

Next 16 has **three** cache invalidators and picking the wrong one looks correct in review, because the code still reads as "the tag is dropped".

- `revalidateTag(tag, profile)` — **stale-while-revalidate**. The stale entry is served to the NEXT reader while a fresh one builds behind it. Two args now; the second sets how long stale may be served (`'max'` = longest).
- `updateTag(tag)` — **immediate expiry**, read-your-own-writes. Server Actions ONLY: it throws `E872` in a route handler, guarded on `workStore.page.endsWith('/route')`.
- `revalidatePath(path)` — cannot reach an `unstable_cache` entry created on a *different* path. An `unstable_cache` is soft-tagged to its creating path, so `revalidatePath('/admin')` never evicts a cache built while rendering `/request-access`.

**Measured in `node_modules/next/dist/server/web/spec-extension/revalidate.js`**: both funnel into one `revalidate()` and the profile argument is the only difference — so single-arg `revalidateTag(tag)` behaves *identically* to `updateTag` and merely logs a deprecation warning on every call.

**Why it matters:** if the user just made an edit and must see it, `revalidateTag` is the bug, not the fix — they get the old value. Verified end to end in [[rsc-navigation-drops-so-server-prop-only-cells-go-stale]]-style E2E: warm the cache, write, then read as a fresh visitor. ⚠ **The warm-up read is part of the test** — without it the second read is a cache MISS that rebuilds from the database and passes whether or not the tag was dropped.

⚠ `unstable_cache` **persists to `.next/cache`**, so a warm entry survives a server restart AND `next build`. An E2E that asserts what the warm list *contains* will fail against an entry written before the test's own fixtures existed; assert only that something was stored, then that the write displaced it.

**How to apply:** prefer `updateTag` from a Server Action. Its price is a precondition — no route handler may reach it — so pin that on the IMPORT GRAPH of every `app/**/route.ts`, not on folders. In this repo that guard fired on its first real occasion (a route importing one function from a `'use server'` module made the whole module reachable), and the fix was to split the action into its own file. See `website/lib/signup-requests/public-chapters-cache.ts` and `tests/public-chapters-cache-tag.test.ts`.
