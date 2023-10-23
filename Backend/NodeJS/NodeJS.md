[[Backend/NodeJS/Frameworks]]
[[Databases]]
[[Auth]]
[[APIs]]
[Debugging](https://www.builder.io/blog/debug-nodejs)
# Overview
## File I/O
### Write file
- By default, `fs.writeFile()` will ***replace*** the contents of the file if it already exist and create a new file otherwise.
- Async approach (highly recommended):
```ts
// Prefer this approach, using async - await:
const fs = require('fs/promises');

async function example() {
  try {
    const content = 'Some content!';
    await fs.writeFile('/Users/joe/test.txt', content);
    // Do some with the new `test.txt` file
  } catch (err) {
    console.error(err);
  }
}
example();

// Over this callback-approach, notice the difference in the `require()`:
const fs = require('fs');

const content = 'Some content!';

fs.writeFile('/Users/joe/test.txt', content, err => {
  if (err) {
    console.error(err);
  }
  // file written successfully
});
```

- Synchronous approach:
```ts
const fs = require('fs');

const content = 'Some content!';

try {
  fs.writeFileSync('/Users/joe/test.txt', content);
  // file written successfully
} catch (err) {
  console.error(err);
}
```

- Prefer the async approach in most cases. Only opt for the sync approach when your use case requires the file to be written in a single, uninterrupted operation or where the program's execution waits until the write operation is complete
- If you want to add more content to an existing file, use `fs.appendFile()`:
```ts
const fs = require('fs/promises');

async function example() {
  try {
    const content = 'Some content!';
    await fs.appendFile('/Users/joe/test.txt', content);
  } catch (err) {
    console.log(err);
  }
}
example();

// Using `fs.writeFile()` with the `a+` flag also does the trick, but prefer `fs.appendFile()` for better readability:
const fs = require('fs/promises');

async function example() {
  try {
    const content = 'Some content!';
    await fs.writeFile('/Users/joe/test.txt', content, { flag: 'a+' });
  } catch (err) {
    console.log(err);
  }
}
example();
```

- For large files, use `fs.createWriteStream()`:
```ts
const fs = require("fs");

const writeStream = fs.createWriteStream("stream_file.txt");

const data = [];
for (let i = 0; i < 1000000; i++) {
  data.push(i);

  // Write the data to the file as soon as it becomes available.
  writeStream.write(Buffer.from(data.shift()));
}

writeStream.end();
```
### Read file
- Same as `fs.writeFile`, with the main difference is the returned file is an argument in the callback approach:
```ts
// Perfer this:
const fs = require('fs/promises');

async function example() {
  try {
    const data = await fs.readFile('/Users/joe/test.txt', { encoding: 'utf8' });
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}
example();

// Over this:
const fs = require('fs');

fs.readFile('/Users/joe/test.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});
```

- The `fs.readFile()` function buffers the entire file. To minimize memory costs, when possible prefer streaming via `fs.createReadStream()`.