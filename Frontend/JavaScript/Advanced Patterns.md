# async - await
- First of all, it displays the asynchronous flow in a synchronous - easy to read manner. Consider this example:
```ts
// Example: Read a file and change its content and read
// it again using callback-based API:
const fs = require('fs');

const fileName = '/Users/joe/test.txt';
fs.readFile(fileName, 'utf8', (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(data);
  const content = 'Some content!';
  fs.writeFile(fileName, content, err2 => {
    if (err2) {
      console.log(err2);
      return;
    }
    console.log('Wrote some content!');
    fs.readFile(fileName, 'utf8', (err3, data3) => {
      if (err3) {
        console.log(err3);
        return;
      }
      console.log(data3);
    });
  });
});
//---------------------------------------

// Using async - await:
const fs = require('fs/promises');

async function example() {
  const fileName = '/Users/joe/test.txt';
  try {
    const data = await fs.readFile(fileName, 'utf8');
    console.log(data);
    const content = 'Some content!';
    await fs.writeFile(fileName, content);
    console.log('Wrote some content!');
    const newData = await fs.readFile(fileName, 'utf8');
    console.log(newData);
  } catch (err) {
    console.log(err);
  }
}
example();
```

- Besides, instead of the `function *main(){}` declaration, we declare with the `async function main(){}` form. And instead of `yield`ing a promise, we `await` the promise. The keyword `async` before a function means that function ***always*** returns a promise (i.e. its return values are automatically wrapped in a *resolved* promise).
  The `await` operator is used to wait for a `Promise`. It's mostly used ***inside*** an `async function` within regular JavaScript code (i.e. if we try to use `await` in a non-async function, there would be a syntax error). Occasionally, it's used on its own with JavaScript modules:

```js
async function wait() {
  await new Promise(resolve => setTimeout(resolve, 1000));

  return "Done.";
}

(function f() {
  wait().then(res => console.log(res));
})() // prints "Done." after 1s



//---------- Top-level `await` ----------
// users.js
export const users = await fetch('/users/lists');

// usage.js
import { users } from "./users.js";

// this module will wait for `users` (in `users.js`) to be fullfilled prior to executing any following code:
console.log(users);
```

- We can (and should) use `async` - `await` to replace Promise chaining (with `.then()` method) to enhance readability.

- When we use `async/await`, we rarely need `.then`, because `await` handles the waiting for us. We can also use a regular `try..catch` instead of `.catch`:

```js
(async function f() {
  try {
    let response = await fetch('/no-user-here');
    let user = await response.json();
  } catch(err) {
    // catches errors both in fetch and response.json
    console.log(err);
  }
})()
```