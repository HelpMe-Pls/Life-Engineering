# Media queries
- Rather than make completely different sites, we add CSS rules that only apply in certain cases, such as when the viewing device screen is in a specific size range. This is normally done using _media queries_, which allow us to _merge_ CSS rules together if the condition matches.
	- Not all CSS props have corresponding media features (e.g. `@media (font-size: 32px) {...}` is invalid).
	- Media queries aren't _just_ about screen sizes. For example, defining a "coarse pointer" for touch screens (i.e. if the user is using a mouse or other “fine” pointer, `--min-tap-height` will never be set), 
	  or `(hover: hover)` to explicitly apply the styles for devices which have the "hover" feature:
```jsx
const GlobalStyles = createGlobalStyle`
  @media (pointer: coarse) {
    html {
      --min-tap-height: 44px;
    }
  }
`;

//-------------------------
const Link = styled.a`
	text-decoration: none;
	color: inherit;
`

const Image = styled.img`
	display: block; /* To get rid of "magic" space */
	width: 100%;
	filter: brightness(90%);
	transform-origin: 50% 90%;
	transition: transform 690ms, filter 960ms;
	will-change: transform;

	@media (hover: hover) and (prefers-reduced-motion: no-preference) {
		${Link}:hover &,
      ${Link}:focus & {
			filter: brightness(100%);
			transform: scale(1.1);
			transition: transform 250ms, filter 450ms;
		}
	}
```

  > It's also important to note that **media queries DON'T affect specificity**.
  
```css
/*
Notice that the button ALWAYS has pink text. 
When the viewport is `400px` or smaller, `.signup-button` becomes:
  .signup-button {
    color: deeppink;
    font-size: 2rem;
  }
*/
  .signup-button {
    color: deeppink;
    font-size: 1rem;
  }
  
  @media (max-width: 400px) {
    .signup-button {
      font-size: 2rem;
    }
  }

/*
Notice that media queries DON'T affect specificity.
When we flip their order, `font-size: 1rem` and the pink text are ALWAYS applied because they come later in order.
*/
@media (max-width: 400px) {
  .signup-button {
    font-size: 2rem;
  }
}

.signup-button {
  color: deeppink;
  font-size: 1rem;
}
```

- Use `prefers-color-scheme` to style for [light/dark mode](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme).
- If you decide to build *mobile-first*, you should almost always use `min-width` media queries. It can be very confusing if you mix `min-width` and `max-width` media queries.

> **Highly recommend using `rem`  (or `em`) as media query unit in most situations** (so that the breakpoints are updated when the user changes their system/browser font size) . 

- If we want to specify that _any_ of the conditions can be met, we can use a comma:
```css
@media (max-width: 600px), (min-width: 800px) {
  /* styles */
}

/*Is the same as:*/
@media (max-width: 600px) {
  /* styles */
}
@media (min-width: 800px) {
  /* Repeated styles 
}
```

## Breakpoints
- A breakpoint is a specific ***VIEWPORT*** width (if you want to constrain specific layouts based on a *container's width*, use [[Responsive#Clamping values |the Fluid approach]] or flexbox) that lets us segment all devices into a small set of possible experiences. For example, we might set a breakpoint at `500px`. Any device *under*  `500px`  will be put in the same bucket, and can be styled separately. This ensures a consistent experience; someone on a  `375px`-wide phone will share the same layout as someone on a  `414px`-wide phone.
- Setting exlcusive range (with the `and` keyword) is *not* always ideal, and you should only use this approach if the requirements explicitly demands:
```scss
/* Tablet-only styles */
@media (min-width: 550px) and (max-width: 1099.99px) {
   .info {
    color: blue;
  }
}
```

> We should put our breakpoints in _dead zones_, as far away from “real-world” resolutions as possible. They should be in “no-device land”. This way, all similar devices will share the same layout.
> Keep your design in mind when picking breakpoint values.

- A mobile-first implementation might look like: 
```css
/* Default: Phones from 549px to 0px */

@media (min-width: 550px) {
  /* Tablets: from 550px and up */
}

@media (min-width: 1100px) {
  /* Laptop: from 1100px and up */
}

@media (min-width: 1500px) {
  /* Desktop: from 1500px and up */
}
```
# Container queries
- Container queries are like media queries, but instead of measuring the viewport, they measure an element’s container.
- In order to use a container query, we first need to explicitly define its container (preferably with `container-type: inline-size` to overcome the extrinsic nature of `width` properties):
```html
<style>
  section {
    container-type: inline-size;
    background-color: peachpuff;
    border: 2px solid;
  }

  @container (max-width: 12rem) {
    p {
      font-weight: bold;
      color: red;
    }
  }
</style>

<section>
  <p>
    Yay, it works! The parent’s height will
    change dynamically to accommodate its
    content, and the container query still
    fires when the container is resized!
  </p>
</section>
```

> [!info] Address the multiple breakpoints fragility
Refer to [this lesson](https://courses.joshwcomeau.com/css-for-js/05-responsive-css/18.01-container-query-patterns) for a case where the use of container queries reduce the fragility of multiple breakpoints if we used media queries instead.

- We can also manually choose which container to use with the `container-name` property:
```html
<style>
  main {
    container: outer / inline-size;

    /* Equivalent to: 
    container-name: outer;
    container-type: inline-size; */*
  }
  section {
    container-name: inner;
    container-type: inline-size;
  }

  @container outer (min-width: 12rem) {
    .locked-to-main {
      color: red;
      font-weight: bold;
    }
  }
  @container inner (min-width: 12rem) {
    .locked-to-section {
      color: red;
      font-weight: bold;
    }
  }
</style>

<main>
  <section>
    <div class="locked-to-main">
      Locked to <i>main</i>
    </div>
    <div class="locked-to-section">
      Locked to <i>section</i>
    </div>
  </section>
</main>
```