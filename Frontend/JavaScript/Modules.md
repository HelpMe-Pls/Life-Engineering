- Modules provide structure to bigger programs by separating the code into pieces with clear interfaces and dependencies. 
- The interface is the public part of the module that’s visible to other modules, and the dependencies are the other modules it makes use of. If module A uses functionality from module B, it is said to _depend_ on that module.
- Modules **encapsulate** data and behavior (methods) together. The state (data) of a module is held by its methods via closure. It's the idea to take some behavior and the data which that behavior operates on, then encapsulate it into a data structure, hide what we don't need to show and expose only the minimal necessary API (PoLP). Here's a simplest implementation of a module, with no dependencies:
```javascript
var workshop = (function Module(teacher){
    var publicAPI = {ask} // a shorthand for `ask: ask` (the `ask` function defined below)
    return publicAPI  // this object is the public interface of this module, which mean the code outside of this function is able to access its interface by calling `workshop.`
    // the LITERAL `publicAPI` is only accessible within this module
    
// This function is part of the `publicAPI` object. The `teacher` parameter is a private variable inside the module, and the `ask` function has access to it through closure.
    function ask(question){
        console.log(question, ",", teacher)
    }
})('K')

  
workshop.ask("Yep it's a module")   // "Yep it's a module, K"
workshop.teacher     // `undefined`, because it's `private`
// If you want `teacher` as a module, add it to the return value:
// var publicAPI = {ask, teacher}
```
> [!important]- Convention
> - It is helpful if your interface is simple and predictable, so that after you’ve worked with it once, you’re likely to remember how to use it.
> - You can keep your modules ***predictable*** by using simple data structures and doing a single, focused thing.
> - Often, defining new data structures can’t be avoided—only a few basic ones are provided by the language standard, and many types of data have to be more complex than an array or a map. But when an array suffices, use an array.
> - In the phase where you are still exploring the problem, trying different things to see what works, you might want to not worry about it too much since keeping everything organized can be a big distraction. Once you have something that feels solid, that’s a good time to take a step back and organize it.
# ES6 Modules vs CommonJS Modules
- An important difference between these 2 is that ES module `import`s happen before a module’s script starts running, whereas in CommonJS, `require` is a normal function, invoked when the module is already running. 
- Unlike `import` declarations, `require` calls _can_ appear inside functions, and the name of the dependency can be any expression that evaluates to a string, whereas `import` only allows plain quoted strings.
## CommonJS
- The ***deprecated*** CommonJS modules system wraps its code in a function (giving it its own local scope), and passes the `require` and `exports` bindings to that function as arguments:
```js
//----------------- format-date.js
const ordinal = require("ordinal");
const {days, months} = require("date-names");

exports.formatDate = function(date, format) {
  return format.replace(/YYYY|M(MMM)?|Do?|dddd/g, tag => {
    if (tag == "YYYY") return date.getFullYear();
    if (tag == "M") return date.getMonth();
    if (tag == "MMMM") return months[date.getMonth()];
    if (tag == "D") return date.getDate();
    if (tag == "Do") return ordinal(date.getDate());
    if (tag == "dddd") return days[date.getDay()];
  });
};

//----------------- someFile.js
const {formatDate} = require("./format-date.js");

// Friday the 13th
console.log(formatDate(new Date(2017, 9, 13), "dddd the Do"));
```

## ESModules
- The ***recommended*** ES modules (syntactic sugar for modules) are files that has the `.mjs` extension (for NodeJS $\leq$ 12.3.0).  TypeScript and recent Node versions has built-in support for ES modules. The `export` keyword is put in front of a function, class, or binding definition to indicate that it's public, and the rest is private:
```javascript
//------------------ ask.js
var name = 'K'  // private

export function ask(question){    // public
    console.log(question, ",", name)
}

//------------------ someFile.js
import {ask} from './ask.js'
console.log(ask('Something')) // Something, K
```

- Imported bindings can be renamed to give them a new local name using `as` after their name:
```js
import {dayName as nomDeJour} from "./dayname.js";
console.log(nomDeJour(3))  // whatever is it
```

> `export default` is often used for modules that only export ***a single*** binding.

- To import all bindings from a module at the same time, you can use `import *`. You provide a name, and that name will be bound to an object holding all the module’s exports:
```js
import * as itIs from "./dayname.js";
console.log(itIs.dayName(3)); // what it is
```
---
# Packages
- Once you start duplicating code, you’ll quickly find yourself wasting time and energy moving copies around and keeping them up to date. That’s where _packages_ come in. 
- A package is a chunk of code that can be distributed (copied and installed). It may contain one or more modules and has information about which other packages it depends on. 
- A package also usually comes with documentation explaining what it does so that people who didn’t write it might still be able to use it.
- `npm` is a repository of JavaScript packages. It is both an online service where you can download (and upload) packages, and a program (bundled with Node.js) that helps you install and manage them.
> [!info]- When to use `npm`
> - By offloading some work to `npm` modules, the code becomes a little smaller. Each individual module does something rather simple and can be read on its own.
> - Is it a good idea to use `npm` modules for things that we could have written ourselves? In principle, yes—for nontrivial things.
> - Keep in mind that depending on `npm` packages means you have to make sure they are installed, you have to distribute them with your program, and you might have to periodically upgrade them.
## Bundlers
- Because fetching a single big file tends to be faster than fetching a lot of tiny ones, web programmers have started using tools that combine their programs (which they painstakingly split into modules) into a single big file before they publish it to the Web. Such tools are called _bundlers_.
- Apart from the number of files, the _size_ of the files also determines how fast they can be transferred over the network. Thus, the JavaScript community has invented _minifiers_. 
	- These are tools that take a JavaScript program and make it smaller by automatically removing comments and whitespace, renaming bindings, and replacing pieces of code with equivalent code that take up less space.
- Don’t assume that a painful mess is “just the way it is”. You can improve the structure of almost everything by putting more thought into it.