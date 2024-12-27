- Reach out for libraries (instead of vanilla CSS) if your animations are:
	- Too complex or sophisticated to be done with CSS (e.g. 'crossfading' between DOM elements).
	- Very prominent/important, and you want to add extra polish to it with [spring physics](https://www.joshwcomeau.com/animation/a-friendly-introduction-to-spring-physics/).
- For React-specific libraries, use [React Spring](https://www.react-spring.dev/) or [Framer Motion](https://www.framer.com/motion/). Consider [gsap](https://greensock.com/gsap/) if you're not using React.
- Every animation we add should have a purpose behind it. We shouldn't add animation just to be fancy. Animation can make a product feel more polished, but only when it's thoughtful, and it's clear to the user *why* it exists (i.e. show the user how the application responds to input, whether that's clicking, hovering, scrolling...). The generally-acceptable range of durations is from **200ms to 500ms** for the transition/animation to feel natural. There are definitely exceptions, but 80%+ of the common animations fit within that range.

- One common gotcha with transforms is that ==they don't work with ***inline elements*** in Flow layout==. The easiest fix is to switch it to use `display: inline-block`, or to use a different layout mode (e.g. Flexbox or Grid):
```html
<style>
  .inline-fella {
    /* Doesn't work:*/
    transform: rotate(-10deg);

	/* Add this if you want the `transform` to take effect:
	display: inline-block;
	*/
  }
</style>

<p>
  Why
  <span class="inline-fella">Hello</span>
  there!
</p>
```

- Different CSS properties will trigger different steps in the pixel pipeline (i.e. affecting performance cost). For this reason, it's best to try and avoid animating any properties that affect layout, like `width`, `height`, `padding`, `margin`. Animating the `transform` and `opacity` properties takes the least amount of resource.
	- Not all repaints / layout-recalculations are created equal! For example, tweaking the `height` of an absolutely-positioned element tends to be quicker, since there's no chance that it will cause siblings to be shifted. The best thing you can do is to test your animations on a very low-end device. If you're satisfied with the performance on it, ship it!
	- Edge case when animating `transform` and `opacity`: the hand-off between CPU and GPU computing which may cause the animated element's content glitch and “snapping into place”. 
	  Fix that with the  `will-change: <transform | opacity>`  declaration by applying hardware acceleration. 
	  By delegating an element's rendering to the GPU, it'll consume more video memory, a resource that can be limited, especially on lower-end mobile devices. So be intentional about where you use it and be mindful of the devices which you app is targeting.
--- 

## Transform
- The `transform` property has some values to enable these common features:
	1. `translate()`: this function as a value receives 2 params for the horizontal axis and vertical axis, respectively. **Positive** values move *down and to the right*. Negative values move up and to the left.
	   If you want to move an element along a single axis, use either `translateX()` or `translateY()`.
	   The item's in-flow position *doesn't change* (i.e. the `transform` prop won't affect other elements around it, but there's a catch: it will overwrite the box model of that element if they're performing the same effect).
	   When we use a **percentage** value in `translate`, that ==percentage refers to _the element's **own size**_==, instead of the available space in the parent container.
	   Combine with the `calc()` function when you want to translate something by its own size _plus_ a few extra pixels: `transform: translateX(calc(30% + -69px));`
	2. `scale()`: allows us to grow or shrink the _entire element_ *and all of its descendants* in 2D. The function format is the same as `translate()`, but the params are *unitless* values that represents a _multiple_ (e.g.  `scale(2)` means that the element should be twice as big as it would normally be). To scale in 3D, use [`scale3d()`](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/scale3d) instead. 
	   Consider using with `overflow: hidden` to respect the element's boundaries so that it's not spilled to surrounding elements. 
	3. `rotate()`: takes only one param, most commonly used with the `deg` unit (e.g. `transform: rotate(-69deg)`). Another handy unit is `turn`, where `1turn` equals `360deg` (e.g. `transform: rotate(0.25turn)`). To rotate around the axis in 3D, use `rotate3d()` instead.
	4. `skew()`: creates a "slanted" looking effect for an element (as if you grabbed each corner of the element and pulled them along a certain angle). The function takes 2 params with the same unit as `rotate()`. 
	   **Positive** values move to the **right**. Negative values move to the left.
	   If you want to move an element along a single axis, use either `skewX()` or `skewY()`.
	   If there's just 1 param, then it's treated as `skewX()`.
- The `transform-origin` property sets a pivot point for the `transform()`. This is useful for certain kinds of effects (e.g. an element "[growing out of](https://codepen.io/anon/embed/pOVKjb?height=450&theme-id=1&slug-hash=pOVKjb&default-tab=result#result-box)" another one). When used with percentage values, it calculates the axis based on the left border and/or top border of the element (i.e. of the blue box which shows up when you select the element). For instance, `transform-origin: 50% 50%` is the same as `transform-origin: center`.
> [!important]
> When combining multiple values for the `transform` prop, they're applied from **right to left** in order (like composition in functional programming).


## Transition
- The `transition` shorthand property allows us to ***smooth out*** the layout changes in our application. Commonly used with ***two values***: the name of the property (`transition-property`) we wish to animate and the duration of the animation (`transition-duration`).
  If you plan on animating multiple properties, you can pass it a comma-separated list:
```css
.btn {
  transition: transform 250ms, opacity 400ms;   /* Not recommended: `all 690ms;` */
}

.btn:hover {
  transform: scale(1.2);
  opacity: 0;
}
```
> [!warning]-  The `all` value - not recommended
> When we use `transition` with the `all` value (`transition-property: all`), any CSS transformation will be executed. It's better to be specific, and avoid any unintended animations.
- The `transition-timing-function` property specifies the rate of the animation within a specific time frame (**not** how quickly the animation should complete). We can use it as a shorthand of the `transition` prop:
```css
.btn {
  /* Do this: */
  transition: transform 250ms;
  transition-timing-function: linear;

  /* Or this: */
  transition: transform 250ms linear;
}
```
- You can have a customized `transition-timing-function` value [by using](https://courses.joshwcomeau.com/css-for-js/treasure-trove/011-cubic-bezier) the `cubic-bezier` function. Some of the common built-in, ready to use values are:
	1. `ease` (default value): features a brief ramp-up, and _lots_ of deceleration. If you don't specify a timing function, `ease` is implicitly applied.
	2. `ease-out`: fast entering and then slow end. Most commonly used when something is entering from off-screen (e.g. a modal ***appearing***). It produces the effect that something came hustling in from far away, and settles in front of the user.
	3. `ease-in`: starts slow then speeds up. Pretty much exclusively useful for animations that end with the element *offscreen or invisible*. It can be worthwhile to combine `ease-in` and `ease-out` when something enters and exits the viewport (e.g. a pop-up animation).
	4. `ease-in-out`: the combination of the aboves (i.e. _symmetrically_ slow start and end). Most useful for anything that happens *in a loop* (e.g. an element fading in and out, over and over).
- The `transition-delay` prop allows us to keep things status-quo for a brief interval before the `transition-property` takes effect. `0s` is the default value (i.e. if this property is *not* specified). It is the second [`<time>`](https://developer.mozilla.org/en-US/docs/Web/CSS/time) value if we use the `transition` shorthand (*not* recommended):
```css
.btn {
  /* Prefer this approach: */
  transition: opacity 690ms ease-in;
  transition-delay: 300ms;  /* Wait 300ms then fade out the .btn */

  /* Over this: */
  transition: opacity 690ms ease-in 300ms;
}

.btn:hover {
  opacity: 0;
}
```
> [!important] Beware of flickering effect
>  Apply the `transition-property` on the [element's content](https://codesandbox.io/s/transition-flickering-f78l2m?file=/index.html) (i.e. listen for the effect on the parent, but apply the transformation to the desired child element)

### The `transitionEnd` event
- Instead of fiddling with delays, we instruct one animation to start the moment another one ends. This can clean up our code, and make it easier to reason about the relationship between elements:
```js
element.addEventListener('onTransitionEnd', () => {
  // Whenever a transition completes on the target element,
  // this function will be called.
});
```
- The drawback is that it's less flexible. You don't always want to wait for one element to stop moving before another one starts.

## Keyframes and `animation`
- We can specify a transition from one set of CSS declarations to another using the `@keyframes` at-rule. Useful when an animation needs to run immediately when the page loads or the component mounts.
- On the other hand, reach for `transition` when your CSS will change as a result of some application state or user action (i.e. use `transition` when you want to smooth out an otherwise harsh transition between values).
- Keyframe animations are meant to be general and reusable. We can apply multiple properties to specific selectors with the `animation` property:
```css
  @keyframes drop-in {
    from {
      transform:
        rotate(-30deg) translateY(-100%);
      opacity: 0;
    }
    to {
      transform:
        rotate(0deg) translateY(0%);
      opacity: 1;
    }
  }

  .box {
    animation: drop-in 1000ms;
  }
```

- Similar to `transition-timing-function`, we have `animation-timing-function` for the `animation`. We can also specify the looping effect of the animation with the `animation-iteration-count` property, which takes a number representing the number of times the animation will repeat (with `1` as default), e.g. `0.5` will play half of the animation cycle; or the `infinite` value mostly used for the loading spinner:
```css
  @keyframes loading {
    from {
      transform: rotate(0turn);
    }
    to {
      transform: rotate(1turn);
    }
  }

/* Prefer this approach: */
  .box {
    animation: loading 1000ms;
    animation-timing-function: ease-in;
    animation-iteration-count: infinite;
  }

/* Over this: */
  .box {
    animation: loading 1000ms ease-in infinite;
  }
```

- The `from` and `to` keywords are just syntactic sugar for the progress through the animation (i.e. `from` is `0%` and `to` is `100%`). We can explicitly set the progress with their corresponding animation:
```css
  @keyframes grow-and-shrink {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(1);
    }
  }

  .box {
    animation: grow-and-shrink 4000ms;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
  }
```
> [!important]
> Importantly, _the timing function applies to **each** step_. We don't get a single `animation-timing-function` for the entire animation. To [flexibly](https://css-tricks.com/css-animations-vs-web-animations-api/) apply it for each step **or** the entire animation, consider [Web Animations API](https://motion.dev/). 

- The `animation-direction` property controls the order of the keyframes. It takes the following values:
	1. `normal` (default value): going from `0%` to `100%` chronologically
	2. `reverse`: it is what it is, the reverse of `normal`
	3. `alternate`: mirroring between `normal` and `reverse` on subsequent iterations 
	   for *the entire* `animation-duration`. Highly recommend using it with `ease-in-out`.

- Prefer extracting the `animation-delay` to a separate declaration if you decided to use the `animation` shorthand (i.e. the `animation-delay` is always interpreted ***after*** `animation-duration` when we're using it in the shorthand):
```css
.box {
/* animation: <animation-name> <animation-duration> <animation-timing-function> <animation-iteration-count> <animation-direction> */
  animation: grow-and-shrink 2000ms ease-in-out infinite alternate;
  animation-delay: 500ms;
}
```

### Fill modes
- The `animation-fill-mode` property sets how a CSS animation applies styles to its target before and/or after its execution. If it's not specified, the `none` value is applied:
	1. `forwards`: persists the declarations in the `to` block ***after*** the animation is finished.
	2. `backwards`: applies the declarations in the `from` block to the element ASAP, ***before*** the animation has started.
	3. `both`: it is what it is, the combination of `forwards` and `backwards`. This is most likely what you want.
- Obviously, we can use it in the shorthand:
```css
.box {
  animation: slide-in 1000ms ease-out both;
  animation-delay: 500ms;
}
```

### Pausing animations
- Use JS to toggle the `animation-play-state` with `running` or `paused` value:
```jsx
function App() {
  const [
    animated,
    setAnimated
  ] = React.useState(false);
  
  return (
    <Wrapper>
      <Box
        style={{
          animationPlayState: animated
            ? 'running'
            : 'paused',
        }}
      />
      <button
        onClick={() => {
          setAnimated(!animated);
        }}
      >
        {animated
          ? 'Pause animation'
          : 'Start animation'
        }
      </button>
    </Wrapper>
  );
}
```
#### Conditionally trigger the animation
- For example, after the user has visited the site and seen the animtion a couple times (and the animation takes quite a while to execute), we can use JS to stop showing it (or vice versa):
```jsx
const getNumberOfVisits = () => {
  if (typeof window === 'undefined') {
    return 0;
  }

  let numOfVisits = window.localStorage.getItem('num-of-visits');

  if (numOfVisits === undefined || numOfVisits === null) {
    numOfVisits = 0;
  }

  return Number(numOfVisits);
};

const markVisit = () => {
  const numOfVisits = getNumberOfVisits();

  window.localStorage.setItem('num-of-visits', numOfVisits + 1);
};

function useTimeout(callback, delay) {
  const timeoutRef = React.useRef(null);
  const savedCallback = React.useRef(callback);
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  React.useEffect(() => {
    const tick = () => savedCallback.current();
    if (typeof delay === 'number') {
      timeoutRef.current = window.setTimeout(tick, delay);
      return () => window.clearTimeout(timeoutRef.current);
    }
  }, [delay]);
  return timeoutRef;
};

function App() {
  const [hasTimeElapsed, setHasTimeElapsed] = React.useState(false);
  const [hasLoadedComponent, setHasLoadedComponent] = React.useState(false);
  const lazyComponent = React.useRef(null);

  // On mount, start async-loading the main component.
  // Depending on your tool, this might look different (eg. in
  // Next, you can use the next/dynamic package).
  React.useEffect(() => {
    import('../../components/Something').then(Component => {
      lazyComponent.current = Component.default;
      setHasLoadedComponent(true);
    });
  }, []);

  const numOfVisits = getNumberOfVisits();
  const amountOfTimeToWait = numOfVisits > 3 ? 1 : 4000;

  // `useTimeout` is a React-friendly hook that uses `setTimeout`
  // See link under this snippet for the code
  useTimeout(() => {
    setHasTimeElapsed(true);
    markNewVisit();
  }, amountOfTimeToWait);

  const showLoading = !hasTimeElapsed || !hasLoadedComponent;

  if (showLoading) {
    return <FancySpinner />;
  }

  const Component = lazyComponent.current;
  return <Component />;
}
```

### CSS variables
- Any CSS variables available to the selector where the animation is applied, is also accessible within the `keyframes` that defines the animation:
```css
@keyframes slide-in {
  from {
    transform: translateY(
      calc(100% + var(--spacing))
    );
  }
  to {
    transform: translateY(0%);
  }
}
.help-circle {
  --spacing: 32px;
  position: fixed;
  bottom: var(--spacing);
  right: var(--spacing);
  animation: slide-in 500ms backwards;
  animation-delay: 1000ms;
}
```


## Accessibility
- Animations can be quite triggering for folks with mental/visual disorders. If your app considers those audience, a good mental model is to start **without animations**, and enable them if the user wishes, by using the `prefers-reduced-motion` media feature:
```css
.fancy-box {
  width: 100px;
  height: 100px;
  transform: scale(1);
  /* No more `transition` here! */
}

.fancy-box:hover {
  transform: scale(1.2);
}

/* we ensure that the animation is DISABLED by default for users on browsers/devices that don't support this property, or if the user prefers reduced motion (has enabled the "reduce motion" feature in their OS) */
@media (prefers-reduced-motion: no-preference) {
  .fancy-box {
    transition: transform 300ms;
  }
}
```

- A more generalized way to disable/enable animations is to use JS:
```js
function getPrefersReducedMotion() {
  const mediaQueryList = window.matchMedia(
    '(prefers-reduced-motion: no-preference)'
  );
  const prefersReducedMotion = !mediaQueryList.matches;
// This function will return `true` if the user prefers reduced motion.
// If it returns `false`, it means the user has no preference, and we should enable our animations.
  return prefersReducedMotion;
}


// We can also use event listeners to update this value when it changes:
const mediaQueryList = window.matchMedia(
  '(prefers-reduced-motion: no-preference)'
);
const listener = (event) => {
  const getPrefersReducedMotion = getPrefersReducedMotion();
};

// We want to listen for this event, because we want to immediately terminate animations if the user chooses to, even if the page has already loaded / the animation is in progress.
mediaQueryList.addListener(listener);

// Later:
mediaQueryList.removeListener(listener);
```


## In 3D space
- The value we pass to `perspective` can be thought of as a measure of how close/far away the user is to the screen (the smaller, the closer). We can choose a `perspective` value based on how attention-grabbing we want our animation to be: If the user is _right next_ to the screen, small changes in position will appear **huge**. Imagine spinning a card that's only a few inches from your face. If the user is further away, though, that same motion will appear smaller and more subtle.
- Note that the `perspective` property needs to be set **on the parent element**. It's kind of like `display: grid`; we set `perspective` to control how the _children_ will be presented.
- If you want to set perspective on the target element, use the `perspective()` function:
```html
<style>
/* Either this: */
  .container {
    perspective: 69px;
  }
  .box {
    transform: rotateX(96deg);
  }
/* Or this: */
  .box {
    transform: perspective(69px) rotateY(96deg);
  }
</style>

<div class="container">
  <div class="box"></div>
  <div class="box"></div>
  <div class="box"></div>
</div>
```
#### 3D rendering context
- 3D animations can sometimes overlap on each other because of the element's DOM order. To get them behave as expected in 3D space, apply the `transform-style: preserve-3d` declaration on their ***wrapper*** element: 
```html
<style>
  @keyframes do-some {...}
  
  .wrapper {
    perspective: 500px;
    transform-style: preserve-3d;
  }
  .red-box {
    transform: rotateX(45deg);
  }
  .yellow-circle {
    animation: do-some 2000ms ease-in-out infinite alternate;
  }
</style>

<div class="wrapper">
  <div class="red-box"></div>
  <div class="yellow-circle"></div>
</div>
```
- **Be careful**: the `transform-style` property is _**not** inheritable_. It creates a 3D rendering context, but only _**direct** children_ can participate in this context by default. So if you want to create an inherited `transform-style`,
   **re-declare** it all the way to the closest parent of your target element (i.e. `transform-style: preserve-3d` acts as a sort of bridge, allowing descendants to participate in an ancestor's 3D rendering context. We can repeat this trick as many times as we wish; as long as each layer sets `transform-style: preserve-3d | inherit`, the 3D rendering context will be chained along):
```html
<style>
.wrapper {
  perspective: 500px;
  transform-style: preserve-3d;
}
.card-link {
  display: block;
  /* 👇 This is the key change: */
  transform-style: inherit; /* Instead of declaring `transform-style: preserve-3d` on the child, we can also use the special `inherit` keyword */
}

/* Child to be transformed: */
.card {
  transform-origin: top center;
  will-change: transform;
  transform: rotateX(0deg);
  transition: transform 750ms;
}

/*
  Apply the transforms to the `.card` child
  when we hover/focus the wrapper to fix the flickering effect:
*/
.card-link:hover .card,
.card-link:focus .card {
  transform: rotateX(-35deg);
  transition: transform 250ms;
}
</style>

<div class="wrapper">
  <a href="/" class="card-link">
    <article class="card">
      <img
        src="/images/logos/chrome.svg"
      />
    </article>
  </a>
  <a href="/" class="card-link">
    <article class="card">
      <img
        src="/images/logos/firefox.svg"
      />
    </article>
  </a>
```
- `perspective` isn't inheritable either, but since it applies directly to the 3D rendering context, as long as our descendants have access to the desired 3D rendering context, the perspective will be implicitly applied.
- Keep in mind: there are a [some](https://css-tricks.com/things-watch-working-css-3d/#aa-1-overflow) CSS properties that, when applied to the same element, will *disable* the 3D rendering context. 