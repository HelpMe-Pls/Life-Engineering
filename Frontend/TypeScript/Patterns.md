Check [this](https://www.npmjs.com/package/type-fest) out.
[TSConfig](https://www.totaltypescript.com/tsconfig-cheat-sheet?ck_subscriber_id=2036870503)

----
# `DistributiveOmit`
## The problem
- Suppose we're having 3 types:
```ts
type Album = {
  id: string; // same per type
  title: string; // same per type
  genre: string; // unique
};

type CollectorEdition = {
  id: string; // same per type
  title: string; // same per type
  limitedEditionFeatures: string[]; // unique
};

type DigitalRelease = {
  id: string; // same per type
  title: string; // same per type
  digitalFormat: string; // unique
};
```
- And we want to *extract* a new `MusicProductWithoutId` type out of the combination of those 3:
```ts
type MusicProduct = Album | CollectorEdition | DigitalRelease;
type MusicProductWithoutId = Omit<MusicProduct, "id">;

// Expected:
type ExpectedMusicProductWithoutId =
  | Omit<Album, "id">
  | Omit<CollectorEdition, "id">
  | Omit<DigitalRelease, "id">;

// Actual:
type ActualMusicProductWithoutId = {
  title: string;
};
```
- The technical reason for this is that `Omit` _**and**_ `Pick` are not distributive. 
- This means that when you use them with a union type, they don't operate individually on each union member. So to work around it:
```ts
type DistributiveOmit<T, K extends PropertyKey> = T extends any
  ? Omit<T, K>
  : never;

// Now it works: 
type MusicProductWithoutId = DistributiveOmit<MusicProduct, "id">;

// type MusicProductWithoutId =
//   | {
//       title: string;
//       genre: string;
//     }
//   | {
//       title: string;
//       limitedEditionFeatures: string[];
//     }
//   | {
//       title: string;
//       digitalFormat: string;
//     };
```
# `Prettify`
- Use this when you want to fully show the intersected types or interfaces:
```ts
type Admin = {
    id: string
    name: string
}

type User = {
    id: string
    gender: string[]
}
  
type Guest = {
    name: string
    age: number
}

// Shown as-is when you hover over it
type Intersected = Admin & User & Guest 
// interface Intersected extends Admin, User, Guest {}

type Prettify<T> = {
    [K in keyof T]: T[K]
} & {}

type ShowIntersected = Prettify<Intersected>
// When you hover over `ShowIntersected`:
// type ShowIntersected = {
//     id: string;
//     name: string;
//     gender: string[];
//     age: number;
// }
```
# Resolved union of same type
- When you want to allow any string, but still give suggestions for known string literals, you can use `string & {}`:
```tsx
// No string literal suggestions with this approach:
type Color = "primary" | "secondary" | string; // Resolved to `type Color = string`

// Existing string literal is now suggested:
type Color = "primary" | "secondary" | (string & {});

// Example usage:
type IconProps = {
  color: Color;
};

const Icon = ({ color }: IconProps) => {
  // ...
};
<Icon color="" />; // "primary" & "secondary" is suggested here after applying the `string & {}` trick
```
- Notice that this is just a temporary fix. Someday, `string | "literal"` will just work.

# Indexed Access Types
- Use this `T[number]` pattern to extract the element's type by accessing the numeric keys from an object. For example:
```ts
const roles = ["admin", "editor", "contributor"] as const; // `as const` makes TypeScript infer the literal values of the array

type RolesAsType = typeof roles;

type Role = RolesAsType[number];

// 🚁 Hovering over `Role` shows...
type Role = "admin" | "editor" | "contributor"

//-------------- Extract only the numeric values from the object:
type ExampleObj = {
  // String keys
  stringKey1: "string-key";
  stringKey2: "string-key";

  // Numeric index signature
  [key: number]: "number-key";
};

type NumericValuesOnly = ExampleObj[number];

// 🚁 Hovering over `NumericValuesOnly` shows...
type NumericValuesOnly = "number-key"

//-------------- Extract the type of the elements in an array:
const possibleResponses = [
  {
    status: 200,
    body: "Hello, world!",
  },
  {
    status: 404,
    body: "Not found",
  },
  {
    status: 500,
    body: "Internal server error",
  },
];

type PossibleResponse = PossibleResponses[number];

// 🚁 Hovering over `PossibleResponse` shows...
type PossibleResponse = {
    status: number;
    body: string;
}

type NavbarProps = {
  onChange: () => void;
};

//-------------- Extract a property's type from an object:
type OnChangeType = NavbarProps["onChange"];

// 🚁 Hovering over `OnChangeType` shows...
type OnChangeType = () => void
```