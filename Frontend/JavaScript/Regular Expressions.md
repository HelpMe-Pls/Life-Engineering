- Regular expressions (regex) are objects that represent (in-order) patterns in strings. They use their own language to express these patterns. They form a small, separate language that is part of JavaScript and many other languages and systems.
- Properly understanding regular expressions will make you a more effective programmer. They simplify some tasks tremendously but can quickly become unmanageable when applied to complex problems. Part of knowing how to use them is resisting the urge to try to shoehorn things into them that they cannot cleanly express.

| Regex       | Meaning                                                                                                                 |
| ----------- | ----------------------------------------------------------------------------------------------------------------------- |
| `/abc/`     | A sequence of `abc`                                                                                                     |
| `/[abc]/`   | Any character from a [[#Set \|set]] of `abc`                                                                            |
| `/[^abc]/`  | Any character **_not in_** a set of `abc`                                                                               |
| `/[0-9]/`   | Any digit in an inclusive range of `0` to `9`                                                                           |
| `/x+/`      | One or more occurrences of the *pattern* `x`                                                                            |
| `/x+?/`     | One or more occurrences, [[#Greedy \|nongreedy]]                                                                        |
| `/x*/`      | Zero or more occurrences                                                                                                |
| `/x?/`      | Zero or **one** occurrence (e.g. `/ouu?r/.test("our")`  returns `true`)                                                 |
| `/x{2,4}/`  | Two to four occurrences                                                                                                 |
| `/(abc)/`   | A capturing [[#Matching groups \|group]]                                                                                |
| `/a\|b\|c/` | Any one of several patterns. Check out an example [[#Matching groups \|here]]                                           |
| `/\d/`      | Any *Unicode digit* character                                                                                           |
| `/\D/`      | Any _**non** digit_ character (notice the uppercase tag name)                                                           |
| `/\w/`      | Any Latin _alpha**numeric**_ character (a word - a letter or number or underscore)                                      |
| `/\W/`      | Any Latin _**non**alpha**numeric**_ character (e.g. `đ` or `β` will match this and `/\w/u`)                             |
| `/\s/`      | Any Unicode *whitespace* character                                                                                      |
| `/\S/`      | Any Unicode _**non**whitespace_ character                                                                               |
| `/\b/`      | Word boundaries. It *checks* one side of the pattern *is* a word character and the other side *is no*t a word character |
| `/\B/`      | Non-word boundaries. Checkout an [[#Matching groups \|example]]                                                         |
| `/./`       | Any character except newlines. Checkout an [[#`s`\| exception]]                                                         |
| `/\p{L}/u`  | Any *letter* character from [[#`u`\| any language]], excluding underscore                                               |
| `/^/`       | Start of input (e.g. `/x^/` does not match any string)                                                                  |
| `/$/`       | End of input                                                                                                            |
| `/(?=a)/`   | A [[#Matching groups \|look-ahead]] test                                                                                |

---
# Test for matching patterns
## Representing a regex
- There are 2 ways to define a regex:
```js
// using the `RegExp` constructor, useful when you need to DYNAMICALLY construct a regular expression based on user input or other variables:
let re1 = new RegExp("abc");

// using the regex literal (with forward slashses), useful when you're defining a read only regex:
const re2 = /abc/;
```

## Applying the regex
### Methods
- The `test` method returns a `Boolean` telling you whether its argument *contains* a match of the pattern in the expression:
```js
console.log(/abc/.test("zzxabcde"));  // → true
console.log(/abc/.test("abxce"));  // → false
```
- The `exec` method that will return `null` if no match was found and return an object with information about the match otherwise:
```js
let res = /\d+/.exec("one two 100");
console.log(res);  // ["100"]
console.log(res.index);  // 8: tells us where in the string the FIRST successful match begins
```
- The `match` method behaves similarly to the `exec`, with some main differences:
	- The `match` takes the regex as its argument while `exec` takes the target string
	- See [[#Matching groups |capturing group]] to understand its return value
	- The `exec` doesn't work with `g` flag
	- To avoid the `g` flag gotcha, use `matchAll` instead (i.e. the regex given to `matchAll` _must_ come with a `g`)
```js
const regex = /hello/ig;
const str = "Hello, world! hellooo";

const exec = regex.exec(str);
console.log(exec);   // [ "Hello" ]

const match = str.match(regex);
console.log(match);   // [ "Hello", "hello" ]

//--------------- `matchAll`
let input = "A string with 3 numbers in it... 42 and 88.";
let matches = input.matchAll(/\d+/g);

for (let match of matches) {
  console.log("Found", match[0], "at", match.index);
}
// Found 3 at 14
// Found 42 at 33
// Found 88 at 40
```
- The `search` method returns the ***first** index* on which the expression was found, or `-1` when it wasn’t found:
```js
console.log("  word".search(/\S/));  // 2
console.log("    ".search(/\S/));   // -1
```
#### `lastIndex`
- If the match was successful, the call to `exec` automatically updates the `lastIndex` property to point *right after* the match. If no match was found, `lastIndex` is *always* set back to the **default** `0`:
```js
let pattern = /y/g;
pattern.lastIndex = 3;
let match = pattern.exec("xyzzy");

console.log(match.index);  // 4
console.log(pattern.lastIndex);  // 5

pattern.exec('dcds')
console.log(pattern.lastIndex); // 0
```

### Flags
- The following characters: `g`, `y`, `m`, `s`, `i`, `u`, if declared at the end of a regex, has special meaning:
```js
// using the `RegExp` constructor:
let re1 = new RegExp("aBc", "i");

// using regex literal:
const re2 = /aBc/i;
```
#### `g`
- Stands for "*g*lobal search". Use this when you want to get *all* matches, not just the first one. Without the global flag, subsequent searches will return the same match
> [!important]- `lastIndex` gotcha
> The global search also updates the `lastIndex` value, and therefore, your regex might be accidentally starting at an index left over from a previous call
```js
let str = "Hello, hello, HELLO"

let withGlobal = /hello/ig
let result = str.match(withGlobal)  // ["Hello, hello, HELLO"]

let withoutGlobal = /hello/i
let res = str.match(withoutGlobal)  // ["Hello"]

//---------- Updates `lastIndex`
let global = /abc/g;
console.log(global.lastIndex);  // 0
console.log(global.exec("xyz abc"));  // ["abc"]
console.log(global.lastIndex);    // 7

// Be careful: 
let digit = /\d/g;
console.log(digit.exec("here it is: 1"));  // ["1"]
console.log(digit.exec("and now: 1"));   // null
``` 
#### `y`
- Stands for "stick*y*" meaning the expression will only match exactly ***at*** its `lastIndex` position and to *stop the search* as soon as a match is found (i.e. the `g` flag doesn't work if it's set with `y`):
```js
let regex = /test/y;
regex.lastIndex = 4;

let str = "test test";
console.log(str.match(regex));  // null, because `lastIndex` of `4` is a `space` character
```
#### `m`
- Stands for *m*ultiline. With this flag, the `^` and `$` anchors match the start and end of any line, respectively, instead of the start and end of the entire string:
```js
let str = `1st place: Winnie
2nd place: Piglet
3rd place: Eeyore`;

console.log(str.match(/^\d/gm)); // ['1', '2', '3']
```
#### `s`
- Called the "dotAll". It works as an extension of the `.` pattern which also matches `\n` tags:
```js
let text = "First line\nSecond line";
let pattern = /First.*Second/s;
console.log(text.match(pattern)); // ["First line\nSecond"]
```
#### `i`
-  Stands for "*i*gnore case". Makes the whole expression case-insensitive. For example, `/aBc/i` would match `AbC`.
#### `u`
- Enables *U*nicode.
- Commonly paired with the `\p` tag to match all characters to which the Unicode standard assigns a given property:

| Regex                 | Meaning                                                                   |
| --------------------- | ------------------------------------------------------------------------- |
| `\p{L}\u`             | Any *letter* character from [[#`u`\| any language]], excluding underscore |
| `\P{L}\u`             | !`\p{L}\u` (notice the capital `P`)                                       |
| `\p{N}\u`             | Any numeric character                                                     |
| `\p{P}\u`             | Any punctuation character                                                 |
| `\p{Script=Hangul}\u` | Any character from the given script. In this case, `여자` matches           |
- Useful if you want to test special characters:
```js
// These emojis are made of 2 code units, to without the `u` flag, it only test for the second code unit, which is not the whole emoji as you expected
console.log(/<.>/.test("<🌹>"));   // false
console.log(/<.>/u.test("<🌹>"));  // true
console.log(/🍎{3}/.test("🍎🍎🍎")); // false
console.log(/🍎{3}/u.test("🍎🍎🍎"));  // true
```

### Set 
- The square brackets (like the array notation: `[]`) holds the ***inclusive*** range (with a hyphen `-` in between) of *continuous (in-order) characters* to be matched with *a singular* target character. 
- `.` and `-` lose their meaning (treated as literals) in a set. The hyphen (`-`) only works if it's representing a range, other than that, it's treated as a literal match.
- A "not" set, i.e. to express that you want to match *any* character except the ones in the set, is defined by adding a caret (`^`) at the beginning of the set.
- For example:
```js
console.log(/[5-9]/.test("96")); // true, `9` matched
console.log(/[56789]/.test("69"));  // true, `6` matched
console.log(/0-9/.test("69")); // false, because the regex is not a set 
console.log(/0-9/.test("0-9"));  // true, because this regex is checking if it matches the literal string "0-9"

// false, the regex is checking for 2 characters
console.log(/\d./.test("4"));  
// true, the literal being checked is "6\9", so `6\` matched
console.log(/\d./.test("6\\9")); 
// true, the `.` has no meaning, so the regex considered checking for 1 digit character OR the literal `e`, therefore, `9` matched
console.log(/[\d.e]/.test("9"));  

let nonBinary = /[^01]/;
console.log(nonBinary.test("1100100010100110")); // → false
console.log(nonBinary.test("0111010112101001")); // → true
```

### Match repeating patterns
- Use braces `{}`, to specify the number of repeats for a pattern:
```js
let dateTime = /\d{1,2}-\d{1,2}-\d{4} \d{1,2}:\d{2}/;
console.log(dateTime.test("1-30-2003 8:45")); // true
```
- You can also specify open-ended ranges when using braces by omitting the number after the comma. For example, `{5,}` means five or more times.

### Matching groups
- Groups can be useful for extracting parts of a string. Matched subexpressions grouped with parentheses `()`, i.e. *captured groups*, are ***shown from the second element*** and beyond in the output array. If there's no match, it'll be `undefined`:
```js
let quotedText = /'([^']*)'/;
// The whole matched target is the first element, and the matched target inside the parenthesis is the second element 
console.log(quotedText.exec("she said 'hello'"));  // ["'hello'", "hello"]

console.log(/bad(ly)?/.exec("bad")); // ["bad", undefined]

console.log(/\d/.exec("123"));     // ['1']
console.log(/\d+/.exec("123"));    // ['123']
console.log(/(\d)+/.exec("123"));  // ['123', '3']

//------------- Word boundaries example
function hasThanks(str) {
  return console.log(str.match(/\b(thanks|thank you)\b/i));
}

hasThanks("Thanks! You helped me a lot."); // ["Thanks", "Thanks"]
hasThanks("Thanksgiving is around the corner."); // null

console.log(/ \B/.exec("abc "))  // [" "], the "end-of-string" is considered a pass for the `non-word boundary`, so the `space` after the `c` is matched 
```
- If you want to use parentheses purely for grouping, without having the matched group to show up in the output array, you can put `?:` after the opening parenthesis:
```js
console.log(/(?:na)+/.exec("banana"));  // ["nana"]
```
- The pattern written between `(?=` and `)` called the look-head test. It matches a pattern only if it is followed by another pattern. Its inverse (negative look-ahead) is `(?!` and `)`
	- Keep it mind that the look-ahead is just an assertion, so its pattern doesn’t become part of the matched text:
```js
// Only match an `a` followed by an `e`, but since the look-head is only a check, the `e` isn't included in the output array
console.log(/a(?=e)/.exec("braeburn"));  // ["a"]

// Ngative look-ahead
console.log(/a(?! )/.exec("a b"));  // null
```
- Parentheses can be used to limit the part of the pattern to which the pipe operator applies:
```js
let animalCount = /\d+ (pig|cow|chicken)s?/;
console.log(animalCount.test("15 pigs"));  // true
console.log(animalCount.test("15 pugs"));  // false
```

### Greedy
- The repetition operators (`+`, `*`, `?`, and `{}`) are _greedy_, meaning they match as much as they can and backtrack from there. If you put a question mark after them (`+?`, `*?`, `??`, `{}?`), they become nongreedy and start by matching *as little as possible*:
```js
function stripComments(code) {
  return code.replace(/\/\/.*|\/\*[^]*?\*\//g, "");
}
// The `[^]*` matches as many characters (that are not empty) as it can, so without the `?`, it'll also matches any `*/` in between except for the rightmost `*/`  
console.log(stripComments("1 /* a */+/* b */ 1"));  // 1 + 1
```
> When using a repetition operator, prefer the nongreedy variant.

### Escaping
- The backslash (`\`) is used for escaping the reserved characters that are used for defining a regex, which are  `.`, `*`, `+`, `?`, `^`, `$`, `(`, `)`, `[`, `]`, `{`, `}`, `|`, and the `\` itself. For example, if you want to indicate a literal `+` in your target (e.g. matching the literal `A+` string), then your regex would be: 
```js
// using the `RegExp` constructor:
let re1 = new RegExp("A\\+"); 
// when the regex is in a string format:
// the first backslash immediately next to the `+` is used for escaping the `+` itself, i.e. matching the literal `+`, and so the second backslash is required for the first backslash to be correctly intepreted in the string format of the regex, i.e. to be resolved into `/A\+/`. 
// without the second backslash, the resolved regex would be `/A+/`, which has a different meaning: matches one or more occurences of the literal `A`

// using the regex literal:
let re2 = /A\+/;
```

> For every **literal** backslash that you want a regex to match, three additional backslashes is required in the `RegExp` constructor form. For example:
```js
let re = new RegExp("a\\\\b")  // -> Match the literal `a\b` string
```

- Those special character tags with backslash (like `\n`, `\t`,...) still remain their intrinsic functionality, and their backslash must also be escaped with another backslash *if* you want to match a string which contains a special character tag, for example:
```js
// Match the literal `a\n` string:
let re3 = /a\\n/

// Match the following literal (an `a` followed by a `b` on the next line):
`
a
b
`
let re4 = /a\nb/
```

- If you want to match the reserved characters literally:
```js
let name = "dea+hl[]rd";
let escaped = name.replace(/[.+*?[{()\\|^$]/g, "\\$&");
let regexp = new RegExp("(^|\\s)" + escaped + "($|\\s)", "gi");

let text = "This dea+hl[]rd guy is super annoying.";
console.log(regexp.test(text))  // true
```
- **Both** the opening `(` *and closing* `)` parentheses are special characters in regex because they’re used for [[#Matching groups |grouping]], so they're escaped to match them literally, while only the *opening* `{`, `[`, and the `\` are escaped. The closing `]` and `}` are included as is because they’re *not special* characters when they’re not used in conjunction with their opening counterparts, so it doesn't matter if they're escaped or not.