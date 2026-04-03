- Thanks, `name`. Good morning everyone. Yesterday I was building the proof of concept app and connect it to our HubSpot sandbox to prove that it's possible to update the contacts' lifecycle stage from a non-HubSpot UI.
- So for today I'm gonna add the final touches and deploy the app to Cloudflare to see if it works. 

> Proper INSURANCE compliance is literally the BASELINE expectation. I'm pretty sure that I'm not the only one impacted by this, so I urge you to honor our contracts and resolve this IMMEDIATELY. Rent's due.

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

# MVP `coffee-finder`

- [ ] ADR & ggl-maps APIs

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
### Main goals
- Intake leads and seamlessly run local and global processes that convert them to members (this implies visibility at each level).
- Help chapter managers effectively run local processes related to their members and non-members.
- Help global professionals effectively run global processes related to their members.
### Short term
1. Spin up a brand license for EO Vietnam.
2. Explore how we would move the Member Acquisition funnel into it.
3. Explore how we would connect the local member acquisition funnel to the global.
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
