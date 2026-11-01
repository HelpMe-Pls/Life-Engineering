---
name: pretooluse-deny-hook-kills-cd-prompts
description: "A cd-in-a-compound-command prompt cannot be fixed by permissions.allow — but a PreToolUse hook that DENIES the shape prompts nobody and hands the agent the corrective form; this is what makes an AFK session survive subagents, which raise the prompt too"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: dd0580fc-e773-4808-aa7c-f4ba9ede96a6
  modified: 2026-09-03T13:11:23.658Z
---

The operator's hardest AFK requirement: no interactive permission prompts. The recurring one is a Bash command containing `cd` chained with `&&`/`;`/`|`, which escalates **no matter what `permissions.allow` says**, because an env-file `Read()` deny rule makes relative paths unverifiable once the cwd moves.

**Why the obvious fixes don't work.** An allowlist entry cannot outvote the escalation (global CLAUDE.md says so explicitly). Relaxing the deny rule is forbidden. And instructing subagents in their prompt is not enough — I told eight reviewers "never use `cd`" and one did anyway, blocking the run.

**What works: a `PreToolUse` hook that returns `permissionDecision: "deny"`.** A deny is not a prompt — the call is blocked and `permissionDecisionReason` goes back to the agent, which retries with absolute paths. It applies to workflow subagents as readily as to the main loop.

Installed at `~/.claude/hooks/no-cd-compound.mjs`, registered in the repo's **gitignored** `.claude/settings.local.json` so it never lands in a PR (`.claude/hooks/` is tracked; `settings.local.json` is not). Hooks merge across settings files, so it runs alongside the project's existing `pr-merge-gate.mjs` hook.

Details that mattered:

- **`$comment` is not a valid settings key** outside the places that already use it — the schema rejected `$hooksComment`. Put the rationale in the script header instead.
- **Detect `cd` as a COMMAND WORD**, not a substring: preceded by start-of-string or a separator (`; & | ( ) { }` / newline), followed by whitespace or end. Otherwise `ls /abcd`, `cd() { ... }` and the letters c-d inside a word all false-positive.
- **Walk back over SPACE AND TAB ONLY.** My first version skipped newlines as whitespace, so `grep …` + newline + `cd /x && ls` sailed past the newline, landed on the previous command's tail, and read the `cd` as a bare word. Caught by a table test; 13/13 after the fix.
- **A bare, non-compound `cd` stays allowed** — the hazard is `cd` plus a relative read chained together.
- **Write the script with NO backslash escapes** (build character sets from `String.fromCharCode`) — an editor that normalises escape text into the literal character silently guts a regex, and `/[^s]*/` still compiles.

Verify end-to-end by piping a real hook payload in: `node hook.mjs < payload.json` must print the deny JSON.

Related: [[dont-ask-mode-shell-workarounds]], [[automode-profile-described-the-wrong-repo]], [[patch-script-needle-must-be-asserted]], [[write-edit-normalise-unicode-escapes]].

## (2026-09-06) The reflex that keeps firing is `gh`, and the fix is a MISSING TABLE ROW

The hook works — but I still trip it, and after the third time in one session the pattern is specific rather than random: **the `cd` reflex fires on tools whose directory flag I have not memorised.** Global CLAUDE.md's substitution table lists `git -C`, `grep <dir>`, `npm --prefix`, `bun --cwd`, `find <dir>` — and **not `gh`**, which is the tool used most in this repo. So `gh pr view 855` gets a `cd` in front of it to give it repo context, and the hook denies the whole call.

**`gh` has no `-C`. Its directory flag is `--repo OWNER/NAME`,** and it is required here anyway: every call in this repo already needs `env -u GH_TOKEN` ([[gh-account-kh0ile-env-token]]), so the correct form was never `cd`-shaped to begin with:

```
env -u GH_TOKEN gh pr view 855 --repo EO-Vietnam/global-hubspot --json body -q .body
```

**The generalisable move: before chaining `cd`, spend one thought on what THIS tool's own directory flag is.** Every CLI that reads context from the cwd has one — the reflex is cheaper to kill at the flag lookup than at the deny message, which costs a full round-trip each time. The cost is small per instance and that is exactly why it recurs; three round-trips in one session is the real bill.

## (2026-10-14) The operator wants the deny message GONE: type no `cd` at all, even a trailing one

During the Sprint 41 AFK setup a stray `cd` rode along at the end of an otherwise absolute-path command; the hook denied the whole call and nothing ran. The operator then asked that "such warnings won't show up again" and chose this fix. **The hook stays exactly as it is**: it is the safety net, and the deny message is the evidence that I missed the flag.

**Rule: no `cd` token in any Bash call — not leading, not trailing, not a "cd back" at the end.** Every tool in this work has a directory flag, so `cd` is never needed: `git -C <dir>`, `npm.cmd --prefix <dir>` (under `fnm exec --using=24.21.0 --`), `supabase.cmd … --workdir <dir>`, `env -u GH_TOKEN gh … --repo EO-Vietnam/<name>`, and `tsx.cmd --tsconfig <abs>/tsconfig.json <abs script>`. A tool that truly needs a cwd gets a PowerShell `Push-Location`/`Pop-Location` call of its own, never a Bash compound.
