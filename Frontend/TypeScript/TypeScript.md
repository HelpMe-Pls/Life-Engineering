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
- The `never` type simply means it cannot hold any _value_ (i.e. the `never` type is assignable to every other type - and itself - but not the other way around):
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