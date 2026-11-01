---
name: bash-tool-quirks
description: On Khôi's Windows PC the Bash tool changes some command text before bash runs it: a long heredoc holding a Python string opened with three single quotes failed, and a doubled backslash in a heredoc reached the file as one backslash; write such scripts with the Write tool, then run them with Bash
metadata:
  type: reference
---

Seen on 17 Oct 2026 in the Captures project (Git Bash, Windows 11 build 26300):

- A heredoc that wrote a long Python script whose block string opened with three single quotes failed twice with "unexpected EOF while looking for matching quote", reported at the first line holding the three quotes. Bash itself parsed the body as commands, so the heredoc never started.
- Once, a short heredoc that wrote a JS file worked, but a doubled backslash in a regex reached the file as one backslash, which broke the regex.

**Why:** each cost a round on 17 Oct. The cause was not found.

**How to apply:** keep heredocs short and free of backslashes and of three single quotes in a row. For a file path, use require('url').pathToFileURL in Node, and chr(10) in Python for a newline. For a long edit script, write it with the Write tool and run it from Bash. Related: [[sprint-review-files]].
