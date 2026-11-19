// page-check.js — checks a sprint page (Sprint Tickets [YNN Sprint NN].html) against the page
// of the sprint before it and against the markup that /sprint-afk-prep and the Tickets save
// helper read. Prints one PASS or FAIL line per check and one INFO line with the cards and
// HT per assignee. Exit code 1 when any line says FAIL.
//
// Usage: node page-check.js <path to website/node_modules/jsdom> <the page> <the previous page>
// On Windows, write both page paths as C:/Users/... (Git Bash leaves a /c/ path with square
// brackets unconverted).
const fs = require('fs');
const { JSDOM } = require(process.argv[2]);
const [newPath, oldPath] = process.argv.slice(3);

let failed = false;
function line(ok, what, detail) {
  failed = failed || !ok;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${what}${!ok && detail ? ': ' + detail : ''}`);
}
const few = (list) => list.slice(0, 6).join('; ') + (list.length > 6 ? `; and ${list.length - 6} more` : '');

function load(file) {
  const raw = fs.readFileSync(file);
  const text = raw.toString('utf8');
  const crlf = (text.match(/\r\n/g) || []).length;
  const lf = (text.match(/\n/g) || []).length - crlf;
  const norm = text.replace(/\r\n/g, '\n');
  const headEnd = norm.indexOf('</head>');
  const scriptStart = norm.indexOf('<script>', headEnd);
  return {
    bom: raw[0] === 0xef && raw[1] === 0xbb && raw[2] === 0xbf,
    crlf,
    lf,
    norm,
    headLines: norm.slice(0, headEnd).split('\n').length - 1,
    head: norm.slice(0, headEnd).replace(/<title>[\s\S]*?<\/title>/, ''),
    title: (norm.match(/<title>([\s\S]*?)<\/title>/) || ['', ''])[1].trim(),
    body: norm.slice(headEnd, scriptStart),
    script: norm.slice(scriptStart),
  };
}

const page = load(newPath);
const prev = load(oldPath);

// The file itself.
line(!page.bom, 'no BOM');
const kind = page.crlf && page.lf ? 'mixed' : page.crlf ? 'CRLF' : 'LF';
const prevKind = prev.crlf >= prev.lf ? 'CRLF' : 'LF';
line(kind === prevKind, 'line endings like the previous page', `${kind} here, ${prevKind} there`);
line(page.head === prev.head, 'head equal to the previous page but for the title');
line(page.script === prev.script, 'page script equal to the previous page');
const sprint = (newPath.match(/Sprint (\d+)\]/) || [])[1];
line(page.title === `Sprint ${sprint} Tickets`, 'title names the sprint in the file name', page.title);

// The cards.
const doc = new JSDOM(page.norm).window.document;
const people = JSON.parse((page.script.match(/var PEOPLE = (\[[^\]]*\])/) || ['', '[]'])[1]);
const LABEL = { todo: 'TO DO', doing: 'DOING', waiting: 'WAITING', done: 'DONE' };
const cards = [...doc.querySelectorAll('article.ticket')];
const bad = [];
const nums = new Set();
const ids = new Set();
const tally = {};
for (const card of cards) {
  const num = ((card.querySelector('span.num') || {}).textContent || '?').trim();
  const say = (msg) => bad.push(`Card ${num} ${msg}`);
  if (card.id !== `card-${num}`) say(`has the id ${card.id}`);
  if (nums.has(num)) say('uses its number twice');
  nums.add(num);
  if (!((card.querySelector('h2') || {}).textContent || '').trim()) say('has no title');

  const statuses = card.querySelectorAll('span.status');
  const assignees = card.querySelectorAll('span.assignee');
  const stamps = card.querySelectorAll('span.updated');
  if (statuses.length !== 1) say(`has ${statuses.length} status chips`);
  if (assignees.length !== 1) say(`has ${assignees.length} assignee spans`);
  if (stamps.length !== 1) say(`has ${stamps.length} Last updated spans`);
  const [status, assignee, stamp] = [statuses[0], assignees[0], stamps[0]];

  let key;
  if (status) {
    key = Object.keys(LABEL).find((k) => status.classList.contains(k));
    if (!key) say('has a status chip with no known status');
    else if (status.textContent.trim() !== LABEL[key]) say(`says ${status.textContent.trim()} on a ${key} chip`);
    for (const word of ['waiting', 'done']) {
      if (card.classList.contains(word) !== (key === word)) say(`has an article class that disagrees with its ${key} chip`);
    }
  }
  if (stamp) {
    const at = stamp.getAttribute('data-updated') || '';
    const shown = ((stamp.querySelector('b') || {}).textContent || '').trim();
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/.test(at)) say(`has data-updated ${at || 'missing'}`);
    if (!/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) \d{1,2} (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec), \d{2}:\d{2}$/.test(shown)) say(`shows Last updated as ${shown || 'nothing'}`);
  }
  const owners = assignee && assignee.hasAttribute('data-assignees') ? assignee.getAttribute('data-assignees') : null;
  if (assignee && owners === null) say('has no data-assignees');
  for (const name of (owners || '').split(',').map((s) => s.trim()).filter(Boolean)) {
    if (!people.includes(name)) say(`is assigned to ${name}, who is not in the page script`);
  }
  const cardIds = [status, assignee, stamp].filter(Boolean).map((el) => el.getAttribute('data-card'));
  if (new Set(cardIds).size !== 1 || !cardIds[0]) say(`has data-card values ${cardIds.join(', ')}`);
  else if (ids.has(cardIds[0])) say(`shares the data-card ${cardIds[0]}`);
  ids.add(cardIds[0]);

  let ht = NaN;
  let due = '';
  for (const field of card.querySelectorAll('span.field')) {
    const b = ((field.querySelector('b') || {}).textContent || '').trim();
    if (/^\s*HT/.test(field.textContent)) ht = parseFloat(b);
    if (/^\s*Due/.test(field.textContent)) due = b;
  }
  if (!(ht > 0)) say('has no HT');
  if (!due) say('has no Due day');

  const done = card.querySelector('.desc strong');
  if (!done || done.textContent.trim() !== 'Done:') say('does not open with a Done: statement');
  const stepsHead = [...card.querySelectorAll('h3')].find((h) => h.textContent.trim() === 'Acceptance steps');
  const list = stepsHead && stepsHead.nextElementSibling;
  if (!list || list.tagName !== 'OL' || !list.children.length) say('has no Acceptance steps list');
  else {
    for (const li of list.children) {
      const first = li.firstElementChild;
      if (!first || !first.matches('span.who') || !li.textContent.trim().startsWith(first.textContent.trim())) {
        say('has a step that does not start with its owner');
        break;
      }
    }
  }
  const who = (owners || '').trim() || 'nobody';
  tally[who] = tally[who] || { cards: 0, ht: 0 };
  tally[who].cards += 1;
  tally[who].ht += ht > 0 ? ht : 0;
}
line(cards.length > 0 && bad.length === 0, `${cards.length} cards keep the markup contract`, few(bad));

// The chip rows, in the file's text: Prettier must not be able to split a span.
const lines = page.body.split('\n');
const rowBad = [];
let rows = 0;
for (let i = 0; i < lines.length; i++) {
  if (!lines[i].includes('<div class="t-fields">')) continue;
  rows += 1;
  const at = (n) => `line ${n + 1 + page.headLines}`;
  if ((lines[i - 1] || '').trim() !== '<!-- prettier-ignore -->') rowBad.push(`${at(i)} has no prettier-ignore above it`);
  for (let j = i + 1; j < lines.length && lines[j].trim() !== '</div>'; j++) {
    if (!/^<span .*<\/span>$/.test(lines[j].trim())) rowBad.push(`${at(j)} is not one whole span`);
  }
}
line(rows === cards.length && rowBad.length === 0, 'each chip row is under prettier-ignore, one whole span per line', few(rowBad) || `${rows} rows for ${cards.length} cards`);

const opened = (page.body.match(/<span[\s>]/g) || []).length;
const closed = (page.body.match(/<\/span\s*>/g) || []).length;
line(opened === closed, 'span tags balance in the body', `${opened} opened, ${closed} closed`);

// A message box (<pre>) holds plain text as it is sent, so a raw apostrophe is right there.
const prose = page.body.replace(/<!--[\s\S]*?-->/g, '').replace(/<pre[\s>][\s\S]*?<\/pre\s*>/g, '').replace(/<[^>]*>/g, '');
const apostrophes = (prose.match(/'/g) || []).length;
line(apostrophes === 0, 'every apostrophe outside a message box is &rsquo;', `${apostrophes} raw`);

// The waiting list.
const parked = doc.querySelector('section.parked');
const parkedBad = [];
let waiting = 0;
if (!parked) parkedBad.push('no section.parked');
else {
  const h2 = ((parked.querySelector('h2') || {}).textContent || '').trim();
  if (h2 !== 'Waiting outside the sprint') parkedBad.push(`its heading reads ${h2 || 'nothing'}`);
  for (const li of parked.querySelectorAll('ul > li')) {
    waiting += 1;
    const lead = li.firstElementChild;
    const bold = lead && lead.tagName === 'B';
    const text = bold ? lead.textContent.replace(/\s+/g, ' ').trim() : '';
    // The closing line carries an earlier page's list whole: its lead links to that page and names no owner.
    const carries = bold && lead.querySelector('a[href*="Sprint"]');
    if (!carries && !/\([^()]+\)\.?$/.test(text)) parkedBad.push(`line ${waiting} names no owner in brackets: ${li.textContent.replace(/\s+/g, ' ').trim().slice(0, 50)}`);
  }
}
line(parkedBad.length === 0, 'each waiting line opens with a bold lead that names its owner, or links to an earlier page', few(parkedBad));

const per = Object.keys(tally).map((who) => `${who} ${tally[who].cards} (${tally[who].ht} HT)`).join(', ');
console.log(`INFO ${cards.length} cards: ${per}; ${waiting} waiting lines`);
process.exit(failed ? 1 : 0);
