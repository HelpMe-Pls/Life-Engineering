---
name: ""
metadata: 
  node_type: memory
  originSessionId: c608e1ae-e379-4a36-922e-aaa625ce1ff9
---

**Symptom:** wall of repeated console errors "Blocked script execution in 'https://…/update-password' because the document's frame is sandboxed and the 'allow-scripts' permission is not set" — seen "when resetting passwords."

**Root cause (proven with a repro, not guessed):** an email link-scanner / reading pane (Outlook Safe Links, M365 Defender, Mimecast) renders the destination page inside a **sandboxed `<iframe>` WITHOUT `allow-scripts`**, so the browser blocks Next.js's hydration/bootstrap scripts and logs that error repeatedly. It happens in the **scanner's** frame, not the recipient's top-level navigation — the real set-password flow works fine (browser-verified, 0 errors at top level). This is the same scanner behavior AUTH-SAFELINK already designed around.

**Repro that goes RED (the tight loop):** serve an **http** parent page (same scheme as the app — a `data:` parent can't frame an `http:` child, that's why my first attempt was a false GREEN) with `<iframe sandbox="allow-forms" src="…/update-password">`, drive it in Playwright, capture `page.on('console')` from ALL frames (the MCP `browser_console_messages` tool only reads the main frame, so it misses the child). → 18 blocked-script errors.

**Fix (DEC-FRAME-HEADERS, PR #216):** `X-Frame-Options: DENY` + CSP `frame-ancestors 'none'` app-wide via `next.config.ts` `headers()` → the scanner iframe is refused outright ("Framing … violates frame-ancestors 'none'"), no scripts run, spam → 0. Also the clickjacking hardening the app lacked; app is never legitimately framed so DENY is safe. Verified red→green against the real app server.
