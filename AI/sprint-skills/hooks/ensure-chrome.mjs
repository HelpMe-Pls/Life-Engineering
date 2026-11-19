// PreToolUse hook for the mcp__claude-in-chrome__* tools.
// The Claude in Chrome extension can only connect while Chrome is running, so when Chrome is
// closed this hook starts it and waits for the extension to come up before the tool call runs.
// It never blocks the call: on any failure it exits 0 and the tool reports its own error.
import { execFileSync, spawn } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const LOG = join(homedir(), '.claude', 'hooks', 'ensure-chrome.log');
const CANDIDATES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  join(process.env.LOCALAPPDATA ?? '', 'Google', 'Chrome', 'Application', 'chrome.exe'),
];
const START_WAIT_MS = 10_000; // for a chrome.exe process to appear
const CONNECT_GRACE_MS = 8_000; // for the extension's service worker to connect to Claude Code

function note(message) {
  try {
    writeFileSync(LOG, `${new Date().toISOString()} ${message}\n`);
  } catch {
    // the log is a convenience, never a reason to fail
  }
}

function chromeRunning() {
  try {
    const out = execFileSync('tasklist', ['/FI', 'IMAGENAME eq chrome.exe', '/NH'], { encoding: 'utf8' });
    return /chrome\.exe/i.test(out);
  } catch {
    return false;
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  if (process.platform !== 'win32') {
    note('skipped: not Windows');
    return;
  }
  if (chromeRunning()) {
    note('chrome already running');
    return;
  }
  const exe = CANDIDATES.find((p) => p && existsSync(p));
  if (!exe) {
    note('chrome.exe not found in the usual places');
    console.log(JSON.stringify({ systemMessage: 'Chrome is not running and chrome.exe was not found, so the Claude extension cannot connect.' }));
    return;
  }
  spawn(exe, [], { detached: true, stdio: 'ignore' }).unref();
  const deadline = Date.now() + START_WAIT_MS;
  while (Date.now() < deadline && !chromeRunning()) {
    await sleep(500);
  }
  const started = chromeRunning();
  if (started) {
    await sleep(CONNECT_GRACE_MS);
  }
  note(started ? `started chrome from ${exe} and waited ${CONNECT_GRACE_MS} ms` : `tried to start chrome from ${exe}, no process after ${START_WAIT_MS} ms`);
  console.log(
    JSON.stringify({
      systemMessage: started
        ? 'Chrome was closed, so this hook started it and waited for the Claude extension to connect.'
        : 'Chrome was closed and did not start within 10 seconds; the browser tool may report not connected.',
    }),
  );
}

main()
  .catch((e) => note(`hook error: ${e instanceof Error ? e.message : String(e)}`))
  .finally(() => process.exit(0));
