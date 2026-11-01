---
name: guard-root-narrower-than-surface
description: A guard whose ROOT is a folder while the thing it protects is a render graph reports full coverage over a subset — and is green the whole time
metadata: 
  node_type: memory
  type: project
  originSessionId: 378df544-efa5-4ef0-9fc5-ad75d4da69f4
  modified: 2026-08-14T21:22:01.324Z
---

Found 2026-08-15 reviewing promotion #532 in global-hubspot. `tests/portal-theme-coverage.test.ts` promised *"whatever a themed segment writes, the remap list has an entry for"* and scanned `app/portal` — **a folder**. Since #519 the portal's header mounts `components/account/*` and its page mounts `components/NotificationsBell.tsx`, so two unremapped literals sat in a themed segment, unreviewed, with the suite green.

**The tell: the guard's root is a path, and the thing being protected is a graph.** Ask what the root leaves out before trusting a green run.

- **Fix by DERIVING the surface, not by adding a second root.** Adding `'components'` would over-report (admin-only components) and train the reader to ignore red. Follow the imports transitively from the segment's route files — same principle as reading the remap list out of `globals.css` rather than retyping it.
- **Add a non-vacuity case naming a file OUTSIDE the folder** that must be reached, plus one that must NOT be, or a broken resolver silently shrinks the scan back to green.
- ⚠ **Widening a scan MOVES every number measured under the old one.** `app/admin` went from "16 unremapped + 4 alpha" to 32 occurrences (13 distinct) + 8 (3 distinct) with nobody touching `/admin`. Re-measure; never quote.
- ⚠ **Scope a segment-specific non-vacuity case to that segment** — `it.each(SEGMENTS)` over portal-specific filenames breaks the day someone adds a second segment, for a reason unrelated to the bug.

Related: [[recurring-bug-class-needs-enumeration]], [[usage-block-makes-flag-assertions-vacuous]], [[shared-helper-contract-belongs-at-its-own-seam]].

⚠ **I DID THIS AGAIN ON 2026-09-11, IN A GUARD I WAS WRITING WHILE THIS MEMORY EXISTED.** `website/tests/source-has-no-nul-byte.test.ts` was named *"no NUL byte in any tracked source file"* and walked six subtrees of `website/` — 720 files. Outside it: the 24 root-level configs (`proxy.ts`, `next.config.ts`, `vitest.setup.ts`, `sentry.*.config.ts`), all 47 `supabase/migrations/*.sql`, `e2e-deployed/`, `diagrams/`, `docs/`. Four of the nine extensions in its own regex matched ZERO files. A reviewer found it; I had even written a comment in that file warning about this exact shape.

**The fix that generalises: when the claim is "every tracked X", the corpus must BE the tracked set — `git ls-files`, not a hand-kept folder list.** It cannot drift, it grows with the tree, and in this repo it also keeps `website/.env` out by construction (gitignored, so a content-reading guard cannot open it, where a `readdirSync` of the root would have).

**And the check that would have caught it in seconds: plant the offender OUTSIDE the narrowest root and watch.** Planting one NUL in `website/proxy.ts` left the old guard green and reds the new one by name. A corpus-size control (`length > N`) does NOT catch this — 720 files comfortably passed a 400 floor while missing four whole categories. Name the corners in the control instead: the new one asserts a root-level file, a migration, a repo-root doc, and the file that shipped the bug.

