---
name: no-sprint-or-card-words-in-repos
description: "Never write card, sprint or their numbers into a repository's files, comments, commits, branch names, PR titles or bodies; name the feature and cite the spec section, issue or PR instead"
metadata:
  type: feedback
---

Never add the words card or sprint, or a card or sprint number ("Sprint 41", "Card 5"), to a repository: files, code comments, commit messages, branch names, PR titles or PR bodies. Name the feature, and cite what any contributor can open: the spec's section, a GitHub issue, or a pull request in that repository.

**Why:** the operator, 14 Oct 2026, on event-sync's first README: "Don't mention `card` or `sprint` in this repo ... other contributors won't know what those `card` or `sprint` are about." The sprint pages live only on the operator's machine (the Tickets folder), so a card number points at nothing a contributor can open. The same day the operator allowed ONE rewrite of event-sync's `main` to take "Sprint 41 card" out of its first commit message (now root commit eb1c487); PR #1's page on GitHub still shows the old words, because GitHub keeps a PR's refs and only GitHub Support can purge them.

**How to apply:** event-sync holds none, and stays that way. global-hubspot already cites sprint cards (about 40 times in `EVENTS-CONNECTOR-SPEC.md`, a few in `recorded-decisions.md`, `next-steps.md` and `scripts/events-dry-run.ts`): add no new ones, and a sentence that a PR rewrites anyway loses its card words. The connector spec is the one exception that gets swept: on 14 Oct 2026 the operator asked for every sprint and card mention in `EVENTS-CONNECTOR-SPEC.md` to go ("Yes, I want the spec cleaned up before the prompt is final"), because event-sync's README and CLAUDE.md send contributors there; the Sprint 41 AFK run's first docs PR does it, proved by `git grep -n -i -E "sprint|\bcards?\b"` on the spec printing nothing. Anything else event-sync links to gets the same treatment; other global-hubspot files get no sweep unless asked. A setup session writes this rule into every execution prompt it prints. Before a commit, grep the diff and the message for card and sprint. A rewrite of pushed history needs the operator's go-ahead each time. Related: [[sprint-afk-setup-prompt]], [[sprint-tickets-html-pages]], [[connector-timed-run-twice]].
