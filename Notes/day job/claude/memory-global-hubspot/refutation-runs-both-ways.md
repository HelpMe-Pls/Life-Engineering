---
name: refutation-runs-both-ways
description: A finding fleet over-calls — run a critic whose only job is to attack its own team, and verify the survivors yourself before acting
metadata:
  type: feedback
---

**When N agents each audit one slice, expect a chunk of the findings to be wrong — and budget a critic stage that attacks them.** The repo already records "a refutation is evidence, not a verdict"; the inverse is just as true. **A FINDING is evidence, not a verdict.**

**Measured 2026-09-05.** Eight readers audited one spine section each. All eight returned the most severe verdict (`CONTAINS_FALSE_CLAIMS`) — which is itself the tell. The critic then killed **six**:

- a fix that hard-coded a per-machine absolute path into a shared repo doc;
- three adverb-level edits ("silently" → "with a `console.warn`") that cost characters in a MINIMISATION pass and changed nothing operative;
- a "one owner" claim that measured `readdirSync` when the doc was about *import-derived* surface — measuring the wrong quantity, which is the failure mode the bullet one line away warns about;
- a "13 of 13 rotted" claim that was a category error (a historical result cannot be falsified by today's file).

**And a seventh died on my own check:** the critic quoted `That has happened **four times**` as a stale count to fix. `grep` — it is nowhere in the file. **The critic hallucinates too.** Verify a finding against the artefact before editing, however well-evidenced the report reads.

**Two shapes worth naming:**
- **Over-calling scales with slice count.** One agent per section, each wanting to justify its run, converges on "severe".
- **The critic earns its slot on what it KILLS**, not what it adds. Six bad edits to a file being minimised is worse than the drift they claimed to fix.

**How to apply:** fan out → critic-attacks-team → *I* verify each survivor against the code → apply. Never fan-out → apply. And when a finding contradicts something that is LAW here (`CONTEXT.md`, an operator decision), the law wins unless the finding is verifiable in-repo: one auditor wanted "eight segments" changed on the strength of a producer repo this session cannot read. Related: [[state-sentences-go-false-when-you-act]], [[workflow-dead-agent-reads-as-clean-bill]], [[report-that-names-its-own-fix-must-be-measured]], [[recurring-bug-class-needs-enumeration]].
