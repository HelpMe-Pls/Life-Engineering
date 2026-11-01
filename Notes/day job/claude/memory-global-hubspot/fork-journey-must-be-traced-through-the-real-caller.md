---
name: fork-journey-must-be-traced-through-the-real-caller
description: "Before filing a 🧑 fork or pricing a user-facing risk, trace the journey end-to-end through the ACTUAL caller — component properties compose into journeys that cannot happen"
metadata:
  type: feedback
---

**A finding that prices a USER JOURNEY is not verified until you have walked that journey through the real entry point.** Measured 2026-09-05/06 on [#855](https://github.com/EO-Vietnam/global-hubspot/pull/855): I reasoned from three true component facts — `admitChapterName` BINDS a typed name to an existing chapter (#724); `publicChapterOptions` WITHHOLDS a `public_auto` chapter from the picker; the sibling guard refuses `kind === 'create'` before the bind is known — and concluded a member whose chapter is `public_auto` must type its name, would arrive as `create`, bind to her own chapter, and be locked out permanently. Every premise was true. **The journey did not exist.** `submitSignupRequest` pre-resolves the typed name through `prematchResolution` → `resolveTrackerChapter`, on the same `chapterMatchKey`, against `readPublicChapters()` — the **UNFILTERED** `chapters` select — so she arrives as `kind: 'existing'` and never reaches the branch at all.

**The specific confusion, which is the reusable part: the list a user PICKS from is not the list the server MATCHES against.** Filtered options (`publicChapterOptions`) vs unfiltered roster (`readPublicChapters`). Two different reads, one of them invisible from the UI, and conflating them fabricated a lockout. Whenever a risk argument contains "the user can't see X, so they must type it", find the code that consumes what they typed before believing the rest.

**Why it mattered more than an ordinary wrong finding:** it had already been written into a source comment as a "do not harmonise" warning, enshrined in a new test's name and comment, put in the handoff doc, AND filed as a 🧑 fork asking the operator to decide between three options. A false premise that reaches a human as a decision request costs their time and can get a real behaviour changed for a non-reason. It survived because the round that produced it was reviewing the previous round's fix, and nobody was reviewing *it* — see [[refutation-runs-both-ways]].

**How to apply:**
- Before filing a 🧑 fork or writing a lockout/disclosure claim into a comment, **grep every caller of the function** and walk the input from the entry point. `git grep -n '<fn>('` — in this case it took one grep to learn there is exactly one production caller.
- When two code paths "should" agree, ask what makes them agree. Here the answer was a **coupling nobody had written down**: prematch and `admitChapterName` read the same roster with the same key. That is the durable note — the guards agree only while those reads stay identical, so filtering the prematch roster (the obvious "consistency" change) makes the divergence live.
- **Run a round whose only job is to audit the previous round.** Four rounds here, and every one after the first found its worst defect inside the previous round's own fix — including this one, which was found by refuting me.
- Withdraw a wrong fork **struck, with the refutation attached**, never silently: the next session will otherwise re-derive it. Related: [[settled-decision-must-be-un-said-in-both-places]], [[report-that-names-its-own-fix-must-be-measured]].
