- In JavaScript, every object has an internal property called `[[Prototype]]`, which acts as a template for the object and can be thought of as its ultimate parent object. So each object has a prototype (of its nearest parent), and the highest prototype itself is an object (which doesn't have a prototype, because it's the highest, i.e. calling `Object.getPrototypeOf(Object.prototype)` returns `null`). Properties that differ per instance need to be stored directly in the objects themselves.
- Objects act as if they have properties they don’t have as long as their prototype has that property. When a property or method is accessed on an object, JavaScript first looks for it on the object itself. If it is not found, it looks for it on the object's prototype. If it is still not found, it looks for it on the prototype's prototype, and so on, until it reaches the end of the prototype chain.
> Arrow functions don't have their `prototype`.
- Javascript `class` is a form of syntactic sugar for `prototype` inheritance:
```javascript
// Prototype:
function Workshop(teacher) {
    this.teacher = teacher
}

Workshop.prototype.ask = function (question) {
    console.log(this.teacher, question)
}

var deepJS = new Workshop("K")
var reactJS = new Workshop("S")

deepJS.ask("say something ?")   // "K say something ?"
reactJS.ask("say what ?")       // "S say swhat ?"

//-------------- Class --------------
class Workshop {
    constructor(teacher) {
        this.teacher = teacher
    }
    ask(question) {
        console.log(this.teacher, question)
    }  
}

var deepJS = new Workshop("K")
var reactJS = new Workshop("S")

deepJS.ask("say something ?")   // "K say something ?"
reactJS.ask("say what ?")       // "S say swhat ?"
```
## Modifying built-in instance methods
- We can leverage polymorphism to override built-in instance methods:
```js
class Rabbit {
  constructor(type) {
    this.type = type;
  }
  speak(line) {
    console.log(`The ${this.type} rabbit says '${line}'`);
  }
}

const blackRabbit = new Rabbit('black')

console.log('toString:', String(blackRabbit))  // '[object Object]'

Rabbit.prototype.toString = function () {
  return `a ${this.type} rabbit`;
};

console.log('toString:', String(blackRabbit))  // 'a black rabbit'
```

# Prototype chain
- Objects (instances of `class`) are built by "constructor calls" (via `new`). A "constructor call" makes an object inherits all the properties and methods from the `prototype` of whatever comes after `new`. An example of the prototype chain:
```js
class Rabbit {
  constructor(type) {
    this.type = type;
  }
  speak(line) {
    console.log(`The ${this.type} rabbit says '${line}'`);
  }
}

let killerRabbit = new Rabbit("killer");

console.log(Object.getPrototypeOf(Rabbit) == Function.prototype);
// true
console.log(Object.getPrototypeOf(killerRabbit) == Rabbit.prototype);
// true
console.log(Object.getPrototypeOf(killerRabbit) == Function.prototype); // false, because the prototype chain for `killerRabbit` looks like this:
// killerRabbit -> Rabbit.prototype -> Object.prototype -> null
// and the prototype of `killerRabbit` is `Rabbit` because it's created by `new Rabbit()`
```

- You can update the "prototype chain" by using `Object.create(ParentObject.prototype)` or using the "dunder proto" `__proto__`
```javascript
function Workshop(teacher) {
    this.teacher = teacher
}

// Add an `ask` method to `Workshop`:
Workshop.prototype.ask = function (question) {
    console.log(this.teacher, question)
}

// `AnotherWorkshop` now has a `teacher` "constructor", i.e: when calling `AnotherWorkshop.constructor`, it returns:
// f Workshop(teacher) {
//    this.teacher = teacher
//}
function AnotherWorkshop(teacher) {
	// `call()` allows for a function/method from an object to be assigned and called for a different object.
    Workshop.call(this, teacher)
}

// Same thing as `AnotherWorkshop.prototype.__proto__ = Workshop.prototype`:
AnotherWorkshop.prototype = Object.create(Workshop.prototype)
  
// `AnotherWorkshop` now "inherited" the `ask` prototype (method) from `Workshop`:
AnotherWorkshop.prototype.speakUp = function (msg) {
    this.ask(msg.toUpperCase())
}

var JSRecentParts = new AnotherWorkshop("K")
JSRecentParts.speakUp("this is kinda like inheritance")
// "K", "THIS IS KINDA LIKE INHERITANCE"
```

# OLOO
- Use the OLOO (Objects Linking to Other Objects) pattern to optimize the benefits of the "linking" that the "prototype" system offers :
```javascript
var Workshop = {
    setTeacher(teacher) {
        this.teacher = teacher
    },
    ask(question) {
        console.log(this.teacher, question)
    }
}

// `AnotherWorkshop` is now "linked" to `Workshop`, i.e. having `Workshop` as its prototype, that's how it can access `this.ask`
var AnotherWorkshop = Object.assign(
    Object.create(Workshop),
    {
        speakUp(msg) {
            this.ask(msg.toUpperCase())
        }
    }
)

// Use `Object.create` to create an object with a specific prototype
var JSRecentParts = Object.create(AnotherWorkshop)

JSRecentParts.setTeacher("K")
JSRecentParts.speakUp("this is how it should be")

// "K", "THIS IS HOW IT SHOULD BE"
```

- The so called "Inheritance" in other Object-oriented languages is actually "delegation" in JS. Inheritance is understood as a "parent-to-child" relationship where "**delegation**" more like a "**peer-to-peer**" relationship:
```javascript
var AuthController = {
    authenticate() {
        console.log("auth");
    },
    handleResponse() {
        this.displayError();
    }
};

var LoginFormController = Object.assign(
  Object.create(AuthController),
  {
      onSubmit() {
        this.authenticate(); // "delegated" to `AuthController`
      },
      displayError() {
        console.log("login");
      }
  }
);

var mockAuth = Object.create(AuthController);
var mockLogin = Object.create(LoginFormController);

// wrong:
// mockAuth.onSubmit()
// mockAuth.displayError()
// mockAuth.handleResponse();

// correct:
mockLogin.handleResponse();
mockLogin.onSubmit();
mockAuth.authenticate();
