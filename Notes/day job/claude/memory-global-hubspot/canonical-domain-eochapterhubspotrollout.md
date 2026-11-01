---
name: canonical-domain-eochapterhubspotrollout
description: Canonical app domain is eochapterhubspotrollout.com (2026-06-17 cutover) — supersedes the eochapterinstance.com DEC-DOMAIN plan
metadata: 
  node_type: memory
  type: project
  originSessionId: bf1de67f-17bb-4617-a463-374beb2e760e
---

The live canonical production domain is **`https://eochapterhubspotrollout.com`** as of the **2026-06-17 cutover** (verified end-to-end against prod). It **supersedes** the documented DEC-DOMAIN target `eochapterinstance.com`, which was *never used*. `eoglobalhubspot.com` now **308-redirects** to the canonical domain, preserving path+query (so already-emailed set-password/invite links still resolve).

**Why:** next-steps.md + issue #55 long described `eoglobalhubspot.com` as "canonical-for-now" with a planned cutover to `eochapterinstance.com`; reality diverged to a third domain. Don't trust stale domain mentions in older docs/commits — the dated DOMAIN CUTOVER COMPLETE callout at the top of next-steps.md is authoritative.

**How to apply:** All base-URL surfaces read `NEXT_PUBLIC_SITE_URL` (SEO/sitemap/robots/structured-data, notification deep-links, and the auth-link fallback). `isTrustedHost` (`website/lib/auth/account-setup.ts`) trusts the canonical domain + subdomains (PR #97), keeping `eochapterinstance.com`/`eoglobalhubspot.com` as aliases. Supabase Site URL + redirect allow-list = canonical (done). **Sender move (DEC-20-B) — ✅ DONE + PROMOTED TO PROD (2026-06-18):** after `RESEND_API_KEY` was updated to one authorized for the domain (the initial restricted key 403'd), a live send from `EO Global <onboarding@eochapterhubspotrollout.com>` **succeeds + delivers** (correct From). The full cutover (isTrustedHost + sender + 7 in-app refs + DOCX + docs) was promoted `dev`→`main` via **PR #100 (merge `78b63c8`)** and verified on prod (`/request-access` serves the new address; canonical intact). **✅ Prod E2E verified 2026-06-18:** a controlled prod `request-access` (throwaway chapter + a Gmail `+alias`) auto-provisioned and **delivered the set-password email from `EO Global <onboarding@eochapterhubspotrollout.com>`** with the link on the canonical domain (`/auth/confirm?...&type=invite`); test data cleaned up via service-role. So the Vercel Production key is confirmed authorized. **Only operational item left:** confirm someone monitors the **Resend inbound** (webhook/dashboard) for replies to `onboarding@`. See [[verify-running-branch-before-diagnosing]].
