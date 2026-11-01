---
name: deliverables-stay-local-full-width
description: "Never publish a review or write-up as a claude.ai Artifact; save it as a local file and present the path. Local HTML text must fill the full row width, no narrow ch caps."
metadata:
  node_type: memory
  type: feedback
  originSessionId: 0d779df9-8277-4d97-8cf1-0b46d3755924
  modified: 2026-10-11T13:39:33.084Z
---

On 2026-10-11 (Sprint 40 Card 9), I published Dave's review as a claude.ai Artifact. The operator said: "pls DELETE that Artifact. Keep everything local and present them to me once you're done", and then deleted it themselves. They also rejected the review page's narrow text column: "make sure that the text in the file span their ENTIRE row widths, NOT bunched up to the left".

**Why:** the operator decides what leaves the machine. A write-up for Dave goes out through the operator, who pastes it into Lark and attaches the file. A capped column (`p { max-width: 72ch }`) left half of the page empty beside each block.

**How to apply:**
- Put the deliverable in a local file next to its siblings. Card reviews go in `~/Documents/Edge8/Sprint review/` as `sprint-NN-card-N-review.html`, and the paste-ready post goes beside it as `…-lark-post.txt`, under 350 words ([[outbound-email-replies-under-350-words]]). List the paths in the final reply.
- Never call the Artifact tool for this operator's work unless they ask for it by name, even when the tool's own guidance says to publish.
- In local HTML, put no `max-width` on `p`, `ul` or callouts. Let the page column set the width. Check it with a headless Playwright render (`website/node_modules/playwright`): every text block's width must equal the column width.
- Write the text for the reader per `/wait-what`: a line of context, ASD-STE100, and the `CONTEXT.md` terms. A warning goes at the top, before the detail.
