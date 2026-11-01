---
name: named-teammates-never-deliver-their-report
description: "An Agent spawned WITH a `name` becomes a teammate whose final text never reaches me — silence reads exactly like \"no findings\". Omit the name and the report comes back as the tool result."
metadata: 
  node_type: memory
  type: reference
  originSessionId: 364ea5de-9188-4e83-bc83-49c70d6df1e8
  modified: 2026-09-11T13:18:31.506Z
---

**Measured 2026-09-11.** Six reviewers spawned with `Agent({ name: "authz-adversary", ... })` all ran to completion and all showed `idle` in `ListAgents`. **Not one report arrived.** Their plain text output is not delivered to the parent — a named agent is a *teammate*, and teammates must call `SendMessage` explicitly to say anything. Three rounds of increasingly blunt instructions to call `SendMessage` produced duplicates and truncation (`[result truncated — this drain's results exceeded 16000 characters]`), not a clean report.

**Omitting `name` gives an async subagent whose final response IS the tool result**, delivered in full via a task-notification. Same model, same brief, no plumbing.

**Why it matters more than the inconvenience:** a dead or mute agent is indistinguishable from one that found nothing, and the natural reading of silence is "clean". That is [[workflow-dead-agent-reads-as-clean-bill]] wearing different clothes. On this session the re-run of the same five briefs as unnamed agents returned **five CRITICAL findings** the named fleet had also found and could not deliver.

**How to apply:**

- Default to `Agent({ subagent_type, description, prompt })` with **no `name`** for anything whose output I need.
- Use a `name` only when I genuinely intend a long-lived collaborator I will drive with `SendMessage` — not for a fire-and-report reviewer.
- Never treat an `idle` row, or an absent report, as a clean bill. Re-run it rather than infer.
- Budget for the re-run: the duplicated fleet cost roughly half this session's agent allowance.

Related: [[background-workflow-shell-hang]], [[workflow-agent-cap-69-target-15]], [[refutation-runs-both-ways]].
