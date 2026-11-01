---
name: user-guide-docx-edit-and-verify
description: How to edit + visually verify the All-Roles user-guide DOCX (python-docx rebuild; Word COM + PyMuPDF render)
metadata: 
  node_type: memory
  type: reference
  originSessionId: cab437eb-26fc-48ae-8055-f1fccb45b1b7
---

The stakeholder-facing app guide is `resources/[App] eoglobalhubspot.com - User Guide (All Roles).docx` (plain-language, every role; ends with an appendix embedding the approved WAVE campaign emails whose source of truth is `emails/drafts/2026-06-09-chapter-rollout-wave-campaign.md`). It is git-tracked.

**Editing:** rebuilt with **python-docx** (host has Python 3.14 + python-docx 1.2.0). Open the original (so styles.xml/theme/fonts/sectPr are reused), clear the body's `w:p`/`w:tbl` children but KEEP the trailing `w:sectPr`, then re-add paragraphs by style name (`Title` / `Heading 1` / `Heading 2` / `Normal`). `add_paragraph` inserts before sectPr automatically. Formatting conventions to reproduce: literal bullets `"•  "` (U+2022 + two spaces), numbered `"1.  "`, em-dash `—` (U+2014) as the list lead-in separator, middle dot `·` (U+00B7) in the date line + footer, **straight** quotes/apostrophes, and **bold lead-ins** on list items. The original had hard `page_break_before` set on 5 `Heading 1` paragraphs, which left large blank gaps between pages — rebuild WITHOUT them so content flows (audience is non-technical stakeholders).

**Visual verify on this machine:** no LibreOffice/poppler installed, so the Read tool can't rasterize PDFs. But **Word COM works**: PowerShell `New-Object -ComObject Word.Application`, `Visible=$false`, `Documents.Open(path,$false,$true)`, `ExportAsFixedFormat(pdf, 17)`, `ComputeStatistics(2)` for page count. Then `pip install pymupdf` and use `fitz` to render PDF pages → PNG, which the Read tool CAN view to confirm pagination/gaps.

As of 2026-06-16 the guide reflects instant auto-approval (no `/admin/requests` queue) and the current admin features (Tracker, Settings, per-chapter Accounts card, remove corrupted accounts, admin upload-validated notifications, admin file delete, Tutorial/KB) — shipped to `dev` via PR #95 (`7a3e91a`). See [[policy-guardrails-this-repo]] (even a docs PR to `dev` needs explicit per-PR merge approval).
