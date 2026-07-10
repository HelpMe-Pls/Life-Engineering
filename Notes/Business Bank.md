
> **What this is:** the banking decision for the two-venture portfolio ([[EP SaaS]] + [[Antifragile SaaS]]) — researched 2026-07-06 via a 105-agent deep-research workflow over 24 sources (5 search angles: Payoneer mechanics, official bank tariffs, USD-account practice, SBV/tax compliance, PayOS/SePay rails), synthesized same day.
> **Honesty stamp (final, 2026-07-06 evening):** the 3-skeptic-per-claim verification panel was attempted twice and BOTH runs died on session usage caps before casting a single vote. Finalized with the next-best instrument instead: the second run re-extracted every source fresh, so each load-bearing number below was **independently read twice from the same primary source**. Where both passes agree the fact is marked **✅×2 (cross-validated)** — this held for ALL decision-critical facts: the PayOS five-bank list, every bank fee, Circular 25/2025, and the 2026 account-declaration duty. The two places the passes *disagree* (Payoneer's USD→USD fee scope → §4; SePay's Techcombank coverage → §1/§1.1) are shown as open conflicts, not resolved by fiat. No third run — data sufficiency reached. The empirical checks in §9 remain the final word before money moves; none can flip the bank choice.
>
> **VERDICT: Open the business hub at ACB (Asia Commercial Bank).**
> 1. **ACB VND payment account** (tài khoản thanh toán) — opened via eKYC on ACB ONE, minutes, free. This is the hub: PayOS settlements, student transfers, refunds, instructor split.
> 2. **ACB USD foreign-currency account** (tài khoản thanh toán ngoại tệ) — opened at any HCMC branch with CCCD. This receives Payoneer/Paddle USD and lets you sell USD→VND in-app at your timing.
>
> Runner-up: **MB Bank** (flip triggers in §8). Your TPBank stays purely personal — separation achieved by bank, not just by account.

---
## 1. Why ACB — the one-breath version
The single hard constraint decided most of it: **PayOS only settles to *personal* accounts at five banks — MB, OCB, KienlongBank, ACB, BIDV** ([payos.vn](https://payos.vn/)). That eliminates Techcombank, Vietcombank, VPBank, VIB, Sacombank — and your own TPBank — from being the one-bank hub, no matter how good their USD story is. Among the surviving five, ACB is the only one that is simultaneously:
- **The cheapest sourced USD receiver:** inward international credit fee 0.05%, **min USD 2, max USD 200, VAT included** (tariff effective 15/08/2025 — still current) ([ACB tariff PDF](https://acb.com.vn/acbwebsite/files/BIEU%20PHI%20KHCN_up%20web%2008.25.pdf)). At your volumes every credit costs the $2 floor until a single credit exceeds $4,000.
- **PayOS's canonical bank:** the official PayOS docs' collection-channel guide is written specifically for ACB ([payos.vn/docs](https://payos.vn/docs/huong-dan-su-dung/ket-noi-tai-khoan-ngan-hang/)) — lowest-friction linking via Casso's Cas layer, CCCD + phone + account number only, no business registration needed.
- **SePay-compatible** (transfer auto-reconciliation later): ACB appears on every SePay list ([sepay.vn](https://sepay.vn/)). ⚠️ Two-pass conflict: pass 1 read SePay's homepage as excluding Techcombank/VIB from direct connections; pass 2 found SePay's bank-API pages covering ~26–30 banks including every candidate. SePay's own pages disagree — treat SePay coverage as **non-differentiating** between candidates.
- **In-app USD→VND conversion:** ACB ONE supports online FX conversion once you hold an FX payment account + ACB Online registration ([ACB library](https://acb.com.vn/thu-vien/tong-hop-nhung-dieu-kien-chung-khi-mo-5-loai-tai-khoan-ngan-hang-tai-acb), [fingo.vn guide](https://fingo.vn/mo-tai-khoan-ngoai-te-acb)). And the regulatory asymmetry runs your way: *buying* FX needs documented purposes; **selling FX to the bank is an always-permitted debit** (Circular 16/2014/TT-NHNN Art. 4, as amended).
- **HCMC's home bank:** ACB is headquartered in HCMC with the densest branch network where you live — relevant because the USD account and any remittance paperwork are branch-touched.

Vocabulary note for the branch visit: "tài khoản thanh toán" (VND payment account), "tài khoản thanh toán ngoại tệ / tài khoản USD" (the FX account), "nhận tiền chuyển từ nước ngoài" (inward remittance), "bán ngoại tệ chuyển khoản" (sell FX by transfer).

### 1.1 Robustness check — which venture actually imposes the PayOS constraint (Khoi's question, 2026-07-06)
The five-bank constraint comes **entirely from [[EP SaaS]]** (VN students paying VND through the platform's PayOS checkout) plus the one-hub architecture decision. **[[Antifragile SaaS]] is PayOS-free by design** — its rail is Paddle (MoR) → Payoneer → bank, and Paddle handles all customer refunds itself, so that venture's bank needs are minimal: USD lands, gets converted, done.

If the PayOS dependency vanished entirely (EP SaaS moving to pure manual transfers, or per-venture banking): **Techcombank re-enters as the fee winner** — $0 inward credit vs ACB's $2/credit ≈ **~$24/year** at monthly batched withdrawals. What that $24/yr buys by staying at ACB:
- **confirmed in-app USD→VND** on ACB ONE (TCB's in-app conversion is unconfirmed by any fetched source, and its tariff makes other personal USD operations counter-only);
- an FX account **not tied to one branch** (TCB: must open at your VND-opening branch, ~20-unit minimum first deposit — and pass 2 found TCB states it **cannot sell foreign currency to individuals** for that purpose, so you'd have to source the initial USD cash yourself);
- ~~SePay direct-API coverage~~ — **downgraded after pass 2:** SePay's own pages conflict on Techcombank (homepage direct-list omits it; its bank-API pages include it), so SePay is likely non-differentiating and this offset no longer counts;
- zero-cost **PayOS optionality** — the rail can be switched back on without changing banks.

**Verdict: removing PayOS demotes ACB from "forced winner among five" to "preferred on merit by a narrow margin" — the choice doesn't flip.** Re-cut trigger: if EP SaaS actually drops PayOS (not hypothetically), redo the §3 fee table with Techcombank and Vietcombank back in the race — a 10-minute update.

## 2. The four flows, mapped
| Flow | Rail | Cost at ACB |
|---|---|---|
| VND in — [[EP SaaS]] course revenue | PayOS (merchant under your name, CCCD-only signup, **0₫ fees since 23/01/2026**) settling to ACB VND account; direct VietQR/Napas 247 transfers land there too | 0₫ |
| VND out — refunds, ~50% instructor split, tools | ACB ONE transfers (free online domestic transfers are market-standard across all candidates; ACB's international-tariff PDF doesn't cover domestic — sanity-check the 0₫ in-app on day 1) | ~0₫ |
| USD in — Paddle → Payoneer → ACB | Two paths, §4: start Payoneer→VND direct; switch to Payoneer USD→USD account at scale | $2/credit + FX path cost |
| Separation & tax | Dedicated pair, declared to tax authority when the business income starts (§6) | 0₫ + discipline |

## 3. The fee table (sourced 2025–26 tariffs)
Inward international credit, personal accounts:

| Bank                      | Inward USD credit fee                                                                | At $500 | At $2,000 | PayOS personal?       | Source date              |
| ------------------------- | ------------------------------------------------------------------------------------ | ------- | --------- | --------------------- | ------------------------ |
| **ACB** ✅×2               | 0.05%, min $2, max $200 (VAT incl.; fee ≤ credited amount)                           | **$2**  | **$2**    | **Yes (canonical)**   | eff. 15/08/2025          |
| Techcombank ✅×2           | **Free** (code CN13106 "Miễn phí")                                                   | $0      | $0        | ❌ No                  | current PDF              |
| Vietcombank ✅×2           | 0.05%, min $2, max $70 (+VAT; waived if sender pays OUR)                             | ~$2.2   | ~$2.2     | ❌ No                  | 2018 tariff still served |
| TPBank (yours) ✅×2        | 0.10%, min $5, max $200 (+VAT); free if <$10 or via domestic channels                | $5      | $5        | ❌ No                  | current PDF              |
| VPBank (pass 2 only)      | 0.05%, min $2, max $200 (+VAT) · ⚠️ USD acct: $2/mo maintenance if avg balance <$100 | ~$2.2   | ~$2.2     | ❌ No                  | 2021 tariff              |
| MB Bank                   | not captured — tariff page unfetched                                                 | ?       | ?         | Yes (+ business list) | —                        |
| OCB / KienlongBank / BIDV | not captured                                                                         | ?       | ?         | Yes (+ business list) | —                        |

*✅×2 = the number was independently extracted twice (both research passes) from the same official tariff and matched exactly. VPBank's USD-maintenance fee is also the cue to ask ACB the same question at opening (§7/§9).*

Techcombank's $0 is real but unusable as the hub (no PayOS), and its FX account has real friction: branch-only opening **at the branch where your VND account was opened**, minimum first deposit of 20 currency units, inward FX requires already holding the FCY account, and pushing USD out is counter-only. It re-enters only as the USD leg of a two-bank split (§8).

## 4. The USD landing path — the actual money question
Payoneer facts (pricing page + 2026 practitioner guides; the VN corridor rate is deliberately unpublished — confirm in-account, §9):
- Withdrawals to **personal** VN accounts are supported (Payoneer's local-bank FAQ + universal VN freelancer practice); the account name must exactly match your Payoneer name. Caveat from pass 2: that FAQ is fully generic — **zero Vietnam-specific terms** (no bank list, no USD-vs-VND statement, no fee figure).
- **Cross-currency** (USD balance → VND account): Payoneer converts at **up to 2% above mid-market** (published band 1.2–4%) — and the charge is **embedded in the exchange rate**, never itemized as a fee line.
- **Same-currency** (USD → USD account) — ⚠️ **the one genuine two-pass conflict:** 2026 fee guides say $1.50 flat (<$50K/mo; fixed $4 under $400) and name Vietnam as a corridor where USD-as-USD wins; but Payoneer's **own pricing page** scopes the flat fee to *same-country, local-currency* withdrawals only (its example: USA→USA in USD) and prices "local or non-local currency, with or without conversion" at 1.2–4%. Vietnam's corridor rate is deliberately unpublished. **The only decisive source is the withdrawal screen inside your own Payoneer account** — §9 check #1.
- Housekeeping: new bank account approval ≤3 business days; arrival same-day to 2 days; **$29.95/yr inactivity-type fee at low volume** (sources conflict on the threshold: <$2,000/yr per a 2026 guide vs <$6,000/yr — check the pricing page when you set up); internal balance conversions cost 0.5%.

Bank-side FX (live 2026-07-06, VCB official XML feed as market proxy): USD buy-transfer 26,102 / sell 26,462 → **selling USD to the bank costs ~0.68% vs mid-market**. ACB's board will be within a few dong of this; check ACB ONE's quote before each sale.

**Modeled monthly cost of getting Paddle money into VND:**

| Path | $500/mo (one withdrawal) | $2,000/mo | Notes |
|---|---|---|---|
| A. Payoneer converts → VND into ACB | ~$10 (2%) | ~$40 (2%) | zero bank fee, zero effort |
| B. Payoneer USD → ACB USD acct → sell in-app | best case $1.50+$2+$3.40 = **~$6.90 (1.4%)** · worst ~$15.40 if the 1.2–4% band applies | best **~$17 (0.85%)** · worst ~$55.60 if banded | fee scope unresolved (two-pass conflict) — §9 check #1 decides |
| C. Keep USD in Payoneer, pay tools from it | 0.5% per conversion + low-volume annual fee risk | same | fine as a small working float, not as a parking lot (§6 legal) |

**Decision rule (updated after the two-pass reconciliation):** batch withdrawals monthly (never sub-$400 if the guides' $4 fixed fee is real), and let the **in-account fee screen decide the path**: USD→USD to ACB showing a flat/sub-1% fee → Path B (~$280/yr saved at $2K/mo); showing the 1.2–4% band → Path A for Payoneer money (the USD detour would then add cost, not remove it). **Open the USD account regardless** — it's the compliant landing spot (§6, Decree 70 Art. 5.1), it receives direct SWIFT wires from Paddle (bypassing Payoneer entirely, landing at ACB for $2), and it's where [[EP SaaS]]'s 2027 B2B licensing wires would arrive.

## 5. Eliminated candidates, in one line each
- **TPBank (incumbent):** priciest sourced inward fee ($5 min), no PayOS — stays your personal bank; the separation is automatic.
- **Techcombank:** best USD price, no PayOS, clunky FCY account — §8's split-architecture option only.
- **Vietcombank:** fine fees (max $70 cap is nice at scale), 2018-era tariff, no PayOS, bureaucratic.
- **MB/OCB/KLB/BIDV:** PayOS-compatible but no sourced USD tariff; MB is the serious one (§8).
- **Wise:** VN-registered accounts **cannot receive** money at all — send-only. Not a rail.
- **VPBank:** fee-par with ACB on inward USD (0.05% min $2 max $200) but no PayOS — and its ⚠️ **$2/mo USD-account maintenance below $100 average balance** is the tariff pattern to interrogate ACB about at opening.
- **VIB/Sacombank/BIDV state twins:** nothing they win on for this exact flow set.

## 6. The legal & tax rails (what keeps this boring)
**FX side (Decree 70/2014/NĐ-CP + Circular 16/2014/TT-NHNN):**
- Art. 6.2: an individual receiving foreign currency from abroad may **credit it to an FX account or hold it** — no forced sale to VND. Your USD account is legally native.
- Art. 5.1: FX earned from **exporting services must be repatriated** to an FX account at a licensed VN bank per the contract's payment terms (offshore retention needs SBV permission) — so **don't let a large float sit in Payoneer indefinitely**; sweep monthly. (Art. 5.2: service-export money moves by bank transfer, never informal channels.)
- Circular 16/2014 Art. 4 enumerates exactly your flows as permitted: credit FX from abroad; sell FX to the bank; convert; FX savings (citizens).
- When a SWIFT credit arrives, the bank may ask the purpose — "thu nhập từ dịch vụ phần mềm/dịch vụ xuất khẩu cho nước ngoài" plus the Paddle/Payoneer statement is the standard answer. Keep every payout statement in the ledger folder.

**Tax side (the 2025–26 enforcement wave is statutory, not rumor):**
- From 2026, **cá nhân kinh doanh — including unregistered individuals — must notify the tax authority of ALL accounts receiving business money** (Law 108/2025/QH15 Art. 13.4 → Decree 68/2026/NĐ-CP → Circular 18/2026/TT-BTC, **Form 01/BK-STK**; existing operators' deadline was 20/04/2026). Changing accounts later = re-notification. This is why we pick the right bank once. Declaring the ACB pair is a task for the accountant consult at first steady month (per [[Antifragile SaaS]] §5.5's ladder).
- Enforcement machinery: banks must hand over account data on request (Decree 126/2020); unbooked inflows into personal accounts can be assessed as undeclared revenue — back-taxes + 1–3× fines (Decree 125/2020), criminal from 100M₫ evaded (Penal Code Art. 200). Real 2025–26 prosecutions exist (Tigit Motorbikes, Tung Dinning) — both were *hiding* revenue; a declared, dedicated, ledgered account is the opposite posture. The GDT has also publicly denied it can freely browse personal accounts — access is risk-triggered and bank-mediated.
- Sizing: household/individual business **under 500M₫/year revenue is tax-exempt under the 2026 regime** (still supervised). EP SaaS base case ≈ 180–240M₫/yr sits under it; combined 2027 flows may cross — accountant terrain, pre-committed.
- Platform withholding (Law 56/2024) covers e-commerce *platforms*; **direct PayOS/VietQR sales have no withholding agent — self-declaration is on you** (the GDT e-portal for hộ/cá nhân kinh doanh, live since 12/2024, is the channel).
- Flag for the accountant + the partnership paper: ==payments ≥2M₫ to an individual without a labor contract nominally carry a **10% PIT withholding duty**== (Circular 111/2013 Art. 25) — decide explicitly how the instructor split is declared (his side vs yours) so neither of you is the surprised party.
- 2026 personal deduction rises to 15.5M₫/month (186M₫/yr) — the floor under which foreign freelance income owes no PIT anyway.

## 7. Opening playbook (HCMC, this week — ~1 hour total + one branch visit)
1. **ACB ONE eKYC** → open the VND payment account (CCCD chip + face match, free, pick a memorable number if offered). Register ACB Online in the same flow. ⚠️ The account holder name must **exactly match your Payoneer registration name** — check Payoneer first, fix there if needed.
2. **Branch visit** (any HCMC branch; bring CCCD): open the **personal USD payment account** ("em muốn mở tài khoản thanh toán ngoại tệ USD để nhận tiền dịch vụ từ nước ngoài"). Ask four things: (a) minimum first deposit (Techcombank wants ~$20 — expect similar); (b) confirm **selling USD→VND via ACB ONE** is enabled for your account; (c) grab the **inward SWIFT instructions** — beneficiary name/account, SWIFT **ASCBVNVX**, branch address; (d) **phí duy trì tài khoản ngoại tệ / minimum balance** — VPBank charges $2/mo below a $100 average balance; if ACB has an equivalent, budget a ~$100 permanent floor in the account.
3. **PayOS**: register the merchant under your name (CCCD only) → link the ACB VND account via Cas following the ACB-specific guide → configure the webhook (this is literally [[EP SaaS]] BACKLOG #1 / step 0.2).
4. **Payoneer**: add both ACB accounts (USD acct for USD withdrawals, VND acct as fallback) — approval ≤3 business days. While there, **read the actual VN withdrawal fees shown in-account** (the §9 check) and note the low-volume annual fee threshold.
5. **Test everything with small money** (this doubles as [[EP SaaS]]'s Phase-0 exit gate): one 10K₫ PayOS purchase end-to-end (settles → Enrollment → video plays → receipt email), one small Payoneer withdrawal each path (a $20 USD test credit costs the $2 ACB fee — fee can never exceed the credited amount), one in-app USD→VND sale, one refund back out to a personal account.
6. **Ledger from transaction #1**: the one-tab sheet (date, source, gross, fees, net, VND) both runbooks already prescribe — this ledger IS the tax defense.
7. Set ACB ONE notifications on both accounts; export monthly statements to the ledger folder.

## 8. Runner-up & alternates (pre-decided so you never re-shop)
- **MB Bank (runner-up).** Flip to MB only if: ACB branch turns the USD account into a paperwork fight, or PayOS/Cas linking to ACB breaks, or (2027) PayOS-business continuity matters — **MB is on both PayOS lists (personal AND business: MB, OCB, KLB, BIDV, +Shinhan)** while ACB is personal-only today. Before flipping, fetch MB's inward-remittance tariff (unsourced as of this note).
- **Two-bank optimizer (rejected, documented):** Techcombank USD leg ($0 inward) + ACB VND leg. Saves $2/credit over ACB — i.e., ~$24/yr — for a second bank relationship, a branch-tied FCY account, and counter-only USD outflows. Revisit only if volumes 10× or Paddle switches to frequent direct SWIFT wires.
- **Payoneer-as-wallet:** keep ≤1 month of tool-spend as USD float (0.5% internal conversions are fine); everything else sweeps monthly to ACB — Art. 5.1 (§6) plus the $29.95 low-volume fee make Payoneer a pipe, not a vault.
- **2027, hộ kinh doanh registration:** Circular 25/2025 (eff. 01/03/2026) forces business flows into an account whose name **exactly matches the HKD registration** — you'll open a NEW business account then (at whichever bank PayOS's business list supports at that time; today MB/OCB/KLB/BIDV/Shinhan), re-notify via Form 01/BK-STK, and expenses ≥5M₫ must run through the business account to be deductible under revenue-minus-cost. The personal ACB pair then reverts to genuinely personal use. HKD + software-service contract prices at ~2% PIT + 5% VAT on revenue (vs the risk of progressive reassessment) — the accountant's call, as pre-committed.

## 9. Confirm-before-relying (the 4 empirical checks — none change the bank)
1. **In your Payoneer account** (10 min, do at step 4) — **now THE decisive check:** does "withdraw to bank" offer **USD→USD** to the ACB USD account, and at what exact fee? Two independent reads of Payoneer's public pages could not resolve it (guides: $1.50/$4 flat; official page wording: possibly the 1.2–4% band; VN corridor unpublished). Whatever the screen shows IS the answer — it sets Path A vs Path B per §4's decision rule. If USD→USD isn't offered at all → Path A, and route future scale through Paddle direct SWIFT wires instead.
2. **At the ACB branch**: USD account minimum first deposit + any **maintenance fee / minimum-balance rule** (VPBank's $2/mo-under-$100 shows the pattern exists) + confirmation that in-app FX sale is enabled (sourced from ACB's library pages + a third-party guide, not the account contract itself).
3. **ACB domestic-transfer 0₫**: universal market practice, but the fetched ACB PDF only covered international services — glance at the domestic tariff or just observe the first free transfer.
4. **Payoneer annual-fee threshold** ($2K vs $6K received/12mo — sources conflict): read it off the pricing page when logged in; at late-2026 volumes you may sit under it for a few months.

Dev note for future automation: webgia.com's rate tables are JS-obfuscated (empty for non-browser clients) — **use VCB's official XML feed** (`portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx`, parses clean in PowerShell/Workers) or the bank's own endpoints for FX monitoring; and remember SePay (est. 2023, HCMC, 28 banks incl. ACB) exists for webhook reconciliation the day PayOS alone isn't enough.

## 10. Sources (fetched 2026-07-06)
Primary: [ACB personal tariff PDF (eff. 08/2025)](https://acb.com.vn/acbwebsite/files/BIEU%20PHI%20KHCN_up%20web%2008.25.pdf) · [Techcombank e-banking & transfer tariff PDF](https://techcombank.com/content/dam/techcombank/public-site/documents/techcombank-bieu-phi-dich-vu-ngan-hang-dien-tu-va-chuyen-tien-ca-nhan.pdf) · [Techcombank intl transfer service](https://techcombank.com/en/personal/spend/other-services/international-money-transfer) · [Techcombank FCY account](https://techcombank.com/en/personal/spend/accounts/foreign-currency-account) · [Vietcombank remittance tariff PDF](https://portal.vietcombank.com.vn/content/personal/BieuPhi/D%E1%BB%8Bch%20v%E1%BB%A5%20t%E1%BA%A1i%20Qu%E1%BA%A7y/D%E1%BB%8Bch%20v%E1%BB%A5%20chuy%E1%BB%83n%20ti%E1%BB%81n%20n%C6%B0%E1%BB%9Bc%20ngo%C3%A0i/BP%20dich%20vu%20chuyen%20tien%20nuoc%20ngoai.pdf) · [TPBank transfer tariff PDF](https://tpb.vn/wps/wcm/connect/85f5413f-4d35-44bd-9f5a-96dc03b35adc/Phu+luc+10_+Bieu+ph%C3%AD+dich+vu+chuyen+tien+va+cac+dich+vu+khac.pdf?MOD=AJPERES&CVID=oDOaOiY) · [VPBank personal tariff PDF (2021)](https://www.vpbank.com.vn/-/media/vpbank-latest/tai-lieu-bieu-mau/bieu-phi/khcn/bieu-phi-dich-vu-khcn-11052021.pdf) · [payos.vn](https://payos.vn/) · [PayOS bank-linking docs](https://payos.vn/docs/huong-dan-su-dung/ket-noi-tai-khoan-ngan-hang/) · [sepay.vn](https://sepay.vn/) + [bank-API list](https://sepay.vn/api-ngan-hang.html) · [Payoneer pricing](https://www.payoneer.com/about/pricing/) · [Payoneer VN local-bank FAQ](https://payoneer-vi.custhelp.com/app/answers/detail/a_id/18627) · [Báo Chính phủ — account notification from 2026](https://baochinhphu.vn/tu-2026-ho-kinh-doanh-phai-bao-co-quan-thue-cac-tai-khoan-nhan-tien-102260307185152112.htm) · VCB XML rate feed (live board, 06/07/2026).
Secondary/practitioner: [Tuổi Trẻ — chính chủ account rule](https://tuoitre.vn/tai-khoan-ngan-hang-phai-chinh-chu-ho-kinh-doanh-het-cua-giau-doanh-thu-20260301070210855.htm) · [Tuổi Trẻ — freelancer PIT](https://tuoitre.vn/lam-viec-tu-do-cho-cong-ty-nuoc-ngoai-co-phai-dong-thue-20251104092200726.htm) · [VOV — personal-account business risk](https://vov.vn/kinh-te/dung-tai-khoan-ca-nhan-nhan-tien-ban-hang-ho-kinh-doanh-co-the-doi-mat-rui-ro-gi-post1270933.vov) · [VnExpress — GDT on account access](https://vnexpress.net/co-quan-thue-khang-dinh-khong-co-quyen-truy-cap-tai-khoan-nguoi-ban-online-4837947.html) · [thuvienphapluat — Decree 70/2014 FX rules](https://thuvienphapluat.vn/hoi-dap-phap-luat/839BFDD-hd-chuyen-tien-mot-chieu-tu-nuoc-ngoai-vao-viet-nam-duoc-quy-dinh-the-nao-su-dung-tai-khoan-dong-viet-.html) · [vaultleap — Payoneer fees 2026](https://vaultleap.com/blog/payoneer-fees-explained-2026) · [povietnam — Payoneer withdrawal guide](https://povietnam.com/huong-dan-rut-tien-ve-tu-tai-khoan-payoneer/) · [ACB FX account guides](https://fingo.vn/mo-tai-khoan-ngoai-te-acb) · [ACB account conditions library](https://acb.com.vn/thu-vien/tong-hop-nhung-dieu-kien-chung-khi-mo-5-loai-tai-khoan-ngan-hang-tai-acb).
