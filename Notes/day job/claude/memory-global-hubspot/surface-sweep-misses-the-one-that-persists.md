---
name: surface-sweep-misses-the-one-that-persists
description: "When one fact is told on several screens, sort the surfaces by LIFETIME — the sweep that enumerates them by code layout misses the one a user returns to"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 364ea5de-9188-4e83-bc83-49c70d6df1e8
  modified: 2026-09-11T16:33:02.803Z
---

Fixing a wrong sentence across surfaces, I corrected the upload receipt and the confirmation
email in one commit and missed `app/portal/components/ValidationCard.tsx` — which then went on
saying the opposite for **three more review rounds**. It was the worst one to miss: the receipt
is transient client state seen once, the email is read once and archived, and the Step 2 card is
what a chapter comes back to on **every** visit — and it sits on the same screen as the file row
contradicting it, while the admin side blocked go-live silently.

**Why:** a sweep driven by the code's layout ("which components render a verdict?") finds the
surfaces that are easy to enumerate, not the ones that matter. Reach is answerable by a tool
(`renderGraph` over the import graph); **when and how often a person reads it is not**, and that
is the axis that decides the cost of being wrong.

**How to apply:**
- Derive the surface set mechanically (import graph, never a hand-written list), then ask per
  surface: *when does a person read this, and how often?* Fix the long-lived ones first.
- Once three surfaces say one sentence, give it **one owner** and add a scan holding the whole
  graph to it — a fourth surface can then only be missed by deliberately retyping the string.
  Absence scans need a positive control on both the walk and the detector
  ([[vacuous-guard-shapes-found-by-audit]], [[guard-root-narrower-than-surface]]).
- A cross-surface guard that is deliberately loose (a case-insensitive matcher, because two
  audiences word a clause differently) **cannot** also catch formatting inside that clause. Ask
  that as its own question, or it is never asked.

Related: [[review-round-n-plus-one-comes-from-round-n]],
[[changing-an-invariant-means-grepping-the-sentence]].
