# RAILS-INTEL — what a Vietnam-based solo seller can and cannot get paid through (verified 2026-07-17)

Permanent portfolio asset from the Venture-4 hunt: ==23 agents' worth of rail verification, all primary-source.== Re-check dates quarterly; every row carries its source.

## Verified WORKING for a VN individual/solo seller

| Rail | Class | The verified facts | Source (accessed 2026-07-17) |
|---|---|---|---|
| **Apple App Store** | platform payout | VN individual developers are first-class: Aug 21 2025 developer news defines VN tax treatment explicitly (==2% PIT + 5% FCT on Apple's commission==); ==0% US withholding on US-storefront sales with W-8BEN== (proceeds treated as sales, not royalties — the unratified VN–US treaty is moot); net-keep ≈78–83% of gross at the 15% small-business tier | developer.apple.com/news/?id=yo2104n5 |
| **Google Play** | platform payout | VN in the supported-locations table for BOTH developer and ==merchant registration== (paid apps/IAP); default currency VND, payouts in USD/EUR; ==2% WHT applies only to sales to VN end-users== | support.google.com/googleplay/android-developer/answer/9306917 |
| **Atlassian Marketplace** | platform payout | EFT to any bank account in the partner's name ($500 minimum accrual, USD); ==individuals without a company may sell==; no country list excludes VN; ==Forge apps: 0% platform fee to $1M lifetime from Jan 1 2026, then 16% (17% from Jul 1 2026)== | atlassian.com/licensing/marketplace/partneragreement + atlassian.com/blog/development/updates-to-marketplace-revenue-share-2026 |
| **Figma Community** | platform payout | ==Vietnam explicitly on the seller-payout supported-countries list== ("…United States, Uruguay, Vietnam"); caveat: forum reports of disabled price fields for NEW sellers (Mar 2026) — payments infra allows VN, onboarding friction unresolved | help.figma.com/hc/en-us/articles/12067637274519 |
| **Freemius** (WP/plugin MoR) | web MoR | Vietnam explicitly on the Supported Countries page; payouts via PayPal MassPay (default), Payoneer, wire/SWIFT, or Wise | freemius.com (supported-countries page, verified in round-1 evidence) |
| **Dodo Payments** | web MoR | Publishes a dedicated ==“Merchant of Record in Vietnam”== page targeting VN sellers (FCT/VAT handling); VN absent from the restricted-merchants list | dodopayments.com/blogs/merchant-of-record-vietnam |
| **Paddle** (the incumbent) | web MoR | Still onboards VN sellers 2026: supports "anywhere in the world" except a sanctions list that does NOT include Vietnam; "subject to change" caveat printed | paddle.com/help/start/intro-to-paddle/which-countries-are-supported-by-paddle |
| **Setapp/MacPaw** | platform payout (gatekept) | No public country list; ==existence-proof: BoltAI (solo dev, HCMC) paid via Setapp since ~2024==; 70% usage-weighted pooled share; Mar 2026 "Setapp Marketplace" adds standalone own-price sales — but acceptance is invite-first/curated | docs.setapp.com/docs/distributing-revenue + support.setapp.com + setapp.com/news |

## Verified BROKEN / FAILING / CLOSED for VN

| Rail | Status | The verified facts | Source |
|---|---|---|---|
| **Stripe** | closed to VN | VN not on Stripe's supported-countries list (standing fact; now load-bearing because of Lemon Squeezy) | stripe.com/global |
| **Lemon Squeezy** | ==sunsetting into Stripe== | Stripe acquired LS (Jul 2024); LS's own 2026 update: Stripe Managed Payments in public preview with the stated goal of migrating LS users; ==no hard sunset date as of Apr 2026, but the destination excludes VN merchants== — never plan around LS (consistent with [[Antifragile SaaS]] §8's standing rule) | lemonsqueezy.com/blog/2026-update |
| **Gumroad** | probable-fail for VN | Gumroad's own help: payouts are direct bank deposit or PayPal ONLY — ==“Gumroad does not support alternative payout modes like Payoneer, Wise…”; “If your country is not supported… we have no way to pay you out for now”==; VN's absence from the bank-deposit country list is login-gated (unverifiable directly); PayPal payouts restored 2025 — treat as UNRELIABLE, not proven-dead | gumroad.com/help/article/13-getting-paid.html |
| **RapidAPI** | collapsed | Nokia acquired Rapid ~$106M (−90% from $1B peak); marketplace fell from ~4M users/40k APIs to "thousands"/"hundreds" (TechCrunch Nov 2024); ==seller reports: vendor payouts ceased post-acquisition== (Latenode community, Jan 2025) | techcrunch.com + community.latenode.com/t/2888 |

## Standing conclusions
1. ==Rails were never the binding constraint on Venture 4== — seven verified-workable rails exist, including three non-MoR platform-payout rails (Apple, Google, Atlassian).
2. The portfolio's MoR-class concentration risk (Paddle ×2) now has a verified same-class fallback with a VN landing page: ==Dodo Payments== — strictly better than the FastSpring-only fallback note in the sibling runbooks.
3. App-store economics for VN are better than assumed: ==0% US withholding + 15% small-dev commission ≈ 78–83% net-keep== — if a store-rail venture ever clears PMF triage, the money plumbing is a solved problem.
