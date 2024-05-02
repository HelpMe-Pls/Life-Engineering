### Thinking in React
- To implement a UI in React, you will usually follow the [following steps](https://beta.reactjs.org/learn/thinking-in-react):
	1. Break the UI into a ***component hierarchy*** (where each component matches one piece of your data model).
	2. Build a ***static*** version in React (build components that reuse other components and pass data from parent to child using props, not thinking about state *yet*). On small-medium projects, you can go “top down” by starting with building the components higher up in the hierarchy (i.e. the component at the top of the hierarchy will take your data model as its prop). For larger projects, it’s easier to go "bottom-up".
	3. Find the minimal but complete representation of UI state (i.e. identify [props vs state](https://beta.reactjs.org/learn/thinking-in-react#step-3-find-the-minimal-but-complete-representation-of-ui-state)).
	4. Identify [[Where to put state.png |where]] your state should live.
	5. Add inverse data flow (i.e. state flow between components).

- Why **immutability** is a fundamental concept in React:
	- **Predictability**: Immutability increases predictability by avoiding unexpected side effects caused by changes in state. Software development is often about clear communication which is aided by following expectations.
	- **Performance Optimization**: React can optimize the rendering process by comparing the old and new state. If the state is immutable, React knows that it doesn’t need to re-render a component when the state hasn’t changed.
	- **State Tracking**: Immutability allows for easier tracking of changes in state over time4. This can be particularly useful when debugging, as you can see the exact history of state changes.
	- **Concurrency**: In a concurrent environment, immutability can help avoid issues with race conditions, where two processes attempt to change the same piece of data simultaneously.

### Raw React APIs
-   `React` vs `ReactDOM`: `React` is for creating elements and using the core features of React (like hooks and such). `ReactDOM` is for specific rendering platform (in this case, the DOM in the browser, other cases, `ReactNative`).
-   Using raw `React` & `ReactDOM` APIs from [unpkg](https://unpkg.com/) to render "It is what it is."
-   `children` prop (when it is _plural_) will be rendered as an **ARRAY**.

### JSX
-   Statement vs expression: expression is expressed into a value (e.g. `someString.toUppercase()`), while statement is like some imperative logic and usually starts with a keyword: `if`, `const`, `switch`, `return`,...
-   Overriding and setting default props (with spread operator).

### Create a component
-  When developing a component:
	1.  Identify all its visual states.
	2.  Determine the human and computer triggers for state changes.
	3.  Model the state with `useState`.
	4.  Remove non-essential state to avoid bugs and [paradoxes](https://beta.reactjs.org/learn/reacting-to-input-with-state#step-4-remove-any-non-essential-state-variables).
	5.  Connect the event handlers to set state.
-  `prop-types` for typing the component's props if you're not using TypeScript.
- Event handlers are defined inside a component, so they can access props.
- `React.Fragment` allows you to position two elements side-by-side rather than being nested inside a parent element.
- When you want to _change_ something in response to user input, you should [set state](https://beta.reactjs.org/learn/state-a-components-memory) instead of writing to a variable. You should never change preexisting variables or objects while your component is rendering.
- A component [MUST](https://beta.reactjs.org/learn/keeping-components-pure#recap) be pure.
- Event [propagation](https://beta.reactjs.org/learn/responding-to-events#stopping-propagation).

### TypeScript
-   Use Constrained Identity Functions [(CIF)](https://github.com/HelpMe-Pls/react-fundamentals/blob/extra/src/final/TS/init.tsx) to constrain types more generically.

### Styling
-   Create a custom component with default props and spreading optional props.
-   [Represent](https://github.com/HelpMe-Pls/react-fundamentals/blob/extra/src/exercise/05.js) a default prop with a custom prop.

### Forms
-   `<label htmlFor=...>` in JSX is `<label for=...>` in HTML.
-   `event.preventDefault()`.
-   Improve form typing by extending the `HTMLFormElement` interface and override the `elements` to have a customized type that [we can define](https://github.com/HelpMe-Pls/react-fundamentals/blob/extra/src/final/TS/06.tsx).
-   Using `React.useRef()` to implement a "form element" as an [**UNcontrolled**](https://github.com/HelpMe-Pls/react-design-patterns/blob/UNcontrolled-components-01/src/UncontrolledForm.js) element (i.e. using the DOM to save the form values).
-   Using the default `value` prop of the `<input>` element with `React.useState()` to implement a [**controlled** form](https://github.com/HelpMe-Pls/react-design-patterns/tree/Controlled-components-01/src) component.
-   The only benefit of a controlled component is that you can change its state/data programatically (i.e. to have its state/data being controlled from by its parent). Otherwise you don't need it to be controlled.
- **Uncontrolled** components are easier to use within their parents because they require less configuration. But they’re less flexible when you want to coordinate them together. **Controlled** components are maximally flexible, but they require the parent components to fully configure them with props.
- In practice, “controlled” and “uncontrolled” aren’t strict technical terms—each component usually has some mix of both local state and props. However, this is a useful way to talk about how components are designed and what capabilities they offer.
- When writing a component, consider which information in it should be controlled (via props), and which information should be uncontrolled (via state). But you can always change your mind and refactor later.

### Rendering Arrays
-   Whenever you're rendering an array of React elements, each one must have a unique `key` prop. [See what happens](http://react-fundamentals.netlify.app/isolated/final/07.extra-1.js) if we don't have it.
