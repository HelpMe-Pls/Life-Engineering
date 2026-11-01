---
name: check-off-acceptance-criteria-before-closing
description: "When closing/shipping a GitHub issue, tick its acceptance-criteria checkboxes — Kh0iLe had to remind me"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 608f082a-1d9e-4185-9a94-ccdc9a420c8e
---

When an issue is about to be closed (or its resolving PR merges), update the issue body so its **acceptance-criteria checkboxes are ticked** (`- [ ]` → `- [x]`) to reflect the completed work. Do this as part of the close, not as an afterthought.

**Why:** Kh0iLe explicitly flagged this (2026-06-26, after #146/#147) — an issue closed with unchecked ACs reads as untracked/incomplete and loses the visible record that the work met its contract. The checked boxes ARE the done-proof.

**How to apply:**
- Fetch the **pure** body: `env -u GH_TOKEN gh issue view N --repo EO-Vietnam/global-hubspot --json body --jq '.body' > body.md`. Do NOT use a jq that prepends number/state/title — that header would corrupt the body on re-upload.
- Flip only the AC checkboxes that are genuinely met: `sed -i 's/^- \[ \]/- [x]/' body.md`. Safe because Tasks are numbered lists and out-of-scope uses plain `-` bullets, so `- [ ]` lines are normally just the ACs — but eyeball it; only tick what's actually done.
- Push back: `env -u GH_TOKEN gh issue edit N --repo EO-Vietnam/global-hubspot --body-file body.md`, then VERIFY live (`gh issue view N --json body --jq '.body' | grep -c '^- \[x\]'`).
- Run `gh` with the Kh0iLe account (see [[gh-account-kh0ile-env-token]]). Closing on `dev` is manual (see [[closes-keyword-needs-manual-close-on-dev]]), so the tick + close are both on me. Related: [[policy-guardrails-this-repo]].

## ⚠ The other half: a tick can go FALSE after the close, and nobody is watching

A ticked box is a claim about the code, so it rots like any other. **Measured 2026-09-05:** [#830](https://github.com/EO-Vietnam/global-hubspot/issues/830) closed 2026-09-02 with `- [x] A "linked" approval … appends ` · ` and the requester text` ticked — honestly, it was true — and the append was **deleted two days later** in `8bb1800` as a security fix. Nobody reopened the issue. Its body also still argues the append as the chosen option over a rejected one.

**Why this is worse than an UNTICKED box:** a closed issue is what a cold reader (or a cold agent) trusts *without re-deriving*. It reads as settled. An open criterion invites a check; a ticked one on a closed issue ends the enquiry.

**How to apply:** when a later change deletes or reverses shipped behaviour, grep the closed issues that claimed it and say so in the body — the same push, not later. Before citing a closed AC as evidence that something works, **read the code, not the tick**. And never un-tick or strike an AC on your own: that is a statement about what was ACCEPTED, and it belongs to the operator. Related: [[changing-an-invariant-means-grepping-the-sentence]], [[settled-decision-must-be-unsaid-in-both-places]].
