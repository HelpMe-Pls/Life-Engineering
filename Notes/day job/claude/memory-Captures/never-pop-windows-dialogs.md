---
name: never-pop-windows-dialogs
description: "Tests must never make Windows show dialogs on the user's desktop, e.g. by handing an unregistered URL scheme to the OS (\"Get an app to open this link\")"
metadata:
  node_type: memory
  type: feedback
  originSessionId: cd517812-0b8f-4c9c-8cf1-1ba8da40a575
  modified: 2026-10-07T11:54:23.722Z
---

On 2026-10-07 a browser test of the Tickets helper pre-allowed a made-up scheme (`edge8-tickets-none://`) in headless Chrome/Firefox profiles, so the browsers passed it straight to Windows, which kept popping "Get an app to open this 'edge8-tickets-none' link" on the user's screen. The user asked never to see it again.

**Why:** headless browsers are invisible, but anything they hand to the OS (external protocols, downloads, file pickers) lands on the user's real desktop and interrupts them.

**How to apply:** in tests, only launch URL schemes that are registered for the test, pointing at a silent command (e.g. `pythonw -c "pass"`), and remove the test keys afterwards. Never pre-allow an unregistered scheme. Without a pre-allowance, Chrome refuses an unregistered scheme quietly ("scheme does not have a registered handler"). Before any test that can reach the OS, ask whether it can open a window the user would see. Related: [[tickets-assignee-helper]].
