# R1 — Public, legally contactable lists of buyers with a dated, recurring pain

**Date:** 2026-09-17 (Asia/Saigon) · ~47 web lookups · **no contact made, no DM, no email, no signup, no account created anywhere**
**Question:** Which public, legally contactable lists of buyers with a recurring, deadline-driven pain can a Vietnam-based solo reach by email / LinkedIn / Zalo within 14 days?
**Verification status:** 15 lists enumerated. Rows 1–5 **verified today by fetching the owning file or quoting the owning page**; row counts and expiry counts below were computed from the files themselves, not from a write-up. Rows 6–15 are **partially verified** — every field carries a URL and each unconfirmed field is marked **UNVERIFIED** inline.

---

## The headline finding

`Q4 Sprint.md` §2 records one TDLR list with empty contact fields. **TDLR publishes 151 daily-refreshed licence CSVs, not one**, and the A/C **contractor** file Khoi already has is the unusual one — its phone columns are empty in all 20,435 rows, while the sibling files are populated. https://www.tdlr.texas.gov/LicenseSearch/licfile.asp

| TDLR file | What it is | Rows | Rows carrying a phone | Expire ≤ 2026-10-18 | Expire ≤ 2026-12-31 |
|---|---|---|---|---|---|
| `ltairref.csv` | A/C **Contractors** (the file he has) | 20,435 | **0** | 652 | 4,068 |
| `ltelcall.csv` → `Electrical Contractor` | electrical **businesses** | 14,023 | **14,018** | 461 | 2,403 |
| `ltactech.csv` | A/C **Technicians** (individuals) | 60,835 | **60,820** | 2,393 | 8,307 |
| `ltcosmns.csv` | Cosmetology mini-establishments | 21,536 | **21,532** | 513 | 1,832 |
| `ltlicfile.csv` | **All licences, every TDLR programme** | — (187.96 MB) | — | — | — |

All five verified live with `Last-Modified: Wed, 16 Sep 2026`. Same column schema throughout: licence type, number, **expiration date**, county, name, business name, mailing and business address, phone, sub-type, continuing-education flag.

---

## 1. Ranked table — contactable × pain-has-a-date × already-pays

| # | List (owner) | Size | Contact fields exposed | Refresh | Dated pain | Rank |
|---|---|---|---|---|---|---|
| 1 | **TDLR Electrical Contractors** (`ltelcall.csv`) | 14,023 businesses | **Business name + phone on 14,018 rows**, address, county. No email → per-row lookup | **Daily** | **461 licences expire ≤ 2026-10-18; 2,403 by 2026-12-31** | **A+** |
| 2 | **TDLR A/C Contractors** (`ltairref.csv`) | 20,435 | Name, business name, county, expiry, CE flag. **Phone empty on every row** → per-row lookup | **Daily** | **652 ≤ 2026-10-18; 4,068 by 2026-12-31** | **A** |
| 3 | **FDA device establishment registration files** | 13 files (registration, owner-operator, official correspondent, US agent) | **Phone, fax and email present** | **Weekly** — "Files are updated every Sunday night" | **Renewal window 2026-10-01 → 2026-12-31**; FY2027 fee **$13,785** | **A** |
| 4 | **TDLR A/C Technicians** (`ltactech.csv`) | 60,835 individuals | Phone on 60,820 rows | Daily | 2,393 ≤ 2026-10-18 | **B+** (individuals, thin wallets) |
| 5 | **UK Companies House Free Company Data Product** | ~5M live companies (count UNVERIFIED) | Name, number, registered office, SIC, **accounts next due + confirmation statement next due**. No email/phone | Monthly, "within 5 working days of the previous month end"; snapshot dated 2026-09-01 | Confirmation statement due **14 days** after review-period end; fine up to **£5,000** + strike-off | **A−** |
| 6 | **SAM.gov Entity Registration Public Extract** | US federal vendors (count UNVERIFIED) | Entity name, UEI, **`registrationExpirationDate`**, addresses, NAICS/PSC, **POC name and address only — email is FOUO** | Monthly FOIA extract | **"You must renew your registration every 365 days to keep it active"** — per-row date | **B+** |
| 7 | **CSLB License Master** (California) | Renewed + expired-but-renewable licences | Licence #, business name, address, **telephone**, status, issue/expiry, class, bond. **"Email addresses are not provided"** | Dated stamp on the page; cadence UNVERIFIED | Renewal cycle **UNVERIFIED**; renewable up to 5 years past expiry | **B+** |
| 8 | **Florida DBPR licensee downloads** | Current, active and inactive, all professions | CSV; field list **UNVERIFIED** (readme and disclaimer both 403 to a fetcher) | **Weekly** | Per-profession renewal dates **UNVERIFIED** | **B** |
| 9 | **TDLR — the other 146 files** | 151 CSVs total; `ltlicfile.csv` is 187.96 MB | Same schema family | Daily | Same expiry structure | **B** (cheap upside) |
| 10 | **ASIC business names** (Australia) | All AU business names (count UNVERIFIED) | Public register search; bulk dataset UNVERIFIED | UNVERIFIED | Notice **"at least 30 days before your registration renewal is due"**; **"If you do not renew your business name ASIC may cancel it"** | **B−** |
| 11 | **ACRA entities** (Singapore, data.gov.sg) | **~2.1M rows** | UEN, status, name, type, UEN issue date, street, postcode. **No email, no phone, no expiry** | **Monthly, day 16** (last 2026-09-15) | **None in the file** | **C+** |
| 12 | **Shopify-hosted stores** (myip.ms) | **572,963 sites** | Domain, IP, host, country, city, rank. No email → per-store lookup | Monthly directory (Sept 2026) | **None in the list**; R4 supplies dated pain from one-star review dates | **C+** |
| 13 | **AHR Expo 2027 exhibitors** | Full directory | Behind a **free My Show Planner login** (account creation — out of bounds this pass) | Rolling | Show is **2027-01-25/27, Chicago** — after the sprint | **C** |
| 14 | **Vietnam National Business Registration Portal** | All VN enterprises | Lookup at `dichvuthongtin.dkkd.gov.vn`; fields **UNVERIFIED**; **no bulk download found** | UNVERIFIED | UNVERIFIED | **C** |
| 15 | **Job boards as pain signals** | 56 posts already named | See `R3-service-demand.md` §6 — not re-derived here | Continuous | Hiring posts carry no deadline | **B, via R3** |

**Zalo is not on this list because it is not a list.** It is a channel, and a closed one: see §2.

---

## 2. Terms on solicitation — verbatim, with URL

| Source | Quote | What it binds |
|---|---|---|
| TDLR Public Information Policy | *"All government information is presumed to be available to the public."* · *"Use of the information must identify the state agency that is the source of the information…and must be accompanied by a statement that neither the site owner nor the information, as it is presented on the site owner's web site, is endorsed by the State."* — https://www.tdlr.texas.gov/disclaimer.htm | **Operative.** Any page or email built on TDLR rows must name TDLR as the source and disclaim state endorsement. The same policy page also says *"We do not allow solicitations or advertisements"* — that line sits in the section governing TDLR's own site and channels, and is **not** stated as a restriction on reuse of downloaded data. That reading is my inference, not TDLR's wording. Confirm before a mass send. |
| CSLB Public Data Portal | *"Email addresses are not provided"* (attributed on the page to Business & Professions Code §27) — https://www.cslb.ca.gov/onlineservices/dataportal/ContractorList | Phone is public, email is withheld by statute. Phone or web form only. |
| data.gov.sg (ACRA) | Open Data Licence — *"Free forever for personal or commercial use"* — https://data.gov.sg/datasets | Commercial use expressly allowed. |
| Companies House | *"This snapshot is provided free of charge and will not be supported."* — https://download.companieshouse.gov.uk/en_output.html | No solicitation restriction stated; no support either. |
| FDA download files | No use restriction published on the page — https://www.fda.gov/medical-devices/device-registration-and-listing/establishment-registration-and-medical-device-listing-files-download | US federal public-domain data; contact rules come from CAN-SPAM, not FDA. |
| Zalo Official Account policy | Zalo screens broadcast content and locks Official Accounts that repeatedly send spam-flagged content; a business may contact a customer **only if that customer consented and supplied their phone number** — https://oa.zalo.me/home/documents/policy | **Zalo is a warm-only channel.** Cold Zalo outreach risks the account. |
| Florida DBPR disclaimer | **UNVERIFIED** — 403 to a fetcher — https://www2.myfloridalicense.com/public-records-read-medisclaimer/ | Read manually before using the Florida files. |

Two rules bind regardless of any site's terms. US commercial email needs a real postal address and a working opt-out under CAN-SPAM. UK and Singapore rows that are sole traders or named people are personal data under UK GDPR and Singapore's PDPA — a company address is the defensible target, a named person's inbox is not.

---

## 3. The dated pain, and who already gets paid for it

| List | Pain, with its date | Vendors these buyers already pay | Price |
|---|---|---|---|
| **TDLR electrical + A/C contractors** | Licence expires on a per-row date. 461 electrical and 652 A/C rows expire on or before **2026-10-18**; 2,403 and 4,068 by **2026-12-31**. Renewal needs **8 hours of continuing education including 1 hour of Texas law and rules** before the fee is even payable; the TDLR renewal fee is **$65**. | CE course sellers: **Online Texas CE $22.95** · **1st Choice CE $35.99** · **Easy LR 24 $35.00** (from $70). Adjacent spend R2 already priced on these same shops: Angi/HomeAdvisor **$45–$100 per lead**, NiceJob **$199 setup + $75–$125/mo**. | $22.95 · $35.00 · $35.99 · $65 statutory |
| **FDA device establishments** | *"Registration information must be submitted each year between October 1 and December 31, even if no changes have occurred."* The window **opens in 14 days and closes inside the sprint**. Miss it and the establishment re-registers under a new number. | **Willow Glen Consultancy $279** establishment registration · a named provider adds a **$1,100 service fee** on top of the government fee · the FDA fee itself is **$13,785 for FY2027**, up from **$11,423 in FY2026**. | $279 · $1,100 · $13,785 |
| **Companies House** | Confirmation statement due within **14 days** of review-period end; **"You can be fined up to £5,000 and your company may be struck off if you do not file"**. Statutory fee **£50 online** (raised from £34 on 2026-02-01). | **1st Formations £75.99/yr** (incl. the £50 fee) · **Formations Wise £84.00/yr** · **Mint Formations £74 + VAT** · **Your Company Formations £90 + VAT**. | £74–£90/yr |
| **SAM.gov** | *"You must renew your registration every 365 days to keep it active."* The expiry date is in the public extract, so every row carries its own deadline. | **USA Filing $349** (1 yr) / **$599** (2 yr) · **U.S. Contractor Administration $399** admin fee. Renewal on SAM.gov is **free** — this is pure pay-to-not-deal-with-it. | $349 · $399 · $599 |
| **ASIC business names** | Renewal notice lands at least 30 days before the due date; non-renewal means cancellation. | ASIC's own fee schedule renders as placeholders to a fetcher — **UNVERIFIED**. | UNVERIFIED |

---

## 4. Gaps — do not treat these as findings

- Florida DBPR field list and public-records disclaimer (both 403). CSLB refresh cadence, licensee count and renewal cycle. ASIC's own fee figures. Vietnam NBRP exposed fields. Companies House bulk field list (the two due-date fields were confirmed on the per-company API instead, not on the bulk product spec). Companies House live-company count.
- The other 146 TDLR files were listed but not opened. Same schema, same daily refresh — the cheapest unclaimed upside here.
- **Correction to `Q4 Sprint.md` §2:** the file Khoi has is **A/C Contractors only** — all 20,435 rows read `LICENSE TYPE = "A/C Contractor"`. It is not a multi-trade registry, and its empty contact fields are a quirk of that one file, not of TDLR.

---

## Top 3

1. **Texas electrical contractors, 461 businesses whose licence expires on or before 2026-10-18** · licence expiry is a hard per-row date inside the 31-day clock, 2,403 more by Dec 31, and renewal is blocked until 8 hours of CE are done · offer: operated licence + CE deadline tracking, founder does the import, phone-first because the file already carries the number on 14,018 of 14,023 rows · price anchor $199/mo against CE sellers at $22.95–$35.99 and the $65 statutory fee · list source: TDLR `ltelcall.csv`, refreshed daily, fetched today · https://www.tdlr.texas.gov/dbproduction2/ltelcall.csv
2. **US medical-device establishments facing the 2026-10-01 → 2026-12-31 registration renewal** · the window opens 14 days from now and shuts inside the sprint; missing it invalidates the registration and forces re-registration under a new number · offer: a fixed-fee renewal-window tracker plus a done-with-you filing chase at $99–$299 · price anchor: Willow Glen $279 and a competitor's $1,100 service fee riding on top of a $13,785 government fee · list source: FDA registration & listing download files, refreshed every Sunday night, **carrying phone and email directly** · https://www.fda.gov/medical-devices/device-registration-and-listing/establishment-registration-and-medical-device-listing-files-download
3. **Texas A/C contractors, 652 companies expiring on or before 2026-10-18** · same dated expiry, and this is the list he already holds plus 36 verified Việt-owned shops and a relatives channel that has already worked · offer: the same renewal + CE tracker, sold in Vietnamese to the Việt-surname rows first · price anchor $199/mo against Angi's $45–$100 per lead and NiceJob's $199 setup + $75–$125/mo · list source: TDLR `ltairref.csv`, daily, fetched today, **no phone on any row — budget a per-company lookup** · https://www.tdlr.texas.gov/dbproduction2/ltairref.csv

## First 20 asks

**One list, one file:** https://www.tdlr.texas.gov/dbproduction2/ltairref.csv — fetched 2026-09-17, `Last-Modified: Wed, 16 Sep 2026 11:17:40 GMT`, 20,435 rows.
**Selection:** all 10 Vietnamese-surname licence holders expiring between today and 2026-10-18 (rows 1–10), then the soonest-expiring Houston/DFW-metro rows (rows 11–20).
**Contact status: NONE.** No row below has been phoned, emailed or messaged. This file exposes no phone and no email, so each row needs a per-company lookup first. The electrical contractor file in §1 row 1 skips that step.

| # | Business name | Licence holder | Licence # | Expires | County | Sub-type | CE flag |
|---|---|---|---|---|---|---|---|
| 1 | D & D AIR CON | NGUYEN, DUNG Q | 83512 | 2026-09-22 | FORT BEND | AE | N |
| 2 | AETHER HVAC LLC | DO, QUANG HUNG | 143808 | 2026-09-24 | FORT BEND | AC | N |
| 3 | KTB MECHANICAL LLC | BUI, KEN PETER | 133411 | 2026-09-29 | HARRIS | AC | N |
| 4 | *(none listed)* | CAO, VINH CHU | 144061 | 2026-10-02 | TARRANT | BR | N |
| 5 | DUKE A/C | NGUYEN, ANTHONY TIEN | 68096 | 2026-10-03 | DALLAS | BE | N |
| 6 | HVAC EXP SERVICES LLC | DUONG, TUNG THANH | 124116 | 2026-10-04 | DALLAS | AC | N |
| 7 | SIMON DINH NGO | NGO, SIMON DINH | 88649 | 2026-10-06 | BRAZORIA | AR | N |
| 8 | H T P MECHANICAL | PHAM, HIEU TRONG | 29121 | 2026-10-07 | TRAVIS | AC | N |
| 9 | METCO HVAC & ELECTRICAL | NGUYEN, MINH HOANG | 62194 | 2026-10-10 | TARRANT | BE | N |
| 10 | *(none listed)* | LE, TUAN THANH | 144546 | 2026-10-18 | DALLAS | AC | N |
| 11 | MARLON W PRITCHETT | PRITCHETT, MARLON W | 17284 | 2026-09-17 | DALLAS | AC | N |
| 12 | ALLTRADES SERVICES | SAVANT, ROGER PAUL | 100089 | 2026-09-17 | TARRANT | BE | N |
| 13 | ASPEN AIR CONDITIONING & HEATING | GUERRERO, JOE ANDREW | 143646 | 2026-09-17 | HARRIS | AE | N |
| 14 | BAILEY'S MECHANICAL | BAILEY, TRAZELL | 16045 | 2026-09-18 | DALLAS | BE | N |
| 15 | FOX AIR AND HEAT | FOX, FREDERICK W | 21557 | 2026-09-18 | TARRANT | BE | N |
| 16 | KRIS HILL A/C & HEATING, LLC | HILL, JEFFREY KRISTOPHER | 22903 | 2026-09-18 | HARRIS | BE | N |
| 17 | FRYE'S MECHANICAL LLC | FRYE, ALTON HOWARD JR | 107083 | 2026-09-18 | HARRIS | AE | N |
| 18 | THE ANDREAS COMPANY | ANDREAS, STEPHEN | 13475 | 2026-09-19 | MONTGOMERY | BE | N |
| 19 | COOL CONNECTIONS | HARDING, JOSEPH W JR | 26457 | 2026-09-19 | COLLIN | BE | N |
| 20 | HARVILLE, DANIEL BRUCE | HARVILLE, DANIEL BRUCE | 347 | 2026-09-20 | TARRANT | AC | N |
