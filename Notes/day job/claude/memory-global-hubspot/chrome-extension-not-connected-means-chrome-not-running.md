---
name: chrome-extension-not-connected-means-chrome-not-running
description: "Claude in Chrome runs in MICROSOFT EDGE on this PC (deviceId 5ab8e4de…, 'Browser 1'). Never start chrome.exe; if 'not connected', check Edge (msedge) is running"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 5b64e559-e4e4-421f-ba43-eb082f4c40f6
  modified: 2026-10-31T07:24:28.689Z
---

**The browser is Edge** (operator, 2026-10-31): the extension is installed in Microsoft Edge, Default profile, and `list_connected_browsers` shows it as "Browser 1", deviceId `5ab8e4de-92a2-4e76-bec4-79ac6050e948`. Operator: "if it uses Edge, then just use it, I don't see why a separate Chrome window is needed".

**Why:** on 2026-10-31 a workflow's agents worked in Edge while a bare `chrome.exe` window (no args, parent already gone, started 14:16) sat open and untouched. No agent ran a launch command, so the extension's connector probably started it by itself. The old version of this memory told agents to `Start-Process chrome.exe`, which is wrong on this PC.

**How to apply:**
- Never start, focus or use `chrome.exe`. If a browser tool says "not connected", check `Get-Process msedge`. If Edge is not running, ask the operator to open it. Then `select_browser` with the deviceId above.
- With several browsers listed, pick the Edge entry ("Browser 1" / the deviceId above), never a Chrome one.
- If a stray Chrome window appears after a browser tool call, close it (`Stop-Process -Name chrome`, after checking it is a window this session made) and tell the operator.
- A freshly started browser is signed OUT of eochapterhubspotrollout.com: never type the password; ask the operator to sign in on that tab.
- A browser hidden behind the maximised terminal reports `visibilityState === "hidden"`: screenshots time out and streamed pages stay on "Loading…". `find` and `javascript_tool` still work, so read state that way.
- A Server Action's failure text is the app's message; the cause is in the Vercel runtime logs: [[prod-runtime-logs-via-vercel-cli-scope-eo-global]].
