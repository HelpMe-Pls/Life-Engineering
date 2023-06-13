[[DSA]]
[[System Design]]
[[Day-to-day work related]]

---
- Whiteboards also tend to encourage candidates to speak more and *explain their thought process*. When a candidate is given a computer, their communication drops substantially.
- This can be onsite whiteboard or an online session using codesandbox, codepen, coderpad...

## Evaluation
- The most common criteria for technical evaluations:
	1.  **Communication**: Asking clarifying questions, rationale of approach and tradeoffs are clear, well-organized, succinct and clear in terms of thought process so that the interviewer has no trouble following.
	3.  **Problem solving**: Understanding the problem and approaching it systemically, logically and accurately, discussing multiple potential approaches and tradeoffs. Ability to accurately determine time and space complexity and optimize them.
	4.  **Technical competency**: Translating discussed solutions to working code with no significant struggle. Clean, correct implementation with strong knowledge of language constructs.
	5.  **Testing**: Ability to test code against normal and corner cases, self-correcting issues in code. If you can incorporate *unit tests* into an assignment, particularly ones with time constraints, you will be well-prepared for a coding interview.


## Techniques
- **Visualize** the problem by drawing it out: work through a simplified example to ensure you understood the question, then check with the interviewer if those example cases are inline with their expectations. You'd want to mock up (draw) an example (a general case), which is:
	- Specific. It should use real numbers or strings (if applicable to the problem). If necessary, clarify the internal states at each step.
	- Sufficiently large (optional). Most examples are too small, by about 50%.
	- Not a special/edge case. Be careful. It's very easy to inadvertently draw a special case. If there's any way your example is a special case (even if you think it probably won't be a big deal), you should fix it.
- Think about how you would **solve the problem by hand** (i.e. without writing any code). 
	- If you can come up with a concrete set of rules around the approach that works for every example, you can write the code for it. 
	- While you might not arrive at the most efficient solution by doing this, it's a start which will give you some credit.
- Come up with **more examples**. It helps you to reinforce your understanding of the question, prevents you from prematurely jumping into coding, helps you to identify a pattern which can be generalized to any input, which may very well be the solution.
- **Divide and conquer**. Doing so also makes it clear to the interviewer that you have an approach, even if you don't manage to finish coding all of the smaller functions. If your interviewer asks you to optimize based on your well-abstracted solution, that is one possible path forward.
- Apply common [[DSA#Tools and techniques|data structures and algorithms]] at the problem. 

### Optimization
- Initial approach for optimizing your solution: 
	- Modularize the code into a function that is callable repeatedly and reuse the code when possible.
	- If there are portions of your code that are no longer required as a result of modularizing, or as a result of an avenue of thought that was not completed, remove it.
	- Then, apply more sophisticated procedures for time & space complexity optimization.
	- Note that there is often a theoretical limit to how fast your program can run (in terms of time complexity). For instance, a question that requires you to find the smallest/largest element in an unsorted array cannot run faster than $O(n)$.
#### Optimize time complexity
##### Best Conceivable Runtime (BCR)
- BCR is *the fastest practical solution* can only ever be as fast as the BCR, not faster than the BCR. If your initial solution is slower than the BCR, there could be opportunities to improve such that you can attain the BCR (but not always the case). 
- It wouldn't hurt to mention the BCR to your interviewer, which will be taken as a positive signal and also to remind yourself that you should not try to come up with something faster than the BCR. 
- For example: suppose you want to compute the number of elements that two arrays (of length `A` and `B`) have in common. You immediately know that you can't do that in better than `O(A + B)` time because you have to "visit" each element in each array, therefore, `O(A + B)` is the BCR.
- With the correct BCR determined, you now know the time complexity of the optimal solution lies between your initial solution and the BCR and can work your way towards it.
- If your solution already has the BCR and the interviewer is asking you to optimize further, there are usually two things they are looking out for:
	- Do even less work. Your solution could be O(n) but making two passes of the array and the interviewer is looking for the solution that uses a single pass.
	- [[Technical questions#Optimize space complexity |Use less space]].
##### Identify overlapping and repeated computation
- When the code is doing an expensive operation that has been done before, take a moment to step back and consider if you can reuse results from previous computations ([[DSA#Dynamic programming |using `dp`]]).
##### Try different data structures
- Is lookup time slowing your algorithm down? In general, most lookup operations should be O(1) with the help of a [[DSA#Hash table (hash map) |hash table]]. If the lookup operation in your solution is the bottleneck to your solution's time complexity, more often than not, you can use a hash table to optimize the lookup.
- [Example](https://www.techinterviewhandbook.org/coding-interview-techniques/#example-4)
##### Identify redundant work
- Although making these mistakes might not change the overall time complexity of your code, you are also evaluated on coding abilities, so it is important to write as efficient code as possible.
- Don't check conditions unnecessarily (e.g. `if (x < 5 && x < 10)`)
- Mind the order of checks. Most computers execute operations in order from left to right, hence it is more efficient to put the faster operation on the left (e.g. `if (fast() or slow())`)
- Don't invoke methods unnecessarily. Cache the result as a variable if the value doesn't change throughout the lifetime of the function:
	- Most of the time, the length of the input array doesn't change, declare a variable at the start like `var len = inputArray.length` and use `len` in your function instead of calling `inputArray.length` every time you need it.
- Early termination. For example, check if an array of strings contain a string regardless of case sensitivity:
```python
# DON'T do this:
def contains_string(search_term, strings):
  result = False
  for string in strings:
    if string.lower() == search_term.lower():
      result = True
  return result

# DO this instead:
def contains_string(search_term, strings):
  for string in strings:
    if string.lower() == search_term.lower():
    # Stop comparing the rest of the array/list because the result won't change.
      return True 
  return False
```
- Minimize work inside loops and don't redo work you have already done *if it doesn't change*. E.g. notice that in the above example, you are calling `search_term.lower()` once per loop of the `for` loop It's a waste because the `search_term` doesn't change throughout the lifecycle of the function. So, prefer setting a constant calculation to a variable:
```python
def contains_string(search_term, strings):
  search_term_lowercase = search_term.lower()
  for string in strings:
    if string.lower() == search_term_lowercase:
      return True
  return False
```
- Lazy evaluation. Further leverage the early return technique and try to delay the evaluation of an expression until its value is needed:
```python
def contains_string(search_term, strings):
  if len(strings) == 0:
  # Saved resource from the `.lower()` execution if there are no strings at all
    return False
  search_term_lowercase = search_term.lower()
  for string in strings:
    if string.lower() == search_term_lowercase:
      return True
  return False
```

#### Optimize space complexity
##### Changing data in-place/overwriting input data
- A trick to get around this is by overwriting values in the original input array so that you are not allocating any new space in your code. However, be careful not to destroy the input data in irreversible ways if you need to use it in subsequent parts of your code.
- Changing data in-place is mostly something you should do [only in coding interviews](https://www.techinterviewhandbook.org/coding-interview-techniques/#example-5) because it goes against the SoC pattern in Software Engineering (i.e. you should mention this before applying this technique).
##### Change a data structure
- Make sure you're using the [[DSA#Data Structures |right tool]] for the job.

## Best practices
### Do's
- Use variable names that explain your code (i.e. long variable names are acceptable)
- Ask for permission to use helper functions without having to implement them (e.g. `reduce`, `filter`, `min`, `max`, `push`,... should all be ok to use)
- Write in a modular fashion, going from higher-level functions and breaking them down into smaller helper functions. 
  The nice thing about the modular code is that it's easily testable because each component can be verified separately. As code gets more complex, it becomes increasingly important to write it in a modular way. This will make it easier to read and maintain. Your interviewer wants to see you demonstrate these skills in your interview:
	- Let's say you're asked to build a car. You can just write a few high level functions first: `gatherMaterials()`, `assemble()`. 
	- Then break down `assemble()` into smaller functions, `makeEngine()`, `getWheels()`, `constructCarFrame()`. 
- Use a mix of functional and imperative programming paradigms:
	- Pure functions are easier to reason about and can help to reduce bugs in your implementation.
	- Avoid mutating the parameters passed into your function especially if they are passed by reference unless you are sure of what you are doing.
	- However, functional programming is usually expensive in terms of space complexity because of non-mutation and the repeated allocation of new objects. On the other hand, imperative code is faster because you operate on existing objects. Hence you will need to achieve a balance between accuracy vs efficiency, by using the right amount of functional and imperative code where appropriate.
	- Avoid relying on and mutating global variables. Global variables introduce state. And things will go wrong rapidly.
	- If you have to rely on global variables, make sure that you do not mutate it by accident.
- If you are cutting corners in your code, state that out loud to your interviewer and say what you would do in a non-interview setting (no time constraints). For instance:
	- "Under non-interview settings, I would write a regex to parse this string rather than using `split()` which may not cover certain edge cases."
- Scan through your code for mistakes - such as off-by-one errors:
	- Read through your code with a fresh pair of eyes - as if it's your first time seeing a piece of code written by someone else - and talk through your process of finding mistakes
- Look out for places where you can refactor.
- Brainstorm edge cases with the interviewer and add additional test cases (such as large sized inputs, empty sets, single item sets, negative numbers)
### Don'ts
> Do not jumped into coding without explaining
- Do not use extremely verbose (half a screen or longer) or single-character variable names (unless they're in a loop like `i`, `j`, `n`).
- Do not repeat yourself (it's better to rephrase, not repeat, if your ideas weren't correctly understood).
- Do not spend too much time writing comments.
- Do not argue with the interviewer. They may be wrong but that is very unlikely given that they are familiar with the question.
---

## Tips
- Traversing 2 arrays/strings: Instead of having nested `for` loops, try using a `while` loop with the indexes as variable:
```java
// Check if you can insert ONE character into s1 to make s2 (if s1.length < s2.length)
boolean oneEditInsert(String s1, String s2) {
  int index1 = 0;
  int index2 = 0;
  while (index2 < s2.length() && index1 < s1.length()) {
    if (s1.charAt(index1) != s2.charAt(index2)) {
      if (index1 != index2) {
        return false;
      }
      index2++;
    } else {
	    index1++;
        index2++;
    }
  }
  return true;
}
```
- Use a hash table. Hash tables are widely used in interview questions and should be at the top of your mind.
- When you find bugs (and you probably will), you should of course fix them. But don't just make the first correction you think of. Instead, carefully analyze why the bug occurred and ensure that your fix is the best one.
