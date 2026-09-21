# S3 — The app: exact steps (Khoi's ruling 2026-09-21 · written the same day)

> [!info] What this file is
> Khoi ruled on Mon 2026-09-21: *"Only one way to find out: I'm willing to accept loss for this MVP as tuition fee and bring it to App Store with ads."* Reference app named by him: **Palm Reader & Zodiac: MagicWay** (Reatility Corp., id1597514997). This file is the build-and-ship sequence for something like it, with the two gates Apple controls stated first. [[Q4 Sprint]] §5 carries the ruling; [[Weekly Tasks]] carries the scoreboard wiring. Read with [[q4-research/S2-scorecard-council]] (the astrology screens of Sep 21 — still true, now accepted as tuition).

## 0. The ruling and what it amends (dated 2026-09-21)
- **R9 (≤$20)** → fixed costs **≈ $135–155** before ads (Apple $99/yr · Google Play $25 once · domain ~$10 if none · ~$10–20 API credit) **plus a four-figure ad budget Khoi names in USD**. Ads are ON for this lane (R9's "no paid ads" is suspended for it).
- **R3 (first dollar Oct 18 / max Nov 16)** → **submit to App Review by Sun Oct 18**; **first paid conversion by Sat Oct 31** (inside Apple fiscal October → cash **Thu Dec 3**); **hard max Sat Nov 28** (fiscal November → cash **Thu Dec 31**). Anything sold Nov 29 or later pays **Feb 4, 2027** — outside the sprint.
- **R2 ($3,000 cash by Dec 31)** → for this lane "earned" = **proceeds booked in App Store Connect**; cash follows Apple's calendar above. The $3,000 figure is not reachable on this rail by Dec 31 and Khoi knows it — the target is the **proof**, priced as tuition.
- **R8 (≤12h, first 8–10h to the sprint, venture-free evening, governor)** — untouched. **R5** — irrelevant here (paid search ads, not community posts). **§10 "no second research round"** — not breached: this is execution planning for a named pick, not a hunt.
- Closed by this ruling: the R9×T3 Connects conflict and the R10 40-proposal question (no proposals in this lane).
- **Fallback chain, pre-committed:** 4.3(b) rejection ×2 → Google Play release (closed test warmed from Oct 7, see §7) → the playable-ads plan in [[Q4 Sprint]] §5 (kept as written).

## 1. The reference app, read off the stores (2026-09-21)
| Fact | Palm Reader & Zodiac: MagicWay |
| --- | --- |
| Seller | Reatility Corp. (Play: Reatility Media, package `com.vetrov.astromagic`); portfolio studio — also LoveWise (psychic advice), AstroBook, Dream Book |
| First released | Nov 30, 2021 (iOS) |
| iOS | Lifestyle · 4+ · English only · iOS 15+ · 68.6 MB · **447 ratings, 4.6★** (written reviews 3.3★/49) · **50K+ downloads** · outside US Lifestyle top 30 |
| Android | **1M+ downloads · 43.2K reviews · "Contains ads" + IAP** |
| IAP (iOS, verbatim) | **Weekly Premium $4.99 · Monthly Premium $8.99 · Yearly Premium $24.99** |
| Features claimed | "Life Palm Reading AI" with visual overlay of palm lines and "energetic points"; daily/weekly/monthly horoscopes; lunar phases; zodiac compatibility; tarot; runes; numerology (Play text) |
| What users complain about | paywall on core functions, "trial practices", palm scanner hard to use, **repetitive horoscope content** (MWM review summary) |
| Peers in the same shelf | Kaave 10M+ · Faladdin 10M+ · HelloBot 2.5M+ — all updated Sep 2026 |
Read: a 2021 app from a multi-app studio, ~50K iOS installs in ~5 years, monetised on a $4.99 weekly. The iOS numbers are small; the Android numbers are where their volume is. ==Do not copy their claims ("expert-approved algorithms", "top astrologers") — Guideline 2.3.1 treats unprovable marketing as grounds for removal.==

## 2. The two gates Apple controls
### 2a. Guideline 4.3(b) — fortune telling is a named saturated category
Verbatim (App Review Guidelines, read 2026-09-21): *"Don't submit apps that are indistinguishable from what's already widely available… Certain kinds of apps, such as dating, flashlight, sound effects, wallpaper, simple timers, and **fortune telling**, are well established on the App Store and **we will not accept new submissions unless they offer a meaningfully different or improved experience**. We may remove these apps from the App Store going forward if they are not updated, improved, or do not attract customers."*
The rejection notice this produces (quoted by iMore from a 2021 case): the app *"primarily features astrology, horoscopes, palm reading, fortune telling or zodiac reports"* and *"duplicates the content and functionality of many other similar apps"*; *"we simply have enough of these types of apps on the App Store and they are considered a form of spam."* That developer was rejected twice and shipped on Android instead. 2025–26 forum threads report the same rejection surviving renames, keyword removals and metadata changes.
==Consequence: a straight MagicWay clone from a brand-new individual account is the textbook 4.3(b) rejection. The "meaningfully different" layer is not polish; it is the admission ticket. §3 decides it.==

### 2b. The payout calendar (Apple fiscal year 2027, 5-4-4 weeks, pays ~33 days after month end)
| Apple fiscal month | Sales period | Payday | Counts for the sprint? |
| --- | --- | --- | --- |
| October 2026 (5 wks) | **Sep 27 – Oct 31** | **Thu Dec 3** | yes |
| November 2026 | **Nov 1 – Nov 28** | **Thu Dec 31** | yes — last day cash can land inside the sprint |
| December 2026 (5 wks) | Nov 29 – Jan 2 | Thu Feb 4, 2027 | no |
Rules read off Apple's own pages: payment "within 45 days of the last day of the fiscal month"; **minimum payout $40 USD** (Vietnam is not in the exception table, so the default applies); paid by EFT/low-value transfer to the bank on file in the account currency you choose; Paid Apps Agreement + banking + tax forms must be in effect. **Small Business Program (15% instead of 30%)**: new developers qualify; adjusted proceeds start **15 days after the end of the fiscal month in which enrollment is approved** → approved by **Sat Sep 26** = 15% from Oct 11; approved in fiscal October = 15% only from Nov 15. ==Enroll this week.==

## 3. The differentiator (decided): the tử vi layer
The MagicWay skeleton (palm scan → reading → paywall → daily horoscope → compatibility) stays. The layer that makes it "meaningfully different" — and that no incumbent on that shelf carries — is **Vietnamese astrology, bilingual EN/VI**:
- **v1 (tables, no research needed):** Can Chi (Thiên Can · Địa Chi) of the birth year/month/day/hour from the Vietnamese lunar calendar (Hồ Ngọc Đức's `amlich` algorithm, UTC+7); the 12 con giáp; Ngũ Hành nạp âm (the 60 Hoa Giáp table); hợp/xung compatibility (tam hợp · tứ hành xung); a daily horoscope **by con giáp** next to the Western sun-sign one; the palm reading delivered in EN and VI.
- **v2 (after first money):** the full lá số Tử Vi Đẩu Số (12 cung) — a real product, weeks of work, not v1.
Why this and not another "unique feature": (1) it is visibly different content to a reviewer in 30 seconds; (2) the buyer with USD who searches "tử vi" / "xem bói" in the **US** App Store is the Vietnamese-American diaspora (~2.3M) and nobody bids on those keywords, so Apple Ads there will be the cheapest taps you can buy; (3) it is the edge [[q4-research/S2-scorecard-council]] already flagged on Sep 21; (4) Tết is **Feb 17, 2027** — the demand spike lands right after the sprint, on an app that already exists. ==The English-first UI still serves the general palm-reading searcher; the tử vi layer is additive, not a pivot.==

## 4. Accounts and costs — open in this order
| # | Account | Where | Cost | When | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | Apple Developer Program (Individual) | Apple Developer app on iPhone → Enroll | **$99/yr** (auto-renews) | **Mon Sep 21** | Own card chargeable in USD; legal name as on passport; 2FA on the Apple Account; approval 24–48h typical |
| 2 | Paid Apps Agreement + bank + tax | App Store Connect → Business → Agreements | $0 | the hour approval lands | Bank: ACB, account **in Khoi's own name**; currency USD if the ACB USD account (already on the backlog) exists, else VND; tax: W-8BEN as a non-US individual |
| 3 | Small Business Program | developer.apple.com/app-store/small-business-program/enroll | $0 | **before Sat Sep 26** | 15% commission from Oct 11 if approved in fiscal September |
| 4 | Domain + 3 static pages (privacy · terms/EULA · support) | Cloudflare Pages | ~$10 if no spare domain | Week 1 | Required URLs for the listing and the paywall |
| 5 | Cloudflare Workers + KV | existing account | $0 (free tier) | Week 2 | API proxy, rate limit, daily horoscope cron |
| 6 | Anthropic API key | console.anthropic.com | prepay $10–20 | Week 2 | Claude Haiku 4.5 for readings (≈ $0.005–0.01 per palm at ~1,500 image tokens + ~800 output) |
| 7 | RevenueCat | app.revenuecat.com | $0 to $2,500 MTR, then 1% | Week 3 | Products, entitlements, Paywalls, Apple Ads attribution |
| 8 | Google Play Console | play.google.com/console | **$25 once** | **by Tue Oct 7** | Only to warm the 12-tester × 14-day closed test that gates production for new personal accounts — the 4.3(b) hedge |
| 9 | Apple Ads | ads.apple.com | the four-figure budget | the day the app is live | Vietnam is an available advertiser country (Apple Distribution International terms); needs a live app |
Fixed total before ads: **≈ $135–155**.

## 5. The stack (exact, all already his or free)
- **Expo (React Native, TypeScript) + expo-router**, iPhone-only (`ios.supportsTablet: false` → one screenshot set). `expo-camera` + `expo-image-manipulator` (resize to ≤1024px before upload). `react-native-reanimated` for the scan animation. `expo-localization` + i18n JSON for EN/VI. Builds: **local Xcode archive on this Mac** (free) or EAS Build free tier; TestFlight for the internal test.
- **Subscriptions: `react-native-purchases` + `react-native-purchases-ui` (RevenueCat Paywalls v2)** — the paywall is configured in the RevenueCat dashboard, not hand-built; entitlement `premium`. Anonymous RevenueCat app-user IDs; **no account system, no login** (removes Sign in with Apple and the demo-account requirement).
- **Backend: one Cloudflare Worker.** `POST /reading` (image → Claude → structured JSON, image discarded, never written to R2); `GET /daily` (KV); cron trigger 00:10 UTC generating 12 sun signs + 12 con giáp × EN/VI. Rate limit per app-user ID in KV: free = 1 palm reading, premium = unlimited (entitlement checked server-side via RevenueCat REST). Anthropic key lives only in the Worker.
- **Astro math on device:** sun sign table; moon sign via `astronomy-engine` (MIT); Vietnamese lunar date + Can Chi via a TS port of `amlich`; 60-Hoa-Giáp and hợp/xung as static tables. **No Swiss Ephemeris** (AGPL — licence trap in a closed-source app).
- **Reading prompt contract:** returns `{hand_detected, lines:{heart,head,life,fate}:{shape,text_en,text_vi}, summary_en, summary_vi, insights[3], lucky:{colour,number,day}}`; system prompt forbids health, medical, legal and financial predictions and frames everything as reflection/entertainment (protects against 1.4.1-style objections and provider policy alike). `hand_detected=false` → "retake" screen, no reading consumed.

## 6. v1 scope — screens in build order, with hours (≈ 40h total)
| # | Screen / piece | What it does | h |
| --- | --- | --- | --- |
| 1 | Onboarding quiz (6 screens) | name · gender · birth date · birth time (optional) · birth city (optional, text) · focus (love / career / money / self) · language EN/VI; computes sun sign, con giáp, Can Chi, ngũ hành locally; progress bar; "for reflection and entertainment" line on screen 1 | 6 |
| 2 | Palm capture | hand outline overlay, left hand, auto-capture on stillness or tap; resize; **"Use a sample palm" button** (App Review needs to reach the reading without a hand — Guideline 2.1(a) demo mode) | 5 |
| 3 | Scan animation + reading | 6–8 s animated line tracing while the Worker responds; result: 4 lines + summary; **first line free, rest blurred → paywall** | 6 |
| 4 | Paywall (RevenueCat Paywalls) | weekly $4.99 with **3-day free trial** (default selected) · yearly $24.99; price, period, auto-renew and trial-end wording; Restore Purchases; Terms + Privacy links | 3 |
| 5 | Home / Today | Western daily horoscope + con giáp daily, moon phase, lucky items; pull-to-refresh from KV | 4 |
| 6 | Compatibility | two signs (Western) + two con giáp (hợp/xung table) → one generated paragraph, cached per pair | 3 |
| 7 | Profile | birth data edit, language switch, manage subscription (deep link to App Store), delete data (clears local + RevenueCat alias), support email | 2 |
| 8 | Worker | `/reading`, `/daily`, cron, rate limit, entitlement check | 5 |
| 9 | Store assets | icon, 5 screenshots (6.9-inch set), title/subtitle/keywords, description, privacy labels, review notes | 4 |
| 10 | Test + submit | TestFlight to 3 people, sandbox purchase + restore, submit | 2 |
Not in v1 (each is a week and none is the admission ticket): tarot, runes, numerology, chat-with-an-astrologer, widgets, Android build, ad SDK. ==Add tarot first in v1.1 — it is the cheapest daily-return hook and the one users of the reference app praise.==

## 7. Calendar — Mon Sep 21 → Sat Nov 28 (≤10h/wk, R8)
- **Week 1 · Sep 21–27 (~10h):** **Today:** enroll in the Apple Developer Program from the iPhone (§4 #1). The hour approval lands: Paid Apps Agreement, bank, W-8BEN (#2), then Small Business Program (#3) — **must be approved by Sat Sep 26**. Pick the app name (§8.1). Domain + privacy/terms/support pages (1h). Scaffold Expo, build the onboarding quiz + astro/Can Chi module (6h). Sunday: log hours on the scoreboard row.
- **Week 2 · Sep 28–Oct 4 (~10h):** palm capture, Worker `/reading` with the prompt contract, scan animation, reading screen. First real palm reading on device by **Sun Oct 4**.
- **Week 3 · Oct 5–11 (~10h):** App Store Connect subscription group + 2 products + trial (§8.2); RevenueCat products/entitlement/paywall; gating; daily horoscope cron + Home; compatibility. **Tue Oct 7:** open Google Play Console ($25), upload any build to a **closed test with 12 testers** (family + friends — the family channel), because the 14 consecutive days must end before production can be requested (→ Oct 21).
- **Week 4 · Oct 12–18 (~10h):** EN/VI strings, profile, polish, icon, screenshots, privacy labels, review notes; TestFlight to 3 people; sandbox purchase + restore. **Submit for review by Sun Oct 18.**
- **Week 5 · Oct 19–25:** App Review (typically 1–3 days; budget 7). A 4.3(b) rejection is answered **the same day** in Resolution Center with the §3 differences listed as facts, not adjectives. The day it goes live: Apple Ads account + first campaign (§10), daily cap $20–30. TestFlight build to the Play closed test too.
- **Oct 26–31:** first installs → trial starts → the 3-day trial converts. **First paid conversion by Sat Oct 31 = fiscal October = cash Thu Dec 3.** Sunday Nov 1: first full funnel read (§10 metrics).
- **Nov 1–28:** read every Sunday (Nov 8 · 15 · 22); scale or kill by the §10 rules; ship v1.1 (tarot) if the funnel holds. **Sat Nov 28 is the last sale that pays inside the sprint (Dec 31).**
- **Sun Nov 15 fold rule (kept from §5):** not live on either store, or live with <$100 proceeds booked → stop building, run the ads you already bought to their cap, and fold into the Nov 30 / Dec 13 verdict season.

## 8. App Store Connect — do once, in this order
1. **Name (≤30 chars) / subtitle (≤30) / keywords (100).** Never "MagicWay" or any peer's name (4.1(c)). Pattern: `Palm Reader & Tử Vi: <Brand>` · subtitle `Palmistry · Horoscope · Tử Vi` · keywords `palm reading,palmistry,read my palm,horoscope,zodiac,tu vi,xem boi,boi tay,12 con giap,compatibility,moon`.
2. **Subscriptions:** group "Premium" → `premium_weekly` $4.99 with **Introductory Offer: free trial, 3 days** → `premium_yearly` $24.99 (add `premium_monthly` $8.99 only if a paywall test wants it). Each needs a localized display name, description and a review screenshot; the first subscription ships **with** the app version.
3. **App Privacy labels:** Photos (palm image — app functionality, not linked, not stored), Purchase history (RevenueCat), User ID (anonymous), Usage data if analytics. No tracking → **no ATT prompt** needed; Apple Ads attribution via the AdServices token does not require ATT.
4. **Age rating questionnaire:** answer honestly; the reference sits at 4+.
5. **Export compliance:** standard HTTPS only → exempt. **Content rights:** all generated/own.
6. **Screenshots:** one 6.9-inch iPhone set of 5; #1 palm scan, #2 the tử vi/Can Chi card (the difference must be visible), #3 reading, #4 today, #5 compatibility.
7. **Notes for Review (be specific — 2.3.1):** no login; "Use a sample palm" button reaches the reading; palm images are processed in memory and discarded; IAP product IDs listed; the sentence *"Differs from existing palm/horoscope apps by adding Vietnamese lunar-calendar astrology (Can Chi, con giáp, ngũ hành, hợp/xung) in English and Vietnamese, side by side with palmistry."*
8. **Pricing/availability:** all storefronts; US price tier as above; Vietnam storefront auto-converted (fine for v1).

## 9. Compliance checklist — each line is a known rejection or removal reason
- Paywall shows **price, billing period, auto-renewal, and when the trial ends**, plus **Restore Purchases**, **Terms (EULA)** and **Privacy Policy** links (3.1.2). RevenueCat Paywalls templates carry these; do not remove them.
- Privacy policy names the third parties (Anthropic API for readings, RevenueCat for purchases, Apple Ads attribution), the **no-retention** rule for palm images, and how to delete data (5.1.1(i)).
- `NSCameraUsageDescription`: *"We use the camera to photograph your palm for your reading. The photo is analysed and then deleted; it is never stored."* Add `NSPhotoLibraryUsageDescription` if you allow picking from the library.
- **Palm images are biometric-adjacent** ("hand geometry" is a named biometric identifier under Illinois BIPA): process and discard, no templates, no storage, no third-party retention — and say so. One sentence in the policy, one in the review notes.
- Onboarding screen 1 and the App Store description carry *"for reflection and entertainment"*; the prompt forbids health, medical, legal and financial predictions.
- No "expert-approved", "top astrologers", "precise" claims (2.3.1). Describe what it does.
- Full functionality for the reviewer without a hand (sample palm) and without an account (none exists) (2.1(a)).
- Nothing hidden or dormant; v1.1 features ship in v1.1 (2.3.1(a)).

## 10. Launch and paid UA — how the tuition is spent
- **Day 0 (live):** create the Apple Ads account (Vietnam advertiser, ADI terms), attach the app, enable RevenueCat's Apple Ads attribution so trials/paid are attributed per keyword.
- **Campaign 1 — Search results, US storefront, exact match only:** `palm reading` · `palm reader` · `palmistry` · `read my palm` · `tu vi` · `tử vi` · `xem boi` · `boi tay` · `12 con giap` · `tu vi 2027`. **Exclude** `horoscope`, `astrology`, `zodiac` (broad, expensive, owned by 10M-install apps). Max CPT bid $1.50 English / $0.50 Vietnamese; **daily cap $20–30**; run 14 days before touching anything.
- **Read on Sundays (Nov 1 → 8 → 15 → 22), per keyword:** taps → installs (CPI) → onboarding completion → paywall views → **trial starts** → **trial→paid** (3 days later) → refunds → D7 opens.
- **Decision rules, written before spend:** install→trial **≥10%** and trial→paid **≥35%** and CPI **≤$3** → keep and add $10/day; any one below → pause that keyword; all below for two Sundays → stop ads, keep organic, fold per §7. Vietnamese keywords are the cheapest taps you can buy: if they convert at all, they carry the campaign.
- **Meta/TikTok only after Apple Ads has 30+ trials of data** — they need creative, a pixel/SKAdNetwork setup and an ATT prompt; not v1.
- **Ad monetisation (AdMob rewarded)** is a v1.1 decision at the earliest: it adds an SDK, an ATT prompt and review surface for cents per user; the reference monetises on subscriptions, not ads.

## 11. The money, honestly (so the tuition buys a number, not a feeling)
- **Price mirror:** weekly $4.99 (net **$4.24** at 15%) · yearly $24.99 (net **$21.24**). Weekly astrology subs live ~4–6 weeks on average → **$17–25 net per weekly subscriber**; yearly pays once.
- **Funnel bands (category, hard paywall after a quiz):** install→trial 10–15% · trial→paid 35–45% → **install→paid 4–7%**. At CPI $2–3 → **$30–75 per paying subscriber**, against $17–25 back. ==Expected result: roughly half to two-thirds of ad spend is lost — that is the tuition, stated in advance.==
- **$1,000 of ads, illustrative:** 350–500 installs → 35–75 trials → **14–30 paying strangers** → **$300–600 proceeds booked** over ~6 weeks, cash on Dec 3 / Dec 31 for the part sold by Nov 28. The proof ("a stranger paid me for my own product") arrives with the first conversion, ~day 3–5 of spend.
- **Break-even only if** CPI ≤ ~$0.60 or trial starts ≥ 40% or the Vietnamese-keyword niche delivers near-free taps plus organic installs. Those are the three numbers the tuition is buying.
- **What counts, and when:** proceeds appear in App Store Connect within a day of purchase (booked); cash lands Dec 3 (fiscal Oct) and Dec 31 (fiscal Nov) if ≥$40 is due. Vietnam's tax on individuals' platform income is Khoi's to declare — one line to the accountant, not a step here.

## 12. Failure branches (pre-decided)
1. **4.3(b) rejection #1** → same-day Resolution Center reply listing the §3 differences as features the reviewer can open; attach the screenshot of the Can Chi card. No metadata games — they are on record as not working.
2. **Rejection #2** → the Google Play path is already warm (§7, closed test from Oct 7 → production request from Oct 21); ship there, run the same Apple-Ads-shaped test with Google Ads UAC at the same daily cap; Play pays Vietnam too.
3. **Rejected on both, or not live by Nov 15** → the playable-ads lane in [[Q4 Sprint]] §5 as written; the Expo/Worker code is reusable, the $99 is sunk.
4. **Live but install→trial <5% after 14 days** → the paywall, not the ad, is the problem: change the free/blurred split and the trial default before buying more taps.

## 13. Scoreboard wiring ([[Weekly Tasks]] · Q4 column, amended 2026-09-21)
`Q4` = **installs this week / paid conversions this week / Σ proceeds booked (USD)**. Cash arrival (Dec 3 · Dec 31) is written in **Signal** when it lands. Until the app is live, the row reads `0/0/0` and hours + Gov? still count — the governor is the only thing that protects the day job while this runs.

## 14. BUILD SPEC — settled by grilling session 2026-09-21 (14 questions, all ruled)
**Name: `Palmara`.** Verified 2026-09-21 against the iTunes Search API and whois: nothing on the US App Store has a name starting with "Palmara"; `getpalmara.com` is free. ==His first choice "Palmist" was STRUCK: `Palmist: Best AI Palm Reader` (Global Sense Cyprus Limited, 4,481 ratings) already owns it, plus `Palmist AI` and `Palmist - AR Palm Reader` — Guideline 4.1(c) forbids another developer's product name.==

**The tử vi layer is DROPPED — Khoi's ruling, verbatim:** *"dont worry about this being Vietnamese or lunar tet based, we'll keep it global first, where the money's at"* and *"we'll keep it MINIMAL and english only to prioritize SPEED."* ==This removed §3's answer to Guideline 4.3(b), so a replacement differentiator was required and ruled the same day.==

**The new 4.3(b) answer — two-hand reading + a real traced overlay.** Palmistry's own tradition: the **non-dominant hand = what you were born with**, the **dominant hand = what you made of it**. Palmara scans BOTH and returns a *potential vs path* comparison, and renders the detected lines onto the user's **actual photograph** rather than a stock hand graphic. No app on the shelf does either. ==One sentence a reviewer can verify in 30 seconds.== The shelf it must differ from, pulled 2026-09-21: Palm Reader: My Life Palmistry **10,054** ratings · Palm Reader: Palmistry Fortune **6,474** · Palmist: Best AI Palm Reader **4,481** · PalmHD **1,911** · Palm Reader: Palmistry Life **1,032** · MagicWay **447**. Couples-compatibility (two people's palms, one relationship read) is the **v1.1** growth hook, not v1.

| Decision | Ruled 2026-09-21 |
| --- | --- |
| Q1 Supabase account | **New personal account, personal email, own org, Free plan** — never the employer's `EO Global` (Pro, holding EO Vietnam + global-hubspot). Region **East US (N. Virginia)**: the buyers are American. ==This session's Supabase connector stays pointed at EO and is NOT used; the personal project is driven by the CLI + local Docker stack only.== |
| Q2 Auth | **Supabase anonymous sign-in.** Real user rows, JWT and RLS from first launch, no UI, no signup wall before the paywall, no Sign in with Apple obligation. Upgrade path kept for v1.1. |
| Q3 Claude | **Haiku 4.5 for everything** (Khoi: *"I just want to see it live first, then we can switch model later under 30s with a one-line config change"*) → the model id lives in ONE config constant. |
| Q4 Palm photo | **Never stored.** Image → Edge Function → Claude → discarded. Only the generated reading is persisted. Hand geometry is a named biometric identifier under Illinois BIPA; the no-retention line goes in the privacy policy AND the review notes. |
| Q5 Name | **Palmara** (see above). |
| Q6 Tests | **None in v1** (Khoi: *"This is a PoC/MVP… Prioritize SPEED and REVENUE over everything else."*) ==Safer than it was: dropping tử vi removed the lunar-calendar and Can Chi calculators, which were the only silent-failure surface.== |
| Q7 Scope | **English only, minimal.** No tử vi, no tarot, no runes, no numerology, no compatibility screen in v1. Localization only after actual revenue. |
| Q8 Free vs paid | **Free:** daily horoscope, the traced line visualization, the first reading's summary. **Paid:** the full two-hand comparison and the advanced sections. ==Visualization is deliberately free — it buys the emotional investment that makes the paywall convert.== |
| Q9 Builds | **EAS Build (cloud)** for both platforms; Expo Go for plain UI, a cloud dev-client once RevenueCat lands. Xcode (~15GB) downloads in the background as unattended insurance. ==No Xcode, no Android SDK, no CocoaPods, no Watchman on this machine — verified 2026-09-21.== |
| Q10 Repo | `~/Documents/Personal/palmara`, **private, GitHub `HelpMe-Pls`** (personal). Never `Kh0iLe`/`EO-Vietnam`. **bun**, TypeScript strict + bundler resolution + verbatimModuleSyntax, **Prettier only** (no ESLint, no Biome), source in `app/`, commits as `<type>(<scope>): :gitmoji: <description>` — all mirroring `elearning-platform`. |
| Q11 Supabase dev | **Local stack** via Docker + the `supabase` CLI as a devDependency, migrations in the repo; the cloud project is purely a deploy target. |
| Q12 Differentiator | **Two-hand reading** (see above). ==The second differentiator, the real traced overlay, was **withdrawn 2026-09-21** — see §15.== |
| Q13 Name check | Done against the live store, not guessed. |
| Q14 Onboarding | **Two fields kept** — birth date + focus area. They power the free daily horoscope, which is the only reason anyone opens the app tomorrow. |

**Cost — the build itself is $0.** Supabase Free · RevenueCat free to $2,500 monthly tracked revenue · Expo/EAS free tier · **GitHub Pages for the privacy, terms and support pages, which removes the domain purchase entirely**. Spend is **Apple $99 + Google Play $25 + ~$10 Anthropic credit**, then ads. ==Down from the §4 estimate of $135–155 because the domain is gone.==

**v1 screens (7):** intro (2 fields) → scan non-dominant hand → scan dominant hand → processing + overlay reveal → reading (free summary + visualization, paid sections blurred) → paywall (RevenueCat) → today (free daily) + profile/settings (restore, delete data, support, manage subscription).

**Data model:** `profiles` (id = auth.uid, birth_date, focus) · `readings` (user_id, hand, lines jsonb, summary, sections jsonb) · `daily_horoscopes` (sign, date, text) generated by a scheduled Edge Function. RLS: own rows only; dailies readable by any authenticated user. Free-reading cap enforced **server-side** by counting rows; premium sections gated client-side by the RevenueCat entitlement.

## Sources (read 2026-09-21)
- App Store listing: https://apps.apple.com/us/app/palm-reader-zodiac-magicway/id1597514997 · Play listing: https://play.google.com/store/apps/details?id=com.vetrov.astromagic · MWM profile: https://mwm.ai/apps/palm-reader-zodiac-magicway/1597514997
- App Review Guidelines (4.3(b), 3.1.2, 5.1.1, 2.3.1, 2.1(a)): https://developer.apple.com/app-store/review/guidelines/
- Rejection notice text (2021 case): https://www.imore.com/apple-rejects-developers-horoscope-app-says-app-store-has-enough
- Receiving payments: https://developer.apple.com/help/app-store-connect/getting-paid/overview-of-receiving-payments/ · Minimum threshold ($40 default): https://developer.apple.com/help/app-store-connect/reference/reporting/minimum-payment-threshold · Banking: https://developer.apple.com/help/app-store-connect/manage-banking-information/enter-banking-information
- Small Business Program: https://developer.apple.com/app-store/small-business-program/ · Enrollment: https://developer.apple.com/support/enrollment/
- Fiscal calendar and pay dates: https://www.revenuecat.com/blog/growth/apple-fiscal-calendar-year-payment-dates · https://help.appfigures.com/en/article/apples-fiscal-payout-calendar-14y0j5z/
- Apple Ads country terms (Vietnam → ADI): https://ads.apple.com/countries-regions-terms · RevenueCat pricing: https://www.revenuecat.com/pricing/

## 15. Amendment 2026-09-21 — the traced overlay is withdrawn

**Khoi's ruling (2026-09-21):** ship without it. Launch on the two-hand comparison alone, keep the **Sun Oct 18** submission date, revisit crease detection only if there is revenue.

**What happened.** The planned differentiator was *detected line geometry drawn on the user's own photograph*. It could not be built. The model does not trace; it reproduces a textbook palm diagram and ignores the photograph.

**The test that settled it.** Feed the model an image and its exact horizontal mirror. A real trace must mirror too (`x → 1−x`). It did not:

| measurement | result |
| --- | --- |
| distance from mirrored answer to *mirrored* input | 0.234 |
| distance from mirrored answer to *unmirrored* input | 0.036 |
| life line, the starkest case | 0.719 vs 0.045 |

The model also reported the thumb on the **left** for both an image and its mirror, which is impossible. Five configurations were measured — Haiku and Sonnet, a hard anti-template prompt, and a grid-annotated image — and every one templated. **This is a capability limit, not a prompt bug.**

**The alternative, priced honestly.** Classical crease extraction passes the same test at **0.010 vs 0.338**, because it is pixel-derived by construction. But two prototypes locked onto the hand's silhouette and fine vertical texture rather than the three major creases. Making it real means tuning the extractor *and* porting a ridge filter plus skeletonisation to TypeScript or WASM for the Deno edge function: 2–4 days with real uncertainty, which pushes submission past Oct 18 toward the Nov 28 fallback and moves cash from **Dec 3 to Dec 31**. That is what the ruling declined.

**Consequences to carry forward.**
- The 4.3(b) admission ticket is now **the two-hand mechanic alone**. The App Review notes must lead on it, and it must be visible to a reviewer within thirty seconds.
- Nothing is drawn on the palm. The reading shows each photograph with a written observation per line, labelled *Hand 1 of 2* and *Hand 2 of 2*.
- `scripts/mirror-test.py` in the app repo keeps the evidence runnable. The smoke test fails if coordinates ever return.
- New hard rule in `CLAUDE.md`: **never present generated content as measurement.** If the app says it detected something, it must have detected it.
