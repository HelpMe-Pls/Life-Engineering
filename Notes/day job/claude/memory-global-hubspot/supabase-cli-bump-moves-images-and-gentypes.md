---
name: supabase-cli-bump-moves-images-and-gentypes
description: "Bumping the `supabase` devDependency silently moves the local/CI service images and the committed generated types, with ZERO repo diff"
metadata: 
  node_type: memory
  type: project
  originSessionId: d5507dcf-00ae-41fa-b80e-0df50072be29
  modified: 2026-09-11T10:09:32.092Z
---

Bumping `supabase` in `website/package.json` is **not** a version string. Measured 2026-09-11 on 2.115.0 → 2.117.0 (PR #901):

- **Seven of nine service images moved** — `postgres 17.6.1.159 → 17.6.1.167`, `gotrue v2.195.0 → v2.196.0`, `postgrest v16.1 → v16.2`, `postgres-meta v0.98.0 → v0.99.0`, `storage-api v1.69.11 → v1.72.1`, `realtime v2.129.0 → v2.130.0`, `studio 2026.08.17 → 2026.08.24`. Only `kong` and `mailpit` stood still. **The tags live inside the CLI binary's embedded manifest, not in `supabase/config.toml`**, so the diff shows nothing and the live Supabase suites quietly start running against seven different service versions.
- **The generated types changed too.** `supabase gen types typescript --local` writes `lib/db/database.types.ts`, which 20 modules import — so it is a build input. 2.117.0 parenthesises the conditional in five helper generics (`Tables<>`, `TablesInsert<>`, `TablesUpdate<>`, `Enums<>`, `CompositeTypes<>`). Semantically neutral, but leaving it means `package.json` claims one version over an artifact built by another, and the churn ambushes whoever next regenerates after a real schema change.

**Why:** a bump that looks like a one-line dependency change is actually a stack change, and the two things it moves are both invisible in the diff.

**How to apply:** verify a CLI bump by **restarting the stack**, never by the dependency installing — `db:stop` → `db:start` (watch the pulls) → `db:reset` (re-applies every migration on the new Postgres) → reseed → read a row back. Then regenerate the types and commit them; prove neutrality with `tsc --noEmit`, and prove the **schema** half unchanged by splitting the file at `type DefaultSchema` and comparing halves separately. Expect new image pulls on the first CI run after it lands — see [[ci-supabase-start-ecr-pull-rate-limit]].

⚠ **"Is it effective on prod?" has no prod step.** The CLI has no production runtime: nothing in the served graph imports it, it has no install script, and no `link` / `db push` / `gen types --linked` call site exists in the repo. The only sense in which it reaches prod is the lockfile the production build resolves, via the ordinary `wip → dev → main` promotion. Related: [[supabase-mcp-oauth-broken]], [[e2e-cicd-local-supabase-prod-safety]].
