# COLD-MAP — §1.2C registry stub + verified free channels

> [!warning] This is the September lane, staged early. ==Do NOT contact anyone from this file now== ([[Antifragile SaaS]] §1.5: cold lane opens Sep 1, hours-protected). July's only job with this file: know it exists and that it's real.

Assembled 2026-07-16 by AFK research agent. Registry pulled live; every channel URL checked live (failures noted per row).

## Part 1 — The registry pool: 120 named HVAC companies (TDLR, pulled 2026-07-16)

**Source:** `https://www.tdlr.texas.gov/dbproduction2/ltairref.csv` — Texas TDLR "Airconditioning Contractors" bulk file, ==updated daily by TDLR==, downloaded and parsed 2026-07-16: 20,371 licensed A/C contractors statewide (Harris 3,040 · Dallas 1,760 · Tarrant 1,339 · Bexar 1,285 · Collin 528 · Fort Bend 505). Selection below: top counties, ==deduped to one row per company, soonest-expiring valid licenses first== — because a license expiring in 30–90 days is the exact moment the pitch is relevant.

**Know before using:**
- ==The file carries NO addresses, phones, or emails (all contact columns are empty, 0/20,371)== — it gives company name, licensee name, county, license number/class, expiry date. Finding the right email/phone is a per-company step at ask time (company website, Google listing, or TDLR's per-license search: tdlr.texas.gov/LicenseSearch/).
- ==Re-pull the CSV before any email that cites a date== — the file updates daily; a stale expiry date quoted in an ask kills all trust ([[Antifragile SaaS]] §1.3 iron rule).
- Skip the non-ICP rows a raw registry inevitably contains: in this pull, SIEMENS INDUSTRY, PEPSICO, TDINDUSTRIES (giants) and PASADENA INDEPENDENT SCHOOL DISTRICT (institution) hold licenses too — they are listed for honesty, not for outreach.
- License class codes: A/B = class (unlimited/limited), E = environmental air, R = refrigeration, C = combined (e.g. `AC` = Class A combined). The `(AR)`/`(BR)`/`(*C)` rows have the refrigeration endorsement — ==the AIM-Act 15-lb leak-repair tailwind lands on these== (resi/light-commercial comfort AC is exempt; see [[HVAC-BRIEF]]).
- This pool is company-IDENTITY data; it says nothing about headcount. The 15–80-staff ICP filter happens during enrichment.

| Company (BUSINESS NAME on license) | Licensee on file | County | TDLR lic. # (class) | Expires |
|---|---|---|---|---|
| APOLLO A/C & HEATING | TINGLER, RANDY | HARRIS | 16159 (AC) | 2026-07-17 |
| KOOL AIR A/C & HEATING | PUTZ, KENNETH | HARRIS | 32953 (BE) | 2026-07-17 |
| THE SERVICEMEN REPAIR SERVICE | GLOVER, GEORGE I JR | HARRIS | 29722 (BE) | 2026-07-17 |
| CAF HVAC SOLUTIONS | FISHER, CHRISTOPHER ALLEN SR | HARRIS | 80403 (AE) | 2026-07-17 |
| D-1 SERVICES | CAVAZOS, DANIEL | HARRIS | 28885 (AE) | 2026-07-18 |
| JVM SERVICES COMPANY LLC | CORONADO, JORGE ARTURO JR | HARRIS | 141767 (AC) | 2026-07-18 |
| STAFFORD AIR OF BELLAIRE | STAFFORD, COLBY T | HARRIS | 153605 (BE) | 2026-07-18 |
| B Q NUNN MECHANICAL CONTRACTOR | NUNN, BYRON | HARRIS | 15290 (BC) | 2026-07-19 |
| THE MASTER AIR CONDITIONING & HEATING | BAILON, DAVID | HARRIS | 131479 (BE) | 2026-07-19 |
| AIR GIRL AC AND HEATING | WILSON, DEBBIE D | HARRIS | 105843 (BE) | 2026-07-20 |
| RICHARDS MECHANICAL | RICHARDS, ERIC Q | HARRIS | 26045 (AC) | 2026-07-20 |
| RJY GROUP LLC | SHIFLET, TERRY L SR | HARRIS | 50734 (AE) | 2026-07-21 |
| T&S PROFICIENT PROPERTY SOLUTIONS, LLC | HOLMES, TRIVIL JOSHUA | HARRIS | 153645 (BE) | 2026-07-21 |
| XCEPTIONAL COMFORT | CABALLERO, XAVIER OMAR | HARRIS | 89727 (BE) | 2026-07-22 |
| SERVICE ETC | FULLER, ALLAN L | HARRIS | 19601 (AC) | 2026-07-24 |
| FRANK X CABRERA | CABRERA, FRANK X | HARRIS | 16773 (BE) | 2026-07-24 |
| SIEMENS INDUSTRY, INC — *skip: enterprise* | MELENDEZ, LUIS ALFONSO | HARRIS | 19718 (AE) | 2026-07-25 |
| DAVIDSON AIR CONDITIONING & HEATING LLC | DAVIDSON, BRADLEY CHARLES | HARRIS | 153851 (BE) | 2026-07-25 |
| CROSSFIRE HEATING AND COOLING LLC | GASKAMP, LEWIS TAYLOR | HARRIS | 122259 (AC) | 2026-07-26 |
| BICC APPROVED LLC | BRYSON, CHRISTOPHER LAWRENCE | HARRIS | 82333 (BE) | 2026-07-26 |
| SORTO SERVICES LLC | SORTO, FERMIN | HARRIS | 113935 (AC) | 2026-07-26 |
| BEY'S CONTRACTING SERVICES INC | MULKEY-BEY, WILLIE B | HARRIS | 74346 (BC) | 2026-07-27 |
| TEKPLAN SOLUTIONS TEXAS LLC | ARLDT, DEAN | HARRIS | 47972 (AC) | 2026-07-27 |
| AIRSPIRE AC AND HEATING | GARCIA, MARCO ANTONIO JR | HARRIS | 106146 (BE) | 2026-07-28 |
| CARLOS A ZELAYA | ZELAYA, CARLOS A | HARRIS | 28931 (BE) | 2026-07-28 |
| ORBIT AIR & HEAT LLC | ALVAREZ, ALEJANDRO JR | HARRIS | 83904 (AE) | 2026-07-28 |
| GILES MULTI SERVICES LLC | GILES, MIGUEL JR | HARRIS | 153893 (AC) | 2026-07-28 |
| TRILOGY SERVICES AND A/C LLC | LUNA, SERGIO DANIEL SR | HARRIS | 40236 (AC) | 2026-07-28 |
| BAYOU BREEZE SERVICE COMPANY | ROSS, ANDREW STEPHEN | HARRIS | 95907 (AC) | 2026-07-28 |
| PASADENA INDEPENDENT SCHOOL DISTRICT — *skip: institution* | SUTTON, RODNEY E SR | HARRIS | 10493 (AE) | 2026-07-29 |
| DISCOUNT AC & HEATING | ALSHOUHA, MOHAMMAD | HARRIS | 37348 (BE) | 2026-07-29 |
| AIR VELOCITY XPERTS LLC | MALDONADO, TIMOTHY ALEXANDER SR | HARRIS | 122260 (AC) | 2026-07-29 |
| GEORGE WILBURN RUCKER | RUCKER, GEORGE WILBURN | HARRIS | 2175 (AC) | 2026-07-29 |
| REED MECHANICAL SERVICES OF HOUSTON LLC | REED, WELDON DON | HARRIS | 2140 (BC) | 2026-07-29 |
| HOUSTON HVAC SERVICES LLC | REYNA, HECTOR | HARRIS | 16031 (AC) | 2026-07-29 |
| AIRFIELD | NGUYEN, NHU HUNG | HARRIS | 17992 (AC) | 2026-07-30 |
| JT HVAC LLC | TOMS, JEROL RAMONDA JR | HARRIS | 129099 (AC) | 2026-07-30 |
| STEWART REFRIGERATION INC | STEWART, WILLIAM S | HARRIS | 11217 (AC) | 2026-07-30 |
| SOUTH TEXAS HVAC AND ELECTRIC | TIJERINA, JORGE | HARRIS | 22075 (BC) | 2026-07-30 |
| BOYD SERVICES LLC | BOYD, THOMAS F IV | HARRIS | 32006 (AE) | 2026-07-30 |
| LEIF-X MECHANICAL LLC | LOPEZ, BENJAMIN | DALLAS | 153524 (AC) | 2026-07-17 |
| HAYDEN AIR CONDITIONING | HAYDEN, RANDY LEWIS | DALLAS | 90252 (BE) | 2026-07-17 |
| LTX AIR SERVICES LLC | ROSALES, LEONARDO | DALLAS | 131480 (AE) | 2026-07-19 |
| B & B PRO SERVICES LTD | BARRETT, LESLIE EDWARD | DALLAS | 36232 (AE) | 2026-07-19 |
| PRO AIR SERVICE COMPANY | BENCH, TERRY LEE | DALLAS | 15585 (BE) | 2026-07-21 |
| PEPSICO INC — *skip: enterprise* | LIVEZEY, RAYMOND DENNIS | DALLAS | 3842 (BC) | 2026-07-21 |
| S.T.I.R. HVACR TECHNICAL SERVICES LLC | ORTEGA, JORGE A | DALLAS | 77962 (AR) | 2026-07-21 |
| DEL TORO HEATING & AIR CONDITIONING | DEL TORO, ALFREDO | DALLAS | 28818 (BE) | 2026-07-21 |
| TDINDUSTRIES LTD — *skip: enterprise* | FLORES, RAMON | DALLAS | 33524 (AC) | 2026-07-22 |
| PHIL-CO MECHANICAL | SMITH, PHILLIP R | DALLAS | 18446 (BE) | 2026-07-22 |
| PRECISION CLIMATE | CHILDRESS, BENJAMIN JAMES | DALLAS | 46125 (BE) | 2026-07-23 |
| HOOPER PLUMBING INC | HORTON, DAVID M JR | DALLAS | 20857 (BE) | 2026-07-24 |
| JC CONTRACTORS | DRUMMOND, MARCIO REZENDE | DALLAS | 141946 (AE) | 2026-07-24 |
| IDEAL SERVICE COMPANY | BROWN, JAMES CARL | DALLAS | 17067 (AE) | 2026-07-26 |
| DEW POINT MECHANICAL LLC | PEREZ, ALEJANDRO | DALLAS | 122262 (AE) | 2026-07-26 |
| TEXAS - T AIR CONDITIONING & HEATING | RAMIREZ, TERRY JAMES | DALLAS | 82332 (BE) | 2026-07-28 |
| PRONTO A/C | PENA-AMAYA, MARCO | DALLAS | 114041 (BE) | 2026-07-29 |
| ARK SERVICE COMPANY | KEESE, COREY M | DALLAS | 27509 (AC) | 2026-07-31 |
| JACK THEILEN AIR CONDITIONING LIMITED CO | THEILEN, JACK COLTON | DALLAS | 142167 (BC) | 2026-07-31 |
| GLOBAL MECHANICAL AIR SERVICES | TAYLOR, WILLIAM RODNEY JR | DALLAS | 27407 (AE) | 2026-07-31 |
| MOREHEAD MECHANICAL | MOREHEAD, FREDERICK AARON | DALLAS | 47632 (AC) | 2026-08-01 |
| HILLSIDE MECHANICAL CONTRACTORS LLC | BURNETT, TYRONNE A | DALLAS | 131757 (AC) | 2026-08-01 |
| MAXIM AIR PERFORMANCE LLC | PARAMO, GABRIEL | DALLAS | 131801 (AE) | 2026-08-02 |
| GARRITY HVAC | GARRITY, JERRENCE LONNELL | DALLAS | 106272 (BE) | 2026-08-03 |
| A-SOUTHWEST AIR CONDITIONING TEAM | BENAVIDEZ, ALFREDO ALONZO JR | DALLAS | 48089 (BE) | 2026-08-04 |
| FIELDS HEATING & AIR | FIELDS, TIMOTHY | TARRANT | 27235 (BE) | 2026-07-17 |
| ALWAYS AIR INC | BANKS, DAVID T | TARRANT | 80410 (AE) | 2026-07-18 |
| AIR FLOW COMFORT SYSTEMS | DOMINGUEZ, OMAR | TARRANT | 74057 (BE) | 2026-07-19 |
| APPLIANCE FIXX | BERRY, DONALD RAY | TARRANT | 22285 (BE) | 2026-07-21 |
| FROSTEX REFRIGERATION LLC | MACHADO, DUSTIN DEAN | TARRANT | 121158 (BR) | 2026-07-21 |
| URBAN AIR | URBANEK, KENNETH FREDRICK | TARRANT | 13462 (BE) | 2026-07-22 |
| A TAB AIR | WELLS, BARRY W | TARRANT | 16827 (AE) | 2026-07-22 |
| FOSTER'S MECHANICAL LLC | FOSTER, TOBY G | TARRANT | 31730 (AE) | 2026-07-22 |
| ROTO DUCK WORKS INC DBA VETERAN'S AC & | ROBERSON, KELLY M | TARRANT | 26051 (BE) | 2026-07-24 |
| CLINE, JAMES WILLIAM | CLINE, JAMES WILLIAM | TARRANT | 56893 (AC) | 2026-07-25 |
| EMPIRE HEATING AND AIR CONDITIONING | JURADO, EDUARDO S | TARRANT | 141955 (BE) | 2026-07-26 |
| RF CAPITAL HOLDINGS LLC DBA PRESTIGE AIR | ROZIER, NICHOLAS WILLIAM | TARRANT | 106106 (BE) | 2026-07-27 |
| RIQUE'S A/C AND HEATING | DAGGS, RIQUE E | TARRANT | 20661 (BE) | 2026-07-27 |
| HARRISON, JAMES H | HARRISON, JAMES H | TARRANT | 22086 (AE) | 2026-07-27 |
| NORTH TEXAS MECHANICAL | VEST, DAVID ARTHUR | TARRANT | 5328 (AC) | 2026-07-28 |
| JRC AC & HEATING | TIJERINA, CESAR A | TARRANT | 38017 (BE) | 2026-07-28 |
| ADVENT AIR CONDITIONING | WIKEL, MATTHEW ANGELO | TARRANT | 142086 (AC) | 2026-07-30 |
| NORTH TEXAS AIR | ALFARO, HECTOR IVAN MONTES | TARRANT | 93335 (BE) | 2026-07-30 |
| MID-CITIES METAL DUCTS LLC | SHIPMAN, JACOB LESLIE | TARRANT | 131760 (AE) | 2026-08-01 |
| QUICK ENVIRONMENTAL SOLUTIONS | QUICK, GUY | TARRANT | 24177 (AE) | 2026-08-01 |
| BANNER AIR | LEONARD, TERRELL W | COLLIN | 13288 (BE) | 2026-07-19 |
| CM HEATING & AIR, LLC | MCHUGH, CHRISTOPHER | COLLIN | 106014 (BE) | 2026-07-22 |
| MONICA CARRANZA | COLLINS, RYAN JAMES | COLLIN | 153807 (BR) | 2026-07-24 |
| NATION HEAT & AIR CONDITIONING | NATION, PHILIP H | COLLIN | 23231 (BE) | 2026-07-25 |
| TROY W MAY | MAY, TROY W | COLLIN | 13902 (BE) | 2026-07-29 |
| KIRK AUBREY TINSLEY | TINSLEY, KIRK AUBREY | COLLIN | 93876 (AE) | 2026-07-29 |
| PALADIN P.M. | STONE, KELLY T | COLLIN | 27220 (AE) | 2026-07-31 |
| ALL ABOUT AIR INC | LUTTRELL, DAVID HUGH | COLLIN | 8989 (AC) | 2026-08-03 |
| JIANON, INC | XU, JIAN Q | COLLIN | 40392 (AC) | 2026-08-04 |
| CES AC & HEATING LLC | PARKS, ERIC DANIEL | COLLIN | 67363 (AE) | 2026-08-04 |
| HUSKY COMFORT AIR | HUANG, JAMMY | FORT BEND | 113919 (AC) | 2026-07-23 |
| DELTA AIR MECHANICAL LLC | KATTAN, AKRAM FAZZA | FORT BEND | 131566 (AE) | 2026-07-24 |
| MAINTENANCE MASTERS EXPRESS LLC | BASS, RICKY K JR | FORT BEND | 113557 (AE) | 2026-07-26 |
| W R MECHANICAL HVAC SERVICES | RIVERA, WILLIE ERNESTO | FORT BEND | 26456 (BE) | 2026-07-26 |
| MECHANICAL 73 COMPANY | LOPEZ, PETE | FORT BEND | 22940 (BE) | 2026-07-28 |
| HVAC ONE LLC | GONZALEZ, LUIS ANGEL | FORT BEND | 113170 (BE) | 2026-07-30 |
| T W WILSON & ASSOCIATES | WILSON, TAYLOR WESLEY JR | FORT BEND | 8260 (BE) | 2026-07-31 |
| BLUE PEAK HEATING AND AIR | PORTILLO MOLINA, KENEDY URIEL | FORT BEND | 154071 (BR) | 2026-07-31 |
| BISHOP APPLIANCE & AIR | GUIDRY, JOSEPH III | FORT BEND | 27951 (BE) | 2026-08-01 |
| TRUE TECHS MECHANICAL | REYES, ALFREDO | FORT BEND | 29520 (BC) | 2026-08-04 |
| COOL BREEZE AIR CONDITIONING & HEATING | ESPINOZA, ORLANDO | BEXAR | 12431 (BE) | 2026-07-18 |
| SCRAP IT OUT HVAC RECYCLING LLC | DELGADO ZAVALA, JESUS | BEXAR | 141847 (AC) | 2026-07-23 |
| GAUNA HVAC LLC | GAUNA, DAVID LEE | BEXAR | 129881 (AE) | 2026-07-24 |
| MARTINEZ, RICHARD HENRY | MARTINEZ, RICHARD HENRY | BEXAR | 14666 (BE) | 2026-07-24 |
| PRO QUALITY SERVICE COMPANY | FLORES, GILBERT A | BEXAR | 54568 (AC) | 2026-07-25 |
| ZUBIE HOME SERVICES | ZUBIATE, ELMER | BEXAR | 19004 (AE) | 2026-07-26 |
| SUB-ZERO INNOVATIONS | RODRIGUEZ, MICHAEL E | BEXAR | 131653 (AE) | 2026-07-26 |
| ALL APPLIANCES AND BUILDINGS SERVICES | CORKILL, RONALDO R | BEXAR | 28850 (AE) | 2026-07-26 |
| TRINITY A/C HEATING & REFRIGERATION CO | FRITZ, WILLIAM ROBERT | BEXAR | 10450 (BC) | 2026-07-27 |
| AJ HEATING & COOLING | ALCANTAR, PAUL L | BEXAR | 67210 (BE) | 2026-07-28 |
| JAKE ALVIN WOOTEN | WOOTEN, JAKE ALVIN | TRAVIS | 85943 (BE) | 2026-07-17 |
| FROSTBITE REFRIGERATION AND A/C LLC | NIGRO, WILLIAM J | TRAVIS | 53964 (AC) | 2026-07-21 |
| B P HEATING & AIR | POTTS, WILLIAM ROBERT | TRAVIS | 21496 (BC) | 2026-07-22 |
| SUN RAY HEATING AND COOLING | KIM, NAM S | TRAVIS | 26044 (BE) | 2026-07-22 |
| ABR RENOVATIONS LLC | ABREGO, ROMULO | TRAVIS | 40093 (BC) | 2026-07-22 |

*(120 rows: Harris 40 · Dallas 25 · Tarrant 20 · Collin 10 · Fort Bend 10 · Bexar 10 · Travis 5. Four flagged skips leave ==116 usable cold-pool companies==. The full 20,371-row file re-downloads in seconds whenever you need the next tranche.)*

## Part 2 — Verified free channels (non-Reddit), with each venue's rules

Checked live 2026-07-16. §1.2C wants ==≥5 venues joined== — rows marked ✅ are join-and-read candidates for July ([[Venture Tasks]] "# Free watering holes": learner posture, never founder; comment strategy where promo is banned; never the same text in two venues on the same day).

| ✓ | Channel | URL | What it is / size | Rules on promo & research posts (as read 2026-07-16) | Posture |
|---|---|---|---|---|---|
| ✅ | HVAC-Talk | hvac-talk.com/forums/ | The big HVAC pro forum (AOP); public + pro zones | Site Rules ban advertising/soliciting without approval; paid Vendor program for commercial posts; surveys/pitches bannable. Genuine peer questions fine; non-pros may post in owners/General zones | ==learner-question OK; never promo== |
| ✅ | ContractorTalk | contractortalk.com | Cross-trade contractor forum; Business + Marketing subforums | Terms prohibit commercial posting/advertising/soliciting "without express written approval" (contractortalk.com/rules) | ==learner-question OK; never promo== |
| ✅ | HeatingHelp "The Wall" | forum.heatinghelp.com | Long-running heating/hydronics forum; pros + owners | Rules page exists; self-promo discouraged; exact text behind welcome flow — ==read rules after joining== | learner-question OK (verify rules on join) |
| ✅ | FB: HVAC Business Owners & Contractors | facebook.com/groups/hvacbusinessownerscontractors/ | Private FB group, active (recent posts); owner/office audience | Guidelines post exists but is member-gated — ==read after joining== | join-and-read July candidate |
| ✅ | FB: HVAC/R Owners & Managers | facebook.com/groups/613241562102591/ (also /groups/HVACowners/) | Private FB group; owner/manager-focused; active | Rules member-gated — read after joining | join-and-read July candidate |
| ✅ | HVAC School (Bryan Orr) | hvacrschool.com + facebook.com/hvacrschool (~185K followers) | Free training ecosystem + FB page/group; ==audience skews techs over owners== | No public posting rules; the surface is comments on posts | comment-strategy only |
| ✅ | Refrigeration-Engineer.com | refrigeration-engineer.com | Free refrigeration forum (intl; active 2026, ~342 users online at check) | Rules unreadable from this machine (DNS refused; site confirmed live via search) — read on join | learner-question OK (verify rules on join) |
| — | ACCA | acca.org (+ hvac-blog.acca.org) | THE HVAC contractor association | ==Member forums are paid-members-only.== Free surfaces: ACCA Now blog comments, their LinkedIn/FB, some free events | comment-strategy only (free surfaces) |
| — | PHCC | phccweb.org (community.phccweb.org) | Plumbing-HVAC association (~3,500 firms / 65K techs) | Community returns "Login Required" — members-only. Free surface: public news | members-only; listening post |
| — | IEC / NECA | ieci.org / necanet.org (network.necanet.org) | Electrical associations (adjacent trade) | No open public forums; NECA Network is member-gated | members-only; skip for HVAC lock |
| — | ASSP | assp.org/membership/communities/online-assp-community | Safety-pro association — the ==recommender== channel | Community is members-only. Free surfaces: public content + LinkedIn. ==Note: `community.assp.org` does not exist== (dead hostname — don't use it) | members-only; lurk free surfaces |

**More FB-group candidates** (from Hook Agency's "9 Best HVAC Facebook Groups," hookagency.com/blog/best-hvac-facebook-groups/ — cited but ==not individually activity-verified==; check on join): HVAC Uncensored Nation (`/groups/748326645884124`), Sloppy HVAC Mechanics (`/401492793685661`), HVAC Growth Leaders (`/582652251180067`), HVAC 4 LIFE (`/260052384514170`), Grow Your Home Service Business (`/1550374268369881`), HVAC Sales Masters (`/2421282148110953`), Home Service Expert (`/168245720180335`).

**Search-verified but excluded:** Vietnamese-language HVAC FB groups found (HVACR.Vietnam, hvacvn) are ==Vietnam-based, not US diaspora== — no US "thợ điện lạnh" group surfaced logged-out; your Việt channel for the warm lane runs through the directories in [[WARM20-CANDIDATES]] and hội đồng hương, not through a public FB group. Eng-Tips HVAC/R forum: alive but audience = design engineers, not owners.

**The count vs the gate:** 7 join-and-read venues verified live (✅ rows) ≥ the 5 the runbook requires; the two $0 channels (registry CSV above; the lead-magnet spreadsheet page) stay as designed in §1.2C.

**Facebook member counts:** invisible logged-out in 2026 — every group above was existence+activity-verified via recent-post snippets instead. Expect to see real sizes only after joining as yourself in July.
