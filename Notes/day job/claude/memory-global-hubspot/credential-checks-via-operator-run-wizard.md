---
name: credential-checks-via-operator-run-wizard
description: "To test third-party credentials without secrets entering the chat: write a bash wizard OUTSIDE the repo that the operator runs in their own terminal (hidden input, a no-secret report); it worked for the Hivebrite/Eventbrite checks on 2026-10-05"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 7381459e-92c2-4e16-8a16-796da242106e
  modified: 2026-10-05T10:41:31.603Z
---

When a question can only be answered with a live credential (an API token, a client secret), write a wizard (the `mattpocock-skills:wizard` template) outside every repo, e.g. `C:\tmp\<name>\wizard.sh`. The operator runs it in their own terminal, never with `!`. It takes secrets with hidden input, keeps tokens off argv (curl config on stdin, `-K -`), never calls `write_env`, and writes a `report.md` of non-secret results plus raw replies in `out/`. The operator then says "the report is ready" and I read the report.

**Why:** the operator ran the 14-stage connector self-check on 2026-10-05 and it settled about 20 open questions (Service App, team role, date handling, partial updates, and more) with no secret entering the conversation. That cut the questions for Dave and Nisha to a handful.

**How to apply:** use this shape whenever "can we answer it ourselves?" needs a credential. Make each stage print what it SENT as well as what came back, and keep every role's reply (overwriting `out/a1-b.json` per role lost R1's private-field evidence). Raw vendor replies can hold other secrets (sandbox zoom passwords, Eventbrite event passwords), so analyse them with scripts that never print those fields. Related: [[connector-spec-missed-nishas-hivebrite-doc]].
