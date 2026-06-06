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
### 1/6
- [x] EO: Wrap up the Altai sync to fill in the segments
- [x] EP: Close #127
- [x] MDW++
- [x] Live up to your standards
### 2/6
- [x] EO weekly report & sprint goals update
	- [x] Verify the Altai → HubSpot wf to include mkt props
	- [x] Remind them about the Altai prod keys & what to not touch in HubSpot prod
- [x] EP: Wave 2++
- [x] MDW++
- [x] Live up to your standards
### 3/6
- [x] EO Global sprint review
	- [x] Offline
	- [x] Migrate the sandbox mkt-related data structure to prod
- [x] EP: wave 3
- [x] MDW++
- [x] Live up to your standards
### 4/6
- [x] EO minimal work: `global-hubspot` dev (create a master plan)
- [x] EP: clean up + review the draft PR
- [x] MDW++
- [x] Live up to your standards
### 5/6
- [x] EO minimal work: close ALL open issues (except for #21)
	- [x] Request Altai prod access for the rest of the team
	- [x] Merge #15 into `dev`
- [x] Bragdoc
- [x] EP: next
- [x] MDW++
- [x] Live up to your standards
### 6/6
- [x] Perfect dive start + 500m with paddles
- [x] Groceries
- [x] Clean the mousepad & blanket & bathroom
- [x] EP++
- [x] MDW++
- [x] Live up to your standards
### 7/6
- [ ] EP++: resolve [backlog](#backlog)
- [ ] Antifragile note
- [ ] Weekly planning
- [ ] Live up to your standards

---
# Backlog
- [Learn about animations](https://animations.dev/learn/animation-theory/intro)
- [Learn to be an AI Engineer](https://www.aihero.dev/ai-engineer-roadmap)
- [Learn MCP](https://www.aihero.dev/model-context-protocol-tutorial)
- [Learn TS](https://www.totaltypescript.com/workshops/typescript-pro-essentials/types-you-don't-control/configuring-the-lib-compiler-option)
- EO:
	- [ ] Altai ⇌ HubSpot prod: finish the mkt sync
	- [ ] Resolve conflicts and merge #22
	- [ ] Install `mattpocock` skills on the repo and run `/tdd` once you're done with the issues
	- [ ] Refresh `README.md` by using the `/understand` skill
	- [ ] Extract the general rules from `file.md` for `global-hubspot`
	- [ ] Setup CI/CD workflow
- EP: 
	- [x] Optimize `CLAUDE.md` with Opus Max & `/react-router-framework-mode` skill + antifragile software architecture conventions
	- [x] E2E test setup for happy paths (paths that are critical to the core features of the app). No flaky, noisy, and implementation detail tests. Tests must be meaningful and guarantee no regressions for any code change. Refresh the skills from source before calling them.	
	- [ ] How many CCU (approximately) can the app withstand before noticeable perf degradation shows up? Maybe set up a `k6/artillery` run against staging with the two profiles that matter — steady learning (nav + complete-lesson) and checkout burst?
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