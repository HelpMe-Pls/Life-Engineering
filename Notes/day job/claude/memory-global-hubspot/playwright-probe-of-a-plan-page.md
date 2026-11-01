---
name: playwright-probe-of-a-plan-page
description: "Driving a /plans page in Playwright: serve it from a fake HTTPS origin (crypto.randomUUID needs a secure context), and observe a beforeunload prompt by NAVIGATING, never by page.close({runBeforeUnload}) — that probe is vacuous"
metadata:
  node_type: memory
  type: reference
  originSessionId: 185ff87d-a6b2-4241-990b-e83a359c4ebf
  modified: 2026-10-13T02:27:51.738Z
---

Measured 2026-10-13 on Playwright's Chromium 149, adding the over-limit note and the leave prompt to `/plans/member-renewal.html` (#1092).

- **Fake the origin over HTTPS.** Serve the page with `page.route('**/*')` from `https://plan.test/…`, with its answers API fulfilled in the same route. Over `http://` the page's script dies on its first line, because `crypto.randomUUID()` exists only in a secure context, and the answer boxes simply stay disabled with no error shown. `file://` fails too, because the API fetch fails.
- **A beforeunload probe through `page.close({ runBeforeUnload: true })` never fires the `dialog` event**, headless or headed, even on a page whose handler blocks every close. Calibrate first: an always-block page must say "asks". Navigation is a probe that works: `page.goto('https://plan.test/elsewhere', { timeout: 3000 }).catch(() => {})` with a `page.on('dialog')` listener. Chromium also needs a real gesture first (a `click` and `keyboard.type`).
- **`keyboard.insertText` is a real paste**, so it obeys `maxlength`. `fill()` and setting `el.value` in `evaluate()` do not. Use `insertText` to show what a reader's paste does.
- jsdom page tests run the page's scripts once per `open()`, so their `document`/`window` listeners pile up across tests. An event dispatched in a later test reaches earlier tests' boxes too. Assert only on this test's own data, such as "no post contains this 5,001-character answer".

Related: [[probe-script-can-be-vacuous-print-the-shape-first]], [[local-browser-verify-recipe]], [[plans-pages-must-be-prettier-formatted]].
