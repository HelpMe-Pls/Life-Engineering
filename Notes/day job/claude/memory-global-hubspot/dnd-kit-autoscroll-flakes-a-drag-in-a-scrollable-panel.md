---
name: dnd-kit-autoscroll-flakes-a-drag-in-a-scrollable-panel
description: "A Playwright drag inside a SCROLLABLE container flakes, because dnd-kit auto-scrolls it by an amount that depends on drag duration"
metadata:
  node_type: memory
  type: project
  originSessionId: 35549ed4-b97c-4c79-acae-7513436ef9e8
  modified: 2026-10-18T06:19:08.347Z
---

A mouse drag in a Playwright spec flakes when the drop target sits inside a container that can scroll. dnd-kit's DndContext auto-scrolls a scrollable ancestor while a drag nears its edge, and how far depends on how LONG the drag takes. So a slow CI runner overshoots and a fast one does not. Found on 2026-10-18 by the first weekly regression run (#1129, Table settings column reorder, Region landed one row too far). Fixed in #1132.

**Why:** the bounding boxes are read BEFORE the drag, so any scroll during it moves the rows under the pointer. The failure screenshot gives it away: the panel is scrolled, its first heading cut off.

**How to apply:** give the spec a viewport where the container cannot scroll, and assert `scrollHeight <= clientHeight` first, so it fails by name if the container grows. Keep auto-scroll in the app (it helps users on short screens). To PROVE the cause, slow the glide (`steps: 80`) on the old viewport: it should fail every time. Related: [[red-recipe-is-a-hypothesis]], [[mutation-is-a-hypothesis-read-the-source-back]].
