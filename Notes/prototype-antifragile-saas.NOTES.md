# Prototype — Renewal Clock (Antifragile SaaS #2)

**Question it answers:** "How does this SaaS work, and what is it offering?"
**Source:** `Antifragile SaaS.md`

Three artifacts, all self-contained single HTML files (double-click to open, no build, throwaway):

## 1. `prototype-antifragile-saas.html` — the quick sketch
Three tabs (Sales / Dashboard / Loop). Built first to answer "what does it do" fast. Dashboard has 3 `?variant=` layouts. Good for a private gut-check.

## 2. `prototype-antifragile-saas-pitch.html` — the stakeholder pitch (detailed)
A full single-scroll pitch with a distinct visual identity (worksite-safety palette: hazard-orange + steel + red/amber/green status; Oswald/Barlow/IBM Plex Mono type; light + dark themes). Built to **present to a stakeholder and sell the idea.** Sections:
- **Hero** — a *live ticking countdown* ("this cert expires in 11d 04:22:07") = the thesis: the clock never stops.
- **The problem** — Sarah's spreadsheet → the lapse → the $16k audit chain reaction.
- **What Sarah buys** — 6 pillars (registry, clock, closed renewal, audit button, escrow, why-they-pay).
- **Live dashboard** — the same 3 structural views (status board / triage / 12-month timeline) as an embedded interactive demo; action buttons renew a cert in memory so the board visibly changes; keys `1`/`2`/`3`.
- **The loop** — 5-step click-through with a working quiz gate; registry flips green at the end.
- **The audit report** — a rendered sample of the inspector-ready PDF (the artifact that "closes the sale").
- **Why it holds** — antifragility grid + the honest durable/antifragile vocabulary.
- **The math** — the revenue ladder + the Nov-30 decision gate + the barbell note.
- **Competitors** — the full comparison table.
- **The ask** — design-partner offer + the closing quote.

## 3. `prototype-antifragile-saas-stakeholder.html` — the customer-facing awareness page (SEND THIS)
The file to actually put in front of a **trade-business owner** to raise awareness + earn a "book a call" **before the product is built.** Same worksite identity as #2, but a different job, so a deliberately different shape:
- **Audience = the buyer** (HVAC/refrigeration shop owner or office manager), not you. Every section answers *their* question. Pitch #2 is the founder's briefing (keeps the antifragility thesis, the 3-view dashboard, the math, the Nov-30 gate); this one **cuts all founder-facing material** — no antifragility grid, no durable-vs-antifragile vocabulary, no kill-gate, no barbell, no investor cover, no "you cannot be blown up" quote.
- **HVAC & refrigeration-led** (electrical rides along). Chosen for THIS founder from the plan's own logic: strong on criterion (f) employer-burden (EPA-608/OSHA/first-aid are company-held, unlike electrician journeyman CE); (g) accessible via TX TDLR company-level AC-contractor license CSVs; and the §1.4 warm path — the natural design-partner #1 is a **Vietnamese-American shop owner** (composite "Trần's Cooling & Heating"), reachable in Vietnamese with instant trust. If the locked trade changes, swap the roster/cert names + the `[TRADE]` copy.
- **Structure (customer-first spine = §3 trust ladder + Hormozi fear-first):** cover → hero live countdown → the problem story (Sarah, the lapse, the $16k chain) → what you get for $199/mo (5 pillars) → **single** status-board demo (working renew buttons; the 3-view toggle stays in pitch #2) → the loop click-through (working quiz gate) → the audit-report artifact → **"Isn't this just a $49 reminder app?"** (honest comparison + disqualifier, scripted from §1.5) → **honest founding-partner invite** (pre-build stated plainly, turned into an exclusive) → **one CTA** = the §1.5 diagnostic question + a mailto "book a 20-min call."
- **Honesty frame:** says out loud it's in active development and recruiting founding partners; escrow/backup guarantee promised "from your first day." Footer keeps the "not yet a live service, data illustrative" disclosure.
- **Verified in-browser (2026-07-08):** UTF-8 (had to add `<meta charset>` + viewport — without charset the em-dashes/·/×/Vietnamese name mojibaked to windows-1252), live countdown, dashboard renew → row flips green + KPIs recompute, loop quiz wrong/right states + green flip, theme toggle, audit report stays white in dark mode, no horizontal overflow at 390px (table scrolls in its own wrapper).

> [!danger] R6 fact repair (2026-07-10) — MANDATORY before showing these pages to any real buyer
> The demos show **EPA-608 as an expiring cert. It is a LIFETIME certification — it never expires** (verified, epa.gov). Any real HVAC ops manager spots the fake instantly and the demo's credibility dies. Swap the expiring rows to: **state contractor license, first-aid/CPR (2-yr), A2L refresher, OSHA cards**; keep EPA-608 only as a permanent record on file. Cite the Jan-2026 AIM Act 15-lb leak-repair threshold as the regulatory hook instead.

> [!warning] R4 verdict impact (2026-07-10) — before reusing pitch/stakeholder pages
> The council RESHAPE inverts the pitch: lead with **"nothing lapses silently, and you don't do the chasing" (operated service, tracking-first)**; the training loop demos as the closer, not the headline. If these pages get another outing: swap the hero emphasis accordingly, and add a **"What about Connecteam?"** answer beside the "$49 reminder app" section (script in `Antifragile SaaS.md` §1). Old $700-by-Dec math on the pitch page is retired — see runbook §11.

## The verdict (fill in after presenting)
- Did the hero countdown land as the thesis, or read as a gimmick? →
- Which dashboard view do stakeholders gravitate to? →
- Does the audit-report artifact remove the "will an inspector accept this?" doubt? →
- What objection came up that the pitch didn't pre-empt? →
- Keep / absorb into a real deck / delete? →

_When answered: fold the winning framing into the Phase-2 build spec + the real landing page, then delete these prototypes._
