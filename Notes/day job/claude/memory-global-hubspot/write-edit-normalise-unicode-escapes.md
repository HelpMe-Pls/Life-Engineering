---
name: write-edit-normalise-unicode-escapes
description: "Write/Edit silently convert `\\uXXXX` escape TEXT into the literal character (and match either way), so a regex like /[<\L\P]/ lands as /[< ]/ and eats every space"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 41999a4d-6108-4b2a-ba11-eb6c9739c783
  modified: 2026-08-10T07:55:53.499Z
---

Writing source that contains ` ` / ` ` as **escape text** through the Write or Edit tool can land the **literal invisible character** in the file instead. Edit also matches either form, so `old_string` with the escapes silently matches a file holding the raw characters — and the tool told me so ("Edit also tried swapping \uXXXX escapes and their characters").

**How it bit (2026-08-10, `lib/admin/altai-erd-document.ts`):** a script-escaping chain intended as

```ts
.replace(/ /g, '\\u2028')
```

reached disk as `/ /g` — a regex matching a **literal space** — which would have replaced every space in a 45 KB JSON payload. Invisible in review by construction: the corrupt and correct forms render identically.

**Why:** the codepoints are line separators. Nothing about the file looked wrong, `typecheck` and `lint` both passed, and only reading the bytes exposed it.

**How to apply:**
- Never hand-write these codepoints through Write/Edit. Emit them from a **script file** run via `node`, or build them at runtime: `` `\\u${ch.charCodeAt(0).toString(16).padStart(4, '0')}` ``.
- Prefer **one** escape rule over a per-character chain — a single `/[<  ]/g` with a computed replacement has one place to get wrong, and reads as intent.
- **Verify by bytes, not by eye**, whenever a change involves invisible characters: `node -e "…JSON.stringify(line)…"` plus a count of raw occurrences. `JSON.stringify` shows what an editor cannot.
- ⚠ Bash mangles this too, in the other direction: backticks inside a `node -e` script are command substitution, so a comment containing `` `GraphEdge` `` came out as *"GraphEdge: command not found"* and the written file lost the word. Same fix — put the script in a file.

Related: [[git-commit-heredoc-hangs-windows]] (same class — the shell, not the code, corrupts the payload).

**⚠ 2026-08-25 — THE SAME CLASS VIA A BASH HEREDOC, and it produced a silently WRONG regex that still passed.** Writing a test through `python - <<'PY'` (quoted heredoc, so no shell expansion) I emitted `\\s` inside a normal triple-quoted Python string intending `\s` in the file — the file got `\s`. In a JS **template literal** `\s` is not an error: it resolves to the bare letter `s`, so `` new RegExp(`…'source'\s*<>\s*'…'`) `` became a pattern matching the literal text `s*<>s*`. Two of three assertions in the new case then failed, which is the only reason I noticed; a one-assertion test would have gone green on a pattern that matched nothing it was meant to.

The neighbouring line, written earlier through a **Write-tool script file**, had the correct `\s`. Same session, same intent, different channel — that is the tell.

**How to apply:** for any content with backslashes — regexes, `\n`, `\uXXXX`, Windows paths — **write the script to a file with the Write tool and run it**, never a heredoc. Then VERIFY the emitted bytes rather than the intent: `grep -n` the line and count the backslashes, or `node -e` and `JSON.stringify` the built value. And prefer a **three-assertion differential** for anything pattern-based (must match the right input, must NOT match the wrong one, must reject the near-miss) — the assertion that caught this was the one checking the pattern still matches its own genuine input.

**⚠ 2026-10-14 — a Bash heredoc HALVED the backslashes in Windows paths, and it hit a SETTINGS file.** A `cat > script.cjs <<'EOF'` holding `'C:` + two backslashes + `Users…'` reached disk with ONE backslash; JavaScript then read the unneeded escape as the bare letter, and `permissions.additionalDirectories` got `C:UsersleekhDocuments…`, which Claude Code resolved as five folders UNDER the project. Fixed in the next call. **How to apply: write Windows paths with FORWARD slashes in every script (`C:/Users/leekh/…`); Node, git and Claude Code all accept them, and a forward slash has nothing to escape in any channel. Then check each path with `fs.existsSync` before trusting the write.**
