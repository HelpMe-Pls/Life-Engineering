---
name: playwright-fill-lost-to-hydration
description: "A Playwright fill() landing before React hydration is DISCARDED by the controlled input — visible only under parallel load, as one field empty beside a filled one. Fix with a retrying expect(...).toPass block, not fill-then-assert; e2e/fixtures/auth.ts loginViaUI has the same latent bug"
metadata:
  node_type: memory
  type: project
  originSessionId: 1bd16e29-2985-4823-a18e-dc44185afb26
  modified: 2026-08-23T06:52:47.710Z
---

Measured 2026-08-23 while adding the #616 sign-in E2Es.

**The symptom:** a spec that passed every time in isolation failed in the full suite with the **email box EMPTY, the password box FILLED, and "Email is required" on screen**. Two `fill()` calls in a row, and only the second one stuck.

**The cause:** `components/auth/LoginForm.tsx` uses TanStack Form — these are **React-CONTROLLED inputs**. A `fill()` that lands before hydration writes to the DOM, and the component then takes over and throws the value away. Hydration landed *between* the two fills, which is why exactly one survived. It only reproduces under the parallel load of the whole suite, so **passing in isolation proves nothing here.**

**`fill()`-then-assert does not fix it** — `expect(box).toHaveValue(...)` would simply fail instead of flaking. The value has to be re-entered:

```ts
await expect(async () => {
  await emailBox.fill(email)
  await passwordBox.fill(E2E_PASSWORD)
  await expect(emailBox).toHaveValue(email)
  await expect(passwordBox).toHaveValue(E2E_PASSWORD)
}).toPass({ timeout: 15_000 })
```

`expect(...).toPass()` retries the whole block, so a discarded fill is simply re-done once the component is live.

⚠ **`loginViaUI` in `e2e/fixtures/auth.ts` has the same shape and the same latent bug** — two bare `fill()` calls after `page.goto('/login')`. It has not been seen failing (a fresh `goto` gives hydration more slack than arriving via a redirect), but it is the same race. If a spec using it ever flakes on "Email is required", this is why — fix the helper rather than retrying the spec.

⚠ **Do not use `loginViaUI` when the URL carries state you need.** It starts with `page.goto('/login')`, which throws away any `?next=` — the whole thing under test in #616. Fill the form on the page already loaded instead.

⚠ **A screenshot/ARIA snapshot is what diagnoses this.** The error was a URL assertion timeout; the cause was only visible in the attached snapshot showing one field empty and a validation message. Read `test-results/**/error-context.md` before theorising.

Related: [[e2e-ci-single-worker-runner-constraint]], [[layout-is-not-an-auth-chokepoint]], [[async-transition-state-defers-until-settle]].
