# The meeting summary

Reference for steps 5, 6 and 9 of /sprint-summary-tickets. The page's format is the clone's own: docs/meetings/README.md, section What a summary looks like, plus the newest summary's `<head>` and inline CSS, copied as they are. This file holds only what those two do not say.

## Reader

EO Global. The rollout tracker lists docs/meetings to every admin account on its Meetings tab, everyone who can read the repository can read the file, and a committed file stays in git history. Write short sentences, explain each term at its first use, and place each person at first mention ("Dave Hajdu of Edge8", "Israel Canamar of EO Global").

## The page

- Name: `Meeting Summary [YYYY-MM-DD].html`, with the Meeting date. One file per date. Any other name is silently left out of the tracker's list.
- Order: `<title>Meeting Summary — <Month D, YYYY></title>`; an `<h1>` that names the call's topics; the date line; the `Attendees:` list; the Context box; the Action Items table right below the Context; `What Was Demonstrated` with an `<h3>` per demo; `Settled` with a bold lead-in per decision; one `Open — <topic>` section per open question; the footer.
- Attendees: one bullet per organisation, `EO Global:` first, then `Edge8:`, then any other organisation present (Cloud Converge). The names go in a `<span>`. List only the names the recording makes certain, and tell Khoi which names he must confirm: he adds the rest himself. Write no line that says the list is limited.
- Action Items: one row per action, with its owner and a Due chip (`chip-immediate`, `chip-week`, `chip-after`). A chip does not wrap, so keep its text to 18 characters ("Thursday 12 Nov"): a longer chip breaks the 375 px layout. An action Khoi decides after the call goes in as his action item. A row belongs to the person who accepted the action on the call: an ask the other side did not accept goes under Open, with who asked.
- Footer: which call, its date, and "Speaker attribution is inferred from the recording." The body says "the weekly development call". Leave out "(sprint review)" and the old sentence about narrative detail being removed.
- Length: about a thousand words (past pages: 1,205 to 1,439). To cut, merge action rows, keep one paragraph per demo, and say each thing once. Draft to this length: a first draft that kept every exchange ran to 1,923 words, so give a Settled item two or three sentences and an Open section one short paragraph before the first count.
- Carry forward the newest summary's terms and its open questions: say which were answered and which were not discussed.
- Settled holds only what both sides agreed on the call. What one side says it means to do goes under Open, with "not built yet". A day, a week or a time that one side offered is written as offered, with who answers, never as decided.
- Dates: the call is Tuesday evening US Eastern and Wednesday morning in Vietnam. EO's "tomorrow" is Wednesday in US time: write "the day after the call (Wednesday 21 October, US time)".
- A change to the clone's docs/plans/next-steps.md that comes out of a call rides in the same docs pull request as that call's summary.

## What stays out

- Anything Edge8-internal: sprint planning and the words sprint, card and ticket; contracts; hours; what Edge8 thinks of a request. An Eventbrite ticket (order and ticket, ticket type, ticket name) is Eventbrite's own word and stays.
- What Dave asked to keep from EO: everything about EO Vietnam, above all the events test (website events copied to OneEO on the sandbox) and the push of the EO Vietnam app's deals into HubSpot. Add to this list when Dave adds to it. It stays out when Dave names it on the call himself: write his plan without it, and tell Khoi in the handover.
- What the recorded call did not say. An email, a chat message or notes of another call that Khoi adds to the session go to the sprint page, never into the summary.
- A local file path, a ticket number, and `#` before a digit (write "PR 1110").
- Private data a video frame shows, such as an admin page with email addresses.
- A private recording. It gets no summary in the clone: ask Khoi where it goes (on 28 Oct a private talk with Dave became a page in Scopes).

## Names

Write each name as here. Leave out a name the recording does not make certain, and report it to Khoi.

- EO Global: Nisha, who runs the project on EO Global's side. Kyle, who hosts when Nisha is away; the attendee list shows him as KP, which is Khoi's own edit. Israel Canamar. Lauren. Emily, surname unknown. Avery. Dominick, on EO's data side. Stacie Hebdon, listed as Stacie. David Sourbutts, written "Sourbutts". David Stephenson, who owns the payment processing review, never "Stevenson". Sourbutts and Stephenson are two people. EO Global people go by first name in the attendee list.
- Edge8: Dave is David Hajdu, Edge8's lead on the engagement and a third David. Khôi Lê. Thành Nguyen, always with the accent. Ha Nguyen.
- Cloud Converge is the vendor that builds Altai's side of the payment trigger. EO Global makes the introduction, and Edge8 never contacts them directly.
- EO's Growth Team is capitalised.
- Claire, of EO Global's business team, reviews the HubSpot work with Avery. Her surname was heard once as "Lim" after "I think", so she goes by first name.
- Mouris and Marie, of EO Global's team, sent the attendee steps and the test plan for the event connector by email (17 Nov). The summary says "EO Global's team" for them unless the call makes the name certain.
- Heard and never made certain, so kept out: Terrence, Drake, Chris, Tabitha, Tristan, Michael; an EO data-team colleague heard as "Suka", "Celica" or "Celco"; "Keith Carrier"; an EO Global colleague heard as "Iseli"; the contact person of a chapter, whom Stacie does not name. "Karen" is spelled as heard. "celly" is an unknown word and never a name.

## What the transcript mishears

- Thành: Han, Tom, Tan, Sam, Pan, time, Ty, Todd, Tham, Dan, Tima, Tolana. But "Han" was Ha on 11 Nov, so a frame settles it.
- Khôi: Khoia. Ha: HA. Nisha: Eisha. Avery: every, able. Dominick: Dominic, Dominique. Stacie: Stacey, Stacy. Mouris: Maru, Mario. Sourbutts: Saurabh, Saurbuts, Sour Butts, Sour Buds, David S., David Salbert. Cloud Converge: CC.
- Hivebrite: Hybrid, Hypebrite, High Fright, high-frived, Highbrite, High Purpose, Halfbrite, Hackbrite, hybride, Hybrite.
- SLP (spouse or life partner): selfie. ICP (ideal customer profile): ICB. lead status: list status.
- OneEO: one EO, 1.EO, 1EO, 1.0, 1.8, Wadio.
- HubSpot: hotspot. SOW: SLW. V1.1: B1.1. Closed Won: close one. WhatsApp: what's up. Diwali: Tiwali.
- paid-up date: paid update. renewing member: redoing member. Chapter Bought (a License Type): Chapter Bot. grouped by wave: approved by WAVE. Eventbrite's free plan: three plan.

## Terms

HubSpot is the CRM EO rolls out to its chapters. Altai is EO's membership system. Chargebee is EO's billing system. Hivebrite is the platform behind OneEO, EO's member site. Eventbrite is the event tool chapters use. The tracker is the rollout app at eochapterhubspotrollout.com. A member in grace has a lapsed membership that is still inside the grace period. The Membership Application Form is HubSpot's form for new and returning members.

## Speakers

The transcript has no speaker labels. Attribute by what each voice says and knows, and settle a doubt with one video frame from inside the utterance: `ffmpeg -ss <MM:SS> -i "<the recording>" -frames:v 1 "<scratch>/frame-<MMSS>.png"`, read as an image, cropped to the meeting's floating window when it is small (`-vf crop=w:h:x:y`). The speaker's green border lags 1 to 2 seconds, so take the frame that far into the utterance. Participant names come from the same frames. Game Bar names the file when the recording ends, so the call started its length earlier.

## Fact-check

When the fact-check agent's report does not arrive as a notice, read it from the agent's own transcript: the newest .jsonl in the subagents folder of this session, under ~/.claude/projects. Spawn no second agent. A finding that a name or a title is not in the transcript is settled by a video frame (an attendee's tile) or by the tracker's own page (a page title), and a term's explanation that comes from Terms is not a finding.

## Format and check

```bash
node "<clone>/website/node_modules/prettier/bin/prettier.cjs" --write --end-of-line auto "<the summary>"
node "<clone>/website/node_modules/prettier/bin/prettier.cjs" --check --end-of-line auto "<the summary>"
node "<this skill's folder>/render-check.js" "<clone>/website/node_modules/playwright" "<the summary>"
```

Prettier runs with its defaults: the repository's own config covers only website/. The clone's summaries have the line endings of its checkout (CRLF on the work PC), and `--end-of-line auto` keeps what a file has: give a new file the newest summary's line endings before the final check. Every render-check line must say PASS: no sideways scroll at 375 and 1280 px, no script or form, no `#` before a digit, no local path. It prints the word count too. Then read the page cold as an EO Global admin.

Khoi edits every summary by hand after it is made, and his edits win. When an edit changes an action's owner or timing, change the sprint page to match.

## Shipping, only when Khoi asks

Read the clone's .claude/skills/github-flow/SKILL.md whole and follow it. In short: branch `docs/meeting-summary-<yyyymmdd>` off `origin/dev`; stage the one file by name; one commit, `docs(meetings): :memo: the <D Mon YYYY> development call's summary`, its message written to a file and passed with `commit -F`; push, which runs the website's gate for about 10 minutes, so run it in the background with `GIT_SSH_COMMAND="ssh -o ServerAliveInterval=20 -o ServerAliveCountMax=60"`; a pull request into `dev`, squash-merged; then the promotion pull request `promote: dev to main — the <D Mon YYYY> meeting summary`, merged with a merge commit once its required check is green. gh is always `env -u GH_TOKEN gh ... --repo EO-Vietnam/global-hubspot`, as the account Kh0iLe (`env -u GH_TOKEN gh auth switch --user Kh0iLe` when another account is active). Other sessions share the clone: when it is on a branch that is not yours, work in a git worktree with its own `npm ci`. Done when Khoi has both pull request links and the page's address, `https://eochapterhubspotrollout.com/admin/meetings/<YYYY-MM-DD>`.
