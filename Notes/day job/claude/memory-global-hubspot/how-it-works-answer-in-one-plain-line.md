---
name: how-it-works-answer-in-one-plain-line
description: "STANDING — a how-it-works question, OR any question/request with an all-caps EXACT, EXACTLY, ACTUAL or ACTUALLY, gets ONE plain-language, straight-to-the-point line IN THE CHAT; no code paths, tables or jargon. The word also switches on the 2-minute skim rule for the document it is about, which must then list every step asked for (2026-10-12). Lives ONLY in the vault's Answer style; setup.sh copies it into ~/.claude/CLAUDE.md"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 5b64e559-e4e4-421f-ba43-eb082f4c40f6
  modified: 2026-10-13T05:32:02.190Z
---

Answer in ONE line, in layman's terms, straight to the point, when:

- the user asks how something works, or how a specific thing ended up somewhere ("how are these added", "how did these get there"); or
- the question or request contains `EXACT`, `EXACTLY`, `ACTUAL` or `ACTUALLY` in all caps, whatever it asks (how, when, why, who). E.g. "Tell me EXACTLY HOW/WHEN the reports get updated", "is it ACTUALLY generated?", "tell me the EXACT reason", "what is the ACTUAL cause?" (operator, 2026-10-08).

For a "how", the line names the real actor, the action they took, and what then happened automatically.

⚠ **One home since 2026-10-12:** the rule lives only in the "Answer style" section of the vault file `~/Documents/Repos/Personal/Life-Engineering/AI/Global CLAUDE.md`. `bash ~/Documents/Repos/Personal/Life-Engineering/AI/long-vol-consultant/setup.sh --claude-md` copies it into the marked block of `~/.claude/CLAUDE.md`. The older separate section ("How does X work?" or an all-caps EXACTLY) at the top of `~/.claude/CLAUDE.md` drifted from the vault copy: it had no typos, no wizards, and "ONE line" against "one line per part". The operator said "Yes" to merging it into the vault, so it was merged and deleted on 12 Oct, and the "how" trigger now also reaches the Mac. Edit the vault, then run setup.sh. Never edit the block by hand. The merge kept the old section's meaning and settled its gaps:
- A plain how question (no all-caps word) still gets ONE line, unless the operator asks for a list. One line per part needs an all-caps word. The operator rejected a stepped re-pitch on 8 Oct.
- One line per part means the answer has parts that differ: steps, a list, or records that got where they are in different ways.
- A research script that Claude runs for itself is legwork, not an answer. It gets no path line. Only a script or wizard made for the operator to run is shaped.
- In a wizard, each step names the file, setting or command that it needs. A check that did not run gets its own line in the reply.
- A "skill format wins" exception was tried and removed: the operator never asked for it, and it weakened the one-line rule.

⚠ **A document gets BOTH rules (operator, 2026-10-12).** Two side-agent notes shaped this. First, "EXACTLY" in a document request ("make sure readers know EXACTLY what to do") could turn the document into a list of one-liners and lose the skim layout. The operator answered: _"apply the skim rule for documents, and the one-line rule only for chat answers"_. Second, a setup guide or runbook asked for with EXACTLY then fell under neither rule. The operator answered: _"Pls let EXACTLY also switch on the skim rule for documents"_, so that _"put the EXACT steps in the doc and make sure it's high level enough for a 2 minutes skim"_ triggers BOTH rules. Now the chat reply is one line. The all-caps word also switches on the 2-minute skim rule ([[reader-facing-two-minute-skim]]) for each text that the word is about. That rule alone shapes the document, and the word adds only that the document lists every step or item that the request puts in it. When the parts go into a wizard or a document, the chat reply is one line. The vault's "Answer style" says this in full: typos count, a word inside a name, code or a quote from someone else does not, and each file made or changed for the request gets its path on its own line. What a script or wizard prints stayed under the one-line rule, because it answers the operator directly. That was Claude's choice, reported on 12 Oct.

⚠ **Each answer line is INLINE code, in single backticks, NEVER a fenced block (operator, 2026-10-13):** the operator first asked for _"a text block instead (i.e. between the triple backtick pairs)"_, so a fenced ```text block was tried. Claude Code's terminal shows a fenced block as PLAIN text. The operator meant the blue look that single-backtick inline code gets ("just like these 2 file paths"). So each line, the "check did not run" line and each path line sit on their own line in single backticks. This is step 6 of the vault's Answer style. Script or wizard output has no backticks.

The line that landed (2026-10-08, the AI-drafted themes on `/admin/feedback`): "Dave uploaded the transcript of a call with Vancouver Island, and Claude automatically read it and made a theme for each new thing the chapter said."

**Why:** two longer answers missed first: an inventory of every write path with file:line refs, then a stepped re-pitch with a table. Both were "too hard to follow". "EXACTLY" in the user's question means precise, not exhaustive.

**How to apply:**
- Still do the digging (the code, and the real records when the question is about specific rows), so the one line is true. Report only the conclusion.
- When the question is about specific records, name the real person and the real event, not "an admin" or "a write path".
- No file paths, table names, timestamps, step lists or tables unless asked. Do not append extra detail; the user will ask for more.
- Plain words. Keep the glossary nouns (call, theme, chapter), said as a layperson would.

Related: [[outbound-email-replies-under-350-words]].
