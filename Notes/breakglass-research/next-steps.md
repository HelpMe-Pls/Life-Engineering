# next-steps.md — EXACT resume state for the face-mode venture run (as of 2026-07-18 ~08:20 +07)

> Resumed via `/goal read the @next-steps.md file and finish the work`? **You are mid-task, not starting fresh.** Read §0, do the first action, run the loop. Everything you need is in this file or the two docs in §3. Do not re-derive what's already done — continue.

---

## 0. START HERE — READ THIS FIRST (the whole job in one screen)

**What happened:** A prior session was given a founder `/goal` (§1) to pivot to a realistic, profitable, **antifragile** $3k-NET-ceiling venture and validate it with a five-persona adversarial council (`/validate-biz-idea`), iterating reshape→re-council until **all five personas return `GO` + `FIXABLE: NONE` in one round.** Across 11 rounds the council killed every weak shape and converged on one venture — **"Fieldnotes,"** a verified real-time change-feed for the AI-tooling economy's plan/pricing/limits layer (full brief in §6). It has NOT yet hit the unanimous bar. **Your job is to finish it.**

**YOUR VERY FIRST ACTION:** dispatch **Council Round 12** — five `Agent` calls (`general-purpose`) in ONE message, one per persona (Contrarian, Expansionist, Logician, Researcher, Buyer), each prompt = *persona mandate (§4) + BRIEF v12 (§6) + the contract + the goal addendum (§4)*. When all five return, **record the round in `FACE-MODE-DOSSIER.md`** (append a `### R12` block matching R1–R11's format), then act as Judge: fold every `FIXABLE` into a new brief version and dispatch the next round — **unless** the R12 hard-stop fires (§7).

**THE WORK IS FINISHED (goal clears) WHEN EITHER:**
- **(A) SUCCESS** — a clean five-seat round returns `GO` + `FIXABLE: NONE` from all five personas → do the §9 closeout. **OR**
- **(B) HONEST TERMINUS** — R12 completes without unanimity (the pre-registered hard stop, §7) → write the **founder verdict** (convergence analysis + the honest call) and do the §9 closeout. Never fabricate unanimity to release the hook; a false GO violates the run discipline (§2).

Both (A) and (B) are legitimate done-states. Until one is reached and §9 is done, the goal is not finished.

**GUARDRAILS (violating any of these fails the task):**
- Do NOT re-run the deep-research — it's complete; cite findings from §5.
- Do NOT resurrect the 17 graveyard kills or touch any standing law (§2). Fieldnotes is a **post-quit/§11 branch**, NOT the faceless Venture-4 slot.
- Do NOT `git commit` (founder withheld it, §2). Write files only.
- A round counts toward unanimity ONLY if all five seats return cleanly. Usage/classifier walls have repeatedly killed seats mid-round (§8) — re-dispatch or use the in-character fallback; flag fallback in the record.

**Reference for everything above:** §1 goal · §2 law · §3 files · §4 protocol · §5 research · §6 the brief · §7 stop rule · §8 ops · §9 closeout.

---

**Full detail follows. §0 is the operating summary; the rest is the reference you'll need while running the loop.**

---

## 1. THE GOAL (a session `/goal` Stop-hook is active — it blocks stopping until met)

> read @breakglass-research\README.md and self-iterate with /validate-biz-idea (aiming for the highest possible score from the Buyer persona) by removing the "faceless/no-audience doctrine" and perform a /deep-research against the LATEST VERIFIABLE data available on the internet to pivot to a REALISTIC, PROFITABLE antifragile app/SaaS/product with the $3k MRR NET ceiling. The /goal is cleared once you reached the "unanimous GO, FIXABLE: NONE from all five" verdict from the council for this venture.

**Clearing condition (literal):** all five council personas return `VERDICT: GO` **and** `FIXABLE: NONE` in the same round. Until then the hook re-prompts. The goal auto-clears on success — do NOT tell the founder to run `/goal clear`.

**If the council will not converge to unanimous GO/NONE:** the honest terminus is a written verdict to the founder (Khoi) with the convergence analysis — never fabricate unanimity. See §7 (R12 hard stop). A false "unanimous GO" would violate the same run-discipline that governs this whole vault.

---

## 2. STANDING LAW — what this run may NOT touch (audit yourself against this every round)

The full composition table is at the top of `FACE-MODE-DOSSIER.md`. In short:
- **The 17 kills are law** (graveyard rule): off-limits unless NEW primary evidence overturns the recorded kill reason. This run did NOT resurrect any of them — it opened the never-scanned *audience-carried* space.
- **The Venture-4 slot stays OPEN, faceless, storm-absolutist.** This dossier does NOT fill it. Fieldnotes is a **post-quit §11 / break-glass** artifact — a *different branch* for a *different context*.
- **Faceless doctrine is peacetime law.** It is suspended only under the break-glass Card (step 2) or post-quit. The audience lever was moved *for analysis only* by the founder's `/goal`; **no peacetime hours are allocated now** (the governor still forbids it).
- **THE BREAK-GLASS CARD stays services-first** (ratified into this dossier): a cold product launch inside a 60-day emergency window is triple-graveyarded. Fieldnotes activates at the **post-quit gate ONLY**, never as the emergency instrument.
- **[[Antifragile SaaS]] R7 firewall untouched**; quarterly re-scan dates (Oct 15 / Jan 15 / Apr 15 / Jul 15) untouched.
- **No git commit** — the founder explicitly withheld the commit for the whole breakglass-research corpus (Q8, 2026-07-17). Write files; do not `git commit` unless Khoi says so.
- **Run discipline (house style):** zero product code; nobody contacted; no accounts created; $0 spent. Everything is read-only research + council simulation.

---

## 3. WHERE EVERYTHING LIVES

- **The dossier (the deliverable-in-progress):** `Notes/breakglass-research/FACE-MODE-DOSSIER.md` — full record: law-composition table, graveyard check, research findings, candidate slate (Switchboard KILLED by paper-gate; plan-tooling pre-screened dead; Fieldnotes live), the paper-gate result, and **every council round R1–R11 recorded in full** (each round: scores, five MUST-HEAR lines attributed, FIXABLEs, new facts, and the next BRIEF version).
- **This file:** the resume pointer.
- **Governing source docs (already read, don't re-read unless needed):** `breakglass-research/README.md`, `KILL-TABLE.md`, `NEAR-MISSES.md`, `CORRELATION-MAP.md`, `RAILS-INTEL.md`; `Notes/Contingencies.md` (§ Venture 4 + THE CARD); `Notes/EP SaaS.md` §11 (post-quit gate + ~20% next-option allocation); the skill at `~/.claude/skills/validate-biz-idea/SKILL.md`.
- **Auto-memory:** `…/memory/face-mode-dossier-run.md` + one-line index row in `…/memory/MEMORY.md`.
- **Deep-research workflow script (if you need to re-run it):** `…/workflows/scripts/deep-research-wf_dcec31ec-986.js` (resume with `Workflow({scriptPath, resumeFromRunId:"wf_dcec31ec-986"})`). The research is DONE (see §5) — you should not need to re-run it; the council loop is the live work.

---

## 4. THE COUNCIL PROTOCOL (how to run each round — this is `/validate-biz-idea` executed by file-run)

The skill is `disable-model-invocation`, so it is run **verbatim by hand**, not via the Skill tool. Each round:

1. **Dispatch five subagents in parallel, in ONE message** — five `Agent` tool calls, `subagent_type: general-purpose`, each with one persona. (If subagents are unavailable — usage/classifier walls have hit repeatedly, see §8 — play each persona yourself, one at a time, fully in character, using the same contract. That is the protocol's sanctioned fallback; flag it as fallback in the record, as prior rounds did.)
2. **Each dispatch prompt = the persona mandate + THE BRIEF (current version) + the contract + the goal addendum.** The five mandates (verbatim from the skill):
   - **Contrarian** (dimension: survivability): assume it fails; fatal flaws, fastest death, load-bearing wrong assumptions, distribution flaw, fit flaw; ruthless, never "but it could work."
   - **Expansionist** (upside): strongest case FOR; 10x version; adjacent unlocks; a realistic monthly-revenue ceiling as a number + the one assumption it rests on.
   - **Logician** (soundness): no web, first principles; does the mechanism work, incentives line up, math hold; does first dollar arrive inside budget+timeline.
   - **Researcher** (market evidence): USE WEB SEARCH/FETCH; who competes, what they charge, demand signals, how products like this reach customers; cite. If web unavailable, begin STANCE with `NO WEB:` and never invent a citation.
   - **Buyer** (willingness to pay): role-play the target customer, first person, skeptical. For Fieldnotes the PRIMARY buyer is the **org-side change-feed licensee** (router/gateway/FinOps/observability/harness eng lead, or a seat-owning budget holder); also briefly wear the free-letter reader hat and the reserve-prosumer hat.
3. **The contract each persona returns (verbatim):**
   ```
   STANCE: one line.
   POINTS: your 3-5 sharpest points.
   MUST-HEAR: the one thing the founder must hear.
   SCORE: X/10 on your dimension (1 = walk away, 10 = no-brainer).
   ```
4. **The goal addendum (appended to every persona, verbatim) — this is what makes the run scorable against the clearing condition:**
   ```
   ADDENDUM (founder's standing instrument for this run) — after SCORE, also return exactly:
   VERDICT: GO or RESHAPE or KILL — the verdict from your dimension alone.
   FIXABLE: the one change you would REQUIRE before endorsing GO — or NONE if you endorse the plan as-is.
   ```
5. **You are the Judge.** After the five return: record the round in `FACE-MODE-DOSSIER.md` (append a new `### R<n>` block in the same format as R1–R11 — score line `C_ E_ L_ R_ B_`, the five attributed MUST-HEAR lines, the FIXABLEs, any new verified facts). Then **fold every FIXABLE into the next BRIEF version** and re-dispatch. Unanimous GO/NONE×5 → the goal is met; write the §9 closeout. Otherwise iterate.
6. **Verification discipline:** the Researcher must verify load-bearing numbers at primary sources (WebFetch/ctx_fetch; WebSearch budget is often exhausted — direct fetches still work). Prior rounds independently re-verified BoltAI/ChatWise/Msty/Artificial-Analysis/ccusage at source; keep that bar.

---

## 5. WHAT THE RESEARCH ALREADY ESTABLISHED (don't re-litigate; cite from here)

Deep-research run wf_dcec31ec (2026-07-17/18, 5 angles, 19 sources, 92 claims) + direct re-verification across rounds:
- **Audience ≠ conversion funnel** (BoltAI's own founder: 50k X followers "doesn't directly translate to sales"). Audience = trust layer, launch amplifier, corpus, platform-invitation magnet.
- **Paid-newsletter-as-PRODUCT is dead on arithmetic** (beehiiv 3–0-verified: median 0.62% free→paid; money-niche churn 16.67%/mo; ~48k free subs for $3k/mo at median). Newsletter survives only as free infrastructure.
- **The BYOK prosumer-workbench class is real and VN-solo-proven at source:** BoltAI (HCMC solo, ~$15k/mo = $10k one-time + $5k MRR, 7,000+ customers, live $55/$69 + Team $99/seat×5≈$495, alive Jun 2026); TypingMind (VN solo, revenue REPORTED-disputed ~$45–160k/mo — flagged, never load-bearing); ChatWise $29 one-time; Msty $149/yr; free OSS coexists (Jan 5.5M+ downloads).
- **Every decision-layer prosumer product died on a free/self-serve/first-party floor:** Switchboard (audit) KILLED by the paper-gate (13 real published stacks, median switchable savings $15/mo < $25 bar); plan-spend tooling occupied at $0 (ccusage 17.3k★/83.6k weekly downloads + commercial Lineman.io + vendor dashboards); workbench = the banned generic-client class (NovaKit free tier already exceeds it).
- **The live, UNOCCUPIED wedge (active-disconfirmed):** a dated-receipt CHANGE-tracker for the AI-tooling economy's plan/pricing/limits — models.dev, Helicone, llm-prices, pricepertoken are snapshot-only; LiteLLM's git history covers API-price diffs free but nothing tracks **subscription plan/limit/quota changes**, and those shocks (not token repricings) produced ≥9 front-page 1,000-comment windows in ~13 months. Org WTP shadow: **Artificial Analysis Pro $417/mo/seat, no free tier.**
- **VN rails (fixed):** Dodo MoR primary (deliberately not Paddle — portfolio already carries Paddle ×2), Paddle fallback, app-store/Setapp bonus post-traction. Stripe/LS/Gumroad remain closed/unreliable for VN.

---

## 6. THE CURRENT BRIEF — v12 (v11 + the five R11 fixables folded) — PASTE THIS INTO R12'S FIVE DISPATCHES

> **Idea:** "Fieldnotes" (working name) — a **verified-DATA business wearing a newsletter**, in the founder's post-quit "next-option" allocation (~20% of a work week; main ventures healthy, salary already optional at activation). THE VENTURE IS THE CORPUS: a machine-readable, provenance-tracked ledger of AI-tooling-economy CHANGES — the load-bearing product is the **subscription plan / limit / quota change layer plus a "what-breaks" judgment column** (the layer no gateway can see and no one tracks; API-price diffs are demoted to free garnish since LiteLLM's git history already covers them) — captured as STRUCTURED ROWS from the founder's already-happening weekly research.
>
> **THE R11 PHASE CHANGE — B-PROOF IS NOW THE ENTRY GATE, FACE-ON (do this FIRST, before banking or the letter):** within a ~90-day window, **face-on** (org data sales make the face load-bearing — post-quit context permits it; this is explicitly a face-carried venture, NOT a faceless one, NOT a Venture-4-slot candidate), pitch a 10-specimen sample change-feed to the ~30–60 named orgs that hand-maintain or depend on AI pricing/limits tables. **Require ≥2 charged/signed license pre-commitments at a real price BEFORE any corpus banking, before the letter, before Gate-0.** Two strangers' cleared money is the entry ticket; below it, the venture does not start (near-zero cost — no product, no list, just a sample + conversations). Attach a **contractual continuity clause** to every license before charging (perpetual rights to the last-delivered corpus + schema, quarterly escrow dump, 90-day wind-down notice) — the paying buyer buys a dependency and the plan publishes its own shelve criteria, so continuity converts the price ladder from a bus-factor-anxiety test into a real willingness-to-pay test.
>
> **Monetization (RENDER 2, primary): the licensed real-time change-feed** — normalized schema, SLA'd freshness, change-alerts. **Price ladder pre-registered $200/$400/$800/mo; the "real price" = the highest tier clearing ≥5 charged/signed** — PLUS a **separate OEM/redistribution tier ≥$1,600/mo with its own ≥2-charged quantum** (redistribution rights unbundled from the $800 rung so the platform buyers aren't anchored at a fraction of their clearing price). **Channel-validity floor:** a null result may be scored "demand-dead → shelve" ONLY after ≥25–30 qualified buyer conversations across both cohorts; below that floor a null reads "channel-unproven → re-aim the probe," never demand failure (the month-9 gate otherwise confounds "orgs pay for change-data" with "a solo can close cold B2B data sales in ≤8h/wk").
>
> **RENDER 1 (infrastructure, never the product): a free async-text letter + a free public human-readable ledger with stable permalinks from issue #1** (the citation surface for humans + answer engines, compounding from day one). **Machine-readable export delayed 7 days** — the real-time feed is the licensed product (note the open risk the Contrarian raised: LLM re-derivation of the human ledger may erode the 7-day moat; the real moat is verification-labor asymmetry + rights + accountability + the plan/quota layer that has no public receipt to parse). Editorial constitution: verdict-neutral, receipts-first, staleness-honest, conflict rule (disclosure + recusal from own-category verdicts once a product position exists).
>
> **LANGUAGE LAW:** every claim is **testable by construction, never "reachable by construction"**; the venture is a ~$0-carry option ladder of pre-registered, charged, calendar-bounded experiments. Worst case = the front-loaded face-on probe fails at ≥25–30 conversations → shelve at near-zero cost (no list, no product spent). "Compounds while shelved" is banned language; a shelve prices corpus freshness + sender reputation + spent debut inventory as realized losses.
>
> **IF the letter proceeds (only after the ≥2-charge entry gate clears):** GATE-0 CALIBRATION QUARTER — 3+ own-story submissions from fresh banked-corpus pieces only, the one-shot graveyard debut inventory (kill-table autopsies, RAILS-INTEL) QUARANTINED until measured hit-rate/yield meets the sealed prior (EV ≈ 20 subs/submission from 10–30% front-page hit × 25–200 subs/hit — named-audience-writer priors, treated as UNPROVEN for this faceless-account channel until measured); month-3 (<150 trailing-60-day-engaged) / month-9 (<300) / month-15 corridor (<600 or two flat quarters) thresholds re-derived from measured rates; CALENDAR LAW: from month 15, quarterly projection of 1,000-engaged arrival — beyond month 27 = automatic shelve — ALL engagement gates subject to the B-evidence override (a quantum of B-proof suspends the engagement shelves, which then bind only future prosumer options). Engagement = clicked/replied in trailing 60 days, cumulative banned, checkpoints on windows containing ≥1 disorder window.
>
> **PROSUMER TOOLS = DEMOTED to an unnamed-until-evidence option** (three pre-named spearheads died on floor checks: audit → paper-gate; workbench → banned generic-client class; plan-spend → ccusage/Lineman/vendor dashboards). No spearhead is ever pre-named again; IF live operation surfaces measured demand, the gate considers it through the full instrument stack (audience gate ≥1,000 trailing-engaged = an explicit ≥3x-sealed-prior lottery; paper-gate vs the standing floor facts carried in-brief; ≥30 net-held charged pre-orders with a buyer-exposure-computed charge page + ≤10-week ship window; measured-inputs-only operating arithmetic; transient-load check; post-ship gate: month-3 post-ship trailing revenue ≥50% of projection else harvest-only).
>
> **QUARTERLY WEDGE RE-VERIFICATION** from now through activation (Oct 15 / Jan 15 / Apr 15 / Jul 15) against a named surface list INCLUDING OpenRouter, llm-prices, models.dev, pricepertoken, LiteLLM JSON git, smol.ai/TLDR, Artificial Analysis, HN/PH launches; response rule: a shipped change-tracker forces strategy review + honest re-pricing, not a shrug, not an auto-kill.
>
> **Buyer + money:** shape-B buyer = the ~30–60 orgs hand-maintaining AI pricing/limits tables + the seat-owning budget holders above them (cohort (a) programmatic redistributors have durable WTP + need a redistribution license; cohort (b) seat-owners subscribe-before-renewal unless monthly event-density stays visibly high). Bar = **$3,000/mo NET at maturity** (≈ 8–15 feed licenses at the clearing tier, support-flat — met even at the pessimistic $200 tier × 15). Rails: Dodo MoR primary, Paddle fallback; Stage 1 needs no rail.
> **Edge:** proven corpus muscle (a paid weekly verified-intel digest already runs for a sibling venture; the 23-agent/376-lookup adversarially-verified research runs produced this plan's own evidence base); lived harness-power-user depth; built content machine; **an adversarial verification factory — what costs a competitor ~15 artisan hours costs the founder ~4 supervised ones**; zero personal audience, stated honestly.
> **Constraints:** activation = post-quit gate ONLY (break-glass card stays services-first); ≤8h/wk total, Stage 1 ≤4h/wk; Stage-1 cost $0–20/mo (breaks ~2,500+ subs, self-funds by then); build spend ≤$500 at any build-gate; NO 60-day clock — the pre-registered gates are the clocks, everything bounded at month-27 projected arrival (subject to the B-evidence override); async-text baseline for the letter, face load-bearing for the B sale. **Antifragility, stated honestly:** the beat IS the disorder (≥9 front-page windows in ~13 months verified; every vendor stunt writes the next issue, grows the corpus, and spikes feed-buyer pain simultaneously); the short leg is priced (maintenance + transient-load); permanent market calm = graceful death through the gates (long-vol with stop-losses, not magic). **Open risk to keep adversarially live (Contrarian R11):** the SLA concentrates value in exactly the disorder weeks when the founder's other AI-exposed ventures also spike — one missed shock window churns the customers who bought shock coverage; leg-iv/vii maintenance arithmetic must price the worst-case *coincident* week, not the mean.

**Note for the Judge on the R11→R12 transition:** the Contrarian's R11 verdict was KILL *conditional on the old ordering* (month-9 probe = scheduled confirmation) and he named the exact flip to GO (front-load the charged face-on probe). v12 implements precisely that. So R12 tests whether the phase-changed brief converts the Contrarian's KILL→GO and holds the other four. Watch for: does front-loading the B-sale break the "post-quit only / never the emergency instrument" law? (It should not — the probe is $0, read-mostly, and face-on is sanctioned post-quit — but confirm each round.)

---

## 7. THE STOPPING RULE (pre-registered, house-style — do NOT loop forever)

- **Hard stop: R12.** If R12 does not produce unanimous GO/NONE×5, STOP dispatching and write the **founder verdict**: the convergence analysis (the score ledger in §8), the irreducible-before-activation list, and the honest call — most likely "**RESHAPE, high confidence: this is a genuine venture but its decisive fact (org WTP for the plan/limit change-feed, closed face-on) is settleable only by the founder actually running the ≥2-charge entry probe — no further council round can convert testability into reachability.**" Route it to Khoi; never launder non-unanimity into a fake GO. (This is the R4 Logician's law, now binding on the council itself: analysis is exhausted once fresh rounds stop producing new information — R7/R8/R9 Researchers already flagged re-derivation of the ratified verdict.)
- **The goal hook auto-clears only on genuine unanimity.** If you reach the honest terminus without it, present the verdict to the founder and let THEM decide whether to clear the goal — do not clear it yourself, and do not fabricate the condition to release the hook.
- **Convergence signal to watch:** E/R/B have returned GO every completed round since R2; five FIXABLE: NONE lines have landed (R4 E+L+R implied, R7 R, R9 R+B); the Contrarian oscillates 2–4, finding exactly one implementable seam per round — each has been implemented, and R11 was the first round where his seam was a structural inversion (now folded). If R12's Contrarian returns GO or a NONE, the run has converged; if he returns yet another distinct fatal seam, that is itself the finding (the venture has an irreducible survivability tail that only live evidence closes).

---

## 8. OPERATIONAL NOTES (walls hit repeatedly this run — plan around them)

- **Session/usage limits** ("You've hit your session limit · resets <time>") and **classifier outages** ("claude-sonnet-5 is temporarily unavailable, so auto mode cannot determine safety") have repeatedly killed subagent dispatches mid-round. When this happens: (a) probe with one cheap `Agent(model:haiku, "reply READY")` to check if capacity is back; (b) if back, re-dispatch the missing seats; (c) if not, either wait for the named reset or fall back to playing the missing personas yourself in-character (sanctioned fallback — flag it in the record). R2/R5/R10/R11 each lost ≥1 seat to a wall; the model was switched to **Opus 4.8 (1M context)** at the founder's hand near the end of R11.
- **A round is only "complete" when all five contracts are back.** R10 (R+B blocked) and R11 (R blocked) are recorded as formally incomplete — their returned seats stand as design input and their FIXABLEs were folded, but they do NOT count toward the unanimity condition. R12 must be a clean five-seat round.
- **WebSearch budget exhausts** (200/200 session-wide) — the Researcher should fall back to direct `WebFetch` / `ctx_fetch_and_index` primary-source fetches, which still work. Prior Researchers verified BoltAI/ChatWise/Msty/AA/ccusage/models.dev/LiteLLM this way.
- **Recording each round:** append a `### R<n>` block to `FACE-MODE-DOSSIER.md` immediately after the seats return, BEFORE dispatching the next round — the file is the durable state if the session dies. Keep the exact format used for R1–R11.

---

## 9. CLOSEOUT (do these when the goal is met — unanimous GO/NONE×5 — or when the R12 hard-stop routes to the founder)

1. **Fill the dossier's final two PENDING sections:** "Watchable facts + the pre-activation smoke test" (from the winning candidate's council record — the ≥2-charge face-on entry probe IS the smoke test; state its pass/fail bar and the watchable facts: the wedge-occupancy quarterly re-scan, the ccusage/Lineman/AA competitive line, the disorder-cadence).
2. **Add the dated post-ratification addendum row to `README.md`'s artifacts table** pointing at `FACE-MODE-DOSSIER.md` (house style: the README is the run report; keep the existing OPEN-slot verdict intact — this is a *new artifact for a different branch*, not a change to the Venture-4 verdict).
3. **Update auto-memory:** `…/memory/face-mode-dossier-run.md` already exists — update its "State as of" line and the outcome; keep the `MEMORY.md` index row current.
4. **Do NOT `git commit`** unless Khoi explicitly asks (standing Q8 rule for the whole breakglass-research corpus).
5. **Report to the founder** in the final turn: the venture (Fieldnotes — the AI-tooling-economy change-feed data business, face-carried, post-quit/§11 branch), the terminal council verdict + score, the single decisive next action (run the ≥2-charge face-on entry probe at post-quit activation), and the honest note that this is NOT the faceless Venture-4 slot and does NOT disturb any standing law.

---

## 10. ONE-PARAGRAPH ORIENTATION (if you read nothing else)

The founder asked to remove the faceless constraint and find a realistic, profitable, antifragile $3k-NET venture, validated to unanimous council GO/NONE×5. Across R1–R11 the council killed every *decision-layer prosumer* shape on free/self-serve/first-party floors (the paper-gate — a $0 field test on 13 real published stacks — is the instrument that did it and is now standing house law), and converged on **Fieldnotes: a verified real-time change-feed for the AI-tooling economy's plan/pricing/limits layer** (org WTP shadowed by Artificial Analysis at $417/seat; the change-layer verified unoccupied; the beat is disorder-fed with ≥9 front-page windows in 13 months). R11's four returned seats forced the decisive restructure now in v12: **the charged, face-on, ≥2-license entry probe comes FIRST, before any letter or corpus banking** — turning the whole venture into a ~$0-carry option whose single load-bearing unknown (will strangers' orgs pay for this feed) is settled cheaply and up front. Dispatch R12 on BRIEF v12 (§6) using the protocol (§4); honor the R12 hard stop (§7); close out per §9. The dossier is the durable record — write every round to it as you go.
