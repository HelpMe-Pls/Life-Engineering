### Intro
- Performance optimizations are not free. Don't *prematurely* optimize, always measure first. We want to have ***solid proof*** that something is *actually* slow before acting on it. Therefore, optimize responsibly and make sure to measure your refactor to see if it's worth it. An example ([at 04:20](https://epicreact.dev/modules/react-performance/optimize-context-value-solution)) to see if your code refactor has made any perf boost.
-------------

### Code Splitting
- If your component is taking too much time/resource to load (or the prority of its presence is not that high) then define it [as a module](https://github.com/HelpMe-Pls/react-performance/blob/master/src/globe/index.js) and `export default` it.
- [Dynamically import](https://github.com/HelpMe-Pls/react-performance/blob/master/src/final/01.extra-1.js) (at line `7`,`26`,`27`) a module for "eager loading" (use this trick as a forecasted user's behavior).
- Use the Webpack comment `webpackPrefetch: true` (e.g. `import(/* webpackPrefetch: true */ './your-module.js')`) to **prefetch** the module (i.e. load the module AFTER everything else is loaded but BEFORE the user makes any interaction with that module).
- Use the `<React.Suspense />` component **to render a fallback** value while the user waits for the *lazily imported* module to be loaded. More details [at 01:15](https://epicreact.dev/modules/react-performance/code-splitting-suspense-position).
- One great way to analyze your app to determine the need/benefit of code splitting for a certain feature/page/interaction, is to use **Coverage** (more details [at 1:00](https://epicreact.dev/modules/react-performance/code-splitting-coverage-tool)). Compare these 2 examples ([with](https://github.com/HelpMe-Pls/react-performance/blob/master/src/final/01.js) `lazy` and [without](https://github.com/HelpMe-Pls/react-performance/blob/master/src/exercise/01.js) it) to see them in action. 
---

### `useMemo` - for expensive calculations
- `useMemo()` allows us to compare the *cached* **value** (i.e. an invoked function or anything that’s not a function or capable of returning other values) against its latest version. Its callback is only executed when *one of the dependencies* has changed. A good indicator for when to use it [at 0:55](https://epicreact.dev/modules/react-performance/usememo-for-expensive-calculations-solution). 
- An [ideal](https://epicreact.dev/modules/react-performance/usememo-for-expensive-calculations-extra-credit-solution-1) JS-runtime.
- Use [Web Worker](https://github.com/HelpMe-Pls/react-performance/blob/master/src/workerized-filter-cities.js) instead of `useMemo` when `useMemo` needs a substantial amount of time to recalculate the value and you can’t make it faster. Pay attention to the [asynchronous nature](https://github.com/HelpMe-Pls/react-performance/blob/master/src/final/02.extra-2.js) of the web worker when using it (line `64 -> 67`). [More details](https://epicreact.dev/modules/react-performance/usememo-for-expensive-calculations-extra-credit-solution-2)
---

### `React.memo` - for reducing **unnecessary** re-renders
- React app's [lifecycle](https://epicreact.dev/modules/react-performance/reactmemo-for-reducing-re-renders-intro).
- [What](https://kentcdodds.com/blog/fix-the-slow-render-before-you-fix-the-re-render#what-is-a-re-render) is a re-render: React calls our function component **again** to get the React elements that need to be rendered to the DOM. It then compares those new React elements with the ones we gave it last time we rendered. From that it can tell what DOM updates to make, and then applies those updates for us in the most performant way possible.
- [When](https://www.developerway.com/posts/react-re-renders-guide#part2) a React component re-render.
- Just because a component is re-rendered, **doesn't mean** the DOM will be updated. This is commonly referred to as an "*unnecessary* re-render". Therefore, your problem *might be* unnecessary re-renders, but it's ***more likely*** a problem with ***SLOW RENDERS*** in general. There's something that your code is doing ***[during](https://kentcdodds.com/blog/fix-the-slow-render-before-you-fix-the-re-render#slow-renders)*** the render phase that's making things slow. **You should diagnose and fix that *first***, then, we can determine whether re-renders are still a problem (by using the Profiler).
- [When](https://kentcdodds.com/blog/usememo-and-usecallback#reactmemo-and-friends) to use `React.memo`. Making the mistake of wrapping ***everything*** in `React.memo` which can actually *slow down* your app in some cases and in all cases it makes your code *more complex*.
- `React.memo` accepts a second argument which is a custom compare function ([at 04:35](https://epicreact.dev/modules/react-performance/reactmemo-for-reducing-re-renders-extra-credit-solution-1)) that allows us to compare the props and return **true** if rendering the component again is **un**necessary (i.e. `React.memo` does its job) and false if it is necessary.
- Consider moving props that are primitive values up higher in the tree ([at 01:50](https://epicreact.dev/modules/react-performance/reactmemo-for-reducing-re-renders-extra-credit-solution-2)) before thinking of using `React.memo`'s comparator function.
---

### Optimizing large lists with [`react-virtual`](https://react-virtual.tanstack.com/docs/overview)
- Rather than iterating over all the items in your list and render **all** of them at once, you simply use the `useVirtual` hook and pass to it how many rows are in your list, give it a callback that it can use to determine what size they each should be, and then it will give you back `virtualItems` and a `totalSize` which you can then use to only render the items the user should be able to see within the window.
---

### Optimize context value
- All consumers that are descendants of a `Provider` will re-render ([at 0:25](https://epicreact.dev/modules/react-performance/optimize-context-value-solution)) whenever the Provider’s `value` prop changes, therefore, the consumer is updated even when an ancestor component bails out of the update ([at 0:25](https://epicreact.dev/modules/react-performance/optimize-context-value-extra-credit-solution-1)).
- **In case** your context `value` changes frequently, a quick way to improve performance is to memoize it ([at 02:45](https://epicreact.dev/modules/react-performance/optimize-context-value-solution)) with `React.useMemo`.
- A better (and more complex) alternative is using SoC pattern by separating the state and the mechanism for updating that state ([at 01:15](https://epicreact.dev/modules/react-performance/optimize-context-value-extra-credit-solution-1)) into two separate contexts.
---

### Fix "perf death by a thousand cuts"
- One of the perf issues is when updating the state of a component/element causes **lots** of other components to be rerendered (i.e. component**s** *unnecessarily* responding to a state change). You may think of `React.memo` as a solution, but then you may end up in the "death by a thousand cuts", which means that there's no specific section that's slow, so you wind up applying `React.memo` everywhere and drastically *increases the complexity* of your application's code because React does still need to run through every component from the top to determine whether it should re-render.
- A recommended approach is to have a SoC design by [[#Where to put state|colocating state]].
- After colocating the state, if there's a need for accessing that state from other components in the app, then consider separating our app’s state logically into domain-specific context providers ([at 0:30](https://epicreact.dev/modules/react-performance/fix-perf-death-by-a-thousand-cuts-extra-credit-solution-1)).
- If a component's state is depending on a very specific piece of the state's property (from the context) that is affecting other consumers of the context (i.e. causing them to re-render unnecessarily), consider isolating its "context consumer" part into a separate component ([at 0:45](https://epicreact.dev/modules/react-performance/fix-perf-death-by-a-thousand-cuts-extra-credit-solution-2)). Refactor it into a HOC for reusability ([at 0:30](https://epicreact.dev/modules/react-performance/fix-perf-death-by-a-thousand-cuts-extra-credit-solution-3)). Bonus with `forwardRef` ([at 03:15](https://epicreact.dev/modules/react-performance/fix-perf-death-by-a-thousand-cuts-extra-credit-solution-3)).
- Use `recoil` as an [alternative](https://epicreact.dev/modules/react-performance/fix-perf-death-by-a-thousand-cuts-extra-credit-solution-4) to `React.context` (at 0:45) when the state is desired to be accessed at a wider scope (i.e. between pages). 
---

### Production performance monitoring
- Use `React.Profiler` [to ensure](https://epicreact.dev/modules/react-performance/production-performance-monitoring-solution) that we always ship fast experiences to our users.
- Use *experimental* `trace` API to record user's interactions ([at 0:50](https://epicreact.dev/modules/react-performance/production-performance-monitoring-extra-credit-solution-1)) on a component within a `<React.Profiler />`.
---

### Where to put state

**![[Where to put state.png]]