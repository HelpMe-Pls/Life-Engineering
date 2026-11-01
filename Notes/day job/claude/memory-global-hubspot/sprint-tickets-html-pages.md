---
name: sprint-tickets-html-pages
description: "The local Sprint Tickets HTML pages save their own statuses; data-card is an INTERNAL id, not the visible card number; parse them, never open them through automation"
metadata:
  node_type: memory
  type: reference
  originSessionId: 0d779df9-8277-4d97-8cf1-0b46d3755924
  modified: 2026-10-11T14:18:58.360Z
---

`~/Documents/Edge8/Tickets/Sprint Tickets [Y26 Sprint NN].html` is one self-saving page per sprint (Sprint 38 onward; Sprint 41's was drafted from Sprint 40's on 2026-10-08).

- A status chip is `<span class="status {todo|doing|waiting|done}" data-card="ID">LABEL</span>`. **`data-card` is an internal id**: in Sprint 40, visible card 4 is `data-card="10"`. Find a card by its `<span class="num">` and title, never by assuming id = number.
- `waiting` and `done` are also repeated on the card's `<article class="ticket …">` (its left-edge tint). The page's own `patchStatus` writes both, so a hand edit must too.
- **Last updated** (added 2026-10-11 to Sprints 40 and 41, helper VERSION 3): each card has `<span class="field updated" data-card="ID" data-updated="2026-10-11T21:40:05+07:00">Last updated <b>Sun 11 Oct, 21:40</b></span>` right after its status chip. The helper and the page's folder save stamp it when a status or assignee save really changes the card. **A hand edit to a card must stamp it too** (both the attribute and the `<b>` text, the writer's local time). Older pages without the field are left alone. Backfilled times came from Claude Code's file-history copies (their mtime is the write time) plus the session logs.
- The page identifies itself by `document.title` plus its path, and saves through a local helper (`127.0.0.1:47613`) or by launching `edge8-tickets://start`. Don't open it through browser automation (the protocol launch); check it with jsdom from `website/node_modules`.
- A new sprint's page is the previous page with the title, header, cards, "Waiting outside the sprint" and footer swapped. The CSS (only `.p1` and `.p2` chips) and the script carry over unchanged. A carried waiting item that cites "Card N" must be re-pinned to the old sprint ("Sprint 40's Card 3").
