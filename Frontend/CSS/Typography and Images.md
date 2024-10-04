# Typography
- On the web, underlines carry a very specific meaning: they tend to be links.
- CSS allows us to change the cosmetic presentation of text, but it doesn't affect the semantic meaning of the markup (semantics are important because not everyone can see the cosmetic styles). 
  For that, we need to use specialized HTML tags, e.g. using the HTML `<em>` tag instead of `font-style: italic` takes accessibility into account (for screen reader)
- The `line-height` property only takes a *unitless number*. This number is multiplied by the element's font-size to calculate the actual line height.
- Most of the properties that inherit are typography-related, like `color`, `font-size`, `text-shadow`, and so on.

## Text rendering
- **Kerning** **algorithms** refer to the spacing between individual characters. Characters are nudged left or right (in direction) so that they "feel right". The letter placement is slightly different between browsers is that the browsers implement different kerning algorithms.
- We can access the "kerning" with CSS by using `font-kerning`  and/or  `letter-spacing` property.
- The `-webkit-font-smoothing` property (**for MacOS only**) controls the *smoothness* of the font.
- We can tweak the formatting of our text using the `text-transform` property (with the values like `capitalize`, `uppercase`, `lowercase`)
- Specify text selection options with the `user-select` property:
```css
.selectable {
  user-select: none; /* Disable text selection */
  /* Other values are `text`, `all`, `auto` (the default) */ 
}
```

## Text overflow
- A regular "white space" (created by pressing the `Space` button) or a dash (`-`) creates an opportunity for line-break a word when it's at the end of a line.
- If you want to line-break 2 (or more) words (i.e. the whole phrase will jump to the next line without breaking up in between), use the  `&nbsp;` HTML entity. For example, the *whole* phrase 
  "don't`&nbsp;`break`&nbsp;`me" (rendered as `don't break me`) will be force into the next line if it reaches the end of line (just like how you see it right now).
- Use `overflow-wrap: break-word` if you *intentionally* want to line-break a long word (or a really long URL which isn't fitting on the same line). Use this declaration in tandem with `hyphens: auto` to have a hyphen (`-`) where the long word is broken.

### Overflow with ellipsis
- Ellipses are also useful when showing previews/abstracts. If the user isn't already familiar with the values, or the text can't be expanded to view the full thing, we should pick an alternative solution that doesn't conceal the text (e.g. the text overflow options).
- If you want to show ellipsis for a long word at the end of a line (instead of line-breaking it), use `text-overflow: ellipsis;` in tandem with `overflow: hidden` (consider `white-space: nowrap;`  if it's just for ONE line)
- If you want a paragraph to have an ellipsis at the end:
```css
p {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3; /* Applies the ellipsis at the end of the third line */
    overflow: hidden;
    /* Other declarations */
}
```
- Be mindful of flex layout when applying multi-line ellipsis: always apply line clamping to a paragraph that ***isn't*** being stretched or flexed *as part of flexbox or CSS Grid*. We can solve for this by using a `div` wrapper:
```html
<style>
.row {
  display: flex;
}
.clamped {
  -webkit-line-clamp: 8;
  /* Other declarations omitted for brevity */
}
</style>

<article class="row">
  <!-- Wrap the "clamped" `p` with this `div` to make sure the ellipsis works as intended -->
	<div>
	    <p class="clamped">Imagine this is a 9 lines++ paragraph.</p>
	</div>
</article>
```

## Print-style layout
### Columns
- It automatically split content across multiple columns, in a manner that allows the parent container to grow and shrink accordingly.
- It can even split a paragraph across multiple columns (use `break-inside: avoid` if you don't want that):
```html
<style>
.wrapper {
  columns: 3;
  column-gap: 16px;
  padding: 16px;
}

p {
  margin-bottom: 16px;
  /* Use this declaration if you want a particular child isn't broken across columns 
  break-inside: avoid;
  */
}
</style>

<main class="wrapper">
  <p>Imagine there's a very long paragraph here.</p>
  <p>Imagine there's a very long paragraph here.</p>  
  <p>Imagine there's a very long paragraph here.</p>  
  <p>Imagine there's a very long paragraph here.</p>  
  <p>Imagine there's a very long paragraph here.</p>
  <p>Imagine there's a very long paragraph here.</p>
</main>
```
- Use this approach to roughly implement a [masonry layout](https://courses.joshwcomeau.com/css-for-js/06-typography-and-media/05-masonry-layout). Consider [Masonry.js](https://masonry.desandro.com/) if you want to properly get it done.

### Floats
- The `float` property allows text to "wrap around" ***any*** [replaced element](https://developer.mozilla.org/en-US/docs/Web/CSS/Replaced_element#replaced_elements) or embedded element  (e.g. a `p:first-of-type:first-letter`) 
- Floated items don't come with any default margin. You should consider adding `margin` on the embedded element so it doesn't feel too claustrophobic:
```html
<style>
  img {
    float: left; /*or `right`*/
    margin-right: 16px;
  }
</style>

<p>Imagine there's a very long paragraph here.</p>
<img src="/cfj-mats/some-random-img.jpg" />
<p>Imagine there's a very long paragraph here.</p>
<p>Imagine there's a very long paragraph here.</p>
```
- If an element contains only floated elements, its height collapses to nothing. If you want it to always be able to resize, so that it contains floating elements inside it, set the value of the container's `display` property to `flow-root`:
```css
#container {
  display: flow-root;
}
```
- If a floated element is *taller* than the containing element, it will "overflow" outside of its container. We can [fix](https://www.w3schools.com/Css/tryit.asp?filename=trycss_layout_clearfix2) this with:
```css
.clearfix::after {
  content: "";
  clear: both;
  display: table;
}
```

### Indentation
- Use `text-indent` property to set the indentation for the first line of each paragraph.
- The pseudo element `::first-letter` is more useful for certain typographical effects, like "drop caps" (a larger first letter, typically on the first paragraph in a page/chapter):
```html
<style>
/* Use this: */
p {
  text-indent: 2rem;
  max-width: 500px;
  margin: 0 auto;
}

/* Or this, if you want fancier styling: 
p::first-letter {
  margin-left: 2rem;
  font-size: 1.5rem
}
p {
  max-width: 500px;
  margin: 0 auto;
}
*/
</style>

<p>Imagine there's a very long paragraph here.</p>  
<p>Imagine there's a very long paragraph here.</p>
<p>Imagine there's a very long paragraph here.</p>
```
- To preserve the "white-space" as indentation and render paragraphs which are separated by "white-space", use the `white-space: pre-wrap` declaration. 

### Text alignment
- The `text-align` property controls the horizontal distribution of the characters.
- The declaration `text-align: justify;` sets the spacing between each word is tweaked so that each line is properly stretched to fill the available horizontal space:
```html
<style>
  p {
    text-align: justify;
    text-indent: 2rem;
    padding: 16px;
  }
</style>

<p>Imagine there's a very long paragraph here.</p>
```
- `text-align: center` moves all of the individual characters to the *middle* of each line, the way you'd expect text centering to work in MSWord. Consider flexbox centering if you want to center the layout of the block of text.


## Font
- The `font-family` property is how we change the font for a given element (and its children). It's usually given multiple comma-separated values:
```css
/* The values (i.e. "font stack") is usually a list of fonts we'd like to use, in priority order. Ideally, it'll pick the first one, but if it's not available, it can use the next ones.
- The values' format is made up of: a <family-name> and/or a <generic-name> value.
- <family-name> is like the font's category (e.g. Arial, Times New Roman, Consolas,...)
- <generic-name> is like the style of a font (e.g. serif, sans-serif, monospace,...)
- If there are both <family-name> and <generic-name>, then <generic-name> always comes last.
- <family-name> that are Web Font, containing digits, or punctuation characters other than hyphens should be quoted.
*/
.title {
  font-family: 'Times New Roman', 'Open Sans', Futura, Helvetica, Arial, sans-serif;
}
```
- Highly recommend: use CSS variables to set a font stack:
```css
html {
  --font-sans-serif:
    -apple-system, BlinkMacSystemFont, 'avenir next', avenir, 'segoe ui',
    'helvetica neue', helvetica, Ubuntu, roboto, noto, arial, sans-serif;
  --font-serif:
    'Iowan Old Style', 'Apple Garamond', Baskerville, 'Times New Roman',
    'Droid Serif', Times, 'Source Serif Pro', 'Apple Color Emoji',
    'Segoe UI Emoji', 'Segoe UI Symbol', serif;

  /* Set a global default */
  font-family: var(--font-sans-serif);
}

/* Apply different fonts as needed */
p {
  font-family: var(--font-serif);
}
```

### Web fonts and custom fonts
- If we want to use a font that doesn't come pre-installed on the user's device, we can download and use a custom font. For example, use "Google Fonts":
```html
<!--Drop this in the <head> of your HTML file-->
<link rel="preconnect" href="https://fonts.gstatic.com">
<link
  href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@1,400;1,600&display=swap"
  rel="stylesheet">

<!--Then we access that font in our CSS-->
<style>
.random-paragraph {
  font-family: 'Open Sans', sans-serif;
}
</style>

```
- Use the [`@font-face`](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face) at-rule if you want to use your own custom font. Or, you can download the web fonts and [use them as static files](https://courses.joshwcomeau.com/css-for-js/06-typography-and-media/10-font-optimization) (as a value of `src`) to optimize the package size for your character sets. 
- Use the `font-display` property (within the `@font-face`) to control how a custom font should be rendered *before* it's available. Consider the `fallback` value which prioritizes a smooth UX to avoid jarring layout shifts because of flipping between fonts.
- Use the "[f-mods](https://screenspan.net/fallback)" to ease off our fallback font [to match](https://simonhearne.com/2021/layout-shifts-webfonts/#reduce-layout-shift-with-f-mods) the desired web font, for a much-less-jarring swap.
- Use *variable fonts* to access the range of all font variants:
```html
<!-- In the `href` attribute:
`ital` means italic, `wght` means "font-weight"
`@0,100..900;1,100..900` means when the font is non-italic (0), the font-weight ranges from 100 to 900 inclusive. Same for italic (1).
-->
<link rel="preconnect" href="https://fonts.gstatic.com">
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap"
>
```
- When using `@font-face` for highly customizable variable fonts (e.g. fonts with custom axis), we'll have to support different formats (`woff2 supports variations` and `woff2-variations`) and the `font-weight` range. Then, use either the `font-variation-settings` prop (or its equivalent props) to tweak the variable font features:
```css
@font-face {
  font-family: 'Recursive';
  src:
    url('/fonts/recursive-variable.woff2') format('woff2 supports variations'),
    url('/fonts/recursive-variable.woff2') format('woff2-variations');
  font-weight: 300 1000;  /* applies for all font weight in the range [300, 1000] */
  font-display: fallback;
}

/* Then use it like: */
.random-paragraph {
	font-weight: 696;
	/* Use either this (if you want to customize non-standard font features - the "custom axis") */
	font-variation-settings:
	    "wght" 725,
	    "wdth" 125,
	    "slnt" -10;
	    "MONO" 0.69;  /*custom axis*/
	    "CRSV" 1;     /*custom axis*/
	/*Or these "standard built-in properties":   
	font-weight: 725;
	font-stretch: 125%;
	font-style: oblique -10deg;
	*/
}
```


## Icon (SVG)
- The most popular icon format is `svg`. One of the neat things about SVG is that they can grow/shrink to any size without loss of quality. You can use it inline as a HTML tag (i.e. inline SVG), or use it like any other image format (e.g. `<img src="/circle.svg" />`):
```html
<html>
<body>
  <h1>Hello World</h1>
  <div class="icon-wrapper">
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
<!--- 
Basic coloring can be done by setting two attributes on the node: `fill` and `stroke`. 
`fill` sets the color inside the object and `stroke` sets the color of the line drawn around the object.
-->	     
		<circle cx="50" cy="50" r="40" stroke="black" fill="pink" />
    </svg>
  </div>
</body>
</html>
```
```css
/* This will change the <circle/> from "pink" to "green" */
.icon-wrapper circle {
  fill: green;
}
```
- To convert SVG icons to React components, use [the online tool](https://svg2jsx.com). Or, use an npm package (`react-feather`) if you want to quicky use an icon as a component.
- Consider having a "[[CSS#Visibility |visually hidden]]" element when you use an icon (because screen readers cannot interpret icons)

>[!important]
>Be mindful that SVG elements have a default value of `display: inline`, which can cause some unexpected spacing around it. Fix it by adding a `line-height: 0` or `display: block` using a descendant selector:
```jsx
import { Home } from 'react-feather';

function Header() {
  return <Button><Home /></Button>
}

const Button = styled.button`
  padding: 0;
  /* Use either this: */
  line-height: 0
  
  /* Or this: 
  & > svg {
    display: block;
  }
  */
`

render(<Header />)
```
---
# Images
- The goal with alternative text (the `alt` attribute in the `<img/>` tag) should be to convey the _semantic meaning_ of the image to the user. Alt text should _not_ include additional contextual information, consider using the `<figcaption>` tag instead:
```html
<!-- Instead of this -->
<img
  src="/landscape.jpg"
  alt="Painting of a beautiful landscape. Artist: C. Essess"
/>

<!-- Do this-->
<figure>
  <img
    src="/landscape.jpg"
    alt="Painting of a beautiful landscape."
  />
  <figcaption>
    Artist: C. Essess
  </figcaption>
</figure>
```
> [!tip]
> It's important to use an `img` tag for semantically-meaningful images, because `background-image` can't be given alt text.


## Positioning 
- The `object-fit` property sets how ***the content*** of a replaced element (not just `<img>`) should be resized (or cropped) to fit its container. It takes the following values:
	- `fill` (**default value**): the *entire* content will be scaled to ==*fully* contained inside== the element (i.e. If the *entire* content aspect ratio does not match the aspect ratio of its box, then it will be ==*stretched* to fit==, leading to distorted looking image)
	- `contain`: the *entire* content is made to fit within the box (`width` or/and `height`), while ==*preserving* content's aspect ratio== (which may leave empty space - vertically or horizontally - around the image).
	- `cover`: the *entire* content (while *preserving* its aspect ratio) is made to *fill* the box, but if the content's aspect ratio *does not* match the aspect ratio of its box, then the ==spilled portion will be *clipped*==.
	- `none`: it only takes whatever fits the container starting from the top-left corner of the full-sized content.
- The `object-position` property specifies *the offsets* of the content within its available space. It takes from 1 to 4 values that define the [2D position](https://developer.mozilla.org/en-US/docs/Web/CSS/position_value) of an element.
- The `vertical-align` property is used to *vertically* position an image [in a line of text](https://developer.mozilla.org/en-US/docs/Web/CSS/vertical-align#try_it).

## Responsive and proportion
- Images by default have a `min-width` of their intrinsic width.
- Different screen res needs different image res accordingly to properly display them. The `srcset` property is essentially a "plural" version of `src`. The browser will scan through the list of `srcset` and apply the first one that matches.
- Consider using the `<picture>` tag if you want to support *multiple* different image *formats*. It allows us to use modern image formats in a safe way, by providing backwards-compatibility for other browsers:
```html
<!-- the <picture> element behaves like a <span>, an inline wrapper that wraps around the <img> tag. We can use it to our advantage and treat an <img> as a Flex item
-->

<picture>
  <!-- The order matters: When the browser finds a match, it will download the image from the server and show it to the user. We want our smallest files (AVIF) to be on top -->
  <source
    type="image/avif"
    srcset="
      /cfj-mats/responsive-diamond.avif 1x,
      /cfj-mats/responsive-diamond@2x.avif 2x,
      /cfj-mats/responsive-diamond@3x.avif 3x
    "
  />
  <source
    type="image/webp"
    srcset="
      /cfj-mats/responsive-diamond.webp 1x,
      /cfj-mats/responsive-diamond@2x.webp 2x,
      /cfj-mats/responsive-diamond@3x.webp 3x
    "
  />
  <img
    alt=""
    src="/cfj-mats/responsive-diamond.png"
  />
</picture>
```
> [!FAQ]- What if I have to support many picture formats on many devices ?
If you're using a framework, try to leverage its API (e.g. `next/image` or `gatsby-image`) before going on your own with this approach. 

- Due to the nature of flex layout *stretches* its flex items on the cross aixs (which may cause a distortion for the content, especially if it's an image), it is highly recommended to ***wrap the image within a container*** (for example a `div`, or use the `<picture>` tag as above, after properly consider the context) when you want to apply flex layout for images - so that the `display: flex` will be applied on those containers to ensure the proper display of the images.

### Background images
- To keep things persistent, we'll need to provide different images for different devices, scaling up based on the pixel ratio. The equivalent of `srcset` for background images is to use media query with `min-resolution` 
  (or `-webkit-min-device-pixel-ratio` for Safari):
```html
<style>
  body {
    background-image: url('/cfj-mats/geometric-pattern.png');

    /* The `background-size` should match the width of the standard 1x image: */
    background-size: 450px;
  }
  
  @media
    (-webkit-min-device-pixel-ratio: 2),
    (min-resolution: 2dppx)
  {
    body {
      background-image: url('/cfj-mats/geometric-pattern@2x.png');
    }
  }
  
  @media
    (-webkit-min-device-pixel-ratio: 3),
    (min-resolution: 3dppx)
  {
    body {
      background-image: url('/cfj-mats/geometric-pattern@3x.png');
    }
  }
</style>

<main>
  <h1>Hello World</h1>
</main>
```
> [!important] Don't forget
> - Notice that we also need to specify a `background-size` in pixels; otherwise, our high-DPI images will render in their native size, producing much larger images without any additional clarity.
> - `background-size` also accepts keyword values (just like `object-fit`). Same for `background-position` (having same values as `object-position`)

- By default, a background image will be repeated side-by-side, top-to-bottom. In most cases, it means that the repeated pattern will be truncated at the bottom and on the right of its container. 
  The `background-repeat` property allows us to keep the background images from being cut off at the edge of its container by these common values:
	- `round`: preserves the aspect ratio and scales the image up or down, to avoid having the image cut off at the bottom or the right.
	- `space`: distributes gaps between the images.
- Use `linear-gradient` value [to generate](https://www.magicpattern.design/tools/css-backgrounds) background patterns without using an actual image.