# HVAC-BRIEF — §1.1 one-trade lock brief (DRAFT)

> [!warning] Status: DRAFT — evidence assembled by AFK research agent, 2026-07-16.
> ==The lock decision is yours, not this document's== ([[Antifragile SaaS]] §1.1). This page assembles pass/fail evidence per criterion; you read rows (f) and (g), then write the lock sentence (see [[HITL-WALKTHROUGH]]). Every claim below carries its source; nothing is invented.

**Trade under evaluation:** HVAC / refrigeration (runbook candidate #1).

## The criterion table

| # | Criterion ([[Antifragile SaaS]] §1.1) | Call | Evidence (one line — detail in sections below) |
|---|---|---|---|
| a | Mandated recurring credentials with hard expiry | **PASS** | TX contractor license: 1-yr cycle, $65 + 8h CE/yr (TDLR's own pages); TX technicians "valid for a period of 1 year" ($20/$35); CA C-20: 2-yr; FL: 2-yr + 14h CE; CPR/First Aid: 2-yr (AHA); AU ARCtick: 1/2/3-yr renewals. 20,371 dated expiries in hand from one state file. |
| b | 15–80-staff firms with an ops manager | **PASS (directional)** | ~117–120K US HVAC contractor businesses, ~604K employees (IBISWorld/Workyard 2026) — avg ~5 staff, so the ICP is the minority mid-size slice; still thousands of firms on any few-% cut of a 120K base. Exact size-band counts blocked (Census API needs key — no-signup rail). |
| c | Findable watering holes | **PASS** | Live venues verified 2026-07-16: HVAC-Talk, ContractorTalk, ACCA, PHCC, ASSP, HVAC School FB group (~139K), Refrigeration-Engineer, HVAC Business Owners FB groups — see [[COLD-MAP]] part 2 for each venue's rules. |
| d | US/CA/AU English | **PASS (US verified; AU analog verified; Canada unresearched)** | US = home market (this file); AU: ARCtick refrigerant-handling licences renew on 1/2/3-yr terms (arctick.org) — same clock pain; Canada left for later, flag only. |
| e | You can stomach talking to them for years | **HUMAN CALL** | Evidence only: the diaspora affinity is real — Vietnamese-language HVAC classifieds exist in every target metro (kinhdoanhusa.com, vietlist.us), and archetypes like Stephan's Home Comfort (founder Hung Nguyen, Little Saigon since 1988) are exactly your §0.5 "Trần's Cooling & Heating." Whether YOU want a decade of these conversations is yours to answer. |
| f | **GATING — the EMPLOYER holds the renewal burden** | **PASS (evidence below)** | OSHA fines land on the employer (max $16,550/serious violation, unchanged for 2026); TDLR: "ACR companies must employ an ACR contractor in each permanent location"; techs' 1-yr registrations must be current for the company to staff jobs; CPR/OSHA/A2L are company-scheduled; GC/insurer prequal audits company records. |
| g | **GATING — cold list accessible AND terms permit solicitation contact** | **PASS (verified live, two caveats)** | `tdlr.texas.gov/dbproduction2/ltairref.csv` downloaded 2026-07-16: 3.64 MB, 20,371 rows. TDLR publishes it for public download; site terms restrict only logos + posting on TDLR's own social pages; Texas PIA is purpose-blind (§552.222). ==Caveat 1: every address/phone field in the file is EMPTY (0/20,371)== — contact enrichment is a per-company step. Caveat 2: data.texas.gov 403-blocks scripts (browser-only mirror). |

## (f) The renewal stack — what actually recurs, and who carries it

==Fact discipline first: EPA-608 NEVER EXPIRES.== It is a lifetime certification ("Section 608 Technician Certification credentials do not expire" — EPA, epa.gov/section608/section-608-technician-certification-requirements). In the product and every pitch it appears ONLY as a **permanent audit record** (auditors still demand proof of it) — never as a renewal. One misstatement here kills a demo ([[Antifragile SaaS]] §0.5).

The credentials that DO recur, with sources:

| Credential | Cycle | Who carries the burden | Source |
|---|---|---|---|
| TX ACR **contractor license** | 1 year; $65 + ==8h CE incl. 1h TX law== before expiry | The license is the company's permission to operate — "air conditioning and refrigeration contracting... must have a TDLR license and ==ACR companies must employ an ACR contractor in each permanent location==" | tdlr.texas.gov/acr/contractor-renew.htm, /acr/acrce.htm, /acr/acr.htm (fetched 2026-07-16) |
| TX ACR **technician registration / certification** | "valid for a period of ==1 year== from the date of issue"; $20 / $35 | Individual designation, but the company can't dispatch a tech whose registration lapsed — ops manager tracks the fleet | tdlr.texas.gov/acr/technician-renew.htm |
| CA **C-20** contractor license | 2 years ($450 timely, 2026); no CE | Company license; bond + workers-comp on file at all times or auto-suspension | cslb.ca.gov (C-20 classification); permitflow.com/blog/california-hvac-license |
| FL HVAC contractor license | 2 years + ==14h CE== (incl. 1h each: safety, workers comp, business practices, laws/rules, building code) | Company qualifier's license; firm can't contract without it | tradesmance.com/florida-hvac-continuing-education; goldcoastschools.com |
| **First-aid / CPR** (AHA et al.) | ==2 years==, no grace period | Employer-mandated (site/GC/insurance requirements); company schedules the class | cpr.heart.org; redcross.org/take-a-class/cpr/cpr-training/cpr-renewal |
| **OSHA 10/30 cards** | Federally: never expire. But ==NYC SST requires OSHA-30 within the last 5 years==, several jurisdictions mandate 5-yr refresh, and many employers/GCs impose 3–5-yr internal refresh | The refresh requirement is imposed ON the employer (site access, contract prequal) — exactly the "company-mandated item" §1.1(f) asks for | osha.gov/training/outreach; lancastersafety.com (state-by-state) |
| **A2L refrigerant training** (R-454B/R-32 wave) | No federal cert exists — ==EPA 608 still covers A2L service legally==. The wave is market-mandated: from Jan 1 2026 new resi/light-commercial systems can no longer use R-410A (AIM Act Technology Transitions), and ==manufacturers, distributors, and building owners require documented A2L safety training== (ACCA and AHRI recommend; ACCA sells the course) | Employer must train + equip the whole fleet and keep the training records auditors/insurers ask for | acca.org/education/a2ltraining; mideacomfort.us 2026 transition guide |
| **Insurance / GC prequal refreshers** (ISNetworld, Avetta et al.) | Rolling — prequal profiles demand current training records | Squarely the company's: the office manager feeds the portal or the firm loses the contract | [[Antifragile SaaS]] §7 Managed tier is built on this reality |

**The AIM Act tailwind, stated honestly:** as of ==Jan 1 2026==, EPA's Emissions Reduction & Reclamation rule (40 CFR 84.106, under AIM Act subsection (h)) applies leak-repair duties to appliances with ==15+ lbs== of HFC refrigerant — down from the old 50-lb §608 threshold. Leaks above threshold must be repaired within 30 days; chronic leakers (125%+/yr) get reported to EPA by March 1. ==Nuance you must keep: residential and light-commercial AC/heat-pump systems are EXEMPT== — the new audit surface lands on commercial refrigeration and larger systems, i.e. the refrigeration side of the trade. More regulated systems → more certified-tech work + more recordkeeping → more audit exposure for exactly your buyer. (EPA fact sheet: epa.gov/system/files/documents/2026-01/er-r-fact-sheet-leak-repair-2026-01-13_1.pdf; ecfr.gov 40 CFR 84.106.)

**Why the burden nets out to the EMPLOYER** (the criterion's actual question): the state fines and stop-works attach to the company's license-to-operate; OSHA cites the employer, not the worker (==max $16,550 per serious violation — 2026 kept the 2025 figure, osha.gov/penalties, memo 2026-05-21==); GCs and insurers audit the company's records, not the individual's wallet. Individual items exist (a tech's own registration) — but ==the operational risk of any lapse is the company's==, which is why Sarah's spreadsheet exists ([[Antifragile SaaS]] §0.5). Contrast: electrician journeyman CE is the individual's own license journey — the runbook already scores it weak on (f).

## (g) The cold list — verified live, terms read

**Download verified 2026-07-16:** `https://www.tdlr.texas.gov/dbproduction2/ltairref.csv` → HTTP 200, ==3,642,314 bytes, 20,371 data rows==, updated daily per TDLR ("The files are updated everyday and saved in CSV format" — tdlr.texas.gov/LicenseSearch/licfile.asp, which also lists sibling files: ==All A/C Technicians 10.26 MB, Registered 9.62 MB, Certified 0.63 MB== — roster-level data exists for later phases).

**Columns exposed:** LICENSE TYPE, LICENSE NUMBER, LICENSE EXPIRATION DATE, COUNTY, NAME (licensee), BUSINESS NAME, BUSINESS COUNTY (+code), LICENSE SUBTYPE (class codes A/B × E/R/C), CONTINUING EDUCATION FLAG, plus address/phone/zip columns. ==Finding: every address, phone, and zip field is EMPTY — 0 of 20,371 rows carry contact data.== There is no license-status column either (expiry dates carry the signal; 1,350 rows show already-past dates). What the file genuinely gives you: company identities, geography to the county, license class, and ==renewal timing — 3,086 licenses (~15%) expire within the next 90 days==. Contact details are a per-company enrichment step (company website / Google listing / TDLR's per-license search at tdlr.texas.gov/LicenseSearch/) — which §1.5's personalized-ask mechanics required anyway.

**Terms of use, as read on 2026-07-16:**
- TDLR Website Policies (tdlr.texas.gov/disclaimer.htm): the Copyright Statement restricts ==only TDLR logos==; the "no solicitations" line governs posting on ==TDLR's own social-media pages==, not use of downloaded data. No clause restricts contacting licensees. The files sit on a public "Licensing Files Download Page" TDLR maintains for exactly this kind of bulk access.
- Texas Public Information Act: access is purpose-blind — a governmental body ==may not inquire into the purpose== for which requested information will be used (Tex. Gov't Code §552.222; texas.public.law/statutes/tex._gov't_code_section_552.222).
- ==Net: nothing in TDLR's published terms forbids solicitation contact with licensees.== What DOES govern the outreach is the marketing-law overlay you already encoded: CAN-SPAM footer + opt-out, ≤10–15 sends/day, suppress restricted states ([[Antifragile SaaS]] §1.5, Black Swan #5). B2B email prospecting to company contacts is the standard, compliant shape. (Research finding, not legal advice.)
- **Caveat:** data.texas.gov (the Socrata mirror, dataset 7358-krk7) returns ==403 to every scripted request from this machine== — metadata, SODA API, and terms page alike. The direct TDLR CSV makes this moot for Texas; if you ever want the mirror or its extra fields, open it in a normal browser. Other states (CSLB etc.): ==read each state's terms before the first send== — the runbook already mandates this; only Texas is verified today.

## Trap list (fatal-credibility errors this research pre-empts)

- ==EPA-608 as a renewal== — it's lifetime; permanent audit record only.
- ==The "$147 / 2-year" TDLR renewal claim== that CE-provider marketing pages circulate — TDLR's own pages say $65 renewal + 8h annual CE, and the registry's expiry histogram confirms the 1-year term (85% of live licenses expire within 12 months). Quote TDLR, never a CE reseller.
- ==Pitching the AIM-Act leak rule to a residential-AC-only shop== — resi/light-commercial comfort systems are exempt; the 15-lb rule sells to refrigeration/commercial-side shops.
- ==Citing a stale expiry date from the CSV== — the file updates daily; re-pull before any email that names a date (§1.3 iron rule).
