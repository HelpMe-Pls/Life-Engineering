> [!important] A friendly reminder
> If you're still getting paid each month + have access to AI, you're still winning. EVERYTHING ELSE is noise.

- Last Friday the team aligned on the goals for this sprint.
- Today I'm gonna work with the team to set up Adelaide in global.

> [!warning] Chewsday ping
>Just flagging again: there's a contract violation around SHUI owed ever since I came on full-time.
>Don't get me wrong, I'm incredibly grateful for this job, but baseline expectations need to be honored.
>I'm not gonna let this slide until we get it resolved, or at least have a date to work toward :-)
---
# EP
> [!important] For prompts
> - Remove line clamps so that every bullet/paragraph is one logical line, and the text reflows correctly in any input box
> - To update skills globally: 
> 	- `bunx -y skills@latest add mattpocock/skills -g`
> 	- `bunx -y skills@latest update -g -y`


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
Follow up after a day or two:
- Have you had a chance to think about how we get this one caught up?
- Have you given up on solving this one between us?
 
```
Would it be unreasonable to ask for my SHUI contributions to be paid in full by the end of August? I'm fine with partial payments along the way, as long as we land on an actual date for getting it fully squared away. And I understand that a full reconciliation of this SHUI situation might not be a viable option right now, so I have a better alternative in mind to settle this. Happy to jump on a quick call to discuss it if you're open to it. 
```
*(No-oriented question — "no, that's not unreasonable" is him saying yes — then the calibrated handoff so **he** authors the schedule.)*
#### Pin it (the moment he offers anything)
Restate whatever he proposes and bolt it down — then ==the trigger, stated once, neutral==:
```
So: [amount] showing in VssID by [Jun 30], the rest by [date]. Putting both in my calendar — I'll check VssID on each date. If it's there, we never talk about this again and the compensation eval is purely about the future. If a date passes without it showing, I'll take it that we couldn't solve this directly and I'll have to go through official channels instead, which, honestly, I'd rather avoid. Bureaucratic paperwork with the government has never exactly been something to look forward to.
```
- Let me tell you something, tell me how it lands. What I actually care about is being made whole. If the full reconciliation of this SHUI situation might not be a viable option right now, the other clean way is forward: bring my comp up to `65M` starting next month and into the renewal. With that, I'm happy to stop chasing the back-SHUI — no paperwork, no awkwardness, we both move on.
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
- Generate a meeting summary based on `this transcript`. Refer to the `Sample` for the desired output.
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

