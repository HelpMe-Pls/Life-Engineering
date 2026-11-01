---
name: events-all-chapter-events-myeo-included
description: "SETTLED: the Eventbrite connector takes ALL chapter events, MyEO INCLUDED (30 Sep call + operator 2026-10-05, DEC-EVENTS-ALL-CHAPTER-EVENTS); card 3's allowlist + MyEO exclusion is WITHDRAWN; never re-propose a filter"
metadata:
  type: project
---

The 30 Sep 2026 call with EO Global settled "Events scope is all chapter events. The connector must not be limited to chapter learning events", and on 2026-10-05 the operator added: "MyEO stays included so that 'all chapter events' stays true." Recorded as `DEC-EVENTS-ALL-CHAPTER-EVENTS` (`docs/engineering/recorded-decisions.md`) and in the connector spec's (c), where card 3's old **Decided** block is kept verbatim but marked withdrawn.

**Why:** the spec still carried card 3's rule (a per-chapter organizer/series allowlist, plus "exclude MyEO until the list is set") for five days after the call, and I drafted a Dave default ("MyEO in the title stays out") that contradicted a settled meeting decision. The meeting summaries live outside the repo (`~/Documents/Edge8/Meetings/`), so the repo cannot warn you.

**How to apply:** no allowlist columns, no MyEO keyword, no `myeo_in_title`/`not_on_allowlist` reasons, and the settings panel's audit action is `events.connector.set`. What still keeps an event off: card 4's 12-month window, drafts, and private/invite-only/password events (the KB's promise); hidden dates are a Dave default. Related: [[connector-spec-missed-nishas-hivebrite-doc]], [[events-pilot-no-eventbrite-applications]].
