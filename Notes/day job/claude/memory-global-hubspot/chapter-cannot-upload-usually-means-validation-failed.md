---
name: chapter-cannot-upload-usually-means-validation-failed
description: "We can't upload it" from a chapter usually means the upload SUCCEEDED and content validation failed — check the Uploaded files list before touching the upload path
metadata:
  type: project
---

A chapter reporting *"we weren't able to upload these to the portal"* is most likely describing a **passing upload with a failing validation**, not a rejected upload. Check `/admin/chapters/[id]` → Uploaded files for the row before diagnosing anything in the upload path.

Why it reads that way to them — three surfaces all say "no":

- `UploadDropZone` renders **"Validation failed."** plus `Missing required column: …` right where a success would go.
- The admin row shows a red `Missing: first_name, last_name, email` chip.
- The HubSpot export stays locked behind *"Waiting for the chapter to upload a validated contact file."*

The two stages are separate and only the second is usually at fault: **request stage** (`lib/validation/intake-policy.ts` — filename ≤255, size ≤25MB, extension in `ALLOWED_EXTENSIONS`, currently `xlsx` only) is what actually refuses an upload; **content stage** (`lib/validation/intake.ts`) runs after the bytes are stored and only writes a verdict.

Confirmed 2026-08-25: all three files in the operator's report were on record in prod with stored failing verdicts — same filename, same byte size as the screenshot. Nothing had been rejected.

⚠ **A stored `validation_result` is not recomputed when the validator is fixed.** Rows already on record keep their failing verdict until something rewrites them — a production data change, parked under 🧑, and it must not re-fire `notifyUploadReceived`. See [[report-that-names-its-own-fix-must-be-measured]] for what the three files actually failed on.

## ⚠ The SECOND root cause, measured 2026-09-09 (EO Toronto): the file is the WRONG EXPORT

A repeat of the same report shape — *"the chapter wasn't able to upload"* + *"says first/last name columns are missing"* + a prescribed fix (*"the names are in the **Primary Lead** column"*) — was **not** the #653/#665 bug returning, and **not** a stale verdict.

**How it was ruled out in one read-only command**: `npx tsx --conditions=react-server scripts/rescore-verdicts.ts` (report mode, safe against prod) answered **14 files / 230 chapters, 13 unchanged, 1 warnings-only**. A stale verdict would have shown as *would change*. Run this FIRST on any "I thought we fixed this" upload report — it separates stale data from a live defect before any code is read.

Toronto's one file, `XLSEOTO Opps in CanRegProspectPipeline.xlsx`, is a **CRM opportunity-pipeline export, not a contact export**: one sheet, 23 columns, 960 rows, and **not one column resolves to any schema field** — `missingRequiredFields = [first_name, last_name, email]`.

⚠ **The prescribed fix fixes the visible half and still leaves the file failing.** Measured: treating `Primary Lead` as a combined-name column splits **930 of 960** rows cleanly (29 `too-many-tokens`, 1 `single-token`) — so the name half really would work. But **the file carries no prospect email at all**. The only `@` addresses (191, all in the `Opportunity` column) are one EO Toronto staff routing address, `shane.bennett@eoto.ca`/`.cc`, written there by Leadosaurus — harvesting them would give 191 prospects the same staff inbox in HubSpot. `email` is required, so `ok` stays false either way. **This is [[report-that-names-its-own-fix-must-be-measured]] landing a second time on the same chapter-report shape.**

**A real UI defect the file did expose**: the verdict carries **23 warnings — one `no-importable-rows` followed by 22 identical `unrecognized-column` sentences**, one per pipeline column. The one message that matters is first but drowned, which is very likely why the operator's email quoted only "first/last name missing" and never mentioned Email.

⚠ **CORRECTION, same day, once the operator supplied all THREE attached files** (`C:\Users\leekh\Documents\HubSpot\tmp\Upload issues\XLSEOTO *`): the paragraph above is true of the file that reached production and **wrong as a diagnosis of the report**. The report's first attachment, `XLSEOTO AllContactsinConstantContact(Sharpspring).xlsx`, IS the contact export — 4,450 rows, 85 columns, `First Name`/`Last Name`/`Email` all resolve, 4,111 rows carry a distinct email — and the shipped validator (identical on `origin/main` and `dev`, checked by `git diff`) returns **`ok: true`** for it. It was never uploaded; the wrong file was. And 35/36 and 911/960 of the two pipeline files' `Primary Lead` names are already in it by full name, so those files add almost nobody.

**The durable rule: a chapter report names a SET of files — measure every file in the set, not the one that happens to be in the database.** The uploaded file answers "what does the chapter see"; the whole set answers "what should they have uploaded", and here the entire fix was "upload attachment 1".

**What actually spooked them, measured**: `ValidationWarnings.tsx` renders the loud `no-importable-rows` line, then EVERY other warning as a flat bullet list with no cap — so under "4450 contacts ready to review." the chapter reads **81 identical bullets**, one per non-HubSpot column. A passing file that looks like a wall of errors. That, not the validator, is the defect worth a ticket.
