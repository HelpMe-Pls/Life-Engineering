---
name: e2e-shared-admin-password-reset-breaks-sessions
description: "Calling ensureSharedAdminUser/ensureSharedChapterUser from an E2E spec resets that account's password mid-run and invalidates ADMIN_STATE for every spec running in parallel"
metadata: 
  node_type: memory
  type: project
  originSessionId: 6886f878-075c-47e4-96aa-25a5d429289f
  modified: 2026-07-26T06:51:53.231Z
---

In `website/e2e/fixtures/users.ts`, the `ensureSharedAdminUser` / `ensureSharedChapterUser` helpers call `ensureAuthUser`, which for an **already-existing** email falls through to `svc.auth.admin.updateUserById(id, { password, email_confirm: true })`. That **resets the shared account's password**, which invalidates the live session in `ADMIN_STATE` — so any *other* spec running concurrently under that storageState starts failing.

**Why:** the symptom is a completely unrelated spec going red only in the FULL run and passing in isolation. On 2026-07-26 a new spec calling `ensureSharedAdminUser` for a `chapter_notes.author_id` made `user-config.spec.ts` ("a typed name saves on outside-click close") fail reproducibly in every full pass. It reads exactly like flake and is not.

**How to apply:** those `ensure*` helpers are for the **auth setup project only** — never call them from a test spec. If a spec just needs the shared admin's id, use `findUserIdByEmail(svc, SHARED_ADMIN_EMAIL)` (read-only). If it needs its own admin, use `createAdminUser(svc, tracker)`, which makes a unique tracked account. And when an unrelated E2E fails only under the full suite, suspect shared-account mutation before suspecting timing — see e2e-ci-single-worker-constraint and [[e2e-cicd-local-supabase-prod-safety]].
