---
name: decoy-must-sit-between-winner-and-boundary
description: "In a 'newest/best wins' rule guarded by a second filter, an EXTREME decoy value is vacuous — it loses to the winner on the first rule anyway, so removing the second filter changes nothing; the decoy must sit BETWEEN the legitimate winner and the boundary"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: dd0580fc-e773-4808-aa7c-f4ba9ede96a6
  modified: 2026-09-03T13:11:03.490Z
---

Strengthening `display-name-fill-live.test.ts` (PR #839). The fill selects with two filters — `.eq('status','approved')` and `.lt('created_at', user.created_at)` — and then applies `newestNamedRequestByEmail` (newest-with-a-name wins).

I first planted the adversary row at a round `2020-01-01`. It looked like the strongest possible attack. **It was a decoration:** even with `.eq('status','approved')` deleted, the candidate set becomes `{legitimate row (dated now-ish), planted row (2020)}` and *newest wins* still answers the legitimate row. The test passes with or without the filter it exists to justify.

**The decoy has to be able to WIN.** Placed one millisecond before the account's `created_at`, it is newer than the legitimate row and still older than the account — the only position from which removing the status filter changes the answer. Computed from the fixture, not typed:

```ts
const { data: born } = await svc.auth.admin.getUserById(userId)
const justBefore = new Date(new Date(born.user.created_at).getTime() - 1).toISOString()
```

Observed red with `.eq('status','approved')` removed: the account is named `Backdated Stranger`.

**The rule:** when several filters feed one selection rule, ask *for each filter separately* "what value would win if this filter were gone?" and seed that. An extreme value usually loses on some other axis, which is exactly why it feels safe to write and proves nothing. This is a sibling of the repo's own trap that a fixture meaning "not the default" must be asserted to DIFFER from the default rather than merely be far from it.

Corollary that also bit here: a decoy the **app itself** wrote is weaker than the schema permits. Insert it through the genuinely anonymous client, and assert the insert succeeded — a positive control on the adversary, so the test says "the attack no longer exists, re-derive it" instead of quietly seeding nothing.

Related: [[status-word-is-not-evidence-tie-to-origin]], [[vacuous-guard-shapes-found-by-audit]], [[locate-by-ordering-is-steerable-mint-the-id]].
