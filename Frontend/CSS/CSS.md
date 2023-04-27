[[Box model]]
[[Flow layout]]
[[Positioning]]
[[Styled components]]
[[Responsive]]
[[Typography and Images]]
[[Animations]]
[[Utils]]

- We can put the CSS rules in whichever order we'd like (however, be mindful of [CSS specificity](https://www.w3schools.com/css/css_specificity.asp), especially on the pseudo classes); the only thing that matters is the [[Positioning |order of HTML elements]].
- Be careful when using the wildcard selector (`*`) because its declaration applies for every possible valid selector:
```html
<!--The "Warning" text color is `black` in this case, because the wildcard also sets the color `black` for the <strong> tag, which overrides the color `red` set in the <aside>
If we don't want that, we can change the wildcard selector to the `html` selector, so that the <strong> can inherit the overrided declaration from the <aside> -->

<style>
  * {
    --color-primary: black;
  }
  aside {
    --color-primary: red;
  }
  strong {
    color: var(--color-primary);
  }
</style>

<aside>
  <strong>Warning:</strong> alien invasion imminent.
</aside>
```

- Use the feature queries for progressive enhancement (i.e. creating a baseline experience in our standard CSS, then use the `@supports` at-rule to apply extra CSS rules, if the target browser recognizes it) if your project targets legacy browsers:
```css
.wrapper {
  display: flex;
}

/* If the target browser supports CSS Grid, apply these styles: */
@supports (display: grid) {
  .wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
```
---
## Terminology
```css
.code-snippet {
	padding: 32px;
	white-space: pre-wrap;
}

/*
`.code-snippet`: selector
`padding`: property
`32px`: value
`white-space: pre-wrap`: declaration
`.code-snippet {
	padding: 32px;
	white-space: pre-wrap;
}`: rule
*/
```
- We can set multiple selectors to have the same declarations by having a comma between them:
```css
nav, aside {
	flex: 1
}
```
- Pseudo-class goes right after the selector, like `:first-of-type` ,`:last-of-type`, `:hover`, `:active` and 
`:not(<complex-selector-list>)`
	- `:first-of-type` and `:last-of-type` only applied for _siblings_ **_within_** a container. Same for `:first-child` and `:last-child`.
- Pseudo-element (remember: `e2` for 2 colons) also goes right after the selector, like `::before`, `::placeholder`
	- `::before` and `::after` are really just secret spans, nothing more (i.e. they're visible but you can't select them like normal text)
	- We can style the placeholder text in a form input with `::placeholder`:
```css
input::placeholder {
  color: goldenrod;
}
```
- When combining pseudo-classes and pseudo-elements, the pseudo-classes come first:
```css
/* When chained, pseudo-element also works with just 1 colon: */
p:first-of-type:first-letter {
  font-size: 2rem;
  font-weight: bold;
}
```
- Classes are "more specific" than tags, so if there is a conflict between a class and a tag, the class wins. IDs, however, are more specific than classes.

## Combinators
- The comma `,` allows multiple selectors to have the same CSS rule.
- Having a  `space`  between 2 selectors creates a descendant selector. The descendant selector will apply to **_all_** descendants, no matter how deeply nested they are:
```css
/* ALL <a/> tags WITHIN the <nav/> will get this style*/
nav a {
  color: red;
  font-weight: bold;
}
```
- The  `>` between 2 selectors creates a children selector (i.e. its style only applies for the *first* level of its descendants)
- The  `+`  creates an *adjacent* sibling selector. The following example selects *the first* `<p>` element that are placed *immediately after* `<div>` elements:
```css
div + p {
  background-color: yellow;
}
```
- The  `~`  creates a general sibling selector (i.e. it selects all elements that are *next siblings* - all the siblings that come *after* - of a specified element)
- The `.` selects all left-side element with the right-side class name:
```css
/* Selects all <p> elements with class="hometown" */
p.hometown {  
	background-color: yellow;
}
```


## Colors
### Formats
#### HSL ([Highly recommend](https://www.joshwcomeau.com/css/color-formats/#hsl-4))
```css
.translucent-box {
    background: hsl(0deg 100% 50% / 0.5);
}

/*
- The value `hsl(0deg 100% 50% / 0.5)` follows the format: `hsl(hdeg s% l% / a)`. You can drop the `deg` unit and it'll automatically infer to `deg` 
- h: Hue, the pigment we want to use (based on the Hue color wheel)
- s: Saturation: garayscale: at 0%, there is no pigment in the color, and it's totally GRAY. At 100%, the color is as vibrant as possible.
- l: Lightness: 0%, the color is pitch black. At 100%, the color is pure white. At 50%, the color is as vibrant as possible.
- a: Alpha channel, optional, works like in RGB format
*/
```

#### RGB
```css
.random-btn {
  background-color: rgb(133 205 255 / 0.5);
}

/*
- The value `rgb(133 205 255 / 0.5)` follows the format: `rgb(r g b / a)`
- r, g and b are integers in the range of [0, 255] 
- a stands for "alpha channel" which is the "opacity", and has the rational value in range of [0, 1], with `0` is invisible and `1` is fully solid
- a value is optional
*/
```

#### Hex
- Similar to RGB value, only difference is it uses the 16-digit hexadecimal system
```css
.random-box {
    background: #12345690;
}
/*
- 12: r
- 34: g
- 56: b
- 90: a (optional)
*/
```

#### Named colors (aqua, azure, cyan, teal, black, red,...)



## Units and values
### Units
- For typography: use `rem`. For the best of both worlds of `px` and `rem`: use [CSS variables](https://www.joshwcomeau.com/css/surprising-truth-about-pixels-and-accessibility/#leveraging-css-variables-15).
- Use `em` when you want to scale an element proportionally to the base `font-size`:
```css
h2 {
/* We only need to update the `font-size` and the `margin-bottom` will scale accordingly */
	font-size: 2rem;  /* Or any other unit */
	margin-bottom: 2em
}
```
- For box model (padding-border-magin): use `px`, but consider `rem` if that property scales by font size.
- The `vh` unit always refers to the ***largest possible height*** (i.e. when the website's title bar is hidden/shrunken up). For `vw`: it refers to the viewport width _not counting the scrollbar_ (e.g. on **desktop**, the scrollbar usually takes up its own space, *within* the viewport). 
  > Therefore, it's better to use  `%`  unit for `width` / `height`
- `vmin` will refer to the _shorter dimension_, while `vmax` refers to the longer one. On a portrait phone, `50vmin` is equivalent to `50vw`, but on a landscape monitor, `50vmin` would be equal to `50vh`.
-  The `ch` unit is mostly used to set the `max-width` of the lines. `1ch` is equal to the width of the `0` character, at the current font size. Depending on your font, the `0` character might be significantly thinner or thicker than average.

### Values
- The `unset` value behaves like the `inherit` when the property is inherited and behaves like `initial` if the property is not inherited. 
- "Long-form" properties can overwrite the relevant value in shorthand properties ***only when*** the "long form" is declared _after_ the shorthand:
```css
/* This rule returns `padding: 40px 30px 0px 30px`*/
.some-element {
	padding: 0px 30px;
	padding-top: 40px
}

/* While this returns `padding: 0` */
.some-element {
	padding-top: 40px;
	padding: 0px
}
```


## Overflow
> [!important] 
> An element may have overflow, but the scroll container (maybe higher up in the hierarchy - not necessarily its direct parent) is only created where you define the `overflow` property.
- `overflow: auto` is the ideal behaviour when we know an element might overflow.
- `overflow: hidden` truncates anything that extends beyond the bounds of the container. Mostly used to avoid undesirable horizontal scrollbar. Be mindful of the children elements within a `overflow: hidden` container: if its children has `position: sticky`, then the `position: sticky` won't work.
	- Always add a comment when using this declaration.
	- Be careful: `overflow: hidden` is identical to `overflow: scroll`, _but with the scrollbars removed._ Consider `overflow: clip` or wrap your element within another container (with a `overflow: hidden`), 
	  if `overflow: hidden` on your current element is not behaving as you expected.
- A *scroll **container*** is created wherever we use the `overflow` property (e.g. `overflow: scroll`, `overflow: auto`, or `overflow: hidden`) _except for_ **_`overflow: clip`_**. 
	- When an element is contained by a scroll container, it's guaranteed to be stuck inside. It will never overflow beyond the 4 corners of the scroll container.
	- Scroll containers only scroll when there's overflow (i.e. when the _inner size_ exceeds the _outer size_). If an element doesn't have a constrained `height`, the container is free to grow or shrink as much as it wants (e.g. if we don't explicitly set something like `height: 400px`, we won't get an awkward scrollbar). 
- `white-space` is a property that lets us tweak how words and other inline/inline-block elements wrap.
	- By setting `white-space: no-wrap`, we instruct the container to never break lines.
	- Therefore, if you *intentionally* want horizontal scrolling, have `white-space: no-wrap` in tandem with `overflow: auto`
- Checkout overflow [[Typography and Images#Text overflow|in typography]].


## Visibility
- `visibility: hidden` is helpful to be able to "hold space open" for an element that will soon become visible. Edge case: It can be selectively undone by children. In this example: the "Second button" is visible eventhough its parent is hidden:
```css
section {
 visibility: hidden;
}

.button.two {
 visibility: visible;
}

<section>
 <button class="button one">
  First Button
 </button>
 <button class="button two">
  Second Button
 </button>
 <button class="button three">
  Third Button
 </button>
</section>
```
- `opacity: 0` is _not_ recommended for hiding an element. `opacity` is helpful when:
	- An item needs to be semi-visible 
	- An item's visibility needs to be animated, fading in and out
- A new HTML `inert` attribute allows us to indicate to screen-readers to ignore interactive content:
```html
<p inert aria-hidden="true">
	This paragraph contains <a href="/">a link</a>.
</p>
```
- A code snippet to *visually hide* an element but still have it available for screen readers:
```css
.visually-hidden { 
	position: absolute; 
	overflow: hidden; 
	clip: rect(0 0 0 0); 
	height: 1px; 
	width: 1px; 
	margin: -1px; 
	padding: 0; 
	border: 0; 
}
```

- Elements can be completely removed from the page by using `display: none` (e.g. a button which is set to `display: none` cannot be clicked or focused) The catch is it still takes memory for that element.


## Variables
- CSS variable only applies to CSS *values*. They are *inheritable* and evaluated _when they're used_, not when they're defined.

> When we attach a CSS variable to an element, it's only available to *that element **and its children***. If you want to apply only for that element and *NOT* its children, use [@property](https://developer.mozilla.org/en-US/docs/Web/CSS/@property) 

- Set default value with  `var`  function *second argument*:
```css
.btn {
  padding: var(--inner-spacing, 16px);
}
```

- Make good use of CSS variables (and `calc` - which allows us to mix units) if your breakpoints are updating the *same* props, or just any props that has its value *repeating* all over the place.

- CSS variables are _composable_:
```css
body {
  --pink-hue: 340deg;
  --blue-hue: 275deg;
  --intense: 100% 50%;
  
  --color-primary: hsl(
    var(--pink-hue)
    var(--intense)
  );
  --color-secondary: hsl(
    var(--blue-hue)
    var(--intense)
  );
}

strong {
  color: var(--color-primary);
}
a {
  color: var(--color-secondary);
}
```

### Custom properties
- Example:
```html
<!--Declare CSS variable as a custom property-->
<style>
	main {
	  font-size: 12em;
	  --favorite-food: red;
	}
</style>

<!--Only the `font-size: 12em` is applied-->
<main>
  <section>
    <a>Hello World</a>
  </section>
</main>
<!-------------------------------------------->

<!--Use the `var` function to access the custom prop's VALUE-->
<style>
	main {
	  font-size: 25em;
	  --favorite-food: red;
	}
	/*Now the <a> is huge and red*/
	a {
	  padding: 32px;
	  background-color: var(--favorite-food);
	}
</style>
```


## Filter
- Use the `filter` property to adjust [graphical effects](https://developer.mozilla.org/en-US/docs/Web/CSS/filter#try_it) on an element. Commonly used to adjust the rendering of images, backgrounds, and borders.
- We can apply multiple filters to the same element by space-separating them:
```css
.image {
  filter:
    brightness(120%)
    contrast(110%)
    grayscale(50%);
}
```
- The `hue-rotate()` filter function shifts the color of every pixel in the element to the defined angle:
```html
<style>
  span[role=img] {
    font-size: 2em;
  }
  .rotated {
    filter: hue-rotate(160deg);
  }
</style>

<p>
  <span
    role="img"
    aria-label="star"
  >
    ⭐
  </span>
  <span
    class="rotated"
    role="img"
    aria-label="star"
  >
    ⭐   <!--Rendered as a blue-ish star-->
  </span>
</p>
```

- Consider the `blur()` filter value instead of `opacity` for better concealing cosmetic effect. Be mindful that it's an expensive operation, even with hardware acceleration. Be sure to test your effect on low-end devices before shipping it.
	- Screen reader ignores the blurred element (i.e. the user won't have any idea that the content is meant to be concealed), and this can be a problem if the blurring serves a functional purpose (e.g. to make a spoiler alert).
	  For such cases, you'll need to use the `aria-hidden` attribute to hide the content from screen readers. You can remove the blur filter and the aria-hidden attribute at the same time (by using JS) for a consistent, parallel experience. 
- The `blur` filter will lead to a soft, blurred edge as default. If you'd prefer a sharper edge, you can add `overflow: hidden` to the parent container:
```html
<style>
  a {
    overflow: hidden; /* Crop the blurred edge */
    border-radius: 8px;
  }
img {
  display: block;
  width: 300px;
  filter:
    blur(6px)
    brightness(50%);
  transition: filter 800ms ease-in-out;
}
a:hover img,
a:focus img {
  filter:
    blur(0px)
    brightness(100%);
  transition: filter 300ms cubic-bezier(0.05, 0.66, 0.33, 1);
}
</style>

<a href="/">
  <img
    alt="A colourful busy street in Tokyo, Japan"
    src="/cfj-mats/akihabara.jpg"
  />
</a>
```
- Leveraging `blur()` for "glowing" effect by having a "blurred clone" with absolute positioning:
```html
<style>
  body {
    overflow: hidden;
  }
  .wrapper {
    position: relative;
  }
  .gradient {
    position: relative;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background-image: linear-gradient(
      deeppink,
      red,
      coral,
      gold,
      white
    );
  }
  .blurry {
    position: absolute;
    filter: blur(40px);
    transform: scale(1.3) translateX(10%) rotate(30deg);
  }
  .regular {
    filter: drop-shadow(0px 0px 25px hsl(0deg 0% 0% / 0.3));
  }
</style>

<div class="wrapper">
  <div class="gradient blurry"></div>
  <div class="gradient regular"></div>
</div>
```

- Use the `backdrop-filter` property to apply styles to the [the background](https://codesandbox.io/s/backdrop-filter-9i1ngf?file=/index.html) or a portion of an element. It can also take every value that `filter` takes:
```css
.header {
  backdrop-filter:
    brightness(150%)
    hue-rotate(30deg)
    blur(5px);
}
```


## Shadows
- Shadow gives an element a sense of lighting and depth.

### `box-shadow`
- `box-shadow` based on the box model and it's the most common way to apply shadows in CSS. When you apply `box-shadow` to an element, that element's box will cast a simulated shadow behind it with 6 values, respectively:
	- `inset`: an *optional* value which defaulted as not specified. Inset shadows are drawn inside the border (even transparent ones), above the background, but below content. They allow us to create the illusion that an element is _lower_ than its surrounding environment (e.g. the ["moat" effect](https://codesandbox.io/s/inset-moat-zf4wri?file=/index.html)) 
	- **Horizontal offset**
	- **Vertical offset**. You can change which side the shadow appears by tweaking the horizontal/vertical offsets.
	- **Blur radius**: the strength of the blurring effect
	- **Spread radius** (*optional*): increase or decrease the size of the shadow. Mostly used to create single-sided shadows. The reason shadows tend to spill out in all directions is because of the _blur_ radius. We can use the spread radius to offset this growth, so that the shadow stays small. Then, we can use offsets to choose which side it should show under. By default, spread is `0`, meaning that the shadow is the *same size* as the element. A spread of `2px` means that the shadow grows in every direction by `2px`, becoming `4px` wider and `4px` taller.
	- **Color**: don't use a named color because it produces a _very_ aggressive shadow. Use `hsl` format instead: 
```html
<style>
.card {
  width: 200px;
  max-width: 100%;
  background: white;
  border-radius: 4px;
  padding: 32px;

  box-shadow: 2px 4px 8px hsl(0deg 0% 0% / 0.25);
}
</style>

<article class="card">
  <h2>Hello World</h2>
</article>
```

### `drop-shadow`
- `filter: drop-shadow()` takes the same arguments as `box-shadow`, without the `inset`, `<spread-radius>`, and the third argument specifies a “standard deviation” instead of a blur radius. It produces a softer, more-blended shadow by using the _Gaussian blurring_. This means that if we use `filter: drop-shadow()` on an image that supports transparency (e.g. png, gif, svg), the shadow will apply to the non-transparent parts of the image. This effect isn't limited to images, either—it works for any DOM node.
- When we apply `filter: drop-shadow()` to an element, it contours that element and [all of its descendants](https://codesandbox.io/s/drop-shadow-1otcu1?file=/index.html) (even non-contiguous ones, like the smaller circle!), and applies the shadow to that shape. We can even apply it to a [_group_ of elements](https://codesandbox.io/s/drop-shadow-group-t5nh3k), to make sure we don't have any "shadow overlap" (which happens if we used `box-shadow`)
- Make sure to test `drop-shadow` on Safari if your app supports it (browser's glitch). Opt for `box-shadow` instead, if the `drop-shadow` glitch happens too often.

### `text-shadow`
- `text-shadow` is a shadow that applies only to the typography within the selected element. Commonly used to increase the contrast between light-coloured text and a light background. Takes same values as `box-shadow`.


## Gradients
- s
- s
- ss


## Clipping
- s
- s
- s
- s


## Scrolling
- s
- s
- s


## Focus
- s
- s
- s
- s
- 