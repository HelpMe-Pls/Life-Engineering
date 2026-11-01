---
name: locate-by-ordering-is-steerable-mint-the-id
description: "When RLS stops an insert returning its own row, do NOT find it again by ordering — a stranger who can write the ordering column picks which row you act on; mint the id client-side, insert it, and address that. Measured in submitSignupRequest, PR #839"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: dd0580fc-e773-4808-aa7c-f4ba9ede96a6
  modified: 2026-09-03T13:10:47.376Z
---

`submitSignupRequest` inserts a `signup_requests` row through the **anon** client, which under RLS cannot `.select()` the row back. It then located the row to auto-approve as *the newest pending row for this email*:

```ts
.eq('email', email).eq('status', 'pending')
.order('created_at', { ascending: false }).limit(1).single()
```

**That lookup is an attacker-chosen input.** `created_at` is not server-stamped: `0041` grants `all privileges` on the table to `anon`, and `0008`'s anon-insert `with check` constrains only `status`, `reviewed_at`, `reviewed_by`. So a stranger POSTs a pending row for a target's address with `created_at` a year in the future; when the real person submits the form, the approval loads **the planted row**. Since #830/#831 that row's `name` becomes the account's display name and its `notes` the account's internal note — both effectively permanent.

**The fix is to stop looking.** `crypto.randomUUID()` before the insert, `id` in the insert payload, approve that id. No ordering is consulted at all, and it retires the same-instant TOCTOU the old comment had accepted as benign. The row you act on is the row you wrote — the only version of that guarantee that does not depend on another writer's manners.

**Generalise:** an insert you cannot read back is a *correlation* problem, and every correlation key that is not yours (a timestamp, "the newest", "the only pending one", a natural key) is steerable by anyone who can write it. Mint the key.

**Two things this taught about proving it:**

- **A mocked test cannot see an ordering defect.** `request-access-submit.test.ts` faked the chain with `order: () => builder, limit: () => builder` — the mock answers whatever is asked, so the wrong `.order()` was invisible. The guard has to be live. The right repair was to **delete those two stubs**, so a re-introduced ordering read now throws `builder.order is not a function` there instead of passing quietly.
- **PostgREST answers 204 for a zero-row UPDATE exactly as for a real one.** "anon PATCH returned 204" proves nothing; the assertion needs a positive control — the identical PATCH under a role that IS allowed must land. Without it a wrong column name reads as "the door is shut".

Related: [[status-word-is-not-evidence-tie-to-origin]], [[gate-evidence-set-must-match-write-paths]], [[decoy-must-sit-between-winner-and-boundary]].
