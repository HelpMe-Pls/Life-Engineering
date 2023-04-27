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
- Big O time is the language and metric we use to describe the ***efficiency*** of algorithms.
- Big O just describes the ***rate*** of increase (i.e. allows us to express how the runtime scales). For this reason, we *drop the constants* in runtime. An algorithm that might have described as $O(2n)$ is actually $O(n)$.
- If your algorithm is in the form "do this, *then*, when you're *all done*, do that" then you ***add*** the runtimes. If your algorithm is in the form "do this *for each time* you do that" then you ***multiply*** the runtimes. E.g:
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
- It is the variation (increase or reduction) in execution time (*how long* it takes) when the *number of operations* in an algorithm increases or decreases. To estimate the time complexity, we need to calculate ***the number of times*** an operation is executed (in proportion to the *size and cost* of input).
	- $O(1)$ - Constant time: where `1` represents the ***same*** amount of time required for an algo to execute (i.e. it's *independent* of the size of the input). E.g. accessing an array element
	- $O(n)$ - Linear time: the time it takes to run the algorithm is increased proportionately as the size of input `n` increases. E.g. traversing an array
	- $O(log\enspace n)$ - Logarithmic time: basically means execution time goes up *linearly* while the `n` goes up *exponentially* (in CS we assume the base of `log` is `2`). E.g. binary search
	- $O(n^2)$ - Quadratic time: it is the reverse of logarithmic time, i.e. execution time grows *exponentially* proportional to the input size. E.g. nested loops iterating the ***same*** array
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
// When you see a problem where the number of elements in the
// problem space gets halved each time, that will likely be a 0(log n) runtime
for (let i = 1; i < n; i*=2)  {
	// For instance, if `n = 64`, then:
	// `log n` in this case is log base 2 of 64, which is 6
	// Therefore, this `console.log(i)` below is executed 6 times
	// As `n` increases EXPONENTIALLY (2^x = n), the iteration increases LINEARLY (+1)  
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
	- **Auxiliary space**: is the *temporary* space needed to compute a given solution (i.e. the space required to hold any *additional* variables *during* the computations of an application, the space that the algorithm needs _on top_ of input space). When we try to compare two algorithms, we usually have a similar type of input, that is, the size of the input can be disregarded and thus what we do end up comparing is the auxiliary space of the algorithms.
	- The expanding rate of memory required for an algorithm is essentially what space complexity is all about:
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
- However, just because you have `n` function calls in total doesn't mean it takes $O(n)$ space, i.e. the space complexity only increased when each execution of the algo requires the ***acquisition*** of more memory (i.e. auxiliary space) for it. Therefore, a suggestion for improving space complexity is to overwrite existing variables and avoid creating more variables/data structures than needed.
---

# Tools and techniques

## Data Structures
- Data structures are the containers in which programmers can store the data in an organized way such that it can be used later efficiently.
- **Static data structures** (e.g. arrays) are of fixed size and memory is allocated at the compile time by the compiler and deallocates when they go out of scope or program ends. 
- **Dynamic data structures** (e.g. linked lists, trees, heaps) are of dynamic size and memory is allocated at the runtime for them by the program. Memory is deallocated for dynamic data structure only when the program ends or the user deallocates it manually.
### Basic
#### String
- Some languages like Ruby and PHP allow strings to be changed after creation. It is more common, however, to use immutability, such as in Java, C#, JavaScript, Python, and Go.
- String immutability can reduce memory consumption. It reuses memory allocation by having all instances of a string value point to one location. So, when a change happens with a string value (e.g. "random"), say it becomes "random string", instead of changing the value "random", the variable is pointed to another instance of "random string", which is then added to the `String` pool.
- Consider reading existing words instead of creating a memory location for each word, including repeating ones. Using a unique set *reduces* the required space. The drawback is that if your application constantly changes texts, a memory penalty is incurred for every alteration made.

#### Integers
- An integer is used to hold numeric values. An integer can either be *signed* (holds both positive and negative numbers), or *unsigned* (will only hold positive numbers).
- There are several ways to represent integers in binary. One typical example is sign-magnitude. Sign-magnitude proposes using an indicator on the far left of the binary number to denote polarity: `1` for negative values and `0` for $\geq 0$ values.
- An integer cannot represent fractions. For this, one would use decimal or float. A fixed number of bytes is used when representing integers, the size of which can be specified in some languages.
- If you are developing an application that requires substantial amounts of available memory, using integers quickly and not having to worry about the detail may be the way to go.

#### Booleans 
- Boolean expressions are either `true` or `false`, and their equivalence in binary would be `0` or `1`
- Using Boolean expressions as indicators, you can then use relational operators to determine which line of code is to be executed. Finally, if you have not met any of your conditions, you might employ a catch-all code block (e.g. `else`).
- The use of Boolean logic is the backbone of circuit design. It is a way of interpreting Boolean operators together. The shapes in the diagram below are gates triggered when certain Boolean operators are fired.

#### Arrays
- Arrays can be created statically or dynamically. In static languages, an array would be kept on the stack and require that the array type be specified _a priori_. Stacks, by their nature, hold contiguous memory blocks, making accessing the information more manageable. Altering an array and returning it from the stack may lead to corrupted memory as the stack is discarded after the function completes.
  Dynamic languages offer more fluidity, sometimes calling for the size to be set and do not require the type to be specified before use. Such an instance would be stored on a heap. Thus, the array remains unaffected when the function ends, and the stack is discarded. A heap is less organized and it can take more time to access the elements. You should consider the trade-off between size and convenience, or accessibility versus speed.
- Some languages specify that an array must hold the same element type, like a `string` array or `int` array. In contrast, other languages allow mixed elements to be stored in an array.
- Sometimes, an array will be a fully-fledged object with complex functionality. At the same time, it can be treated as a storage type for primitives; operations and functionality would then be externally applied.
- Making a shallow copy of an array optimizes memory usage; however, you must ensure that no unexpected changes are inadvertently made to an array shared by two variables.
- A matrix is a two-dimensional array (or an array composed of arrays) that can act like a table. It can be used to represent rows and columns. A matrix will exhibit a *square* shape with the *same* number of columns and rows. Two index locations are required for a matrix, e.g. `arrayName[rowIndex][columnIndex]`

#### Objects
- An object is a programming concept that means that a structure has both state/attributes and behavior/methods (ability to perform some action)
- A first-class object is an entity within a programming language that can:
	-   Appear in an expression
	-   Be assigned to a variable
	-   Be used as an argument
	-   Be returned by a function call
 In the functional programming paradigm, functions are first-class objects.
- Classes are commonly described as blueprints for an object. By extension, an object can be described as an instance of a class.
- You can change the instances of a class through the constructor or an internal method of the object. The methods used to change attribute instances are generally called getters and setters.
- This notion of having one general concept (e.g. human) that can manifest in different forms (male, female, non-binary,...) is known as polymorphism.

### Collection
#### Lists and sets
- In most programming languages, lists are represented as objects. This means that in addition to storing data, they also have their own in-built methods. 
- A list is an abstract concept that refers to a container of elements. A list allows you to store *repeating* items and items of different types. A list is ordered, which means that it will *retain the ordering of items as they are inserted*.
  A stable implementation of a list is done using either an *array or a linked list*. An array-based list is subject to the same strengths and limitations associated with arrays.
  The flexibility of linked lists is achieved by including some additional storage requirements. This approach to growing the size of the data structure is very powerful and can lead to very large but manageable datasets. 
- A ***set*** will store its elements in an ***unordered*** way and will only hold unique elements. Sets are an example of an ***immutable*** structure in most programming languages. Once a value has been added to a set, it cannot change. Instead, you should and would have to delete it and add a new value. 
  However, objects that are added to sets can be treated differently depending on the language. In JavaScript, you can add mutable objects to a set, which is not permitted in Python. 
- While sets can perform an exceptionally quick search, performance degrades when dealing with very large datasets due to its internal mechanism which uses hash tables.

#### Stacks and queues
- Stacks and queues employ *sequential* access (i.e. items are stored in the order in which they were added). This limited approach to holding data can be very useful when you want to control *how* the data is accessed (i.e. LIFO for Stack and FIFO for Queue)
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
- The size of a tree is the sum of nodes within the tree. 
- Because trees are an abstract data type, there is no built-in method for them. It is crucial to keep in mind the important characteristics of a tree so that you can correctly implement them.
##### Binary tree
- The most straightforward and common tree is a *binary tree*:
	- Every node has a maximum of two child nodes.
	- Every node must have a key so that it can be easily identified.
	- Values found to be ***less*** than the node are placed in the ***left*** child node, and values that are greater are placed in the right child node.
	- The fundamental methods are:
		- **Lookup** method: a tree can be queried for the existence or absence of information. 
		- **Insertion** method: finding out where a node should go by placing it on the left or right side of the nearest higher value node. 
		- **Removal** method: when removing a node, it is necessary to check all its children nodes and ensure that a new connection is made with the node of the next highest value. 
##### Searching in trees
- A depth-first search (DFS) method involves visiting every node *sequentially* from top to bottom as far as possible along each branch *before backtracking* (i.e. checking the adjacent branch).
- A breadth-first search (BFS) method involves searching each node on the same level *before descending* to the next level, and repeating until the requested node (or deepest leaf node) has been reached.

### Advanced
#### Hash table (hash map)
- Hash tables (represented as arrays in JS) provide access to elements *in constant time*, so they are highly recommended for algorithms that prioritize *search and data retrieval* operations. Mostly used to index large amounts of data (i.e. maps keys to values)
- This means that when you want to know if an item is in the data structure, instead of looking through every item and making a comparison, you only need to apply the hashing function and see if that item has been hashed to memory.
- Hash tables are thread-safe (e.g. if 69 different processes are using and changing the same information in a table, the information is always correct).
- Hash tables increase in size when they are near a certain threshold. This is called the load factor.

> There are some distinct differences between hash table and hash map: a hash map will **allow** the use of nulls for keys and values, and it's **not** thread-safe. We can use a hash map and modify it to behave like a hash table in languages that don't have native implementation of hash table (e.g. Kotlin, Python). JS has `Object` and `Map` classes which are native hash table implementation.

- The address/index (i.e. hash code) of each key is *calculated* using the  `key`  itself. This could be done with a "hash function", returns something like `key % array_length | <some-random-number>`:
```js
// A data structure with the following keys:
const arr = [1, 4, 65, 34, 2, 45, 87, 12, 65, 2, 6, 98]

// Apply a hash funciton returning `key % 7` for each item will return a hash table with 5 collisions:
const hashed = [1, 4, 2, 6, 2, 3, 3, 5, 2, 2, 6, 0]
```
- Index collision/clashing (when two different hash codes could map to the same index or two different keys have the same hash code) is a problem because every slot in a hash table is supposed to store a single element. The larger the dataset used, the more likely clashing is prone to happen. It is resolved with close adressing (most common - using linked list) or open addressing (linear probing, quadratic probing, double hashing)
##### Close addressing
- The most common approach to solve index collision is to use a linked list: each slot of our hash table holds a pointer to a linked list. Every entry at that index will be inserted into the linked list for that index. This strategy greatly increases performance, but it is costly in terms of space.

#### Heaps
- Heaps were first introduced as a means of storing and searching data efficiently. A heap is a [specialized data structure](https://www.cs.auckland.ac.nz/software/AlgAnim/heaps.html) that is modeled like a tree but behaves in a similar way to a queue, but with different ***priority*** applied to its elements. Heaps are often built using ***binary trees*** (called *binary heaps*) though another approach would be to make an *array* act in a way that mimics the behavior of a binary tree (i.e. heapify). 
- A heap is built for specialized purpose, that involves identifying the ***most important item*** and returning this in the shortest time possible. Then queuing up the next item of importance. 
- Heaps that place priority on the lowest valued key are called *min heaps* (i.e. the minimum value is placed at the root) and ones that place the priority on the maximum value are called *max heaps*. Reverse all the methods of min heaps and you'll have the methods for max heaps:
	- **Insert**: similar to how insertion works in a binary tree with $O(log\enspace n)$ time
	- **Find/Peek min**: retrieve the minimum value from a heap is $O(1)$ because it will be stored always at the root.
	- **Delete min**: a heap should not support operations such as deleting items other than the min element (i.e. the root). Deleting arbitrary items in the tree would require restructuring the tree and this would lead to a degradation in performance. If you are looking for a data structure that can act in this way, then you might consider structures other than a heap.

#### Graphs
- A graph is a non-linear data structure that can store information in a way that allows you to extract some relations between the data.
- A graphs is like [sophisticated](https://www.shiksha.com/online-courses/articles/graphs-in-data-structure-types-representation-operations/) a tree without beginning or end. Graphs can also be traversed with DFS (by using stack) and BFS (by using queue).
- Unlike a tree, nodes do not have to be connected and can exist independently from the other nodes. An edge connects two nodes. An edge can be said to have a weight (i.e. a value that is stored in the connection that infers some information on the strength of the connection between the two nodes).
- A graph can be said to be directed, this means that the edges are focused (like a one-way street) or undirected (like a two-way street) and the connection infers information back and forth.
- Two nodes with an edge are said to be adjacent, and the nodes are called neighbours.
- A node's degree is the total number of edges connected to a node.


## Algorithms
- An algorithm can be defined as a precise sequence of instructions to solve a problem. It can be helpful to first generalize the problem and then more precisely outline the sequence of required instructions before coding an implementation.
- Whenever we say that our algorithm is sufficient then it means that the algorithm is solving the problem in less amount of time while taking the least amount of space.

### Sorting 
- Working with sorted data or having the ability to sort your own data can result in significant time savings. Therefore, a dataset of elements that can be ordered is fundamentally necessary.
- The actual metric that is used to sort is less important than the fact that they can be arranged in an ascending or descending order (although when saying an array is sorted without stating anything else, the ascending order is implied). 
- It's worth taking into consideration that whether the sorting is happening in-place or has been accomplished by creating a clone whilst keeping the original list.

#### Selection sort
- Suppose we're sorting in ascending order. Take an array of items and iterate from left to right. Starting with the first place on the index, iterate over the entire array and swap this value with the lowest value found on the right. Repeat until the entire array is sorted:
```js
const arr = [62, 24, 15, 22, 1]
// Pseudo code:
for(i=0; i<arr.length-1; i++) {
	let min_index = i
	    for(j=i+1; j<n; j++) {
	        if(arr[j] < arr[min_index]) {
	            min_index = j 
			}
	    }
	    swap(arr[i], arr[min_index])
}

// First iteration:
{62} 24 15 22 {1}
1 24 15 22 62

// Next iteration:
1 {24} {15} 22 62
1 15 24 22 62

// Next iteration:
1 15 {24} {22} 62
1 15 22 24 62 // `arr` sorted
```
- It always check the next item in the list until every item has been checked by using a nested loop, therefore, the time complexity is $O(n^2)$. Saying its time complexity increases with the array size is still a valid statement. 
- Because an in-place swap is being performed, no temporary array is required. There are 3 temporary variables `i`, `j` and `min_index`; however, they are *not dependent* on the list size (i.e. they don't scale with input size), so, the space complexity is $O(1)$. 

#### Insertion sort
- It is appropriate for datasets which are *already partially sorted* and the number of elements is small.
- Assume we're sorting in ascending order. Rather than searching through all the elements, this approach begins by examining the *first two elements* in a list and proceed *in pair* of subsequent elements. The smaller of the two is then moved to the left. This is repeated for every pair of elements each one being compared to the element on its left, then, a subsequent switch to the left is made if it's found to be smaller:
```js
const arr = [12, 11, 13, 5, 6]
// Pseudo code:
for(i=0; i<arr.length-1; i++) {
    let j = i
    while (j > 0 && A[j-1] > A[j]) {
        swap(A[j], A[j-1])
        j = j - 1
    }
}            

// First iteration:
{12} {11} 13 5 6
11 12 13 5 6

// Next iteration, 12 < 13, no swap occurred:
11 12 13 5 6

// Next iteration:
11 12 {13} {5} 6
11 {12} {5} 13 6
{11} {5} 12 13 6
5 11 12 13 6

// Next iteration:
5 11 12 {13} {6}
5 11 {12} {6} 13
5 {11} {6} 12 13
5 6 11 12 13 // arr sorted
```
- The time and space complexity is similar to selection sort.

#### Quick sort
- It uses a *divide-and-conquer* methodology. Suppose we're sorting in ascending order. Given an array of items, a place is determined on the array on which to split the array and this is called *the pivot point*. The original array is *partitioned* into two arrays one of which holds values smaller than the pivot, and another array holds values greater than the pivot value. Recursively, we find the pivot for each sub-lists until all lists contains only one element:
```js
// Function to swap two elements
function swap(arr, i, j) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}
 
// Function to generate a random pivot index
function generateRandomPivot(low, high) {
  return Math.floor(Math.random() * (high - low + 1)) + low;
}
 
// Function to perform QuickSort
function quickSort(arr, low, high) {
  if (low < high) {
    let pivotIndex = generateRandomPivot(low, high);
    let pivotValue = arr[pivotIndex];
 
    // Swap the pivot index with the last index in `arr`
    swap(arr, pivotIndex, high);
    // Set temporary starting point for partitioning iteration:  
    let i = low - 1;
	// Partitioning: 
    for (let j = low; j < high; j++) {
      if (arr[j] < pivotValue) {
        i++;
        swap(arr, i, j);
      }
    }
 
    // Partitioning: Swap the pivot element back so that it's placed within `i` and `j`
    swap(arr, i + 1, high);
 
    // Recursively sort the left and right subarrays
    quickSort(arr, low, i);
    quickSort(arr, i + 2, high);
  }
}
 
// Execute sample:
let arr = [5, 2, 7, 3, 1, 6, 4, 8];
console.log("Original array: [" + arr.join(", ") + "]");
 
quickSort(arr, 0, arr.length - 1);
 
console.log("Sorted array: [" + arr.join(", ") + "]");
```
- Quick sort is quite similar to merge sort. Its main advantage over merge sort, is that the sorting can be done in-place. This saves time because we don’t have to create new arrays.
- Quick sort consumes more space but returns overall quicker solutions. It has the time complexity of $O(n\enspace log\enspace n)$ and space complexity $O(n)$

### Searching
#### Linear
- It is the most direct way of retrieving an item. The search starts at the first item (index location 0) and iterates until either the target item is found or there are no more items left in the array to check.
```js
function linearSearch(arr, item) {
  // Go through all the elements of `arr` to look for the target item:
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === item) { // Found it!
      return i;
    }
  }
  
  // Item not found in the array.
  return null;
}
```
- Linear search has $O(n)$ time & space complexity

#### Binary
> To conduct a binary search, the list **must first be sorted**.
- A binary search is performed by comparing the target element to *the mid-point* on a *sorted* list and discarding the half that is *less than* the target element. This halving at the mid-point is repeated until the target element is found or there is no more list to half:
```js
// Iterative approach (using loops):
let iterativeBinary = function (arr, x) {
    let start=0, end=arr.length-1;
         
    // Iterate while start not meets end
    while (start<=end){
        // Find the mid index
        let mid=Math.floor((start + end)/2);
  
        // Found it!
        if (arr[mid]===x) return true;
 
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
    let mid=Math.floor((start + end)/2);
  
    // Compare mid with given key x
    if (arr[mid]===x) return true;
         
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
- Binary search runs with $O(log\enspace n)$ time and $O(n)$ space.

### Divide and Conquer
- The algorithm comprises two mandatory steps, namely, divide and conquer with an optional third, is combine. [Merge sort](https://www.geeksforgeeks.org/merge-sort/) is a good implementation of divide and conquer (`d&c`).
	- In the divide step, the input is split into smaller segments and processed individually. 
	- In the conquer step, every task associated with a given segment is solved.
	- The *optional* last step, combine, is combining all the solved segments.
- Parallelization and memory management are two immediate advantages when applying `d&c`:
	- Parallelism is when you have different threads or computers working on the same problem at the same time to complete it in a quicker time.
	- Memory management: in the merge sort example, consider that each array can be sent to a different core or server depending on the architecture of your organization and the results are then returned.
	  It might be the data being processed is too large to hold in memory and must be processed in chunks. Additionally, you may have provisioned access to cloud computing. So the solution can involve accessing an online server and exporting some of the problems from the company servers

### Recursion
- It is the practice of having functions call themselves with a smaller instance of a problem *repeatedly* until some exit condition is met.
- There are three requirements for implementing a recursive solution, namely the base case, the diminishing structure, and the recursive call. 
	- The base case ensures that the function will not continue to call itself infinitely and eventually terminates.
	- The diminishing structure is the base case oriented argument to the recursive call of the function itself
```js
exponent (x, n)
	if (n==0) return 1     // base case
	else 
		return (x*exponent(x, n-1)) // recursive call
						// ^^^^^^: diminishing structure
```
- Recursion vs regular loop: with recursion, you can simply call the function with a different input (diminishing structure) and it will *return a breakdown of the required steps*. Readability is a strong plus for recursion. Sometimes when a problem requires many checks (i.e. base cases), a loop can quickly become unwieldy. Recursive solutions reduce the amount of code required to solve a problem and can be easier to read and understand.
- It is highly recommended to employ a recursive approach as part of a `d&c` solution where the problem is broken intos maller steps and repeated to come upon the optimum solution.
- Recursion increases computational cost as resources are required to make a function call. 
  However, the computation from each result will be *retained on the call stack*. 
  This can be useful when computing hierarchical problems or problems where one can benefit from *knowing which steps resulted in a given outcome* like traversing a graph.

### Dynamic programming
- Dynamic programming (`dp`) is an extension of `d&c` and recursion which in addition involves keeping a record of results (memoizing) generated from running the sub problems each time they are newly run. 
- The main advantage of `dp` is that it promotes memoization, where previous calculations are stored and used instead of rerunning the calculations when the compiler identifies that the computation has been run for a previous task.
- The `dp` approach is commonly applied to combination or optimization problems. When computing `dp` solutions, you must firstly determine the *objective function* (i.e. the description of what the optimum outcome is to be). Next you must break the problem into smaller steps (using recursion) which should be written in such a way that you can change the outcome without altering the code for the methods already written.

### Greedy
- Greedy algorithm assumes that the simplest solution is almost always the best one. This problem solving principle argues that simplicity is better than complexity. It looks at the list of solutions and implement a local optimization. Usually, the current most rewarding option is chosen.
- This is an alternative approach to dynamic programming as this approach seeks to present an immediate solution for a task and favors local optimization over a more holistic global approach.
- For example, in a CPU tasks execution context, a greedy approach would involve selecting first the shortest running program and then the next shortest program and so on. While this might not lead to a globally optimized solution, it will reduce any overhead in calculating the most efficient subset of items
- Greedy vs `dp`: while the overhead for a greedy algorithm is low and coding a solution is quite straightforward, it will not always guarantee that the best option is returned.