---
name: skills-churn-is-local-windows-artifact
description: "The .claude/skills / .agents/skills / skills-lock.json \"churn\" in git status is a LOCAL Windows artifact, NOT committable — never open a PR for it"
metadata: 
  node_type: memory
  type: project
  originSessionId: 4e9f3df1-e44f-47a0-8979-d31a4ba34af5
---

On this Windows checkout, `git status` shows skills-vendoring "churn" (deleted `.claude/skills/*`, modified `.agents/skills/**` + `skills-lock.json`). **It is a local artifact, not real content — `dev`/HEAD is already correct. Do NOT open a PR for it** (verified 2026-06-15).

Root cause: `core.autocrlf=true` + `core.symlinks=false` fight the repo's `.gitattributes` (`eol=lf` on `.agents/**`, `.claude/skills/**`, `skills-lock.json`) and its committed symlinks. Proof: `git diff --ignore-cr-at-eol .agents/skills` is empty (pure CRLF); `skills-lock.json` hash lines differ only because the CLI hashed CRLF content; `.claude/skills/*` are symlinks (`caveman → ../../.agents/skills/caveman`) Windows can't represent.

**How to apply:**
- The `.agents/skills` + `skills-lock.json` CRLF noise clears with a renormalize to LF (they then match HEAD). The `.gitattributes eol=lf` keeps them clean regardless of `core.autocrlf`.
- The 14 `.claude/skills/*` "D" entries are irreducible here — git can't create symlinks without **Windows Developer Mode** (`git checkout` → "Operation not permitted"). Cosmetic + local-only; never affects `dev`/CI. Optional proper fix: re-run the skills relink CLI under Developer Mode.
- ⚠️ **NEVER `git checkout` (or rm) over a live `.claude/skills/<name>` symlink** — on Windows it recurses into the target and **deletes the real `.agents/skills/<name>` source** (it deleted caveman's SKILL.md on 2026-06-15; restored from HEAD).
- Don't flip `core.autocrlf` to false to fix this: committing a non-`eol=lf` file (e.g. a markdown doc) while autocrlf=false stores CRLF and produces a whole-file diff. See [[policy-guardrails-this-repo]] (.claude/skills tool-level edit block) and [[closes-keyword-needs-manual-close-on-dev]].

**Update 2026-06-19 — it can also be a REAL upstream reorg, still don't commit:** investigated a larger round of this churn and it was NOT pure CRLF — the `mattpocock/skills` package itself had reorganized (removed `caveman`, `diagnose`→`diagnosing-bugs`, `write-a-skill`→`writing-great-skills`, added `codebase-design`/`domain-modeling`/`git-guardrails-claude-code`/`grilling`/`setup-pre-commit`/`resolving-merge-conflicts`), and the local `setup-matt-pocock-skills` re-synced the vendored copy — so `skills-lock.json` (new paths+hashes), `.agents/skills/**` sources (mods + deletions + 11 new untracked dirs), the `.claude/skills/*` symlinks, AND `website/CLAUDE.md`'s skill list all changed. **Still NOT committed as a side-effect of feature/docs work** — the repo treats vendored skills as pinned, and the `.claude/skills/*` symlinks (mode 120000) are unrepresentable on this Windows checkout, so adopting a new skills version is a deliberate standalone `chore(skills)` with cross-platform verification, not a drive-by. Kh0iLe chose to quiet it (option "a"), not adopt it.

**Re-mask recipe (quiets `git status` to empty, commits nothing — verified 2026-06-19):**
1. `git checkout -- website/CLAUDE.md` (restore the skill-name-rewrite churn; it's a normal file, not a symlink).
2. `SK=$(git ls-files -m -d -- .agents/skills .claude/skills skills-lock.json); echo "$SK" | xargs -d '\n' git update-index --skip-worktree --` (masks the changed tracked entries — `skip-worktree` works even on deleted-in-worktree paths; this round masked 29).
3. Append the new untracked dirs to `.git/info/exclude`: `for p in $(git status --porcelain -- .agents/skills .claude/skills | awk '/^\?\?/{print $2}'); do grep -qxF "/$p" .git/info/exclude || echo "/$p" >> .git/info/exclude; done`.
Result: `git status` clean. Masks live in `.git/index` + `.git/info/exclude`, so they persist locally and never touch `dev`/CI.
