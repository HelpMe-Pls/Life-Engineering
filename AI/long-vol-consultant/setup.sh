#!/usr/bin/env bash
# setup.sh — install, check or repair the /long-vol-consultant skill on this machine.
# One line per check. OK = the same as Khoi's Mac on 2026-10-11 (macOS, Claude Code 2.1.296, Python 3.9.6).
#
#   bash setup.sh              check only; print the exact fix under every FAIL
#   bash setup.sh --fix        create the links and set the two settings keys
#   bash setup.sh --copy       no symlinks (Windows Git Bash): copy the two files into ~/.claude/skills; re-run after every edit
#   bash setup.sh --claude-md  install AI/Global CLAUDE.md as ~/.claude/CLAUDE.md (the answer-style rules)
#
# It never touches the vault's Notes. It edits ~/.claude/settings.json only with --fix, and only two keys.
set -u
FIX=0; COPY=0; CLAUDEMD=0
for a in "$@"; do
  case "$a" in
    --fix) FIX=1 ;; --copy) COPY=1; FIX=1 ;; --claude-md) CLAUDEMD=1 ;;
    -h|--help) sed -n '2,10p' "$0"; exit 0 ;;
    *) echo "unknown option: $a (see --help)"; exit 2 ;;
  esac
done

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"      # <vault>/AI/long-vol-consultant
VAULT="$(cd "$HERE/../.." && pwd -P)"
AGENTS="$HOME/.agents/skills/long-vol-consultant"
SKILL="$HOME/.claude/skills/long-vol-consultant"              # the folder Claude Code loads (~/.claude/skills/*)
SETTINGS="$HOME/.claude/settings.json"
MIN_CLAUDE="2.1.296"; MIN_PY="3.9"
fails=0
ok()   { printf 'OK    %s\n' "$1"; }
fail() { printf 'FAIL  %s\n      fix: %s\n' "$1" "$2"; fails=$((fails+1)); }
note() { printf 'NOTE  %s\n' "$1"; }
ver_ge() { [ "$(printf '%s\n%s\n' "$2" "$1" | sort -V | head -1)" = "$2" ]; }   # ver_ge <have> <min>

echo "== /long-vol-consultant setup check · vault: $VAULT · home: $HOME"
case "$(uname -s)" in MINGW*|MSYS*|CYGWIN*) note "Windows Git Bash detected: use --copy (symlinks there are not verified)";; esac

# 1 · the vault files the skill reads and writes
for f in "Notes/This is it.md" "Notes/Weekly Tasks.md" "Notes/Venture Tasks.md" "CONTEXT.md" "AI/long-vol-consultant.md" "AI/long-vol-consultant/position.py" "AI/Global CLAUDE.md"; do
  if [ -f "$VAULT/$f" ]; then ok "vault file: $f"
  else fail "vault file missing: $f" "git -C \"$VAULT\" pull   (the vault is https://github.com/HelpMe-Pls/Life-Engineering.git)"; fi
done

# 2 · Claude Code
if command -v claude >/dev/null 2>&1; then
  CV="$(claude --version 2>/dev/null | head -1 | awk '{print $1}')"
  if ver_ge "$CV" "$MIN_CLAUDE"; then ok "Claude Code $CV (>= $MIN_CLAUDE, the build the dialog keys were read from)"
  else fail "Claude Code $CV is older than $MIN_CLAUDE" "claude update   (or reinstall: curl -fsSL https://claude.ai/install.sh | bash)"; fi
else
  fail "claude is not on PATH" "curl -fsSL https://claude.ai/install.sh | bash   then open a new terminal and run: claude"
fi

# 3 · python3 (the position script is stdlib only)
if command -v python3 >/dev/null 2>&1; then
  PV="$(python3 -c 'import sys;print("%d.%d"%sys.version_info[:2])')"
  if ver_ge "$PV" "$MIN_PY"; then ok "python3 $PV (>= $MIN_PY)"
  else fail "python3 $PV is older than $MIN_PY" "install Python 3.9 or newer so that 'python3' is on PATH"; fi
else
  fail "python3 is not on PATH" "install Python 3 (https://www.python.org/downloads/) so that 'python3' is on PATH"
fi

# 4 · the skill files Claude Code loads
mkdir -p "$HOME/.claude/skills"
if [ "$COPY" = 1 ]; then
  # copy mode: ~/.claude/skills/long-vol-consultant/ holds copies; DEFAULT_VAULT in the copy points at this vault
  rm -rf "$SKILL"; mkdir -p "$SKILL/scripts"
  cp "$VAULT/AI/long-vol-consultant.md" "$SKILL/SKILL.md"
  python3 - "$VAULT/AI/long-vol-consultant/position.py" "$SKILL/scripts/position.py" "$VAULT" <<'PY'
import re, sys
src, dst, vault = sys.argv[1:4]
t = open(src, encoding="utf-8").read()
t, n = re.subn(r'^DEFAULT_VAULT = .*$', 'DEFAULT_VAULT = %r' % vault, t, count=1, flags=re.M)
assert n == 1, "DEFAULT_VAULT line not found"
open(dst, "w", encoding="utf-8").write(t)
PY
  ok "copied SKILL.md and scripts/position.py into $SKILL (DEFAULT_VAULT = $VAULT); re-run --copy after every edit"
elif [ -d "$SKILL" ] && [ ! -L "$SKILL" ]; then
  if cmp -s "$VAULT/AI/long-vol-consultant.md" "$SKILL/SKILL.md"; then ok "copy install: $SKILL/SKILL.md is up to date"
  else fail "copy install: $SKILL/SKILL.md differs from the vault file" "bash \"$HERE/setup.sh\" --copy"; fi
else
  # symlink mode, the Mac layout: ~/.claude/skills/<name> -> ../../.agents/skills/<name>, whose two files link into the vault
  if [ "$FIX" = 1 ]; then
    mkdir -p "$AGENTS/scripts"
    ln -sfn "$VAULT/AI/long-vol-consultant.md" "$AGENTS/SKILL.md"
    ln -sfn "$VAULT/AI/long-vol-consultant/position.py" "$AGENTS/scripts/position.py"
    rm -rf "$SKILL"; ln -sfn "../../.agents/skills/long-vol-consultant" "$SKILL"
  fi
  if [ -L "$AGENTS/SKILL.md" ] && [ "$(readlink "$AGENTS/SKILL.md")" = "$VAULT/AI/long-vol-consultant.md" ]; then ok "$AGENTS/SKILL.md -> the vault skill file"
  else fail "$AGENTS/SKILL.md is not a symlink to $VAULT/AI/long-vol-consultant.md" "bash \"$HERE/setup.sh\" --fix"; fi
  if [ -L "$AGENTS/scripts/position.py" ] && [ "$(readlink "$AGENTS/scripts/position.py")" = "$VAULT/AI/long-vol-consultant/position.py" ]; then ok "$AGENTS/scripts/position.py -> the vault script"
  else fail "$AGENTS/scripts/position.py is not a symlink to $VAULT/AI/long-vol-consultant/position.py" "bash \"$HERE/setup.sh\" --fix"; fi
  if [ -L "$SKILL" ] && [ "$(readlink "$SKILL")" = "../../.agents/skills/long-vol-consultant" ]; then ok "$SKILL -> ../../.agents/skills/long-vol-consultant"
  else fail "$SKILL is not the symlink Claude Code loads" "bash \"$HERE/setup.sh\" --fix"; fi
fi

# 5 · ~/.claude/settings.json: the two keys that change how the skill behaves, plus what else differs from the Mac
mkdir -p "$HOME/.claude"
python3 - "$SETTINGS" "$FIX" <<'PY'
import json, os, sys
p, fix = sys.argv[1], sys.argv[2] == "1"
s = json.load(open(p, encoding="utf-8")) if os.path.exists(p) else {}
fails = 0; changed = False
so = s.get("skillOverrides") or {}
hidden = so.get("long-vol-consultant")
if hidden is None:
    print("OK    settings: no skillOverrides entry for long-vol-consultant")
elif fix:
    del so["long-vol-consultant"]; changed = True
    print("OK    settings: skillOverrides.long-vol-consultant removed (it was %r; 'off' hides the skill from the / menu)" % hidden)
else:
    print("FAIL  settings: skillOverrides.long-vol-consultant = %r hides the skill from the / menu and from /long + Tab\n      fix: bash setup.sh --fix" % hidden); fails += 1
to = s.get("askUserQuestionTimeout")
if to == "10m":
    print("OK    settings: askUserQuestionTimeout = 10m")
elif fix:
    s["askUserQuestionTimeout"] = "10m"; changed = True
    print("OK    settings: askUserQuestionTimeout set to 10m (was %r)" % to)
else:
    print("FAIL  settings: askUserQuestionTimeout = %r (the Mac: 10m = a page idle for 10 min auto-continues; unset = never)\n      fix: bash setup.sh --fix" % to); fails += 1
for k, v in (("model", "opus"), ("effortLevel", "high"), ("tui", "fullscreen")):
    cur = s.get(k); print(("OK    " if cur == v else "NOTE  ") + "settings: %s = %r (the Mac: %r)" % (k, cur, v))
dm = (s.get("permissions") or {}).get("defaultMode")
print(("OK    " if dm == "auto" else "NOTE  ") + "settings: permissions.defaultMode = %r (the Mac: 'auto'; any other mode asks before each Bash and Edit, the skill still works)" % dm)
if changed:
    with open(p, "w", encoding="utf-8") as f:
        json.dump(s, f, indent=2, ensure_ascii=False); f.write("\n")
sys.exit(fails)
PY
fails=$((fails + $?))

# 6 · ~/.claude/CLAUDE.md = AI/Global CLAUDE.md (the answer-style rules the skill's wording follows)
if [ "$CLAUDEMD" = 1 ]; then cp "$VAULT/AI/Global CLAUDE.md" "$HOME/.claude/CLAUDE.md"; ok "~/.claude/CLAUDE.md installed from AI/Global CLAUDE.md"
elif cmp -s "$VAULT/AI/Global CLAUDE.md" "$HOME/.claude/CLAUDE.md" 2>/dev/null; then ok "~/.claude/CLAUDE.md is identical to AI/Global CLAUDE.md"
else fail "~/.claude/CLAUDE.md differs from AI/Global CLAUDE.md (or is missing)" "bash \"$HERE/setup.sh\" --claude-md   (this replaces ~/.claude/CLAUDE.md)"; fi

# 7 · smoke test: the installed script must find the vault and print the position
if command -v python3 >/dev/null 2>&1 && [ -e "$SKILL/scripts/position.py" ]; then
  FIRST="$(python3 -I "$SKILL/scripts/position.py" 2>&1 | head -1)"
  case "$FIRST" in "Vault: $VAULT") ok "position.py runs from $SKILL and prints '$FIRST'";; *) fail "position.py did not find the vault: '$FIRST'" "bash \"$HERE/setup.sh\" --fix   (or --copy)";; esac
fi

echo "== $fails FAIL"
if [ "$fails" = 0 ]; then echo "== Done. Restart Claude Code (a new skill loads at the next session), type /long and press Tab: it completes to /long-vol-consultant."; fi
exit "$fails"
