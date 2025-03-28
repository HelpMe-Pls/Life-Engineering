## Spread operator
- The "spread" syntax is applied for *arguments* in a function *call* where it expands iterable elements (like arrays or strings) into individual elements.
- It **deep** copies the data *if it is **not** nested*. For nested data, it deeply copies the topmost data and shallow copies of the nested data:
```ts
const oldObj = {a: {b: 10}, c: 2};

const newObj = {...oldObj};

oldObj.a.b = 2; // It also changes the newObj `b` value as newObj and oldObj's `b` property allocates the same memory address (i.e. shallow copied).

oldObj.c = 5; // It changes the oldObj `c` but untouched at the newObj (i.e. deep copied)

console.log('oldObj:', oldObj);       // oldObj: { "a": { "b": 2 }, "c": 5 }

console.log('newObj:', newObj);       // newObj: { "a": { "b": 2 }, "c": 2 }

>> The deep-shallow copy only affects elements that are of object-typed (because of references), primitive values are always considered deep copied.
>> Use lo_cloneDeep to be sure about updating state
```
> Use the built-in [structuredClone()](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone) if you want to deeply clone an object

- Destructuring and alias:
```ts
function bar() {
	return {
		x: 4,
		y: 5,
		z: 6
	};
}

// Destructuring:
var { x, y, z } = bar();

// Alias:
var { x: a, y: b, z: c } = bar();

console.log( a, b, c );	// 4 5 6
console.log( x, y, z );	// 4 5 6

//============ Destructuring function parameters =============
// If we want to access the `slug` property from the argument when invoking `fetchSth` function, we can define it in one of these 3 ways:
// 1, using the dot notation:
function fetchSth(context: {params: {slug: string}}) {
	const slug = context.params.slug
	console.log(slug)
}
// 2, object destructuring is used in the function parameter itself:
function fetchSth({params}: {params: {slug: string}}) {
	const slug = params.slug
	console.log(slug)
}
// 3, double destructuring:
function fetchSth({params}: {params: {slug: string}}) {
	const {slug} = params
	console.log(slug)
}
// Then, invoke `fetchSth`:
const ctx = {params: {slug:'abc'}}
fetchSth(ctx)

//===============================
// Swapping variables
let a = 1;
let b = 3;

[a, b] = [b, a];
console.log(a); // 3
console.log(b); // 1
```
- Be aware of the [[Basic Types#`undefined` runtime errors |runtime error]] when destructuring.
- **Overwriting properties**: if the *same property* exists in both objects, the one *in the spread object* is applied:
```ts
const responseInit = {status : 404} 
const res = { status: 500, ...responseInit }  
console.log(res) // {status: 404}
```
### Spread vs rest:
- The "rest" syntax is like an inverse of the spread syntax: it offers a shorthand for including an arbitrary number of *parameters* to be passed to a function as an array. *It must be placed **at the end** of the parameter list*:
```ts
//----------------- rest:
function addFiveToABunchOfNumbers(...numbers) {
  // `numbers` is now an array
  return numbers.map((x) => x + 5);
}

const result = addFiveToABunchOfNumbers(4, 5, 6, 7, 8, 9, 10); // [9, 10, 11, 12, 13, 14, 15]

const [a, b, ...rest] = [1, 2, 3, 4]; // a: 1, b: 2, rest: [3, 4]

const {e, f, ...others} = {
  e: 1,
  f: 2,
  g: 3,
  h: 4,
}; // e: 1, f: 2, others: { g: 3, h: 4 }

// This:
export function concatenate(...strings: string[]) {
  return strings.join("");
}
concatenate("Hello", " ", "World");  // >> ["Hello World"]

// Is the same as this:
export function concatenate(strings: string[]) {
  return strings.join("");
}
concatenate(["Hello", " ", "World"]);  // >> ["Hello World"]

//----------------- spread:
let words = ["never", "fully"];
console.log(["will", ...words, "understand"]);
// → ["will", "never", "fully", "understand"]
```

## Assignments
- For the ***object*** destructuring form specifically, when leaving off a `var`/`let`/`const` declarator, we had to surround the *whole assignment expression* in `( )`, because otherwise the `{ .. }` on the lefthand side as the first element in the statement is taken to be a block statement instead of an object:

```js
// Map an object to an empty array:
var o1 = { a: 1, b: 2, c: 3 },
	a2 = [];

// Wrap the whole assignment expression in parentheses:
({ a: a2[0], b: a2[1], c: a2[2] } = o1);

console.log(a2);    // [1, 2, 3]
```

- Array transformation:
```js
// From an array to an object:
var a1 = [ 1, 2, 3 ],
	o2 = {};

[ o2.a, o2.b, o2.c ] = a1;

console.log( o2.a, o2.b, o2.c );   // 1 2 3


// Re-ordering an array:
var a1 = [1, 2, 3],
	a2 = [];

[a2[2], a2[0], a2[1]] = a1;

console.log(a2);   // [2, 3, 1] 
```

- Restructuring :

```js
var settings = {
	options: {
		remove: true,
		enable: false,
		instance: {}
	},
	log: {
		warn: true,
		error: true
	}
};

var config = {
	options: {
		remove: false,
		instance: null
	}
};

// merge `settings` into `config`
{
	// destructure (with default value assignments)
	let {
		options: {
			remove = settings.options.remove,
			enable = settings.options.enable,
			instance = settings.options.instance
		} = {},
		log: {
			warn = settings.log.warn,
			error = settings.log.error
		} = {}
	} = config;

	// restructure: take the declared object from the expression above and assign it to `config`
	config = {
		options: { remove, enable, instance },
		log: { warn, error }
	};
}

console.log(config)
// {
//   "options": {
//     "remove": false,   // from `config`
//     "enable": false,   // from `settings`
//     "instance": null   // from `config`
//   },
//   "log": {
//     "warn": true,
//     "error": true
//   }
// }
```
---

## Bracket Notation vs Dot Notation:
To access object’s properties, there are 2 ways:
- Bracket Notation:
	- Property identifiers have to be a string, number or a variable that references a string (including non-ASCII (UTF-8) characters):
	```js
obj["1prop"], obj["ダ"], // String 
var foo = myResponse["bar.Baz"];   // to access a property called bar.Baz
```
	- Property identifiers are computed (evaluated) variables (are yet to be defined at the point of writing the query):
```js
for (var i = 0; i < 10; i++) {
  someFunction(myQuery["someNum" + i]);
}
```

- Dot Notation:
	- Property identifies can only be alphanumeric (also `_` and  `$`), **cannot** start with a number.
	- Property identifiers are pre-defined
---
## Array traversing methods
- These methods returns a new array
### .map()
- Returns a ***NEW*** (separate ref) **array** with its elements based on what the `callbackFn` does:
```ts
const numbers = [1, 2, 3, 4];

const filteredNumbers = numbers.map((num, index) => {
  if (index < 3) {
    return num;
  }
});

// `filteredNumbers` is [1, 2, 3, undefined]
// `numbers` is still [1, 2, 3, 4]

```

- Caution:
	- `map` does ***not*** mutate the original array on which it is called (although `callbackFn`, if invoked, may do so).
	- **Shouldn't** use `map` if: you're not using the array it returns; and/or you're not returning a value from the callback. Prefer [[Everyday methods & utils#.forEach() |.forEach()]] in those cases.
- Tip: use `map` and object destructuring to return a desired shape of an object for better TS inference:
```tsx
export async function loader({ params }: DataFunctionArgs) {
	// Instead of this, which is WRONG:
	/* const notes = db.note.findMany({
		where: {
			owner: {
				username: { equals: params.username },
			},
		},
	})

	return json({
		notes: [{ id: notes[0].id, title: notes[0].title }],		
	})*/
	
	// By doing this, we also trim down the size of the response instead of sending the whole `notes` array:
	const notes = db.note.findMany({
		where: {
			owner: {
				username: { equals: params.username },
			},
		},
	}).map(({ id, title }) => ({ id, title }))

	return json({notes})

// Then is later used in tsx:
const data = useLoaderData<typeof loader>()
<ul className="overflow-y-auto overflow-x-hidden pb-12">
		{data.notes.map(note => (
		// Now TS only suggests `id` and `title` when hitting "Ctrl + Space" on `note.`, instead of suggesting all properties from `note`. And in this example, by using Remix, you're getting the benefits of trpc and graphQL.  
			<li className="p-1 pr-0" key={note.id}>
				<NavLink to={note.id}>
					{note.title}
				</NavLink>
			</li>
		))}
</ul> 
```
### .filter()
- Returns a *shallow* copy of a portion of the original array, with its element(s) are those when applied as argument for `callbackFn` returning `true`. If no elements pass the test, an ***empty array*** will be returned.
- Does ***not*** mutate the original array. However, `callbackFn` may do so:
```ts
// Modifying each word
let words = ['spray', 'limit', 'exuberant', 'destruction', 'elite', 'present'];

const modifiedWords = words.filter((word, index) => {
  words[index + 1] += ' extra';
  return word.length < 6;
});

console.log(modifiedWords);
// Notice there are three words below length 6, but since they've been modified, only one is returned
// ["spray"]

// Appending new words
words = ['spray', 'limit', 'exuberant', 'destruction', 'elite', 'present'];
const appendedWords = words.filter((word, index) => {
  words.push('new');
  return word.length < 6;
})

console.log(appendedWords);
// Only three fits the condition even though the `words` itself now has a lot more words with character length less than 6
// ["spray" ,"limit" ,"elite"]

// Deleting words
words = ['spray', 'limit', 'exuberant', 'destruction', 'elite', 'present'];
const deleteWords = words.filter((word) => {
  words.pop();
  return word.length < 6;
})

console.log(deleteWords);
// Notice 'elite' is not even obtained as it's been popped off 'words' before filter can even get there
// ["spray" ,"limit"]

console.log(words)   // ["spray", "limit", "exuberant"]
```
- Tip: Use `.filter(Boolean)` to remove falsy values from an array:
```ts
 export const links: LinksFunction = () => {
	return [
		{ rel: 'icon', type: 'image/svg+xml', href: faviconAssetUrl },
		{ rel: 'stylesheet', href: fontStylesheetUrl },
		{ rel: 'stylesheet', href: tailwindStylesheetUrl },
		cssBundleHref ? { rel: 'stylesheet', href: cssBundleHref } : null,
	].filter(Boolean)
}

// In case `cssBundleHref` is falsy, the return value of `links` would be:
[
  { rel: 'icon', type: 'image/svg+xml', href: faviconAssetUrl },
  { rel: 'stylesheet', href: fontStylesheetUrl },
  { rel: 'stylesheet', href: tailwindStylesheetUrl },
]
```

### .find()
- Does ***not*** mutate the original array. However, `callbackFn` may do so.
- Returns the ***first*** element found. If no values satisfy the `callbackFn`, returns `undefined`.
- If you need the **index** of the found element in the array, use `Array.findIndex()` instead (If no elements satisfy the testing function, returns `-1`).
- Nonexistent (`undefined`) and deleted elements ==***are visited***==, and the value passed to the callback is their value when visited:
```ts
// Declare array with no elements at indexes 2, 3, and 4
const array = [0,1,,,,5,6];

// Shows all indexes, not just those with assigned values
array.find((value, index) => {
  console.log('Visited index ', index, ' with value ', value);
});

// Shows all indexes, including deleted
array.find((value, index) => {
  // Delete element 5 on first iteration
  if (index === 0) {
    console.log('Deleting array[5] with value ', array[5]);
    delete array[5];
  }
  // Element 5 is still visited even though deleted
  console.log('Visited index ', index, ' with value ', value);
});
// expected output:
// Visited index 0 with value 0
// Visited index 1 with value 1
// Visited index 2 with value undefined
// Visited index 3 with value undefined
// Visited index 4 with value undefined
// Visited index 5 with value 5
// Visited index 6 with value 6
// Deleting array[5] with value 5
// Visited index 0 with value 0
// Visited index 1 with value 1
// Visited index 2 with value undefined
// Visited index 3 with value undefined
// Visited index 4 with value undefined
// Visited index 5 with value undefined
// Visited index 6 with value 6

```

### .with()
- ***Changes*** the value of a given index.
- A [RangeError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError) is thrown if `index > array.length` or `index < -array.length`
- If `index < 0`,  `index + array.length` is used:
- Returns a **new array** with the element at the given index replaced with the given value:
```js
const arr = [1, 2, 3, 4, 5];
console.log(arr.with(2, 6).map((x) => x ** 2)); // [1, 4, 36, 16, 25]
console.log(arr)  // [1, 2, 3, 4, 5]
```

### .every()
- Does ***not*** mutate the original array. However, `callbackFn` may do so.
- Returns a **Boolean** value.
- Tests whether ***ALL*** elements pass the `callbackFn`:
```ts
const isBelowThreshold = (currentValue) => currentValue < 40;

const array1 = [1, 30, 39, 29, 10, 13];

console.log(array1.every(isBelowThreshold));  // true

// Use it to quickly check if an array of numbers is sorted:
const values = [6, 9, 9, 6]
const isSorted = values.every((value, idx) => idx === 0 || values[idx - 1] <= value)

console.log(isSorted)   // false
```

### .some()
- Like `.every()`, but returns `true` if ***AT LEAST ONE*** element passes the  `callbackFn`: 
```ts
[2, 5, 8, 1, 4].some((x) => x > 10);  // false
[12, 5, 8, 1, 4].some((x) => x > 10); // true
```

### .includes()
- Like `.some()`, but search for primitive ***value***:
```ts
someArray.includes(searchElement, _fromIndex)
// `fromIndex` is an optional argument
// If `fromIndex >= array.length`, the array is not searched and `false` is returned.
// If `fromIndex < 0`, `fromIndex + array.length` is used.
// If `fromIndex < -array.length` or `fromIndex` is omitted, `0` is used, causing the entire array to be searched
const arr = ['a', 'b', 'c'];

console.log(arr.includes('a')) // true
console.log(arr.includes('b', 69)) // false
console.log(arr.includes('c', 1)) // true
console.log(arr.includes('a', -2))   // false
console.log(arr.includes('b', -2))  // true
console.log(arr.includes('c', 2))  // true
```

### .reduce()
- Does ***not*** mutate the original array. However, `callbackFn` may do so.
- Iterates and executes the "reducer" for all elements in the array.
- The returned **value** depends on the "reducer":
```ts
// `initialValue` is optional
someArray.reduce(callbackFn, _initialValue)

// Inline `callbackFn`:
someArray.reduce((previousValue, currentValue) => { something... }, initialValue)

// If `initialValue` exists, it will be assigned to `previousValue` for the FIRST iteration and the `currentValue` will be treated as the FIRST VALUE in the array.

// If there’s no `initialValue`, the first value of the array will be assigned to `previousValue` and `currentValue` will be the 2nd value of the array

// The `reduce` method executes { something... } on each element iteration of the array, from left to right, and its result is assigned to `previousValue`. Then the `currentValue` will be the param for the next execution of { something... }. The final result of running the reducer across all elements of the array is a SINGLE value (that value could be a number, string, boolean, object, or even a function). Example:

const arr = [21, 18, 42, 40, 69, 63, 34];

const maxNum = arr.reduce((max, value) => (value > max ? value : max), 0);  // 69

const nums = [1, 2, 3, 4];

const reducer = (prev, cur) => prev + cur

console.log(nums.reduce(reducer))  // 10
```
- `reduceRight()` method does the same thing but in reversed order (starts from the end of the array, right to left).

### .forEach()
- Does ***not*** mutate the original array. However, `callbackFn` may do so.
- Does ***not*** return a value.
- ***Executes*** the `callbackFn` once for each array element.
- Nonexistent (`undefined`) and deleted elements ==***are NOT visited***==:
```ts
const logArrayElements = (element, index) => {
  console.log(`a[${index}] = ${element}`);
};

// Notice that index 2 is skipped, since there is no item at
// that position in the array.
[2, 5, , 9].forEach(logArrayElements);
// logs:
// a[0] = 2
// a[1] = 5
// a[3] = 9

-------
// Flatten an array implementation:
const flatten = (arr) => {
  const result = [];
  arr.forEach((i) => {
    if (Array.isArray(i)) {
      result.push(...flatten(i));
    } else {
      result.push(i);
    }
  });
  return result;
}

// Usage:
const nested = [1, 2, 3, [4, 5, [6, 7], 8, 9]];
console.log(flatten(nested)); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

### .slice()
- Useful when you want to *extract* a portion of an array.
- Does ***not*** mutate the original array.
- Returns a **new** array (a *shallow* copy portion) of the original array with its element(s) selected within the `[start, end)` range .
- Returns an **empty** array when:
	- `start` is `>=` array length.
	- `end` is `0`.
	- `start` and `end` are overlapped.
```ts
const animals = ['ant', 'bison', 'camel', 'duck', 'elephant'];

// If `start` is `undefined` or `-Infinity`, `slice` starts from the index `0`.
console.log(animals.slice(undefined,2));  // ["ant", "bison"]

// If `start` is >= the array length, an empty array is returned.
console.log(animals.slice(9, 3));    // []
console.log(animals.slice(9));       // []

// If `start` is negative, the absolute of it is how many element(s) TAKEN from the last index (right to left). If that absolute is >= the array length, ALL elements are returned.
console.log(animals.slice(-3));     // ["camel", "duck", "elephant"]
console.log(animals.slice(-3, 4));  // ["camel", "duck"]
console.log(animals.slice(-5));     // ['ant', 'bison', 'camel', 'duck', 'elephant']

// If `end` is `undefined` or >= the array length, `slice` goes through the last element
console.log(animals.slice(3));     // ["duck", "elephant"]
console.log(animals.slice(1, undefined));   // ["bison", "camel", "duck", "elephant"]
console.log(animals.slice(2, 5));     // ["camel", "duck", "elephant"]
console.log(animals.slice(1, 9));     // ["bison", "camel", "duck", "elephant"]

// If `end` is `0`, returns empty array
console.log(animals.slice(1, 0));          // []
console.log(animals.slice(-3, 0));         // []
console.log(animals.slice(2, -0));         // []
console.log(animals.slice(undefined, 0));  // []

// If `end` is negative, the absolute of it is how many element(s) REMOVED from the last index inclusive (right to left)
console.log(animals.slice(0, -1));    // ["ant", "bison", "camel", "duck"]
console.log(animals.slice(1, -3))     // ["bison"]
console.log(animals.slice(1, -5));    // []
console.log(animals.slice(0, -69));   // []
console.log(animals.slice(-3, -1));   // ["camel", "duck"]

// If both `start` and `end` is omitted, returns a fully SHALLOW copied version of the original array
console.log(animals.slice());   // ['ant', 'bison', 'camel', 'duck', 'elephant']

// If `start` and `end` overlapped, returns an empty array
console.log(animals.slice(2, -3));   // []
console.log(animals.slice(3, -4));   // []
-----------
// Proof of shallow copy:
const myHonda = { color: 'red', wheels: 4, engine: { cylinders: 4, size: 2.2 } };
const myCar = [myHonda, 2, 'cherry condition', 'purchased 1997'];

const newCar = myCar.slice(0, 2); // create newCar from myCar.

// myCar = [
//   { color: 'red', wheels: 4, engine: { cylinders: 4, size: 2.2 } },
//   2,
//   'cherry condition',
//   'purchased 1997'
// ]
console.log('myCar = ', myCar); 

// newCar = [{color: 'red', wheels: 4, engine: {cylinders: 4, size: 2.2}}, 2]
console.log('newCar = ', newCar);

// Change the color of myHonda.
myHonda.color = 'purple';
console.log('The new color of my Honda is ', myHonda.color);  // 'purple'

// The original version is updated leading to its copies also updated:
console.log('myCar[0].color = ', myCar[0].color);      // 'purple'
console.log('newCar[0].color = ', newCar[0].color);    // 'purple'
// The same thing happens if you set `newCar[0].color`
```

### .join()
```ts
randomArray.join(_separator: string)
```
- Returns a new `string` by concatenating all of the elements in an array, with the specified `seperator` in between the elements.
- If `seperator` is not supplied (or `undefined`), the elements will be separated by commas.
- If `separator` is an empty string, all elements are joined without any characters in between them.
```js
const elements = ['Fire', `{a: 2}`, '3'];

console.log(elements.join());      // "Fire,{a: 2},3"
console.log(elements.join(''));    // "Fire{a: 2}3"
console.log(elements.join('__'));  // "Fire__{a: 2}__3"
```
---
## Array mutating methods
### .push()
- Adds one (*or more*) elements to the ***end*** of an array.
- Returns ==the new **length**== of the array.
```ts
const sports = ['soccer', 'baseball'];
const total = sports.push('football', 'swimming');

console.log(sports); // ['soccer', 'baseball', 'football', 'swimming']
console.log(total);  // 4
--------------

// Merging arrays:
const vegetables = ['parsnip', 'potato'];
const moreVegs = ['celery', 'beetroot'];

// Merge the second array into the first one
vegetables.push(...moreVegs);

console.log(vegetables); // ['parsnip', 'potato', 'celery', 'beetroot']
```

### .unshift()
- Like `.push()`, but adds element(s) to the ***beginning*** of the original array:
```ts
const arr = [1, 2]

arr.unshift(0)               // result of the call is 3, which is the new array length
// arr is [0, 1, 2]

arr.unshift(-2, -1)          // the new array length is 5
// arr is [-2, -1, 0, 1, 2]

arr.unshift([-4, -3])        // the new array length is 6
// arr is [[-4, -3], -2, -1, 0, 1, 2]

arr.unshift([-7, -6], [-5])  // the new array length is 8
// arr is [ [-7, -6], [-5], [-4, -3], -2, -1, 0, 1, 2 ]
```

### .pop()
- Removes the **last** element from an array ==and returns ***that element==*** (returns `undefined` if the array is empty).
- This method changes the length of the array and it ***doesn't*** receive any argument.

```ts
const plants = ['broccoli', 'cauliflower', 'cabbage', 'kale', 'tomato'];

console.log(plants.pop());  // 'tomato'
-----------------------

arr = [1, 2, 3, 4];
arr.every((elem, index) => {
  arr.pop()
  console.log(`[${arr}][${index}] -> ${elem}`)
  return elem < 4
})

// Loop runs for 2 iterations only, as the remaining items are `pop()`ed off
// 1st iteration: [1,2,3][0] -> 1
// 2nd iteration: [1,2][1] -> 2
```

### .shift()
- Like `.pop()`, but applied to the ***first*** element in an array.

### .reverse()
- It is what it is. In case you want this feature without mutating the original array, use `.toReversed()`
- Add the `length` property and "array-indexing" to an object and `.call()` it if you wanna reverse an object:
```ts
const obj = {0: 1, 1: 2, 2: 3, length: 3};
console.log(obj); // {0: 1, 1: 2, 2: 3, length: 3}

Array.prototype.reverse.call(obj); //same syntax for using apply()
console.log(obj); // {0: 3, 1: 2, 2: 1, length: 3}
-----

const array1 = ['one', 'two', 'three'];
console.log('array1:', array1);
// expected output: "array1:" Array ["one", "two", "three"]

const reversed = array1.reverse();
console.log('reversed:', reversed);
// expected output: "reversed:" Array ["three", "two", "one"]

// Careful: reverse is destructive -- it changes the original array.
console.log('array1:', array1);
// expected output: "array1:" Array ["three", "two", "one"]
```

### .splice()
- Useful when you want to add/remove/***replace*** element(s) at (or *from*) a specific index in an array.
- ==***Changes***== the original array. In case you want this feature without mutating the original array, use `.toSpliced()`
- Returns an array containing the ***deleted*** element(s). Returns empty array if _no_ elements are removed.
```ts
someArray.splice(start, deleteCount, item1, item2, itemN)
// `start` is similar to `.slice()`, except that if it's >= the array length, `.splice()` will act as `.push()` if the third argument (`item1, item2, itemN`) is passed in.
// `deleteCount` is number of elements in the array to be removed FROM the index of `start` (`start` element is included)
// `deleteCount` MUST be included if the third argument is passed in.
// If `deleteCount` is `undefined`-ish (0, negative number, -Infinity, NaN), you should pass in the third argument. Then, `splice()` will act as `.push()` FROM the index of `start`

------------------------
const myItems = ['parrot', 'anemone', 'blue', 'trumpet'];

// Add element(s):
const added = myItems.splice(2, 0, 'shit');  
console.log(added)        // []
console.log(myItems)      // ["parrot", "anemone", "shit", "blue", "trumpet"]
const added1 = myItems.splice(69, 3, 'pussy'); 
console.log(added1)  // []
console.log(myItems) // ["parrot", "anemone", "shit", "blue", "trumpet", "pussy"]
const added2 = myItems.splice(2, undefined, 'cunt'); 
console.log(added2)  // []
console.log(myItems) // ["parrot", "anemone", "cunt", "shit", "blue", "trumpet", "pussy"]

// Remove element(s): 
const removed = myItems.splice(4, 3);
console.log(removed)     // ["blue", "trumpet", "pussy"]
console.log(myItems)     // ["parrot", "anemone", "cunt", "shit"]
const removed1 = myItems.splice(1, 1);
console.log(removed1)    // ["anemone"]
console.log(myItems)     // ["parrot", "cunt", "shit"]

// Replace element(s);
const replaced = myItems.splice(1, 1, 'cock', 'fart')
console.log(replaced)   // ["cunt"]
console.log(myItems)    // ["parrot", "cock", "fart", "shit"]
const replaced1 = myItems.splice(0, 1, 'ass')
console.log(replaced1)  // ["parrot"]
console.log(myItems)    // ["ass", "cock", "fart", "shit"]
```
---

## String methods
### .charAt()
- Returns a new `string` consisting of the single UTF-16 code unit located at the specified  `index`  in the original string.
- If `index` is out of range, `charAt()` returns an *empty string*.
```js
const randomString = "Brave new world";

// No index was provided, used 0 as default
console.log(`The character at index 0 is '${randomString.charAt()}'`);

// The character at index 3 is 'v'
console.log(`The character at index 3 is '${anyString.charAt(3)}'`);

//The character at index 999 is ''
console.log(`The character at index 999 is '${anyString.charAt(999)}'`);
```
### .includes()
- Performs a **case-sensitive** search to determine whether one string may be found *within* another string
- Returns `true` or `false` accordingly.
```js
someString.includes(searchString, _index)
// `index` is an optional param indicates where to begin the search for `searchString`
// `searchString` as an empty string still works

const str = "To be, or not to be, that is the question."

console.log(str.includes("nonexistent")); // false
console.log(str.includes("be", 4)); // true
console.log(str.includes("")); // true
```
### indexOf()
- Returns the index of the _first_ occurrence of the specified substring.
- It also takes an _optional_ second argument as an _inclusive_ specified index and returns the _first_ occurrence of the specified substring _from_ that index.
```ts
const sentence = "I think Ruth's dog is cuter than your dog!";

const searchTerm = "dog";
const indexOfFirst = paragraph.indexOf(searchTerm);

console.log(`The index of the first "${searchTerm}" is ${indexOfFirst}`);
// "The index of the first "dog" is 15"

console.log(
  `The index of the second "${searchTerm}" is ${paragraph.indexOf(
    searchTerm,
    indexOfFirst + 1,
  )}`,
);
// "The index of the second "dog" is 38"
```

### .trim()
- Removes whitespace (spaces, newlines, tabs, and similar characters) ***from both ends*** of a string and *returns a new string* (without modifying the original string).
- If neither the beginning or end of `str` has any whitespace, a new string is still returned (essentially a copy of `str`).
- If you want to `trim()` on just one end,  use [`trimStart()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trimStart) or [`trimEnd()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trimEnd)
- You can achieve the somewhat opposite effect of `trim()` by using padding methods which take the desired final length and padding characters as arguments:
```js
const fullNumber = '2034399002125581';
const last4Digits = fullNumber.slice(-4);
const maskedNumber = last4Digits.padStart(fullNumber.length, '*');

console.log(maskedNumber);  // "************5581"

const str2 = '6';
console.log(str2.padEnd(9));   // "6        " 
```
### .replace()
```js
// Syntax:
someString.replace(pattern, replacement)
```
- Returns a **new** string, with one or all matches of the `pattern` replaced by the specified `replacement`.
- The `pattern` could be a `string` or a `regex`, the `replacement` could be a `string` or a `function`:
```js
// If the `replacement` is a function, it will be called with the matched groups (as well as the whole match) as arguments, and its return value will be inserted into the new string:
let stock = "1 lemon, 2 cabbages, and 101 eggs";
function minusOne(match, amount, unit) { 
  amount = Number(amount) - 1;
  if (amount == 1) { // only one left, remove the 's'
    unit = unit.slice(0, unit.length - 1);
  } else if (amount == 0) {
    amount = "no";
  }
  return amount + " " + unit;
}

// `(\d+)` is bound to `amount` and `(\p{L}+)/gu` to `unit`. So there are 3 matches: "1 lemon", "2 cabbages", "101 eggs"
console.log(stock.replace(/(\d+) (\p{L}+)/gu, minusOne));
// → no lemon, 1 cabbage, and 100 eggs
```
- If `pattern` is a ***string***, ==only the *first==* occurrence will be replaced. 
- If `pattern` is an empty string, the replacement is prepended to the *start* of the string.
- To replace ***all*** `pattern` matches, use a regex with the [[Regular Expressions#`g` |g]] flag, or use [`.replaceAll()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replaceAll) instead.
```js
// Examples:
const randomString = "I saw a dog jumps over three dogs, turns out it's just a cat."

// "I saw a cat jumps over three dogs, turns out it's just a cat."
console.log(randomString.replace('dog', 'cat'));

const regex = /dog/g;
// "I saw a weasel jumps over three weasels, turns out it's just a cat."
console.log(randomString.replace(regex, 'weasel'));

// `$1` is replaced by the text that matched against the first group, `$2` by the second, and so on, up to `$9`. The whole match can be referred to with `$&`:
console.log(
  "Liskov, Barbara\nMcCarthy, John\nMilner, Robin"
    .replace(/(\p{L}+), (\p{L}+)/gu, "$2 $1"));
// Barbara Liskov
// John McCarthy
// Robin Milner
```
### .split()
```js
someStr.split(separator, _limit)
```
- Returns *an **array** of strings*, split at each point where the `separator` occurs in the given string.
- The `seperator` could be a `string` or a `regex`, so be careful and don't omit it or passing `undefined` or the method will executed by the string `"undefined"`.
- If the `seperator` is an empty `string`, it returns an array of all the characters in the given string
- `limit` is an optional param which is a _non-negative_ integer specifying the number of substrings (from the start) to be included in the return value. If `limit` is `0`, an empty array is returned. 
- If no param supplied, it returns an array with the given string as the only element.
- Commonly used in pair with the [[Everyday methods & utils#.join() |Array.join()]] method for string format.
```js
const str = 'Some long random string.';

const words = str.split(' ');
console.log(words[3]);   // "string."
console.log(words.join('-'))  // "Some-long-random-string."

const chars = str.split('');
// ["S", "o", "m", "e", " ", "l", "o", "n", "g", " ", "r", "a", "n", "d", "o", "m", " ", "s", "t", "r", "i", "n", "g", "."]
console.log(chars[8]);    

const strCopy = str.split('');
console.log(strCopy);    // ["Some long random string."]

const wordsLimit = str.split(' ', 2);
console.log(wordsLimit)  // ["Some", "long"]
```


