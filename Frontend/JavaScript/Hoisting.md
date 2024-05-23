- The term "hoisting" is just to simplify the understanding of the "lexical scope" in a way that the majority can get it: think of hoisting as a *visualization* of various actions (namely memory allocation) JS takes in setting up the program **before execution** (compile-time operation of generating runtime instructions). So there's no such thing as "hoisting" semantically.

- `let` and `const` does "hoist" but it a different way: when `var` is "hoisted", it actually assigns `undefined` to the variable at compile time (in the lexical scope), where `let` and `const` are "uninitialized" until the *execution* stack run into that `let` or `const` declaration, which causes the [TDZ error](https://www.freecodecamp.org/news/what-is-the-temporal-dead-zone). That's why it's the best practice to ==always declare your variables before using them==:
```js
console.log(a)  // undefined, because only the DECLARATION is hoisted
console.log(b)  // ReferenceError: Cannot access uninitialized variable.
console.log(c)  // ReferenceError: Cannot access uninitialized variable.

var a = 'some'
let b = 'random'
const c = 'string'
```

- Function ***declarations*** are initialized in the lexical scope, so "Hoisting" function declarations is a good practice because it improves readability.

- Variables are created when their containing lexical environment is instantiated (i.e. when the lexical binding is evaluated, entering the "compile time" phase), that's why *the function expressions are **not** "hoisted"*, because they are evaluated at run time. Therefore, always ==define your function *expressions* **before** you call them.