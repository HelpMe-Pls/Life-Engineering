---
name: events-pilot-no-eventbrite-applications
description: "On 2026-10-05 production held ONE Events application (EO Vietnam, event tool other) and NO Eventbrite one, so the November pilot wave had nothing to pick from; re-measure before assuming"
metadata:
  node_type: memory
  type: project
  originSessionId: 7381459e-92c2-4e16-8a16-796da242106e
  modified: 2026-10-05T10:41:24.295Z
---

Measured 2026-10-05 with a read-only service-role query of production `events_rollout`: one Events application (EO Vietnam, `c400488d-…`, applied 20 Sep, event tool `other`), zero Eventbrite applications, zero `events_access_requests`. Wave 1 was 0 of 5 after the operator undid the 29 Sep dry run that day. Re-measured 2026-10-06 (eve of the Sprint 39 review): unchanged. The query lives in the session scratchpad as `apps-read.ts`; rewrite it if gone (select `event_tool, stage, wave, applied_at, chapters(name)` from `events_rollout`, print no emails).

**Why:** the operator calls the November pilot-wave rollout CRITICAL (Dave's October goal 3), and the pick refuses any application that is not Eventbrite (`stage-gate.ts`). With no applicants, the connector being code complete does not make the pilot happen. So Dave's no-objection message carries one real question. ⚠ It is NOT "how will five apply": the 30 Sep call summary (`~/Documents/Edge8/Meetings/Meeting Summary [2026-09-30].html`) says EO Global is already approaching about seven chapters and owns naming the five, so the question is "check with EO Global that five send an Events application by Wed 21 Oct" (spec [CALL-0930]). I first drafted the wrong one because I had not read that summary — read the latest meeting summary before drafting any ask of Dave.

**How to apply:** this is a point-in-time count. Before drafting pilot picks or any message that assumes applicants, re-run a read-only count (a scratchpad tsx script using `createRequire` from `website/package.json` for `dotenv` and `@supabase/supabase-js`, printing no names or emails). Related: [[connector-spec-missed-nishas-hivebrite-doc]], [[dave-is-the-boss]].
