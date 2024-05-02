[[Prototype]]
[[class]]

---
- `Object.keys` returns only an object’s _own_ keys, not those in the prototype. As an alternative to the `in` operator (which also look for those keys in prototype), you can use the `Object.hasOwn` (or `<yourObject>.hasOwnProperty(<yourProp>)`) function, which ignores the object’s prototype and check in its `constructor` instead:
```js
// Object:
console.log(Object.hasOwn({x: 1}, "x"));  // → true
console.log(Object.hasOwn({x: 1}, "toString"));  // → false

// Class:
class Temperature {
  constructor(celsius) {
    this.celsius = celsius;  // this is still considered an `instance` property, because of the `this` keyword
  }
  fahrenheit() {
    return this.celsius * 1.8 + 32;
  }

  static fromFahrenheit(value) {
    return new Temperature((value - 32) / 1.8);
  }
}

console.log(Temperature.prototype.hasOwnProperty("fahrenheit")); // true
console.log("fromFahrenheit" in Temperature);  // true, because `fromFahrenheit` defined with `static` so now it's considered a direct property of `Temperature`, not its instances or its prototype.
console.log("fahrenheit" in Temperature);  // false, because `fahrenheit` is an INSTANCE method (i.e. in prototype), not a static method or property of the `Temperature` class

console.log(Temperature.hasOwnProperty("fromFahrenheit")); // true
console.log(Object.hasOwn(Temperature, "fromFahrenheit")); // true
```
