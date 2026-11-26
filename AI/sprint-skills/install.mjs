#!/usr/bin/env node
// The installer for the three sprint skills: /sprint-summary-tickets, /sprint-afk-prep and /sprint-review-prep.
//
//   node "<this folder>/install.mjs"
//
// Run it again after every pull. It writes a file only when the file differs, so a second run changes nothing.
// README.md beside this file says what it installs, what each option does and what a machine must still supply.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const PKG = path.dirname(fileURLToPath(import.meta.url));
export const SKILLS = ['sprint-summary-tickets', 'sprint-afk-prep', 'sprint-review-prep'];

// The skills were written on one Windows PC. These are the places and the accounts their files name.
// Only the two skills below name them in a way a session acts on; every other file is copied byte for byte
// (the summary skill names its places from the home folder; movedNote covers a machine that keeps them elsewhere).
const LOCALIZED = new Set(['sprint-afk-prep', 'sprint-review-prep']);
const REF = {
  home: 'C:\\Users\\leekh',
  edge8: 'C:\\Users\\leekh\\Documents\\Edge8',
  repos: 'C:\\Users\\leekh\\Documents\\Repos\\Edge8',
  captures: 'C:\\Users\\leekh\\Videos\\Captures',
  notes: 'C:\\Users\\leekh\\Documents\\Repos\\Personal\\Life-Engineering\\Notes',
  slug: 'C--Users-leekh-Videos-Captures',
  msys: '/c/Users/leekh',
  tmp: 'C:\\tmp',
  docker: 'C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe',
  github: 'Kh0iLe',
  email: 'khoi.le@edge8.ai',
};

// The skills by Matt Pocock that the sprint skills call, and the commands that install them as the plugin
// mattpocock-skills, from its marketplace in the GitHub repository mattpocock/skills.
const POCOCK = ['grilling', 'tdd', 'implement', 'pr', 'code-review'];
const POCOCK_INSTALL = ['claude plugin marketplace add mattpocock/skills', 'claude plugin install mattpocock-skills@mattpocock --scope user'];

// What the settings merge adds when it is missing. It never changes or removes a value that is there.
const HOOKS = [
  { event: 'PreToolUse', matcher: 'Bash', file: 'no-cd-compound.mjs', extra: {} },
  { event: 'PreToolUse', matcher: 'mcp__claude-in-chrome__.*', file: 'ensure-chrome.mjs', winOnly: true,
    extra: { timeout: 30, statusMessage: 'Making sure Chrome is running for the Claude extension' } },
  { event: 'SessionStart', matcher: 'compact', file: 'compact-reread.mjs', extra: { timeout: 10 } },
];
const WANT_ENV = {
  CLAUDE_CODE_SUBAGENT_MODEL: 'sonnet',
  CLAUDE_CODE_WORKFLOW_SUBAGENT_MODEL: 'sonnet',
  CLAUDE_CODE_SUBAGENT_EFFORT: 'medium',
  MAX_MCP_OUTPUT_TOKENS: '12000',
  CLAUDE_CODE_STOP_HOOK_BLOCK_CAP: '5',
};
const WANT_TOP = { autoCompactWindow: 200000, bashOutputMaxChars: 16000, workflowSizeGuideline: 'small', askUserQuestionTimeout: '10m' };
const WANT_DENY = ['Read(**/*.env)', 'Edit(**/*.env)', 'Read(.env*)', 'Read(.dev.vars*)', 'Edit(.env*)', 'Edit(.dev.vars*)'];

const slugOf = (p) => p.replace(/[^A-Za-z0-9]/g, '-');
const fwd = (p) => p.replace(/\\/g, '/');
const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ---------------------------------------------------------------------------------------------------------
// Render: the text of a skill file as this machine needs it. On the PC the skills were written on, with no
// owner set, it returns the file unchanged.

export function makeContext({ platform, home, edge8, repos, captures, notes = null, owner = null, exists = fs.existsSync }) {
  const win = platform === 'win32';
  const P = win ? path.win32 : path.posix;
  const ctx = { win, home, owner, exists, notes };
  ctx.edge8 = edge8 || P.join(home, 'Documents', 'Edge8');
  ctx.repos = repos || P.join(home, 'Documents', 'Repos', 'Edge8');
  ctx.captures = captures || P.join(home, 'Videos', 'Captures');
  ctx.slug = slugOf(ctx.captures);
  ctx.tmp = win ? REF.tmp : P.join(home, 'tmp');
  ctx.homeFwd = fwd(home);
  ctx.homeMsys = win ? fwd(home).replace(/^([A-Za-z]):/, (m, d) => '/' + d.toLowerCase()) : home;
  return ctx;
}

function localize(text, ctx, todos) {
  const held = [];
  const hold = (s) => `\u0000${held.push(s) - 1}\u0000`;
  const table = new Map([
    [REF.notes, ctx.notes || REF.notes], [REF.edge8, ctx.edge8], [REF.repos, ctx.repos], [REF.captures, ctx.captures],
    [REF.slug, ctx.slug], [REF.home, ctx.home], [fwd(REF.home), ctx.homeFwd], [REF.msys, ctx.homeMsys], [REF.tmp, ctx.tmp],
  ]);
  // One pass, the longer place first, so a place this machine has already been given is never mapped twice.
  const places = new RegExp([...table.keys()].map(escRe).join('|'), 'g');
  const map = (s) => s.replace(places, (m) => table.get(m));
  const native = (s) => (ctx.win ? s : s.replace(/\\/g, '/'));

  // A launch command adds folders with --add-dir. Keep each folder this machine holds, in this machine's form.
  let out = text.replace(/--add-dir((?: +(?:"[^"\n]+"|[A-Z]:\\[^\s"`]+))+)/g, (all, list) => {
    const kept = [];
    const missing = [];
    for (const token of list.match(/"[^"\n]+"|[A-Z]:\\[^\s"`]+/g)) {
      const ref = token.replace(/^"|"$/g, '');
      if (ref === REF.notes && !ctx.notes) {
        todos.push("the launch command leaves out the vault's Notes folder: this copy of the package is not inside the vault");
        continue;
      }
      const here = native(map(ref));
      if (!ctx.exists(here)) { missing.push(here); continue; }
      kept.push(/\s/.test(here) ? `"${here}"` : here);
    }
    if (missing.length) {
      const one = missing.length === 1;
      todos.push(`the launch command leaves out ${one ? 'a folder' : missing.length + ' folders'} this machine does not hold yet (${missing.join(', ')}); run this installer again once ${one ? 'it is' : 'they are'} there`);
    }
    return hold(kept.length ? '--add-dir ' + kept.join(' ') : '');
  });

  if (!ctx.win) out = out.replaceAll(REF.docker, () => hold(REF.docker));
  out = map(out);
  if (!ctx.win) out = out.replace(/\\/g, '/').replace(/\b(npm|supabase)\.cmd\b/g, '$1');
  return out.replace(/\u0000(\d+)\u0000/g, (m, i) => held[Number(i)]);
}

// The summary skill compares its installed SKILL.md with the source in its step 9. A copy that holds a paragraph
// of the installer says so, and says what takes the place of that plain comparison.
const step9Note = () => `The installer wrote this paragraph into this copy, and the source SKILL.md does not have it. When step 9 changes the source SKILL.md, bring this copy up to date with node "${fwd(PKG)}/install.mjs" --skills-only in place of the plain copy: its PASS or DONE line for this skill stands for the cmp of that file.`;

// The summary skill names its places from the home folder (~/Documents/Edge8). On a machine that keeps them in
// another folder (--edge8, --repos), this paragraph says where; with the default folders there is no paragraph.
function movedNote(ctx, withStep9) {
  const P = ctx.win ? path.win32 : path.posix;
  const moved = [];
  if (ctx.edge8 !== P.join(ctx.home, 'Documents', 'Edge8')) moved.push(`the sprint pages are in ${ctx.edge8}: read ~/Documents/Edge8 as that folder`);
  if (ctx.repos !== P.join(ctx.home, 'Documents', 'Repos', 'Edge8')) moved.push(`the clones are in ${ctx.repos}: read ~/Documents/Repos/Edge8 as that folder`);
  if (!moved.length) return null;
  return `On this machine ${moved.join('; ')}. This holds for every file of this skill and for every command it has you run.${withStep9 ? ' ' + step9Note() : ''}`;
}

function ownerNote(owner, skill, tokensReplaced) {
  const s = [
    `On this machine the owner of the session is ${owner.name}, not Khoi. In this file's own wording, Khoi, Khôi, me, my and I stand for ${owner.name}: the person who starts the session, owns the cards in scope, signs in and reads the report. On a sprint page, a pull request or a record, the name Khôi still means Khoi himself, who is one more teammate there. The same holds for every prompt this file has you write.`,
  ];
  s.push(tokensReplaced
    ? `${owner.name}'s GitHub account is ${owner.github}.`
    : `${owner.name}'s GitHub account is ${owner.github}: where a file of this skill names the account ${REF.github}, use ${owner.github}.`);
  if (skill === 'sprint-review-prep') {
    s.push(owner.email ? `${owner.name}'s HubSpot sign-in is ${owner.email}.` : `The HubSpot sign-in this file names is Khoi's: expect ${owner.name}'s own.`);
  }
  if (skill === 'sprint-summary-tickets') s.push(step9Note());
  return s.join(' ');
}

const MAC_NOTE = 'This machine is not a Windows PC. Where this file names PowerShell or Git Bash, use this machine\'s shell. A tool runs under its plain name, with no .cmd or .exe ending. Docker Desktop starts with open -a Docker, in place of Start-Process and the path of the exe. For one command, env -u GH_TOKEN takes the place of Remove-Item Env:GH_TOKEN. The same holds for every prompt and every command this file has you write.';

// rel is "<skill>/<file>", buf the bytes of the file in the package. Returns the bytes to install.
export function render(rel, buf, ctx) {
  const todos = [];
  const [skill, ...rest] = rel.split('/');
  if (rest.join('/') !== 'SKILL.md') return { buf, todos };
  const localized = LOCALIZED.has(skill);
  const before = buf.toString('utf8');
  let text = before;
  if (localized) {
    text = localize(text, ctx, todos);
    if (ctx.owner) {
      text = text.replaceAll(REF.github, () => ctx.owner.github);
      if (ctx.owner.email) text = text.replaceAll(REF.email, () => ctx.owner.email);
    }
  }
  const notes = [];
  if (ctx.owner) notes.push(ownerNote(ctx.owner, skill, localized));
  if (skill === 'sprint-summary-tickets') {
    const moved = movedNote(ctx, !ctx.owner);
    if (moved) notes.push(moved);
  }
  if (localized && !ctx.win) notes.push(MAC_NOTE);
  if (notes.length) {
    const lines = text.split('\n');
    const at = lines.findIndex((l) => l.startsWith('This prompt is the file '));
    if (at < 0) throw new Error(`${rel} has no line that starts with "This prompt is the file", so a note for this machine has no place to go`);
    lines.splice(at + 1, 0, ...notes.flatMap((n) => ['', n]));
    text = lines.join('\n');
  }
  return { buf: text === before ? buf : Buffer.from(text, 'utf8'), todos };
}

// ---------------------------------------------------------------------------------------------------------
// The run. Every line it prints starts with what happened:
//   PASS  already right          DONE  the installer changed it       DIFF  a check found a change to make
//   TODO  yours to do            NOTE  for your information           FAIL  the installer could not do it

const counts = { PASS: 0, DONE: 0, DIFF: 0, TODO: 0, NOTE: 0, FAIL: 0 };
function say(kind, msg) { counts[kind] += 1; console.log(kind.padEnd(5) + ' ' + msg); }

// Writes buf to dst when dst differs. bak: the ending of a one-time copy of the older file.
function put(dst, buf, check, bak) {
  let old = null;
  try { old = fs.readFileSync(dst); } catch { /* not there yet */ }
  if (old && old.equals(buf)) return 'same';
  if (check) return 'differs';
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  if (old && bak && !fs.existsSync(dst + bak)) fs.writeFileSync(dst + bak, old);
  fs.writeFileSync(dst, buf);
  return 'written';
}

function walk(dir, base = '') {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : 1))) {
    if (e.name === '.DS_Store' || e.name === '__pycache__' || e.name === '.vault-source') continue;
    const rel = base ? `${base}/${e.name}` : e.name;
    if (e.isDirectory()) out.push(...walk(path.join(dir, e.name), rel));
    else if (e.isFile()) out.push(rel);
  }
  return out;
}

function installSkills(ctx, env) {
  for (const name of SKILLS) {
    const src = path.join(PKG, 'skills', name);
    const dst = path.join(env.claude, 'skills', name);
    try {
      let st = null;
      try { st = fs.lstatSync(dst); } catch { /* not there yet */ }
      if (st && st.isSymbolicLink()) {
        if (env.check) { say('DIFF', `/${name}: ${dst} is a link; the installer puts a folder of files written for this machine in its place`); continue; }
        try { fs.unlinkSync(dst); } catch { fs.rmdirSync(dst); }
      }
      const files = walk(src);
      const changed = [];
      const todos = new Set();
      for (const rel of files) {
        const r = render(`${name}/${rel}`, fs.readFileSync(path.join(src, rel)), ctx);
        r.todos.forEach((t) => todos.add(t));
        if (put(path.join(dst, rel), r.buf, env.check) !== 'same') changed.push(rel);
      }
      // The summary skill writes what a call taught it into its source; this file says where the source is.
      if (put(path.join(dst, '.vault-source'), Buffer.from(fwd(src) + '\n'), env.check) !== 'same') changed.push('.vault-source');
      const extra = fs.existsSync(dst) ? walk(dst).filter((f) => !files.includes(f)) : [];
      if (!changed.length) say('PASS', `/${name} is installed in ${dst}, the same as the package`);
      else if (env.check) say('DIFF', `/${name} in ${dst} is missing or differs from the package in: ${changed.join(', ')}`);
      else say('DONE', `/${name} installed in ${dst}: wrote ${changed.join(', ')}`);
      if (extra.length) say('NOTE', `/${name}: ${dst} also holds ${extra.join(', ')}, which the package does not have; left as it is`);
      for (const t of todos) say('TODO', `/${name}: ${t}`);
    } catch (e) {
      say('FAIL', `/${name}: ${e.message}`);
    }
  }
}

function installHooks(env) {
  const dir = path.join(PKG, 'hooks');
  const changed = [];
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.mjs')).sort()) {
    if (put(path.join(env.claude, 'hooks', f), fs.readFileSync(path.join(dir, f)), env.check, '.bak') !== 'same') changed.push(f);
  }
  if (!changed.length) say('PASS', `the hook scripts are in ${path.join(env.claude, 'hooks')}, the same as the package`);
  else if (env.check) say('DIFF', `hook scripts missing or different in ${path.join(env.claude, 'hooks')}: ${changed.join(', ')}`);
  else say('DONE', `hook scripts written to ${path.join(env.claude, 'hooks')}: ${changed.join(', ')} (an older file of the same name is kept with the ending .bak)`);
}

// The node program a hook command names. fnm gives each shell its own short-lived path, so its default alias goes first.
function stableNode() {
  const win = process.platform === 'win32';
  const home = os.homedir();
  const tail = win ? ['aliases', 'default', 'node.exe'] : ['aliases', 'default', 'bin', 'node'];
  const roots = win
    ? [process.env.FNM_DIR, process.env.APPDATA && path.join(process.env.APPDATA, 'fnm')]
    : [process.env.FNM_DIR, path.join(home, '.local', 'share', 'fnm'), path.join(home, 'Library', 'Application Support', 'fnm'), path.join(home, '.fnm')];
  for (const r of roots.filter(Boolean)) {
    const p = path.join(r, ...tail);
    if (fs.existsSync(p)) return p;
  }
  // Next: the node on PATH, when it is this same program under a name that outlives an upgrade (Homebrew's bin
  // folder, the nodejs folder of nvm for Windows). Last: this program's own path, which names one version.
  let real = process.execPath;
  try { real = fs.realpathSync(process.execPath); } catch { /* keep the path as given */ }
  const same = (a, b) => (win ? a.toLowerCase() === b.toLowerCase() : a === b);
  for (const d of (process.env.PATH || '').split(path.delimiter)) {
    if (!d || !path.isAbsolute(d) || /fnm_multishells/i.test(d)) continue;
    const p = path.join(d, win ? 'node.exe' : 'node');
    try { if (same(fs.realpathSync(p), real)) return p; } catch { /* no node in this folder */ }
  }
  return real;
}

function mergeSettings(env, unattended) {
  const file = path.join(env.claude, 'settings.json');
  let raw = null;
  let s = {};
  if (fs.existsSync(file)) {
    raw = fs.readFileSync(file, 'utf8');
    try { s = JSON.parse(raw.replace(/^\uFEFF/, '')); } catch { s = null; }
    if (!s || typeof s !== 'object' || Array.isArray(s)) {
      say('FAIL', `${file} is not a JSON object, so nothing was added to it; repair the file, then run this installer again`);
      return;
    }
  }
  const added = [];
  const notes = [];
  const bad = []; // a value with a shape this installer cannot add to: said as FAIL, never counted as right
  const denyLost = `so the ${WANT_DENY.length} deny rules that keep .env files out of a session were not added`;
  const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);

  if (s.hooks === undefined) s.hooks = {};
  if (!isObj(s.hooks)) bad.push('the hooks value is not an object, so no hook was added');
  else {
    const node = fwd(stableNode());
    for (const h of HOOKS) {
      if (h.winOnly && process.platform !== 'win32') continue;
      if (s.hooks[h.event] === undefined) s.hooks[h.event] = [];
      const list = s.hooks[h.event];
      if (!Array.isArray(list)) { bad.push(`hooks.${h.event} is not a list, so the hook ${h.file} was not added`); continue; }
      const command = `"${node}" "${fwd(path.join(env.claude, 'hooks', h.file))}"`;
      const there = list.flatMap((e) => (isObj(e) && Array.isArray(e.hooks) ? e.hooks : [])).filter((x) => isObj(x) && typeof x.command === 'string' && x.command.includes(h.file));
      if (there.length) {
        // An upgrade of Node can remove the program an earlier run named, and a hook whose program is gone no longer runs.
        for (const x of there) {
          const m = /^"([^"]+)" "([^"]+)"$/.exec(x.command);
          // The same holds for a settings file carried over from another machine: its script path is not on this one.
          const gone = m && x.command !== command ? [m[1], m[2]].find((p) => path.isAbsolute(p) && !fs.existsSync(p)) : null;
          if (gone) { x.command = command; added.push(`the hook ${h.file} again, because the ${gone === m[1] ? 'Node program' : 'script'} its command named is gone`); }
        }
        continue;
      }
      const hook = { type: 'command', command, ...h.extra };
      const same = list.find((e) => isObj(e) && e.matcher === h.matcher && Array.isArray(e.hooks));
      if (same) same.hooks.push(hook); else list.push({ matcher: h.matcher, hooks: [hook] });
      added.push(`the hook ${h.file}`);
    }
  }

  if (s.env === undefined) s.env = {};
  if (!isObj(s.env)) bad.push('the env value is not an object, so no key was added');
  else for (const [k, v] of Object.entries(WANT_ENV)) {
    if (s.env[k] === undefined) { s.env[k] = v; added.push(`env ${k} = ${v}`); }
    else if (String(s.env[k]) !== v) notes.push(`env ${k} is ${s.env[k]} here and ${v} on the PC the skills were written on; left as it is`);
  }
  for (const [k, v] of Object.entries(WANT_TOP)) {
    if (s[k] === undefined) { s[k] = v; added.push(`${k} = ${v}`); }
    else if (s[k] !== v) notes.push(`${k} is ${s[k]} here and ${v} on the PC the skills were written on; left as it is`);
  }

  if (s.permissions === undefined) s.permissions = {};
  if (!isObj(s.permissions)) bad.push(`the permissions value is not an object, ${denyLost}`);
  else {
    if (s.permissions.deny === undefined) s.permissions.deny = [];
    if (Array.isArray(s.permissions.deny)) {
      for (const rule of WANT_DENY) if (!s.permissions.deny.includes(rule)) { s.permissions.deny.push(rule); added.push(`the deny rule ${rule}`); }
    } else bad.push(`permissions.deny is not a list, ${denyLost}`);
    if (unattended) {
      if (s.permissions.defaultMode === undefined) { s.permissions.defaultMode = 'auto'; added.push('permissions.defaultMode = auto'); }
      else if (s.permissions.defaultMode !== 'auto') notes.push(`permissions.defaultMode is ${s.permissions.defaultMode}; left as it is, so an unattended session will stop to ask`);
      say('TODO', 'unattended runs: auto mode asks no one, and it refuses a merge that no rule of yours allows. Write your own autoMode rules in settings.json for the repositories an AFK session may merge in; without them the session leaves each pull request open for you');
    }
  }

  if (!added.length) { if (!bad.length) say('PASS', `${file} already holds the hooks, the keys and the deny rules`); }
  else if (env.check) say('DIFF', `${file} lacks: ${added.join('; ')}`);
  else {
    try {
      fs.mkdirSync(env.claude, { recursive: true });
      const bak = file + '.sprint-skills.bak';
      if (raw !== null && !fs.existsSync(bak)) fs.writeFileSync(bak, raw);
      fs.writeFileSync(file, JSON.stringify(s, null, 2) + '\n');
      say('DONE', `${file}: added ${added.join('; ')}${raw !== null ? ' (the file as it was is kept with the ending .sprint-skills.bak)' : ''}`);
    } catch (e) { say('FAIL', `${file}: ${e.message}`); }
  }
  for (const b of bad) say('FAIL', `${file}: ${b}; repair that value by hand, then run this installer again`);
  for (const n of notes) say('NOTE', `${file}: ${n}`);
}

function readerDocs(env, withClaudeMd) {
  const mine = fs.readFileSync(path.join(PKG, 'docs', 'reader-facing-docs.md'));
  const vaultNote = path.join(PKG, '..', 'Reader-facing docs.md');
  if (fs.existsSync(vaultNote) && !fs.readFileSync(vaultNote).equals(mine)) {
    say('TODO', `the package's copy of the Reader-facing docs note differs from ${vaultNote}: copy that note over docs/reader-facing-docs.md in the package before you share it`);
  }
  const dst = path.join(env.claude, 'reader-facing-docs.md');
  if (fs.existsSync(dst)) {
    if (fs.readFileSync(dst).equals(mine)) say('PASS', `the Reader-facing docs note is at ${dst}`);
    else say('NOTE', `the Reader-facing docs note at ${dst} differs from the package's copy; left as it is`);
  } else if (env.check) say('DIFF', `the Reader-facing docs note is missing at ${dst}`);
  else { put(dst, mine, false); say('DONE', `the Reader-facing docs note written to ${dst}`); }

  const file = path.join(env.claude, 'CLAUDE.md');
  const old = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
  if (old !== null && old.includes('reader-facing-docs.md')) { say('PASS', `${file} sends Claude to the Reader-facing docs note`); return; }
  if (!withClaudeMd) {
    say('TODO', `${file} does not send Claude to the Reader-facing docs note, so only /sprint-review-prep, which names the note itself, follows it. To have every page follow it, run this installer again with --claude-md: it adds two short rules that then hold in every session on this machine`);
    return;
  }
  if (env.check) { say('DIFF', `${file} lacks the two writing rules`); return; }
  const block = fs.readFileSync(path.join(PKG, 'docs', 'claude-md-block.md'), 'utf8').trim();
  const bak = file + '.sprint-skills.bak';
  if (old !== null && !fs.existsSync(bak)) fs.writeFileSync(bak, old);
  const head = old === null ? '' : old + (old.endsWith('\n') ? '\n' : '\n\n');
  fs.mkdirSync(env.claude, { recursive: true });
  fs.writeFileSync(file, `${head}<!-- sprint-skills:start -->\n${block}\n<!-- sprint-skills:end -->\n`);
  say('DONE', `${file}: added the two writing rules between the sprint-skills marks`);
}

// The folders that can hold Matt Pocock's skills, each with how many folders down a skill can sit:
// .claude/skills (a copy put there by hand), and the skills folder of each mattpocock-skills plugin
// installed for the user and not turned off in settings.json (a plugin groups them, as in engineering/tdd).
function pocockRoots(env) {
  const read = (f) => { try { return JSON.parse(fs.readFileSync(f, 'utf8').replace(/^﻿/, '')); } catch { return null; } };
  const enabled = read(path.join(env.claude, 'settings.json'))?.enabledPlugins || {};
  const installs = read(path.join(env.claude, 'plugins', 'installed_plugins.json'))?.plugins || {};
  const roots = [[path.join(env.claude, 'skills'), 0]];
  for (const [id, list] of Object.entries(installs)) {
    if (!id.startsWith('mattpocock-skills@') || enabled[id] === false || !Array.isArray(list)) continue;
    for (const i of list) if (i && i.scope === 'user' && i.installPath) roots.push([path.join(i.installPath, 'skills'), 1]);
  }
  return roots;
}

// True when a folder named for the skill, with a SKILL.md in it, sits in root or up to depth folders below it.
function hasSkill(root, name, depth) {
  if (fs.existsSync(path.join(root, name, 'SKILL.md'))) return true;
  if (depth <= 0) return false;
  let dirs = [];
  try { dirs = fs.readdirSync(root, { withFileTypes: true }).filter((d) => d.isDirectory()); } catch { return false; }
  return dirs.some((d) => hasSkill(path.join(root, d.name), name, depth - 1));
}

// /implement ships slash-only. That needs no change here: the AFK prompt starts with /implement, so the person runs it.
function pocock(env, skipInstall) {
  const lacking = () => {
    const roots = pocockRoots(env);
    return POCOCK.filter((n) => !roots.some(([root, depth]) => hasSkill(root, n, depth)));
  };
  let missing = lacking();
  let installed = false;
  if (missing.length && !env.check && !env.test && !skipInstall) {
    for (const cmd of POCOCK_INSTALL) {
      console.log(`      Matt Pocock's skills are missing; running: ${cmd}`);
      spawnSync(cmd, { shell: true, stdio: 'inherit', timeout: 600000 });
    }
    installed = true;
    missing = lacking();
  }
  const names = (l) => l.map((n) => '/' + n).join(', ');
  if (missing.length) say('TODO', `Matt Pocock's skills are missing (${names(missing)}). Run ${POCOCK_INSTALL.join(', then ')}, then this installer again`);
  else say(installed ? 'DONE' : 'PASS', `Matt Pocock's skills that the sprint skills call are installed (${names(POCOCK)})`);
}

function ticketsHelper(env, ctx) {
  if (process.platform !== 'win32') { say('NOTE', 'the helper that lets a Tickets page save a pick from any browser is for Windows; it is not installed on this machine'); return; }
  const std = path.join(ctx.home, 'Documents', 'Edge8');
  if (ctx.edge8.toLowerCase() !== std.toLowerCase()) say('NOTE', `the Tickets page helper saves a pick only for a page under ${std}; your sprint pages are in ${ctx.edge8}, so the helper does not save a pick made on a page there`);
  if (env.test || !process.env.LOCALAPPDATA) { say('NOTE', 'the Tickets page helper is left alone in a test home'); return; }
  const dst = path.join(process.env.LOCALAPPDATA, 'Edge8', 'tickets-helper.pyw');
  try {
    const r = put(dst, fs.readFileSync(path.join(PKG, 'extras', 'tickets-helper.pyw')), env.check, '.bak');
    if (r === 'same') say('PASS', `the Tickets page helper is at ${dst}`);
    else if (r === 'differs') say('DIFF', `the Tickets page helper is missing or different at ${dst}`);
    else say('DONE', `the Tickets page helper written to ${dst}`);
    const key = 'HKCU\\Software\\Classes\\edge8-tickets';
    const reg = (args) => spawnSync('reg', args, { stdio: 'ignore' }).status === 0;
    if (reg(['query', `${key}\\shell\\open\\command`, '/ve'])) { say('PASS', 'the edge8-tickets link that starts the helper is registered for this user'); return; }
    if (env.check) { say('DIFF', 'the edge8-tickets link that starts the helper is not registered for this user'); return; }
    // pythonw is on PATH only when the Python setup was told to put it there; its launcher pyw is in the Windows folder.
    const find = (name) => { const w = spawnSync('where', [name], { encoding: 'utf8' }); return w.status === 0 ? w.stdout.split(/\r?\n/).find(Boolean) : null; };
    const pyw = find('pythonw') || find('pyw');
    if (!pyw) { say('TODO', 'the Tickets page helper needs Python: install Python 3, then run this installer again so that it can register the edge8-tickets link'); return; }
    const ok = reg(['add', key, '/ve', '/d', 'URL:Edge8 Tickets helper', '/f'])
      && reg(['add', key, '/v', 'URL Protocol', '/d', '', '/f'])
      && reg(['add', `${key}\\shell\\open\\command`, '/ve', '/d', `"${pyw}" "${dst}"`, '/f']);
    say(ok ? 'DONE' : 'FAIL', ok ? 'the edge8-tickets link that starts the helper is registered for this user' : 'the edge8-tickets link could not be registered for this user');
  } catch (e) { say('FAIL', `the Tickets page helper: ${e.message}`); }
}

function machineChecks(ctx, env) {
  const runs = (cmd) => spawnSync(cmd, { shell: true, stdio: 'ignore', timeout: 30000 }).status === 0;
  const tool = (cmd, label, todo) => (runs(cmd) ? say('PASS', label) : say('TODO', todo));
  const major = Number(process.versions.node.split('.')[0]);
  if (major >= 18) say('PASS', `Node ${process.versions.node}`); else say('FAIL', `Node ${process.versions.node} is older than 18: install a newer Node, then run this again`);
  tool('git --version', 'git is installed', 'install git');
  tool('claude --version', 'Claude Code is installed', 'install Claude Code (the claude command) and sign in');
  if (!runs('gh --version')) say('TODO', 'install the GitHub CLI (gh), then sign in with: gh auth login');
  else tool('gh auth status', 'the GitHub CLI is signed in', 'sign in to GitHub with: gh auth login');
  tool('fnm --version', 'fnm is installed', '/sprint-afk-prep runs each repository on its own Node version through fnm: install fnm');
  tool('docker --version', 'Docker is installed', '/sprint-afk-prep proves a migration on a local database: install Docker Desktop');
  say('NOTE', '/sprint-review-prep and a card that needs a browser use the Claude in Chrome extension: install it in Chrome and sign in (this installer cannot see it)');

  const P = ctx.win ? path.win32 : path.posix;
  const lacks = ['Tickets', 'Sprint review', 'Scopes', 'AFK', 'HITL'].filter((d) => !fs.existsSync(P.join(ctx.edge8, d)));
  if (!lacks.length) say('PASS', `the sprint pages have their folders under ${ctx.edge8}`);
  else say('TODO', `the sprint pages are in no repository. Under ${ctx.edge8}, make or copy from the PC that holds them: ${lacks.join(', ')}. Copy only those folders (or name another place with --edge8)`);
  const clone = P.join(ctx.repos, 'global-hubspot');
  if (!fs.existsSync(P.join(clone, '.git'))) say('TODO', `clone the repositories under ${ctx.repos} (global-hubspot first; or name another place with --repos)`);
  else {
    say('PASS', `the clone ${clone} is here`);
    const mods = ['jsdom', 'playwright'].filter((m) => !fs.existsSync(P.join(clone, 'website', 'node_modules', m)));
    if (mods.length) say('TODO', `${clone}: the page checks need ${mods.join(' and ')}; run npm ci in its website folder`);
  }
  const py = ctx.win ? P.join(ctx.home, '.venvs', 'transcribe', 'Scripts', 'python.exe') : P.join(ctx.home, '.venvs', 'transcribe', 'bin', 'python');
  const setup = path.join(env.claude, 'skills', 'sprint-summary-tickets', 'SETUP.md');
  if (fs.existsSync(py) && runs('ffmpeg -version')) say('PASS', 'the transcriber for /sprint-summary-tickets is ready (its Python and ffmpeg)');
  else say('TODO', `/sprint-summary-tickets turns a recording into text with its own Python and ffmpeg: ${setup} says how to prepare them`);
  const memory = P.join(ctx.home, '.claude', 'projects', ctx.slug, 'memory');
  if (fs.existsSync(memory)) say('PASS', `Claude's notes for the recordings folder are at ${memory}`);
  else say('NOTE', `Claude has no notes for the recordings folder yet (${memory}). Nothing to do: the skills make them as you use them`);
}

const VALUE_FLAGS = ['--home', '--owner', '--github', '--email', '--edge8', '--repos', '--captures'];
const PLAIN_FLAGS = ['--check', '--skills-only', '--unattended', '--no-pocock', '--claude-md', '--no-owner', '--help'];
const HELP = `Sprint skills installer

  node "<this folder>/install.mjs" [options]

  (no option)        install or update everything; a second run changes nothing
  --check            change nothing; say what a run would change
  --skills-only      only the three skill folders; no hook, no settings, no machine check
  --unattended       also set auto mode in settings.json when no mode is set there
  --claude-md        also add the two writing rules to CLAUDE.md in the .claude folder
  --no-pocock        do not install Matt Pocock's skills when they are missing
  --owner "<name>"   a teammate: your name as the sprint pages write it (needs --github)
  --github <login>   a teammate: your GitHub login
  --email <address>  a teammate: your HubSpot sign-in
  --no-owner         forget the owner; the skills then speak of Khoi again
  --edge8 <folder>   where your sprint pages are (default: Documents/Edge8 in your home folder)
  --repos <folder>   where your clones are (default: Documents/Repos/Edge8 in your home folder)
  --captures <folder> where your meeting recordings are (default: Videos/Captures in your home folder)
  --home <folder>    a test: use this folder as the home folder

The owner and the folders are remembered in sprint-skills.json in the .claude folder.`;

function main() {
  const argv = process.argv.slice(2);
  const flags = new Set();
  const vals = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (VALUE_FLAGS.includes(a)) {
      if (i + 1 >= argv.length) { console.error(`${a} needs a value`); process.exit(2); }
      vals[a.slice(2)] = argv[++i];
    } else if (PLAIN_FLAGS.includes(a)) flags.add(a.slice(2));
    else { console.error(`unknown option ${a}\n\n${HELP}`); process.exit(2); }
  }
  if (flags.has('help')) { console.log(HELP); return; }

  const home = vals.home ? path.resolve(vals.home) : os.homedir();
  const env = { claude: path.join(home, '.claude'), check: flags.has('check'), test: Boolean(vals.home) };
  const skillsOnly = flags.has('skills-only');

  // What this machine told an earlier run, plus what this run says.
  const cfgFile = path.join(env.claude, 'sprint-skills.json');
  let cfg = {};
  try { cfg = JSON.parse(fs.readFileSync(cfgFile, 'utf8')); } catch { /* first run */ }
  const was = JSON.stringify(cfg);
  if (flags.has('no-owner')) delete cfg.owner;
  if (vals.owner !== undefined) {
    const github = vals.github || (cfg.owner && cfg.owner.github);
    if (!vals.owner.trim() || !github || !/^[A-Za-z0-9-]+$/.test(github)) { console.error('--owner needs a name and --github <your GitHub login>'); process.exit(2); }
    cfg.owner = { name: vals.owner.trim(), github, ...(vals.email || (cfg.owner && cfg.owner.email) ? { email: vals.email || cfg.owner.email } : {}) };
  } else if (vals.github || vals.email) { console.error('--github and --email go with --owner "<your name>"'); process.exit(2); }
  for (const k of ['edge8', 'repos', 'captures']) if (vals[k]) cfg[k] = path.resolve(vals[k]);

  const platform = process.platform === 'win32' ? 'win32' : 'posix';
  let notes = null;
  try {
    const n = path.resolve(PKG, '..', '..', 'Notes');
    if (fs.existsSync(path.join(n, 'Daily Standup.md'))) notes = fs.realpathSync.native(n);
  } catch { /* the package is not inside the vault */ }
  const ctx = makeContext({ platform, home, edge8: cfg.edge8, repos: cfg.repos, captures: cfg.captures, notes, owner: cfg.owner || null });

  console.log(`Sprint skills installer: ${env.check ? 'a check, nothing is changed' : 'install or update'}; home folder ${home}${cfg.owner ? `; owner ${cfg.owner.name}` : ''}`);
  if (!env.check) {
    try {
      fs.mkdirSync(env.claude, { recursive: true });
      if (JSON.stringify(cfg) !== was) fs.writeFileSync(cfgFile, JSON.stringify(cfg, null, 2) + '\n');
      if (!fs.existsSync(ctx.tmp)) { fs.mkdirSync(ctx.tmp, { recursive: true }); say('DONE', `made the scratch folder ${ctx.tmp}`); }
    } catch (e) { say('FAIL', `could not prepare ${env.claude} or ${ctx.tmp}: ${e.message}`); }
  }

  installSkills(ctx, env);
  if (!skillsOnly) {
    try { installHooks(env); } catch (e) { say('FAIL', `the hook scripts: ${e.message}`); }
    try { mergeSettings(env, flags.has('unattended')); } catch (e) { say('FAIL', `settings.json: ${e.message}`); }
    try { readerDocs(env, flags.has('claude-md')); } catch (e) { say('FAIL', `the Reader-facing docs note: ${e.message}`); }
    try { pocock(env, flags.has('no-pocock')); } catch (e) { say('FAIL', `Matt Pocock's skills: ${e.message}`); }
    try { ticketsHelper(env, ctx); } catch (e) { say('FAIL', `the Tickets page helper: ${e.message}`); }
    try { machineChecks(ctx, env); } catch (e) { say('FAIL', `the machine checks: ${e.message}`); }
  }

  const pending = counts.FAIL + (env.check ? counts.DIFF : 0);
  console.log(`\n${counts.DONE} changed, ${counts.PASS} already right, ${counts.DIFF} to change, ${counts.TODO} for you to do, ${counts.FAIL} failed.`);
  if (!env.check && counts.DONE) console.log('Start Claude Code again: it loads a new skill and a new hook at its next start.');
  process.exitCode = Math.min(pending, 100);
}

const isMain = (() => {
  if (!process.argv[1]) return false;
  try {
    const a = pathToFileURL(fs.realpathSync(process.argv[1])).href;
    const b = pathToFileURL(fs.realpathSync(fileURLToPath(import.meta.url))).href;
    return process.platform === 'win32' ? a.toLowerCase() === b.toLowerCase() : a === b;
  } catch { return false; }
})();
if (isMain) main();
