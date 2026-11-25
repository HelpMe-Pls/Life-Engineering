# The sprint page

Reference for steps 7, 8 and 9 of /sprint-summary-tickets. The page is Khoi's own plan for the sprint: one HTML file of cards in ~/Documents/Edge8/Tickets. /sprint-afk-prep reads it next, so its markup is a contract.

## Which page

- A sprint runs from Wednesday to Tuesday and starts on the day of the call. The page's Sprint line gives its range, for example "Y26 Sprint 45 · Wed 11 Nov to Tue 17 Nov 2026".
- The newest page is the file named exactly `Sprint Tickets [YNN Sprint NN].html` with the highest year and then the highest sprint number. The folder also holds AFK prompts and [PROOF] folders: leave them alone.
- The Meeting date is inside the newest page's range: add the call's cards to that page in place.
- The Meeting date is in the 7 days after that range: make a new page with the next number, from the Meeting date's Wednesday to the next Tuesday.
- The Meeting date is later than that, or a new year starts: ask Khoi one question, with the number and the range you would use.

## Where the cards come from, in this order

1. The After the demo box of the review page for this call: ~/Documents/Edge8/Sprint review/sprint-NN-review.html with the highest NN, the list under the heading `After the demo · <day>`. When that day is not the Meeting date, the page belongs to another call: say so and take nothing from it. Each line of the box ends as exactly one of these, and you show which: a card, which cites the scope page the line names (read that page whole first); a step on a carried card; a waiting line; Khoi's own step, for housekeeping such as deleting a test deal, signing out or a setting in his own profile; or closed by the summary, for a line about the call itself. A line that opens with Retro pick or Retro change is a card in the repository it names, with no scope page to cite: its Done statement is the fix or the change in place, its Why paragraph quotes the moment or the reason the line gives, and where the fix is a check, a step shows that check fail on the miss it would have caught.
2. The call's action items that Edge8 owns. Khoi's become cards. A promise made on the call is a card due the same day or the next, with the message to send in a box. Thành plans his own cards: his work shows only as a dependency step on Khoi's card. EO's answers and EO's own tests are waiting lines that name EO as the owner.
3. The previous page's open cards. Khoi's TO DO and DOING cards are carried as new cards whose text says "This carries Sprint NN's Card N." Thành's cards that still read DOING are carried and assigned to Thanh. A WAITING card becomes a waiting line unless its dependency has cleared. A DONE card is named in the Source line only when the new plan builds on it.
4. The previous page's waiting list. Check each line again: read the repository's recorded decisions and its docs/plans/next-steps.md before you carry it, because the work may be done. A line whose dependency has cleared becomes a card when it fits the sprint.
5. What Khoi adds to the session: an email, a chat message or Dave's notes of another call. It is a card source, named in the Source line with its date. An owner those notes name (Ha, Dave) keeps the work as a waiting line, and Khoi's part of it becomes his card. None of it goes into the summary. A build that Dave says he is doing himself is a waiting line under Dave, never a card, and each card or waiting line that depends on it says so. A brief that Khoi names by its path is read even when it sits outside Tickets, Sprint review and Scopes: that one file only, and the card says which of its sections were read.

## Card rules

- One card is one owner and one block of work of at most 4 hours. HT is in days: 0.5 is 4 hours and 0.25 is about 2 hours. Keep HT honest, and tell Khoi it is the real size. Split anything bigger. Roll smaller pieces into one real deliverable: a card is never padding such as "send the email".
- Plan at most 10 cards for Khoi, each one he can finish inside the sprint. Dave's floor is 5 cards per person per sprint, and 10 in a productive week.
- A card never waits on EO or on another person. Blocked work goes to the waiting list, each line naming its owner in brackets. When a call pauses a pilot, the previous page's cards and waiting lines that depend on it become one waiting line that says what must happen first.
- A scope page's hour estimate becomes the card's HT, never a sentence on the card.
- A second assignee only where Khoi's first steps gate Thành's card.
- Order the cards against what a coming demo must still show: a card that deletes demo data is due after that demo.
- State a platform rule as proven only when it was proven. A fact a card states as checked is checked in this session.
- No card number, and no sprint, card or ticket word, in anything a step sends to EO or writes into a repository handoff.
- Wording: each card opens with a `Done:` statement and lists the acceptance steps that close it, each with its owner. Each step the run closes states a result that a read or a command can prove (the screen and what it shows, the record and its value, the command's output), so that an unattended run closes it without a question; a step that is a person's own says what that person does. A card that cannot start before another card's result names that card in its first step. Stagger the due days. One card per pull request. Use the vocabulary of the clone's CONTEXT.md (pilot wave, never beta; Events application; API information; access check; "Internal note" is only the account note).
- After the `Done:` paragraph, a `Why:` paragraph: the problem the card solves and for whom, in one sentence, from the call, the scope page or the carried card. /sprint-afk-prep hands it to the unattended run, which has no transcript.
- A choice that changes how the card is built, settled on the call, in a scope page or by Khoi, is a `Decided:` paragraph on the card, with who settled it and when. A choice nobody settled is never guessed onto a card: it is an `Open:` paragraph with the option you recommend, and /sprint-afk-prep asks Khoi.

## Markup contract

Copy the newest page's markup. A card:

```html
<article id="card-11" class="ticket">
  <header class="t-head">
    <div class="t-title">
      <span class="num">11</span>
      <h2>The title</h2>
    </div>
    <!-- prettier-ignore -->
    <div class="t-fields">
      <span class="chip p1">P1</span>
      <span class="field">Due <b>Fri 13 Nov</b></span>
      <span class="field">HT <b>0.25</b></span>
      <span class="status todo" data-card="11">TO DO</span>
      <span class="field updated" data-card="11" data-updated="2026-11-11T11:27:51+07:00">Last updated <b>Wed 11 Nov, 11:27</b></span>
      <span class="assignee" data-card="11" data-assignees="Khoi"></span>
    </div>
  </header>
  <div class="t-body">
    <div class="desc">
      <p><strong>Done:</strong> what is true when the card is closed.</p>
      <p><strong>Why:</strong> the problem it solves, and for whom.</p>
    </div>
    <h3>Acceptance steps</h3>
    <ol>
      <li><span class="who">Kh&ocirc;i</span> the step.</li>
    </ol>
  </div>
</article>
```

- The number in `id`, in `span.num` and in the three `data-card` values is the same on a new page, counted from 1. `data-card` is the card's internal id: on a page that already exists, a new card takes the next unused number and keeps it, because a tab that is still open saves by id.
- Status: `class="status todo|doing|waiting|done"` with the label TO DO, DOING, WAITING or DONE. A waiting or done card repeats the word in its article class (`class="ticket waiting"`).
- Last updated: `data-updated` is the writer's local time with the offset, to the second, and the bold text has the form `Wed 14 Oct, 21:40`. Stamp every card when you create it.
- Assignee: `data-assignees` holds Khoi, Thanh or Ha, comma-separated when there are two. Fill it only for an owner the plan names.
- Each `.t-fields` sits under `<!-- prettier-ignore -->` with one whole span per line, so that every span closes with `</span>` on its own line: a split chip makes every status save fail.
- Owners in steps are `<span class="who">Kh&ocirc;i</span>` and `<span class="who">Th&agrave;nh</span>`. Every apostrophe is `&rsquo;`, except inside a message box, which holds the plain text as it is sent.
- `div.desc` holds the `Done:` paragraph first, then `Why:`, then `Decided:` or `Open:` where the card has one: each a `<p>` that opens with its word in `<strong>`.
- A message to send: `<h3>Message to send</h3>`, a paragraph with `<strong>To:</strong>`, `<strong>Copy:</strong>` and `<strong>Subject:</strong>`, then the text in `<pre class="msg-box">`.
- Page head: `<title>Sprint NN Tickets</title>`; `<header class="page-head">` with an `<h1>` (the same words, then a `<small>` that says where the plan comes from) and a `div.meta` list of three lines: Sprint (the range), Source (which call, scope or carried card gives each card) and Scope (cards and HT per owner, what goes first, and that no card waits on EO).
- Waiting list: `<section class="parked">`, `<h2>Waiting outside the sprint</h2>`, a paragraph, then a `<ul>` whose lines each open with a bold lead that ends with the owner in brackets, `<b>The work (Kh&ocirc;i).</b> Waits for ...`. Lines that stand unchanged on an earlier page are not copied: one closing line carries them, its bold lead a link to that page, `<b>Everything else on <a href="Sprint%20Tickets%20%5BY26%20Sprint%2043%5D.html">Sprint 43&rsquo;s waiting list</a></b> stands as it was on 3 Nov, with the same owners.`

## Build

- A new page: write a JSON spec of the page head, the cards and the waiting lines, and a generator in the scratch folder that prints the page from it. The `<head>` (only its `<title>` changes), the CSS and the page's `<script>` are the previous page's bytes. Keep the previous page's line endings, and write no BOM. Run Prettier once on the new page, `node "<clone>/website/node_modules/prettier/bin/prettier.cjs" --write --end-of-line auto "<the page>"`, then its `--check`. When the previous page's head or script is not in Prettier's shape (an in-place edit), Prettier changes those bytes and page-check fails: then splice the previous page's head and script back around the formatted body, and say in the handover that Prettier's check would flag only those copied parts.
- A page that already exists: patch its text in place with a script that asserts each needle exactly once. Leave Prettier off it: Khoi and other sessions edit these pages in place, and the newest one may already differ from Prettier's shape.

## Check

```bash
node "<this skill's folder>/page-check.js" "<clone>/website/node_modules/jsdom" "<the page>" "<the previous sprint's page>"
```

Every line must say PASS. Its INFO line gives the cards and HT per owner for the handover. On the work PC the page's pickers save through a helper, %LOCALAPPDATA%\Edge8\tickets-helper.pyw. Where that file exists, prove the save on a copy: copy the page into a new temp folder, start the helper with `--dir <that folder> --port <a spare port>`, POST `/cards` once with the header `Origin: null` and a JSON body: `path` is the copy's URL path (`/C:/tmp/...html`, as location.pathname), `title` is the page's `<title>`, `status` maps each card id to `todo`, `doing`, `waiting` or `done`, and `assignees` maps each card id to a string such as `Khoi`. Read the reply's status map and the copy's saved status, then stop the helper. Where it does not exist, say in the handover that the check did not run.
