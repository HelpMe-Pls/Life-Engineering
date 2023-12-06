# super
## Calling the parent constructor
- You need to call `super()` in the constructor of the child class before you can use `this`. The `super()` call ensures that the parent class constructor is executed before we try to access `this` in the child class (which is important because (in this case) the `Base` class constructor is responsible for initializing the newly created object):
```ts
class Base {
  constructor() {
    console.log('Base constructor');
  }
}

class Derived extends Base {
  constructor() {
    // console.log(this); >> Error: `super` must be called before accessing `this` in the constructor of a derived class.
    super();
    console.log(this); // Correct: `super` is called before accessing `this`.
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
