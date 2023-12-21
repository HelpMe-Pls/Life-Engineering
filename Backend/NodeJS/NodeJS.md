[[Backend/NodeJS/Frameworks]]
[[Databases]]
[[Auth]]
[[APIs]]
[Debugging](https://www.builder.io/blog/debug-nodejs)
# Overview
## Threads and Processes
- A **process** is *an instance* of a computer program that is being executed. It contains the program code and its current activity. Depending on ***the OS***, a process may be made up of multiple threads of execution that execute instructions *concurrently*.
  When you start a Node.js application, the operating system creates a new process for that application. If your Node.js application starts child processes (for example, using the `child_process` module), those are also managed by the operating system.
- A **thread**, on the other hand, is the *smallest sequence* of programmed instructions that can be managed independently by a scheduler, in this case, ***the v8 engine*** (which Node.js is built on). In other words, a thread is a single sequence of instructions that can be executed by the CPU.
### Concurrency and Parallelism
- By default (in the traditional sense), Node.js is single-threaded, using an event-driven architecture to handle multiple concurrent tasks. This is achieved through the use of callbacks, promises, and async/await, which allow Node.js to delegate tasks to their corresponding runtime environment concurrently (outside of the main thread - i.e. *the callstack*) so that it can handle many tasks at once without waiting for each one to complete.
	- The call stack primarily handles synchronous tasks and operates on one function at a time, and each function must complete before the next one below it on the stack can continue (e.g. If a function calls another function, the second function is then pushed onto the stack on top of the first one, then the second function must finish executing *before* the first one can resume). This is why long-running synchronous tasks can block the stack and make the application unresponsive until they are completed. 
	- The asynchronous operations are handled by a queue (also known as the microtask queue - for promises, or the callback queue - for `setTimeout` or other event handlers). The event loop, which is a part of the JavaScript runtime, continually monitors these queues and pushes their results back onto the main thread (right when it's empty, i.e. a function on the callstack has returned something) to resume the paused execution with that resolved value.
	- Asynchronous tasks, promises for instance, are initially pushed onto the call stack, but when they reach an `await`, they are paused and popped of the callstack, then their continuation is handled in the microtask queue and will be pushed onto the callstack later when it's empty, allowing the callstack continue with other operations while waiting for the said asynchronous operation to complete, therefore, utilizes the use of resources and keeps the application responsive.
- However, concurrency doesn’t mean that multiple tasks are executing at the exact *same* time (that's parallelism). It means that the tasks are being started and managed at the same time, but because Node.js is single-threaded, only ***one*** task (on the ***callstack***) can be processed ***at a time***.
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