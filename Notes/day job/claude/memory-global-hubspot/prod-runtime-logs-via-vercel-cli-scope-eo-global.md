---
name: prod-runtime-logs-via-vercel-cli-scope-eo-global
description: "How to read the production runtime logs (the only place captureError lands) — CLI 63.1: `vercel logs --project global-hubspot --scope eo-global --environment production --since 30m --json --expand` AFTER the action (history, not a stream); the 2026-10-08 \"Claude could not be reached\" was the Anthropic org out of credits"
metadata:
  node_type: memory
  type: reference
  originSessionId: 5b64e559-e4e4-421f-ba43-eb082f4c40f6
  modified: 2026-10-08T06:33:43.776Z
---

`captureError` is `console.error` into the Vercel runtime logs (Sentry is scaffolded only), so the WHY of any Feedback-area Claude failure ("Claude could not be reached. Try again.") is readable only there. Recipe that worked 2026-10-08 (CLI 63, logged in as `kh0ile`):

- The project is under the **`eo-global`** team, not the personal scope: without `--scope eo-global` the CLI says `Deployment not found: eochapterhubspotrollout.com under khoi-les-projects-9b790dd1`.
- `vercel logs` only STREAMS from the moment it connects, so run it in the background under `timeout 100 …`, wait ~15 s for "Fetching logs…", then trigger the action (the button) and read the output file after the timeout:
  `timeout 100 npx --prefix <website> vercel logs eochapterhubspotrollout.com --scope eo-global --json`
- The error line carries the Anthropic request id, org id and workspace id, and the `{ stage: 'feedback.faq' }` tag.

What it was that day: every Claude call (FAQ, Trends, and therefore call authoring too) failed fast with **HTTP 400 `invalid_request_error`: "Your credit balance is too low to access the Anthropic API"** — the rollout's Anthropic org (Dave's) had no prepaid credits left. Nothing in the code; only a top-up fixes it. Dave's call authoring had worked 9 hours earlier, so "it worked yesterday" proves nothing about credits.

Related: [[sentry-scaffolded-but-never-integrated]], [[vercel-env-write-by-agent-recipe]] (same CLI login; `env ls` leaks value prefixes — never use it to check a key).

**Update (CLI 63.1.0, evening of 2026-10-08): `vercel logs` now returns HISTORY and exits; it does not stream.** With the domain as the positional argument it printed the same 12 older lines twice and never showed the POST made a minute earlier. What worked, run AFTER pressing the button: `timeout 90 npx --prefix <website> vercel logs --project global-hubspot --scope eo-global --environment production --since 30m --json --expand`, then filter the JSON lines for `error`. It showed the `[captureError]` line for `POST /admin/feedback/faq` with the Anthropic request id. `--follow` is the streaming mode now; `--level error` and `--query` also exist. The 21:47 retry that evening hit the same 400: the credits were still not topped up.
