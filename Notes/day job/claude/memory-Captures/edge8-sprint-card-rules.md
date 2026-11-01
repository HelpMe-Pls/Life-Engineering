---
name: edge8-sprint-card-rules
description: "Dave's rules for Edge8 sprint cards — one card is one 4-hour block of work, at least 15 cards a sprint for the 3 devs (5 each), 10 each in a highly productive week, planning updated by EOD Tuesday"
metadata:
  node_type: memory
  type: project
  originSessionId: 647034da-44e6-4879-be28-fa289be77839
  modified: 2026-10-07T14:05:24.078Z
---

On 2026-10-07 Khôi shared a screenshot of Dave's message as "how the boss wants the tickets to be created". Dave's words:

> please make sure that by EOD tuesday at the latest you have updated your sprint planning for the week. at a minimum, there are 3 of you so there should be 15 cards for a sprint representing one block of work per day. https://edge8.ai/team/sprint-planning/
>
> By the end of the sprint, in a highly productive week, you will have finished a minimum of 10 cards each (2 four hour blocks per day)
>
> this is a long standing best practice in development.

- One card = one block of work = 4 hours (HT 0.5 when HT is in days).
- Floor: 5 cards per person per sprint (15 for the three devs, presumably Khôi, Thành and Ha). A highly productive week is 10 cards each.
- Sprint planning must be updated by EOD Tuesday each week.
- The linked page needs an Edge8 Team sign-in. WebFetch only gets the login screen, so ask Khôi for anything it adds.

**Why:** Dave calls this a long-standing best practice. Khôi wants every ticket written to it.

**How to apply:** give every card one owner and one 4-hour block of work. Split anything bigger, and roll smaller pieces into a whole block. Khôi's own cap of 10 cards a sprint ([[khoi-work-pace]]) matches Dave's productive-week figure. Never mention Khôi's hours cap in cards. Card wording conventions are in [[events-api-ownership]].

**Sprint 41, filled on 2026-10-13 at Khôi's ask** (after a side agent flagged the EOD-Tuesday deadline): the three HT-1 cards of the 8 Oct draft became two HT-0.5 cards each (new ids 7, 8, 9 next to ids 2, 3, 4), plus Card 10 (id 10), the SAP new-and-renewal scope, the next Priority 2 item now that Cards 6-7 of Sprint 40 are done; 10 cards, 4.5 HT. Later that day Khôi had Card 11 (id 11) added, v1 of the APAC regional dashboard due Thu 15 Oct, so the sprint holds 11 cards and 5 HT, past his own cap of 10. The Vietnam deals push sits in its parked list (waits for Dave's go and EO Global's OK). The call's follow-ups and the review of the tickets come on Wed 14 Oct. **After the 14 Oct call** (Khôi's ask "update its tickets accordingly"): Cards 12-14 (ids 12-14) for Khôi from the call (shared Monday view test for the dashboard limit, due Thu 15 Oct; Contact-to-Region association in the Altai sync; position tiers from Altai, both Israel's asks), and Cards 15-16 (ids 15-16, assignee Thanh) carrying Sprint 40's Cards 2 and 3; Sprint 40's Card 1 remainder (Cloud Converge sandbox access) went to the parked list behind Kyle's introduction, as did the Member Renewal build (behind EO's answers to questions 5 and 6) and the Monday view rollout (behind Card 12). Sprint 41 then held 14 of Khôi's own cards, 4 over his cap of 10; Sprint 40's Card 9 (thread reply to Dave) was not carried. Later on 14 Oct Khôi hand-edited the summary's action items (Region link and tiers owned by Thành, the Monday view test "This sprint"), so Cards 13-14 went to Thành and Card 12 moved to Tue 20 Oct: 12 of Khôi's own cards, still 2 over his cap. Khôi's hand edits to a summary's action items are the signal to re-sync the tracker.

**Khôi's own ask (2026-10-07):** "make sure that I'm productive enough in his eyes", and "Feel free to split the tasks into smaller tickets to get to that 'productive' number". So:
- Plan 10 cards a sprint for Khôi alone. Thành's work shows up only as dependency steps, because each dev plans his own cards.
- Split real work into smaller tickets to reach 10. Each must still be a distinct deliverable, never a padding step like "send the email".
- Keep HT honest (0.25 = about 2 hours). Never inflate HT to 0.5 to imitate Dave's 4-hour block, and tell Khôi the HT is the real size.
- Put only cards he can finish inside the sprint on it. Blocked work goes in a "Waiting outside the sprint" list so it doesn't lower his completion count. Sprint 40 as first planned (11 cards) is the model; Khôi later handed nine of them to Thành as three merged cards, see [[events-api-ownership]].

**Sprint 42 (Wed 21 to Tue 27 Oct 2026), filled on 21 Oct after the call** ("add its summary and tickets accordingly"; facts in [[eo-call-2026-10-21]]): a new page `Sprint Tickets [Y26 Sprint 42].html`, built by a scratchpad generator from a JSON spec: Sprint 41's <head>, CSS and page script copied byte for byte, the header on the head's last line, one card per line, the parked section on one line, &rsquo; for every apostrophe, CRLF, no BOM, ids 1 to 10 (a new file, so ids start fresh), every card with a Last updated span stamped at creation. 10 cards: Khôi 8 (Cards 1 to 8, 3.25 HT, inside his cap of 10), Thành 2 (Cards 9 and 10 carry Sprint 41's 15 and 16; Card 10 is "Thanh, Khoi" because its first two steps are Khôi's); Card 3 carries Sprint 41's Card 11, Card 7 its Card 9, Card 8 its Card 19; 22 parked items, each naming its owner in brackets. Lessons from the five-lens verification: (a) sequence against what a coming demo must still show (the first draft deleted the test deal and the demo dashboard on Thursday that Emily's demo next week shows); (b) a cloned dashboard's report copies keep the source descriptions, so a region-neutral copy is "Save as new report", and the funnel's region lives in a deal segment; (c) do not state HubSpot's parent-team rule as proven (only Main Team + Shared teams were tested on 16 Oct); (d) check the sync repo's ADRs before carrying a parked item (the Current Status segment edit was done on 18 Oct, ADR-0038); (e) a Thành dependency step lives on Khôi's card, never a second assignee, except where his steps gate Thành's (Card 10); (f) no card number in anything a step sends to EO or writes into a repo handoff; (g) each parked line names its owner.

**Sprint 43 (Wed 28 Oct to Tue 3 Nov 2026), filled on 28 Oct** from the call and Dave's private training talk ([[eo-call-2026-10-28]]), with the Sprint 42 generator approach (head, CSS and script byte for byte, CRLF): 11 cards, Khôi 9 at 3.25 HT, Thành 2 carried; Card 3 (remove the demo's test chapter) must precede any production key; the key swap itself is a waiting line, because a card must not wait on EO; 26 waiting lines. A seven-lens review then a round-2 recheck paid off (wrong dry-run reasons, a guard reversed without a reason, steps the app refuses).
