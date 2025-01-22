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

// Common never use cases:
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
## `Object.freeze`
- `Object.freeze` has the same effect as `readonly` for an object, but only for the top-most level. Prefer using `as const` if you want to deeply apply the `readonly` effect:
```ts
const buttonAttributes = Object.freeze({
  cancel: {
    type: "button",
  },
  get: 'it'
});
// Hovering over `buttonAttributes` shows:
// const buttonAttributes = Object.freeze({
//   cancel: {
//     type: string,  << not applied for nested levels
//   },
//   get: 'it'  << applied on top-most level 
// });

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