- A function that ***references (remembers)*** bindings *from local scopes around it* is called a closure. A good mental model is to think of function values as *containing* both the code in their body and the environment in *which they are created*. When called, the function body sees the environment in which it was ***created*** (its [[Lexical Scope |lexical scope]]), ***not** the environment in which it is called*. This behavior frees you from having to worry about the lifetimes of bindings, for example:
```javascript
function ask(question) {
  // At the time the callback `waitASec` is executed, the `ask` function has already finished, i.e. the `question` variable "should've been" garbage-collected
  // But because of "closure", the `waitASec` function "closes over" its lexical scope (in this case: the parameter `question`)
  // i.e. its execution (which is outside of its local bindings - 1s later than the execution of `ask`)
  // still has access to its lexical scope (the parameter `question`)
    setTimeout(function waitASec(){
        console.log(question)
    }, 1000)
}

ask("What is closure ?")    // print "what is closure ?" after 1 sec.

//-------------------------
// In this example, `multiplier` is called and creates an environment in which its `factor` parameter is bound to `2`:
function multiplier(factor) {
  return number => number * factor;
}
// The function value it returns, which is stored in `twice`, REMEMBERS this environment so that when that is called, it multiplies its argument by `2`
let twice = multiplier(2);
console.log(twice(5)); //  10

  
//----------------
// Beware of the common `var` vs `let` misuse:
for (var i = 1; i <=3; i++) {
    setTimeout(function(){
// After the for loop has finished, `i` === 4, because `var` has global scope in this case
        console.log(`i: ${i}`)     
    }, i*1000)
}   // print "i: 4" every second for 3 times


// To fix it, use the `let` keyword: for every tick of the loop, a new local binding of the variable `i` is created, and the scoping of `let` is tied to that binding:
for (let i = 1; i <=3; i++) {
    setTimeout(function(){
        console.log(`i: ${i}`)    
    }, i*1000)
}  
```

- Be careful about the fact that the parameter *list* is its own scope if any of the parameters are **non-simple**:
```js
// There's a distinction between the lexical scope `var id` inside of `whatsTheDealHere` and the "closured" `id` param in this case: 
function whatsTheDealHere(id, defaultID = () => id) {
    var id;

    console.log(`local variable 'id': ${ id }`);
    console.log(
        `parameter 'id' (closure): ${ defaultID() }`
    );

    console.log("reassigning 'id' to 5");
    id = 5;

    console.log(`local variable 'id': ${ id }`);
    console.log(
        `parameter 'id' (closure): ${ defaultID() }`
    );
}

whatsTheDealHere(3);
// local variable 'id': 3   <--- This one is actually from the closure of `defaultID`
// parameter 'id' (closure): 3
// reassigning 'id' to 5  <--- After this line, the `var id` gets its value
// local variable 'id': 5
// parameter 'id' (closure): 3
```