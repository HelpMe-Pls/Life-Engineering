> [!important] A friendly reminder
> If you're still getting paid each month + have access to AI, you're still winning. EVERYTHING ELSE is noise.

- Yesterday I finished the setup for the new `eochapterhubspotrollout.com` domain. Now it's production-ready.
- Today I'm gonna add the final touches to polish the UX, then introduce the app to EO Melbourne so they'll start using it to track their rollout progress. 

> [!warning] Chewsday ping
>Just flagging again: there's a contract violation around SHUI owed ever since I came on full-time.
>Don't get me wrong, I'm incredibly grateful for this job, but baseline expectations need to be honored.
>I'm not gonna let this slide until we get it resolved, or at least have a date to work toward :-)
---
# EP
> [!important] For prompts
> Remove line clamps so that every bullet/paragraph is one logical line, and the text reflows correctly in any input box

## Next
- Read @docs/plans/next-steps.md to follow its instructions
- Pls go ahead and do the merge so I can start a fresh session with the instructions in @docs/plans/next-steps.md
- Refresh `README.md` with `/understand`
## Later
- Explore the relevant skills in your repertoire to give me an OPTIMIZED prompt for an agent to grade the overall quality of the codebase. I want the prompt's output to give me an HONEST assessment. The main criteria it should grade against are enterprise readiness and antifragility.
- Using GPT5.5-xhigh: Perform an exhaustive scan on the codebase and run the /improve-codebase-architecture with its relevant skills to see how you can optimize the codebase for maximum antifragility.
### The scoring prompt
```
You are a brutally honest principal engineer auditing this repository for overall codebase quality.

Your primary grading criteria are:

1. **Enterprise readiness**: Can this codebase support a real production SaaS with multiple contributors, incidents, migrations, paid users, security concerns, operational pressure, and long-term maintenance?
2. **Antifragility**: Does the codebase get stronger when stressed by bugs, new features, incidents, audits, onboarding, scale, and changing requirements?

Do not optimize for politeness. Optimize for truth, evidence, and useful prioritization.

## Required Context First

Before judging, read:

- `CONTEXT.md`
- `.claude/CLAUDE.md`
- `docs/agents/domain.md`
- all files in `docs/adr/`
- `package.json`
- `app/routes.ts`
- representative files under:
  - `app/routes/`
  - `app/lib/queries/`
  - `app/lib/curriculum/`
  - `app/lib/checkout/`
  - `app/database/`
  - `app/test/`

Use the domain vocabulary from `CONTEXT.md`. If you discuss Course, Module, Lesson, Curriculum, Checkout, Payment, Enrollment, Asset, Bundle, Waitlist, Certificate, or Progress, use those terms exactly.

Respect ADRs. If you think the codebase should violate or revisit an ADR, say so explicitly and explain why.

## Method

Do a real audit, not a vibe check.

1. Map the codebase at a high level:
   - main domain modules
   - route/load/action flow
   - database and query structure
   - external integrations
   - test structure
   - deployment/runtime assumptions

2. Look for evidence of enterprise readiness:
   - auth and authorization correctness
   - validation at boundaries
   - data integrity and transactionality
   - migration safety
   - idempotency and auditability
   - error handling
   - observability/loggability
   - secret/config isolation
   - CI/build/typecheck discipline
   - dependency and runtime risk
   - security posture
   - operational rollback/recovery paths

3. Look for evidence of antifragility:
   - fast deterministic feedback loops
   - tests at the right seams
   - regression tests for risky behavior
   - deep modules with small interfaces
   - localized change surfaces
   - explicit state machines or discriminated unions
   - documented decisions and domain language
   - ability to debug incidents from stored events/logs
   - low coupling between domain concepts
   - whether fixes naturally improve tests/docs/contracts

4. Apply the architecture lens:
   - Identify shallow modules using the deletion test.
   - Identify modules with real depth, leverage, and locality.
   - Note seams that are real because they have multiple adapters.
   - Note hypothetical seams that add abstraction without payoff.
   - Call out places where understanding one behavior requires bouncing through too many files.

5. Run available verification commands if practical:
   - `bun run typecheck`
   - `bun test`
   - relevant focused tests
   - static searches with `rg`

If you cannot run a command, say so. Do not pretend.

## Scoring

Give separate scores from 0-10:

- Overall codebase quality
- Enterprise readiness
- Antifragility
- Domain modeling
- Architecture/module depth
- Test strategy
- Type safety
- Data integrity
- Security/auth posture
- Operational maturity
- Frontend robustness
- Maintainability/onboarding

Use this calibration:

- 10: production-grade, resilient under real organizational and operational stress
- 8: strong, with manageable gaps
- 6: promising but not yet enterprise-ready
- 4: fragile; quality depends heavily on current maintainers
- 2: structurally risky
- 0: unsafe or incoherent

Penalize unknowns. If an area lacks evidence, score it lower or mark confidence as low.

## Output Format

Return this structure:

### 1. Executive Verdict

One blunt paragraph with:
- overall grade
- enterprise readiness grade
- antifragility grade
- confidence level
- whether you would trust this for paid production users today

### 2. Scorecard

A table:

| Area | Score / 10 | Confidence | Evidence | Main Risk |
|---|---:|---|---|---|

### 3. What Is Strong

List only strengths backed by concrete file references or observed patterns.

### 4. Top Risks

Rank findings by severity.

For each finding include:

- **Severity**: Blocker / High / Medium / Low
- **Area**
- **Evidence**: file paths and line references where possible
- **Why it matters**
- **Enterprise readiness impact**
- **Antifragility impact**
- **Recommended fix**
- **How to verify the fix**

### 5. Architectural Deepening Opportunities

List deepening opportunities using this format:

- **Files/modules involved**
- **Problem**
- **Deletion test result**
- **Proposed direction**
- **Benefit to locality**
- **Benefit to leverage**
- **Testing improvement**

Do not propose huge rewrites. Prefer focused changes that reduce future fragility.

### 6. Enterprise Readiness Gap Analysis

Cover:
- security/auth
- data integrity
- migrations/backups
- observability
- incident recovery
- CI/CD
- operational runbooks
- dependency/runtime risk

### 7. Antifragility Gap Analysis

Cover:
- feedback loops
- test seams
- regression capture
- state modeling
- domain language
- ADR discipline
- blast-radius containment
- debugging/replay ability

### 8. 30/60/90-Day Improvement Plan

Give a pragmatic plan:
- first 30 days: highest-risk fixes
- next 60 days: structural improvements
- next 90 days: hardening and operational maturity

Each item should be actionable and verifiable.

### 9. Unknowns And Audit Limits

State what you could not determine, what commands failed, what areas need deeper inspection, and how that affects the grade.

## Honesty Rules

- Do not give credit for intentions. Give credit for working code, tests, docs, or enforceable contracts.
- Do not average away critical risks. A serious data integrity, auth, migration, or payment risk should cap the enterprise-readiness score.
- Do not praise abstractions unless they provide locality or leverage.
- Do not call something antifragile merely because it is documented. It must improve behavior under stress.
- Prefer direct, specific criticism over generic advice.
- If the codebase is good, say why. If it is fragile, say exactly where.
```
---
# Next big thing
- [ ] Pivot `coffee-finder`
- [ ] Brainstorm with AI for a true `antifragile` & `Fat Tony` (or at least robust) business model. Don't fall into the `green lumber fallacy`. Aim for something with limited losses and unlimited potential.
	- Make sure that you're barbelled, whatever that means in your business.
	- Identify & leverage positive Black Swans in this economy.
	- Exploit the convexity effect
---
# 1-1

> [!important] For pay raise
>
> - The things you think you have done well over the last 6 months.
> - The results of your work. What value did it bring to the business.
> - What would you do differently if we could go back and do it again.

## For The Old Infant

### Escalate with SHUI

> [!important] The play
> ==He can refuse, but every branch must cost him more than paying — and you bank evidence either way.== The amount is never negotiable, **only the schedule**. You're not asking a favor; you're collecting already-deducted salary. Calm, warm, in control: _"I'm okay, you're okay, let's figure things out."_
> Physics on your side: at contract end (Oct) he must pay **everything + late interest** anyway, or the sổ BHXH can't be confirmed. Ignoring you doesn't make the debt expire — it compounds.
#### Pre-send checklist (ALL of these, before the opener)
- **Archive everything off company systems**: contract, payslips, VssID screenshots, every SHUI ping, ==the May 19 letter, your same-evening response, and the full Dave chat threads==. If access is ever cut, the evidence survives.
- [x] **Minh Vu**: confirm whether his SHUI is covered. Decide *now*: this script speaks **solo** ("my own payslip"). A joint front is a different, bigger move — don't drift into it mid-chat.
- [ ] **The number**: `[N]` months × (gross × 10.5%) ≈ `[amount]` of *your* money. (His unpaid employer share is ~21.5% on top — know it, don't lecture it.)
- [ ] **Goal card** (keep beside you): GOAL → first remittance visible in VssID by **Jun 30**; full cure with dates ≤ **Sep 30**; July eval date + criteria locked. TRIGGER → any missed verified date = file, no more reminders.
- [ ] **Calendar the filing date now** (first business day after the first milestone can be missed). Escalation must be the *default*, not a decision you'll have to summon courage for later.
- [ ] Calm weekday morning. Re-read once in the late-night FM DJ voice. Send.
#### The opener — four SEPARATE messages, in order
Wait ~30–60s between them; if he starts typing, stop and let him.

```
1) Hey [Boss]
Before July planning kicks off, I want to properly close out the SHUI (Social, Health, Unemployment Insurance) thing.

2) I know the books fell behind during the crunch, and honestly, the longer it sits, the more awkward it gets between us (which it kinda is as I'm typing this out)
So the plan was always to quietly make it right.
```
```
3) Here's where that leaves things: for the past 7 months (soon to be 8), SHUI deductions have come out of my paycheck every single month, but none of it has ever reached the fund. 
As a result, I still have zero social insurance or unemployment insurance coverage to this day, even though I've been paying into the system the whole time.

And to be clear, this isn't a raise or bonus conversation, it's already my money (as mentioned in my contract), so I'm keeping it completely separate from the comp review.

I'd really like us to land on a concrete plan with actual dates, so the comp review can be a clean conversation about the future rather than getting tangled up with the past.
```

 **Silence, wait for his answers**
 
```
4) I genuinely want to renew my contract and stick around to help deliver the EO project (which I certainly have high hopes for), and I'd like to get this sorted between us before the evals so it doesn't end up coloring that conversation. 
   
   Would it be unreasonable to ask for my SHUI contributions to be paid in full by the end of July? I'm fine with partial payments along the way, as long as we land on a date for getting it fully squared away. And I understand that a full reconciliation of this SHUI thing might not be a viable option right now, so I do have a better alternative in mind as a way to settle this. Let me know if you're interested. 
```
*(No-oriented question — "no, that's not unreasonable" is him saying yes — then the calibrated handoff so **he** authors the schedule.)*
#### Pin it (the moment he offers anything)
Restate whatever he proposes and bolt it down — then ==the trigger, stated once, neutral==:
```
So: [amount] showing in VssID by [Jun 30], the rest by [date]. Putting both in my calendar — I'll check VssID on each date. If it's there, we never talk about this again and the compensation eval is purely about the future. If a date passes without it showing, I'll take it that we couldn't solve this directly and I'll have to go through official channels instead, which, honestly, I'd rather avoid. Bureaucratic paperwork with the government has never exactly been something to look forward to.
```
- **Acceptance floor** (pre-decided — never negotiate it live): first remittance in VssID ≤ 30 days; full cure ≤ Sep 30 (well before contract end); any miss = file.
#### Branch playbook — if he says X, send Y
- **Vague promise** (*"soon, don't worry, I'm on it"*) → "Love it. Which date do I put in the calendar to check VssID?"
- **"After July / we'll sort it with the eval"** → "July is about my next year's value. This is last year's salary that never reached the fund — how do we settle the past first, so July is clean?"
- **Cash-flow sob story** → *(label, then calibrated)* "It sounds like the timing is genuinely brutal right now. What *can* move by end of June, even partial?"
- **"When EO/clients pay, you'll get yours"** → "It was deducted from my salary in months the company *did* get paid — it isn't contingent revenue. What's realistic from this side regardless?"
- **Anger / blow-up** → "Okay — I apologize. Let's go back to where this started feeling unfair and fix that part first." *(then SILENCE — let him fill it)*
- **Guilt-trip** (*"after everything I've done for you…"*) → "Gratitude is why I keep solving this directly with you. It doesn't change whose money it is."
- **"A formal warning last month, and now this?"** → "The May letter has my written response and my full ownership — happy to continue that thread any time. This is payroll: the deductions left my salary in every one of those months, warning or no warning. What's realistic by end of June?"
- **"You should be glad you still have a job"** → "I am glad — and the deductions still left my salary every month. Gratitude and bookkeeping are separate things. Which date do I put in the calendar?"
- **Threatens a write-up for asking** (*"this attitude is going on file"*) → "Noted — and I'll keep this exactly this professional. The question stands: what's realistic by end of June?" *(a write-up that follows a polite payroll request only proves the sequence — keep yours immaculate and date-stamped)*
- **SHUI offered as the raise/bonus** → "Bringing it current is the floor, not the offer — that money was already mine. The eval is about what my work is worth going forward."
- **"Let's hop on a call"** → take it (refusing reads hostile), but bracket it. Before: "Sure. So we use the time well: I'm looking for dates on [N] months of contributions, first chunk by end of June." Same day after: "Confirming what we agreed on the call: [amounts/dates] — correct me if I'm wrong." *(his silence = agreement, on paper)*
- **Cash in hand / "I'll transfer you directly"** → "Appreciate the instinct — it has to be remittance to the fund, visible in VssID. Cash doesn't close the book or count for anything."
- **"Did Minh put you up to this? Who else?"** → "I'm only speaking for my own payslip."
- **Partial counteroffer** (*"half by August?"*) → hold the floor: "First chunk by Jun 30 is the part I can't move — what does the rest of the schedule look like?"
- **"Are you threatening the EO project?"** → "EO gets my best work regardless — that's not on the table. This is about the company's own books."
- **"You'd really go legal over this?"** → "I'd rather we never find out — that's why I'm here in chat. What's realistic by end of June?"
- **Anything surprising** → mirror his last 1–3 words with a question mark, then wait. (*"Restructuring the payroll?"*)
#### Silence & stonewall protocol
- **Day 3 of silence** (working days): "Have you given up on solving this between us?" *(the un-ignorable no-oriented question)*
- **Day 5**: "I'll take the silence as your answer and proceed through the standard channel." → then actually proceed. ==Never send reminder #15.==
- **Open refusal** (*"do what you want"*): "If we can't fix it between us, the next step is the standard one — a BHXH complaint. I'd rather not: that process reviews everyone's contributions, not just mine. It seems like my side of this isn't visible right now." Then stop chatting and execute *If the trigger fires*. Last word stays professional: "Understood. EO work continues as normal on my end."
#### Hard rules
- ==The amount is fixed; only the **schedule** is negotiable.== Never split the difference on money that's already yours.
- No criminal-law / police talk, ever — that's where lawful debt collection starts reading as extortion. Civil words only ("standard channel", "BHXH complaint").
- Never write any sentence connecting EO / the renewal / the rollout to the money. He knows the dependency; writing it adds risk and zero information.
- One label per message, then **silence** (the chat version of the 4-second rule). Never double-text. Never answer your own question.
- His "last warning" makes tone a tripwire — and your shield: every message reads like the politest creditor alive. If paper follows a clean payroll request, the timestamps tell that story on their own. (Never say "retaliation" in chat; let the sequence say it.)
- No "why" questions — use "What caused…" / "How do we…".
- Never bluff: don't name a step you won't take that same week.
- Never sign anything same-day (waiver, "voluntary resignation", cash receipt). "Let me read it properly tonight."
- Screenshot everything, same day, off company systems.
- Every number you send must already be verified (VssID + payslips).
#### If the trigger fires
1. 30-minute sanity check with a labor lawyer or the BHXH support line *(procedure check, not strategy — nothing in the script depends on legal citations)*.
2. File the complaint with the BHXH agency where Edge8 is registered; labor inspectorate next; court last. Bring: contract, payslips, VssID history, chat recaps.
3. Remember the physics: at contract end he owes **everything + late interest** regardless — filing just moves up the date and takes the schedule out of his hands.
#### Vent block — things you'll want to say. ==DON'T.==
*(Feelings honored here so they never reach the send box. Each one converts you from creditor to combatant inside an exhibit he can screenshot.)*
- ~~The cat food / beef jerky "scam" jab + "you love to prove me wrong"~~ → an insult in evidence; instantly the villain.
- ~~"You've been given far more grace than I ever received… the double standard is glaring"~~ → starts a character war; he wins those by rank.
- ~~"I've been doing you favors instead of keeping this professional"~~ → self-undermining on paper.
- ~~"8 chances to make it right" scorekeeping~~ → stale math by now, and scorekeeping invites a rebuttal, not a payment.
- ~~"Hard to see you in the same light / assume good intention" sermon~~ → the BHXH line does this work without the sermon.
- ~~"There's clearly budget to hire new people"~~ → true, but it reads as auditing his spending; the leverage already exists without the jab.
### Warning-letter defense (the May 19 file)

> [!warning] What it is, and what it's for
> A first formal warning (May 19, Mai → you, CC Dave): meeting/lunch attention ×2, the magic links, "failure to return to EO" — plus a "last warning" threat in chat. Paper built ==right before an eval cycle== has one job: to be the July raise-killer and the "you're in no position to make demands" card. Assume it WILL be played.
> Two facts defang it: ==it has zero bearing on SHUI== (deducted salary must reach the fund no matter what anyone's performance file says), and ==you already answered it well== — same-evening ownership + context + three named changes. That response is now *your* exhibit.
> The real trap is the word **"defensive"**: it's pre-loaded so that any pushback confirms the label. So this defense is built to never look like defense: ==agree first, redirect to criteria, let receipts talk.==
#### If he plays it (the aikido, in order)
1. **You raise it first** (accusation audit — deny him the reveal): "Before we get into the year — you might be thinking about May. Let's start there so it's not sitting under the table."
2. **Own → convert**: "You gave me direct feedback. I owned it in writing that same evening and changed three things: presence over context-switching, real prep for client-facing settings, and flagging overload early instead of absorbing it silently. Since May 19: no repeats — and the year shipped [EO renewal / chapters live / onboarding + auth]. To me that letter is the best evidence in this room that feedback I'm given turns into changes you can see."
3. **Proportion** (calibrated — HE does the math): "What's the fair way to weigh three weeks in May against the full year of delivery?"
4. **Still anchoring on it** → label + silence: "It seems like May has become the lens for the whole year."
5. **Flat "no raise — you got a warning"** → convert the denial into a contract: "Okay. What specifically would need to be true by September for this to be a yes? Let's write it down — if I hit it, we reopen before renewal."
6. **No criteria offered** → "How am I supposed to commit to another year without a path that exists on paper?" If still nothing, that's your answer about the whole game: the floor (47.5), and the market are the rest of the conversation. ==No deal is better than a bad deal.==

**Side-branches:**
- *"You're being defensive again"* → "You're right that I can push back fast. So here's me not doing that: what makes this a yes by September?"
- *He quotes the chat ("you told your CEO to test it himself / who do you think you are?")* → one clause of ownership, then pivot: "Fair — I'd phrase that differently today. Same week, the QA items were green in the tracker; both things are true. What matters for this conversation is what the year produced."
- *It surfaces in the SHUI chat instead* → the warning branches in the playbook above; the lanes never merge.

#### Never do
- ~~Relitigate items 1–4 point by point~~ → turns the eval into a trial of May; he wins those by rank, and "defensive" gets confirmed for free.
- ~~Defend the chat tone beyond one clause~~ → lengthy justification is how the label sticks.
- ~~Volunteer the receipts unprompted~~ → a rebuttal offered before the attack reads as guilt.
- ~~Say "retaliation" / "hostile" / anything legal-flavored about the letter~~ → that card belongs to the inspectorate stage, not chat.
- ~~Mock the lunch-attention item~~ → padding in a formal letter *does* signal a thin file; knowing it is leverage, saying it is war.
### July raise card

> [!important] Sequencing
> Send the process-pin **a few days after** the SHUI dates land — never in the same conversation. If SHUI isn't pinned by late June, July prep continues anyway; the two tracks must never blur.

**Pin the process now (chat):**
```
Separate thing, much happier topic — for the July evals: what date are we doing mine, and what will you be looking at to size it? I want to bring receipts, not vibes.
```
*(Locks date + criteria in writing — and his answer tells you whether July is real. If fuzzy: "What does a strong result look like in this seat between now and then?")*

**Prep for the live conversation:**
```
Core tenet: assume good intentions
	- His good intentions: want me to grow, to be a better person
	- I know you may see me as more of a pain in the ass than someone perfect for the role. But if you can assume my behaviors as "for good intentions", what would that look like?
	- Right, I've never wanted to be a blocker in your way, nor did I ever wanted to hurt your feelings. It's just that I made some mistakes, and mistakes are an essential part of learning, right? Tbh, I would much rather fail gloriously than never risk making mistakes.
	- And to be fair, none of my mistakes were detrimental to the company's growth, they're more like annoying pet peeves that were part of my oversights.
```
- Answer his three questions (callout above) in a doc, with numbers: chapters shipped, the EO renewal, onboarding/auth fixes, middleware — value to the business, not effort spent.
- Ask: _"What does it take to be successful here?"_ — advice given = a personal stake in your success.
- Define, in the meeting, the metrics for the *next* raise.
- He said "bonuses": a bonus is one-time, the raise is the base. ==Don't let one substitute for the other.==

**Pre-empts (have ready, use only if needed):**
- If he lowballs "because the arrears hit the budget": "Arrears were last year's payroll cost — booked the day it was deducted. July is about next year."
- Expect ==zero goodwill credit== for repaying what he owed. The case is EO value only.

**Ackerman card** (floor **47.5M gross** — your own note; target **52M**):
- Let *him* anchor first. If forced to name a number, give a range: "Given what this seat carries now, I'm looking at **58.5–64.5M** as the market band." (He'll grab the low end — 58.5 is still above target.)
- Concession ladder if bargaining down from 64.5: **64.5 → 56.8 → 53.4 → final 52.35** (decreasing steps; pause ~5s before the odd final = "thoughtful calculation, I'm at my limit").
- Below 52.35: trade, don't slide — non-monetary asks: title bump, explicit remote/flex, training budget, the July bonus itself.
- Below **47.5M**: _"I'm sorry, I'm afraid I just can't do that."_ — and mean it. Contract ends in October. ==Never be needy for a deal.==
---
# EO

> [!info] Intro
>
> - I’m a software engineer over at Edge8, on Dave's team, and I'm the guy who carries out the HubSpot technical implementation for EO chapters.
> - I figure it's a good idea to join the meeting, see what you guys are talking about so I get what I'm about to do for the next couple of months.

## Prompts
- General `next-steps.md`: 
	- I need you to optimize the `next-steps.md` file so that I can start a fresh Claude Code session with this simple prompt: "Read @docs/plans/next-steps.md to follow its instructions" and it will know EXACTLY what to do, as well as keeping @docs/plans/next-steps.md up-to-date as it goes.
## Key metrics
- Chapters are able to track their two levers of growth, member retention and member acquisition with a goal of 8% NET new growth every year.
- The leading indicators of this is <u>data cleanliness</u> and `number of leads` to `number of opportunities` from a deal funnel perspective → more deals → more potential for more money.
- Check [this](https://chatgpt.com/share/e/698078bc-a34c-8009-bd8d-a53183e6de0f) out.
- As we're part of EO Global, ==we'd know we hit the mark when we roll out chapters and they have a high rate of satisfaction.==
- EO renews in June. High success means they hire more and expand.
- We are on track to do 60 chapters by the end of the year.

## For Global
### Lifecycle Stages map
- `Public` → `Lead`
- `Applicant` → `MQL`
- `Participant` → `Opportunity`
### Main goals
- Intake leads and seamlessly run local and global processes that convert them to members (this implies visibility at each level).
- Help chapter managers effectively run local processes related to their members and non-members.
- Help global professionals effectively run global processes related to their members.
### Short term
1. Spin up a brand license for EO Vietnam.
2. Explore how we would move the Member Acquisition funnel into it.
3. Explore how we would connect the local member acquisition funnel to the global.
4. Application form and approval process will be managed in HubSpot for all chapters, with global approval handled via portal or middleware as needed.
5. Update Deal/Contact owners accordingly for EOVN Prod.
#### Normalization
- Track member events with custom `Event` object and API to sync from external services
- `Forum`, `Member Feedback` custom object
- No need for the custom `Application` object
- Figure out what are they're trying to achieve with the [existing workflows](https://docs.google.com/spreadsheets/d/19I0Vu0pmOjyoCbYoy4KAMTr--K9Bkh_4/edit?usp=sharing&ouid=118330895762225798973&rtpof=true&sd=true):
  - See the workflow descriptions and then maybe fill in the missing ones.
- See how the Lifecycle Stages in EOVN can be mapped to EO Global.
  > The big question is: what's the actual cost if we reset EO Global and start over. Build the new objects (and their props) according to our suggested data model and see if data syncing with Altai works with it.
## For Chapters
- Prefer native HubSpot props if they're asking about data. Tell them to refer to the data dictionary before making changes to the props or pipelines.
- See how they're working with their existing stages and propose something [like this](https://docs.google.com/spreadsheets/d/1_fXks4xySVRB8DKgZbvaZ7zFzTglXM6WlxkF1fGb5sg/edit?usp=sharing)
- Ask about the seats and their permission once they accept their invitations and poked around.
- Check out the template and the checklist.
## Altai sync with HubSpot
- [Overview](https://eonetworkorg.sharepoint.com/:w:/r/sites/Hubspot/Shared%20Documents/General/Sharable%20Resources/Standing%20Hubspot%20Dev%20Call%20Transcripts.docx?d=wd4b3171e5bcf4391bc6ccf265fcee3d9&e=4%3a8c8f2b42468e4b798d1f86dc24241131&sharingv2=true&fromShare=true&at=9)
- Altai is the system of record for all EO Global data — members, chapter staff, companies, SAPs, etc.
- Altai syncs this data into HubSpot (new data model) so the marketing team can run campaigns against the full member base. 
- For the 60 rollout chapters, HubSpot manages the pre-membership funnel and non-membership programs — Lead and Prospect tracking — via the external UI used by chapter staff and officers to move applicants through stages and approve members.
- Once a prospect converts to a member in HubSpot, that record syncs back to Altai as the official member record.

> So the flow is: Altai → HubSpot (existing members) and HubSpot → Altai (new members, post-approval).
### Questions
- Which `Current Status` do we need to set a new converted member from HubSpot prospect to? Currently, it's set to `Approved Applicant` by default and we can't find a way to overwrite that.
	- What's the correct API-driven way to transition a new `altai_mbr_participant` from `Approved Applicant` to `Active`? Is there a custom action, or a specific field (like `altai_pipelinemanager`) to set?
## Events syncing between services
- Request Wix & Hivebrite APIs
- Middleware: mainly for global approval, especially for chapters not using HubSpot directly.

# Misc
## Altai
- Sync mkt lists to prod

