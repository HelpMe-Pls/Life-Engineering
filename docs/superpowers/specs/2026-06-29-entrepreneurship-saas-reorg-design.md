# Design: Reorganize `Entrepreneurship.md` for a Micro-SaaS path to $2k MRR

**Date:** 2026-06-29
**Target file:** `Tips & Tools/Entrepreneurship.md`
**Goal:** Restructure the note so it is OPTIMAL for a solo founder building a micro-SaaS / indie product to at least **$2k MRR**.

## Constraints (hard)

1. **MUST NOT remove any existing notes.** Every existing sentence is retained. Reorganization = re-ordering, re-parenting, and re-framing — never deletion.
2. **Adding content is allowed and expected** — a "maximal" SaaS scaffolding layer.
3. **Preserve every Obsidian link anchor.** 26 distinct headings are link targets, both internally and from other vault files. They keep their exact heading text (so `[[Entrepreneurship#X]]` keeps resolving) regardless of new nesting depth. If any linked heading must be renamed, ALL references are updated in the same change.

## Decisions captured during brainstorming

| Decision | Choice |
|---|---|
| Business vehicle | **Micro-SaaS / indie product** |
| First-customer channels | **Build-in-public + community outreach + cold/product-led** (not pure SEO) |
| New SaaS material depth | **Maximal** (MRR math, validation-before-code, pricing tiers, churn/retention, free-tier vs trial, onboarding/activation, billing, launch checklist, where-to-launch) |
| Style of new content | **Seamless** — same dense, callout-heavy, highlighted, `[[linked]]` voice; old vs new indistinguishable |
| Link integrity | **Preserve all anchors; update every reference if a target is renamed** (incl. back-links from `Writing.md`, `Financial.md`, `Interview prep.md`) |
| Roadmap prescriptiveness | **Concrete numeric exit-criteria, NO fixed timeline** |

## Diagnosis of the current structure

The note is excellent *content* arranged for the wrong *vehicle*. Its implicit model throughout is "build an audience, then sell courses/eBooks/cohorts" (info-product creator). The linear order is: mindset → build awareness → content creation → build a system → scale → market → promote → price → feedback → partnership.

For micro-SaaS this buries what matters. A SaaS founder needs the note ordered as: *Is this worth building? → Validate before coding → Build MVP & offer → Acquire first users → Price recurring & retain (MRR engine) → Scale.* All the wisdom to answer this already exists in the note; it is scattered and pointed at the wrong outcome.

## Reorganization principles

1. **Re-spine, don't rewrite.** Keep every sentence; move sections into SaaS order; re-point framing language from "your product/course" → "your SaaS" where it sharpens meaning. "Re-point" means *minimal surgical edits only* — a noun swap (e.g. "course" → "SaaS"), a bridging clause, or a relocated heading. It NEVER means rewriting the user's prose, compressing it, or altering its meaning. When in doubt, leave the original sentence verbatim and add a new adjacent sentence instead.
2. **Preserve every anchor.** Re-parent and re-order linked headings under new top-level sections; Obsidian anchors ignore nesting depth.
3. **Weave a maximal SaaS layer in the user's voice.**

## Linked-heading inventory (anchors that must keep resolving)

Within-file + cross-file link targets:
`Persuasion`, `The niche`, `Skills`, `Expertise`, `Curiosities`, `Networking`, `Follow up`, `Compliment`, `Authority`, `The network`, `The ingredients`, `Authenticity`, `Social leverage`, `Problems and solutions`, `The values`, `Feedback`, `Lead magnet`, `Free advertising`, `Pricing`, `Scarcity`, `Growth`, `Promotions`, `Marketing`, `Tactics`, `Build your tribe`, `In`.

Files containing back-links to these: `Writing.md` (~30), `Financial.md`, `Interview prep.md`, and `Entrepreneurship.md` itself (24 self-links).

**Plan:** keep all of the above heading texts verbatim. New headings are additive. No renames anticipated; if one becomes necessary, update all references in the same edit.

## Target top-level structure

Bold = NEW section being added. Others = existing content relocated.

- **Section A — The Entrepreneur's Mindset** *(existing opening, unchanged)*
  Freedom, mindset-not-title, "Should you quit your day job?", ethics, unfair advantage, value creator, 100 reps, experiments.

- **NEW — The $0 → $2k MRR roadmap** *(one-screen map, placed right after A)*
  Ordered phases with numeric exit-criteria, no timeline: Idea → Validate → Build MVP → First 10 users → First $ → Tighten churn → Scale to $2k. Each phase links down to its section.

- **Section B — Is It Worth Building? (Idea & Niche)** *(existing + new)*
  Relocates `Problems and solutions`, `The niche`, eternal markets, specific knowledge, "be their savior," niche-finding questions.
  - NEW: *The micro-SaaS filter* — go/no-go rubric (recurring pain? already paying for a workaround? reachable? one-person v1?).

- **Section C — Validate Before You Build** *(mostly new)*
  NEW: pre-selling, fake-door/landing-page tests, problem-interviews, waitlist-before-product, "first minute of action" re-pointed at validation. Absorbs customer-centricity callout + "marketplace decides viability." Links to existing `Writing.md#Idea validation`.

- **Section D — Build the Product & Offer** *(existing + new)*
  Relocates `The values`, offer/interested-traffic pair, transformation material, benefits-over-features framing.
  - NEW: *MVP & activation* — scope smallest transformation-delivering build, free-tier vs free-trial, onboarding/activation ("aha moment" → first-run UX), tech-stack-agnostic launch checklist.

- **Section E — Acquire Your First Users** *(existing distribution engine, re-pointed)*
  Absorbs `Build awareness` (levels-of-awareness funnel), `Content creation`, `The network`, all of `Networking` (`Identify your target`, `Compliment`, `Show interest`, `Lead with value`, `Make deeper connection`, `Follow up`, `Build your tribe`), `Social leverage`, `Growth`, `Tactics`, `Authority`, `Authenticity`, `Lead magnet`. Re-pointed "funnel to courses" → "funnel to signups."
  - NEW: *Where to launch* (Product Hunt, HN, niche subreddits/Discords, indie communities) + *cold + product-led* playbook tying existing DM/outreach to a free-tier motion.

- **Section F — Skills, Expertise & Persuasion (the toolkit)** *(existing, relocated)*
  `Skills`, `Expertise`, `Curiosities`, `Persuasion` (+ `The values`, `The ingredients`). Stable heavily-linked toolkit section; all anchors preserved.

- **Section G — Pricing, Marketing & Retention (the MRR engine)** *(existing + substantial new)*
  Relocates `Marketing`, `Desire`, `Bonus`, `Guaranty`, `Free advertising`, `Promotions` (+ weekly cadence), all `Pricing` (`In`/`Scarcity`/`Out`/`Double down`), `Feedback`.
  - NEW: *MRR math* (`paying users × price = MRR`; $2k = e.g. 40×$50 or 100×$20), *recurring tier design* (free/pro/team), *churn & retention* (re-points `Free advertising` retention lever + `Feedback` complaint-types at churn), *billing* (Stripe, trials, annual vs monthly, dunning).

- **Section H — Scaling & Partnership** *(existing tail, unchanged)*
  `Scaling your business` / `Productize yourself`, `Competition`, `Partnership`.

## Success criteria

- Reading top-to-bottom follows the SaaS journey, not the info-product journey.
- Zero existing notes deleted (verifiable: every original line present somewhere).
- Zero broken anchors (verifiable: all 26 target headings still exist verbatim; cross-file links unchanged or updated).
- Maximal SaaS layer present across B, C, D, E, G + roadmap, in matching voice.

## Verification plan

1. **No-deletion check:** extract all non-empty lines from the original (git `HEAD` version) and confirm each appears in the new file (allowing for relocation). Any line not found is flagged and restored.
2. **Anchor check:** confirm every heading in the 26-item inventory still exists verbatim in the new file. Grep cross-file back-links; confirm each still resolves (target heading present) or was updated.
3. **Readback:** skim the new top-to-bottom order for SaaS-journey coherence.
