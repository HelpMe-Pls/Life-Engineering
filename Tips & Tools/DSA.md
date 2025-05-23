# Concepts
## Memory
- The CPU takes both data and some instructions on how the data is to be processed. All this information exists as bytes or a series of ones and zeros that are determined by a small electrical current.
- The CPU can work faster than information can be transferred to it. Often a CPU will be working on a number of different tasks near simultaneously.
- The quicker and more expensive memory is always found near the CPU. This relates to the speed at which a computer can transfer memory into the cache for processing.
- Memory capacity then refers to the number of bytes that a computer can hold. There are 3 main types of memory:
	1. Cache memory: the most expensive form of memory and lives close to your CPU chip. When the CPU receives an instruction to process some information, it first checks the cache to see if the information is here. If the information is available in the cache, it is processed, if it fails to find the required information here, The CPU then queries the larger, slower main memory then loads this information into the cache for processing. Storing recently accessed information in the cache can improve the effectiveness of your system by reducing the search and transfer time of regularly used data. 
	2. Main memory: holds only the information that a computer is currently working on. It can be volatile or non-volatile. **Volatile** memory (**RAM**) stores information *actively* so if the computer loses power, it is lost. **Non-volatile** memory (**ROM**) *retains* its information when the power is cut.
	   - ROM stores the instructions and data that are critical for a computer's function. It's busiest when the computer starts and information on the required application is loaded. 
	   - RAM is programmable, it can retain new information and instructions. RAM holds the current data and instructions that are in current use. Large amounts of RAM mean that the system does not need to transfer information constantly. Instead it can hold and run a number of applications at once using RAM. All the memory needed to operate these applications needs to be available from your RAM. Having too many programs open will affect the performance of your system by exhausting your RAM memory
	3. Secondary memory: they are external memory that can be plugged in externally and used to increase the storage capacity of your system, e.g. cloud storage, external hard drives and memory sticks. Accessing secondary memory is *slower* and requires transferring all required information and instructions into RAM. 
- [Stack vs Heap](https://courses.engr.illinois.edu/cs225/fa2022/resources/stack-heap/) memory.

## Big O
- Big O time is the metric we use to analyze the **scalability** and **efficiency** of algorithms. It measure of how much *slower* the code will get as the *inputs* grow. It helps you understand how an algorithm _scales_.
- Big O just describes the ***rate*** of increase (i.e. allows us to express how the runtime scales). For this reason, we *drop the constants* in runtime. An algorithm that might have described as $O(2n)$ is actually $O(n)$.
- If your algorithm is in the form "do this, *then*, when you're *all done* with this, do that" then you ***add*** the runtimes. If your algorithm is in the form "do this *for each time* you do that" then you ***multiply*** the runtimes:
```java
// O(A + B)
for (int a : arrA) {
	print(a);
}
for (int b : arrB) {
	print(b);
}

// O(AB)
for (int a : arrA) {
	for (int b: arrB) {
		 print(a + "," + b);
	 }
}
```
### Time complexity
- It is the variation (increase or reduction) in execution time (*how long* it takes) when the *number of operations* in an algorithm increases or decreases. It is an important tool as it helps us ***estimate the efficiency*** of an algorithm and *identify bottleneck*s in the code.
- To estimate the time complexity, we need to calculate ***the number of times*** an operation is executed (in proportion to the *size and cost* of input): 
	- $O(1)$ - Constant time: where `1` represents the ***same*** amount of time required for an algo to execute (i.e. it's ***independent*** of the size of the input). E.g. accessing an array element
	- $O(n)$ - Linear time: the time it takes to run the algorithm is increased proportionately as the size of input `n` increases (e.g. traversing an array). $O(\sqrt{n})$ time complexity could be an improvement for $O(n)$ if you can't get it to $O(log\enspace n)$ 
	- $O(log\enspace n)$ - Logarithmic time: basically means **execution time** goes up *linearly* while the **input size** of `n` goes up *exponentially* (in CS we assume the base of `log` is `2`). Another way to put it: $\log_a{b}$ is the *number of times* you can divide `b` by `a` before reaching `1` (the base case), i.e. the number of levels in a recursion tree where it's divided by a factor of `a` from the input size `b`. Binary search is an example.
	- $O(n^2)$ - Quadratic time: it is the reverse of logarithmic time, i.e. execution time grows *exponentially* proportional to the input size. E.g. nested loops iterating the ***same*** array, or search if 2 arrays have a common element.
```js
// O(1):
var arr = [6, 8, 3, 69, 5];
arr[3] // 69

// O(n):
for (let i = 0; i < arr.length; ++i) {
	// The greater `arr.length`, the more time it takes
	console.log(arr[i])
}

// O(log n):
// When you see a problem where each iteration doubles the previous value until reaching n (or halves the previous value until reaching 1), then it'll likely be an O(log n) runtime problem
for (let i = 1; i < n; i*=2)  {
	// For instance, if `n = 64`, then:
	// `log n` in this case is log base 2 of 64, which is 6
	// Therefore, this `console.log(i)` below is executed 6 times
	// As `n` increases EXPONENTIALLY (2^x = n), the iteration (x) increases LINEARLY (+1)  
	// E.g. n == 128 (2^7) >> `console.log(i)` is executed 7 times
	console.log(i)
}
```

- Generally speaking, when you see an algorithm with multiple recursive calls, you're looking at exponential runtime.
- To improve time complexity: terminate the iteration by including a `return` statement or using a Boolean dependent loop if you're searching for a value  
### Space complexity
- It measures the total [*amount of memory*](https://www.scaler.com/topics/data-structures/space-complexity-in-data-structure/) that an algorithm or operation ***needs*** to run ***according to*** its input size.
- `Space complexity = Input space + Auxiliary space`:
	- **Input space**: refers to the space required to add data to the function, algorithm, application or system that you are evaluating. For instance, if the algorithm sorts an array of integers, then the input space is the memory occupied by that array.
	- **Auxiliary space**: is the *temporary* space needed to compute a given solution (i.e. the space required to hold any *additional* variables *during* the computations of an application, the space that the algorithm needs _on top_ of input space). When we try to compare two algorithms, we usually have a similar type of input, that is, the size of the input can be disregarded and thus what we do _end up comparing is the auxiliary space of the algorithms_.
	- The _expanding rate_ of memory required for an algorithm is essentially what space complexity is all about:
```js 
let arr = []

let n = 69  // some random int

// `arr` is expanding with the rate of `n*n` so it's `O(n^2)` space needed:
for i=0 to n 
	for j=0 to n
		arr.push(i+j)
```
- Space complexity is a parallel concept to time complexity. **Increasing speed (reduced time complexity) will most often (*not always*) lead to increased memory consumption and vice-versa**.
- If we need to *create* an array of size `n` (from the process of running the algo), this will require $O(n)$ space. If we need a two-dimensional array of size `n` $×$ `n`, this will require $O(n^2)$ space.
- However, just because you have `n` function calls in total doesn't mean it takes $O(n)$ space, i.e. the ==space complexity only increased when _each_ execution of the algo requires the ***acquisition*** of ***more*** memory== (i.e. auxiliary space) for it. Therefore, a suggestion for improving space complexity is to overwrite existing variables and avoid creating more variables/data structures than needed.
---

# Tools and techniques
## Data Structures
- Data structures are the containers in which programmers can store the data in an organized way such that it can be used later efficiently.
- **Static data structures** (e.g. arrays) are of fixed size and memory is allocated at the compile time by the compiler and deallocates when they go out of scope or program ends. 
- **Dynamic data structures** (e.g. linked lists, trees, heaps) are of dynamic size and memory is allocated at the runtime for them by the program. Memory is deallocated for dynamic data structure only when the program ends or the user deallocates it manually.
- When to use which, in order of frequency they appear in coding interview questions:
	- **Hash Maps**: Useful for making *lookup* efficient. This is the most common data structure used in interviews and you are guaranteed to have to use it.
	- **Graphs**: If the data is presented to you as *associations* between entities, you might be able to model the question as a graph and use some common graph algorithm to solve the problem.
	- **Stack and Queue**: If you need to parse a string with *nested properties* (such as a mathematical equation), you will almost definitely need to use stacks.
	- **Heap**: Question involves scheduling/ordering based on some *priority*. Also useful for finding the max K/min K/median elements in a set.
	- **Tree/Trie**: Do you need to store strings in a *space-efficient* manner and *search* for strings (or at least part of them) very quickly?

### Basic
#### String
- Some languages like Ruby and PHP allow strings to be changed after creation. It is more common, however, to use immutability, such as in Java, C#, JavaScript, Python, and Go.
- String immutability can reduce memory consumption. It reuses memory allocation by having all instances of a string value point to one location. So, when a change happens with a string value (e.g. "random"), say it becomes "random string", instead of changing the value "random", the variable is pointed to another instance of "random string", which is then added to the `String` pool.
- Consider reading existing words instead of creating a memory location for each word, including repeating ones. Using a unique set *reduces* the required space. The drawback is that if your application constantly changes texts, a memory penalty is incurred for every alteration made.
- Read more about [back tracking](https://eloquentjavascript.net/09_regexp.html#p-tCd15MFAty) in strings.
#### Numbers
- An integer is used to hold numeric values. An integer can either be *signed* (holds both positive and negative numbers), or *unsigned* (will only hold positive numbers).
- There are several ways to represent integers in binary. One typical example is sign-magnitude. Sign-magnitude proposes using an indicator on the far left of the binary number to denote polarity: `1` for negative values and `0` for $\geq 0$ values.
- An integer cannot represent fractions. For this, one would use decimal or float. A fixed number of bytes is used when representing integers, the size of which can be specified in some languages.
- If you are developing an application that requires substantial amounts of available memory, using integers quickly and not having to worry about the detail may be the way to go. The important thing is to be aware of the 64 bits storage for number (in JS) and treat fractional digital numbers as approximations, not as precise values.
- In JS, the `NaN` value (which ironically has the type of `Number`) represents any numeric operations that don’t yield a meaningful result (e.g. `0/0` or `Infinity - Infinity`,...). It is supposed to denote the result of a nonsensical computation, and as such, it isn’t equal to the result of any _other_ nonsensical computations (including itself, i.e. `NaN == NaN` is `false`).
#### Booleans 
- Boolean expressions are either `true` or `false`, and their equivalence in binary would be `0` or `1`
- Using Boolean expressions as indicators, you can then use relational operators to determine which line of code is to be executed. Finally, if you have not met any of your conditions, you might employ a catch-all code block (e.g. `else`).
- The use of Boolean logic is the backbone of circuit design. It is a way of interpreting Boolean operators together. The shapes in the diagram below are gates triggered when certain Boolean operators are fired.
- In JS, when comparing strings, it goes over the characters from left to right, comparing the Unicode codes one by one.
#### Symbols
- Being both *unique and usable as property names* makes symbols suitable for defining interfaces that can peacefully live alongside other properties, no matter what their names are.
- It is required to use brackets when accessing a Symbol property:
```js
const length = Symbol("length");
let myTrip = {
  length: 2,
  0: "Lankwitz",
  1: "Babelsberg",
  [length]: 21500
};
Array.prototype[length] = 0;

console.log(length === Symbol("length")) // false
console.log([1, 2].length); // 2
console.log([1, 2][length]); // 0
console.log(myTrip[length], myTrip.length);  // 21500 2
```
#### Arrays
- Think of the Zero-based counting index as the number of items to skip, counting from the start of the array.
- [Arrays](https://www.techinterviewhandbook.org/algorithms/array/#techniques) can be created statically or dynamically. In static languages, an array would be kept on the stack and require that the array type be specified _a priori_. Stacks, by their nature, hold contiguous memory blocks, making accessing the information more manageable. Altering an array and returning it from the stack may lead to corrupted memory as the stack is discarded after the function completes.
  Dynamic languages offer more fluidity, sometimes calling for the size to be set and do not require the type to be specified before use. Such an instance would be stored on a heap. Thus, the array remains unaffected when the function ends, and the stack is discarded. A heap is less organized and it can take more time to access the elements. You should consider the trade-off between size and convenience, or accessibility versus speed.
- Making a shallow copy of an array optimizes memory usage; however, you must ensure that no unexpected changes are inadvertently made to an array shared by two variables.
- A matrix is a two-dimensional array (or an array composed of arrays) that can act like a table. It can be used to represent rows and columns. A matrix will exhibit a *square* shape with the *same* number of columns and rows. Two index locations are required for a matrix, e.g. `arrayName[rowIndex][columnIndex]`.
#### Objects
- An object is a programming concept that means that a structure has both state/attributes and behavior/methods (ability to perform some action).
- A first-class object is an entity within a programming language that can:
	-   Appear in an expression
	-   Be assigned to a variable
	-   Be used as an argument
	-   Be returned by a function call
- In the functional programming paradigm, functions are first-class objects.
- Classes are commonly described as blueprints for an object. By extension, an object can be described as an instance of a class.
- You can change the instances of a class through the constructor or an internal method of the object. The methods used to change attribute instances are generally called getters and setters.
- The notion of having one general concept (e.g. human) that can manifest in different forms (male, female, non-binary,...) is known as polymorphism.
##### In JS
- Reading a property that doesn’t exist will give you the value `undefined`.
- When apply the `delete` unary operator to an object property, will remove _the named property_ from the object:
```js
let anObject = {left: 1, right: 2};
console.log(anObject.left);   // 1

delete anObject.left;
console.log(anObject); // {right: 2}

// The binary `in` operator, when applied to a string and an object, tells you whether that object has a property with that name:
console.log("left" in anObject);   // false
console.log("right" in anObject);  // true
```
- The `Object.keys` method return an *array of strings*—the object’s *property names*. The `Object.assign` method copies all properties from one object into another:
```js
console.log(Object.keys({x: 0, y: 0, z: 2}));  //  ["x", "y", "z"]

let objectA = {a: 1, b: 2};
Object.assign(objectA, {b: 3, c: 4});
console.log(objectA); //  {a: 1, b: 3, c: 4}
```
- There is a difference between having two references to the same object and having two different objects that contain the same properties:
```js
let object1 = {value: 10};
let object2 = object1;
let object3 = {value: 10};

// `object1` and `object2` have the same IDENTITY: they're referencing the SAME object, which is why changing `object1` also changes the value of `object2`:
object1.value = 15;
console.log(object2.value); // 15
// `object3` is unaffected:
console.log(object3.value); // 10

// When you compare objects with the `==` operator, it compares by identity: returns `true` only if both objects have the same reference:
console.log(object1 == object2);  // true

// There is no “deep” comparison operation built into JavaScript that compares objects by contents. Use lodash's `_.isEqual` for that: 
console.log(object1 == object3);             // false
console.log(_.isEqual(object1, object3));    // true
```
- A `const` binding to an object only prevent reassigning that object, not its _contents:_
```js
const score = {visitors: 0, home: 0};
score.visitors = 1;    // valid
score = {visitors: 1, home: 1};   // TypeError 
```

### Collection
#### Lists and sets
- In most programming languages, lists are represented as objects. This means that in addition to storing data, they also have their own in-built methods. 
- A list is an abstract concept that refers to a container of elements. A list allows you to store *repeating* items and items of different types. A list is ordered, which means that it will ***retain the ordering** of items as they are inserted*.
  A stable implementation of a list is done using either an *array or a linked list*. An array-based list is subject to the same strengths and limitations associated with arrays. Array vs linked list:
	- **Space**: a linked list's memory usage dynamically expand or retract corresponding to the operations that it's called on (e.g. add/delete nodes), while an array in some languages needs to be pre-allocated with a fixed amount of memory.
	- **Time**: getting an item out of a linked list requires a traverse $O(n)$ through each node (i.e. performing *linear search* for it), whereas its constant time $O(1)$ for retrieving an item in an array. Therefore, if you need random access to an item (i.e. indexing), use an array; while linked lists are more efficient for adding/removing items from either ends of it.
  The flexibility of linked lists is achieved by including some additional storage requirements. This approach to growing the size of the data structure is very powerful and can lead to very large but manageable datasets.
- A linked list's methods:
```js 
interface LinkedList<T> {
    get length(): number;
    insertAt(item: T, index: number): void;
    remove(item: T): T | undefined;
    removeAt(index: number): T | undefined;
    append(item: T): void;
    prepend(item: T): void;
    get(index: number): T | undefined;
}
```
- A ***set*** will store its elements in an ***ordered*** (*not sorted*) way and will only hold ***unique*** elements. Once a value has been added to a set, it cannot change. Instead, you should and would have to delete it and add a new value. If you want to update a value in a collection, better use an array. 
- *However*, objects that are added to sets can be treated differently depending on the language. In JavaScript, you can add mutable objects to a set, which is not permitted in Python. 
- While sets can perform an exceptionally quick search, performance degrades when dealing with very large datasets due to its internal mechanism which uses hash tables.
- Sets are beneficial when you need to keep track of a ***unique*** collection of values, such as removing duplicates from an array or checking membership efficiently.
##### [When to use which in JS](https://www.builder.io/blog/maps) (Object, Map, Set or Array)
- **Object**: when the order of the keys are ***not*** important and their type is simple (e.g. `string | number`), or you *don't* need to iterate the collection. If you want to define a custom data structure or an object with methods, prefer `class` for better readability.
- **Array**: when you need index-based access and want to perform complex operations on the collection of values.
- **Map**: when the relationship between ==_**keys** and **values**_== is important. Keys in a Map can be ***of any type*** and are not limited to sequential integer indices like in an Array. A Map has its own separate prototype chain based on `Map.prototype` which inherits instance methods from `Object.prototype` and some extra methods (such as `set()`, `get()`, `has()`, `delete()`, `clear()`,...). Use Map when you want *frequent* $O(1)$ **retrieval**/deletion values based on their key, e.g. writing a data structure that can quickly search and update a large set of values.
- **Set**: when you want an ***unique*** iterable collection of ***values*** (i.e. a Set will *automatically* remove duplicated _**primitive** values_), *frequent* $O(1)$ **search**/deletion and *don't* need random item retrieval (i.e. keys are *not* important). 
>[!important]- Set elements are ==unique in reference==, not their content
>- Two different **objects** with _**identical** _ properties are still considered valid entries in a Set.

> Map and Set are built-in objects and they can have elements of different types. Keys in Object, Array, Map are unique.
#### Stacks and queues
- Stacks and queues employ *sequential* access (i.e. ***items are stored in the order in which they were added***). This limited approach to holding data can be very useful when you want to control *how* the data is accessed (i.e. LIFO for Stack and FIFO for Queue)
- An implementation of Stack in JS is applying `.push()` and `.pop()` on an array. For Queue, it's `.push()` and `shift()`.
- A common usage for stacks is to keep your browser history. Each time you hit the "back" button, the previously visited page loads in order.
- Queue has some real-world benefits when implementing things like CPU and disk scheduling, where it is important to deal with tasks as they arrive.
#### Trees
- Trees are a powerful non-linear data structure that gives you great flexibility in *adding and searching* values. The non-linear nature of a tree means that there are many ways of traversing the data.
- A tree is a hierarchy of nodes that are linked with one another:
	- A node can be a parent or child node. 
	- The top-level (i.e. no parent) node is referred to as the root. 
	- A parent node may have a connected set of children nodes. 
	- Nodes that have the same parent are referred to as siblings and are considered to be on the same level.
	- Nodes with no children are referred to as leaf nodes.
- Nodes can branch off in different directions, allowing for powerful search and storage features. 
- A path refers to a series of connected nodes.
- The depth of a node refers to how many edges there are from the root to that node. The depth of a tree is the depth of its deepest leaf node.
- The height of a node is the number of edges present in the longest path connecting that node to a leaf node (i.e. the leaf nodes have a height of `0`). The height of the tree is the height of its root node.
- A tree is _perfectly_ height-balanced if the *left and right* subtrees of any node are the same height.
- The size of a tree is the sum of nodes within the tree. 
- Because trees are an abstract data type, there is no built-in method for them. It is crucial to keep in mind the important characteristics of a tree so that you can correctly implement them.
##### Binary tree
- The most straightforward and common tree is a *binary tree*:
	- Every node has a _maximum of two_ child nodes (therefore, a tree with a single node or an empty tree is still a valid binary tree).
	- If each node of a binary only has either _only_ a left child or right child then that tree becomes a linked list. 
	- Every node is assumed to have a key so that it can be easily identified.
	- The fundamental methods are:
		- **Lookup** method: a tree can be queried for the existence or absence of information. 
		- **Insertion** method: finding out where a node should go by placing it on the left or right side of the nearest higher value node. 
		- **Removal** method: when removing a node, it is necessary to check all its children nodes and ensure that a new connection is made with the node of the next highest value. 
##### Binary search tree
- A **valid BST** is a binary tree with these extra properties:
	- The left subtree of a node contains only nodes with keys **less than** the node's key.
	- The right subtree of a node contains only nodes with keys **greater than** the node's key.
	- Those attributes hold _recursively_ for **_all_** of its _subtrees_.
##### Searching in trees
> BFS is better when target is closer to source. DFS is better when target is far from source.
- A depth-first search (***DFS***) method involves visiting every node *sequentially* from top to bottom as far as possible along each branch *before backtracking* (i.e. checking the adjacent branch using ***recursion***). 
- Extra memory, usually a ***stack***, is needed to keep track of the nodes discovered so far along a specified branch which helps in backtracking of the tree. 
- It *preserves the shape* of the traversal while BFS doesn't (i.e. use DFS if you're comparing if 2 trees are equal in both shape and structure).
- **DFS** time complexity of DFS is $O(V + E)$ when the tree is represented as an Adjacency List and $O(V^2)$ when the tree is represented as an Adjacency Matrix, where V stands for vertices and E stands for edges.
- **DFS** space complexity is $O(np)$, where `p` is the length of the longest path. For each node, you have to store its siblings so that when you have visited all its children, and you come back to a parent node, you know which sibling to explore next. For `p` nodes down the path, you will have to store `n` nodes extra for each of the `p` nodes:
```ts
type BinaryNode<T> = {
    value: T;
    left: BinaryNode<T> | null;
    right: BinaryNode<T> | null;
};

// Suppose we're applying DFS on a binary tree
function dfs(currentNode: BinaryNode<number> | null, needle: number): boolean {
  if (!currentNode) return false
  if (currentNode.value === needle) return true

  if (needle > currentNode.value) return dfs(currentNode.right, needle)
  return dfs(currentNode.left, needle)
}
```
- A breadth-first search (***BFS***) method involves searching each node on the same level (using ***queue***) *before descending* to the next level, and repeating until the requested node (or deepest leaf node) has been reached.
- **BFS** has the same time complexity as DFS. However, its space complexity is proportional to the number of nodes at the deepest level, i.e. $O(V)$.
- Extra memory, usually a ***queue***, is needed to keep track of the child nodes that were encountered but not yet explored:
```ts
// Suppose we're applying BFS on a binary tree
function bfs(head: BinaryNode<number>, needle: number): boolean {
  const q: (BinaryNode<number> | null | undefined)[] = [head]

  // Implement BFS with a queue (using `.shift()` and `.push()`)
  while (q.length) {
    const currentNode = q.shift()

    if (!currentNode) continue

    if (currentNode.value === needle) return true

    q.push(currentNode.left)
    q.push(currentNode.right)
  }

  return false
}
```
##### Trie 
- They are pronounced like "try" (named after Re"trie"val Tree). It's a kind of [search tree](https://stackfull.dev/trie-in-javascript-the-data-structure-behind-autocomplete) - an ordered tree data structure used for locating specific keys from within a set. 
- These keys are most often *strings*, with links between nodes defined not by the entire key, but by *individual characters* (i.e. strings/words can be re**trie**ved by traversing down a branch path). In order to access a key (to recover its value, change it, or remove it), the trie is traversed [*depth-first*](https://learnersbucket.com/tutorials/data-structures/trie-data-structure-in-javascript/), following the links between nodes, which represent each character in the key.
- Practical examples are autocomplete or caching.

### Advanced
#### Hash table (hash map)
- Hash tables (represented as arrays in JS) provide access to elements *in constant time*, so they are ==highly recommended for algorithms that prioritize *search and data retrieval* operations==. Mostly used to index large amounts of data (i.e. maps keys to values)
- This means that when you want to know if an item is in the data structure, instead of looking through every item and making a comparison, you only need to apply the hashing function and see if that item has been hashed to memory.
- Hash tables are thread-safe (e.g. if 69 different processes are using and changing the same information in a table, the information is always correct).
- Load factor: the amount of data points vs the amount of storage (`data.length/storage.capacity`). Hash tables increase in size when they are near a certain threshold. 

> There are some distinct differences between hash table and hash map: a hash map will **allow** the use of nulls for keys and values, and it's **not** thread-safe. We can use a hash map and modify it to behave like a hash table in languages that don't have native implementation of hash table (e.g. Kotlin, Python). JS has `Object` and `Map` classes which are native hash table implementation. If you want flexible key-value store (i.e. allow any value as a key (not just strings or symbols) and maintains insertion order), prefer `Map`

- The address/index (i.e. hash code) of each key is *calculated* using the  `key`  itself. This could be done with a "hash function", returns something like `key % array_length | <some-random-number>`:
```js
// A data structure with the following keys:
const arr = [1, 4, 65, 34, 2, 45, 87, 12, 65, 2, 6, 98]

// Apply a hash funciton returning `key % 7` for each item will return a hash table with 5 collisions:
const hashed = [1, 4, 2, 6, 2, 3, 3, 5, 2, 2, 6, 0]
```
- Index collision/clashing (when two different hash codes could map to the same index or two different keys have the same hash code) is a problem because every slot in a hash table is supposed to store a single element. The larger the dataset used, the more likely clashing is prone to happen. It is resolved with close addressing (most common - using linked list) or open addressing (linear probing, quadratic probing, double hashing)
##### Close addressing
- The most common approach to solve index collision is to use a linked list: each slot of our hash table holds a pointer to a linked list. Every entry at that index will be inserted into the linked list for that index. This strategy greatly increases performance, but it is costly in terms of space.
#### Heaps
- Heaps were first introduced as a means of storing and searching data efficiently. A heap is a [specialized data structure](https://www.cs.auckland.ac.nz/software/AlgAnim/heaps.html) that is modeled like a tree but behaves in a similar way to a ***queue***, but with different ***priority*** applied to its elements (i.e. ==priority queue==). Heaps are often built using ***binary trees*** (called *binary heaps*) though another approach would be to make an *array* act in a way that mimics the behavior of a binary tree (i.e. heapify). 
- A heap is built for specialized purpose, that involves identifying the ***most important item*** and returning this in the ***shortest time possible***. Then queuing up the next item of importance. 
- A heap is always a complete binary tree (i.e. a node always have *left **and** right* children or no children at all)
- Heaps that place priority on the lowest valued key are called *min heaps* (i.e. the minimum value is placed *at the root*) and the ones that place the priority on the maximum value are called *max heaps*. Reverse all the methods of min heaps and you'll have the methods for max heaps:
	- **Insert**: similar to how insertion works in a binary tree with $O(logn)$ time. If the node to be inserted has the smallest value in the tree, then it'll bubble up to be the root.
	- **Find/Peek min**: retrieve the minimum value from a heap is $O(1)$ because it will be stored always at the root.
	- **Delete min**: a heap should not support operations such as deleting items other than the min element (i.e. the root). Deleting arbitrary items in the tree would require restructuring the tree and this would lead to a degradation in performance. If you are looking for a data structure that can act in this way, then you might consider structures other than a heap:
```ts
class MinHeap {
    public length: number;
    private data: number[]

    constructor() {
        this.data = []
        this.length = 0
    }

    // Get the parent's index of a node
    private parent(idx: number): number {
        return Math.floor((idx - 1) / 2)
    }
    private leftChild(idx: number): number {
        return 2 * idx + 1
    }
    private rightChild(idx: number): number {
        return 2 * idx + 2
    }
    // Restores heap property upwards from a given index
    // Ensures the children node is larger than its parent
    private heapifyUp(idx: number): void {
        // Base case: reached the root
        if (idx == 0) return

        const parentIndex = this.parent(idx)
        const parentValue = this.data[parentIndex]
        const nodeValue = this.data[idx]

        if (parentValue > nodeValue) {
            // Swap the current node's value with its parent
            this.data[idx] = parentValue
            this.data[parentIndex] = nodeValue

            this.heapifyUp(parentIndex)
        }
    }
    // Restores heap property downwards from a given index
    // Ensures the parent node is smaller than its children
    private heapifyDown(idx: number): void {
        const leftChildIndex = this.leftChild(idx)
        const rightChildIndex = this.rightChild(idx)
        const leftChildValue = this.data[leftChildIndex]
        const rightChildValue = this.data[rightChildIndex]
        const nodeValue = this.data[idx]

        // Base case: reached a leaf
        if (leftChildIndex >= this.length) return

        // The right child is smallest
        if (leftChildValue > rightChildValue && nodeValue > rightChildValue) {
            // Swap the current node with its right child
            this.data[idx] = rightChildValue
            this.data[rightChildIndex] = nodeValue
            this.heapifyDown(rightChildIndex)
        } else if (rightChildValue > leftChildValue && nodeValue > leftChildValue) {
            // Swap the current node with its left child
            this.data[idx] = leftChildValue
            this.data[leftChildIndex] = nodeValue
            this.heapifyDown(leftChildIndex)
        }
    }

    insert(value: number): void {
        // Insert the new node at the tree's height
        this.data[this.length] = value

        // Bubble up the smallest node so that the minHeap remains its structure
        this.heapifyUp(this.length++)
    }
    extractMin(): number {
        if (this.length === 0) return null
        
		// Deletion always starts at the root
        const value = this.data[0]
        this.length--
        if (this.length === 0) {
            this.data = []
            return value
        }
		// Get the leaf node at the tree's height and place it at the root, then drill it down so that the minHeap remains its integrity
        this.data[0] = this.data[this.length]
        this.heapifyDown(0)

        return value
    }
	// Returns the smallest element without removing it
    peek(): number {
        return this.length > 0 ? this.data[0] : null
    }
}
```
#### Graphs
- A graph is a _non-linear **data structure**_ that can store information in a way that allows you to extract some relations between the data.
- A graphs is like a [sophisticated](https://www.shiksha.com/online-courses/articles/graphs-in-data-structure-types-representation-operations/) tree without beginning or end. Graphs can also be traversed with DFS (by using stack) and BFS (by using queue).
- A graph is an abstract representation of relationships between two or more connected *objects, entities*, or *locations*. The ***objects***, entities, or locations in a graph are represented by the ***vertices***, while the ***relationships*** between those objects are represented by the ***edges***.
- Unlike a tree, nodes do not have to be connected and can exist independently from the other nodes. An edge connects two nodes. An edge can be said to have a weight (i.e. a value that is stored in the connection that infers some information on the strength of the connection between the two nodes).
- A graph can be said to be directed, this means that the edges are focused (unidirectional) or undirected (bidirectional) and the connection infers information back and forth.
- Two nodes with an edge are said to be adjacent, and the nodes are called neighbors.
- A node's degree is the total number of edges connected to a node.
- A graph can be represented as an adjacency matrix or an adjacency list: 
```ts
//-------------- BFS on a weighted adjacency matrix:
const sampleMatrix: number [][] = [
    [0, 3, 1, 0, 0, 0, 0],  // 0
    [0, 0, 0, 0, 1, 0, 0],  // 1
    [0, 0, 0, 7, 0, 0, 0],  // 2
    [0, 0, 0, 0, 0, 0, 0],  // 3
    [0, 1, 0, 5, 0, 2, 0],  // 4
    [0, 0, 18, 0, 0, 0, 1], // 5
    [0, 0, 0, 1, 0, 0, 0],  // 6
];
function bfs(graph: number[][], source: number, needle: number): number[] | null {
  const traversedPath = new Array(graph.length).fill(false)

  // if it's != -1 then there's a connection with the current node
  const prev = new Array(graph.length).fill(-1)

  traversedPath[source] = true    // start from the source node
  const q: number[] = [source]    // `q` is the path we're forming, starting with a `source` node

  do {
    const curr = q.shift() as number
    const adjs = graph[curr]

    if (curr == needle) break  // found it

    for (let i = 0; i < adjs.length; ++i) {
      // `adjs[i] == 0` means there is no connection 
      if (adjs[i] == 0 || traversedPath[i]) continue

      traversedPath[i] = true
      prev[i] = curr
      q.push(i)
    }
  } while (q.length)

  if (prev[needle] == -1) return null // unable to form a path to the target node

  // build output path by reversing the `prev` array
  let curr = needle
  const path: number[] = []

  while (prev[curr] != -1) {
    path.push(curr)
    curr = prev[curr]
    console.log(path)
  }

  return [source].concat([...path].reverse())
}
console.log(bfs(sampleMatrix, 0, 6))

//-------------- DFS on a weighted adjacency list:
const sampleList = []
sampleList[0] = [
    { to: 1, weight: 3 },
    { to: 2, weight: 1 },
];
sampleList[1] = [
    { to: 4, weight: 1 },
];
sampleList[2] = [
    { to: 3, weight: 7 },
];
sampleList[3] = [];
sampleList[4] = [
    { to: 1, weight: 1 },
    { to: 3, weight: 5 },
    { to: 5, weight: 2 },
];
sampleList[5] = [
    { to: 2, weight: 18 },
    { to: 6, weight: 1 },
];
sampleList[6] = [
    { to: 3, weight: 1 },
];
function steps(graph: WeightedAdjacencyList, curr: number, needle: number, seen: boolean[], path: number[]): boolean {
  // Hit previously visited point:
  if (seen[curr]) return false

  // =========== Recursive call (creating a path) ===============
  // Pre-recursion:
  seen[curr] = true
  path.push(curr)
  if (curr == needle) return true  // found it

  // Recursion:
  const list = graph[curr]
  for (const edge of list) {
    if (steps(graph, edge.to, needle, seen, path)) return true
  }

  // Post-recursion: maintaining the order of the path as we're bubbling up the call stack
  path.pop()

  return false
}
function dfs(graph: WeightedAdjacencyList, source: number, needle: number): number[] | null {
  const traversedPath = new Array(graph.length).fill(false)
  const currentPath: number[] = []

  steps(graph, source, needle, traversedPath, currentPath)

  if (currentPath.length == 0) return null
  return currentPath
}
console.log(dfs(sampleList, 0, 6))
```
#### Custom
- Data structures can be augmented to achieve efficient time complexities across different operations.
- For example, a hash map can be used together with a doubly-linked list to build a LRU: a caching layer that will cache `n` items based on key. When `n` is exceeded, the cache will eject the Least Recently Used item from cache. It runs in $O(1)$ time and $O(n)$ space:
```ts
function createNode<V>(value: V): ListNode<V> {
    return { value }
}

class LRU<K, V> {
    private length: number;
    private head?: ListNode<V>
    private tail?: ListNode<V>
    private lookup: Map<K, ListNode<V>>
    private reverseLookup: Map<ListNode<V>, K>  // for cleaning up the `lookup`

    private detach(node: ListNode<V>): void {
        if (node.prev) node.prev.next = node.next
        if (node.next) node.next.prev = node.prev

        if (this.head === node) this.head = this.head.next
        if (this.tail === node) this.tail = this.tail.prev

        node.prev = undefined
        node.next = undefined
    }
    private prepend(node: ListNode<V>): void {
        if (!this.head) {
            this.head = this.tail = node
            return
        }

        node.next = this.head
        this.head.prev = node
        this.head = node
    }
    private trimCache(): void {
        if (this.length <= this.capacity) return

        const tail = this.tail as ListNode<V>
        this.detach(this.tail as ListNode<V>)

        const key = this.reverseLookup.get(tail) as K
        this.lookup.delete(key)
        this.reverseLookup.delete(tail)
        this.length--
    }


    constructor(private capacity: number) {
        this.length = 0
        this.head = this.tail = undefined
        this.lookup = new Map<K, ListNode<V>>()
        this.reverseLookup = new Map<ListNode<V>, K>()
    }

    update(key: K, value: V): void {
        // check the cache for key existence
        let node = this.lookup.get(key)
        if (!node) {
            node = createNode(value)
            this.length++
            this.prepend(node)
            this.trimCache()    // to make sure our cache doesn't exceed the `capacity`

            this.lookup.set(key, node)
            this.reverseLookup.set(node, key)
        }
        else {
            this.detach(node)
            this.prepend(node)
            node.value = value
        }
    }
    get(key: K): V | undefined {
        // check the cache for key existence
        const node = this.lookup.get(key)
        if (!node) return undefined

        // update the value we found and move it to the front 
        this.detach(node)
        this.prepend(node)

        // return the value (if found) or `undefined` if it's not exist
        return node.value

    }
}
```

## Algorithms
- An algorithm can be defined as a precise sequence of instructions to solve a problem. It can be helpful to first generalize the problem and then more precisely outline the sequence of required instructions before coding an implementation.
- Whenever we say that our algorithm is sufficient then it means that the algorithm is solving the problem in less amount of time while taking the least amount of space, or, its worst-case running time grows *slowly* with its input size.
### Sorting 
- Working with sorted data or having the ability to sort your own data can result in significant time savings. Therefore, a dataset of elements that can be ordered is fundamentally necessary.
- The actual metric that is used to sort is less important than the fact that they can be arranged in an ascending or descending order (although when saying an array is sorted without stating anything else, ***the ascending order is implied***). 
- It's worth taking into consideration that whether the sorting is happening in-place or has been accomplished by creating a clone whilst keeping the original list.

> [!important] Essential sorting algorithms
> - Quick Sort is great for average cases, Merge Sort for stability, and Heap Sort for priority-based sorting.
> - All of them have $O(nlogn)$ average time complexity.
#### Insertion sort
- It is appropriate for datasets which are *already partially sorted* and the number of elements is small.
- Assume we're sorting in ascending order. Rather than searching through all the elements, this approach begins by examining the *first two elements* in a list and proceed *in pair* of subsequent elements. The smaller of the two is then moved to the left. This is repeated for every pair of elements where each one being compared to the element on its left, then, a subsequent switch to the left is made if it's found to be *smaller*:
```js
const arr = [12, 11, 13, 5, 6]

// Pseudo code using nested loops with O(n^2) time & O(1) space:
for (i=0; i<arr.length-1; i++) {
    let j = i
    while (j > 0 && arr[j-1] > arr[j]) {
        swap(arr[j], arr[j-1])
        j -= 1
    }
}            

// First iteration:
{12} {11} 13 5 6 // i == 1; j == 1
-> 11 12 13 5 6

// Next iteration, 12 < 13, no swap occurred:
11 12 13 5 6  // i == 2; j == 2

// Next iteration:
11 12 {13} {5} 6  // i == 3; j == 3
-> 11 12 5 13 6
11 {12} {5} 13 6  // i == 3; j == 2
-> 11 5 12 13 6
{11} {5} 12 13 6  // i == 3; j == 1
-> 5 11 12 13 6

// Next iteration:
5 11 12 {13} {6}  // i == 4; j == 4
-> 5 11 12 6 13
5 11 {12} {6} 13  // i == 4; j == 3
-> 5 11 6 12 13
5 {11} {6} 12 13  // i == 4; j == 2
-> 5 6 11 12 13 // arr sorted
```
#### Quick sort
- It uses a *divide-and-conquer* methodology. Suppose we're sorting in ascending order. Given an array of items, a place is determined on the array on which to split the array and this is called *the pivot point*. The original array is *partitioned* into two arrays one of which holds values smaller than the pivot, and the other array holds values greater than the pivot value. Recursively, we find the pivot for each sub-lists until all lists contains only one element:
```js
function quickSort(arr: number[]):  number[] {
  if (arr.length <= 1) {
    return arr;
  }
  console.log("arr:", arr);

  // Choose a random pivot index
  const pivotIndex = Math.floor(Math.random() * arr.length);
  const pivot = arr[pivotIndex];
  console.log('pivot:', pivot)
  
  // Divide the array into sub-arrays based on the pivot
  const left = [];
  const right = [];
  
  for (const element of arr) {
    if (element < pivot) {
      left.push(element);
    } else if (element > pivot) {
      right.push(element);
    }
  }

  console.log('left:', left);
  console.log('right:', right);

  console.log('next step:', [...left, pivot, ...right]);

  // Recursively sort and bubbling up the recursive stack to combine sub-arrays
  return [...quickSort(left), pivot, ...quickSort(right)];
}

const unsortedArray = [5, 2, 7, 3, 1, 6, 4, 8];
const sortedArray = quickSort(unsortedArray);
console.log(sortedArray);
```
- Quick Sort is quite similar to merge sort. Its main advantage over merge sort, is that the sorting can be done _in-place_. This saves time because we don’t have to create new arrays. It can be faster in practice for smaller datasets and is often favored when memory usage is a concern.
- Quick Sort consumes $O(n)$ space but returns overall quicker solutions. It has the time complexity of $O(nlogn)$ for average cases, $O(n^2)$ for the worst case (applied on a sorted or reverse-sorted array).
#### Merge sort
- Preferred as a general-purpose sorting algorithm with predictable performance (guarantees $O(nlogn)$ time) regardless of the input.
	- It is the go-to sorting algorithm ==_when working with linked lists_==, due to its sequential access nature, offering $O(1)$ space with an iterative implementation.
- Same $O(n)$ space on average as Quick Sort because it uses an extra array [[#Divide and Conquer |for the merge step]].
#### Heap sort
- As the name suggests, we use it when a [[#Heaps |heap implementation]] is readily available.
- Preferred when you need to find the $k^{th}$ largest/smallest elements (can stop early). As an comparison-based and in-place sorting algorithm, it has $O(nlogn)$ time & $O(1)$ space:
```ts
function heapify<T>(arr: T[], n: number, i: number): void {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  
  // Find the `largest` among `i` (root), `left` child and `right` child
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }
  
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }
  
  // If `largest` is not root (i.e. the child that's bigger than the parent), 
  // swap them and recursively heapifying until we hit the base case (which is `largest == i`)
  if (largest !== i) {  
    [arr[i], arr[largest]] = [arr[largest], arr[i]]; // put the bigger value where the parent should be
    heapify(arr, n, largest);
  }
}

// O(nlogn) time overall
function heapSort<T>(arr: T[]): T[] {
  const n = arr.length;
  
  // Step 1: Build a max heap from `arr` with O(n) time
  // We're building a max heap because it naturally works with the ASCENDING order of "Step 2"
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  
  // Step 2: Going bottom-up for ascending order
  for (let i = n - 1; i > 0; i--) {  // O(n) time
    // Move current root to end to place the current maximum element directly in its final sorted position
    // Forming the "sorted section"
    [arr[0], arr[i]] = [arr[i], arr[0]];
    
    // Call max heapify on the remaining "heap section" with O(logn) time
    heapify(arr, i, 0);
  }
  
  return arr;
}

const array = [12, 11, 13, 5, 6, 7];
heapSort(array);
console.log(array); // [5, 6, 7, 11, 12, 13]
```

### Searching
#### Linear
- It is the most direct way of retrieving an item. The search starts at the first item (index location 0) and iterates until either the target item is found or there are no more items left in the array to check.
```js
function linearSearch(arr, item) {
  // Go through all the elements of `arr` to look for the target item:
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == item) { // Found it!
      return i;
    }
  }
  
  // Item not found in the array.
  return null;
}
```
- Linear search has $O(n)$ time & space complexity.
#### Binary
> To conduct a binary search, the list **must first be sorted**.
- A binary search is performed by comparing the target element to *the mid-point* on a *sorted* list and discarding the half that is *less than* the target element. This halving at the mid-point is repeated until the target element is found or there is no more list to half:
```js
// Iterative approach (using loops):
let iterativeBinary = function (arr, x) {
    let start = 0, end = arr.length-1;
         
    // Iterate while start not meets end
    while (start <= end){
        // Find the mid index
        let mid = Math.floor((start + end)/2);
  
        // Found it!
        if (arr[mid] == x) return true;
 
        // Else look in left or right half respectively
        else if (arr[mid] < x)
             start = mid + 1;
        else
             end = mid - 1;
    }
  
    return false;
}

// Recursive approach:
let recursiveBinary = function (arr, x, start, end) {
    // Recursion breakpoint
    if (start > end) return false;
  
    // Find the middle index
    let mid = Math.floor((start + end)/2);
  
    // Compare mid with given key x
    if (arr[mid] == x) return true;
         
    // If element at mid is greater than x,
    // search in the left half of mid
    if(arr[mid] > x)
        return recursiveFunction(arr, x, start, mid-1);
    else
        // The element at mid is smaller than x,
        // search in the right half of mid
        return recursiveFunction(arr, x, mid+1, end);
}
```
- Binary search runs with $O(logn)$ time and $O(n)$ space.
### Recursion
- It is the practice of having functions call themselves with a ***smaller*** instance of a problem *repeatedly* until some ***exit condition*** is met.
- There are three requirements for implementing a recursive solution, namely the base case, the diminishing structure, and the recursive call. 
	- The base case ensures that the function will not continue to call itself infinitely and eventually terminates.
	- The diminishing structure is the *base case oriented* argument to the recursive call of the function itself:
```js
function pow(x, n) {
  return (n == 1) ? x : (x * pow(x, n - 1)); // recursive call
  //      ^^^^^^                 ^^^^^^^^^
  //      base case              diminishing structure
}

// How it works:
// Suppose `x==2` & `n==4`:
pow(2, 4) = 2 * pow(2, 3) // `pow(2,4)` returns `2*pow(2,3)`
               = 2 * (2 * pow(2, 2))  // `pow(2,3)` returns `2*pow(2,2)`
                    = 2 * (2 * (2 * pow(2, 1))) // base case `n==1`, pop the stack 
                              = 2 * (2 * (2 * 2))
                              = 2 * (2 * 4)
                              = 2 * 8
                              = 16
```
- Recursion vs regular loop: with recursion, you can simply call the function with a different input (diminishing structure) and it will *return a breakdown of the required steps*. Readability is a strong plus for recursion. Sometimes when a problem requires many checks (i.e. base cases), a loop can quickly become unwieldy. In some cases, running through a simple loop is computationally cheaper than calling a function multiple times. 
	- Often, though, recursive solutions are helpful in giving up some efficiency in order to make the program more straightforward. Generally, these are problems that require exploring or processing several “branches”, each of which might branch out again into even more branches. 
- You should generally start by writing something that’s correct and easy to understand. The art of programming lies in achieving a balance between human-friendliness and machine-friendliness.
- It is highly recommended to employ a recursive approach as part of a `d&c` solution where the problem is broken into smaller steps and repeated to come upon the optimum solution.
- Recursion increases computational cost as resources are required to make a function call. 
	- However, the computation from each result will be *retained on the [call stack](https://www.codingninjas.com/codestudio/library/recursion-and-stack)*.  This can be useful when computing hierarchical problems or problems where one can benefit from *knowing which steps resulted in a given outcome* like traversing a graph.
- Beware of the maximal recursion depth of the JavaScript engine. We can rely on it being 10000, some engines allow more, but 10000 is probably out of limit for the majority of them.
### Divide and Conquer
- The algorithm comprises two mandatory steps, namely, divide and conquer (`d&c`) with an optional third, is combine.
	- In the divide step, the input is split into smaller segments and processed individually. 
	- In the conquer step, every task associated with a given segment is solved.
	- The *optional* last step, combine, is combining all the solved segments.
	- Use the Master Theorem to determine the complexity of a `d&c` approach:
		- Assuming the segments (sub-problems) have equal size, we have:
						  $T(n) \leq aT\left(\frac{n}{b}\right) + O(n^d)$
		- Where `a`, `b`, `d` are independent of the input size `n`:
			- $aT\left(\frac{n}{b}\right) + O(n^d)$ is a constant for the base case (for all sufficiently small `n`)
			- `a`: the number ($\geq 1$) of recursive calls
			- `b`: the factor ($> 1$) by which `n` shrinks before a recursive call applied
			- `d`: the exponent ($\geq 0$) in running time of the "combine step", outside of the recursive calls 
			- If $a < b^d$, $T(n) = O(n^d)$
			- If $a = b^d$, $T(n) = O(n^dlogn)$
			- If $a > b^d$, $T(n) = O(n^{\log_b(a)})$
- Merge sort is a practical implementation of `d&c` :
```ts
function mergeSort(arr: number[]): { sorted: number[]; count: number } {
  if (arr.length <= 1) {
    return { sorted: arr, count: 0 };
  }

// We divide the array into two halves until each subarray contains a single element
  const middle = Math.floor(arr.length / 2);
  const left = arr.slice(0, middle);
  const right = arr.slice(middle);

  const leftResult = mergeSort(left);
  const rightResult = mergeSort(right);

  const mergeResult = merge(leftResult.sorted, rightResult.sorted);

  return {
    sorted: mergeResult.sorted,
    count: leftResult.count + rightResult.count + mergeResult.count,
  };
}

function merge(left: number[], right: number[]): { sorted: number[]; count: number } {
  const result: number[] = [];
  let count = 0;
  let leftIndex = 0;
  let rightIndex = 0;

// Comparing elements from both arrays and add the smaller one to the `result`
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] <= right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
      // If the element in the right subarray is smaller, it means that every remaining element in the left subarray (from the current `leftIndex` onward) forms an inversion with this "right element"
      count += left.length - leftIndex;
    }
  }

// Concatenates the leftover elements from `left` then `right` after the `while` loop to ensure ascending order
  return {
    sorted:
	    result.concat(left.slice(leftIndex))
			  .concat(right.slice(rightIndex)),
    count,
  };
}

// Generate an array of 100,000 unrepeated integers from 1 to 100,000
const arr: number[] = [];
for (let i = 1; i <= 69; i++) {
  arr.push(i);
}
console.log(`Pre: ${[arr]}`);

// Shuffle the array to create inversions
for (let i = arr.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [arr[i], arr[j]] = [arr[j], arr[i]];
}

console.log(`Randomized: ${[arr]}`);

// The debugging `count` variable essentially calculates how far the array is from being completely sorted. A higher `count` indicates a more unsorted (or more "inverted") array, while a `count` of zero means the array is already sorted.
const { sorted, count } = mergeSort(arr);
console.log(`Number of inversions: ${count}`);
console.log(`Post: ${sorted}`);
```
- Parallelization and memory management are two immediate advantages when applying `d&c`:
	- Parallelism is when you have different threads or computers working on the same problem at the same time to complete it in a quicker time.
	- Memory management: in the merge sort example, consider that each array can be sent to a different core or server depending on the architecture of your organization and the results are then returned.
	  It might be the data being processed is too large to hold in memory and must be processed in chunks. Additionally, you may have provisioned access to cloud computing. So the solution can involve accessing an online server and exporting some of the problems from the company servers.
### Greedy
- Greedy algorithm assumes that the simplest solution is almost always the best one. This problem solving principle argues that simplicity is better than complexity. It looks at the list of solutions and implement a local optimization. Usually, the current most rewarding option is chosen.
- This is an alternative approach to dynamic programming as this approach seeks to present an immediate solution for a task and *favors local optimization over a more holistic global approach*.
- For example, in a CPU tasks execution context, a greedy approach would involve selecting first the shortest running program and then the next shortest program and so on. While this might not lead to a globally optimized solution, it will reduce any overhead in calculating the most efficient subset of items. [Dijkstra's shortest path](https://www.youtube.com/watch?v=pVfj6mxhdMw) is also a well-known instance of the greedy algo.
- Greedy vs `dp`: while the overhead for a greedy algorithm is low and coding a solution is quite straightforward, it will not always guarantee that the best option is returned.
### Dynamic programming
- Dynamic programming (`dp`) is an extension of `d&c` and recursion which in addition involves keeping a record of results ([memoizing](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/submissions/961483057)) generated from running the sub problems each time they are newly run. 
- The main advantage of `dp` is that it promotes memoization, where previous calculations are stored and used instead of rerunning the calculations when the compiler identifies that the computation has been run for a previous task. Checkout an [example](https://www.techinterviewhandbook.org/coding-interview-techniques/#example-3).
- The `dp` approach is commonly applied to combination or optimization problems. When computing `dp` solutions, you must firstly determine the *objective function* (i.e. the description of what the optimum outcome is to be). Next you must break the problem into smaller steps (using recursion) which should be written in such a way that you can change the outcome without altering the code for the methods already written.
---
# Patterns (what ACTUALLY matters)
## Essentials
### Two Pointers
- Use this pattern to _**traverse**_ arrays/strings when you think of:
	- Opposite ends: both pointers move towards each other to find pairs that meet specific criteria.
	- Single pass with conditions: pointers traverse in the same direction but are ==_**used to track conditions**_== (e.g. finding duplicates, valid segments,...).
	- At different speeds: one pointer moves faster than the other to achieve tasks like cycle detection or finding midpoints.
	- _Finding **pairs**_, check properties, detect cycles. The focus is on the elements **_at_** the pointers.
> Use this pattern to optimize space usage if arrays are **pre-sorted**. Guarantees $O(n)$ in most cases.
#### Examples
- [Move Zeros](https://leetcode.com/problems/move-zeroes/description)
- [Remove Duplicates from Sorted Array](https://leetcode.com/problems/remove-duplicates-from-sorted-array/description)
- [Valid Palindrome](https://leetcode.com/problems/valid-palindrome/description)
- [Two Sum II](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/description)
- [3Sum](https://leetcode.com/problems/3sum/description): this one is actually 3 pointers
- [Merge Sorted Array](https://leetcode.com/problems/merge-sorted-array/description)
- [Merge Two Sorted Lists](https://leetcode.com/problems/merge-two-sorted-lists)
- [Linked List Cycle II](https://leetcode.com/problems/linked-list-cycle-ii)
- [Sort Colors]()
- [Container With Most Water]()
#### Sliding Windows
- This is a variant of Two Pointer. Guarantees $O(n)$ in most cases. Efficient for problems with:
	- **_Min/max_** length _==subarray/substring==_ meeting certain conditions
	- **_==Consecutive==_** elements (e.g. longest/shortest **_streak_** of characters)
	- Subarrays of fixed size `k`
- Use `left` and `right` pointers. Expand the `right`, check condition, shrink `left` (if condition is violated) in the _==same direction==_ (left to right) until `right` reaches the end.
##### Examples
- [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters)
- [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum)
- [Fruit Into Basket](https://leetcode.com/problems/fruit-into-baskets)
- [Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string)
- [Minimum Window Substring]()

### Hash Map/Set
- It's crucial for frequent searches with $O(1)$ time for average lookups, sacrificing $O(n)$ space to store the extra Map/Set (assuming we apply it to a single array input). 
#### Hash Map
- The built-in JS `Map` is a hash map. It's like a _notebook_ where you store _extra_ details for an item, e.g. "_I saw the number 6 **at position** 9_". 
- Mostly used for:
	- Character frequency matching
	- **Non**-sequential pattern matching 
- As [an example](https://leetcode.com/explore/interview/card/top-interview-questions-easy/92/array/674), use it to efficiently handles duplicates and unsorted arrays:
```ts
// Suppose `n == nums1.length` and `m == nums2.length`
// O(n + m) time & O(min(n, m)) space
function getIntersect(nums1: number[], nums2: number[]): number[] {
  const freqMap = nums1.reduce((map, num1) => 
    // For each `num1` in `nums1`, keep track of its frequency (by adding 1 for each occurence). "Its frequency" here is the "extra detail" mentioned above
    map.set(num1, (map.get(num1) ?? 0) + 1), 
    new Map<number, number>()
  );

  // For each `num2` in `nums2`:
  // 1. Check if the `num2` exists in `freqMap` (if `freqMap.get(num2)` > 0)
  // 2. If it does, we include it in the result array (that's just how `.filter()` works)
  return nums2.filter(num2 =>
    freqMap.get(num2) && 
    // Decrease the frequency by 1
    // When it reaches 0, subsequent occurrences of this number will be excluded, i.e. no more intersect with that number 
    // since `freqMap.get(num2)` will return 0
    freqMap.set(num2, freqMap.get(num2)! - 1)
  );
}
```

- Leverage the hash `Map` to avoid duplicates in iterations. For [this example](https://leetcode.com/explore/interview/card/top-interview-questions-easy/92/array/546), using nested loops would result in $O(n^2)$ time complexity. Hash `Map` can solve it with $O(n)$: 
```ts
// O(n) time & space:
function twoSum(nums: number[], target: number): number[] {
    const indexMap = new Map<number, number>();
    
// Store each operand and check for its complement's index
    for (let i in nums) {
        const complement = target - nums[+i];
        if (indexMap.has(complement)) {
            return [indexMap.get(complement)!, +i]; // Found
        }
        indexMap.set(nums[i], +i); // Store the current element and its index 
    }
  
    throw new Error("No solution found");
}
```
#### Hash Set
- The JS built-in `Set` is a hash set. Think of a it as a _checklist_ where you only care ==_if_ an item _exists_==. Use it to solve problems [like this one](https://leetcode.com/explore/interview/card/top-interview-questions-easy/92/array/578):
```ts
// O(n) time & space
function containsDuplicate(nums: number[]): boolean {
  return new Set(nums).size < nums.length
};
```
- First thing to think of when you're [checking for _uniqueness_](https://leetcode.com/explore/interview/card/top-interview-questions-easy/92/array/769):
```ts
// O(1) time & space (due to the constraints)
function isValidSudoku(board: string[][]): boolean {
  const [rows, cols, squares] = [9, 9, 9].map(() => 
      Array.from({ length: 9 }, () => new Set<number>()));
  
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      // For each cell
      const cell = board[row][col];
      if (cell === '.') continue; // Skip empty cells
      // Since the `sqrIdx` is determined by the "left-to-right for each row" order, we're multiplying 3 on the rows to shift it into the correct "square row"
      const sqrIdx = ~~(row / 3) * 3 + ~~(col / 3); // Double bitwise NOT is equivalent to `Math.floor` by TRUNCATING decimals for POSITIVE numbers
        
        // Check for the number's UNIQUENESS in each corresponding row, column, or box
      if (rows[row].has(+cell) || cols[col].has(+cell) || squares[sqrIdx].has(+cell)) {
        return false; // Duplicate found, Sudoku is invalid
      }
        
        // Add the curren cell to the corresponding Sets of row, column, and box 
      [rows[row], cols[col], squares[sqrIdx]].forEach(set => set.add(+cell));
    }
  }
  return true; 
}
```

### Sorting & Searching
- Essentials: [[#Merge sort]], [[#Quick sort]] and [[#Binary |Binary search]]. 

### Recursion & Backtracking
- While recursion processes all states, backtracking intelligently prunes the search space by abandoning invalid path early.
#### Recursion
- Use pure recursion when problems naturally break down into identical subproblems (think of Fibonacci, tree traversals,...) or when they follow [[#Divide and Conquer]] patterns.
##### Examples
- [Swap Nodes in Pairs](https://leetcode.com/problems/swap-nodes-in-pairs)
- [Binary Tree Inorder Traversal]()
#### Backtracking
- Use backtracking when you spot these keywords: "_**all**_ possible...", "generate _**all**_...", "find _**all**_ solutions...". It answers "yes" to the question: "==Am I building _multiple solutions_ and need to _try different choice at each step_?==" or "Does the problem _involve undoing choices to try alternatives_?"
- This technique is the foundation for [[#DFS]].
##### Examples
- [Combinations](https://leetcode.com/problems/combinations)
- [Generate Parentheses]()

### BFS & DFS
#### BFS
- Useful when you need the ==**_shortest path_**== in terms of _steps or levels_ (like fewest moves, nearest neighbor in an _unweighted graph_). It explores _**==layer by layer==**_, so it _==finds the closest stuff first==_, using the ==**_queue_** data structure==.
##### Examples
- [Minimum Depth of Binary Tree](https://leetcode.com/problems/minimum-depth-of-binary-tree)
- [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/description)
- [Rotting Oranges](https://leetcode.com/problems/rotting-oranges)
- [Number of Islands]()
- [Word Ladder]()
#### DFS
- You need to ==_explore options **deeply**_==, _check if a path simply **exists**_ (not necessarily the shortest), check for cycles, or visit everything _in a branch_ before moving on with [[#Backtracking |backtracking]] (like traversing a maze or doing topological sort).
- Implemented with recursion, or iteration by using a **_==stack==_** and a `visited` set/array.
##### Examples
- [Subsets](https://leetcode.com/problems/subsets/description)
- [Permutations](https://leetcode.com/problems/permutations)
- [Course Schedule]()

### Greedy
- Think of it like hiking up a hill: you want to _**reap** all the benefits_ for each forward step. In other words, you're making locally optimal choice at each step, and hope that it leads to a globally optimal solution. It’s not always perfect, but it's efficient.
> A _**sorted** input_ is preferred for this algorithm.
- An [example](https://leetcode.com/explore/interview/card/top-interview-questions-easy/92/array/564):
```ts
// In Layman's term: the sum of all the consecutive increases is the return value. Therefore, if the price today is higher than yesterday, you IMMEDIATELY sell and take that profit 
// O(n) time, O(1) space
function maxProfit(prices: number[]): number {
    return prices.reduce((profit, currentPrice, day) => {
        // Make a profit if current price > previous day's price
        return day > 0 && currentPrice > prices[day - 1] 
            ? profit + (currentPrice - prices[day - 1]) 
            : profit;
    }, 0);
}
```
#### More examples
- [Assign Cookies]()
- [Non-overlapping Intervals]()
- [Merge Intervals](https://leetcode.com/problems/merge-intervals)
- [Jump Game]()

### Dynamic Programming
- Use it when you need to ==optimize _**overlapping** subproblems==_ with _memoization_ (top-down) or _tabulation_ (bottom-up). Store & reuse.
- With _**memoization**_, _==use recursion with a cache==_ (like a map or an array) to store result:
	- Check the cache to see if it contains the answer for the current state. If it does, we're done. If it doesn't, we keep the recursion going, and remember that:
	- _Before_ returning the computed answer, _store_ it in the cache.
- With _**tabulation**_, we only _==use loops with a table==_ (array) built from base cases:
	- First, figure out the dimensions of your DP table (e.g. `dp[n+1]` or `dp[rows][cols]`), then:
	- Identify the _**smallest** subproblems_ you know the answer to (i.e. base cases) and fill those in the table using a loop (or nested loops).
	- The loop order matters: make sure you compute smaller subproblems _before_ you need them for bigger ones.
	- Each answer `dp[i]` (or `dp[i][j]`) is calculated using previously computed values in the table (e.g. `dp[i] = dp[i-1] + dp[i-2]`)
	- The final answer is usually the last entry (or one of the last entries) in the table.
##### Examples
- [Fibonacci Number](https://leetcode.com/problems/fibonacci-number)
- [House Robber]()
- [Coin Change]()
- [Word Break]()
- [Longest Common Subsequence]()

## Extras
### Linked list
#### In-place reversal
- We can also apply [[#Two Pointers |two pointers]] for the Linked List data structure. In [this example](https://leetcode.com/explore/interview/card/top-interview-questions-easy/93/linked-list/560), we're using the `prev` and `current` pointers: 
```ts
class ListNode {
    val: number;
    next: ListNode | null;
    constructor(val?: number, next?: ListNode | null) {
        this.val = (val ?? 0)
        this.next = (next ?? null)
    }
}

// O(n) time & O(1) space
function reverseList(head: ListNode | null): ListNode | null {    
    let prev: ListNode | null = null;  // initial "dummy" node
    let current: ListNode | null = head;
    
    while (current) {
// Note that ALL the right-side values are captured in temporary variables first, AND THEN assigned to the left-side variables all AT ONCE (not sequentially)    
        [current.next, prev, current] = [prev, current, current.next];
    }
    
    return prev;
}

// Let's look at the `1→2→3→null` linked list as an example:
// Initially: prev=null, current=1, next=null
// First iteration: 1→null, prev=1, current=2 
// Second iteration: 2→1→null, prev=2, current=3
// Third iteration: 3→2→1→null, prev=3, current=null
```
#### Merging
- Again, the [[#Two Pointers |two pointers]] technique can be useful for problems like [this one](https://leetcode.com/explore/interview/card/top-interview-questions-easy/93/linked-list/771):
```ts
function mergeTwoListsOptimized(list1: ListNode | null, list2: ListNode | null): ListNode | null {  
    const dummy = new ListNode();  
    let current = dummy;  
    
// Two pointers: `list1` and `list2`. `current` is our extra pointer that we'll use to build the result list. 
    while (list1 && list2) {  
        // 4 things happening here:
        // 1. Compare the values of the current nodes from both lists
        // 2. Shorten the list with smaller head value
        // 3. Create the "next" node of our result list with that smaller node
        // 4. Advance our current node of our result list to that new "next" node 
        [list1, list2, current.next, current] =  
            list1.val <= list2.val  
                ? [list1.next, list2, list1, list1]  
                : [list1, list2.next, list2, list2];  
    } 
     
	// The lists are pre-sorted so we're adding the remaining list to the result list
    current.next = list1 ?? list2;  

	// Our result list started RIGHT AFTER our `dummy`, as per `let current = dummy`, so we're returning the result list as `dummy.next`
    return dummy.next;  
}  

// Example: let's say we start with 
// list1: 1 → 3 → 5 → null
// list2: 2 → 4 → null
// dummy: null

// Iteration 1:
// list1: 3 → 5 → null 
// list2: 2 → 4 → null
// dummy → 1

// Iteration 2:
// list1: 3 → 5 → null 
// list2: 4 → null
// dummy → 1 → 2

// Iteration 3:
// list1: 5 → null 
// list2: 4 → null
// dummy → 1 → 2 → 3

// Iteration 4:
// list1: 5 → null 
// list2: null 
// dummy → 1 → 2 → 3 → 4
// Exit `while` loop (because `list2` is `null`)

// current.next = list1 ?? list2  >> resolves to `list1`
// Result list: dummy → 1 → 2 → 3 → 4 → 5 → null
// Return dummy.next: 1 → 2 → 3 → 4 → 5 → null
```

### Heap (priority queue)
- Use it when you need quick access to the smallest or largest element (i.e. `k` problems) in a changing collection.
- Also useful for problems where you need to process things based on priority. Heaps keep track of the next highest priority item efficiently.
#### Examples
- [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array): the `MinHeap` handles the "without sorting" part
- [Top K Frequent Elements]()
- [Find Median from Data Stream]()

### Tree
#### Binary Search Tree
- It's just a binary tree, but _ordered_. BSTs are all about the `left < root < right` property.
- Think of it when you need ordered data + fast lookups/inserts/deletes with _==in-order traversal==_ and $O(logn)$ time on average.
##### Examples
- [Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree)
- [Insert into a Binary Search Tree]()
- [Delete Node in a BST]()

#### Trie
- It's a tree where each path from the root represents a prefix.
- Has practical values. Perfect for fast string searching (i.e. prefix searching), autocomplete, and scenarios. 
##### Examples
- [Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree)
- [Design Add and Search Words Data Structure]()
- [Word Search II]()

### Bit Manipulation
- These low-level operations that can turn a brute force approach into something sleek.
#### The XOR operator
- Think of XOR like procreation. One sex can _only_ procreate with the _opposite_ sex. Same sex consummation or masturbation leads to termination of a species. 
- Perfect for problems where duplicates cancel out. Leverage this property to solve cancellation or identity issues, such as:
	- `x^x == 0`: This means duplicate numbers cancel each other out.
	- `0^0 == 0`: Obviously.
	- `x^0 == x`: A number XORs with `0` returns itself.
- For [example](https://leetcode.com/explore/interview/card/top-interview-questions-easy/92/array/549):
```ts
// O(n) time & O(1) space
function singleNumber(nums: number[]): number {
    return nums.reduce((res, num) => res ^ num, 0);
}

// Let's say we call `singleNumber([4,1,2,1,2])`, here's how it works:
// 4 ^ 1 ^ 2 ^ 1 ^ 2 = 4 ^ (1 ^ 1) ^ (2 ^ 2) = 4 ^ (0 ^ 0) = 4
```

### Matrix Manipulation
- A [transpose then reverse](https://leetcode.com/explore/interview/card/top-interview-questions-easy/92/array/770) problem:
```ts
// O(n^2) time & O(1) space
function rotate(matrix: number[][]): void {
    const n = matrix.length;
    
    // Step 1: Transpose the matrix by turning columns into rows
    for (let i = 0; i < n; i++) {
        for (let j = i; j < n; j++) {
            // Swap elements across the diagonal
            [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
        }
    }
    
    // Step 2: Reverse each row to complete the 90-degree rotation
    for (let i = 0; i < n; i++) {
        matrix[i].reverse();
    }
}

// This solution is a bit unintuitive, but it shows coherent logic without "trying to be smart" as the one above
// It solves the problem by using layer-by-layer swapping (swap elements in groups of four)
function rotateMatrixPure(matrix: number[][]): void {
  const n = matrix.length;
  // Process layer by layer
  for (let layer = 0; layer < Math.floor(n / 2); layer++) {
// Marks the boundaries of the current layer
    const first = layer;
    const last = n - layer - 1;
		
    for (let i = first; i < last; i++) {
   // To keep track of your position within the layer by how far from the edge you are in the current layer
      const offset = i - first;
      
      // Save the top element
      const top = matrix[first][i];
      
      // Move left element to top: `last - offset` gives you the ROW in the LEFT COLUMN that corresponds to your current position along the top row.
      matrix[first][i] = matrix[last - offset][first];
      
      // Move bottom element to left: `last - offset` gives the correct COLUMN in the BOTTOM ROW that mirrors your position on the top row.
      matrix[last - offset][first] = matrix[last][last - offset];
      
      // Move right element to bottom: since you’re simply moving from the top row horizontally to the right column, you keep the same row index `i` and use `last` for the column.
      matrix[last][last - offset] = matrix[i][last];
      
      // Assign top element to right
      matrix[i][last] = top;
    }
  }
}
```

### String manipulation
#### Knuth-Morris-Pratt (KMP)
- Use this pattern to a pattern (needle) inside a text (haystack) [without re-checking](https://leetcode.com/explore/interview/card/top-interview-questions-easy/127/strings/885) characters unnecessarily (as if "we've already matched several characters and then encounter a mismatch, we can _use what we already know_ about the pattern to skip ahead rather than starting over.").
- It's basically an advanced [[#Two Pointers  |two pointers]] technique which guarantees $O(n+m)$ time and $O(m)$ space, where `n` is the length of the haystack and `m` is the length of the needle.
##### How it works
- **Preprocessing**: Before searching, KMP analyzes the pattern to build a "partial match" table (the LPS or Longest Prefix which is also Suffix array).
- **The LPS Table**: For each position in the pattern, this table tells us "if we encounter a mismatch here, how many characters back should we jump in the pattern?" It essentially remembers portions of the pattern that repeat.
- **Smart Matching**: When a mismatch occurs after matching several characters, instead of sliding the pattern forward by just one position (naive approach), KMP jumps ahead based on the LPS table, skipping comparisons that are guaranteed to fail.
- In an interview, acknowledging how it works is already a win. You don't need to remember how to use it. [Visualization](https://claude.ai/share/eac95702-72b2-435a-acee-caa7cba0452c)


