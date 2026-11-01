---
name: jsx-entity-eats-the-leading-space
description: "An HTML entity in a JSX text node makes SWC DROP that node's leading whitespace — needs a leading inline space AND a newline later in the same node; `{' '}` is not a durable fix; MDX is immune"
metadata: 
  node_type: memory
  type: project
  originSessionId: 378df544-efa5-4ef0-9fc5-ad75d4da69f4
  modified: 2026-08-14T21:21:47.722Z
---

Measured in global-hubspot (Next 16 / SWC) via the native `@next/swc-*` binding — **not** inferred from the JSX spec, which says the opposite. ⚠ **Restated twice before it was right; the first two versions of this memory were both wrong.** What the entity does is make SWC **drop** the node's leading whitespace instead of collapsing it, so damage needs all three:

1. the node carries an entity,
2. its leading whitespace is a plain **inline space** — a leading newline+indent is stripped by ordinary JSX rules anyway, and
3. the node contains a newline **after** that, *including the one before the tag that closes it*.

| shape | emitted |
| --- | --- |
| `<b>H</b>·Stalled (&gt; {n}d)` — node ends at the `{` | `"·Stalled (> "` kept |
| `<b>H</b>·Stalled (&gt; 14d)` — one source line | `"·Stalled (> 14d)"` kept |
| `<b>H</b>·Stalled (&gt; 14d)⏎</p>` — node runs to the tag | `"Stalled (> 14d)"` **LOST** |
| `Chapters stalled⏎(&gt; 14d)` — nothing before it | `"Chapters stalled (> "` kept |

**The rule stays "no entity at all"** — every safe row is safe by accident of layout, which is what edits move.

- **`{' '}` treats the symptom.** Any tool that reflows JSX rewrites it to a literal space — Prettier did in 8 files. Write the character (’ “ ” — &).
- **A bare `>` is a PARSE ERROR in SWC**, not just a lint complaint, so `&gt;` genuinely has no plain form. Its one allowed site now proves itself inert: compile the file twice, once with the entity swapped for the character, and require the same emitted program.
- ⚠ **`content/**/*.mdx` is NOT exposed.** Micromark decodes character references while parsing the markdown, so SWC never receives an entity — measured byte-identical output. Do not "close" that gap.
- ⚠ **A Playwright YAML snapshot TRIMS text**, so the missing space is invisible there. Confirm in the emitted output.
- ⚠ **Reaching for the SWC binding by package name pins your platform** (`@next/swc-win32-x64-msvc`); scan `node_modules/@next` for the installed `swc-*` instead, or the file fails to load on CI.

Guarded by `website/tests/jsx-no-html-entities.test.ts`, which holds both probe tables. See [[recurring-bug-class-needs-enumeration]] and [[write-edit-normalise-unicode-escapes]].
