---
name: relative-href-at-slashless-base-resolves-to-root
description: "A static HTML index served at /x (no trailing slash) has every relative href resolve against / and 404 at the site root; Next 308s /x/ back to /x so the base can never end in a slash. Shipped as a prod 404 on /sow, 2026-08-27."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: d51a88e4-c9c4-4fe1-af14-0ad115ffa203
  modified: 2026-10-07T07:52:25.045Z
---

An index document served at `/sow` (no trailing slash) linked `href="sow-3-global-approval.html"`. The browser resolved it against the base directory `/`, requested `/sow-3-global-approval.html`, and got the app's 404. Every link on the page was dead in production for ~30 min after #700 (fixed by #701, `57dc082`).

**Why the obvious fix does not exist:** serving the index from `/sow/` is impossible. Next strips trailing slashes and 308s `/sow/` → `/sow`, so the base can never end in a slash. The fix was `withServedLinks()` in `website/lib/sow/documents.ts`: rewrite relative hrefs to absolute `/sow/...` on the way OUT, leaving the on-disk files relative so a saved or emailed copy still works.

**Why every check passed:** the test compared each href STRING to the allowlist, which is also true of a link that 404s. The runtime smoke fetched absolute paths it had computed itself, so no broken link could fail it. Both were vacuous in the same way. The `main` CI gate and the post-deploy smoke also passed with the links dead.

**How to apply:**
- Whenever static HTML is served under a path the document did not know about, RESOLVE each href against the URL it is served at (`new URL(href, origin + servedAt)`) and assert the result is a served path. Never string-match hrefs.
- A smoke that verifies links must START at the entry point and FOLLOW hrefs; fetching a list of computed paths verifies nothing about links.
- Watch for the same trap on any future `/kb`- or `/tutorial`-style route that serves checked-in HTML.
- **It is "one level up", and the root only when the base is one segment deep** (2026-10-07, #1052's brief). From `/admin/meetings`, `href="2026-10-07"` resolves to `/admin/2026-10-07`, not `/`. Say "one level up" in briefs and comments; a reviewer caught the "site root" wording as false for a two-segment base. The rule (root-relative hrefs from a slashless index) is the same. Related: [[recurring-bug-class-needs-enumeration]], [[test-suite-clean-minimal-standard]].
