---
name: afk-prompts-confirm-bulk-writes
description: Khôi, 17 Oct 2026 - an AFK run in live HubSpot only prepares (nothing on, published or sent) and must stop and ask before any bulk change to existing records, such as the lifecycle stage move HubSpot makes when deals are created
metadata:
  type: feedback
---

An AFK prompt that builds in EO's live HubSpot makes the session prepare only: it builds the pieces, and it turns on, publishes and sends nothing. Before any step that could change many existing records at once, it stops, does not commit the step, puts it first among the 🧑 items and asks Khôi in its last message. The case that set the rule: renewal deals would be most members' first deal, and HubSpot's portal-wide setting "Set lifecycle stage when a deal is created" would then move about 19,900 members to Opportunity.

**Why:** Khôi, 17 Oct 2026: "make sure that the AFK prompts aware of this lifecycle stage bulk update and ask for confirmation BEFORE committing to the write. The end goal of that AFK run is to only build out the components to PREPARE for the actual e2e flow (i.e. not turning anything on or publish anything yet)".

Accepted exception (17 Oct): a write that HubSpot computes from Altai's data, such as the Latest membership end date rollup over the Chapter Memberships the Altai sync writes (Khôi: "as long as this new "Latest membership end date" field (and its value) on contacts is pulled from Altai, it's safe to be written"). Make the prompt prove the value comes from Altai (here: only memberships carrying Altai's crm_id) before it saves.

**How to apply:** when writing or revising an AFK prompt, look for side effects HubSpot makes by itself (lifecycle stages, contact fields filled by deals, rollups, list membership, report counts) as well as the session's own clicks. Name each one in the prompt with its count, give the session a stop-and-ask rule for it, and put the confirmation before the switch-on step, for example as a workflow's placeholder lock. Related: [[afk-prompts-keep-files-current]], [[claude-in-chrome-afk-facts]], [[sow1-priority2-scoping]].
