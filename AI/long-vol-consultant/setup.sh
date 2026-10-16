#!/usr/bin/env bash
# setup.sh — install, check or repair the /long-vol-consultant skill on this machine.
# One line per check. OK = the same as Khoi's Mac on 2026-10-11 (macOS, Claude Code 2.1.296, Python 3.9.6).
#
#   bash setup.sh              check only; print the exact fix under every FAIL
#   bash setup.sh --fix        create the links and set the two settings keys
#   bash setup.sh --copy       no symlinks (Windows Git Bash): copy the two files into ~/.claude/skills and link ~/.agents/skills/long-vol-consultant to the copy (a junction on Windows); re-run after every edit
#   bash setup.sh --claude-md  put the Global CLAUDE.md spine (AI/Global CLAUDE.md) into ~/.claude/CLAUDE.md (creates a missing file, else adds or refreshes a marked block; never replaces an existing file) and copy AI/Reader-facing docs.md to ~/.claude/reader-facing-docs.md
#
# It never touches the vault's Notes. It edits ~/.claude/settings.json only with --fix, and only two keys; --copy also links ~/.agents/skills/long-vol-consultant to the copy.
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
# copy mode: the skill's Page 1 runs $HOME/.agents/skills/long-vol-consultant/scripts/position.py, so $AGENTS must lead to the copy:
# a directory junction on Windows (Git Bash cannot create symlinks there; a junction needs no admin rights), a symlink elsewhere. Returns 0 when it does.
physical_dir() {   # one spelling of a folder's physical path; on Git Bash the Windows form, because two mounts (/c/Users/... and /tmp) can spell the same folder
  local p; p="$(cd "$1" 2>/dev/null && pwd -P)" || return 1
  if command -v cygpath >/dev/null 2>&1; then cygpath -w "$p"; else printf '%s\n' "$p"; fi
}
agents_leads_to_copy() { [ -e "$AGENTS/scripts/position.py" ] && [ "$(physical_dir "$AGENTS")" = "$(physical_dir "$SKILL")" ]; }
link_agents() {
  agents_leads_to_copy && return 0
  mkdir -p "$(dirname "$AGENTS")"
  case "$(uname -s)" in
    MINGW*|MSYS*|CYGWIN*)
      if [ -L "$AGENTS" ]; then cmd //c rmdir "$(cygpath -w "$AGENTS")" >/dev/null 2>&1    # an old junction, even a dangling one: rmdir removes the link only, never the folder it points at
      elif [ -e "$AGENTS" ]; then rm -rf "$AGENTS"; fi                                     # a stale real folder
      cmd //c mklink //J "$(cygpath -w "$AGENTS")" "$(cygpath -w "$SKILL")" >/dev/null ;;
    *) rm -rf "$AGENTS"; ln -sfn "$SKILL" "$AGENTS" ;;
  esac
  agents_leads_to_copy
}

echo "== /long-vol-consultant setup check · vault: $VAULT · home: $HOME"
case "$(uname -s)" in MINGW*|MSYS*|CYGWIN*) note "Windows Git Bash detected: use --copy (symlinks there are not verified)";; esac

# 1 · the vault files the skill reads and writes
for f in "Notes/This is it.md" "Notes/Weekly Tasks.md" "Notes/Venture Tasks.md" "CONTEXT.md" "AI/long-vol-consultant.md" "AI/long-vol-consultant/position.py" "AI/Global CLAUDE.md" "AI/Reader-facing docs.md"; do
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
  if link_agents; then ok "$AGENTS leads to the copy (the path the skill's Page 1 runs)"
  else fail "$AGENTS does not lead to $SKILL/scripts/position.py (the path the skill's Page 1 runs)" "link $AGENTS to $SKILL by hand (Windows: cmd /c mklink /J <that path> <the copy's path>)"; fi
elif [ -d "$SKILL" ] && [ ! -L "$SKILL" ]; then
  if cmp -s "$VAULT/AI/long-vol-consultant.md" "$SKILL/SKILL.md"; then ok "copy install: $SKILL/SKILL.md is up to date"
  else fail "copy install: $SKILL/SKILL.md differs from the vault file" "bash \"$HERE/setup.sh\" --copy"; fi
  if cmp -s <(tr -d '\r' < "$VAULT/AI/long-vol-consultant/position.py" | sed '/^DEFAULT_VAULT = /d') <(tr -d '\r' < "$SKILL/scripts/position.py" | sed '/^DEFAULT_VAULT = /d'); then ok "copy install: $SKILL/scripts/position.py is up to date"
  else fail "copy install: $SKILL/scripts/position.py differs from the vault script" "bash \"$HERE/setup.sh\" --copy"; fi
  if agents_leads_to_copy; then ok "copy install: $AGENTS leads to the copy (the path the skill's Page 1 runs)"
  else fail "copy install: $AGENTS/scripts/position.py is missing (the path the skill's Page 1 runs)" "bash \"$HERE/setup.sh\" --copy"; fi
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

# 6 · ~/.claude/CLAUDE.md holds the Answer style rule (AI/Global CLAUDE.md, the rule the skill's wording follows): as the whole file (the Mac),
#     or as a marked block inside a file that has the machine's own rules. --claude-md creates a missing file; an existing file is never
#     replaced: the block is added or refreshed, nothing else changes (a file that is a vault copy, current or older, is brought to the current text).
python3 - "$VAULT" "$HOME/.claude/CLAUDE.md" "$CLAUDEMD" <<'PY'
import os, subprocess, sys
if hasattr(sys.stdout, "reconfigure"): sys.stdout.reconfigure(encoding="utf-8")
vault, target, fix = sys.argv[1], sys.argv[2], sys.argv[3] == "1"
REL = "AI/Global CLAUDE.md"
BEGIN = "<!-- answer-style: begin (the rule from AI/Global CLAUDE.md in the vault; setup.sh --claude-md keeps it current; edit it in the vault, never here) -->"
END = "<!-- answer-style: end -->"
FIX = "bash setup.sh --claude-md"
def norm(s): return s.replace("\r\n", "\n").strip("\n")
def read(p): return open(p, encoding="utf-8", newline="").read()   # newline="": keep \r\n so a CRLF file is written back as CRLF
def git(*a):
    try:
        r = subprocess.run(["git", "-C", vault] + list(a), capture_output=True, text=True, encoding="utf-8")
        return r.stdout if r.returncode == 0 else ""
    except OSError:
        return ""
current = norm(read(os.path.join(vault, REL)))
versions = [current]                                   # the current text first, then every committed version (a file equal to one of them is a vault copy)
for h in git("log", "--format=%H", "--", REL).split():
    t = norm(git("show", h + ":" + REL))
    if t and t not in versions: versions.append(t)
def write(text, crlf):
    with open(target, "w", encoding="utf-8", newline="") as f: f.write(text.replace("\n", "\r\n") if crlf else text)
def ok(m): print("OK    " + m)
def fail(m, f): print("FAIL  " + m + "\n      fix: " + f); return 1
fails = 0
if not os.path.exists(target):
    if fix: write(current + "\n", False); ok("~/.claude/CLAUDE.md created from AI/Global CLAUDE.md (there was none)")
    else: fails += fail("~/.claude/CLAUDE.md is missing", FIX + "   (creates it from AI/Global CLAUDE.md)")
else:
    raw = read(target); crlf = "\r\n" in raw; text = raw.replace("\r\n", "\n"); lines = text.split("\n")
    b = [i for i, l in enumerate(lines) if l.startswith("<!-- answer-style: begin")]
    e = [i for i, l in enumerate(lines) if l.strip() == END and b and i > b[0]]
    if norm(text) == current:
        ok("~/.claude/CLAUDE.md is the vault's Answer style file, current")
    elif norm(text) in versions:
        if fix: write(current + "\n", crlf); ok("~/.claude/CLAUDE.md was an older copy of AI/Global CLAUDE.md (nothing of yours in it): brought to the current text")
        else: fails += fail("~/.claude/CLAUDE.md is an older copy of AI/Global CLAUDE.md", FIX + "   (brings it to the current text; nothing of yours is in it)")
    elif b and e:
        body = norm("\n".join(lines[b[0] + 1:e[0]]))
        if body == current: ok("~/.claude/CLAUDE.md keeps its own rules; its Answer style block is current")
        elif fix: write("\n".join(lines[:b[0] + 1] + [current] + lines[e[0]:]), crlf); ok("~/.claude/CLAUDE.md: the Answer style block refreshed from AI/Global CLAUDE.md (nothing else changed)")
        else: fails += fail("~/.claude/CLAUDE.md: its Answer style block is older than AI/Global CLAUDE.md", FIX + "   (refreshes the block only; nothing else changes)")
    else:
        found = next((v for v in versions if v in text), None)   # the rule pasted in by hand, without markers
        if found is not None:
            if fix: write(text.replace(found, BEGIN + "\n" + current + "\n" + END, 1), crlf); ok("~/.claude/CLAUDE.md: the Answer style text it carried is now a marked block, " + ("current" if found == current else "refreshed from AI/Global CLAUDE.md") + " (nothing else changed)")
            elif found == current: ok("~/.claude/CLAUDE.md carries the current Answer style text, unmarked (" + FIX + " would mark it so later vault edits can be applied)")
            else: fails += fail("~/.claude/CLAUDE.md carries an older Answer style text", FIX + "   (marks it as a block and refreshes it; nothing else changes)")
        elif fix: write(text.rstrip("\n") + "\n\n" + BEGIN + "\n" + current + "\n" + END + "\n", crlf); ok("~/.claude/CLAUDE.md: the Answer style block appended (every line the file had is kept)")
        else: fails += fail("~/.claude/CLAUDE.md has no Answer style rule", FIX + "   (appends it as a marked block; every line the file has is kept)")
sys.exit(fails)
PY
fails=$((fails + $?))

# 6b · ~/.claude/reader-facing-docs.md is a plain copy of AI/Reader-facing docs.md, the note ~/.claude/CLAUDE.md points at.
#      --claude-md installs or refreshes it. The copy is never hand-edited, so a copy that differs is simply brought to the vault text.
NOTE_SRC="$VAULT/AI/Reader-facing docs.md"; NOTE_DST="$HOME/.claude/reader-facing-docs.md"
if [ -f "$NOTE_SRC" ]; then
  if [ -f "$NOTE_DST" ] && cmp -s "$NOTE_SRC" "$NOTE_DST"; then ok "~/.claude/reader-facing-docs.md is current (a copy of AI/Reader-facing docs.md)"
  elif [ "$CLAUDEMD" = 1 ]; then mkdir -p "$HOME/.claude" && cp "$NOTE_SRC" "$NOTE_DST" && ok "~/.claude/reader-facing-docs.md brought to the text of AI/Reader-facing docs.md"
  else fail "~/.claude/reader-facing-docs.md is missing or differs from AI/Reader-facing docs.md" "bash setup.sh --claude-md   (copies the note; it is never hand-edited)"; fi
fi

# 7 · smoke test: the installed script must find the vault and print the position
if command -v python3 >/dev/null 2>&1 && [ -e "$SKILL/scripts/position.py" ]; then
  FIRST="$(python3 -I "$SKILL/scripts/position.py" 2>&1 | head -1)"
  GOT="${FIRST#Vault: }"; command -v cygpath >/dev/null 2>&1 && GOT="$(cygpath -u "$GOT" 2>/dev/null || echo "$GOT")"   # Git Bash: the script prints the Windows form of the vault path
  case "$GOT" in "$VAULT") ok "position.py runs from $SKILL and prints '$FIRST'";; *) fail "position.py did not find the vault: '$FIRST'" "bash \"$HERE/setup.sh\" --fix   (or --copy)";; esac
fi

echo "== $fails FAIL"
if [ "$fails" = 0 ]; then echo "== Done. Restart Claude Code (a new skill loads at the next session), type /long and press Tab: it completes to /long-vol-consultant."; fi
exit "$fails"
