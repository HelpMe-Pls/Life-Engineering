---
name: deliverable-asked-mid-turn-goes-in-final-reply
description: "A paste-ready message or other deliverable asked for mid-turn must be repeated in the turn's FINAL reply and saved to a file; text written between tool calls gets missed"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 1ef13eb9-c7a8-418e-b4b6-95b944a7a6ea
  modified: 2026-10-29T05:26:04.117Z
---

On 2026-10-29 the operator asked for a paste-ready message to Lauren King while a long turn was still running. I wrote it as text between tool calls and kept working; the operator asked "Where's that pasteready message to Lauren?" and then "Where's that Lauren's message at again?", so the in-between text was not seen.

**Why:** text between tool calls scrolls past or is not shown as the answer; the operator reads the final reply.

**How to apply:** when the operator asks mid-turn for something they will paste or act on (a message, a command, a URL, credentials location), put it in the FINAL reply of the turn, in the paste-ready form ([[paste-ready-is-blue-inline-spans]]), and also save it as a local file beside the related report so it can be found later. A short "it is coming in the final reply" line mid-turn is fine; the deliverable itself must be at the end.
