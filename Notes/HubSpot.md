# Internal Names vs Labels
- Internal Name: The actual column name in the DB (immutable after creation, used in API/integrations). Example: `mobile_phone`
- Label: The display name in UI (can change anytime). Purely cosmetic. Example: `Mobile Phone`
- The Trap: You might see two fields labeled `Mobile Phone` in the UI. One might be the Core HubSpot property (`mobile_phone`), and the other a custom junk property. (`mobile_phone_number`). You must check the Internal Name to distinguish them.
# Terminologies
- `Lead` = no `Deal` created yet
- `Prospect` = `Opportunity` = a `Contact` associated with a `Deal`
- `Member` = `Customer` = a `Contact` with at least one closed won `Deal`
# Teams vs Brands
- Use **Teams** for org structure and access control (record permissions). Everything else can be approximated with conventions and custom properties. Brands is not the lever for CRM record access. A Team can include users who have access to multiple Brands.
- Use Brands primarily for: organizing marketing assets and brand-level subscription/preferences behaviors (where applicable). A Brand can be worked on by users from multiple Teams.
- Both **Brands** and **Teams** coexist inside **one single HubSpot portal**.
# Setting up new portals
- [ ] Config `Account Defaults`, users (seats) & permission
- [ ] Create custom props
- [ ] Create the corresponding data dictionary
- [ ] Create pipelines (with required `Closed Lost Description` rule for any `Closed Lost` stage)
- [ ] Confirm Lifecycle Stage & Deal stage mapping
- [ ] Create forms & emails
- [ ] Create reports & dashboards
- [ ] Create workflows
- [ ] Import data
- [ ] Handoff doc
# Trackers for lead scoring (out of 100)
- Fill in our form
- Joined our events
- Read our emails
- Which page on our website they visited our EO site & their bounce rate
	- Good for personalization
- Gave us their phone number
- Their social media interaction
- Example: lead score = 25 → MQL; lead score = 100 → SQL; qualification passed → Opportunity → Moved into the `Member Acquistion` pipeline
## What to do about it
- Set up workflows based on the conditional triggers mentioned above
	- Tailor the campaigns based on their interactions and interests.
	- Segmenting the contacts based on that would be a good start.
# Notes
## April 15th 
- 26:00 → Add an extra stage to the pipeline
- 30:00 → HubSpot - Altai flow. Member's *source* is always Altai.
- 35:00 → How members flow back from Altai to HubSpot. Your highest priority now.
- 40:00 → Move EOVN to global
- 42:00 → What HubSpot is *actually* needed for
- 46:00 → Events
- 50:00 → The (wishful) centralized db for Events
