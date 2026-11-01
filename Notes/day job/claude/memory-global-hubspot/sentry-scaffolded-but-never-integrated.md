---
name: sentry-scaffolded-but-never-integrated
description: Sentry LOOKS wired in this repo (dep + 3 config files + captureError in 30 modules) but no DSN was ever set — every call is console.error; do not add tags or alert rules
metadata: 
  node_type: memory
  type: project
  originSessionId: 3aa67a7d-6736-4409-a076-2429122d12ef
  modified: 2026-07-27T09:18:28.552Z
---

Sentry has **never been integrated** in `global-hubspot` (or `altai-hubspot-sync`) — operator, 2026-07-27. The scaffolding is misleading because it all looks live:

- `@sentry/nextjs@^10.55.0` is a real dependency and is installed
- `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts` all exist
- `lib/sentry.ts`'s `captureError` is imported by **30 source modules**
- `docs/engineering/sentry-alerts.md` documents a tag table and "alert rules to create"

But **no `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN` is set in any environment**, so `isSentryEnabled` is false and every single call takes the `console.error` branch. In production that lands in Vercel's runtime logs — which is the *only* error signal this app has.

**Why:** the alert rules in `sentry-alerts.md` §"Alert rules to create in the Sentry dashboard (manual, one-time)" were never created. The tag table there describes intent, not a live integration.

**How to apply:** do NOT add `tags` to a `captureError` call, and do NOT add rows to `sentry-alerts.md`, to make a signal "alertable" — there is nothing subscribed and it reads as bloat. A `captureError` call is still worth adding for a real failure (Vercel logs are a genuine signal); just don't dress it up as an alarm. I added an `altai-sync.drift` tag + a doc row in review round 13 and had to revert both. Only revisit if a DSN is actually wired.

Related: [[test-suite-clean-minimal-standard]] — same operator instinct, one round apart: don't build machinery for a consumer that doesn't exist.
