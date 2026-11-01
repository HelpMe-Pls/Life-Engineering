---
name: training-module
description: "EO HubSpot self-serve training module — Dave wrote its 5D plan v1.1 himself on 28 Oct 2026 (PDF in Scopes\\Sources); the certificate is very low priority and optional (Khôi); the plan's migration number collides"
metadata:
  node_type: memory
  type: project
  originSessionId: d2c24fba-248d-4698-92ab-401b2ba423fe
  modified: 2026-10-28T05:07:02.157Z
---

Dave wrote the training module's whole 5D plan himself on 28 Oct 2026 (v1.1, decisions closed that day: tracked per person, go-live readiness untouched, videos self-hosted in Supabase, certificate name and logo signed off). Source: `Documents\Edge8\Scopes\Sources\HubSpot Training Module.pdf` (his `docs/plans/training-module-5d.html` was not in the repo on 28 Oct). `Scopes\Scope [Training course].html` holds it in 800 words with Khôi's build order (PR 1 → 2 → 3 → 4, then 2b).

- **Certificate (PR 2b): very low priority, optional** (Khôi, 28 Oct). Built after PR 4, if at all.
  **Why:** his call on his own scope. **How to apply:** keep it out of any chat with Dave, who just signed off its name and logo; if Dave asks, answer with WHEN ("after the board and the Monday job"), never "optional".
- **Migration number:** the plan's `0043_training_people.sql` collides with `0043_golive_exception_byline.sql` on dev; use the next free number (0064 on 28 Oct). Fix it in PR 1, never in chat.
- Sprint 43 Cards 8 (5D plan) and 9 (design and wireframes) predate Dave's plan; Khôi decides what they become.

Related: [[eo-call-2026-10-28]], old-infant-handling (Life-Engineering memory), [[khoi-calls-the-shots]].
