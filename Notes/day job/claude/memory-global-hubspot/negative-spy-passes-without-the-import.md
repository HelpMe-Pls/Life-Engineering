---
name: negative-spy-passes-without-the-import
description: expect(spy).not.toHaveBeenCalled() passes when the code under test never imports that module at all — assert the whole op list instead
metadata: 
  node_type: memory
  type: feedback
  originSessionId: dba5abcd-6c10-4cbc-9222-93c24a23d5d8
  modified: 2026-08-27T00:09:18.537Z
---

`expect(someMock).not.toHaveBeenCalled()` is **green by construction** whenever the
module under test does not import the mocked symbol. It cannot fail on the risk it
names — it only says "this file does not use that import," which is already true
and stays true if someone smuggles the effect in through a *different* client.

Hit in #659: `finalizeChapterFileUpload` never imports `touchChapterActivity`, so
`expect(touchMock).not.toHaveBeenCalled()` was a permanent pass. The fix was to
record every `(client, table, op)` on **both** mocked Supabase clients and assert
the **whole list**:

```
[ { service, storage:intake, download }, { user, intake_files, insert } ]
```

A touch smuggled in through either client adds a `chapters/update` and it reds.
Confirmed by adding one.

**How to tell a sound negative from a vacuous one:** the file needs a *positive
control* — somewhere the same spy is asserted called, or its return value visibly
changes an outcome. A sweep of this suite found 13 negative-only spies and all 13
were sound (their module used the symbol elsewhere, e.g. `actions.ts` calls
`revalidatePath` in eleven places), so **negative-only is a smell to read, not a
defect to auto-fix** — a script that flags them returns mostly false positives and
is not worth committing.

Related: [[test-suite-clean-minimal-standard]], [[usage-block-makes-flag-assertions-vacuous]],
[[payload-boundary-asserted-on-fetch-not-render]].
