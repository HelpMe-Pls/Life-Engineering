[[Basic Types]]
[[Type Transformation]]
[[Generics]]

# Classes
## Constructor
- You can opt out the constructor if all it does is assigning default values to your properties:
```ts
// This:
class CanvasNode {
  readonly x = 0;
  readonly y = 0;
}

// Is equivalent to this:
class CanvasNode {
  readonly x;
  readonly y;

  constructor() {
    this.x = 0;
    this.y = 0;
  }
}
```
- Set your constructor's params _optional_ by not destructuring them:
```ts
class CanvasNode {
  x;
  y;

  constructor(opts?: { x: number; y: number }) {  
		  //  ^ Not destructured as {x, y}
    this.x = opts?.x ?? 0;
    this.y = opts?.y ?? 0;
  }

  move(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

const canvasNode = new CanvasNode();  // valid
const anotherCanvasNode = new CanvasNode({
    x: 10,
    y: 20,
  });  // also valid
```
## Methods
- [Prefer](https://www.totaltypescript.com/method-shorthand-syntax-considered-harmful) the object property syntax when defining a method over the method shorthand syntax:
```ts
interface Obj {
  objectProperty: (param: string) => void;  // Prefer this
  methodShorthand(param: string): void;  // Over this
}
```
- If the child class declares a method with the same name as its parent, then that method is implicitly overridden. To make TS aware of that, use the `override` keyword with `"noImplicitOverride": true` option in the `tsconfig.json` file:
```ts
class BaseClass {
  method() {
    console.log("BaseClass method");
  }
}

class SubClass extends BaseClass {
  method() { // red squiggly line under `method`
    console.log("SubClass method");
  }
}
const instance = new SubClass();
instance.method();  // "SubClass method"

//----------------------------------------------------
// To fix it, either re-declare it with the `override` prefix or change its name entirely:
class SubClass extends BaseClass {
  override method() { // no more red squiggly line under `method`
    console.log("SubClass method");
  }
}
```
### Public vs Private
- Use the `private` keyword (only available in TS) if you want to replace the repeated `#` syntax (JS standard) to define and access private properties:
```ts
// The TS way:
class CanvasNode {
  private x = 0;
  private y = 0;
  
  get position() {
    return {
      x: this.x,
      y: this.y,
    };
  }
}

// The JS standard:
class CanvasNode {
  #x;
  #y;

  get position() {
    return {
      x: this.#x,
      y: this.#y,
    };
  }
}
```
- You can inline the property declaration as constructor's params:
```ts
// This class
class CanvasNode {
  constructor(private x: number, private y: number) {}

  move(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  get position() {
    return { x: this.x, y: this.y };
  }
}

// Is equivalent to this one
class CanvasNode {
  #x; #y
  constructor(x: number, y: number) {
    this.#x = x;
    this.#y = y;
  }

  move(x: number, y: number) {
    this.#x = x;
    this.#y = y;
  }

  get position() {
    return { x: this.#x, y: this.#y };
  }
}
```
### Setters vs Getters
- Setter's param is inferred from its getter:
```ts
class CanvasNode {
  #x;
  #y;

  constructor(position?: { x: number; y: number }) {
    this.#x = position?.x ?? 0;
    this.#y = position?.y ?? 0;
  }

  get position() {
    return {
      x: this.#x,
      y: this.#y,
    };
  }

  set position(pos) {  // `pos` type is automatically inferred
    this.#x = pos.x;
    this.#y = pos.y;
  }

  move(x: number, y: number) {
    this.#x = x;
    this.#y = y;
  }
}
```
- If you only define a getter (without a setter), then the property becomes effectively `readonly`:
```ts
class CanvasNode {
  x: number;
  y: number;

  constructor(position?: { x: number; y: number }) {
    this.x = position?.x ?? 0;
    this.y = position?.y ?? 0;
  }

  get position() {
    return {
      x: this.x,
      y: this.y,
    };
  }

  move(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.position = { x: 6 , y: 9};  
		// ^ Cannot assign to 'position' because it is a read-only property.    
  }
}
```
### Implement interface
- To make sure classes adhere to a specific interface or type (but not the other way around), declare them with the `implements` keyword. Note that the properties defined in the interface must be implemented as **public** properties:
```ts
type IShape = {
  id: string 
  position: { x: number; y: number };
  move: (deltaX: number, deltaY: number) => void;
}

class Shape implements IShape { // red squiggly line under Shape
  #x: number;
  #y: number;
// If `id` is added then it must not be private, or exposed by a getter like:
// get id() {
//   return this.#id;
// }
  constructor(initial?: ShapeOptions) {
    this.#x = initial?.x ?? 0;
    this.#y = initial?.y ?? 0;
  }
  // More code...
}
```
- Interfaces with same name are merged:
```ts
interface ZZ {
  aa: string
}

interface ZZ {
  bb: number
}

class DD implements ZZ {
// Missing one of these props will result in a type error
  aa;
  bb;

  constructor({first, second}: {first: string; second: number}){
    this.aa = first ?? '0'
    this.bb = second ?? 1
  }
  get props(){
    return [this.aa, this.bb]
  }
}
```

# Type annotation
- Use the `satisfies` operator when you want want compile-time validation without type widening:
```ts
type Color =
  | string
  | {
      r: number;
      g: number;
      b: number;
    };

// With type annotation:
const config: Record<string, Color> = {
  foreground: { r: 255, g: 255, b: 255 },
  background: { r: 0, g: 0 },  // ❌ Error: missing property `b`
  border: "transparent"
};

config.border.toUpperCase(); // ❌ TS Error & no autocomplete on `config.`
//   ^ `config.border` is possibly `undefined`, because `config.` could be any string, as per `Record<string, Color>`

// Without type annotation, TS will automatically infer its type, but there's no type check as we define the properties:
const config = {
  foreground: { r: 255, g: 255, b: 255 },
  background: { r: 0, g: 0 },  // ⚠️ No type safety: this could be anything
  border: "transparent",
};

config.border.toUpperCase();  // No more errors, `config.` is suggested by TS Server inference

// What if we wanted the best of both worlds: to keep the `Record<string, Color>` annotation so that we're still able to benefit from the enforced type safety while keeping the suggestions from TS Server? That's where `satisfies` comes in handy:
const config = {
  foreground: { r: 255, b: 255 },  // ❌ Error: missing property `g`
  background: { r: 0, g: 0, b: 0 },
  border: "transparent", 
  69: '96' 
} satisfies Record<string, Color>;

config.border.toUpperCase();  // No more errors & autocomplete is now available on `config.` 
```

- It also works for callbacks:
```ts
interface User {
  id: number;
  name: string;
}

const users = [
  {
    name: "Waqas",
  },
  {
    name: "Zain",
  },
];

const usersWithIds: User[] = users.map(
  (user, index) =>
    ({
      ...user,
      id: index,
      age: 30, // ❌ Error: `age` does not exist in type `User`
    } satisfies User),
);
```

- Use with `as const` for more specific errors. Note that `as const` _precedes_ `satisfies`, because `as const` is only applicable for values, not types:
```ts
const routes = {
  "/": {
    component: "Home",
  },
  "/about": {
    component: "About",
    search: "?foo=bar", // ❌ Error: violates the `Record<...>` annotation
  },
} as const satisfies Record<string, { component: string }>;

routes["/"].component = "About"; // ❌ Error: violates the `as const` assertion
```