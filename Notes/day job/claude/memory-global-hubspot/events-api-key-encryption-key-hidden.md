---
name: events-api-key-encryption-key-hidden
description: "EVENTS_API_KEY_ENCRYPTION_KEY is a hidden (Secret) value in Vercel that nobody can read back; replacing it is free only while production stores 0 chapter API keys"
metadata:
  type: project
---

On 14 Oct 2026 the operator opened Vercel (project global-hubspot, Settings, Environment Variables): both `EVENTS_API_KEY_ENCRYPTION_KEY` records, Production and Preview, show a lock icon and no value, "Added Sep 19" by Dave. Vercel's docs (Config and Secret environment variables, read 14 Oct) say a Secret value "is write-only after saving"; "Provide a new value to rotate the secret" through Edit in the record's three-dot menu. A read-only count the same day: production's `events_api_keys` held **0 rows**.

**Why it matters:** the event-sync connector needs the same value to open a fallback chapter's sealed Eventbrite key (spec (b), (k) question 7), and the value cannot be read back, so only a copy Dave kept, or a replacement, gives it. Spec (j) runbook item 4: rotate "in Vercel and the connector together, only when no key is stored or after sealing each one again". With 0 rows a replacement breaks nothing; once pilot chapters store keys, each would have to share its key again.

**How to apply:** before suggesting a rotation, re-count `events_api_keys` read-only (a scratchpad script that prints the count and dates only, never `last4`; the repo's `events-dry-run.ts show` prints `last4`). The new value is `openssl rand -base64 32` or PowerShell `[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))`, made in the operator's own window, never with the `!` prefix (that puts it in the conversation). The SAME value goes in both Vercel records (one shared database, ADR 0001; `docs/engineering/vercel-deployment.md:21`); Vercel's optional team policy "Separate Production Secret Values" would refuse that. It takes effect at the next deployment. Related: [[connector-timed-run-twice]], [[vercel-env-write-by-agent-recipe]].
