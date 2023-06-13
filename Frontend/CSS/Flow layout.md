- There are two main element types in Flow layout:
	-   **Block elements:** things like headings, paragraphs, footers, asides. The chunks of content that make up a page.
	-   **Inline elements:** things like links, or a string of bold text. Generally, inline elements are meant to highlight bits of text, or elements within a block container.

- Each HTML tag has a default type. For example `<div>` and `<header>` are [block elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements#elements), `<span>` and `<a>` are [inline elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements#list_of_inline_elements).
- In the flow layout, the `display` properties takes several values: `block` for vertical layout and `inline` for horizontal:
```css
/* Transform a particular <a> tag from `inline` to `block`: */
a.nav-link {
	display: block;
}
```

- The browser treats inline elements as if they're typography. It makes sense that with text, you'd want a bit of *extra space*, so that the lines in a paragraph aren't crammed in too tightly. But when inline flow applied on replaced elements (which are block elements by default), that *extra space* becomes redundant. To fix that, add the `display: block` or `line-hight: 0` to the desired inline element.
- Elements that have `display: block` will stack in the **vertical** direction, regardless of their size.
- In Flow layout, background colors and borders are truly meant to be _in the background_. The content will float on top.
- Elements can be completely removed from the page by using `display: none` (e.g. a button which is set to `display: none` cannot be clicked or focused). The catch is it still takes memory for that element.
- You can shift things in the inline direction with `margin-left` and `margin-right`, since that pushes it around in the inline direction, but you can't give it a `width` or `height`.
- `inline-block` treats elements as **inline** _externally_ and **block** _internally_. So the term `inline-block` works outside-in. Properties like `width` and `margin-top` have no effect on an `inline` element, but they do work on `inline-block` elements. A big downside with `display: inline-block`: It disables line-wrapping.
---

## Margins
- Margin is meant to adjust the **distance** *between siblings*. It is ***not*** meant to increase the gap between a child and its parent's bounding box; that's what `padding` is for.
- If your app supports internationalization (or applies unconventional `writing-mode`, `direction`), then it makes sense to use logical properties (e.g. in Arabic writings: a right-to-left language, use `margin-block-start` instead of `margin-top`, `padding-inline-end` instead of `padding-left`).
- Setting top/bottom margin to `auto` is equivalent to setting it to `0px`.
- You can shift inline elements with `margin-left` and `margin-right`, since that pushes it around in the inline direction, but you can't give it a `width` or `height`.
- Margin collapse is _exclusive to **Flow layout**_. Only *vertical* margins collapse, the bigger margin wins when the 2 elements are **touching _vertically_** (i.e. nothing in between them, like a `<br/>` or a `border` acting as a wall between the 2 margins)
- Margin and Padding **_cannot_** overlap.
- `0px` margin is still a collapsible margin. Therefore, a child having `0px` margin is expected to also push its *parent* down if you increase the child's `margin-top`. If you want to increase the spacing _inside_ an element, `padding` is a better choice.
>  If you want to modify an element's position ***without*** affecting its surrounding elements, consider [[Positioning |relative positioning]] or [[Animations#Transform |Transform]].
- Use negative margin to revert/compensate `padding`:
```css
.wrapper {
/* We only need to tweak this variable to update the paddings and margins */
    --breathing-room: 16px;

    display: grid;
    grid-template-columns:
      1fr
      min(30ch, 100%)
      1fr;
    padding-left: var(--breathing-room);
    padding-right: var(--breathing-room);
  }
.wrapper > * {
    grid-column: 2;
}
.full-bleed {
    grid-column: 1 / -1;
    margin-left: calc(
      var(--breathing-room) * -1
    );
    margin-right: calc(
      var(--breathing-room) * -1
    );
}
```

## Border
- If we don't specify a `border-color`, it'll use the font's color by default.
- An `outline` is like an extra `border` (i.e. it's stacked outside border, and can sometimes be used as a "second border), or can be treated as a `border`. It doesn't affect layout but more like `box-shadow`, just a cosmetic effect draped over an element, without nudging it around, or changing its size.
- Outlines have a special `outline-offset` property. It allows you to add a bit of a gap between the element and its `border`.

### Radius
- Use [this tool](https://9elements.github.io/fancy-border-radius/) to have a quick visual of the values.
- The `border-radius` property is a shorthand for 4 distinct CSS properties, clockwise, and applied to the whole background, even if the element has no declared `border`: 
	- `border-top-left-radius`
	- `border-top-right-radius`
	- `border-bottom-right-radius`
	- `border-bottom-left-radius`
- Each of those properties accepts _two values_: the horizontal radius, and the vertical radius, respectively. Beware: with percentage values, the horizontal radius will be based on the `width`, and the vertical radius will be based on the `height`.
- The full shorthand takes 4 or 8 values:
```css
/* 4 values */
.box {
  /* These two declarations are equivalent: */
  border-radius: 10% 20% 30% 40%;
  border-radius: 10% 20% 30% 40% / 10% 20% 30% 40%; /* horizontal / vertical */
}

/* 8 values */
.box {
  /* These two declarations are equivalent: */
  border-radius: 100px;
  border-radius: 100px 100px 100px 100px / 100px 100px 100px 100px;
}
```
#### Nested radius
- If we had the same `border-radius` values for both parent and child elements, the distance between the outer corner and its corresponding inner corner will look uneven. To fix that, we need to make our pair of corners share the same center point (like tree rings) by taking into account the inner corner's circle radius with all of its `padding` or other spacing:
```css
/* Instead of this */
.card {
    border-radius: 16px;
    padding: 8px;
}
.avatar {
    border-radius: 16px;
}

/*------------------------*/
/* Do this: */
.card {
    --inner-radius: 16px;
    --padding: 8px;
    border-radius: calc(
      var(--inner-radius) + var(--padding)
    );
    padding: var(--padding);
}
.avatar {
    border-radius: var(--inner-radius);
}

/* Or this: */
.card {
    --outer-radius: 24px;
    --padding: 8px;
    border-radius: var(--outer-radius);
    padding: var(--padding);
}
.avatar {
    border-radius: calc(
      var(--outer-radius) - var(--padding)
    );
}
```
#### Circular radius
- A trick to have consistent symmetrical and circular corners a dynamic element's size is to use an [unrealistically large](https://courses.joshwcomeau.com/css-for-js/09-little-big-details/02.02-circular-radius) pixel value. The moment the two corners touch, when the combined radiuses exceed the element's height, the pixel value becomes hypothetical.


## Padding
- Negative values are *invalid*.
- Percentage value in `padding` always refer to `width`. For example, when we set `padding-bottom: 50%`, we're saying that the element's bottom padding should be half of its `width`, not its `height`.

## Width
- Measurement values (100%, 30vh, 5rem,...) and the `auto` keyword are _extrinsic_ (i.e. based on the **parent** element's *content space*).
- `min-content` and `max-content` are _intrinsic_ (i.e. based on the target element's content space - the size of the children). 
	- `max-content` doesn't fill the available space. An element with `width: max-content` pays no attention to the constraints set by the parent. It will size the element based purely on the length of its *unbroken* children. 
	- `min-content` makes the element to become as narrow as it can, _based on the child contents_. For example a `<h1>` with `width: min-content` chooses the smallest possible value for `width` that still contains each word, which will be the `width` of the longest word (because `<h1>` is a block-level element. If `min-content` was applied for a `<span>`, the `width` will just be the intrinsic `width` of the *entire* string, horizontally, and line-wrap as needed).  
- `fit-content` is like the combination of `min-content` and `max-content`. If that `width` can fit within the parent container, it behaves just like `max-content`: not adding any line-breaks. If the content is too wide to fit in the parent, however, it behaves just like `width: auto`: adds line-breaks as-needed to ensure it *never exceeds* the available space. 
- `width: auto` has a different meaning for [replaced element](https://developer.mozilla.org/en-US/docs/Web/CSS/Replaced_element#replaced_elements). It doesn't mean “stretch out and fill all of the space”, it means “use your natural width”. For most of the other elements, `width: auto` still means “automatically grow to fill *as much space as possible*”.
- `min-width: 100%`  to prevent horizontal overflow (so that it never grows above 100% of the available space). Also keep this on top of your head when you want to position your content in some kind of a container.

## Height
- The `height` of an element grows accordingly to its content (kinda like how `width: min-content` behaves). Setting an element to have a `height: 50%` will force that it to take up half of the *parent* element's content space. It's good practice to set `min-height: 100%` on the element and `height: 100%` on `html` and `body` selectors if you want the element to be fully visible.
- JavaScript frameworks like React will render our applications into a container element. In order for percentage-based heights to work, we need to add `height: 100%` to the wrapper.