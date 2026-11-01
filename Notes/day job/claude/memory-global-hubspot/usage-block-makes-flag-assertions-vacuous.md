---
name: usage-block-makes-flag-assertions-vacuous
description: "An error message that appends a USAGE block makes `expect(msg).toContain('--flag')` pass for EVERY input — assert the reason's first line; and a regex guard's false positives are invisible to a suite whose subject is clean"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 41999a4d-6108-4b2a-ba11-eb6c9739c783
  modified: 2026-08-10T17:29:52.855Z
---

**Two vacuity traps found in my own new guards during the #477 review (2026-08-10/11), both proven by mutation.**

**1. A refusal that appends USAGE poisons every assertion made against the whole message.** `scripts/send-onboarding-note.ts` ends each refusal with `\n\n${USAGE}`, and USAGE lists *every* flag plus an example address. So `expect(parsed.error).toContain('--bcc')` passes for **any** refusal at all — including one that names the WRONG flag, which is exactly the mix-up the assertion looks like it covers. `toContain('a@')` was vacuous too, off USAGE's own `"Name <a@b.co>"` example.

**Proof:** patch the guard to always report `--from-name`. Whole-message assertions stayed **green**; first-line assertions failed. **How to apply:** assert on `error.split('\n')[0]` — the reason without USAGE — via one module-scope helper, and keep the reason text free of other flag names (a message that enumerates consequences per flag re-creates the hole). The one test that must NOT use that helper is the one asserting USAGE is *present*.

**2. A source-text guard's FALSE POSITIVES are invisible to the suite.** A test asserting `lib/auth/email.ts` declares no imports (so a plain `npx tsx` script can load it — vitest aliases `server-only` to a stub, so the real breakage is CI-green) was widened to catch `require()` / dynamic `import()` / `export … from`. The widened pattern then matched **5 of 6 innocent shapes**, including `import type {…}`, which tsx erases and therefore cannot break anything. The suite never noticed, because the subject file imports nothing either way.

Then loosening `\s+`→`\s*` to catch `import{x}from'y'` **broke the `type` exclusion**, because the pattern could backtrack around the lookahead. Fix: anchor the lookahead to the keyword — `import(?!\s+type\b)` — and require a quote after `from`. **How to apply:** a pattern-based guard needs its own probe over a labelled table of should-trip / should-not-trip strings, run outside the suite. Prefer false positives to false negatives and *say so* in the comment: a false positive fails loudly and costs a minute; a false negative is the silent breakage the guard exists to prevent. See [[recurring-bug-class-needs-enumeration]], [[test-suite-clean-minimal-standard]].
