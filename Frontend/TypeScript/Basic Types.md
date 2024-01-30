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
 * would throw a TS error right here
 */
const defaultUser: User = {   // The `:User` is what it is 
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

## Casting types
### The `as` keyword
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
- It is highly recommended to inline your function's type if you want to have strict type checking for it:
```ts
// Prefer this:
const myFunction = (isFocused: boolean): void  => {}

// Over this:
type FocusListener = (isFocused: boolean) => void;
const myFunction: FocusListener = () => {}

// Because, with the first approach, returning an empty object would cause an error:
const myFunction = (isFocused: boolean): void  => { return {} } // TS error
// But with the second approach, it won't:
const myFunction: FocusListener = () => { return {} } // TS valid
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

