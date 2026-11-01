---
name: import-duplicate-deals
description: "Duplicate deals that chapter imports made in EO's HubSpot (checked 19 Oct 2026): 1,626 deals under 573 names, by chapter and import, and Khôi's private view 74944438 that lists them"
metadata:
  node_type: memory
  type: project
  originSessionId: a0ae6d2c-6d1f-48d6-b6a8-b83f20f5617b
  modified: 2026-10-26T09:28:43.101Z
---

Checked 19 Oct 2026 over all 2,512 imported deals (Record source = Import). The rule: two or more imported deals with the same deal name, ignoring case and spaces. Result: 573 names, 1,626 deals, so about 1,053 copies to remove if each name is one real application.

- Adelaide 921 deals from 4 imports: "Deals and Contacts (Paste)-2" (30 Jun, no Assigned Chapter), "July 02 EO Adelaide deal", "Deal Adelaide" and "Deals and Contacts (Paste)-3" (both 6 Sep, 16 minutes apart).
- Melbourne 588: "EO Melbourne Deals and Contacts23Jun" and "EO Melbourne deal update" (1 Jul), every deal twice.
- Vietnam 90: "EOVN_deals-migration_060526.xlsx" (6 May) and "[EOVN] Deals_Member-Acquisition_2026-06-22.csv".
- Queensland 23, Perth 2, Atlantic Canada 2: repeats inside one import ("2906 EO QLD deal", "Eo Perth Deal", "EO Atlantic Deal"). These, the 3 QLD deals named "- Membership" and the repeats inside Adelaide's Paste-2 may be two real applications.

The import name is the deal property Record source detail 1 (hs_object_source_detail_1).

Khôi's private saved deal view "Duplicate deals from imports" (view 74944438, renamed 19 Oct 2026 from "Duplicate deals at Global Approval") lists exactly the 1,626. Group 1: Record source detail 1 is any of the 6 Melbourne and Adelaide imports AND Deal name is none of "Delete this", "Damilola Ogundolie" and "Aaron Danicek" (the 3 deals in those imports that aren't duplicates). OR Group 2: Deal name is any of 57 names (the Vietnam, Queensland, Perth and Atlantic Canada repeats). All Pipelines, sorted by Deal Name, with a Record source detail 1 column. For working one chapter at a time, the view also has a saved quick filter, Record source detail 1 is equal to any of <that chapter's imports>, which narrows the advanced groups (AND, tested 19 Oct: Vietnam 90, Adelaide 921, Melbourne 588). It is saved set to Melbourne's two imports. It holds every copy, the keeper too, so select-all-delete would wipe both. A static deal segment would be more exact, but the HubSpot connector's manage_segment needs Khôi's explicit yes, and he didn't answer when asked on 19 Oct.

**Melbourne's copies gone (read 19 Oct 2026, 15:12 Vietnam time, HubSpot MCP).** The import "EO Melbourne Deals and Contacts23Jun" holds 0 deals; all 294 Melbourne deals now come from "EO Melbourne deal update". Deals in all: 2,242 (Member Acquisition 2,182, Member Renewal 1 test deal, Accelerator 38, SAP 21); Region Asia Pacific 1,768 (Adelaide 666, Queensland 537, Melbourne 294, Vietnam 168, Sydney 53, Perth 50), not the 2,061 of 18 Oct. The read tools cannot see who removed them; the tracker's parked line still says they wait for Dave's call. Any APAC figure quoted from 18 Oct (funnel, Melbourne's days in stage) may have moved.

**Hidden on the Regional dashboard, not deleted (26 Oct 2026, Khôi's ask before the demo).** Its 4 deal reports ("Regions: ...") now also filter Assigned Chapter is known, so the 258 unowned "Deals and Contacts (Paste)-2" copies (257 named like an EO Adelaide deal, plus "Delete this") and Israel Canamar's 2 test deals no longer show as (No value). The copies still exist. The same day Members by chapter and Renewals by chapter got Primary Chapter - Name is known (hides 604 and 627 members with no chapter name), and Renewals also Latest membership end date is known (82 more); both descriptions were edited to say who is left out. The sprint-42-review.html After the demo box records these filters.

Related: [[dave-card9-ask]], [[sow1-priority2-scoping]], [[apac-regional-dashboard]].
