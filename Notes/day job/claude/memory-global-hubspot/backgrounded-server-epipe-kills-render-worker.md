---
name: backgrounded-server-epipe-kills-render-worker
description: "A backgrounded dev server whose task wrapper is reaped gets EPIPE on every log write, which kills Next's render worker and reports a misleading \"Jest worker\" error"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 7384e693-8f86-4dfd-837a-8994feb5ae49
  modified: 2026-09-10T22:58:26.601Z
---

When a long-running server is started with `run_in_background` and the harness later **reaps the task wrapper** (low memory, `/tasks` kill), the server process itself SURVIVES and keeps listening — but its stdout is a pipe with **no reader**. Every subsequent log write throws `EPIPE`, Next turns that into `uncaughtException`, the render worker child dies, Next retries twice, and the browser shows:

> Runtime Error: Jest worker encountered 2 child process exceptions, exceeding retry limit

**Why:** the message names Jest, which is not in the stack at all, and it appears per-route — the heaviest-logging route fails first while lighter ones still render — so it reads exactly like a module-graph or bundling bug in whatever was most recently changed. Measured 2026-09-11: `/admin/chapters/[id]` 500'd while `/admin` and `/portal` were fine, and removing the newest component from that page changed nothing. The tell is `Error: write EPIPE` + `⨯ uncaughtException` further up the same log.

**How to apply:** start a long-running server with output redirected to a **file**, not left on the wrapper's pipe — `npm --prefix <dir> run dev >> /c/tmp/<name>.log 2>&1 &` — so a reaped wrapper cannot break its writes. When a dev server that was working starts throwing worker errors, `grep -E "EPIPE|uncaughtException"` the log BEFORE bisecting code; and check whether a task-killed notification arrived for it, because the process staying up means "killed" did not mean "gone". Restarting it is the whole fix. See also [[background-workflow-shell-hang]] and [[state-sentences-go-false-when-you-act]].
