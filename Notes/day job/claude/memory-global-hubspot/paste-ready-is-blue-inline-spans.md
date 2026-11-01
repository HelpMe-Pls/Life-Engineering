---
name: paste-ready-is-blue-inline-spans
description: "The word paste-ready in the user's message means the text they will paste goes in the chat as blue inline code: one single-backtick span per paragraph, never a fenced block, no backticks inside; the rule lives in the vault's Global CLAUDE.md"
metadata:
  type: feedback
---

On 2026-10-14 the user asked for a prompt "in paste-ready format" and then showed a screenshot: paragraphs rendered blue in the terminal, which is inline code. They asked for the rule to live in the global CLAUDE.md under the keyword `paste-ready`. It does: `AI/Global CLAUDE.md` in the Life-Engineering vault (the source `setup.sh --claude-md` copies) and the marked block in `~/.claude/CLAUDE.md`, section "Paste-ready text".

**Why:** a fenced block renders plain in their terminal; inline code renders blue, and the blue text is what they select and copy. A backtick inside the text would end the span, so paths and commands are written as plain words.

**How to apply:** one span per paragraph, each on its own line, a blank line between spans; a plain label line above each message saying which message it is and when to send it; no placeholders unless asked. See [[how-it-works-answer-in-one-plain-line]] for the sibling rule on blue one-line answers.
