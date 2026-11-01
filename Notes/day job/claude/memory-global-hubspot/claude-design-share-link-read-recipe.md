---
name: claude-design-share-link-read-recipe
description: "How to read a claude.ai/design share link whole from Claude in Chrome (the canvas is a cross-origin iframe; GetFile through the page's own session works) and save an exact copy"
metadata:
  node_type: memory
  type: reference
  originSessionId: 3c3d1c45-5f61-4659-ac0c-f544df616df2
  modified: 2026-10-28T12:51:41.485Z
---

A claude.ai/design share link renders the design in a cross-origin iframe (`*.claudeusercontent.com`), so `get_page_text` and `read_page` see only the shell, and the Read tool or WebFetch cannot open it. What worked on 2026-10-28, with Khôi's approval to save the copy:

1. `javascript_tool` in the design tab: `fetch('/design/anthropic.omelette.api.v1alpha.OmeletteService/ListFiles', {method:'POST', headers:{'Content-Type':'application/json','Connect-Protocol-Version':'1'}, body: JSON.stringify({projectId})})` lists the project's files with sizes and dates; `GetFile` with `{projectId, path}` returns `{content: <base64>}`. Decode with `atob` + `TextDecoder`, and strip the two `data-omelette-injected` style and script blocks the server adds.
2. `javascript_tool` output is capped at roughly 1,500 characters, so put the text into a `<pre>` in the page body and read it with `get_page_text` in one go.
3. To save an exact copy, build a Blob and click an `<a download>` (ask first: a download needs permission), then move it from Downloads and compare `sha256sum` with a `crypto.subtle` digest computed in the page.

**Why:** the design file is the spec a run needs verbatim, and Claude Design closes on 2026-12-14. The `DesignSync` tool is reserved for the /design-sync skill and may prompt for a new OAuth scope, so the page's own session is the lighter path.

**How to apply:** a `.dc.html` file is Claude Design's "design component" format (state and logic in a `text/x-dc` script); the `.src.html` files beside it are older static variants. Diff the newest file against the older source with a line-set diff in the page to see what an edit changed. Related: [[chrome-extension-not-connected-means-chrome-not-running]].
