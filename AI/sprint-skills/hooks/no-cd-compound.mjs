// no-cd-compound.mjs — PreToolUse(Bash) guard that keeps AFK sessions AFK.
//
// WHY: any project with a Read() deny rule (Read(**/*.env), Read(.dev.vars*), …)
// makes relative paths unverifiable the moment the cwd moves, so a compound Bash
// command containing `cd` escalates to an interactive permission prompt NO MATTER
// WHAT THE ALLOWLIST SAYS. `Bash(cd:*)`, `Bash(grep:*)` etc. cannot outvote it.
// That prompt is the single biggest killer of unattended sessions, and it is
// raised by workflow SUBAGENTS as readily as by the main loop.
//
// The only fix is the command SHAPE, so this hook denies the shape before the
// permission layer ever sees it. A `deny` decision does NOT prompt anybody: the
// call is blocked and `permissionDecisionReason` goes back to the agent, which
// retries with absolute paths. A BARE, non-compound `cd` is left alone — the
// hazard is `cd` PLUS a relative file read chained into one command.
//
// Deliberately silent (no output, exit 0) for everything else, so the sibling
// pr-merge-gate hook and the normal permission flow still decide.
//
// QUOTED TEXT IS NOT CODE. A `cd` or a `;` inside a commit message, a grep
// pattern or a path with a space is data, never a command the shell runs, so
// `git commit -m "fix; cd later"` passes. decide() first makes its old decision
// on the text as it was typed: no deny there means no deny at all. Only then
// does it ask codeView() for the command as the shell reads it, and it lets the
// command through when that view holds no `cd` word or no chain. codeView() hands
// the command back AS IT IS when a shell may still run the quoted text, or when
// it cannot be sure how the shell reads the command, and the deny then stands. So
// this second step can only lift a deny that the plain text raised. It can never
// add one.
//
// NO BACKSLASH ESCAPES ANYWHERE IN THIS FILE, on purpose: an editor that
// normalises escape text into the literal character silently guts a regex, and
// `/[^s]*/` still compiles. Character sets are built from String.fromCharCode.

const NL = String.fromCharCode(10)
const CR = String.fromCharCode(13)
const TAB = String.fromCharCode(9)
const WS = [' ', TAB, NL, CR]
// Walk-back whitespace is SPACE AND TAB ONLY. A newline is both whitespace and a
// separator, and skipping it as the former is how `foo` + newline + `cd /x && ls`
// went undetected: the walk-back sailed past the newline and landed on the tail of
// the previous command, which is not a separator, so the `cd` read as a bare word.
const INLINE_WS = [' ', TAB]
// Shell tokens after which a word starts a NEW command.
const SEPARATORS = [NL, CR, ';', '&', '|', '(', ')', '{', '}']

const BACKSLASH = String.fromCharCode(92)
const SINGLE = "'"
const DOUBLE = '"'
const BACKTICK = '`'
const QUOTE_MARKS = [SINGLE, DOUBLE, BACKTICK]
// What codeView() writes for a character that the shell reads as plain text: not
// whitespace, not a separator, not a letter of `cd`.
const FILLER = '_'
// A `#` opens a comment only where a word starts: at the start of the command, or
// right after one of these.
const WORD_START = [' ', TAB, NL, CR, ';', '&', '|', '(', ')', '<', '>']
// With one of these in a comment, codeView() cannot copy the comment as it is.
const COMMENT_DOUBT = [SINGLE, DOUBLE, BACKTICK, BACKSLASH, '$', '{']
// What can stand right before or right after a command name.
const WORD_BREAKS = [...WS, ...SEPARATORS, '<', '>']
// Inside double quotes a backslash takes the meaning from these only.
const ESCAPED_IN_DOUBLE = ['$', BACKTICK, DOUBLE, BACKSLASH]
const NAME_START = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_'
const NAME_CHARS = NAME_START + '0123456789'
// $1, $?, $#, $@, $*, $!, $$, $-
const SPECIAL_PARAMS = '0123456789?#@*!$-'
// A shell, or a command that hands its text to a shell (`shell` is for $SHELL). On
// a line that names one, quoted text can be a command line that a shell runs.
const SHELL_RUNNERS = [
  'sh', 'bash', 'zsh', 'dash', 'ksh', 'fish', 'csh', 'tcsh', 'ash', 'busybox',
  'pwsh', 'powershell', 'cmd', 'shell', 'eval', 'sudo', 'su', 'ssh', 'wsl',
  'trap', 'tmux', 'flock', 'foreach', '--exec',
]
// The characters that end a word when the command is searched for those names.
const NAME_BREAKS = [...WS, ...SEPARATORS, '=', '<', '>', '$', ',']

// One pass over the words of the command. With joinQuoted, quotes and backslashes
// are dropped as the shell drops them, so that ev""al reads as eval.
function findsRunner(cmd, joinQuoted) {
  let word = ''
  for (let i = 0; i <= cmd.length; i++) {
    const ch = cmd[i]
    if (joinQuoted) {
      if (ch === BACKSLASH && cmd[i + 1] === NL) {
        i++
        continue
      }
      if (ch === BACKSLASH || QUOTE_MARKS.includes(ch)) continue
    }
    const ends = ch === undefined || NAME_BREAKS.includes(ch) || QUOTE_MARKS.includes(ch)
    if (!ends) {
      // A path counts by its last part: /bin/bash, C:/Program Files/Git/bin/bash.exe.
      word = ch === '/' || ch === BACKSLASH ? '' : word + ch
      continue
    }
    let name = word.toLowerCase()
    if (name.endsWith('.exe')) name = name.slice(0, -4)
    if (SHELL_RUNNERS.includes(name)) return true
    word = ''
  }
  return false
}

/** Does the command name a shell, or a command that hands its text to one? */
export function namesShellRunner(cmd) {
  return findsRunner(cmd, false) || findsRunner(cmd, true)
}

// A character that the shell reads as plain text, not as code. The letters of
// `cd` stay, so that a quoted or escaped `cd` still reads as the command it is.
const plain = (ch) => (ch === 'c' || ch === 'd' ? ch : FILLER)

// Where the plain variable that starts with the `$` at cmd[i] ends: $name, ${name},
// $1, $?. 0 when the `$` is a plain character. -1 for a longer form (a default
// value, a pattern, a length), which can hold text that this file does not read.
function variableEnd(cmd, i) {
  const next = cmd[i + 1]
  if (next === undefined) return 0
  if (next === '{') {
    let j = i + 2
    while (j < cmd.length && NAME_CHARS.includes(cmd[j])) j++
    return j > i + 2 && cmd[j] === '}' ? j + 1 : -1
  }
  if (NAME_START.includes(next)) {
    let j = i + 2
    while (j < cmd.length && NAME_CHARS.includes(cmd[j])) j++
    return j
  }
  return SPECIAL_PARAMS.includes(next) ? i + 2 : 0
}

/**
 * The command as the shell reads it once the quotes are resolved. Quote marks and
 * backslashes are gone. Each character they covered is a filler, except the
 * letters of `cd`, so "cd", c"d" and a `cd` with a backslash in it all read `cd`.
 * A plain variable is dropped: it can be empty. Code stays as it is.
 *
 * It returns the command AS IT IS, and the deny then stands, when the command
 *   - names a shell or a command that hands its text to one (bash -c, eval, ssh),
 *   - holds a heredoc, a backtick, a $'...' or a $"..." string,
 *   - holds a command substitution inside double quotes, which the shell runs,
 *   - holds a variable with more than a name in its braces (a default value),
 *   - holds a brace that can build a word from parts (c{d,} is `cd c`),
 *   - holds a quote, a backslash, a `$` or a brace in a comment,
 *   - holds a quote that never closes.
 */
export function codeView(cmd) {
  if (namesShellRunner(cmd)) return cmd
  const n = cmd.length
  let out = ''
  let i = 0
  while (i < n) {
    const ch = cmd[i]
    if (ch === BACKSLASH) {
      // A backslash and a line end join two lines: the shell drops both. Before
      // any other character it makes that character plain text.
      if (cmd[i + 1] !== NL) out += plain(cmd[i + 1])
      i += 2
      continue
    }
    if (ch === BACKTICK) return cmd
    if (ch === '$') {
      const next = cmd[i + 1]
      if (next === SINGLE || next === DOUBLE) return cmd
      // $( ... ) holds code: drop the `$` and read on.
      if (next === '(') {
        i++
        continue
      }
      const end = variableEnd(cmd, i)
      if (end === -1) return cmd
      if (end === 0) out += FILLER
      i = end === 0 ? i + 1 : end
      continue
    }
    if (ch === '<' && cmd[i + 1] === '<') {
      // `<<<` gives one word to a command. `<<` starts a heredoc: its body is not
      // code, and the quotes in it are not quotes.
      if (cmd[i + 2] !== '<') return cmd
      out += '<<<'
      i += 3
      continue
    }
    if (ch === '{') {
      const next = cmd[i + 1]
      if (next !== undefined && next !== '}' && !WS.includes(next)) return cmd
    }
    if (ch === '#' && (i === 0 || WORD_START.includes(cmd[i - 1]))) {
      // A comment runs to the end of its line, and a quote in it opens nothing.
      // The text is copied as code, which can only keep a deny.
      let j = i
      while (j < n && cmd[j] !== NL && cmd[j] !== CR) {
        if (COMMENT_DOUBT.includes(cmd[j])) return cmd
        j++
      }
      out += cmd.slice(i, j)
      i = j
      continue
    }
    if (ch === SINGLE) {
      // Nothing is special inside single quotes: the next one closes them.
      const end = cmd.indexOf(SINGLE, i + 1)
      if (end === -1) return cmd
      for (let j = i + 1; j < end; j++) out += plain(cmd[j])
      i = end + 1
      continue
    }
    if (ch === DOUBLE) {
      let text = ''
      let j = i + 1
      while (j < n && cmd[j] !== DOUBLE) {
        const q = cmd[j]
        if (q === BACKTICK) return cmd
        if (q === BACKSLASH) {
          const next = cmd[j + 1]
          if (next === NL) {
            j += 2
            continue
          }
          // One plain character: the pair, or the backslash alone.
          text += FILLER
          j += ESCAPED_IN_DOUBLE.includes(next) ? 2 : 1
          continue
        }
        if (q === '$') {
          if (cmd[j + 1] === '(') return cmd
          const end = variableEnd(cmd, j)
          if (end === -1) return cmd
          if (end === 0) text += FILLER
          j = end === 0 ? j + 1 : end
          continue
        }
        text += plain(q)
        j++
      }
      if (j >= n) return cmd
      out += text
      i = j + 1
      continue
    }
    out += ch
    i++
  }
  return out
}

/** Is `cd` present as a COMMAND WORD (not as part of `abcd`, a path, or a string)? */
export function hasCdCommandWord(cmd) {
  for (let i = 0; i + 1 < cmd.length; i++) {
    if (cmd[i] !== 'c' || cmd[i + 1] !== 'd') continue

    // What follows must end the word: `cd /x`, `cd` alone. Never `cd(`, `cdx`.
    const after = cmd[i + 2]
    if (after !== undefined && !WS.includes(after)) continue

    // Walk back over whitespace; what precedes must be the start of the command
    // or a separator that begins a new one.
    let j = i - 1
    while (j >= 0 && INLINE_WS.includes(cmd[j])) j--
    if (j >= 0 && !SEPARATORS.includes(cmd[j])) continue

    return true
  }
  return false
}

/** Is more than one command chained here? */
export function isCompound(cmd) {
  return (
    cmd.includes(';') ||
    cmd.includes('&') ||
    cmd.includes('|') ||
    cmd.includes(NL) ||
    cmd.includes(CR)
  )
}

/**
 * Is `cd` present as a whole word that the shell could run? Wider than
 * hasCdCommandWord() on purpose: `then cd x`, `builtin cd x`, `cd|x` and `cd<f`
 * all run a `cd`. It is used on the code view only, to keep a deny.
 */
export function mayRunCd(code) {
  for (let i = 0; i + 1 < code.length; i++) {
    if (code[i] !== 'c' || code[i + 1] !== 'd') continue
    const before = code[i - 1]
    const after = code[i + 2]
    if (before !== undefined && !WORD_BREAKS.includes(before)) continue
    if (after !== undefined && !WORD_BREAKS.includes(after)) continue
    return true
  }
  return false
}

/** Could more than one command run here? `echo $(cd x)` runs two with no `;`. */
export function mayChain(code) {
  return isCompound(code) || code.includes('(') || code.includes(')')
}

export function decide(cmd) {
  if (typeof cmd !== 'string' || cmd === '') return null
  // The text as it was typed. No `cd` command word there, or no chain, means no
  // deny: this is the whole decision the hook made before codeView().
  if (!hasCdCommandWord(cmd)) return null
  if (!isCompound(cmd)) return null
  // The command as the shell reads it. The deny is lifted only when no `cd` word
  // or no chain is left there, so a `cd` or a `;` inside quoted text does not count.
  const code = codeView(cmd)
  if (!mayRunCd(code)) return null
  if (!mayChain(code)) return null
  return {
    decision: 'deny',
    reason:
      'a `cd` chained into a compound command forces an interactive permission prompt in this repo (the env-file deny rule makes relative paths unverifiable once the cwd moves), and this session is unattended. Re-issue it with ABSOLUTE paths and no `cd`. Use each tool own directory flag instead: `git -C <dir> ...`, `grep -rn <pattern> <dir>`, `npm --prefix <dir> run x`, `bun --cwd=<abs dir> run x`, `find <dir> ...`, `node --experimental-strip-types <abs path>`. A bare, non-compound `cd` is fine.',
  }
}

// Node gives import.meta.url with every link resolved, and argv[1] as the settings
// file wrote it. A plain comparison of the two fails when the path of this file
// runs through a link (a .claude folder linked from a dotfiles folder), and the
// hook then prints nothing and allows every command. So compare the real paths.
// Windows does not tell upper case from lower case in a path.
const { realpathSync } = await import('node:fs')
const { fileURLToPath } = await import('node:url')
const isEntryPoint = (() => {
  try {
    const started = realpathSync(process.argv[1])
    const self = realpathSync(fileURLToPath(import.meta.url))
    return process.platform === 'win32'
      ? started.toLowerCase() === self.toLowerCase()
      : started === self
  } catch {
    // No script path to compare: this file was not started as the hook.
    return false
  }
})()

if (isEntryPoint) {
  let raw = ''
  process.stdin.setEncoding('utf8')
  for await (const chunk of process.stdin) raw += chunk

  let verdict = null
  try {
    verdict = decide(JSON.parse(raw || '{}')?.tool_input?.command ?? '')
  } catch {
    // A malformed payload is not a licence to decide — stay silent and let the
    // normal permission flow handle it.
    verdict = null
  }

  if (verdict) {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          permissionDecision: verdict.decision,
          permissionDecisionReason: `no-cd-compound: ${verdict.reason}`,
        },
      }),
    )
  }
  process.exit(0)
}
