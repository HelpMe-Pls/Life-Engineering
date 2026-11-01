---
name: plans-pages-must-be-prettier-formatted
description: "Since 2026-10-12, the HTML pages in website/public/plans/ are in Prettier's scope, so the gate's FIRST step (format:check) rejects a page copied in unformatted. Format it with the website's config before every push"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 0d779df9-8277-4d97-8cf1-0b46d3755924
  modified: 2026-10-12T11:57:34.980Z
---

On 2026-10-12 the operator found VS Code's Prettier saying "File is ignored, skipping" on save for every page in `website/public/plans/`. The cause: a bare `public/` in `website/.prettierignore` (meant for the logos and the spreadsheet template) also covered the hand-written plan pages. The fix (#1085, merged into `dev` on 12 Oct) ignores `public/*` and re-includes `!public/plans/`. ⚠ `public/` plus `!public/plans/` does NOT work: an ignore file cannot re-include a file whose parent folder is excluded (measured with `getFileInfo`). `tests/prettier-formats-plan-pages.test.ts` asks Prettier the editor's question for every page, but it is Vitest, so it runs only by hand.

**The consequence the operator asked me to remember:** every page in that folder is now checked by `npm run format:check`. That check is the FIRST step of `.githooks/pre-push` and of `ci.yml`, so an unformatted page fails the push within seconds (a side agent's note said "at the end of the 5 minutes", which is wrong). A page copied in from `~/Documents/Edge8/Scopes/` or pasted from elsewhere is usually formatted with Prettier's defaults (double quotes, 80 columns). The website's config is different (single quotes, no semicolons, 90 columns, from `website/.prettierrc.json`), so the copy fails until it is reformatted.

**Why:** the operator wants format-on-save for these pages, and the gate must stay green. Formatting is safe for what readers see: on 12 Oct, all three pages were pixel-identical at 1280 px and 390 px before and after the reformat, and the pixel comparison did catch a one-unit colour change.

**How to apply:**
- After copying a page into `website/public/plans/`, format it before you commit: `node <repo>/website/node_modules/prettier/bin/prettier.cjs --write <repo>/website/public/plans/<name>.html` (absolute paths, no `cd`). Then run `npm --prefix <repo>/website run format:check` and read "All matched files use Prettier code style!". The operator's way: open the page in the editor and save it once.
- ⚠ **Prettier reads `.prettierignore` from the directory it RUNS in, not from the file's folder.** Run from the repo root, it applies no ignore file at all: on 12 Oct a `--write` that named `website/lib/db/database.types.ts` (ignored on purpose, it is generated) rewrote 429 of its lines. Measured: from the root, `--check` on that file warns, and with `--ignore-path <repo>/website/.prettierignore` it passes. So pass that `--ignore-path` on every root-level run, and after a `--write` read `git diff --stat` before staging.
- The repo copy then differs byte for byte from its source in the Scopes folder. Compare them by rendering (visible text and a screenshot), not with `cmp`. The page's inline script also changes style (single quotes, no semicolons).
- When the operator edits the source scope again, the site keeps the old copy until the repo copy is replaced and reformatted.

Related: [[prettier-scope-is-website-only]] (docs/ is still outside Prettier), [[reader-facing-two-minute-skim]] (the Member Renewal scope is served as /plans/member-renewal.html).
