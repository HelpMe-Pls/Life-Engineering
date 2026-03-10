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