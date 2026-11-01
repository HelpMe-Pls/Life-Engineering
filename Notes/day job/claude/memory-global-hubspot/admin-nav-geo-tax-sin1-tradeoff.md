---
name: admin-nav-geo-tax-sin1-tradeoff
description: PERF-ADMIN-NAV
metadata: 
  node_type: memory
  type: project
  originSessionId: af337776-62e8-4f9e-ac26-268b65c6571d
---

After PERF-ADMIN-NAV (#199) pinned Vercel functions to `sin1` (co-located with the Singapore Supabase project — see [[prod-region-topology-iad1-vs-sin]]), `/admin` navigation is genuinely slower for EU/US users than for Asia. Measured live prod (globalping, warm HTTP TTFB against `/login`, 3 hits each, 2026-07-07):

- Vietnam (operators) ≈ 123ms (steady 124/123/124) · Singapore ≈ 69ms · **Amsterdam ≈ 229ms (~1.9×)** · **US/Buffalo ≈ 282ms (~2.3×)**.

**This is EXPECTED, not a bug.** The 3 serial Supabase auth legs (proxy `getUser` in `lib/supabase/middleware.ts:44`; layout `requireAdmin`+`getRole` → one `getUser` + one `profiles` select, collapsed by React `cache()` in `lib/auth/guards.ts:37`) are now intra-Singapore (~single-digit ms function↔DB). The residual per-nav cost is the browser→`sin1`→back hop = pure geography. #199 correctly optimized for the operators (in VN); it shifted the tax onto EU/US, and the real `/admin` page amplifies it vs `/login` because it pays the full serial-leg chain.

**Ping RTT is a red herring here:** ICMP ping to the domain returns ~1ms from EU because Vercel's edge terminates TLS at a local PoP; the real signal is HTTP `firstByte` (edge→`sin1` fn→Supabase→back). Use warm TTFB, not ping, to measure this.

**Fix levers chosen (stakeholder, 2026-07-07):** (1) cut auth legs via `getClaims()` local JWT verify + fold role into claims — see [[supabase-getclaims-available-despite-ssr-pin]]; (2) perceived-speed polish (loading shell already prefetches per `app/admin/loading.tsx`). Rejected: multi-region read replicas (overkill for a tiny trusted admin pool). Plan doc: `docs/plans/PERF-ADMIN-NAV-GLOBAL.md`.
