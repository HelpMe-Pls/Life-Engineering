# Interface vs Types
- You should ***use types by default*** _until_ you need a specific feature of interfaces, like `extends` (i.e. when you're working *with **objects** that **inherit*** from each other):
```ts
// When you're working with objects that inherit from each other, use interfaces. The `extends` keyword makes TypeScript's type checker run slightly faster than using `&`:
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
  wrongProperty: 123,  // expected error here
};

// You can also extend multiple interfaces, separated by commas:
interface WithBase {
  id: string;
  name: string
}

interface WithCreatedAt {
  createdAt: Date;
}

interface User extends WithBase, WithCreatedAt {
  email: string;
}
// Resolves to:
// interface User {
//    email: string;
//    id: string;
//    name: string;
//    createdAt: Date;
// }
```

- If your _intersection_ were to have duplicated property keys with _different_ types, then you could opt for `interface` (it just gives a more intuitive error message):
```ts
type UserPart = {
  id: number;
  name: string;
  age: number;
};

type UserPart2 = {
  id: string;
  phone: string;
};

// Resolves to:
// interface User {
//   id: number;  >> the first declaration in applied
//   name: string;  
//   age: number;  
//   phone: string;  
// }
interface User extends UserPart, UserPart2 {}
		// ^ Error here: Named property 'id' of types 'UserPart' and 'UserPart2' are not identical.

const user: User = {
  id: "1",   // Type 'string' is not assignable to type 'number'
  name: "John",
  age: 20,
  phone: "123456789",
};
```

- Interfaces can't express unions, mapped types, or conditional types. Type aliases can express any type:
```ts
// Union can't express unions:
interface Base {
  id: string;
}

// This won't work:
interface User extends Base | {email: string} {}

// Can't express mapped types:
interface StringMap {
  // This won't work:
  [P in keyof T]: string;
}

// Can't express conditional types:
interface User extends WithBase ? WithCreatedAt : { // error
  email: string;
}

//----------------------------
type StringOrNumber = string | number;
type Input = StringOrNumber   // type alias 
const func = (arg: StringOrNumber) => {};
 
func("hello"); // works
func(123);    // works
 
func(true); // error
```

- Interfaces with the same name in the same scope _merge_ their declarations, leading to unexpected bugs, where `type` names in the same scope must be unique:
```ts
interface Logger {
  log(message: string, level: number): void;
}

interface Logger {
  log(message: string): void;
}

const myLogger: Logger = {
  log: (message: string) => {
    console.log(message);
  },
};

// Valid:
myLogger.log(
  "My message"
);

// Also valid:
myLogger.log(
  "My message",
  69,
);

// In case you just want one of those `Logger`s to take effect, declare ONE with `type`
```

- Type aliases have an _implicit_ index signature of `Record<PropertyKey, unknown>`, which comes up occasionally:
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
// TS throws an error here because an interface COULD later be extended. It might have a property added that doesn't match the key of `string` or the value of `number` of `RecordType`. To fix this, update the `interface KnownAttributes` to be:
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
---
# Generic Object Type
## Tuple
- It's basically an `Array` type that knows _exactly **how many**_ elements it contains, and _exactly which types_ it contains at _specific **positions**_:
```ts
// Note that a tuple with a rest element has no set “length” - it only has a set of well-known elements in different positions:
type StringBooleansNumberTuple = [string, ...boolean[], number];
```
- You can also set a tuple's member to be optional:
```ts
const goToLocation = (coordinates: [number, number, number?]) => {
  const latitude = coordinates[0];
  const longitude = coordinates[1];
  const elevation = coordinates[2];
  return { latitude, longitude, elevation };
};

goToLocation([10, 20]); // valid
```

- It is recommended to set a tuple as `readonly`:
```ts
function doSomething(pair: readonly [string, number]) {
  pair[0] = "hello!";
	   // ^ Cannot assign to '0' because it is a read-only property.
}

let point = [3, 4] as const;
function distanceFromOrigin([x, y]: [number, number]) {
  return Math.sqrt(x ** 2 + y ** 2);
}
distanceFromOrigin(point);
// `point` is declared with `as const` (i.e. it's `readonly`), but the params of `distanceFromOrigin` is not declared with `readonly`, so there's a conflict of types here and it throws a type error at the function's call site.  
//------------------------------------------------------------------
// Why is it a good idea to make a tuple `readonly`? Consider this example:
// In this case, the inferred return type of `fetchData` is `Promise<readonly [Error] | unknown[]>`
const fetchData = async () => {
  const result = await fetch("/");

  if (!result.ok) {
    return [new Error("Could not fetch data.")] as const
  }

  const data = await result.json();

  return [undefined, data];
}; 

// Whereas in this case, it is `Promise<readonly [Error] | readonly [undefined, unknown]>`. Notice that the return type in case of a success fetch is preserved as a specific `[undefined, unknown]`, not just a general `unknown[]`
const fetchData = async () => {
  const result = await fetch("/");

  if (!result.ok) {
    return [new Error("Could not fetch data.")] as const
  }

  const data = await result.json();

  return [undefined, data] as const
};
```

# Union
- Union types works in a reversed funneled way, i.e. a "larger" type cannot be assigned to a "smaller" type:
```ts
let random = "sth-else" // Inferred type: `string`
type Direction = "up" | "down" | "left" | "right";
const aim = "up"

function move(direction: Direction, distance: number) { 
  return [direction, distance] 
}

move(aim, 69)  // valid: "up" is part of `Direction`, therefore it's smaller
move(random, 96) // invalid: type `string` is larger than type `Direction`
```
- If there's a larger type in that union, the rest of that union will be resolved into that larger type:
```ts
// If you hover over `Direction`, you can see that its type is `string`
type Direction = "up" | "down" | "left" | "right" | string;
```
## Resolved union of same type
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
<Icon color="" />; // "primary" & "secondary" is suggested here after applying the `string & {}` trick, and any other valid color is also valid, e.g. "red"
```
- Notice that this is just a temporary fix. Someday, `string | "literal"` will just work.
## Discriminated union
- Commonly used to define a union for objects that have optional properties. It is crucial that a discriminated union has at least one property in common (`kind` in this example):
```ts
// Problem:
type Shape = {
  kind: string;
  radius?: number;
  sideLength?: number;
};

function calculateArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius * shape.radius;  // 'shape.radius' is possibly 'undefined'.
  } else {
    return shape.sideLength * shape.sideLength; // 'shape.sideLength' is possibly 'undefined'.
  }
}

// Solution:
type Circle = {
  kind: "circle";
  radius: number; // No more optional
};

type Square = {
  kind: "square";
  sideLength: number;
};

type Shape = Circle | Square;  // The "optional" part is now handled by the union

function calculateArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius * shape.radius;  
			    //   ^ shape: Circle
  } else {
    return shape.sideLength * shape.sideLength; 
		//   ^ shape: Square
  }
}

// Switch-case version:
function calculateArea(shape: Shape) {
  switch (shape.kind) {
    case "circle": {
      return Math.PI * shape.radius * shape.radius;
    }
    case "square": {
      return shape.sideLength * shape.sideLength;
    }
  }
}

// Destructured version:
function calculateArea(shape: Shape) { // The destructuring is only recognized within a condition
  if (shape.kind === "circle") {
    const { radius } = shape;  // Like this 
    return Math.PI * radius * radius;
  } else {
    const { sideLength } = shape;
    return sideLength * sideLength;
  }
}
```

- Prefer discriminated union of tuples rather than a tuple of discriminated unions. You also need to explicitly state _**the value**_ of the "discriminated type" to make it work:
```ts
type User = {
  id: string;
};

// Wrong (tuple of discriminated union):
type ApiResponse = [boolean, User[] | string];

// Correct (discriminated union of tuples). Notice how `boolean` is broken into `true` and `false`):
type ApiResponse = [true, User[]] | [false, string];

async function fetchData(): Promise<ApiResponse> {
  try {
    const response = await fetch("https://api.example.com/data");
    if (!response.ok) {
      return [
        false,
        // Imagine more detailed error handling here
        "An error occurred",
      ];
    }

    const data = await response.json();
    return [true, data];
  } catch (error) {
    return [false, "An error occurred"];
  }
}

async function exampleFunc() {
  const [succeeded, value] = await fetchData();

  if (succeeded) {
    console.log(value); // Wrong: `value: string | User[]`
		      // ^ Correct: Type of `value` is now `User[]`
  } else {
    console.error(value);  // Wrong: `value: string | User[]`
				// ^ Correct: Type of `value` is now `string`
  }
}
```

- Make _a_ property optional if you want a default to take it. Notice that the default case is always at the end of the condition chain:
```ts
type Circle = {
  kind?: "circle";  // Make this one optional so it'll be used as default
  radius: number;
};

type Square = {
  kind: "square";
  sideLength: number;
};

type Shape = Circle | Square;

function calculateArea(shape: Shape) {
  if (shape.kind === "square") {
    return shape.sideLength * shape.sideLength;
  } else {
// The default case is always at the end of the condition chain:  
    return Math.PI * shape.radius * shape.radius;
  }
}

// This test should pass:
it("Should calculate the area of a circle when no kind is passed", () => {
  const result = calculateArea({
    radius: 5,
  });
  expect(result).toBe(78.53981633974483);
});
```
## With functions
- When you have a union of functions, the parameters get intersected and the return types get union-ed:
```ts
type Fn1 = (x: string) => string;
type Fn2 = (x: number) => string; 
type UnionFn = Fn1 | Fn2;

// The parameter's type is intersected (`string & number`) and resolves to `never`
const unionFn: UnionFn = Math.random() > 0.5
  ? (x: string) => x.toUpperCase()
  : (x: number) => x.toFixed(2); 

unionFn("hello"); // Error: Argument of type 'string' is not assignable to parameter of type 'never'.
unionFn(42);  //  // Error: Argument of type 'number' is not assignable to parameter of type 'never'.
```
# Enum
- The `enum` keyword is only available in TS (not in standard JS). Use `enum` to define a set of named constants. `enum` members are numeric by default and starts at `0`.  You can define `enum` members with both `string` and `number`:
```ts
enum E {
  X,  // E.X = 0
  Y,
  Z,  // E.Y = 2
}

// Auto-increment is only applied for numeric members, therefore, an `enum` member that follows a `string` member must be initialized:
enum Mix {
  Yes = "YES",
  SS,  // Error: Enum member must have initializer
  No = 69  // Valid
}

//-----------------------------------------------------
// An object declared with `as const` behaves as an enum. Prefer this approach if you want to be consistent with JS:
const ObjAsEnum = {
  Up: 0,
  Down: 1,
  Left: 2,
  Right: 3,
} as const;

// It requires an extra line to pull out the values
type Direction = typeof ObjAsEnum[keyof typeof ObjAsEnum];
//    ^ type Direction = 0 | 1 | 2 | 3

function run(dir: Direction) {}
run(ObjAsEnum.Right);  // valid
```

- Multiple `enum`s with the exact same value are still _independent_ from each other:
```ts
enum Method {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

const request = (url: string, method: Method) => { /* Do something...*/ };

enum AnotherMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
  }
request(
    "https://example.com",
    AnotherMethod.GET, // Error: Argument of type 'AnotherMethod.GET' is not assignable to parameter of type 'Method'.
);
```
# Utility types
- Note that these are types, not interfaces, so you must declare them with `type`
- Check out the [full list](https://www.typescriptlang.org/docs/handbook/utility-types.html).
## Record<Keys, Type>
- Mostly used to *type **objects*** with properties of type `Keys` and values of type `Type`. Also useful in cases where you want to map the properties of a type to another type:
```ts
interface CatInfo {
  age: number;
  breed: string;
}
type CatName = "miffy" | "boris" | "mordred";

// Be aware that with this approach, you must include everything that's in `CatsName`:
const cats: Record<CatName, CatInfo> = {
  miffy: { age: 10, breed: "Persian" },
  // TS error: missing remaining properties
};

// If you want your `cats` object to be more flexible, use optional keys:
// type OptionalCats = { [K in CatName]?: CatInfo }
// It means 2 things: The properties of `cats` aren’t required to include all values listed in the `CatName`, and, in cases where a matched property is included, it could have an `undefined` value.
```
- Note that TS Server inference can't narrow down to the specific properties if you're annotating with primitives:
```ts
interface CatInfo {
  age: number;
  breed: string;
}

// In this case we're annotating the keys as `string`:
const cats: Record<string, CatInfo> = {
  miffy: { age: 10, breed: "Persian" },
  boris: { age: 10, breed: "Persian" },
  mordred: { age: 10, breed: "Persian" },
};

cats. // So there's no property suggestion available here
```
### Prefer the `Record` type instead of type `object`
- The `object` type accepts _all non-primitive_ values but rejects primitive values. Consider using a generic `Record<PropertyKey, unknown>` or more specific interfaces instead of `object`:
```ts
const acceptAllNonPrimitiveTypes = (input: object) => {};

acceptAllNonPrimitiveTypes({});
acceptAllNonPrimitiveTypes([]);
acceptAllNonPrimitiveTypes(() => {});
acceptAllNonPrimitiveTypes(/foo/);
acceptAllNonPrimitiveTypes(new Error("foo"));

acceptAllNonPrimitiveTypes(
  // @ts-expect-error
  null,
);
acceptAllNonPrimitiveTypes(
  // @ts-expect-error
  undefined,
);
acceptAllNonPrimitiveTypes(
  // @ts-expect-error
  "hello",
);
acceptAllNonPrimitiveTypes(
  // @ts-expect-error
  42,
);
acceptAllNonPrimitiveTypes(
  // @ts-expect-error
  true,
);
acceptAllNonPrimitiveTypes(
  // @ts-expect-error
  Symbol("foo"),
);

// Using Record - flexible but with type safety
function processGenericObject(obj: Record<PropertyKey, unknown>) {
 if (typeof obj.name === 'string') {
   console.log(obj.name.toUpperCase());
 }
 console.log(obj.nonexistent); // Inferred as 'unknown'
}
```
## Pick<Type, Keys>
- Use this to construct a sub-type from a larger **_object_** type (as if you're creating a dependency out of that larger object without messing it up):
```ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}
 
type TodoPreview = Pick<Todo, "title" | "completed">;
//    ^ type TodoPreview = {  
//          title: string;  
//          completed: boolean;  
//      }

// If it's not an object then Pick wouldn't work:
type Union = "a" | "b" | "c"
type SubUnion = Pick<Union, "a"> 
						//  ^ error
```
- You _**can't**_ pick properties which don't exist:
```ts
type User = {
  id: number;
  name: string;
  email: string;
};

type UserWithOnlyPhoneNumber = Pick<User, "phoneNumber">;
										// ^ error
```
## Readonly
- Mark a _type_ as immutable with the `readonly` keyword or the `Readonly<T>` signature:
```ts
function printNames(names: readonly string[]) {  // `ReadonlyArray<string>` also works
  for (const name of names) {
    console.log(name);
  }

  names.push("John");  // error
  names[0] = "Billy";  // error
}
```
- You can always safely assign a less restrictive type (mutable) to a more restrictive one (immutable - `readonly`), but not vice versa:
```ts
let mutable: number[] = [1, 2];
let immutable: readonly number[] = [1, 2];

// More restrictive (readonly) cannot be assigned to less restrictive (mutable)
// because mutable arrays allow operations that would violate readonly
mutable = immutable;  // Error
mutable.push(3);     // This would break readonly guarantee

// Less restrictive (mutable) can be assigned to more restrictive (readonly)
// because readonly prevents any operations that could mutate the array
immutable = mutable;  // OK
immutable.push(3);    // Error: Property 'push' does not exist on readonly array
```
- Use the `@total-typescript/ts-reset` to loosen up the default restrictive type check. Helpful in case where you need to verify _if_ an element exists in a `readonly` collection:
```ts
import "@total-typescript/ts-reset";  

const users = ["matt", "sofia", "waqas"] as const;

users.includes("bryan");  // No error

users.indexOf("bryan");  // No error
```