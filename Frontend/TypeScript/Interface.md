# Interface vs Types
- You should ***use types by default*** until you need a specific feature of interfaces, like `extends` (i.e. when you're working with objects that inherit from each other):
```ts
// When you're working with objects that inherit from each other, use interfaces. `extends` makes TypeScript's type checker run slightly faster than using `&`:
interface WithId {
  id: string;
}

// Both of these work, but prefer this (because future checks against it can be cached):
interface User extends WithId {
  name: string;
}
// Over this (recomputed every time):
type User = WithId & {
  name: string;
};
 
const user: User = {
  id: "123",
  name: "Karl",
  wrongProperty: 123,
};
```
- Interfaces can't express unions, mapped types, or conditional types. Type aliases can express any type:
```ts
type StringOrNumber = string | number;
 
const func = (arg: StringOrNumber) => {};
 
func("hello"); // works
func(123);    // works
 
func(true); // error
```
- Interfaces with the same name in the same scope merge their declarations, leading to unexpected bugs. 
- Type aliases have an implicit index signature of `Record<PropertyKey, unknown>`, which comes up occasionally:
```ts
interface KnownAttributes {
  x: number;
  y: number;
}
 
const knownAttributes: KnownAttributes = {
  x: 1,
  y: 2,
};
 
type RecordType = Record<string, number>;
 
const oi: RecordType = knownAttributes;  // error
// The reason this errors is that an interface COULD later be extended. It might have a property added that doesn't match the key of `string` or the value of `number` of `RecordType`. To fix this, update the `interface KnownAttributes` to be:
interface KnownAttributes {
  x: number;
  y: number;
  [index: string]: unknown; // new!
}
// Or just use `type` instead:
type KnownAttributes = {
  x: number;
  y: number;
};
```