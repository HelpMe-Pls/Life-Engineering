// render-check.js — renders each meeting summary headless at phone and desktop width, with
// JavaScript off, and checks what docs/meetings/README.md asks for: no sideways scroll,
// no script or form, no "#" before a digit and no local path in the visible text. It
// also prints the word count. Exit code 1 when any line says FAIL.
//
// Usage: node render-check.js <path to website/node_modules/playwright> <page.html> [more pages]
// On Windows, write each path as C:/Users/... (Git Bash leaves a /c/ path with square
// brackets unconverted).
const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require(process.argv[2]);
const pages = process.argv.slice(3);

(async () => {
  const browser = await chromium.launch();
  let failed = false;
  for (const file of pages) {
    for (const width of [375, 1280]) {
      const ctx = await browser.newContext({
        viewport: { width, height: 900 },
        javaScriptEnabled: false,
      });
      const page = await ctx.newPage();
      await page.goto(pathToFileURL(path.resolve(file)).href);
      const r = await page.evaluate(() => {
        const text = document.body.innerText;
        return {
          scroll: document.documentElement.scrollWidth,
          client: document.documentElement.clientWidth,
          words: text.split(/\s+/).filter(Boolean).length,
          hashDigit: (text.match(/#\d/g) || []).length,
          paths: (text.match(/[A-Za-z]:\\|\/c\/Users|\/Users\//g) || []).length,
          scripts: document.scripts.length,
          forms: document.forms.length,
        };
      });
      const ok =
        r.scroll <= r.client &&
        r.hashDigit === 0 &&
        r.paths === 0 &&
        r.scripts === 0 &&
        r.forms === 0;
      failed = failed || !ok;
      const name = file.replace(/^.*[\\/]/, '');
      console.log(`${ok ? 'PASS' : 'FAIL'} ${width}px ${name} ${JSON.stringify(r)}`);
      await ctx.close();
    }
  }
  await browser.close();
  process.exit(failed ? 1 : 0);
})();
