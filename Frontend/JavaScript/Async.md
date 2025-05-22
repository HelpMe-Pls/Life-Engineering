- Synchronous functions are blocking while asynchronous functions are not. In synchronous functions, *previous statements are completed before the next statement is run* (think of the waterfall model). In this case, the program is evaluated exactly in order of the statements and execution of the program is *paused* if one of the statements take a very long time.

- Asynchrony: It's about what happens when part of your program runs _now_, and another part of your program runs _later_ - there's a gap between _now_ and _later_ where your program isn't actively executing. 
- The problem most of us seem to have is that _later_ doesn't happen strictly and immediately after _now_. In other words, tasks that cannot complete _now_ are, by definition, going to complete asynchronously, and thus we will not have the synchronous blocking behavior as you might intuitively expect or want.
- The simplest (but definitely not only, or necessarily even best!) way of "waiting" from _now_ until _later_ is to use a function, commonly called a *callback function*. For example, when your JS program makes an Ajax request to fetch some data from a server, you set up the "response" code in the callback function, and the JS engine tells the hosting environment: "Hey, I'm going to suspend execution of this task for now (*and carry on with the rest of the program*), but whenever you *finish* with that network request, and you have some data, please _call_ this function _back_" :
```js
// The order of execution looks like:
// 1. Make the request to `http://some-url.com`, meanwhile,
// 2. Execute `callSth`
// 3. At some point in the future (depends on WHEN step 1 returns some kind of `data`), execute `myCallbackFunction`
ajax("http://some-url.com", function myCallbackFunction(data){
	console.log(data); // The `later` part
});

// This expression is executed BEFORE `myCallbackFunction`:
callSth()
```
- Any time you wrap a portion of code into a callback function, you're creating the _later_ chunk of your code by specifying that it should be executed *in response to* some event (timer, mouse click, Ajax response, etc.), and thus introducing asynchrony to your program.

## Async Console gotcha
- There are some browsers and some conditions that `console.log(..)` does **not** actually _immediately_ output what it's given. The main reason this may happen is because I/O is a very slow and blocking part of many programs (not just JS). So, for better performance, browsers may handle console I/O operations asynchronously in the background, potentially without providing any indication to the user that this asynchronous processing has occurred:
```js
var a = {
	index: 1
};

// later
console.log(a); // ??

// even later
a.index++;
```
- We'd normally expect to see the `a` object be snapshotted at the exact moment of the `console.log(..)` statement, printing something like `{ index: 1 }`, such that in the next statement when `a.index++` happens, it's modifying something different than, or just strictly after, the output of `a`.
	- *Most of the time*, the above code will probably produce an object representation in your developer tools' console that's what you'd expect. But it's possible this same code could run in a situation where the browser felt it needed to defer the console I/O to the background, in which case it's _possible_ that by the time the object is represented in the browser console, the `a.index++` has already happened, and the `console.log(a)` shows `{ index: 2 }`.
	- It's a moving target under what conditions exactly `console` I/O will be deferred, or even whether it will be observable. Just be aware of this possible asynchrony in I/O in case you ever run into issues in debugging where objects have been modified _after_ a `console.log(..)` statement and yet you see the unexpected modifications show up.

> If you run into this rare scenario, the best option is to use breakpoints in your JS debugger instead of relying on `console` output. The next best option would be to force a "snapshot" of the object in question by serializing it to a `string`, like with  `JSON.stringify(..)`

## Event Loop
- The mechanism which monitors the execution order of multiple chunks of your program _over time_, at each moment invoking the JS engine, called the "event loop". Here's a simplified pseudocode to illustrate the concepts, but it should be enough to help get a better understanding:
```js
// `eventLoop` is an array that acts as a queue (first-in, first-out)
var eventLoop = [];
var event;

// each iteration of this loop is called a "tick"
// For each tick, if an event is waiting on the queue, it's taken off and executed:
while (true) {
	// perform a "tick"
	if (eventLoop.length > 0) {
		// get the top event in the queue
		event = eventLoop.shift();

		// now, execute the next event
		try {
			event();
		}
		catch (err) {
			reportError(err);
		}
	}
}
```


- ==It's important to note that `setTimeout(..)` doesn't put your callback on the callstack immediately.== What it does is set up a timer; when the timer expires, the environment (browser or Node.js) places your callback into the macrotask queue, such that _some future tick_ will pick it up and execute it.
	 - What if there are already 20 items in the macrotask queue at that moment? Your callback **waits**. It gets in line *behind* the others. The event loop will pick up the tasks in the ***microtask queue first***, and after the microtask queue is done (empty), it **then** move on to the **macrotask queue**, while adhering to the FIFO principle for each queue. This explains why `setTimeout(..)` timers may not fire with perfect accuracy. You're guaranteed (roughly speaking) that your callback won't fire _before_ the delay time you specify, which mean ==it can happen *exactly at **or after*** that time, depending on the state of the queues.

- In other words, the event loop is the orchestrator, but the call stack is the actual stage where code performs. The event loop _monitors_ the call stack, the macrotask queue and the microtask queue. 
	- Tasks are executed in a _synchronous_ manner on the call stack, and the code currently executing synchronously on the call stack has the highest priority and blocks the event loop from pushing anything else onto the stack until it finishes.
	- **_Only when_** the call stack **_is empty_**, the event loop processes macrotasks _one by one_. After each macrotask completes, it completely drains the microtask queue _before_ moving to the next macrotask.  

## Race condition
- The most common tools for parallel computing are [[NodeJS#Threads and Processes |processes and threads]]. Processes and threads execute **independently** and may execute **simultaneously**: on separate processors, or even separate computers, but multiple threads can share the memory of a single process.

- In a single-threaded environment, it really doesn't matter that the tasks in the thread queue are low-level operations, because nothing can interrupt the thread. But if you have a parallel system, where two different threads are operating in the same program, you could very likely have unpredictable behavior.

- Because ==JavaScript is single-threading==, the code inside of `foo()` (and `bar()`) is atomic, which means that once `foo()` starts running, the entirety of its code will finish before any of the code in `bar()` can run, or vice versa. This is called =="run-to-completion"== behavior:
```js
// Chunk 1:
var a = 1;
var b = 2;

// Chunk 2:
function foo() {
	a++;
	b = b * a;
	a = b + 3;
}

// Chunk 3:
function bar() {
	b--;
	a = 8 + b;
	b = a * 2;
}

// ajax(..) is some arbitrary async function given by a library
ajax("http://some.url.1", foo);
ajax("http://some.url.2", bar);
```
- Chunk 1 is synchronous (happens _now_), but chunks 2 and 3 are asynchronous (happen _later_), which means their execution will be separated by a gap of time. Chunks 2 and 3 may happen in either-first order, so there are two possible outcomes for this program:
```js
// Chunk 2 happens first:
a; // 11
b; // 22

// Chunk 3 happens first:
a; // 183
b; // 180
```

- As applied to JavaScript's behavior, this *function-ordering **non**determinism* is known as "==race condition==", as `foo()` and `bar()` are racing against each other to see which runs first. Specifically, it's a "race condition" because you cannot predict **reliably** how `a` and `b` will turn out. 

- To avoid race condition, you can make the output determined by conditionally check for their completion, or delegate your output to a higher-level container:
```js
// Using the `if` check to mitigate race condition 
var a, b;

function foo(x) {
	a = x * 2;
	if (a && b) {
		baz();
	}
}

function bar(y) {
	b = y * 2;
	if (a && b) {
		baz();
	}
}

function baz() {
	console.log(a + b);
}

ajax("http://some.url.1", foo);
ajax("http://some.url.2", bar);

//------------------------------------------------
// Using a "container":
/* `foo()` and `bar()` are two concurrent "processes", and it's indeterminate in which order they will be executed. 
* But we've constructed the program in a way that it doesn't matter what order they execute
* because they act independently and the code will always work expectedly, 
* regardless of the ordering, therefore, it's NOT a "race condition".
*/ 

var res = {};  // the container

function foo(results) {
	res.foo = results;
}

function bar(results) {
	res.bar = results;
}

ajax("http://some.url.1", foo);
ajax("http://some.url.2", bar);
```

## Concurrency
- Concurrency is when two or more "processes" are executing simultaneously over the same period, regardless of whether their individual constituent operations happen _in parallel_ (at the same instant on separate processors or cores) or not. You can think of concurrency then as "process"-level (or task-level) parallelism, as opposed to operation-level parallelism (separate-processor threads).

- From a high-level perspective, they [[NodeJS#Concurrency and Simultaneity |appear]] to be running _simultaneously_ (even though *at any given moment **only one event*** is being processed).
- Let's imagine a site that displays a list of status updates (like a social network news feed) that progressively loads as the user scrolls down the list. For a given window of time (a few seconds worth of a user scrolling), let's visualize each independent "process" as a series of events/operations and the interleaving of all these events onto the event loop queue:
```js
// "Process" 1 (`onScroll`-triggered events)
// "Process" 2 (Ajax events)
// "Process 1" and "Process 2" run concurrently (task-level parallel), but their individual events run sequentially on the event loop queue:
onscroll, request 1   <--- Process 1 starts
onscroll, request 2
response 1            <--- Process 2 starts
onscroll, request 3
response 2
response 3
onscroll, request 4
onscroll, request 5
onscroll, request 6
response 4
onscroll, request 7   <--- Process 1 finishes
response 6
response 5
response 7            <--- Process 2 finishes
```

- If a "process" is too heavy, it can be _cooperated_ by breaking into smaller chunks and to allow other "process" interleaving:
```js
var res = [];

// `response(..)` receives array of results from the Ajax call
// Imagine `data` has 10 million records, that can take a while to run (several seconds on a powerful laptop, much longer on a mobile device, etc.)
// While such a "process" is running, nothing else in the page can happen,
// including no other `response(..)` calls, no UI updates, not even user events like scrolling, typing, button clicking, and the like. That's pretty painful.
function response(data) {
	// add onto existing `res` array
	res = res.concat(
		data.map(function(val){
			return val * 2;
		})
	);
}

// ajax(..) is some arbitrary Ajax function given by a library
ajax("http://some.url.1", response);
ajax("http://some.url.2", response);

//---------------------
// So, to make a more cooperatively concurrent system (one that's friendlier and doesn't clog up the event loop queue),
// you can process these results in asynchronous batches, after each one "yielding" back to the event loop to let other waiting events happen: 
var res = [];

function response(data) {
	// let's just do 1000 at a time
	var chunk = data.splice(0, 1000);

	// add onto existing `res` array
	res = res.concat(
		// make a new transformed array with all `chunk` values doubled
		chunk.map(function(val){
			return val * 2;
		})
	);

	// anything left to process?
	if (data.length > 0) {
		// async schedule for next batch
		setTimeout(function(){
			response(data);
		}, 0);
	}
}

ajax("http://some.url.1", response);
ajax("http://some.url.2", response);
```

## Jobs
- At any given moment, only one event can be processed from the queue at a time. While an event is executing, it can directly or indirectly cause one or more subsequent events.

- The `setTimeout(.., 0)` (hack) for async scheduling, which basically just means "add this function at the end of the current event loop queue". Jobs are kind of like the spirit of the `setTimeout(.., 0)` hack, but implemented in such a way as to have a much more well-defined and guaranteed ordering: **later, but as soon as possible** (make sure it happens right away *before anything else* can happen). "Job queue" is a queue hanging off the **end** of every **tick** in the event loop queue:
```js
// You might expect this to print out `A B C D`
// but instead it would print out `A C D B`,
// because the Jobs happen at the END of the current event loop tick, and "the timer" fires to schedule for the NEXT event loop tick (IF AVAILABLE!).
console.log("A");

// The timer
setTimeout(function(){
	console.log("B");
}, 0);

// theoretical "Job API"
schedule(function(){
	console.log("C");

	schedule(function(){
		console.log("D");
	});
});
```
---

Related topics:
[[Callbacks]]
[[Promise]]
[[Advanced Patterns]]