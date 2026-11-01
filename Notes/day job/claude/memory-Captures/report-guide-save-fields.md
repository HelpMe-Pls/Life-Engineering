---
name: report-guide-save-fields
description: "Step-by-step HubSpot report/dashboard creation guides must give, for every report, the Save dialog's tag and a one-sentence description (the user's ask, 8 Oct 2026); also the builder's real labels"
metadata:
  node_type: memory
  type: feedback
  originSessionId: cd517812-0b8f-4c9c-8cf1-1ba8da40a575
  modified: 2026-10-26T09:42:46.584Z
---

Every step-by-step guide for building HubSpot reports or dashboards gives each report its exact name, its tag and a one-sentence description to paste into the Save dialog's Description box, in place of HubSpot's generated text. The dashboard gets one too: the settings icon at the top right opens Dashboard settings, which holds Dashboard description, the "Show description on the dashboard" box (tick it) and Tags. For the APAC Region dashboard the sentence echoes Dave's own ask: "A prototype that shows where each APAC chapter is doing well and where it is struggling, at lead gen or at closing, in the Member Acquisition pipeline." The tag for EO dashboards aimed at Dave or regional growth directors is "Leadership". EO's portal has 3 report tags: Leadership, MSC and Renewals. MSC is EO's Member Services Centre, a team of about 40 support staff in the portal whose owner records carry names like "MSC Regional Service Delivery". Renewals covers membership renewals.

**Why:** on 2026-10-08, while saving the first APAC report, the user asked which tag to pick and for one description sentence. They then asked that future dashboard guides include the descriptions.

**How to apply:** in the guide's report table, put the description under the report name. Write it as one plain sentence saying what is counted, how it is split and what is left out. Use the builder's real labels, which the user hit on 8 Oct:
- Visualization starts as "Table", with Columns and Fields slots. Switch it to "Vertical bar" before X-axis, Break down by and Y-axis appear.
- The measure is "(Count) deals" under Default measures.
- Other properties are found with "Search across sources".
- Leave the filter's "Include records where … is empty" box unticked.
- The Save dialog has Report name, Tags, Description, then "Add this report to a dashboard?".
- EO's portal has no property quick filter on dashboards, checked on 8 Oct 2026. The "+ Quick filters" button opens only "Dynamic quick filters" (Date range, Owners, Teams), and they are greyed out unless the dashboard holds a single-object report; reports from the new builder don't count. The "Advanced filters" panel has no Quick filters tab, and its filters apply only to the user who sets them. So never promise a chapter quick filter: put the chapter filter inside each report, and viewers hide chapters by clicking legend names. HubSpot's help article describes a Quick filters tab that this portal lacks.

See [[apac-regional-dashboard]].

**A saved report's description IS editable: the report viewer (reports-list/<portal>/<id>), right panel, collapse Settings, expand About, the pencil beside Description, then Save (toast "... was updated."). Khôi showed it on 26 Oct 2026; the 19 Oct note that said "never" was wrong, so never offer Save as new report or a report swap just to change a description.** Avoid the editor's Generate link (HubSpot AI). The custom builder's pencil edits the name only, and the Actions menus offer Rename only, which is why 19 Oct missed it. Opening the viewer can add an AI Report summary by itself. The dashboard's own description is editable in its gear > Dashboard settings. The funnel builder opens from a dashboard card's More actions > Edit in Report Builder (journey-builder/<portal>?reportId=<id>&dashboardId=<id>); its saved filter shows as "Filtered deals (n)".
