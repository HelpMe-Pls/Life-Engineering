---
name: url-normalises-encoded-dot-segments
description: "`new URL()` resolves %2e%2e, .%2e, %2e. and backslashes into `..` before a request leaves the process — so a traversal check that greps for two literal dots is bypassable; parse the shape you MINT instead"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 58f63850-aab2-474f-8edd-978da709ebb9
  modified: 2026-07-28T11:56:56.270Z
---

A guard shipped in this repo refused `storagePath.split('/').includes('..')`, under a comment asserting the residue was *"not exploitable against Supabase Storage today — object keys are literal, so `..` is just an oddly-named folder and the download misses."* **That premise was false.** Measured 2026-07-28:

```js
new URL('http://h/storage/v1/object/intake/A/%2e%2e/B/x.xlsx').pathname
  === '/storage/v1/object/intake/B/x.xlsx'
```

The WHATWG URL parser treats a segment as a **double-dot path segment** when it is `..`, `.%2e`, `%2e.` or `%2e%2e` (ASCII case-insensitive), and it treats a **backslash** as a separator in a special scheme. `supabase-js`'s `download()` builds a request URL from the key, so all five normalise *inside our own process*, before storage ever sees the key. `split('/')` sees a `..` segment in none of them. Confirmed NOT normalised: `..%2f` (encoded slash) and `%252e%252e` (double-encoded).

Consequence in this app: a chapter user could satisfy a `startsWith(chapterId + '/')` prefix rule and still have the **service role** download another chapter's upload — the guard's own stated threat model. Exploiting it needed the victim's file UUID, which is what kept it below blocker.

**How to apply — the fix is a shape, not a longer blacklist.** Parse the one key the app itself mints and refuse everything else (`checkStoragePath` in `website/lib/validation/intake-policy.ts`): `^<uuid>/<uuid>\.<allowed ext>$`, anchored, case-insensitive. Then no encoding matters. Two details worth keeping:

- **JS `$` without the `m` flag is strict** — verified it refuses a trailing `\n`, `\r`, space and NUL, unlike Python's `$`. Don't assume; probe it.
- **Derive the extension from the one policy constant** (`ALLOWED_EXTENSIONS`), or a future second extension 403s every legitimate upload with a security-flavoured message.
- **Make the fixtures prove non-vacuity honestly.** The first version of the test header claimed "every case below is a real bypass"; only 11 of 20 refusal rows go green when the blacklist is restored. An overstated non-vacuity claim is worse than none — the next reader runs the experiment, sees rows stay green, and stops trusting the file.

Generalise: any check on a caller-supplied path/key that will later be interpolated into a URL, a filesystem path or an S3 key should validate the **positive shape**, because every layer between you and the target may normalise. Relates to [[server-only-means-rsc-graph-not-server]] (same review) and [[supabase-rls-read-path-traps]].
