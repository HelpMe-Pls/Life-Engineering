- When a `class` defines the blueprint of a type of object, and it has a built-in `prototype` property. The methods you define inside the `class` (*other than the* `constructor`) are added to this `prototype` object. 
- When a `class` does not declare a `constructor`, it will automatically get an empty one. A `class`'s `constructor` is the built-in property of that `class`'s `prototype`, which points to the `class` itself:
```js
class ExampleClass {
  constructor() {
    this.property = 'value';
  }

  method() {
    console.log('Hello, world!');
  }
}

console.log(ExampleClass.prototype.constructor === ExampleClass);  // true
```
- When a new instance of the `class` is [[#new |created]], this instance has access to the `class`’s methods (but not the private ones) because it inherits from the `class`’s `prototype`.
- Overriding an existing `prototype`'s property in an object instance only affects that instance. The original `prototype`'s property is intact. Leverage this behavior when you want to express exceptional properties in instances of a more generic class of objects while letting the nonexceptional objects take a standard value from their prototype. You can only update the original property by explicitly access its `prototype`: 
```js
class Rabbit {
  constructor(name) {
    this.name = name;
  }
  teeth = 'small'
}
let killerRabbit = new Rabbit("killer");

console.log(killerRabbit.teeth); // → small

killerRabbit.teeth = "long, sharp, and bloody";
console.log(killerRabbit.teeth); // → long, sharp, and bloody

console.log((new Rabbit("basic")).teeth); // → small

Rabbit.prototype.teeth = 'huge'
console.log(Rabbit.prototype.teeth);  // → huge
```

> Javascript `class` is a form of syntactic sugar for `prototype` inheritance:
```js
// Prototype:
let protoRabbit = {
  squeak(line) {
    console.log(`The ${this.type} rabbit says '${line}'`);
  }
};
function makeRabbit(type) {
  let rabbit = Object.create(protoRabbit);
  rabbit.type = type;
  return rabbit;
}

// Make a new rabbit: 
// the `squeak` method serves as the prototype (and therfore, SHARED) among all instances created by `makeRabbit`
const blackRabbit = makeRabbit('black')
blackRabbit.squeak('stfu') // "The black rabbit says 'stfu'"

//---------------------------Class
// Define a class called `Rabbit`, which holds a constructor method that initializes the instance with a `type` property. 
// The class also has a `squeak` method on its prototype, which ALL instances can access:
class Rabbit {
  constructor(type) {  // equivalent to the `makeRabbit` above
    this.type = type;
  }
  squeak(line) {  // Rabbit.prototype
    console.log(`The ${this.type} rabbit says '${line}'`);
  }
}

// Make a new rabbit:
// Each instance of the `Rabbit` class will inherit the `squeak` method from the `Rabbit.prototype`
const blackRabbit = new Rabbit('black')
blackRabbit.squeak('stfu') // "The black rabbit says 'stfu'"
// So in those cases where a class's methods are shared among many instances, consider directly adding them to the `prototype` (i.e. outside the `contructor`, as public methods, to avoid extra memory allocation for the same value over and over again)

//---------------------------
// Back in the days when `class` wasn't introduced in JS:
function ArchaicRabbit(type) {
  this.type = type;
}
// the `squeak` method is now SHARED across new instances of this "class"
ArchaicRabbit.prototype.squeak = function(line) {
  console.log(`The ${this.type} rabbit says '${line}'`);
};

let oldSchoolRabbit = new ArchaicRabbit("old school");
oldSchoolRabbit.squeak('stfu') // "The old school rabbit says 'stfu'"
```
---
# Properties
## Methods
- Methods are properties that hold function values. Typically a method needs to do something with the object on which it was called.
- A private method/property (with the `#` prefix) can only be called from *inside* the `class` declaration that defines them. Public properties can be created by just assigning to them, but *private properties **must** be declared* in the `class` declaration to be available at all:
```js
class SecretiveObject {
  #max
  constructor(max) {
    this.#max = max;
  }
  #getSecret() {
    return "I ate all the plums";
  }
  interrogate() {
    return this.#getSecret(); // valid
  }
  getNumber() {
    return Math.floor(Math.random() * this.#max); // valid
  }
}

const hack = new SecretiveObject(10)
console.log(hack.interrogate())  // valid
console.log(hack.max)  // TypeError
console.log(hack.getSecret())  // TypeError
```
### Getters, setters & `static`
- You can define getters and setters to *intrinsically call* methods every time an object’s property is accessed:
```js
let varyingSize = {
  get size() {
    return Math.floor(Math.random() * 100);
  }
};
// Now we can do this:
console.log(varyingSize.size);

// Instead of this (if we WEREN'T use the `get`):
console.log(varyingSize.size())
```
- Same for setters:
```js
class Temperature {
  constructor(celsius) {
    this.celsius = celsius;
  }
  get fahrenheit() {
    return this.celsius * 1.8 + 32;
  }
  set fahrenheit(value) {
    this.celsius = (value - 32) / 1.8;
  }
}

let temp = new Temperature(22);
console.log(temp.fahrenheit); // 71.6

temp.fahrenheit = 86;  // Calling the setter
console.log(temp.celsius);  // 30
```
## Instance vs static methods
- Instance methods can only be called on instances of the class.
- Instance methods can access static properties, but not the other way around:
	- Static methods can ***only*** access static properties *and* methods.
- Static methods or properties are ***only*** available for the class defining it and its value is ***shared*** among all instances of the class, and therefore, changes to a static property are reflected across all instances. They are defined with the `static` keyword:
```js
class Temperature {
  // same code from above

  static fromFahrenheit(value) {
    return new Temperature((value - 32) / 1.8);
  }
}

// static method can only be called directly on the class itself
let boil = Temperature.fromFahrenheit(212);  
// `boil` is now an instance of `Temperature`
console.log(boil.celsius);  // 100

// Check for static methods
console.log("fromFahrenheit" in Temperature);  // true
console.log("fahrenheit" in Temperature.prototype); // true 
console.log(Object.hasOwn(Temperature, "fahrenheit"));  // false

// Check for instance methods
console.log("fahrenheit" in Temperature);   // false
console.log("fahrenheit" in boil);  // true
console.log(Temperature.hasOwnProperty("fromFahrenheit")); // true
```

# this
- A function's `this` references the ==*execution __context__*== for that ***call***, determined entirely by *__how__ the function was **called***. A `this`-aware _function_ can thus have a **different context** each time it's called, which makes it more flexible and reusable (sort of like *having dynamic scope*):

```javascript
// Implicit binding:
var w = {
    name: 'K',
    ask(question) {
        console.log(this.name, question)
    }
}

w.ask("??")   // "K ??"
  
//-----------------------
function ask(question) {
    console.log(this.name, question)
}

var w1 = {
    name: 'K',
    bark: ask
}

var w2 = {
    name: 'L',
    bark: ask
}

function otherClass() {
    var myContext = {
        name: 'S'
    }
    ask.call(myContext, "?")   // explicit `this` binding
}

otherClass()    // "S ?"

// Dynamic binding:
w1.ask("?")     // "K ?"
w2.ask("?")     // "L ?"

// `.call()` method treats their first argument as a `this` keyword (i.e. explicit binding):  
ask.call(w2, "explicitly set context.")  // "L explicitly set context."
ask.call(w1, "explicitly set context.")  // "K explicitly set context."
  

//---------Hard binding with `.bind() method----------
// You only need to "bind" if the method/function is "`this`-aware"
var w = {
    name: 'K',
    ask(question) {
        console.log(this.name, question)
    }
}

// Because of the implementation of `setTimeout()`, its first argument binds `this` to the global context
setTimeout(w.ask, 10, "?")   // undefined ?

// Which is why we need to hard bind `this` in this case to give it the context of `w` (i.e. "lexical `this`" behavior):
setTimeout(w.ask.bind(w), 10, "?") // K ?
```

- If we want a flexible dynamic, use `this`. If we want predictability, use closure (lexical scope), i.e. if you find yourself using `.bind()` very often, then best switch to use [[Closure |closure]].
- The `this` keyword points at these corresponding context following the order: `new` > `.call()`, `.apply()`, `.bind()` > context object > global context (except strict mode):
```javascript
// If `.apply()`, `.call()`, or `.bind()` are used to call/create a function, `this` inside the function is the object that is passed in as the argument.

// context object:
var w = {
    name: 'K',
    ask: function (question) {
       console.log(this.name, question)
    }
}
w.ask("??")   // "K ??"

//---------- global context ----------

var name = 'K' 

function ask(question) {
    console.log(this.name, question)
}

function askAgain(question) {
    "use strict"
    console.log(this.name, question)
}

ask("in non-strict mode")     // "K in non-strict mode"
askAgain("in strict mode")    // TypeError
```

- `this` *__doesn't__ mean anything* inside of an arrow function. Therefore, it's best practice to use arrow function if you want the "lexical `this`" behavior for a function:
```javascript
var this1 = {
    number: 123,
    logFunction: function () { console.log(this.number); },
    logArrow: () => console.log(this.number) // `this` is unrecognized, therefore it’s just like console.log(number), which is a `ReferenceError`
};

this1.logFunction();        // 123, because the `logFunction` is called from `this1`, so that's where its `this` points to

this1.logArrow();         // undefined, because `number` is undeclared in the scope of `logArrow` function, so it goes up in the lexical scope, in this case, is the global (which has no `number` in it)

var w = {
    name: 'K',
    ask(question) {
      // It goes up in the lexical scope and in the same scope of `ask`, it found `name`:
      setTimeout(() => console.log(this.name, question), 100)
    }
}

w.ask("??") // "K ??"
```
- `this` also preserved for params:
```ts
function add(this: { x: number; y: number }) {
  return this.x + this.y;
}

// Note that we're NOT declaring it as an arrow function
function setValues(this: { x: number; y: number }, x: number, y: number) {
  this.x = x;
  this.y = y;
}

// Should pass
it("Should add the numbers together", () => {
  const calculator = {
    x: 0,
    y: 0,

    add,
    setValues,
  };

  calculator.setValues(1, 2);

  expect(calculator.add()).toEqual(3);
});
```

- How to know ***when*** to use the arrow function: 
![[When to use the arrow function.png]]

# new
- The `new` keyword: is used to initialize (create an instance of) an object (or a subtype of it): `Object()`, `Array()`, `Function()`, `Date()`, `RegExp()`, `Error()` by following these step:
1. Create a brand new empty object 
2. Link that object's prototype to the corresponding `object.prototype` (depends what follows the `new`)
3. Call the function with `this` bound to the new object 
4. Returns the object from step 3. If it does not return an object, assume return of `this`
```javascript
function ask(question) {
    console.log(this.name, question)
}

// undefined 'Using the `new` keyword'
var newEmptyObject = new ask("Using the `new` keyword")
```

# Inheritance
>[!important]- Before thinking of extending a class
> When inheriting from a class, you usually have to know more about how it works than when simply using it. Inheritance can be a useful tool to make some types of programs more succinct, but it shouldn’t be the first tool you reach for, and you probably shouldn’t actively go looking for opportunities to construct class hierarchies (family trees of classes).
- Inheritance allows us to build slightly different data types from existing data types with relatively little work.
- The use of the word `extends` indicates that the child class shouldn’t be directly based on the default `Object` prototype but on the class it's derived from:
```js
class List {
  constructor(value, rest) {
    this.value = value;
    this.rest = rest;
  }

  get length() {
    return 1 + (this.rest ? this.rest.length : 0);
  }
  static fromArray(array) {
    let result = null;
    for (let i = array.length - 1; i >= 0; i--) {
      result = new this(array[i], result);
    }
    return result;
  }
}

class LengthList extends List {
  #length;

  constructor(value, rest) {
    super(value, rest);
    this.#length = super.length;
  }
  get length() {
    return this.#length;
  }
}

console.log(LengthList.fromArray([1, 2, 3]).length);  // 3
```

## Calling the parent constructor
- You need to call `super()` within the child's constructor before you can use `this`. The `super()` call ensures that the parent class `constructor` is executed before we try to access `this` in the child class (which is important because, in this case, because if this new child class is to behave (roughly) like its parent, it is going to need the instance properties that its parent has):
```ts
class Base {
  #x;
  #y;

  constructor(options?: { x: number; y: number }) {
    this.#x = options?.x ?? 0;
    this.#y = options?.y ?? 0;
  }
}

type ViewMode = "hidden" | "visible" | "selected";

// `Derived` inherited `Base`
class Derived extends Base {
  #viewMode: ViewMode;
// Same params passed into the constructor as its parent, and then the new `#viewMode` property
  constructor(options?: { x: number; y: number; viewMode?: ViewMode }) {
    // console.log(this); >> Error: `super` must be called before accessing `this` in the constructor of a derived class.
    super(options); // If you call the constructor with params then you must pass them along to the `super`
    console.log(this.#viewMode); // Correct: `super` is called before accessing `this`.
  }
}
``` 
## Accessing parent methods
- If you have a method that has the same name in a child class as in its parent, you can refer to parent *from the child* by using the `super.`:
```javascript
class Workshop {
    constructor(teacher) {
        this.teacher = teacher
    }
    ask(question) {
        console.log(this.teacher, question)
    }  
}

class AnotherWorkshop extends Workshop {
    ask(msg) {
        super.ask(msg.toUpperCase())
    }
}

var JSRecentParts = new AnotherWorkshop("K")
JSRecentParts.speakUp("using super")      // "K USING SUPER"
```
- We can use `super.something` to call methods and getters on the superclass’s prototype, which is often useful.
## `instanceof`
- It is occasionally useful to know whether an object was derived from a specific class. The `instanceof` operator can, given an object and a `constructor`, tell you whether that object is an instance of that constructor:
```js
console.log([1] instanceof Array)  // true

class Rabbit {
  constructor(type) {
    this.type = type;
  }
  speak(line) {
    console.log(`The ${this.type} rabbit says '${line}'`);
  }
}
let killerRabbit = new Rabbit("killer");

console.log(killerRabbit instanceof Rabbit) // true
console.log(Rabbit instanceof Rabbit) // false
console.log(Rabbit instanceof killerRabbit) // TypeError
```
- Almost every object is an instance of `Object`.