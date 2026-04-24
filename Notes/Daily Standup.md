My standup report for the day:
- Last Friday I reviewed the Chapter & Global approval process for prod.
- For today, I'll start working on the workflows cleanup in prod to prepare for EOVN's real data import.

>I want to flag what appears to be a contract violation, specifically, outstanding SHUI owed ever since my start date as a full-time employee.
>No hard feelings, it's just business.
>Once this is squared away, the company gets its five-star rating back (as it should), and I'm genuinely looking forward to that :-)
---

# 1-1

> [!important] For pay raise
>
> - The things you think you have done well over the last 6 months.
> - The results of your work. What value did it bring to the business.
> - What would you do differently if we could go back and do it again.

## For the record
- I don’t think I’ve gotten any extra updates from EO about the tasks.
- But if I had to sum it up, I’ve realized one of the hardest parts of my job is balancing chapter accessibility with CRM best practices to keep the system maintainable and scalable.

> I'm aware that the outcome is what we're aiming for, but a lot of stuff affects outcomes, whereas if we judge your performance purely based on your output, which is something that you have full control of, then I'm pretty sure that you're the one who's setting the standard for everyone here.
> You too. To be fair, if I were the boss, I'd have doubled your salary by now. You deserve so much more than this; considering all the things you've done for the company so far.

---
# EP
- Refer to the @plans/sonarqube-warnings-refactor.md file and proceed with the "To-do before starting Phase 5" section. Once you're done with that, keep going for the rest of Phase 5. Make sure that your implementation conforms to the conventions set in /react-router-framework-mode and modern TypeScript best practices so that the latest code is OPTIMIZED for readability, maintainability, and scalability (antifragile), leaving no dead (or unreachable) code and no Sonarqube warnings along the way. Utilize the existing skills and plugins in your repertoire to help you with this.

> [!important] Conventions
> - No-dead-code discipline
> - Minimize defensive/unnecessary logical check or type assertions
> - Optimize for readability, maintainability, and scalability (antifragile)


---
# Next big thing

- [ ] Pivot `coffee-finder`
- [ ] Brainstorm with AI for a true `antifragile` & `Fat Tony` business model

---
# HubSpot

> [!info] Intro
>
> - I’m a software engineer over at Edge8, on Dave's team, and I'm the guy who carries out the HubSpot technical implementation for EO chapters.
> - I figure it's a good idea to join the meeting, see what you guys are talking about so I get what I'm about to do for the next couple of months.

## Key metrics
- Chapters are able to track their two levers of growth, member retention and member acquisition with a goal of 8% NET new growth every year.
  - The leading indicators of this is <u>data cleanliness</u> and `number of leads` to `number of opportunities` from a deal funnel perspective → more deals → more potential for more money.
  - Check [this](https://chatgpt.com/share/e/698078bc-a34c-8009-bd8d-a53183e6de0f) out.
  - As we're part of EO Global, ==we'd know we hit the mark when we roll out chapters and they have a high rate of satisfaction.==
  - EO renews in June. High success means they hire more and expand.
  - We are on track to do 60 chapters by the end of the year.

## For Global
### Lifecyle Stages map
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
- 