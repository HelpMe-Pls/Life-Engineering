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
// HOW IT DECIDES. Two tests on the raw text give a first verdict: is there a `cd`
// at the start of the command or after a separator, and is the command compound.
// Then `readCommand` reads the command as bash does: quotes, comments, heredoc
// bodies, `$( )`, backticks and `<( )`. Its result changes the first verdict in
// three cases only:
//   1. DENY when a `cd` command and another command run in the same shell, or
//      the `cd` sits in a loop. This catches forms the raw text hides: `cd;ls`,
//      `"cd" x && ls`, `if a; then cd x && ls; fi`, `builtin cd x && ls`,
//      `X=1 cd x && ls`, and the code given to `eval` or to the `-c` option of a
//      shell on this machine, also behind `env`, `timeout` or `sudo`.
//   2. ALLOW when no command in it is a `cd` and nothing can hide one. A commit
//      message, a heredoc body or a comment that only mentions `cd` is data.
//   3. ALLOW when the whole command is one `cd` and nothing can hide another.
//
// WHEN IN DOUBT, THE FIRST VERDICT STAYS. `readCommand` gives no answer for a form
// it does not read with full confidence (`case`, a function definition, arithmetic,
// an array, a quote that never closes, and the like). A line that names a shell or
// another program that runs text as code (`bash`, `eval`, `ssh`, `trap`, `source`),
// or whose command name comes from a variable, keeps the first verdict too, because
// the quoted text can be code there. So does a line with a brace in the middle of a
// command or with words after `]]`: zsh reads `repeat 2 { cd x; ls }` and
// `if [[ -d x ]] { cd x; ls }` as blocks, and bash reads them as arguments. So does
// a line with a command name that zsh reads in another way than bash (`noglob cd x`,
// `repeat 2 cd x`, `ls | time cd x`, `exec cd x`, `>out if cd x; then ls; fi`,
// `chdir x`), or
// that changes the folder under another name (`pushd`, `popd`), or with a form that
// only zsh has (`ls &!cd x`, `() cd x`, the `-p` of `time` as a command). A chained
// `cd` that is read in such a line is still denied.
//
// OUT OF REACH for any scan of the text: a `cd` that is not written in the command
// (the value of a variable, the output of a command, a file-name pattern, an alias
// or a function from the shell profile), and a program that starts its own shell
// with no shell word in the line (`python -c`, `node -e`).
//
// NO BACKSLASH ESCAPES ANYWHERE IN THIS FILE, on purpose: an editor that
// normalises escape text into the literal character silently guts a regex, and
// `/[^s]*/` still compiles. Character sets are built from String.fromCharCode.

const NL = String.fromCharCode(10)
const CR = String.fromCharCode(13)
const TAB = String.fromCharCode(9)
const NUL = String.fromCharCode(0)
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
const ESCAPED_IN_DOUBLE = ['$', BACKTICK, DOUBLE, BACKSLASH]
const NAME_START = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_'
const NAME_CHARS = NAME_START + '0123456789'
// $1, $?, $#, $@, $*, $!, $$, $-
const SPECIAL_PARAMS = '0123456789?#@*!$-'
const DIGITS = '0123456789'
// An unquoted one of these ends a word.
const WORD_ENDS = [' ', TAB, NL, ';', '&', '|', '(', ')', '<', '>']
// One of these inside ${ } can run a command or hide the closing brace.
const PARAM_DOUBT = ['$', BACKTICK, SINGLE, DOUBLE, BACKSLASH, '{', '(', NL]
// A word that names one of these means quoted text in the line can be code.
const SHELL_RUNNERS = [
  'sh', 'bash', 'zsh', 'dash', 'ksh', 'fish', 'csh', 'tcsh', 'ash', 'busybox',
  'pwsh', 'powershell', 'cmd', 'shell', 'eval', 'sudo', 'su', 'doas', 'ssh', 'wsl',
  'trap', 'tmux', 'flock', 'foreach', '--exec', 'watch', 'screen', 'script', 'parallel',
]
// The same, but only as the name of the command.
const COMMAND_RUNNERS = ['.', 'source', 'alias', 'bind', 'complete', 'compgen', 'fc', 'mapfile', 'readarray']
// These start the program that their arguments name, so an argument that comes
// from a variable or a pattern can name a shell.
const PREFIX_RUNNERS = [
  'env', 'xargs', 'timeout', 'nohup', 'nice', 'exec', 'find', 'stdbuf', 'setsid',
  'winpty', 'chroot', 'strace', 'unbuffer', 'caffeinate', 'ionice', 'time', 'sudo', 'doas',
]
// A shell on this machine: the literal text after its -c option is read as code.
const LOCAL_SHELLS = ['sh', 'bash', 'zsh', 'dash', 'ksh', 'ash']
// Options of such a shell that take the next argument as their value.
const SHELL_VALUE_OPTIONS = ['-o', '+o', '-O', '+O', '--rcfile', '--init-file']
// A line continuation inside a word is read only between two of these.
const JOINABLE = NAME_CHARS + '-./'
// Reserved words after which the next word still starts a command.
const KEYWORDS_STAY = ['{', '}', '!', 'if', 'then', 'elif', 'else', 'fi', 'do', 'done']
// Reserved words of forms that `readCommand` does not read.
const KEYWORDS_DOUBT = ['case', 'esac', 'select', 'function', 'coproc']
// As the name of a command, zsh reads these in another way than bash: as a prefix
// of the command that follows (`noglob cd x`, `repeat 2 cd x`, `ls | time cd x`) or
// as another name of `cd`. After `exec`, zsh runs its own `cd` and bash looks for a
// program. `pushd` and `popd` change the folder in both shells.
const OTHER_READINGS = [
  'time', 'noglob', 'nocorrect', 'repeat', '-', 'exec', 'chdir', 'pushd', 'popd',
]
// zsh reads a reserved word after a redirection as the reserved word still
// (`>out if cd x; then ls; fi`), and bash reads the name of a command there.
const KEYWORDS_AFTER_PREFIX = [
  '!', 'if', 'then', 'elif', 'else', 'fi', 'do', 'done', 'while', 'until', 'for', 'end',
]
const MAX_LEVEL = 20
const MAX_DEPTH = 60

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

const DOUBT = Object.freeze({ doubt: true })

function fail() {
  throw DOUBT
}

function isName(text) {
  if (text === '' || !NAME_START.includes(text[0])) return false
  for (const ch of text) if (!NAME_CHARS.includes(ch)) return false
  return true
}

/** `NAME=` or `NAME+=` at the start is an assignment; `NAME[` is an array item. */
function leadKind(lead) {
  if (lead === '' || !NAME_START.includes(lead[0])) return ''
  let k = 1
  while (k < lead.length && NAME_CHARS.includes(lead[k])) k++
  if (lead[k] === '=') return 'assignment'
  if (lead[k] === '+' && lead[k + 1] === '=') return 'assignment'
  if (lead[k] === '[') return 'item'
  return ''
}

/** A plain word of digits just before `<` or `>` is the file number of a redirect. */
function isFileNumber(word) {
  if (!word.plain || word.text === '') return false
  for (const ch of word.text) if (!DIGITS.includes(ch)) return false
  return true
}

/** The program name of a path: lower case, no folder, no `.exe`. */
function programName(text) {
  const cut = Math.max(text.lastIndexOf('/'), text.lastIndexOf(BACKSLASH))
  const name = text.slice(cut + 1).toLowerCase()
  return name.endsWith('.exe') ? name.slice(0, -4) : name
}

/** Does this heredoc line hold `${ ` or `${|`, which a newer bash runs as commands? */
function opensCommand(line) {
  let k = line.indexOf('${')
  while (k !== -1) {
    const next = line[k + 2]
    if (next === undefined || next === ' ' || next === TAB || next === '|') return true
    k = line.indexOf('${', k + 2)
  }
  return false
}

/** Does this word name a shell or another program that runs text as code? */
function namesRunner(word) {
  // A word with a quoted space or separator is a sentence or a path with spaces:
  // only its program name counts, so a commit message that says "bash" is data.
  if (word.sentence) return SHELL_RUNNERS.includes(programName(word.text))
  let piece = ''
  for (const ch of word.probe) {
    if (ch === '/' || ch === BACKSLASH) {
      piece = ''
    } else if (ch === '=' || ch === ',' || ch === '$' || ch === '{' || ch === '}') {
      if (SHELL_RUNNERS.includes(programName(piece))) return true
      piece = ''
    } else {
      piece += ch
    }
  }
  return SHELL_RUNNERS.includes(programName(piece))
}

/**
 * Read `src` as bash reads it and add what it holds to `count`. Throws DOUBT for
 * any form that is not read with full confidence.
 *
 * A REGION is the top level, each `$( )`, each backtick text, each `<( )` and
 * `>( )`, and the code after the `-c` option of a shell on this machine. The code
 * of an `eval` counts in the region of the command that called it.
 * A STRONG command has a command name or is a `[[ ]]`. A WEAK command is only
 * assignments or only redirections.
 */
function scan(src, count, level, host) {
  if (level > MAX_LEVEL) fail()
  const n = src.length
  // Heredocs whose body has not started yet.
  const pending = []
  let i = 0
  let depth = 0
  let current = null

  // bash takes a waiting heredoc body from the next line, also in the middle of a
  // quote or of a continued line. Such a line is not read here.
  function lineEndInside() {
    if (pending.length > 0) fail()
  }

  // bash joins the two halves of an operator across a line continuation.
  function noContinuation() {
    if (src[i] === BACKSLASH && src[i + 1] === NL) fail()
  }

  function addLiteral(word, ch, quoted) {
    word.text += ch
    word.probe += ch
    if (quoted) {
      if (WORD_ENDS.includes(ch)) word.sentence = true
      return
    }
    if (word.leadOpen) word.lead += ch
    if (ch === '*' || ch === '?' || ch === '[') word.glob = true
    if (ch === '{') word.braces = true
    if (ch === '}') word.closer = true
  }

  function quoteStart(word) {
    word.plain = false
    word.leadOpen = false
  }

  // A part whose value is known only when bash runs the command.
  function addOpaque(word, mark) {
    word.probe += mark
    word.plain = false
    word.leadOpen = false
    word.opaque = true
  }

  // From just after an opening double quote through the closing one.
  function readDouble(word) {
    while (true) {
      if (i >= n) fail()
      const c = src[i]
      if (c === DOUBLE) {
        i++
        return
      }
      if (c === BACKSLASH) {
        const next = src[i + 1]
        if (next === undefined) fail()
        if (next === NL) {
          lineEndInside()
          i += 2
        } else if (ESCAPED_IN_DOUBLE.includes(next)) {
          addLiteral(word, next, true)
          i += 2
        } else {
          addLiteral(word, BACKSLASH, true)
          i++
        }
      } else if (c === '$') {
        readDollar(word, true)
      } else if (c === BACKTICK) {
        readBacktick(word)
      } else {
        if (c === NL) lineEndInside()
        addLiteral(word, c, true)
        i++
      }
    }
  }

  // At a `$`.
  function readDollar(word, inDouble) {
    const next = src[i + 1]
    if (next === '(') {
      if (src[i + 2] === '(') fail()
      i += 2
      region(')')
      addOpaque(word, '$')
      return
    }
    if (next === '[') fail()
    if (next === '{') {
      const close = src.indexOf('}', i + 2)
      if (close === -1) fail()
      const body = src.slice(i + 2, close)
      if (body === '') fail()
      // A newer bash runs `${ list; }` and `${| list; }` as commands in this shell.
      if (body[0] === ' ' || body[0] === TAB || body[0] === '|') fail()
      for (const ch of body) if (PARAM_DOUBT.includes(ch)) fail()
      addOpaque(word, '$' + body)
      i = close + 1
      return
    }
    if (next !== undefined && NAME_START.includes(next)) {
      let k = i + 2
      while (k < n && NAME_CHARS.includes(src[k])) k++
      addOpaque(word, src.slice(i, k))
      i = k
      return
    }
    if (next !== undefined && SPECIAL_PARAMS.includes(next)) {
      addOpaque(word, '$')
      i += 2
      return
    }
    if (!inDouble && next === SINGLE) {
      // $'...': a backslash keeps the next character.
      let k = i + 2
      while (true) {
        if (k >= n) fail()
        if (src[k] === SINGLE) break
        if (src[k] === NL) lineEndInside()
        k += src[k] === BACKSLASH ? 2 : 1
      }
      addOpaque(word, '$')
      i = k + 1
      return
    }
    if (!inDouble && next === DOUBLE) {
      i += 2
      readDouble(word)
      addOpaque(word, '$')
      return
    }
    // bash joins a `$` to the next line across a line continuation.
    if (next === BACKSLASH && src[i + 2] === NL) fail()
    addLiteral(word, '$', inDouble)
    i++
  }

  // At a backtick. bash reads the text between two backticks as a command.
  function readBacktick(word) {
    const close = src.indexOf(BACKTICK, i + 1)
    if (close === -1) fail()
    const body = src.slice(i + 1, close)
    if (body.includes(BACKSLASH) || body.includes(SINGLE) || body.includes(DOUBLE)) fail()
    if (body.includes(NL)) lineEndInside()
    scan(body, count, level + 1, null)
    addOpaque(word, '$')
    i = close + 1
  }

  function readWord() {
    const word = {
      // The characters that bash keeps after it removes the quotes.
      text: '',
      // The same, plus `$NAME` for a variable and `$` for a substitution.
      probe: '',
      // The first run of characters that are not quoted: `X=` makes an assignment.
      lead: '',
      leadOpen: true,
      // No quote, no escape, no expansion: only such a word can be a reserved word.
      plain: true,
      opaque: false,
      // Holds a quoted space or separator.
      sentence: false,
      glob: false,
      braces: false,
      // Holds a closing brace that is not quoted.
      closer: false,
    }
    while (i < n) {
      const c = src[i]
      if ((c === '<' || c === '>') && src[i + 1] === '(') {
        i += 2
        region(')')
        addOpaque(word, '$')
      } else if (WORD_ENDS.includes(c)) {
        break
      } else if (c === BACKSLASH) {
        const next = src[i + 1]
        if (next === undefined) fail()
        if (next === NL) {
          // A line continuation: bash drops both characters and reads on.
          lineEndInside()
          const after = src[i + 2]
          if (after === undefined || WORD_ENDS.includes(after)) {
            if ((after === '<' || after === '>') && (src[i + 3] === '(' || isFileNumber(word))) fail()
            break
          }
          // Inside a word it is read only between two plain characters.
          const last = word.text[word.text.length - 1]
          if (!word.plain || last === undefined || !JOINABLE.includes(last) || !JOINABLE.includes(after)) fail()
          i += 2
          continue
        }
        quoteStart(word)
        addLiteral(word, next, true)
        i += 2
      } else if (c === SINGLE) {
        const close = src.indexOf(SINGLE, i + 1)
        if (close === -1) fail()
        quoteStart(word)
        for (const ch of src.slice(i + 1, close)) {
          if (ch === NL) lineEndInside()
          addLiteral(word, ch, true)
        }
        i = close + 1
      } else if (c === DOUBLE) {
        i++
        quoteStart(word)
        readDouble(word)
      } else if (c === '$') {
        readDollar(word, false)
      } else if (c === BACKTICK) {
        readBacktick(word)
      } else {
        addLiteral(word, c, false)
        i++
      }
    }
    return word
  }

  // The lines after a line end are heredoc bodies when a heredoc waits for one.
  // A body is data. bash still runs `$( )` and backticks in a body whose
  // delimiter is not quoted, so such a body is not read here.
  function readBodies() {
    for (const doc of pending) {
      if (doc.owner !== current) fail()
      while (true) {
        if (i >= n) fail()
        const stop = src.indexOf(NL, i)
        let line = src.slice(i, stop === -1 ? n : stop)
        i = stop === -1 ? n : stop + 1
        if (doc.strip) {
          let k = 0
          while (line[k] === TAB) k++
          line = line.slice(k)
        }
        if (line === doc.name) break
        // Inside `$( )`, bash ends a body at a line such as `EOF)`.
        if (line.startsWith(doc.name)) fail()
        if (!doc.quoted && (line.includes(BACKSLASH) || line.includes(BACKTICK) || line.includes('$('))) fail()
        if (!doc.quoted && opensCommand(line)) fail()
      }
    }
    pending.length = 0
  }

  // After a redirect operator: its target, which is one word.
  function readTarget(heredoc, strip) {
    while (src[i] === ' ' || src[i] === TAB) i++
    noContinuation()
    const from = i
    const target = readWord()
    if (i === from) fail()
    if (target.braces || target.closer) count.hidden = true
    if (src[i] === '(') fail()
    if (heredoc) {
      const raw = src.slice(from, i)
      const quoted = raw[0] === SINGLE || raw[0] === DOUBLE
      if (quoted && (raw.length < 3 || raw[raw.length - 1] !== raw[0])) fail()
      const name = quoted ? raw.slice(1, -1) : raw
      if (!isName(name)) fail()
      pending.push({ name, strip, quoted, owner: current })
    }
    return { kind: 'redirect', heredoc }
  }

  // At `<` or `>`.
  function readRedirect() {
    const c = src[i]
    i++
    let heredoc = false
    let strip = false
    if (c === '<' && src[i] === '<') {
      i++
      if (src[i] === '<') {
        i++
      } else {
        heredoc = true
        if (src[i] === '-') {
          strip = true
          i++
        }
      }
    } else if (c === '<' && (src[i] === '&' || src[i] === '>')) {
      i++
    } else if (c === '>' && (src[i] === '>' || src[i] === '&' || src[i] === '|')) {
      i++
    }
    return readTarget(heredoc, strip)
  }

  function nextToken() {
    while (i < n) {
      const c = src[i]
      if (c === ' ' || c === TAB) {
        i++
      } else if (c === BACKSLASH && src[i + 1] === NL) {
        lineEndInside()
        i += 2
      } else if (c === '#') {
        // A comment runs to the end of the line. Inside `$( )` it can hide the
        // closing paren, so it is read at the top level only.
        if (depth > 1 || level > 0) fail()
        const stop = src.indexOf(NL, i)
        i = stop === -1 ? n : stop
      } else {
        break
      }
    }
    if (i >= n) return { kind: 'end' }
    const c = src[i]
    if (c === NL) {
      i++
      if (pending.length > 0) readBodies()
      return { kind: 'op', text: NL }
    }
    if (c === ';') {
      if (src[i + 1] === ';' || src[i + 1] === '&') fail()
      i++
      noContinuation()
      return { kind: 'op', text: ';' }
    }
    if (c === '&') {
      if (src[i + 1] === '&') {
        i += 2
        return { kind: 'op', text: '&&' }
      }
      if (src[i + 1] === '>') {
        i += 2
        if (src[i] === '>') i++
        return readTarget(false, false)
      }
      // zsh reads `&!` and `&|` as one operator, so the word after it starts a new
      // command there: `ls &!cd x`.
      if (src[i + 1] === '!' || src[i + 1] === '|') count.hidden = true
      i++
      noContinuation()
      return { kind: 'op', text: '&' }
    }
    if (c === '|') {
      if (src[i + 1] === '|') {
        i += 2
        return { kind: 'op', text: '||' }
      }
      i += src[i + 1] === '&' ? 2 : 1
      noContinuation()
      return { kind: 'op', text: '|' }
    }
    if (c === '(') {
      if (src[i + 1] === '(') fail()
      i++
      let after = i
      while (src[after] === ' ' || src[after] === TAB) after++
      noContinuation()
      return { kind: 'op', text: '(', empty: src[after] === ')' }
    }
    if (c === ')') {
      i++
      return { kind: 'op', text: ')' }
    }
    if ((c === '<' || c === '>') && src[i + 1] !== '(') return readRedirect()
    const word = readWord()
    if (isFileNumber(word) && (src[i] === '<' || src[i] === '>') && src[i + 1] !== '(') return readRedirect()
    // `f()`, `a=(1 2)` and the like.
    if (src[i] === '(') fail()
    return { kind: 'word', word }
  }

  // The word that names the command.
  function takeName(st, word) {
    st.at = 'args'
    // A name from a variable, a substitution or a pattern can be `cd` or a shell.
    if (word.opaque || word.braces || (word.glob && word.text !== '[')) {
      count.hidden = true
      return
    }
    if (word.text === 'cd') {
      st.cds++
    } else if (word.text === 'builtin') {
      st.at = 'name'
    } else if (word.text === 'command') {
      st.at = 'option'
    } else if (COMMAND_RUNNERS.includes(word.text)) {
      count.hidden = true
    } else {
      const name = programName(word.text)
      if (OTHER_READINGS.includes(name)) count.hidden = true
      if (PREFIX_RUNNERS.includes(name)) st.prefixRunner = true
      if (LOCAL_SHELLS.includes(name)) st.shell = 'options'
      if (name === 'eval') st.evalParts = []
    }
  }

  // An argument of a local shell. The first one that is not an option is the
  // code after -c (also -lc, -xc), and a script file without it.
  function shellArgument(st, word, loose) {
    if (st.shellSkip) {
      st.shellSkip = false
      return
    }
    const text = word.text
    if (!loose && (text[0] === '-' || text[0] === '+')) {
      if (SHELL_VALUE_OPTIONS.includes(text)) st.shellSkip = true
      else if (text[0] === '-' && text[1] !== '-' && text.includes('c')) st.shellCode = true
      return
    }
    const code = st.shellCode && !word.glob && !word.braces
    st.shell = ''
    st.shellCode = false
    // The new shell is a region of its own: its `cd` does not reach this one.
    // `probe` keeps a variable as a variable, so "cd $DIR && ls" is read too.
    if (code) scan(word.probe, count, level + 1, null)
  }

  function takeArgument(st, word) {
    const loose = word.opaque || word.glob || word.braces
    if (st.prefixRunner && loose) count.hidden = true
    if (st.evalParts !== null) {
      if (word.glob || word.braces) st.evalParts = null
      else st.evalParts.push(word.probe)
    }
    if (st.shell === 'options') {
      shellArgument(st, word, loose)
    } else if (st.prefixRunner && !loose && LOCAL_SHELLS.includes(programName(word.text))) {
      // `env bash -c ...`, `timeout 5 sh -c ...`: the runner starts this shell.
      st.shell = 'options'
    }
  }

  function endCommand(st) {
    if ((st.at === 'start' || st.at === 'time') && st.prefix) st.weak++
    const parts = st.evalParts
    st.evalParts = null
    st.shell = ''
    st.shellCode = false
    st.shellSkip = false
    st.prefixRunner = false
    st.prefix = false
    st.afterCond = false
    st.at = 'start'
    if (parts !== null && parts.length > 0) {
      // bash joins the arguments of eval with a space and runs the result in
      // this same shell, so its commands count in this region, in place of eval.
      st.strong--
      scan(parts.join(' '), count, level + 1, st)
    }
  }

  function feed(st, token) {
    if (token.kind === 'redirect') {
      if (st.at === 'cond') {
        if (token.heredoc) fail()
        return
      }
      if (st.at === 'forName' || st.at === 'forIn' || st.at === 'forWords') fail()
      if (st.at === 'start' || st.at === 'time') st.prefix = true
      return
    }
    if (token.kind === 'op') {
      const op = token.text
      // Inside [[ ]], `&&`, `||`, `(`, `)`, `<` and `>` belong to the test.
      if (st.at === 'cond') return
      if (st.at === 'forName') fail()
      if (st.at === 'forIn' || st.at === 'forWords') {
        if (op !== ';' && op !== NL) fail()
        st.at = 'start'
        return
      }
      if (op === '(' && st.at !== 'start' && st.at !== 'time') fail()
      // zsh reads `()` at the start of a command as a function with no name, and the
      // command after it as the body: `() cd x`.
      if (op === '(' && token.empty && !st.prefix) count.hidden = true
      endCommand(st)
      // Right after a pipe, also on a new line, `time` is a plain command name.
      if (op === '|') st.piped = true
      else if (op !== NL) st.piped = false
      if (op !== ';' && op !== NL && op !== '(' && op !== ')') count.chainOps = true
      return
    }
    const word = token.word
    if (namesRunner(word)) count.hidden = true
    if (word.plain && KEYWORDS_DOUBT.includes(word.text)) fail()
    // zsh reads a brace in the middle of a command as the start or the end of a
    // block, so the words after it can be a new command there. Only `{` and `}`
    // alone at the start of a command mean the same in bash and in zsh.
    if (word.braces || word.closer) {
      const alone = word.plain && (word.text === '{' || word.text === '}')
      if (!alone || st.prefix || (st.at !== 'start' && st.at !== 'time')) count.hidden = true
    }
    if (st.at === 'args') {
      // zsh runs the words after `]]` as a command: `if [[ -d x ]] cd x`.
      if (st.afterCond) count.hidden = true
      takeArgument(st, word)
      return
    }
    if (st.at === 'cond') {
      if (word.plain && word.text === ']]') {
        st.at = 'args'
        st.afterCond = true
      }
      return
    }
    if (st.at === 'forName') {
      st.at = 'forIn'
      return
    }
    if (st.at === 'forIn') {
      if (word.plain && word.text === 'in') st.at = 'forWords'
      else if (word.plain && word.text === 'do') st.at = 'start'
      else fail()
      return
    }
    if (st.at === 'forWords') return
    if (st.at === 'name') {
      // After `builtin`.
      if (word.plain && word.text === '--') return
      takeName(st, word)
      return
    }
    if (st.at === 'option') {
      // After `command`: -p keeps the next word as the name, -v and -V only describe it.
      if (word.opaque) {
        count.hidden = true
        st.at = 'args'
      } else if (word.text === '--') {
        st.at = 'name'
      } else if (word.text[0] === '-') {
        if (word.text.includes('v') || word.text.includes('V')) st.at = 'args'
      } else {
        takeName(st, word)
      }
      return
    }
    if (st.at === 'time') {
      // zsh has no option of `time`, so it runs `-p` and `--` as a command.
      if (word.plain && (word.text === '-p' || word.text === '--')) count.hidden = true
      if (word.plain && word.text === '-p') return
      st.at = 'start'
      if (word.plain && word.text === '--') return
    }
    // The start of a command.
    const piped = st.piped
    st.piped = false
    if (word.plain && st.prefix && KEYWORDS_AFTER_PREFIX.includes(word.text)) count.hidden = true
    if (word.plain && !st.prefix) {
      const text = word.text
      if (KEYWORDS_STAY.includes(text)) return
      if (text === 'while' || text === 'until') {
        st.loop = true
        return
      }
      if (text === 'time' && !piped) {
        st.at = 'time'
        return
      }
      if (text === 'for') {
        st.loop = true
        st.at = 'forName'
        return
      }
      if (text === '[[') {
        st.strong++
        st.at = 'cond'
        return
      }
    }
    const kind = leadKind(word.lead)
    if (kind === 'assignment') {
      st.prefix = true
      return
    }
    if (kind === 'item') fail()
    st.strong++
    st.prefix = false
    takeName(st, word)
  }

  // Reads one region up to its closing paren, or to the end of the text when
  // `closer` is empty. Subshell parens and braces stay inside their region.
  function region(closer) {
    depth++
    if (depth > MAX_DEPTH) fail()
    const outer = current
    const st = {
      at: 'start',
      strong: 0,
      weak: 0,
      cds: 0,
      loop: false,
      piped: false,
      prefix: false,
      prefixRunner: false,
      afterCond: false,
      shell: '',
      shellCode: false,
      shellSkip: false,
      evalParts: null,
    }
    current = st
    let parens = 0
    while (true) {
      const token = nextToken()
      if (token.kind === 'end') {
        if (closer !== '') fail()
        break
      }
      if (token.kind === 'op' && token.text === ')') {
        if (parens === 0) {
          if (closer === '') fail()
          break
        }
        parens--
      }
      if (token.kind === 'op' && token.text === '(') parens++
      feed(st, token)
    }
    if (parens !== 0) fail()
    // A heredoc of this region that never got its body.
    for (const doc of pending) if (doc.owner === st) fail()
    if (st.at === 'cond' || st.at === 'forName' || st.at === 'forIn' || st.at === 'forWords') fail()
    endCommand(st)
    if (closer === '' && host !== null) {
      // The code of an eval: one region with the command that called it.
      host.cds += st.cds
      host.strong += st.strong
      host.weak += st.weak
      if (st.loop) host.loop = true
    } else {
      if (st.cds > 0 && (st.strong > 1 || st.loop)) count.chained = true
      count.cds += st.cds
      count.total += st.strong + st.weak
      if (st.loop) count.loops = true
    }
    current = outer
    depth--
  }

  region('')
}

/**
 * What bash would run for `cmd`, or null when any part of it is not read with
 * full confidence.
 *   cds      commands named `cd`, in all regions
 *   chained  a `cd` shares its region with another strong command or a loop
 *   total    strong and weak commands, in all regions
 *   chainOps a `&`, `&&`, `||`, `|` or `|&` joins commands
 *   loops    a `for`, `while` or `until` is present
 *   hidden   quoted text can be code, or a command name is not known
 */
export function readCommand(cmd) {
  if (typeof cmd !== 'string' || cmd.includes(CR) || cmd.includes(NUL)) return null
  const count = { cds: 0, chained: false, total: 0, chainOps: false, loops: false, hidden: false }
  try {
    scan(cmd, count, 0, null)
  } catch {
    return null
  }
  return count
}

const REASON =
  'a `cd` chained into a compound command forces an interactive permission prompt in this repo (the env-file deny rule makes relative paths unverifiable once the cwd moves), and this session is unattended. Re-issue it with ABSOLUTE paths and no `cd`. Use each tool own directory flag instead: `git -C <dir> ...`, `grep -rn <pattern> <dir>`, `npm --prefix <dir> run x`, `bun --cwd=<abs dir> run x`, `find <dir> ...`, `node --experimental-strip-types <abs path>`. A bare, non-compound `cd` is fine.'

/** Pure decision: returns { decision: 'deny', reason } or null (= stay silent). */
export function decide(cmd) {
  if (typeof cmd !== 'string' || cmd === '') return null

  // The first verdict, from the raw text.
  let deny = hasCdCommandWord(cmd) && isCompound(cmd)

  // What bash would run. No answer leaves the first verdict as it is.
  const seen = readCommand(cmd)
  if (seen !== null) {
    if (seen.chained) deny = true
    else if (seen.cds === 0 && !seen.hidden) deny = false
    else if (seen.cds > 0 && seen.total === 1 && !seen.chainOps && !seen.loops && !seen.hidden) deny = false
  }

  return deny ? { decision: 'deny', reason: REASON } : null
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
