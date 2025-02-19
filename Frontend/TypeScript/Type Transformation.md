# Deriving types from values
- You **_can_** derive types from values, but not the other way around.
## `keyof`
- Commonly used prevent runtime errors and to create a new type by inferring keys _from a predefined **type**_:
```ts
type User = {
  id: number;
  name: string;
  age: number;
};

const user: User = { id: 1, name: "Alice", age: 25 };

// Without `keyof`:
function getProperty(obj: User, key: string) {
  return obj[key]; // ❌ Error: `key` might not exist in `obj`
}

console.log(getProperty(user, "name")); // Works
console.log(getProperty(user, "email"));  // No autocomplete & runtime error

// To make it work, you may update the type of `key` to be something like:
function getProperty(obj: User, key: 'id' | 'name' | 'age') {
  return obj[key];  // No more error
}
// The problem is that if you have multiple instances of `key` in your codebase where they're tightly coupled with `User` then you'll have to manually edit every 'id' | 'name' | 'age' occurrence whenever there's an update on `User`'s keys. That's where the `keyof` keyword is useful:
// With `keyof`:
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]; // ✅ Now TypeScript ensures `key` is a valid property of `obj`
}

console.log(getProperty(user, "name"));
							// ^ This argument is suggested by TS autocomplete
```
## `typeof`
- Use it to infer types dynamically from _existing **variables**_ and prevent redundant type definitions:
```ts
const user = {
  id: 1,
  name: "Alice",
  age: 25,
};

// Without `typeof`:
type UserType = {
  id: number;
  name: string;
  age: number;
};

const userCopy: UserType = user; // ⚠️ Potential issue: If you update `user`, you must manually update `UserType`

// With `typeof`
type UserType = typeof user; // ✅ Automatically updates in accordance with `user`'s value

//--------------------- Another example:
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
};

function fetchData(url: typeof config.apiUrl, timeout: typeof config.timeout) {
				// ^ string                    ^ number
  console.log(`Fetching from ${url} with timeout ${timeout}`);
}

fetchData(config.apiUrl, config.timeout); // ✅ Type-safe!
fetchData("https://fake.com", 10000); // ✅ Type-safe!
fetchData(123, "slow"); // ❌ Type error!
```
### Use with `keyof`
- To declare new types that are tightly coupled with existing variables, you can also combine `typeof` with `keyof`:
```ts
// Existing variable:
const settings = {
  theme: "dark",
  notifications: true,
  volume: 80,
};

// Without `keyof` and `typeof`:
function updateSetting(key: "theme" | "notifications" | "volume", value: any) {
// Not scalable. For example, if you add a new setting (e.g., `language: "en"`), you must manually update the type of `key`
  settings[key] = value;
}

// With `keyof` and `typeof`:
function updateSetting(key: keyof typeof settings, value: typeof settings[typeof key]) {
  settings[key] = value;
}

updateSetting("theme", "light");      // ✅ Allowed
updateSetting("volume", 50);          // ✅ Valid
updateSetting("language", "English"); // ❌ TypeScript Error! (not existed in `settings`)
updateSetting("theme", 123);          // ❌ TypeScript Error! ("theme" must be a string)
```
### Class, `this` or `enum` as a type
- You don't need to use `typeof` to derive the type from an existing class (same deal for an `enum`). A class is also a type in TS world, therefore, you can directly declare a class name as a type:
```ts
// With class:
class CanvasNode {
  x = 0;
  y = 0;

  move(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

// Instead of this:
const positionFromCanvasNode = (node: typeof CanvasNode) => {
  return {
    x: node.x,
    y: node.y,
  };
};

// Do this:
const positionFromCanvasNode = (node: CanvasNode) => {...};

// Actually, `typeof CanvasNode` refers to the class itself (the constructor function), not the type of a `CanvasNode` instance (which is what we need)
// `node.x` and `node.y` do not exist on the `CanvasNode` class, but on its instances.
// Therefore, `typeof CanvasNode` only makes sense if you pass the class itself as a param:
const createNode = (NodeClass: typeof CanvasNode) => {
  return new NodeClass(); // ✅ Works correctly
};

const newNode = createNode(CanvasNode); // ✅ Creates a new instance

// Edge case with `this` as a return type and as a value:
class CanvasNode {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  move(x: number, y: number): this {  // `this` as a return type
    this.x += x;
    this.y += y;
    return this; // `this` as a value
  }
}

const node = new CanvasNode(0, 0).move(10, 20).move(30, 40);
//     ^ node: CanvasNode

console.log(node)  // CanvasNode {
//                      x: 40,
//                      y: 60,
//                      move: [Function: move],
//                    }

//--------------------------------- With enum:
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

function log(opts: {
  globalLogLevel: LogLevel;  // No need for `typeof LogLevel`
  level: LogLevel; // `typeof LogLevel` refers to the entire `LogLevel` enum object itself, not its values (which is what we need)
  message: string;
}) {
  if (opts.level >= opts.globalLogLevel) {
    console.log(opts.message);
  }
}
```
### Gotcha
- You can define a new type _with the same name_ from an existing value using `typeof`:
```ts
// In utils.ts:
export const Logger = {
  log: (message: string) => {
    console.log(message);
  },
  info: (message: string) => {
    console.info(`INFO: ${message}`);
  },
  warn: (message: string) => {
    console.warn(`WARNING: ${message}`);
  },
  error: (message: string) => {
    console.error(`ERROR: ${message}`);
  },
};

export type Logger = typeof Logger;

// Importing both of them in another file:
import { Logger } from "./utils.ts";

const myApp = (logger: Logger) => {  // Used as a type
  logger.log("Hello");
  logger.info("Hello");
  logger.warn("Hello");
  logger.error("Hello");
};

myApp(Logger);  // Used as a value
```
## Creating types from function
- Use the `Parameters` util type to capture the type from a dynamic param:
```ts
const makeQuery = (
  url: string,
  opts?: {
    method?: string;
    headers?: {
      [key: string]: string;
    };
    body?: string;
  },
) => {};

// Assuming `opts` is dynamic:
type MakeQueryParameters = Parameters<typeof makeQuery>[1]; // This wouldn't work if you're not using `typeof`

const options: MakeQueryParameters = {
// These properties are now suggested by TS Server
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ message: "Hello!" }),
};

makeQuery("https://api.example.com/data", options);
```

- To type your param as a function:
```ts
type Event = "click" | "hover" | "scroll";

type CallbackType = (
  event: Event,
  x: number,
  y: number,
  screenId: number,
) => void;

const listenToEvent = (callback: CallbackType) => {
  callback("click", 0, 0, 1); // ✅ These args are type safe
};

// Just because a function can receive some params doesn't mean it has to handle all of them
listenToEvent(() => {});  // ✅ No error

```

- We can also dynamically infer the _returned type_ of a **function** with the `ReturnType` util. If the function is asynchronous, then wrap the type with `Awaited` to get the actual returned type, not the promise:
```ts
const createUser = (id: string) => {
// Assuming the return value here is dynamic:
  return {
    id,
    name: "John Doe",
    email: "example@email.com",
  };
};

type User = ReturnType<typeof createUser>;

const printUserInfo = (user: User) => {
// `user.` is now suggested by TS Server:
  console.log(`User ID: ${user.id}`);
  console.log(`Name: ${user.name}`);
  console.log(`Email: ${user.email}`);
};

const newUser = createUser("123");
printUserInfo(newUser);

//---------------------------------------------------------
// For async function:
const fetchUser = async (id: string) => {
  return {
    id,
    name: "John Doe",
    email: "example@email.com",
  };
};
// Wrap it with `Awaited`
type User = Awaited<ReturnType<typeof fetchUser>>;
```

> [!Warning]- `Parameters` and `ReturnType` only accepts `typeof` a function, **not** an object.



