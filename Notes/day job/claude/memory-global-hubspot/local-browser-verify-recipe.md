---
name: local-browser-verify-recipe
description: How to do a real admin browser click-through against a LOCAL Supabase before a PR (dev server + seed + Playwright MCP)
metadata: 
  node_type: memory
  type: reference
  originSessionId: 57d1907c-883a-4fd9-b3d8-1103e895c3f7
  modified: 2026-08-15T04:55:47.269Z
---

Recipe for a live, in-browser verification of an admin/auth change WITHOUT touching the shared prod DB (the only DB `website/.env` points at). Used to verify #145 (PR #153) before committing.

1. **Docker**: Docker Desktop must be running (`"C:\Program Files\Docker\Docker\Docker Desktop.exe"`; daemon ready in ~10s). `supabase start` needs it.
2. **Local stack**: from `website/` — `npm run db:start` then `npm run db:reset` (applies all migrations + `seed.sql`). Local keys are the **new format** (`sb_publishable_…` anon / `sb_secret_…` service) but `supabase status -o env` still emits legacy JWT `ANON_KEY`/`SERVICE_ROLE_KEY` — both work; they're well-known dev keys, NOT secrets. API = `http://127.0.0.1:54321`.
3. **Seed an admin**: create an auth user whose email is allowlisted (`khoi.le@edge8.ai` etc., migration 0009) via the **service-role admin API** (`svc.auth.admin.createUser({email,password,email_confirm:true})`) → the signup trigger auto-elevates it to `master_admin`. + insert any chapter rows you need. Run a throwaway tsx with an **absolute** path so imports resolve from `website/node_modules`: `npm --prefix website exec -- tsx "C:/…/website/scripts/_tmp.ts"` (npm exec does NOT cd to the prefix). Delete the temp script + any `.playwright-mcp/` artifact dir before committing.
4. **Dev server against LOCAL**: `next dev` reads `process.env` over `.env` (shell vars WIN — @next/env never overrides an already-set var), so just `export NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321 NEXT_PUBLIC_SUPABASE_ANON_KEY=… SUPABASE_SERVICE_ROLE_KEY=… ; npm --prefix website run dev` — never edit `.env`. Don't run `next build` while `next dev` is up (shared `.next`).
5. **Drive it**: Playwright MCP (`browser_navigate`/`fill_form`/`click`/`press_key`/`snapshot`/`evaluate`). Confirm DB-level truth with a service-role read (row columns + `audit_log` before/after).
6. **Teardown**: kill dev server (`Stop-Process` on the PID owning port 3000), `npm --prefix website run db:stop`.

⚠ **A scripted `/login` fill can land BEFORE hydration and silently do nothing.**
The form is React-controlled, so `fill()` on an unhydrated input sets the DOM
value but never the state, and submitting reports **"Email is required"** with
the field visibly full. It is not a wrong password and not a selector problem.
Seen 2026-08-15 driving two contexts in one script: the FIRST login worked and
the second failed, because the warm dev server served the second page fast
enough to beat hydration. Fill, then read `inputValue()` back and retry until it
sticks:

```js
for (let i = 0; i < 12; i++) {
  await emailBox.fill(email)
  await page.waitForTimeout(500)
  if ((await emailBox.inputValue()) === email) break
}
```

**A whole-app screenshot sweep is cheap and worth doing**: one throwaway
`.mjs` using `playwright` (installed in `website/`), two `newContext()`s for the
two roles, `fullPage: true`. ⚠ **ESM resolves `playwright` from the SCRIPT's
directory, not cwd** — a script in the scratchpad throws `ERR_MODULE_NOT_FOUND`;
put it in `website/` and delete it after. A `position: fixed` element floats
mid-image in a full-page capture — a capture artifact, not a layout bug.

Related: [[e2e-cicd-local-supabase-prod-safety]], [[verify-running-branch-before-diagnosing]].
