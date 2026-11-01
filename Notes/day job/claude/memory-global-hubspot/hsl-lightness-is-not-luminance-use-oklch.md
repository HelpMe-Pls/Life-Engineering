---
name: hsl-lightness-is-not-luminance-use-oklch
description: "A per-user hashed hue at a fixed hsl() lightness fails WCAG for SOME users only — oklch's L is perceptual and holds the wheel flat. Also: getComputedStyle returns oklch verbatim, so rgba() regexes throw."
metadata:
  node_type: memory
  type: project
  originSessionId: 19790602-4670-4bad-b28c-2a884223ae55
  modified: 2026-07-27T04:18:40.885Z
---

**`hsl()` lightness is not lightness.** At a fixed `hsl(H 58% 38%)` a yellow tint
is roughly twice as luminous as a blue one. Any colour whose HUE is data-driven —
the `/admin` avatar hashes it from the user id (`lib/theme/avatar.ts`) — therefore
has a contrast ratio that varies per user. Measured over the light theme's white
header, the avatar's white letter came out at **3.17:1** for one admin's id and
would have been near 2:1 for a yellow one. **Both fail AA, and neither is visible
unless your own id happens to hash into the bad arc**, which is what makes it ship.

**Use `oklch(L C H / a)` — its L IS perceptual lightness**, so one number holds
the whole wheel. Shipped `oklch(0.37 0.11 H / 0.78)` 2026-07-27; the light-theme
sweep across hues 0/60/120/180/240/300 measured **5.21–6.00** (spread 0.79) where
HSL swung by over 3.

**A single-user measurement is the vacuous version of this test.** The permanent
guard (`e2e/tests/user-config.spec.ts`) drives the tint through six hues and
asserts each. Dodging the problem by going near-black works and was tried — it
just deletes the per-user colour, which is the point of the avatar.

## Two mechanical traps found alongside it

**`getComputedStyle` returns modern colour functions VERBATIM.** An
`oklch(0.37 0.11 203 / 0.78)` comes back as exactly that, so `e2e/fixtures/contrast.ts`'s
`rgba()` regex threw. Reading back `ctx.fillStyle` after assigning does NOT fix
it either — Chrome round-trips oklch through the getter. **Paint it and read the
pixel:** `ctx.clearRect(0,0,1,1); ctx.fillStyle = css; ctx.fillRect(0,0,1,1);
ctx.getImageData(0,0,1,1).data`. Only the raster is guaranteed sRGB. (Fixed in
the fixture — it now normalises every colour this way.)

**`paintedContrast` walks `background-COLOR` only.** A gradient-only fill is
invisible to it, so the number it reports is optimistic by however much the
gradient lightens things. Put the load-bearing tint in `background-color` and
keep any `background-image` layer alpha-capped — and *look at a screenshot*, because
the assertion cannot see half the paint.

For glass: translucent tint + alpha-only sheen + `backdrop-filter: blur()`. Without
the blur a see-through chip just looks faded. Note glass only reads as glass over
a busy/dark backdrop — over the light theme's flat white header it necessarily
looks like a solid chip, and that is not a bug to chase.

See [[admin-dark-theme-alpha-utilities-not-remapped]], [[admin-ui-colour-and-chrome-taste-rules]].
