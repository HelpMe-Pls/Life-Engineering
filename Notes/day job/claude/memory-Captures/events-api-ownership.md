---
name: events-api-ownership
description: Since 2026-09-23 Khôi owns all Edge8 Events API implementation (Eventbrite → 1EL/OneEO on Hivebrite); the decisions from the Sprint 38 grilling and how his tickets are written
metadata:
  node_type: memory
  type: project
  originSessionId: 915318af-1202-48ea-8ba3-4733b68a7c57
  modified: 2026-10-08T06:10:44.789Z
---

Khôi Lê owns every Events-related build on the Edge8 side from 2026-09-23 (Dave built the tracker/public site 19–21 Sep; Ha does chapter coordination and QA). Tickets live in Edge8's card tool (fields: Status, Assignee, Due, HT in days, Priority P1/P2, Sprint e.g. "Y26 Sprint 38 - EO Data Migration And Dues", Epic "Events API — Chapters connect their Eventbrite events to the global 1EL calendar…", Internal flag, Pull request) — not GitHub; the repo `EO-Vietnam/global-hubspot` keeps zero open issues by policy and puts human items in `docs/plans/next-steps.md`.

Decisions (2026-09-23 grilling):
- Connector = separate service `EO-Vietnam/eventbrite-1el-sync` on the `altai-hubspot-sync` pattern (GitHub Actions cron every 30 min, sync-health table read by the tracker). `global-hubspot` never calls Eventbrite/1EL (spec #912).
- Credentials: team invite first, via Edge8's Eventbrite account `onboarding@eochapterhubspotrollout.com` (mailbox works; Eventbrite account still to create). API key = fallback; the delete-on-access-check trigger (migration 0049) is dropped only in the build sprint.
- Filter: per-chapter allowlist (Eventbrite organizers/series) set in the tracker; default exclude anything with "MyEO"; Ha collects data in discovery calls.
- Registrants-back (Eventbrite → Hivebrite attendee sync) is phase 2; Dave gets Kyle's written confirmation that the beta go/no-go is events-out only.
- Discovery notes are admin-only (full fix = admin-only table, next sprint). "1EL" stays as the calendar name until EO says otherwise.
- `EVENTS_NOTIFY_TO` = khoi.le@edge8.ai, ha.nguyen@edge8.ai, dave@edge8.ai, kphillips@eonetwork.org, lking@eonetwork.org, nbajaj@eonetwork.org.
- Dry runs use EO Vietnam's row (Tam, chaptermanager@eovietnam.org) with applicant_email swapped to khoi.le@edge8.ai and reset by SQL afterwards.
- Edge8's Eventbrite account exists since 2026-09-24 under onboarding@eochapterhubspotrollout.com (profile name "Edge8 Events"). That address is not a mailbox: the domain's MX is Amazon SES inbound (`inbound-smtp.us-east-1.amazonaws.com`), so Eventbrite's login and MFA codes arrive wherever the SES receipt rule forwards them (Dave set it up). Eventbrite MFA = authenticator app + one recovery code, organizer accounts only, under Account settings → Multi-Factor Authentication (help article 277134); the menu item is absent on a fresh non-organizer account.
- Khôi talks to Nisha directly (cc Dave) for technical asks; Dave handles Kyle; Khôi waits for Dave's green light before proceeding.

Ticket conventions: "Done:" statement + how-to-close steps; never Internal; staggered dues; one card per PR. The ticket cap is not an Events rule: it covers the whole sprint, see [[khoi-work-pace]]. Ticket text uses the vocabulary of `global-hubspot/CONTEXT.md` (pilot wave, never "beta"; Events application; API information; access check; "Internal note" is reserved for the account note). See [[khoi-work-pace]].

Vercel state seen 2026-09-23 (dashboard screenshot): `EVENTS_API_KEY_ENCRYPTION_KEY` exists in Production and Preview as two sensitive records added 19 Sep (Dave); `EVENTS_TEAM_INVITE_EMAIL` and `EVENTS_NOTIFY_TO` are unset, so the portal still says "We will email you the address to invite" and application emails go only to the code default (Dave, Ha). Card 2 was rewritten for this.

Local tracker: `C:\Users\leekh\Documents\Edge8\Tickets\Sprint Tickets [Y26 Sprint 38].html` (moved there from Captures on 2026-09-23; every tracker lives in Tickets, see [[edge8-folder-convention]]) holds the five cards with ticks, statuses and notes in browser localStorage (key `eo-sprint-38-tickets:v1`), plus Export/Import and Copy-as-Markdown. From Sprint 39 on, trackers are static HTML with statuses in the markup and no localStorage. Model the next tracker on the newest one in Tickets: Sprint 40 (2026-10-07) was planned as 10 of Khôi's own cards plus Dave's request and a "Waiting outside the sprint" list, see [[edge8-sprint-card-rules]]. The same day Khôi assigned the nine V1.1 cards to Thành (two shared with himself) and had them merged into three 0.75-HT cards ("so I can give him just 3 tickets"; at his OK, Thành now owns the steps from the cards Khôi gave him alone, while Khôi keeps the steps from the two shared cards and the email to Nisha), so Sprint 40 showed five cards: 1–3 for Thành, 4–5 (Events connector check, meeting summaries) for Khôi. That evening Cards 6–7 (ids 12–13) were added for Khôi, scoping the first two SOW 1 Priority 2 items, see [[sow1-priority2-scoping]]; on 2026-10-08 Card 8 (id 14) followed, the APAC regional dashboard prototype Dave asked for in Lark, due Fri 9 Oct; by that evening the prototype was live with 3 reports and Card 8 was DOING with Vietnam, the messages to Dave, Amy Kong and the interview questions left, see [[apac-regional-dashboard]]. Card 9 (id 15), a review of Dave's Trends, FAQ and Melbourne plan due Thu 8 Oct, came from another session. Since 2026-10-07 every tracker also carries an inline Assignee row saved into the file itself; keep it in new trackers, see [[tickets-assignee-helper]].
