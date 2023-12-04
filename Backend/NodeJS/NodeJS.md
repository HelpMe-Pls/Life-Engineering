[[Backend/NodeJS/Frameworks]]
[[Databases]]
[[Auth]]
[[APIs]]
[Debugging](https://www.builder.io/blog/debug-nodejs)
# Overview
## Threads and Processes
- A **process** is *an instance* of a computer program that is being executed. It contains the program code and its current activity. Depending on ***the OS***, a process may be made up of multiple threads of execution that execute instructions *concurrently*.
  When you start a Node.js application, the operating system creates a new process for that application. If your Node.js application starts child processes (for example, using the `child_process` module), those are also managed by the operating system.
- A **thread**, on the other hand, is the *smallest sequence* of programmed instructions that can be managed independently by a scheduler, in this case, ***the v8 engine***. In other words, a thread is a single sequence of instructions that can be executed by the CPU.
### Concurrency and Parallelism
- By default (in the traditional sense), Node.js is single-threaded, using an event-driven architecture to handle multiple concurrent tasks. This is achieved through the use of callbacks, promises, and async/await, which allow Node.js to delegate tasks to their corresponding runtime environment concurrently (outside of the main thread) so that it can handle many tasks at once without waiting for each one to complete.
	  Once the asynchronous operation is complete, its result is placed in a queue (also known as the task queue or the callback queue). The event loop, which is a part of the JavaScript runtime, continually checks this queue and pushes the results back onto the main thread to resume the paused execution with that resolved value.
- However, concurrency doesn’t mean that multiple tasks are executing at the exact same time (that's parallelism). It means that the tasks are being started and managed at the same time, but because Node.js is single-threaded, only ***one*** task can be processed ***at a time***.
- The introduction of `worker_threads` in Node.js v12 allows for true parallel execution of tasks. Each worker thread can run on a separate CPU core and has its own event loop and memory space. This means that [*CPU-intensive tasks*](https://nodejs.org/api/worker_threads.html) can be offloaded to a worker thread, allowing them to run in parallel without blocking the main thread.

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

## Implementations
- Checkout the [[Backend/NodeJS/Frameworks |frameworks]].