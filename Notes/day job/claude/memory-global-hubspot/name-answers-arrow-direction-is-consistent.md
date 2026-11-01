---
name: name-answers-arrow-direction-is-consistent
description: "When the operator answers a batch of name questions as `A → B`, every arrow points the same way (as written → what to keep); never flip one because B looks like the mis-transcription"
metadata:
  type: feedback
---

2026-10-08: asked about three doubtful names in the meeting summaries, the operator answered "`Saurabh` → `Sourbutts`, `Tan` → `Thanh`, `hybrid` → `Hivebrite`". I applied the last two as written→correct but the first one BACKWARDS (all 23 "Sourbutts" became "Saurabh"), because "Sourbutts" looked like the transcription error. It shipped to production in promotion #1072, and the operator had to correct it: "`Sourbutts` is the FINAL resolved name for ALL similar names like Saurabh".

**Why:** the operator's own format was consistent; my guess about which spelling "looks right" overrode it for one item only. A name is the operator's call, not a plausibility judgement.

**How to apply:** read every arrow in one answer the same way (left is replaced by right). If one mapping looks surprising, apply it as written anyway, or ask before shipping, never silently invert it. Then grep for the LEFT side to be gone and the RIGHT side present. The name itself: [[sourbutts-is-the-final-name]].
