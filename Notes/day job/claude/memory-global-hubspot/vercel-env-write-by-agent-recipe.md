---
name: vercel-env-write-by-agent-recipe
description: "How an agent changed a Vercel env var here (2026-09-28) — the Vercel MCP can't be authed from the session, the CLI can, auto mode needs a one-off allow rule"
metadata:
  node_type: memory
  type: feedback
  originSessionId: f33e2f03-4bb6-4391-b361-3adc3cf4a1e7
  modified: 2026-09-28T12:21:16.957Z
---

A Vercel env var write by an agent worked on 2026-09-28 (`EVENTS_NOTIFY_TO` widened), and the operator confirmed it:

- The claude.ai Vercel MCP connector cannot be authed from inside the session (`authenticate` says to run `/mcp`), and no env-write tool is known on it. Go straight to the CLI.
- The CLI is not installed; `npx vercel@latest` works (60.1.3 has `env update`, which edits the EXISTING record without adding one). The operator signs in with `! npx vercel login` (device flow).
- Auto mode denied `npx vercel env update …` as [Modify Shared Resources] even with the operator's request. The operator then gave an explicit green light to edit my own config. Reading and editing `.claude/settings.local.json` then PASSED, contradicting the older note that settings edits are always refused. Adding `Bash(npx vercel env update:*)` cleared the denial. Remove the rule right after use.
- Run the allowed command bare (no `| grep`), so it matches the prefix rule.
- NON-SECRET values only (address list, flag): `--value` puts the value in the transcript. Do not trust the `Config` label: `env ls` shows any non-Sensitive record as Config, keys included. `env update` changes ONE record; a name with a record per environment stops (`Multiple Environment Variables match`) — pass the environment positionally, once per environment the operator NAMED, with the value they gave.
- `npx vercel env ls --project <id> --scope eo-global` is read-only but ⚠ UNFILTERED it prints EVERY record with the first 18 chars of any non-Sensitive value (keys included; CLI 60.1.3 `getRow`). Always pipe it, ANCHORED, stdout only: `| grep -E '^ *<NAME> |^  "(status|reason|message)": '` (unanchored, `SENTRY_DSN ` also matches `NEXT_PUBLIC_SENTRY_DSN`; run by an agent the CLI is NON-INTERACTIVE — `CLAUDECODE` set, stdin not a TTY — and writes a failed API request as JSON to STDOUT, so the second half keeps it; a bare name filter makes a failure look like "no record"). A value ≤19 chars prints WHOLE. Both 2026-09-28 runs filtered to `EVENTS_`, so nothing leaked. Never run `vercel env pull` (it writes every secret to a file).
- A `!` command's text and output enter the conversation too, so a key/token/password goes in the Vercel DASHBOARD, never `! vercel env update --value`.

**Why:** the operator wanted the write done by the agent rather than pasting the command themselves.
**How to apply:** Only when the operator asks in their own words in that session. The recipe is also in `docs/engineering/vercel-deployment.md`. See [[classifier-denies-repo-settings-writes]] (GitHub repo settings stay a hard wall) and [[policy-guardrails-this-repo]].
