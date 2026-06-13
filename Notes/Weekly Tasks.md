# What a good day looks like
- Wake up at 5AM
- Finish workout before 6:30AM
- Finish breakfast before 9AM
- Work on your money tasks from 10AM to 12PM → This is what sustaining your income
- Spiritual tasks from 3:30PM to 5PM → This is what keeping you from burning out
- Shower (earned it) at around 6-6:30PM
- Dinner @6:30-7PM
- Read books or keep building from 8-9PM
- Pass out by 9:30PM
- Rinse & repeat
# Strategic goals
- Finish EP TDD for happy paths & quiz feature BEFORE July.
- EO: Chapter rollouts, Middleware, Events sync
- Launch EP BEFORE the contract ends.
- `/grill-me` with what you've learned from Antifragile to form a new business.
- Always have a plan. When in doubts, stack reps. Exploit AI consultancy for separating signals from noise.
# Pivot
- 6 months if no progress.
- Put yourself out there.
- Connect the dots.
- Barbell strategy.
---
### 8/6
- [x] EO: #19++ 
	- [x] It's fucking slow (~2s) when navigating between pages in the `/admin` route
	- [x] Remind them about the Altai XML exports & data structure
- [x] EP: finish the slice train
- [x] MDW++
- [x] Live up to your standards
### 9/6
- [x] EO weekly report & sprint goals update
	- [x] Setup the Altai → HubSpot wf in prod 
	- [x] Close #19
	- [x] Create a prompt to help you close #20, then merge `dev` into `main`
- [x] EP: Merge the PR into `staging` & run HITL
- [x] MDW++
- [x] Live up to your standards
### 10/6
- [x] EO:
	- [x] Follow up the Altai data structure & Supabase Auth
	- [x] Bring back the setup script for Ha
	- [x] Create a user guide for non-tech stakeholders (all roles)
	- [x] Resend Broadcast template for Email 1
- [x] EP: Pending
- [x] MDW++
- [x] Live up to your standards
### 11/6
- [x] EO Global sprint review, refine `global-hubspot`
	- [x] Chapter ⇌ Region map + filters
	- [x] Loosen file upload validation
	- [x] Remove "request approval" flow
	- [x] Update Claude rules and `CLAUDE.md`
- [x] EP: update `CLAUDE.md` and rules
- [x] MDW++
- [x] Live up to your standards
### 12/6
- [x] EO minimal work:
	- [x] Mkt meeting
	- [x] Prep for the Altai prod sync
	- [x] Resolve issues
- [x] Bragdoc
- [x] EP: Resolve backlog, Close #161 & Re-grill
- [x] MDW++
- [x] Live up to your standards
### 13/6
- [x] Perfect dive start + 500m with paddles
- [x] Groceries
- [ ] Splurge if you earned it (i.e. done EP HITL & confirmed `global-hubspot` MVP)
- [x] EP: Close issues
- [x] Review the Old Infant script
- [x] MDW++
- [x] Live up to your standards
### 14/6
- [ ] EP: test the sidebar for lesson & module boundary
- [ ] Antifragile note
- [ ] `global-hubspot` AFK
- [ ] Weekly planning
- [ ] Finish MDW
- [ ] Live up to your standards

---
# Backlog
- [Learn about animations](https://animations.dev/learn/animation-theory/intro)
- [Learn to be an AI Engineer](https://www.aihero.dev/ai-engineer-roadmap)
- [Learn MCP](https://www.aihero.dev/model-context-protocol-tutorial)
- [Learn TS](https://www.totaltypescript.com/workshops/typescript-pro-essentials/types-you-don't-control/configuring-the-lib-compiler-option)
- EO:
	- [ ] Make sure that the "definition of done" for a sprint is that a non-tech stakeholder can use it without any friction
	- [ ] Altai ⇌ HubSpot prod: finish the mkt sync
	- [ ] E2E for `global-hubspot` with this prompt in plan mode once the MVP is approved: *Explore the repo and utilize the appropriate skills in your repertoire to give me the OPTIMAL prompt to start implementing E2E tests and make sure that the entire testing infrastructure is enterprise-grade, no flaky/noisy tests and zero test for implementation details. Above all, the tests are there to prevent regression.*
	- [x] Resolve conflicts and merge #22
	- [x] Install `mattpocock` skills on the repo and run `/tdd` once you're done with the issues
	- [ ] Refresh `README.md` by using the `/understand` skill
	- [x] Extract the general rules from `file.md` for `global-hubspot`
	- [ ] After #19 closed:
		```
Adopt Fallow (deterministic dead-code/duplication analysis) in website/ as a one-session, one-PR tooling task. Issue #19 is closed and merged to dev; #20 has not started. This task is evidence-tooling only — it must NOT expand into a cleanup crusade, CI work, or gating.

  Source of truth: next-steps.md. Honor .claude/rules/global-engineering.md and the website/CLAUDE.md engineering contract. Branch off dev; I approve pushes and the PR merge. Ask me one question at a time with a recommended default.

  Steps, in order:
  1. Create a tracking issue: "Adopt Fallow static analysis (evidence-only, no gates)" — category enhancement, state ready-for-agent. Reference it in commits.

  2. From website/: npm install --save-dev --save-exact fallow (pin exact — upstream releases multiple times a day).

  3. Before running ANY fallow command, read `node_modules/fallow/skills/fallow/SKILL.md` and every file in its references/ directory completely, and obey its agent rules: always `--format json --quiet 2>/dev/null` with `|| true`; never run `fallow watch`; never `fix --yes` anything whose --dry-run I have not seen.

  4. Run `fallow dead-code` and `fallow dupes` (JSON) and triage every finding into exactly three buckets:
     a. FRAMEWORK FALSE POSITIVES — Next.js server actions exported from actions.ts files (consumed via form action= props) and React Email template default exports under `lib/notifications/templates/` (consumed via @react-email/render). Fix via entryPoints in .fallowrc.json — not inline suppressions.
     b. KNOWN-FALSE DEPENDENCY FINDINGS — @mdx-js/loader and @mdx-js/react (wired through next.config.ts) and react-dom (bundled by Next). Ignore in config with an INFO comment; never uninstall them.
     c. GENUINELY DEAD — delete only what is trivially safe with tests green. Skip everything under app/prototype/ (removed wholesale in #20). List every remaining candidate in the PR description; do not chase them.

  5. Establish the baseline per SKILL.md so future runs report new issues only, and add a package.json script "audit:dead" = the fallow audit invocation, so reviewers never invoke the binary ad hoc.

  6. Add one short paragraph to website/CLAUDE.md (verification section): `npm run audit:dead -- --base dev` is review EVIDENCE on every PR — new-only findings, never a blocking gate. Record the adoption + known false-positive patterns in next-steps.md in 3-4 lines.

  7. FORBIDDEN in this task: `fallow hooks install` (git or agent), any GitHub Actions/CI wiring, registering the MCP server, `fallow license` anything, `fallow security` as a substitute for #20's security verification, and any attempt to reduce the duplication percentage.

  8. Verify per the contract from website/ (typecheck, lint, test, build), commit conventional+gitmoji, open the PR into dev, and report: counts per bucket, what was configured vs deleted, and the one command reviewers run from now on.
		```
	- [ ] Setup CI/CD workflow
- EP: 
	- [x] Fix the missing white background for lessons in read-only mode
	- [x] Fix the `Error: useCollaborationContext: no context provider found` on `http://localhost:5173/courses/intro-to-web-dev/html-css-fundamentals/html-structuring-your-first-web-page`
	- [x] For the learner's view: automatically open the associated module in the sidebar as the learner crosses the module boundary (e.g. finishing the last lesson on a module should open up the next module in the sidebar and close the previous one accordingly. This belongs to the Accordion state management)
	- [ ] Maybe set up a `k6/artillery` run against staging with the two profiles that matter — steady learning (nav + complete-lesson) and checkout burst?
	- [x] Last vuln & high ROI perf bottlenecks scan with `gpt-5.5-xhigh`. Perform a via negativa approach if you see fit. 
	- [ ] Run `/improve-codebase-architecture` and refer to the `docs\plans\architectural-deepening-grill.md` file to follow this prompt AFTER closing #131 & #135:
		```
		Architecture session: re-open the grill loop per docs/plans/architectural-deepening-grill.md.

  Context: Issues #126–#135 all shipped and closed (waves 1–3 + HITL smokes done). The grill
  loop closed 2026-05-22 with one deferred target — candidate #5 (asset-tracking / editor-state
  rename) — gated on #133+#134 shipping. That trigger has fired (#133 Wave 1, #134 Wave 2
  commit 4c9e81e). Re-scope candidate #5 now.

  Steps — follow the doc's own "Re-opening the grill loop (procedure)" section:

  1. Read docs/plans/architectural-deepening-grill.md in full — especially "Candidate #5 —
     Asset-tracking / editor-state rename (deferred)", the rejected-design history, the
     leave-alone verdicts, and the friction-undercount lessons. If that file, CONTEXT.md, or
     any docs/adr/* is missing from the tree, HALT — do not re-create docs.
  2. Invoke the improve-codebase-architecture skill.
  3. Re-walk the post-#134 reality first — do NOT design from the doc's pre-#4 framing (doc
     itself warns it may be obsolete). Read app/lib/content-items.ts and
     app/lib/content-item-editor-lifecycle.ts as they exist NOW. Grep for the leftover
     surface: orphan-detection helpers, FormData builder, normalisation helpers,
     encodeTusMetadataValue. Every prior grill undercounted friction — grep before designing.
  4. Run the deletion test on what remains. Then decide:
     a. Still two tangled concerns with real friction → lock a candidate: draft 3 design
        shapes spanning the design space (interface, impl sketch, test strategy, call-site
        before/after, depth/locality/leverage tradeoffs), then grill me with multi-option
        questions until locked. Slice into tracer-bullet issues via the to-issues skill
        (labels: enhancement,ready-for-agent).
     b. Too small to justify a grill → mark candidate #5 dead in the doc with one sentence
        of real reasoning. No issues, no ADR.
  5. Either way, write back to architectural-deepening-grill.md: new dated session delta +
     update the deferred-candidate state. While there, trim the stale "Start here" /
     implementation-order section (all #126–#135 shipped) — keep rejected-design history,
     leave-alone verdicts, and the re-open procedure.
  6. CONTEXT.md only if a new DOMAIN term emerged (helper names don't count). ADR only if
     real re-litigation risk — never fabricate rationale.
  7. Constraints: ~/ imports only, no any/!/as casts. Before done: bun typecheck THEN
     bun run test:run — sequential, never parallel (Windows jsdom false-timeout). Commit
     conventional + gitmoji on resolve-issues; do not open a staging PR unless I ask.
		```
	- [ ] Re-run the grading prompt
	- [ ] Optimize `CLAUDE.md` & `BACKLOG.md` once again with Opus Max based on the new architecture.
	- [ ] Update the master `README.md` (with the `/understand` skill) to give an overview of how to navigate around the codebase, which skills to use when encountering a bug and to create new features. Export an html file to visualize it
	- [ ] Setup CI/CD workflow
	- [ ] Set up YOUR bank account (MBBank or BIDV) for PayOS Prod