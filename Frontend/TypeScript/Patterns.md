Check [this](https://www.npmjs.com/package/type-fest) out.
[TSConfig](https://www.totaltypescript.com/tsconfig-cheat-sheet?ck_subscriber_id=2036870503)

----
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

## Casting types
### The `as` keyword
- Used for type assertion, when you want compiler to trust that you’ve ensured the value is of the asserted type. If the value is not actually of the asserted type, it could lead to *runtime* errors:
```ts
interface LukeSkywalker {
  name: string;
  height: string;
  gender: string;
}

// Prefer this approach, in most cases:
export const fetchLukeSkywalker = async (): Promise<LukeSkywalker> => {
  const data = await fetch(
    "https://swapi.dev/api/people/1"
  ).then((res) => {
    return res.json();
  });

  return data;
};

const res = fetchLukeSkywalker() 
//     ^ `res: LukeSkywalker`

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
#### `as const`
- Declaring an object with `as const` is equivalent to applying `readonly` to its type. It can also be used to mimic an [[Basic Types#Enum |enum]]:
```ts
type ButtonAttributes = {
  type: "button" | "submit" | "reset";
};

// Before:
const buttonAttributes = {
  type: "button",
};

// hovering over `buttonAttributes` shows:
const buttonAttributes: {
  type: string;
}

//---------------------------- After:
const buttonAttributes = {
  type: "button",
} as const;

// hovering over `buttonAttributes` shows:
const buttonAttributes: {
  readonly type: "button";
}

//----------------------------------- Fine tuning
// You can declare certain properties with `as const` instead of specifying the entire object:
const buttonAttributes = {
  type: "button" as const,
}
// hovering over `buttonAttributes` shows:
const buttonAttributes: {
    type: "button";
}

// If the `as const` is not declared on all properties, then their resolved type will be swallowed by the larger type:
const buttons = [
  {
    type: "button",  // Hover on `type` shows: type: string
  },
  {
    type: "submit" as const, // Hover on `type` shows: type: "submit"
  },
];
// hovering over `buttons` shows:
const buttonsToChange: {
    type: string;  // `string` is the larger type that swallowed "submit"
}[]
```
> There's no cost to using `as const` in your code, as it disappears at runtime.
### The `in` keyword
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

// Use with Index Signature:
type Environment = "development" | "production" | "staging";
type ConfigDetail = {
    apiBaseUrl: string;
    timeout: number;
  }
type Configurations = {
// It means: for each key in `Environment`, its value should be of type `ConfigDetail`
  [Env in Environment]: ConfigDetail;
};

// Or better yet, use `Record`:
// type Configurations = Record<Environment, ConfigDetail>;

const configurations: Configurations = {
  development: {
    apiBaseUrl: "http://localhost:8080",
    timeout: 5000,
  },
  production: {
    apiBaseUrl: "https://api.example.com",
    timeout: 10000,
  },
  staging: {
    apiBaseUrl: "https://staging.example.com",
    timeout: 8000,
  },
  // Object literal may only specify known properties, and 'notAllowed' does not exist in type 'Configurations'.
  notAllowed: {
    apiBaseUrl: "https://staging.example.com",
    timeout: 8000,
  },
};
```

## Non-null expression
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

# Utilities
## `DistributiveOmit`
### The problem
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
- This means that when you use them with a union type, they don't operate individually on each union member, but rather merge them all into one type with shared properties then operate on that. So to work around it:
```ts
// `T extends any` is a way to force TypeScript to distribute the type operation across EACH member of a union type SEPARATELY
type DistributiveOmit<T, K extends PropertyKey> = T extends any
  ? Omit<T, K> // This is the meat
  : never;  // This case only happen if you pass T as `never`

// Now it works: 
type MusicProductWithoutId = DistributiveOmit<MusicProduct, "id">;
//^ type MusicProductWithoutId = Omit<Album, "id"> | Omit<CollectorEdition, "id"> | Omit<DigitalRelease, "id">
```
## `Prettify`
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
# Indexed Access Types
## Numeric keys
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

//-------------- Extract a property's type from an object:
type NavbarProps = {
  onChange: () => void;
};

type OnChangeType = NavbarProps["onChange"];
//    ^ type OnChangeType = () => void
```
## Narrowed key type
- Same as above, and instead of type `number`, you just need to update the type of keys accordingly:
```ts
interface IndexSig { 
  english: string
  [subject: string]: number | string
}
const scores: IndexSig = { english: '69' };

scores.math = 95;
scores.english = 90;
scores.science = 85;

// You can also use the `Record` utility type:
const scores: Record<string, number | string> = {};
```
- Use the built-in `PropertyKey` type if you _aren't sure_ which type your object's keys gonna be:
```ts
import { expect, it } from "vitest";

// The global type `PropertyKey` resolves into `string | number | symbol`
const hasKey = (obj: object, key: PropertyKey) => {
  return obj.hasOwnProperty(key);
};

// Should pass:
it("Should work on symbol keys", () => {
  const fooSymbol = Symbol("foo");
  const barSymbol = Symbol("bar");

  const obj = {
    [fooSymbol]: "bar",
  };

  expect(hasKey(obj, fooSymbol)).toBe(true);
  expect(hasKey(obj, barSymbol)).toBe(false);
});

// Particularly useful for index signature. Use it instead of `any`:
const scores: Record<PropertyKey, number | string> = {};
```
