---
name: outbound-email-replies-under-350-words
description: "The operator rejected an 1,100-word admin reply as \"TOO LONG\" and set a hard cap of 350 words (2026-09-12) — deliver the two or three essential claims and the mechanism; receipts and caveats go in the draft's file header, never in the email"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: dfc06399-9379-40cf-a537-da432b7f855e
  modified: 2026-09-12T11:04:44.174Z
---

**A reply email the operator will send is capped at 350 words**, placeholders included. Operator, 2026-09-12, on the post-#908 "your upload was not rejected" reply: _"That's TOO LONG. Pls compress it to be less than 350 words while still ensuring readability and delivering the ESSENTIAL ideas."_ The first draft was ~1,100 words with a four-column table, and was complete and fact-checked; completeness was not the objection, length was.

**Why:** the reader is an admin skimming on top of their real job. What they need is the answer (nothing is broken), the two or three claims that stop the next email, and the one action to take. Everything that proves the claims belongs to the writer, not the reader.

**How to apply:**
- Write the essentials first as bold lead-ins (the claim, the mechanism, what to do), then stop. Three one-line bullets beat a table.
- Put the receipts, the exact source lines, the caveats and the "what the reply must NOT promise" notes in the draft file's frontmatter/header (`emails/drafts/YYYY-MM-DD-*.md`), so the email stays short and the next writer still has them.
- Measure with `wc -w` on the reply section before handing it over; say the number.
- The fact-check pass is still owed at any length — a short email with a wrong label is worse than a long one. See [[promotion-404-shipped-prod-current]] for the same "verify what you claim" rule on the deploy side.
