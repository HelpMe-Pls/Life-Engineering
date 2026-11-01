---
name: twenty-thousand-members-matches-eo-about-page
description: "SETTLED 2026-10-05: the Events copy says 'about 20,000 EO members' (operator's call, DEC-EVENTS-ABOUT-20000); EO's About page says 'nearly 20,000'; the reach is answered by Nisha's Hivebrite doc"
metadata:
  node_type: memory
  type: project
  originSessionId: 0532f0a2-a056-451d-88b1-2a71198d1c22
  modified: 2026-10-05T07:03:44.407Z
---

**Settled 2026-10-05 by the operator:** _"just say `about 20,000 members`. It doesn't have to be precise."_ It is recorded as `DEC-EVENTS-ABOUT-20000` in `docs/engineering/recorded-decisions.md`, and the spine's old 🧑 **Card 5 B3** bullet (a Dave/Kyle sign-off) is retired. The copy changed in `app/events/page.tsx`, `layout.tsx`, `opengraph-image.tsx`, `lib/events/metadata.ts` and `lib/events/email-copy.ts`; `tests/events-stage-email.test.ts` and `e2e/tests/events-host.spec.ts` pin the string.

Background: EO's own `https://eonetwork.org/about/` reads _"a global community of nearly 20,000 members in more than 220 chapters"_ (fetched 2026-09-29), so the number was never "backed by nothing". The reach (every chapter event seen network-wide) is answered by Nisha's 22 Aug Hivebrite doc: chapter events go on the global list and search (`hide_from_general_list=false`, `visible_on_index_page=true`), and an event cannot be limited to a sub-network.

**Why:** a sign-off question that sat open for two weeks; it needed no one but the operator.

**How to apply:** do not reopen the number or ask Dave/Kyle about it. Any new Events copy says "about 20,000". Related: [[dave-is-the-boss]], [[connector-spec-missed-nishas-hivebrite-doc]].
