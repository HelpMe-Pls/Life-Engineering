# Memory Index

One line per memory; the detail lives in the linked file. Keep it that way.

**Answering the user**
- ⚠ [How-it-works or an all-caps EXACTLY: ONE plain line](how-it-works-answer-in-one-plain-line.md) — STANDING; the rule lives in the vault's Answer style
- ⚠ [Deliverables stay LOCAL; HTML text fills the FULL row](deliverables-stay-local-full-width.md) — STANDING; path in the reply
- ⚠ [Reader-facing docs: a 2-MINUTE skim, the Edge8 layer](reader-facing-two-minute-skim.md) — STANDING; the exemplars to copy
- ⚠ [`paste-ready` = BLUE inline spans, one per paragraph, never a fence](paste-ready-is-blue-inline-spans.md) — STANDING
- ⚠ [A deliverable asked for mid-turn goes in the FINAL reply, and in a file](deliverable-asked-mid-turn-goes-in-final-reply.md) — text between tool calls gets missed
- [Sprint AFK Setup Prompt: paste after each sprint review](sprint-afk-setup-prompt.md) — vault Notes/Daily Standup.md; rule 6 writes the AFK Session Report

**Auth**
- [A Next LAYOUT is not an auth chokepoint](layout-is-not-an-auth-chokepoint.md) — skipped on client navs, WINS on a hard nav
- [A fail-closed gate on a NEW column needs a 42703 escape](fail-closed-gate-needs-a-42703-escape.md)
- [A verified token proves WHO, never WHAT-THEY-MAY-DO](verified-token-proves-who-not-what-they-may-do.md) — authorize off `profiles`
- [A "Forgot password" link is SPENT by the first GET](reset-link-is-spent-by-the-first-get.md) — AUTH-SAFELINK
- [An emailed auth token must be minted AFTER every PASSWORD/CONFIRM write](emailed-auth-token-must-be-minted-last.md)
- [An email's claim must hold for EVERY mode of the pipeline that sends it](email-claim-must-hold-for-every-pipeline-mode.md)
- [A GoTrue INVITE does not bounce off an UNCONFIRMED account](gotrue-invite-does-not-bounce-an-unconfirmed-account.md)
- [`new URL()` normalises encoded dot segments](url-normalises-encoded-dot-segments.md) — parse, never two-dot check
- Gates: [widening a SET can disarm an unstated gate](widening-a-set-can-disarm-an-unstated-gate.md) · ["has a HUMAN decided?" must enumerate every WRITE PATH](gate-evidence-set-must-match-write-paths.md)
- Evidence: [refusal AFTER a side effect needs its OWN reason word](refusal-after-a-side-effect-needs-its-own-reason-word.md) · [a STATUS WORD is evidence only if a stranger cannot cause it](status-word-is-not-evidence-tie-to-origin.md) · [MINT the id, never re-find it by ordering](locate-by-ordering-is-steerable-mint-the-id.md)

**Audit rows and operator SQL**
- [A row that STOPS an act is safe BEFORE it; one that ENABLES is not](audit-row-order-stops-vs-enables.md) · [An audit row can become an INPUT](audit-row-becomes-load-bearing-input.md) — pruning the log changes behaviour
- [A rollback keyed on a NULL column narrows SILENTLY](runbook-rollback-sql-must-be-executed.md) · [The dashboard SQL editor RECONNECTS between statements](dashboard-sql-editor-reconnects-per-statement.md)
- [A migration's RECEIPT is its LAST statement](migration-receipt-is-the-last-statement.md) · [A CTAS backup table in `public` is granted to ANON](ctas-backup-table-inherits-anon-grant.md)

**Supabase**
- [Supabase MCP OAuth broken](supabase-mcp-oauth-broken.md) · [ssr generic skew](supabase-ssr-supabasejs-generic-skew.md) · [getClaims works despite the pin](supabase-getclaims-available-despite-ssr-pin.md)
- [RLS read paths that LOOK protected and aren't](supabase-rls-read-path-traps.md) · [chapters = admin-only writes](chapters-rls-admin-only-write-service-role-touch.md)
- [A CLI bump moves the IMAGES and gen types, zero repo diff](supabase-cli-bump-moves-images-and-gentypes.md) — verify by RESTARTING
- [E2E/CI local-Supabase prod safety](e2e-cicd-local-supabase-prod-safety.md) — local runs hit PROD unless env points
- [Mailpit NEVER shows app email](mailpit-never-shows-app-email.md) — local dev holds a LIVE key
- [Local browser-verify recipe](local-browser-verify-recipe.md) — db reset → seed → `next dev` → Playwright

**React / Next / rendering**
- [Next's post-revalidatePath navigation DROPS (~12%)](rsc-navigation-drops-so-server-prop-only-cells-go-stale.md) · [A trailing `router.refresh()` is the MITIGATION](trailing-refresh-is-mitigation-not-duplicate.md) (#1016)
- [Async-transition state defers until settle](async-transition-state-defers-until-settle.md) — busy updates must be URGENT
- [Next 16 gives a server component NO pathname](next16-gives-server-components-no-pathname.md) — `website/proxy.ts` exists · [Next 16 split cache invalidation](next16-updatetag-vs-revalidatetag.md) — `revalidateTag` serves the OLD value
- [`server-only` means "inside the RSC graph"](server-only-means-rsc-graph-not-server.md) · [Stale .next validator breaks typecheck after a branch switch](next-types-validator-stale-after-branch-switch.md)

**UI and theme**
- [/admin UI taste rules: never colour chrome](admin-ui-colour-and-chrome-taste-rules.md) — STANDING
- [A contrast guard that measures only INK reports a healthy surface](contrast-guard-must-measure-fill-not-only-ink.md)
- [`truncate` clips italic INK](truncate-clips-italic-ink-not-layout.md) · [`sr-only` loses its padding reset](sr-only-loses-its-padding-reset-to-a-bare-utility.md)
- [HSL lightness is NOT luminance](hsl-lightness-is-not-luminance-use-oklch.md) — use `oklch()`
- [/admin dark theme: alpha utilities NOT remapped](admin-dark-theme-alpha-utilities-not-remapped.md) · [`table-fixed` vs auto is a REAL trade](column-resize-test-must-narrow-not-widen.md)
- [Popovers in an /admin card must portal](popover-inside-overflow-hidden-card-must-portal.md) · [An HTML entity in JSX text eats the space IN FRONT of it](jsx-entity-eats-the-leading-space.md) — SWC only

**Tests and guards**
- [Test suite clean & minimal standard](test-suite-clean-minimal-standard.md) — STANDING; "can this assertion fail?"
- [A shared helper's contract belongs at its OWN seam](shared-helper-contract-belongs-at-its-own-seam.md) · [A guard whose ROOT is a folder covers less than it claims](guard-root-narrower-than-surface.md)
- [A recurring bug CLASS wants enumeration](recurring-bug-class-needs-enumeration.md) — inputs × degenerate forms · [A decoy must sit BETWEEN the winner and the boundary](decoy-must-sit-between-winner-and-boundary.md)
- [Two gates on one defence need TWO tests](two-gates-need-two-tests-stronger-masks-weaker.md)
- Vacuity: [a mutation is a hypothesis](mutation-is-a-hypothesis-read-the-source-back.md) · [mutate my OWN guard, one per CLAUSE](mutation-proof-my-own-guard-before-committing.md) · [16 vacuous-guard shapes](vacuous-guard-shapes-found-by-audit.md) · [a RED RECIPE is a hypothesis](red-recipe-is-a-hypothesis.md) · [a PROBE script can be vacuous](probe-script-can-be-vacuous-print-the-shape-first.md)
- Matchers that lie: [USAGE block passes `toContain('--flag')`](usage-block-makes-flag-assertions-vacuous.md) · [`not.toHaveBeenCalled()` without the IMPORT](negative-spy-passes-without-the-import.md) · [jsdom `a[href]` misses a percent-encoded href](jsdom-attribute-selector-fails-on-percent-encoded-href.md)
- [A relative href on a slashless index resolves one level UP](relative-href-at-slashless-base-resolves-to-root.md) — the root at `/x`, `/admin/` at `/admin/meetings`
- Un-saying: [a settled decision, in BOTH places](settled-decision-must-be-unsaid-in-both-places.md) · [changing an invariant means grepping the SENTENCE](changing-an-invariant-means-grepping-the-sentence.md)
- [A 🧑 fork's JOURNEY must be traced through the real caller](fork-journey-must-be-traced-through-the-real-caller.md)
- [A report that names its own FIX must be measured first](report-that-names-its-own-fix-must-be-measured.md) · ["X must never reach this audience" is a FETCH assertion](payload-boundary-asserted-on-fetch-not-render.md)
- [A verifier fleet reads the WORKING TREE](verifier-fleet-leaves-source-mutations.md) · [Asserting `session.user` cannot prove a token refresh](session-user-assertion-cannot-prove-a-refresh.md)
- [Playwright on a /plans page: HTTPS fake origin; probe beforeunload by NAVIGATING](playwright-probe-of-a-plan-page.md)
- [A drag in a SCROLLABLE panel flakes: dnd-kit auto-scroll](dnd-kit-autoscroll-flakes-a-drag-in-a-scrollable-panel.md) — tall viewport + assert no scroll
- Hydration: [a `fill()` before hydration is DISCARDED](playwright-fill-lost-to-hydration.md) · [a pre-hydration CLICK is a native GET submit](pre-hydration-click-is-a-native-get-submit.md)
- E2E/Vitest env: [late-session red = local-DB drift](e2e-red-after-long-session-is-local-db-drift.md) · [`ensure*` resets the shared password](e2e-shared-admin-password-reset-breaks-sessions.md) · [a restore cannot undo a KILLED run](e2e-restore-cannot-undo-a-killed-run.md) · [live suites in CI via `loadEnv`](vitest-live-suites-run-in-ci-loadenv.md) · [check the worker count](e2e-ci-single-worker-runner-constraint.md)

**Git, PRs and CI**
- [Policy guardrails in this repo](policy-guardrails-this-repo.md) — no direct dev pushes
- ⚠ [`gh pr merge` takes a LITERAL number, in its OWN call](pr-merge-needs-a-literal-number.md) — STANDING; a `$n` makes pr-merge-gate PROMPT
- [PR merge gate by type](pr-merge-gate-check-by-type.md) · ⚠ [Close-out: ONLY main+dev; `-D` merged branches unasked](close-out-branches-only-main-dev.md) · [Promotion merge convention](promotion-merge-convention.md)
- ⚠ [Never add card or sprint words or numbers to a repository](no-sprint-or-card-words-in-repos.md) — STANDING (2026-10-14)
- [Branch protection ENFORCED](branch-protection-needs-github-team.md) — strict-up-to-date SERIALISES merges
- [A Vercel env write by an agent](vercel-env-write-by-agent-recipe.md) — non-secret only; never `env pull`
- [The classifier denies repo-SETTINGS writes](classifier-denies-repo-settings-writes.md) — a hard wall
- [Auto mode judged this repo against the SIBLING repo's profile](automode-profile-described-the-wrong-repo.md)
- [gh account for this repo](gh-account-kh0ile-env-token.md) — `env -u GH_TOKEN` + Kh0iLe keyring
- [Issue/PR bodies use FULL-WIDTH lines](issue-bodies-full-width-lines.md)
- [A long pre-push hook lets the SSH connection DIE](long-pre-push-hook-drops-ssh.md) — verify with `ls-remote`
- [gh pr merge skips LOCAL housekeeping](gh-pr-merge-dirty-worktree.md) · [close-out re-check + Node 24](closeout-recheck-commit-and-node24.md)
- [Screenshots in a PR body from the CLI](pr-body-screenshots-via-branch-commit.md)
- [Stacked PRs: retarget children BEFORE merging the parent](stacked-pr-merge-order-closes-children.md)
- [A STATE sentence goes false the moment you act](state-sentences-go-false-when-you-act.md) — keep next-steps MINIMAL · [next-steps.md is edited in parallel — sync first](next-steps-parallel-edits-sync-first.md)
- [Deployed-smoke BASE_URL + proving a deploy is live](deployed-smoke-baseurl-and-prod-marker.md) · [promotion #404 + the doc-sweep lesson](promotion-404-shipped-prod-current.md)
- CI reds: [502 = edge_runtime](ci-gate-502-edge-runtime-analytics.md) · [google-font fetch](ci-e2e-webserver-google-font-fetch-flake.md) · [port 54324 bind](ci-hermetic-supabase-port-flake.md) · [ECR pull limit](ci-supabase-start-ecr-pull-rate-limit.md)

**Environment and tooling**
- [Credential checks: an operator-run WIZARD outside the repo](credential-checks-via-operator-run-wizard.md)
- [Sprint Tickets pages save their own statuses](sprint-tickets-html-pages.md) — jsdom only
- [A PreToolUse DENY hook stops `cd` prompts breaking AFK runs](pretooluse-deny-hook-kills-cd-prompts.md) — type NO `cd`
- [don't-ask mode denies `cd`, `VAR=x cmd`, grep/cat/wc](dont-ask-mode-shell-workarounds.md)
- [A patch script's needle must be ASSERTED, CRLF stripped first](patch-script-needle-must-be-asserted.md)
- Windows/MSYS: [every heredoc form hangs git commit](git-commit-heredoc-hangs-windows.md) — `commit -F` · [`git show rev:path` is MANGLED](git-rev-path-mangled-by-msys.md)
- [The Grep tool SKIPS `.claude/`](grep-tool-skips-dot-claude.md) · [Write/Edit turn escape TEXT into the literal character](write-edit-normalise-unicode-escapes.md) — and heredocs halve backslashes
- [A junctioned worktree cannot run `next build`](worktree-junction-breaks-turbopack-build.md) — push from the main clone
- [Workflow agent cap](workflow-agent-cap-69-target-15.md) — STANDING: max 5
- [A reaped task wrapper EPIPEs a surviving dev server](backgrounded-server-epipe-kills-render-worker.md)
- [Next 16: build runs BESIDE a live dev; a second dev in the folder is REFUSED](next16-build-beside-dev-but-one-dev-per-folder.md) — 🔧 2's "build kills dev" is stale
- Silent subagents: [a NAMED teammate never delivers](named-teammates-never-deliver-their-report.md) · [backgrounded subagents hang or return NOTHING](background-workflow-shell-hang.md) · [a DEAD workflow agent reads as a CLEAN BILL](workflow-dead-agent-reads-as-clean-bill.md)
- [Review round N+1's findings come from round N's FIXES](review-round-n-plus-one-comes-from-round-n.md) — never stop on the first clean round
- [An empty fix-focused round may have read ONLY the last fix](fix-focused-review-rounds-read-only-the-last-fix.md) — confirm with a fresh whole-PR round
- [A surface sweep misses the one that PERSISTS](surface-sweep-misses-the-one-that-persists.md)
- [Refutation runs BOTH ways](refutation-runs-both-ways.md) — a finding is evidence, not a verdict
- [A running node.exe image blocks `fnm uninstall`](running-node-image-blocks-fnm-uninstall.md) · [`fnm exec` on Windows needs `npm.cmd`](fnm-exec-needs-npm-cmd-on-windows.md)
- [Verify running branch before diagnosing](verify-running-branch-before-diagnosing.md)
- [Prettier stops at website/](prettier-scope-is-website-only.md) — docs/ has no formatter contract
- ⚠ [Pages in website/public/plans/ must be Prettier-formatted before a push](plans-pages-must-be-prettier-formatted.md) — format:check runs first
- Skills/plugins: [project-scope plugin install rewrites settings](plugin-install-project-scope-reorders-settings.md) · [skills churn is a local artifact](skills-churn-is-local-windows-artifact.md) · [Pocock skills installation](pocock-skills-installation.md) · [built-in skills live inside claude.exe](builtin-skills-live-inside-claude-exe.md)
- ⚠ [A slug-derived `readFile` traces the WHOLE project](turbopack-traces-whole-project-on-slug-read.md) — the build only WARNS
- [Prod region iad1→sin1](prod-region-topology-iad1-vs-sin.md) · [/admin geo-tax](admin-nav-geo-tax-sin1-tradeoff.md) · [canonical domain](canonical-domain-eochapterhubspotrollout.md)
- [HubSpot connector: custom objects need a RECONNECT](hubspot-connector-custom-objects-and-altai-key.md) — offer `!`
- [Sentry is scaffolded but NEVER integrated](sentry-scaffolded-but-never-integrated.md) · [Prod runtime logs via `vercel logs`, AFTER the action](prod-runtime-logs-via-vercel-cli-scope-eo-global.md)
- ⚠ [Claude in Chrome runs in EDGE here; never start chrome.exe](chrome-extension-not-connected-means-chrome-not-running.md) — STANDING; "not connected" → check msedge
- [A claude.ai/design share link: read it whole through the page's own GetFile, save an exact copy](claude-design-share-link-read-recipe.md) — the canvas iframe is cross-origin
- ⚠ [Repo scripts from another cwd: pinned tsx.cmd + --tsconfig + --env-file; npm exec --prefix does NOT change cwd](run-repo-scripts-from-outside-their-folder.md) — Git Bash eats bare backslashes
- [The MINIMAL gate is the WANTED state](minimal-gate-is-the-wanted-state.md) — STANDING; never add a step
- [Gate speed vs Action minutes pull APART](gate-speed-vs-action-minutes.md) · [An OPEN dev→main PR taxes EVERY push to `dev`](open-promotion-pr-taxes-every-dev-push.md)
- Actions: [`administration` is not grantable](workflow-token-cannot-read-administration.md) · [read the BILLING USAGE api](action-minutes-read-billing-usage-not-timing.md)
- Small facts: [Closes #N only closes on main](closes-keyword-needs-manual-close-on-dev.md) · [tick ACs before closing](check-off-acceptance-criteria-before-closing.md) · [rules restructure](rules-restructure-2026-06-11.md) · [context-mode blocks curl-to-stdout](context-mode-blocks-curl-to-stdout.md) · [user-guide DOCX](user-guide-docx-edit-and-verify.md)

**Altai producer**
- [/admin/altai-sync must track the producer repo](altai-sync-producer-contract-discipline.md) — STANDING
- [All Members "Short — needs a look" = a STALE CONSTANT](altai-parity-gate-offset-must-be-measured.md)

**Product decisions**
- ⚠ [The connector cron waits for TWO timed runs on the LIVE database](connector-timed-run-twice.md) — run 1 done (16 s); GitHub's API keys untested till run 2
- ⚠ [EVENTS_API_KEY_ENCRYPTION_KEY is HIDDEN in Vercel; nobody can read it back](events-api-key-encryption-key-hidden.md) — same value in both records
- ["About 20,000 EO members" is SETTLED](twenty-thousand-members-matches-eo-about-page.md) — DEC-EVENTS-ABOUT-20000; never re-ask
- [Triage: ASK before reversing a standing rule](triage-ask-before-reversing-a-standing-rule.md) — grep the DEC catalogue first
- [The audience is the ROLE, not the email domain](audience-is-the-role-not-email-domain.md) (DEC-MEETINGS-AREA)
- [The connector spec never read Nisha's Hivebrite doc](connector-spec-missed-nishas-hivebrite-doc.md) — definition C
- [Events pilot: no Eventbrite chapter had applied](events-pilot-no-eventbrite-applications.md) — re-count first
- [ALL chapter events, MyEO INCLUDED — SETTLED](events-all-chapter-events-myeo-included.md) — read Meetings/ first
- [Dave is the boss](dave-is-the-boss.md) — pitches go to Dave
- ⚠ [`A → B` name answers all point ONE way](name-answers-arrow-direction-is-consistent.md) · [`Sourbutts` is FINAL](sourbutts-is-the-final-name.md)
- [Outbound reply emails: under 350 WORDS](outbound-email-replies-under-350-words.md)
- ["Chapter can't upload" = validation failed](chapter-cannot-upload-usually-means-validation-failed.md)
- [Wave "Unscheduled" = NULL](wave-unscheduled-null-not-zero.md) · [Stalled count = two surfaces](stalled-count-two-surfaces-lesson.md) · [Resend flips status → Active](resend-invite-flips-status-to-active.md) · ["frame is sandboxed" = scanner iframe](update-password-sandboxed-iframe-scanner-error.md) · [Subwave combobox #275](subwave-combobox-dropdown-275.md)
- [Shipped-batch checkpoints and older decision sets](shipped-batch-checkpoints.md) — history; the repo is authoritative
- [A no-PR run's classifier refuses a mid-run PR, even with the operator's OK](classifier-refuses-pr-in-a-no-pr-run.md) — push through the gate, then hand over create + literal merge
