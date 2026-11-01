---
name: server-only-means-rsc-graph-not-server
description: "`import 'server-only'` means \"inside the RSC graph\", NOT \"on a server\"; `--conditions react-server` is not the escape, but patching Module._resolveFilename from an ESM preload IS"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 58f63850-aab2-474f-8edd-978da709ebb9
  modified: 2026-07-28T11:56:35.119Z
---

The `server-only` package (v0.0.1) is a marker whose whole behaviour is an export map:

```json
{ "exports": { ".": { "react-server": "./empty.js", "default": "./index.js" } } }
```

`index.js` is a bare `throw new Error("This module cannot be imported from a Client Component module…")`. So it resolves to a no-op **only** when the `react-server` condition is set — i.e. inside Next's RSC graph. **Plain Node does not set it, so `tsx` gets the throw.** Measured 2026-07-28.

**Why this bites:** a module named "server-only" reads as "safe anywhere on a server", and route handlers DO work (Next sets the condition for them — `app/api/intake/finalize/route.ts` imports the `server-only` `lib/notifications` in production). A `tsx` script under `website/scripts/` does not, and it fails at *import* time with a message about Client Components, which points nowhere near the real cause.

**The obvious escape is a dead end, also measured.** `tsx --conditions react-server` does resolve the module — and then `@react-email/render` throws *"react-dom/server is not supported in React Server Components"*. So a script that both validates (needs `lib/validation/intake`) and notifies (needs `lib/notifications`) cannot have both, under either condition set. That is what retired `website/scripts/smoke-upload.ts` (PR #405) — it had already been dead at step 8 via `lib/notifications`, and #396 adding `server-only` to the validator just moved the failure to step 5.

**How to apply:**
1. **Before adding `import 'server-only'` to a module, grep `scripts/` for importers.** The build will not tell you; nothing will, until someone runs the script.
2. The scripts that still work do so because everything they import is pure: `audit-ops.ts` → `lib/audit/ops` (whose header explicitly says "no `server-only`"), `backfill-*.ts` → `lib/rollout/backfill-plan`, `preflight-17.ts` → `lib/notifications/send` (not the `server-only` `index.ts`). All four create their own Supabase client rather than importing `lib/supabase/server`, which is `server-only`.
3. Under Vitest it is a non-issue: `vitest.config.ts` aliases `server-only` to `tests/_stubs/server-only.ts`.
4. If a dev/ops script's ground is already covered by suites the gate runs, retiring it beats keeping machinery alive to work around this — here `tests/intake-rls.test.ts`, `tests/intake-validation.test.ts`, `tests/notify-upload-received.test.ts` and `e2e/tests/chapter-upload.spec.ts` owned all of it.

⚠ **THERE IS AN ESCAPE, FOUND 2026-09-01, and it is not the condition flag.** Patch the CJS resolver from an ESM preload:

```js
// scripts/server-only-shim.mjs — node --import ./scripts/server-only-shim.mjs --import tsx script.ts
import Module from 'node:module'
const original = Module._resolveFilename
Module._resolveFilename = function (request, ...rest) {
  if (request === 'server-only') return EMPTY   // node_modules/server-only/empty.js
  return original.call(this, request, ...rest)
}
```

Three things make it work, and each is a separate trap:

1. **It must patch the CJS resolver, not the ESM one.** tsx transpiles TypeScript to CommonJS, so `import 'server-only'` becomes a `require()` that an ESM `resolve` hook **never sees** — a `--import` hook returning a `data:` URL for the specifier loads fine and changes nothing, and the throw still arrives.
2. **But the file doing the patching may be ESM**, because `node:module` is one singleton whichever syntax loads it. That matters here: `@typescript-eslint/no-require-imports` is `error` in this repo, so a `.cjs` shim **fails the gate** — the seam is CommonJS, the file need not be.
3. `require.resolve('server-only/package.json')` throws `ERR_PACKAGE_PATH_NOT_EXPORTED` — the exports map does not expose it. Join the path to `empty.js` by hand and `existsSync` it.

This is the same neutralisation `vitest.config.ts` performs with its alias, so it is not a new risk surface — it does not set `react-server`, so `@react-email/render` is untouched and point 2 of the dead end above does not apply. **Retiring the script is still right when its ground is covered by the gate; this is for a script whose ground is not** — `website/scripts/seed-local-demo.ts` needs the real `validateIntakeFile` precisely so its seeded verdicts cannot be a hand-written blob that agrees with itself.

⚠ **A new service-role script under `scripts/` will fail three count-the-doors guards**, because `scripts` is inside the surface of `tests/public-chapters-cache-tag.test.ts`, `tests/intake-policy.test.ts` and `tests/account-note-read-surface.test.ts`. **Do not add a `scripts/` carve-out** — two of them were written against exactly that shape and say so. List the file by name with its reason; see [[shared-helper-contract-belongs-at-its-own-seam]].

Relates to [[url-normalises-encoded-dot-segments]] (found in the same review) and [[test-suite-clean-minimal-standard]].
