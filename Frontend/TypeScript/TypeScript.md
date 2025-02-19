[[TypeScript/Fundamentals]]
[[TypeScript/Advanced]]

Check [this](https://profy.dev/article/react-typescript) out.

---
- Get individual types from a type of Array by using 2 dimensional array:
```ts
import type { MenuProps } from 'antd';

type ItemType = MenuItemType | SubMenuType | MenuItemGroupType | MenuDividerType

type MenuItem = MenuProps['items']  // ItemType[] (from the docs)
type MenuItem = MenuProps['items'][number] // MenuItemType | SubMenuType | MenuItemGroupType | MenuDividerType

// If you want to see ALL of MenuItem props:
const item: MenuItem = {
  // Ctrl + Space
}
```

# Gotchas
## Booleans
- `boolean` type should not be inferred from the `Boolean()` function:
```ts
function validateUsername(username: string | null): boolean {
  // The `boolean` type of `isUsernameOK` in this example is NOT related to the `username` param, because it's purely the return type of the `Boolean` function
  // const isUsernameOK = Boolean(username);

  // Whereas in this version, it's actually getting the inferred type from the `username` param
  const isUsernameOK = !!username;

  if (isUsernameOK) {
    return username.length > 5;
  }

  return false;
}
```
- In a `Map`, the `.has()` function just returns a `boolean`, i.e. TS doesn't understand the relationship between `.has` and `.get` on a `Map` like it does with a regular object:
```ts
type Event = {
  message: string;
};

const processUserMap = (eventMap: Map<string, Event>) => {
  if (eventMap.has("error")) {
    const message = eventMap.get("error").message;
						//   ^ Object is possibly 'undefined'.
    throw new Error(message);
  }
};

// We can fix it with optional chaining:
const processUserMap = (eventMap: Map<string, Event>) => {
  if (eventMap.has("error")) {
    const message = eventMap.get("error")?.message;

    throw new Error(message);
  }
};

// Or explicitly check for `undefined` values:
const processUserMap = (eventMap: Map<string, Event>) => {
  // The type of `event` is `Event | undefined`
  const event = eventMap.get("error"); 
  if (event) {
    const message = event.message;  
			     //  ^ `event` now is guaranteed to be of type `Event`

    throw new Error(message);
  }
};
```
## `unknown` vs `any` vs `never`
- `any` basically _skips_ type checking and type suggestion (i.e. as if there's no TS at all)
- `unknown` enforce you to perform type check before using the variable (i.e. a type-safe version of `any`). 
	- `unknown` is like an union of `{}`, `null` and `undefined`
- The `never` type simply means it cannot hold any _value_ (i.e. the `never` type is assignable to every other type - and itself - but not the other way around). It's the "smallest" type in the type hierarchy:
```ts
const x: unknown = "hello";    // It's like the "top type" in the type hierarchy, i.e. it can receive values of any type
x.toLowerCase(); // ERROR: Object is of type 'unknown'
if (typeof x === "string") { // `unknown` requires type checking before use
   x.toLowerCase(); // OK
}
//------------------------ `any` ---------------------------- 
// `any` bypasses type checking completely
const y: any = "hello";
y.toLowerCase(); // OK
y.nonExistentMethod(); // No error, but WILL FAIL at runtime

//----------------------- `never` ---------------------------- 
const z: never = "hello";  // ERROR: Type `string` is not assignable to type `never`

// Common `never` use cases:
const throwError = (message: string) => {
  throw new Error(message);
};

const handleSearchParams = (params: { id: string }) => {
// The type of `throwError` is inferred as `never` 
  const id = params.id || throwError("No id provided");  

  return id;  // Guaranteed to be of type `string`
};

function infiniteLoop(): never {
   while (true) {}    // Never terminates
}

// The type of an empty array is inferred as `never[]`, because TS is inferring the element type from the array's contents:
const emptyArray: never[] = [];  

// Type guard resulting in `never`
function processValue(val: string | number) {
   if (typeof val === "string") {
       // `val` is `string`
   } else if (typeof val === "number") {
       // `val` is `number`
   } else {
       val;  // val is `never` (exhaustive check, i.e. the code never reaches this block)
   }
}

// Impossible type intersection becomes `never`:
const objOfFunctions = {
  string: (input: string) => input.toUpperCase(),
  number: (input: number) => input.toFixed(2),
  boolean: (input: boolean) => (input ? "true" : "false"),
};

const format = (input: string | number | boolean) => {
  const inputType = typeof input as "string" | "number" | "boolean";
  const formatter = objOfFunctions[inputType];

// The expected type of `input` is a union, however, when it's used as an argument, TS needs to ensure that `input` is simultaneously valid for ALL types in that union, i.e. `string & number & boolean`, and since there's no type can represent that, it resolves to `never`
  return formatter(input);  ❌
//                  ^ Argument of type 'string | number | boolean' is not assignable to parameter of type 'never'
// One way to fix it is to EXPLICITLY assert its type `as never`. This works because `never` is assignable to `string` AND `number` AND `boolean`:
  return formatter(input as never);  ✅
};
```
### Evolving `any`
- When declaring a variable with `let`, the TS Server will infer its type based on the value assigned to it. But if you want the variable's type to be dynamically inferred according to its new assignments, you should separate the variable declaration and assignment:
```ts
let selectedId = 123;
//   ^ number

selectedId = "123";  // ❌ Type `string` is not assignable to type `number`

// To fix it:
let selectedId;
//   ^ any

selectedId = 123;
console.log(typeof selectedId)  // number

selectedId = '123';
console.log(typeof selectedId)  // string
```

## Object properties inference
- Prefer letting TS infer the type for your object properties to clean up your code:
```ts
type ButtonAttributes = {
  type: "button" | "submit" | "reset";
};

const modifyButton = (attributes: ButtonAttributes) => {};

// Prefer this:
modifyButton({
  type: "button",
});

// Over this:
const buttonAttributes: ButtonAttributes = {
  type: "button",
};

modifyButton(buttonAttributes);
```

## `JSON.parse()`
- Functions like `JSON.parse()` return `any` by default. Use the `@total-typescript/ts-reset` package to make sure the return type of `JSON.parse()` complies with a predefined type:
```ts
// Prefer this:
import '@total-typescript/ts-reset'

const getObj = () => {
  const obj = JSON.parse('{ "a": 123, "ss": 456 }')
  
  return obj;
};

const res = getObj()
if (res && typeof res == 'object' && 'b' in res) {
  console.log(res.b)
}

//------------------------------------------------
// Over this:
type Res = {
    a: number;
    b: number;
}
const getObj = () => {
// We're casting `obj` as `Res`, which may not as accurate as the `if` check above, since the argument of `JSON.parse()` is usually dynamic
  const obj = JSON.parse('{ "a": 123, "ss": 456 }') as Res
  
  return obj;
};
```
## `Object.freeze`
- `Object.freeze` has the same effect as applying `readonly` for an object, but only for the top-most level. Prefer using `as const` if you want to deeply apply the `readonly` effect:
```ts
const buttonAttributes = Object.freeze({
  cancel: {
    type: "button",
  },
  get: 'it'
});
// Hovering over `buttonAttributes` shows:
// const buttonAttributes: Readonly<{
//   cancel: {
//     type: string,  << not applied for nested levels
//   },
//   get: 'it'  << applied on top-most level 
// }>;

// Use `as const` instead:
const buttonAttributes = Object.freeze({
  cancel: {
    type: "button",
  },
  get: 'it'
}) as const;
// Hovering over `buttonAttributes` shows:
// const buttonAttributes = {
//   readonly cancel: {
//     readonly type: "button",
//   },
//   readonly get: "it"
// });
```
## `Object.keys()` and `Object.entries()`
- Their returned values are loosely inferred (i.e. widen to the primitive type). To get type safety, add type annotation:
```ts
interface User {
  id: number;
  name: string;
}

const users = [
  {
    name: "Waqas",
  },
  {
    name: "Zain",
  },
];

const usersWithIds: User[] = users.map((user, index) => ({
  ...user,
  id: index,
  age: 30,
}));

const userKeys = usersWithIds.map((user) => {
  const keys = Object.keys(user);
//       ^ string[]
  
  const entries = Object.entries(user)
//       ^ [string, any][]
  return;
});

// We'll have to manually add type annotation to make it work:
// Prefer this approach to strictly conform to the defined interface:
function printUser(user: User) {   
  Object.keys(user).forEach((key) => {
    console.log(user[key as keyof User]);  // type assertion
  });
}

// This approach is less intuitive (because we're working around the widen type of `Object.keys()`, not the strict `User` interface), but it still works:
function printUser(user: Record<string, any>) {
  Object.keys(user).forEach((key) => {
    console.log(user[key]);
  });
}
```

## Empty object
- The empty object type (`{}`) is a subtype of `unknown` where every other types is assignable to it except `null` and `undefined`:
```ts
const acceptAnythingExceptNullOrUndefined = (input: {}) => {};

// No errors:
acceptAnythingExceptNullOrUndefined("hello");
acceptAnythingExceptNullOrUndefined(42);
acceptAnythingExceptNullOrUndefined(true);
acceptAnythingExceptNullOrUndefined(Symbol("foo"));
acceptAnythingExceptNullOrUndefined({});
acceptAnythingExceptNullOrUndefined([]);
acceptAnythingExceptNullOrUndefined(() => {});
acceptAnythingExceptNullOrUndefined(/foo/);
acceptAnythingExceptNullOrUndefined(new Error("foo"));

// `null` and `undefined` are not assignable to `{}`:
acceptAnythingExceptNullOrUndefined(null);
acceptAnythingExceptNullOrUndefined(undefined);
```

- If you want to strictly type some variable as an empty object (i.e. only receives `{}` as its value), then use `Record<PropertyKey, never>` (value as `never` to indicate that there's no value):
```ts
type EmptyObject = Record<PropertyKey, never>;
// This also works (and more descriptive):
//  declare const key: unique symbol;
//  type EmptyObject = { [key]?: never };

const acceptOnlyEmptyObject = (input: EmptyObject) => {};

// No error
acceptOnlyEmptyObject({});

// Error for every single one of them
acceptOnlyEmptyObject({a: 1});
acceptOnlyEmptyObject("hello");
acceptOnlyEmptyObject(42);
acceptOnlyEmptyObject(true);
acceptOnlyEmptyObject(Symbol("foo"));
acceptOnlyEmptyObject([]);
acceptOnlyEmptyObject(() => {});
acceptOnlyEmptyObject(/foo/);
acceptOnlyEmptyObject(new Error("foo"));
acceptOnlyEmptyObject(null);
acceptOnlyEmptyObject(undefined);
```

# Directives
## `@ts-ignore`
- Use this when you _consciously_ want to silently suppresses _all_ TS errors on **the line** of code that follows it:
```ts
const handleFormData = (e: SubmitEvent) => {
  e.preventDefault();
  const data = new FormData(
    // @ts-ignore
    EVENT.target,  // No error thrown, even though `EVENT` is `undefined`
  );
  const value = Object.fromEntries(data.entries());
  return value;
};
```
- Prefer casting your type with `as any` than using this. Only use this if you still can't work your way with `@ts-expect-error`.
## `@ts-expect-error`
- Works similar to `@ts-ignore`, except that there'll be a red squiggly line under it if there's **_no_** error on the line of code that follows it:
```ts
const handleFormData = (e: SubmitEvent) => {
  e.preventDefault();
  const data = new FormData(
    // @ts-expect-error
    e.target, // Supposed to throw an error like: "Argument of type 'EventTarget | null' is not assignable to parameter of type 'HTMLFormElement | undefined'."
  );
  const value = Object.fromEntries(data.entries());
  return value;
};

// Red squiggly line under `@ts-expect-error` when there's no TS error
// @ts-expect-error 
const str = "abc"
```
- It's best practice to use this with a comment to _explain your intention_, because the expected error from this directive is not narrowed down to its corresponding specific error, it just works for _any_ kind of TS error.
## `@ts-nocheck`
- Disable TS for the entire file (your file will behave as if it's written in JS). `@ts-nocheck` _**must**_ be placed on the very first line of the file.
- Not recommended. Only use this as your last resort.

# Modules, scripts and declaration files
- A module is a _file_ containing code that is executed _within_ its own scope, not in the global scope (i.e. variables, functions, or types defined in a module are not accessible outside the module _unless **explicitly** exported_).
	- In other words, a file becomes a module _if_ it contains an `import` or `export` statement.
```ts
// module-1.ts
export {};
const myModuleFunc = () => {}; // this function is NOT exported, it remains private to `module-1.ts`

export const myUtilFunc = () => {} // this function IS exported, so it's available to other modules

// module-2.ts
import { myUtilFunc } from "./module-1";
myModuleFunc();  // Will NOT work because `myModuleFunc` is only available WITHIN the scope of `module-1.ts` (not the global scope)

myUtilFunc()   // Works
```

- Scripts, on the other hand, execute in the global scope. Every `.ts` file is a script be default until we add `import/export` to it. Anything defined in a script is available globally:
```ts
// Notice that there's NO `import/export` in both of these files, otherwise they'll become modules
// script-1.ts
const myFunc = () => {
  console.log("Hello!");
};

// script-2.ts
myFunc();  // Works without importing as it's in the global scope
```

> [!info] Add the `"moduleDetection": "force"` to your `tsconfig.json` file to treat every `.ts` or `.tsx` file (**except** declaration files) in your codebase as **module**.
 #
## Declaration files
- Declaration files (with `.d.ts` extension) are where you declare the types for TypeScript:
```ts
// types.d.ts
export type MyType = string;

export interface MyInterface {
  myProp: string;
}

export const myFunc = () => {}; // ❌ Not a type, so TS throws an error
```
- Declaration files are globally available (behave as scripts) unless you explicitly declare the file _as a module_ by using an empty export (`export {}`):
```ts
// treated-as-script.d.ts
type GloballyAvailable = string;

// index.ts
type Example = GloballyAvailable   // ✅ Valid

//--------------------------------------
// treated-as-module.d.ts
export type AvailableViaImport = string;
type NotAvailableViaImport = number;
export {};

// index.ts
import { AvailableViaImport, NotAvailableViaImport} from "./treated-as-module";
//                            ^ ❌ TS Error

//--------------------------------------
// treated-as-script-and-module.d.ts
export type AvailableViaImport = string;
type StillAvailableViaImport = number;

// index.ts
import {AvailableViaImport, StillAvailableViaImport} from "./treated-as-module";
//                             ^ ✅ Valid
```
### Declaring a JS file 
- To import the content from a `.js` to a `.ts` or `.tsx` file, you'll have to create a declaration file for that `.js` file, with the same name:
```ts
// example.js
export const myFunc = () => {
  return "Hello World!";
};

// example.d.ts
export function myFunc(): string;  // Add typings to your JS functions

export {};

// index.ts
import { myFunc } from "./example"; // ✅ Without the `example.d.ts` file, this would throw an error

myFunc();
```
### `declare`
- The `declare` keyword allows you to specify the _**type**_ of the external entities (variables, functions,...). It provides a clean way to define the external API of a library (or some global variable) without modifying its source.
	- It's like telling TS: "Trust me, this thing exists at runtime."
	- It offers the same benefit as having a `.d.ts` file without creating one.
```ts
// some-external-lib.js (loaded separately and only available at runtime)
function doSomething(message) {
  console.log("Doing something with: " + message);
}

//---------------------------------------------
// app.ts
// Inform TS about the global function:
declare function doSomething(message: string): void;

doSomething("Hello, world!"); // ✅ Type safe now
```

- To make a variable declared with `declare` available globally, either use the `declare global` syntax or create a `.d.ts` for it:
```ts
// Using `declare global`:
// index.ts
declare global {
  const DEBUG: {
    getState(): { id: string };
  };
}

const state = DEBUG.getState(); // ✅ Type safe

// other-file.ts
const otherState = DEBUG.getState(); // ✅ Type safe

// Creating another declaration file (prefer this approach for better maintainability):
// declare.d.ts
declare const DEBUG: {
  getState(): { id: string };
};

// other-file.ts
const someOtherState = DEBUG.getState(); // ✅ Type safe
```
