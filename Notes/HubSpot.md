# Internal Names vs Labels
- Internal Name: The actual column name in the DB (immutable after creation, used in API/integrations). Example: `mobile_phone`
- Label: The display name in UI (can change anytime). Purely cosmetic. Example: `Mobile Phone`
- The Trap: You might see two fields labeled `Mobile Phone` in the UI. One might be the Core HubSpot property (`mobile_phone`), and the other a custom junk property. (`mobile_phone_number`). You must check the Internal Name to distinguish them.
# Terminologies
- `Prospect` = `Lead` (no `Deal` created yet)
- `Opportunity` = a `Contact` associated with a `Deal`
- `Customer` = a `Contact` with at least one closed won `Deal`