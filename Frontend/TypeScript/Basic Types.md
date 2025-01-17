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

- You can also set a tuple to be `readonly`:
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
```

# Union
- Union types works in a reversed funneled way, i.e. a "larger" type cannot be assigned to a "smaller" type:
```ts
let random = "sth-else" // Inferred type: string
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
<Icon color="" />; // "primary" & "secondary" is suggested here after applying the `string & {}` trick
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
```

# Utility types
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
  // TS error: missing properties
};

// If you want your `cats` object to be more flexible, use optional keys:
// type OptionalCats = { [K in CatName]?: CatInfo }
// It means 2 things: The properties of `cats` aren’t required to include all values listed in the `CatName`, and, in cases where a matched property is included, it could have an `undefined` value
```

# Interface vs Types
- You should ***use types by default*** until you need a specific feature of interfaces, like `extends` (i.e. when you're working *with objects that **inherit*** from each other):
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
type Input = StringOrNumber   // type alias 
const func = (arg: StringOrNumber) => {};
 
func("hello"); // works
func(123);    // works
 
func(true); // error
```
- Interfaces with the same name in the same scope merge their declarations, leading to unexpected bugs, where type names in the same scope must be unique.
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
---
# Techniques
## Scoping your TS errors
### Explicitly extract the condition
- Assign your condition and move it up a level so that TS can properly track its state throughout the scopes below it:
```ts
const findUsersByName = (
  searchParams: { name?: string },
  users: {
    id: string;
    name: string;
  }[],
) => {
  if (searchParams.name) {
 // The `searchParams.name` value could theoretically change between the check and the callback execution, therefore TS can't guarantee `searchParams.name` remains defined inside the `filter` callback, even though we checked it in the `if` statement 
    return users.filter((user) => user.name.includes(searchParams.name));
												  // ^ Argument of type 'string | undefined' is not assignable to parameter of type 'string'
  }

  return users;
};

// To fix it:
const findUsersByName = (
  searchParams: { name?: string },
  users: {
    id: string;
    name: string;
  }[],
) => {
  const searchParamsName = searchParams.name;
  // let searchParamsName = searchParams.name; // Also works with `let`!
  if (searchParamsName) {
    return users.filter((user) => {
      return user.name.includes(searchParamsName);
    });
  }

  return users;
};
```

### Assigning types to variables
- An explicit error right at the definition of a variable is more intuitive than having an error at its call site:
```ts
import { expect, it } from "vitest";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
}

/**
 * We'd want to ensure that `defaultUser` is of type `User`
 * at THIS LINE - e.g. mispelling or missing a property's name
 * would throw a TS error right here - by directly declaring the `User` type
 * to `defaultUser`
 */
const defaultUser: User = {  
  id: 6996,
  firstName: 'Random',
  lastName: "Guy",
  isAdmin: true,
};

const getUserId = (user: User) => {
  return user.id;
};

it("Should get the user id", () => {
  expect(getUserId(defaultUser)).toEqual(6996);
					// ^ Rather than having an error here
});
```

- Have a safe fallback for `undefined` values:
```tsx
// For example, in Remix:
export async function loader({ params }: DataFunctionArgs) {
	const user = db.user.findFirst({
		where: {
			username: {
				equals: params.username,
			},
		},
	})

	invariantResponse(user, 'User not found', { status: 404 })

	return json({
		user: { name: user.name, username: user.username },
	})
}

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
// The `??` fallback on `params.username` instead of `data?.user.username` is because `params.username` is always defined (assuming there's nothing wrong with your routing). You don't want to fallback a potentially `undefined` thing to another `undefined` thing.
	const displayName = data?.user.name ?? params.username
	return [
		{ title: `${displayName} | Epic Notes` },
		{
			name: 'description',
			content: `Profile of ${displayName} on Epic Notes`,
		},
	]
}
```
### `undefined` runtime errors
- Destructured variables can be used to hide `undefined` values from TS, but it's not recommended:
```ts
// Suppose `params.noteId` could be `undefined`:
const {noteId} = params
await $prisma.noteImage.create({
  select: { id: true },
// when you destructure a property from `undefined` or `null`, it doesn’t throw an error. Instead, it assigns `undefined` to the destructured variable:
  data: { ...newImage, noteId }, // No error, this value resolved to `{...newImage, undefined}` if `noteId` is `undefined`
})

// Same thing, but if you try to access a property directly from `undefined` or `null`, it will throw a `TypeError` at runtime:
await $prisma.noteImage.create({
  select: { id: true },
  data: { ...newImage, noteId: params.noteId }, // `TS2322` error because we're `.noteId` which could possibly be `undefined` 
})

// So to properly fix it, prefer a type check before accessing the value:
if (!params || !params.noteId) {
  throw new Error('noteId is required');
}
```
### Promptly throw `Error` with inferred `never` type
- The type of a function that throws an `Error` without returning anything is inferred as `never`:
```ts
const throwError = (message: string) => {
  throw new Error(message);
};

const handleSearchParams = (params: { id?: string }) => {
  const id = params.id || throwError("No id provided");
//      ^ `id` has type `string` | `never` which resolves to just `string`  
  
  return id;  // Guaranteed to be of type `string`
};
```

### Casting types
#### The `as` keyword
- Used for type assertion, when you want compiler to trust that you’ve ensured the value is of the asserted type. If the value is not actually of the asserted type, it could lead to *runtime* errors:
```ts
interface LukeSkywalker {
  name: string;
  height: string;
  gender: string;
}
// Note that this is a trivial example so there's no practical value of it for real-world cases like this (because you'll end up in runtime errors anyway), but the mindset is still valuable:
// Prefer this approach, in most cases:
export const fetchLukeSkywalker = async () => {
  const data: LukeSkywalker = await fetch(
    "https://swapi.dev/api/people/1"
  ).then((res) => {
    return res.json();
  });

  return data;
};
// Or not having an assertion in the code, but explicitly on the call site instead:
const data = fetchLukeSkywalker() as LukeSkywalker

// Over this:
export const fetchLukeSkywalker = async () => {
  const data: unknown = 
  await fetch("https://swapi.dev/api/people/1").then((res) => {
    return res.json();
  });
// TS won’t raise a compile-time error even if the data doesn’t match the `LukeSkywalker` interface.
  return data as LukeSkywalker;
};
```
> [!warning] The `as` assertion should be seen as `lying` to TS. What you **actually** need is E2E type safety, using tools like `tRPC` or `Remix`
- Practical cases are when you need to make a variable to be read-only, or typing errors in a `catch` block:
```ts
const tryCatchDemo = (state: "fail" | "succeed") => {
  try {
    if (state === "fail") {
      throw new Error("Failure!");
    }
  } catch (e) {
    return (e as Error).message;
    
    // But here's a better apporach, tho:
    if (e instanceof Error) {
      return e.message;
    }
    else throw e
  }
};
```
#### The `in` keyword
- Most commonly used to check if a property exists in an _**object**_ (e.g. narrowing down the chosen type in a union):
```ts
type APIResponse =
  | {
      data: {
        id: string;
      };
    }
  | {
      error: string;
    };

const handleResponse = (response: APIResponse) => {
  if ("data" in response) {
    return response.data.id;
  } else {
    throw new Error(response.error);
  }
};
```

### Non-null expression
- Prefer a non-null check over a non-null expression using the exclamation postfix:
```ts
// Prefer this:
 export const links: LinksFunction = () => {
	return [
		{ rel: 'icon', type: 'image/svg+xml', href: faviconAssetUrl },
		{ rel: 'stylesheet', href: fontStylesheetUrl },
		{ rel: 'stylesheet', href: tailwindStylesheetUrl },
		cssBundleHref ? { rel: 'stylesheet', href: cssBundleHref } : null,
	].filter(Boolean)
}

// Over this:
export const links: LinksFunction = () => {
	return [
		{ rel: 'icon', type: 'image/svg+xml', href: faviconAssetUrl },
		{ rel: 'stylesheet', href: fontStylesheetUrl },
		{ rel: 'stylesheet', href: tailwindStylesheetUrl },
// `href` only accepts `string`, and in this case, `cssBundleHref` is `string | undefined` so we're using `!` to assert it
// A better alternative could be `cssBundleHref as string`, but still, not recommended
		{ rel: 'stylesheet', href: cssBundleHref! }, 
	]
}
```
## Typing functions
- It is highly recommended to inline your function's type _only **if** you want to have **strict** type checking_ for it. Most of the time, it's safe to let TS infer the function's type:
```ts
// Declaring the function's type enforces type checking, i.e. either explicitly returning an `undefined` value or completely omitting the `return` keyword, so
// Prefer this:
const myFunction = (isFocused: boolean): void => {}

// Over this:
type FocusListener = (isFocused: boolean) => void; // Returning a `void` value means returning "no value"

// Because, with the first approach, returning an empty object would cause an error:
const myFunction = (isFocused: boolean): void  => { return {} } // TS ERROR
// But with the second approach, it won't:
const myFunction: FocusListener = () => { return {} } // TS valid, because an empty object means "no value"

// Prefer the second approach when you're passing functions as arguments
```
- You can type async functions like:
```ts
const createThenGetUser = async (
  createUser: () => Promise<string>,
  getUser: (id: string) => Promise<User>,
): Promise<User> => {
  const userId: string = await createUser();

  const user = await getUser(userId);

  return user;
};
```
- If you're having a conflict in a function's return type, consider a `throw` over a `return` where it makes sense:
```ts
async function requireOnboardingEmail(request: Request) {
	await requireAnonymous(request)
	const verifySession = await verifySessionStorage.getSession(
		request.headers.get('cookie'),
	)
	const email = verifySession.get(onboardingEmailSessionKey)
	if (typeof email !== 'string' || !email) {
	// using a `throw` here instead of a `return` so that the return type of this function is a `string`, not a `Promise` (from `redirect`)
		throw redirect('/signup')  
	}
	return email
}
```
### Type guard for duplicated conditions 
- You can extract repeated conditions by making a type guard function:
```ts
// Before:
const joinNames = (value: unknown) => {
  if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
    return value.join(" ");
  }

  throw new Error("Parsing error!");
};

const createSections = (value: unknown) => {
  if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
    return value.map((item) => `Section: ${item}`);
  }

  throw new Error("Parsing error!");
};

// After:
// It's actually a good idea to let TS infer the return type of this function (`value is string[]`) rather than explitcitly set it to `boolean` as it will not work
const isArrayOfStrings = (value: unknown) => { 
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
};

const joinNames = (value: unknown) => {
  if (isArrayOfStrings(value)) { // Use the type guard function instead
    return value.join(" ");
  }

  throw new Error("Parsing error!");
};

const createSections = (value: unknown) => {
  if (isArrayOfStrings(value)) { // Use the type guard function instead
    return value.map((item) => `Section: ${item}`);
  }

  throw new Error("Parsing error!");
};
```