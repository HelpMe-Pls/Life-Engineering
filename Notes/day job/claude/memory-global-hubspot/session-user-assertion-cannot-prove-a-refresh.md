---
name: session-user-assertion-cannot-prove-a-refresh
description: "supabase-js writes the updateUser response onto its cached session, so `getSession().session.user.user_metadata` shows the new value with refreshSession() DELETED — a 'the name is in the session' assertion cannot fail; decode the access_token payload and assert the token CHANGED"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 9147b263-7792-4834-a5f3-05209477702b
  modified: 2026-09-03T05:27:00.202Z
---

Measured on `@supabase/auth-js` 2.110.2 during #833 (2026-09-03). `GoTrueClient._updateUser` does `session.user = data.user; await this._saveSession(session)` and leaves `access_token` untouched.

Consequence for a test: after `auth.updateUser({ data: { full_name } })`, reading `getSession()` and asserting `session.user.user_metadata.full_name` passes **whether or not** the code called `refreshSession()`. In this repo the shell layout reads the display name off the **verified JWT claims** (`lib/auth/identity.ts`), so deleting the refresh leaves every full page load showing the OLD name for the token's remaining lifetime — the exact regression the refresh exists for, and the assertion written to guard it could not go red.

**Assert the token instead**, in a live suite:

```ts
const before = signedIn.session?.access_token
// … the write …
const token = (await own.auth.getSession()).data.session?.access_token
expect(token).not.toBe(before)
const claims = JSON.parse(Buffer.from(String(token).split('.')[1], 'base64url').toString('utf8'))
expect(claims.user_metadata).toMatchObject({ full_name: 'kitana misa' })
```

Proven red by stubbing the refresh out (same token comes back). The general shape: **when a client library caches a server object, asserting the cache proves the client, not the server.** Ask what the consumer actually reads — here a token claim — and assert that artefact.

Related: [[test-suite-clean-minimal-standard]], [[supabase-getclaims-available-despite-ssr-pin]], [[emailed-auth-token-must-be-minted-last]].
