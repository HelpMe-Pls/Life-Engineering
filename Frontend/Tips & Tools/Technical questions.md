[[DSA]]
[[System Design]]
[[Day-to-day work related]]

---

- Whiteboards also tend to encourage candidates to speak more and *explain their thought process*. When a candidate is given a computer, their communication drops substantially.
- Your initial approach should be discussing with the interviewer and verify that your interpretation of the problem is on the right track with [pseudo code](https://www.interviewkickstart.com/learn/how-to-write-pseudocode) (the simplest form can be just a text-based description that details the requirements). You should be vocal about every solution that you could think of, then narrow down and explain why you're elected one approach over another.
- Even if you can't come up with the code or DSA, don't fret. Always strive to demonstrate your reasoning and the best practices that you know of. When possible, always use code that has been shown to be effective. Don't try to reinvent the wheel.
- Solve the problem conceptually first > Use the appropriate tools/DSA > Optimize the solution
- If you can incorporate *unit tests* into an assignment, particularly ones with time constraints, you will be well-prepared for a coding interview.
- You'd want to mock up (draw) an example (a general case), which is:
	- Specific. It should use real numbers or strings (if applicable to the problem).
	- Sufficiently large. Most examples are too small, by about 50%.
	- Not a special case. Be careful. It's very easy to inadvertently draw a special case. If there's any way your example is a special case (even if you think it probably won't be a big deal), you should fix it.
- If the problem appears too hard to come up with pseudo code, walk through the brute force solution and look for areas to narrow down the goal, then optimize it.
- The nice thing about the modular code is that it's easily testable because each component can be verified separately. As code gets more complex, it becomes increasingly important to write it in a modular way. This will make it easier to read and maintain. Your interviewer wants to see you demonstrate these skills in your interview.
- Use a hash table. Hash tables are widely used in interview questions and should be at the top of your mind.
- When you find bugs (and you probably will), you should of course fix them. But don't just make the first correction you think of. Instead, carefully analyze why the bug occurred and ensure that your fix is the best one.
- Initial approach for optimizing your solution: 
	- Modularize this code into a function that is callable repeatedly and reuse the code when possible.
	- If there are portions of your code that are no longer required as a result of modularizing, or as a result of an avenue of thought that was not completed, remove it.
	- Then, apply more sophisticated procedures for time & space complexity optimization.
- Best Conceivable Runtime (BCR): suppose you want to compute the number of elements that two arrays (of length `A` and `B`) have in common. You immediately know that you can't do that in better than `O(A + B)` time because you have to "touch" each element in each array, therefore, `O(A + B)` is the BCR.
	- We can base on the BCR to guide us from the brute force approach to the optimal algo
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