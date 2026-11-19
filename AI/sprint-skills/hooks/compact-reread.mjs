// SessionStart hook, matcher "compact": after every compaction, point the session back to the
// prompt file it was launched from, so that a long-horizon run never works from the summary alone.
//
// It scans the session's own transcript (hook input: transcript_path) for the launch prompt and
// looks for one of two sentences that the sprint prompts in Notes/Daily Standup.md put there:
//   "This prompt is the file <path>; after any compaction"        (an AFK run's Message 1)
//   "(# Sprint review prep of <path>)" / "(# After sprint review of <path>)"   (a pasted section)
// When one is found, stdout (which Claude Code adds to the context) tells the session what to
// read again before any other action. Any other session gets nothing: silent, zero tokens.

import { openSync, readSync, closeSync, existsSync } from "node:fs";

const SCAN_BYTES = 4 * 1024 * 1024; // the launch prompt sits in the first lines of the transcript

const chunks = [];
process.stdin.on("data", (c) => chunks.push(c));
process.stdin.on("end", () => {
  let input = {};
  try { input = JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch {}
  const event = input.hook_event_name || "";
  if (event === "SessionStart" && input.source !== "compact") return;
  const path = input.transcript_path;
  if (!path || !existsSync(path)) return;

  let text = "";
  try {
    const fd = openSync(path, "r");
    const buf = Buffer.alloc(SCAN_BYTES);
    const n = readSync(fd, buf, 0, SCAN_BYTES, 0);
    closeSync(fd);
    text = buf.toString("utf8", 0, n);
  } catch { return; }

  const FILE_RE = /This prompt is the file (.+?); after any compaction/;
  const SECTION_RE = /\(# (Sprint review prep|After sprint review) of ([A-Za-z]:\\[^)\n]+?\.md)\)/;

  let found = null;
  for (const line of text.split("\n")) {
    if (!line.includes('"type":"user"')) continue;
    let entry;
    try { entry = JSON.parse(line); } catch { continue; }
    if (entry.type !== "user" || entry.isCompactSummary) continue;
    const c = entry.message && entry.message.content;
    const t = typeof c === "string" ? c
      : Array.isArray(c) ? c.map((b) => (b && b.type === "text" ? b.text : "")).join("\n") : "";
    if (!t) continue;
    const f = FILE_RE.exec(t);
    if (f) { found = { kind: "file", file: f[1].trim() }; break; }
    const s = SECTION_RE.exec(t);
    if (s) { found = { kind: "section", section: s[1], file: s[2].trim() }; break; }
  }
  if (!found) return;

  const target = found.kind === "file"
    ? `the whole file ${found.file}`
    : `the section "# ${found.section}" of ${found.file}, from that heading to the next line that starts with "# "`;
  process.stdout.write(
    `Your context was just compacted into a summary, and the summary is not your prompt. ` +
    `Before any other action, read again ${target}. ` +
    `Then read the state file or the session reports that prompt names, and go on from the phase, ` +
    `step or item they show; repeat nothing a read proves done.\n`
  );
});
