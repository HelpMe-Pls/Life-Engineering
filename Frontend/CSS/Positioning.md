- Most of the time, when we want to *layer* elements, we'll want to use positioned layout.
- Positioned layout is created for an element when there's a `position` property in it 
  (except for `position: static`), and the directional properties (`top`/`bottom`/`left`/`right`) only works with positioned layout.
- When all siblings are rendered in [[Flow layout]], the DOM order controls how the background elements overlap, but the content will always float to the front.
- If one sibling uses positioned layout, it will appear above (on top of) its non-positioned (i.e. `position: static`) sibling, *no matter what the DOM order is*.
- If some of/all of the siblings use positioned layout (**_not_** `position: static`), the *DOM order controls* which element will be on top. Unlike in Flow layout, the content does not float to the front (i.e. the *whole* element is rendered on top).

> When there is a conflict between layout modes, **positioned layout always wins.**

- The `inset` property will set all 4 edge properties (`top`, `left`, `right`, and `bottom`) to the provided value:
```css
.box {
	inset: 25px;
}

/*Is the same as:*/
.box {
	top: 25px;
	left: 25px;
	right: 25px;
	bottom: 25px;
}
```

- An element with `left: -10px` has the same effect as `right: 10px`. Negative `position` value is [inclusive] while the positive is (exclusive).
- If you don't want your element's position to affect other elements around it: prefer the `position` property or [[Animations#Transform |Transform]], rather than using `margin`
> `margin` still WORKS for positioned elements.

- The `position` property it takes several values, most of which (except for `static`) work in combination with directional properties:
## Static
-  `position: static`: the default option (i.e. if a  `position` property is not specified). It's the Flow layout (i.e. the element is laid out according to its order in HTML and specifying directions won't work). Same thing for `position: initial`
## Relative
- `position: relative`: offset the location by some specified amount (e.g. an element with this declaration and `top: 10px` will be rendered `10px` *below* *from where it was* if it had `position: static`). Relative positioning can be applied to both block and inline elements. This allows us to nudge inline elements in a way that isn't really possible otherwise:
```css
/* Move all <strong> elements 4px upwards: */
strong {
 position: relative;
 top: -4px;
}
```
## Absolute
- `position: absolute`: stays on a *specified* location within the document (***relative*** to its *closest* containing/parent block), separated from the normal layout flow (i.e. every other elements that are **not relative** to the *absolutely positioned element* will render as if *it* didn't even exist). 
- For example: an element with this declaration *and* `left: 69px` will be rendered `69px` to the left *from its closest containing block* that has a `position` property (it doesn't matter how many parent elements are wrapping the child, it will ignore all of them until it finds a `position`). If there's no specified `position` of a containing block, it'll be positioned `69px` to the outermost left of the whole document (i.e. like a `position: fixed` element). 
- `margin: auto` with `position: absolute` applies for all 4 directions, not just horizontally like in the flow layout.
   
  > If we don't give our absolute element an anchor (i.e. a directional declaration (e.g. `left: 69px`)), **it sits in its default in-flow position**:
```css
.green {
	position: absolute;
	inset: 50px;
}

.flag {
	position: relative;
}

.hole {
	position: absolute;
}

.ball {
	position: relative;
}

/* Rendered result:
The "hole" sits below the "flag" (like how `block` displayed in Flow Layout) and the "ball" sits on top of the "hole" as if the "hole" isn't there*/
<div class="green">
	<div class="flag">🚩</div>
	<div class="hole">🕳</div>
	<div class="ball">⚽️</div>
</div>
```
- Particularly useful if we want to create isolated UI features that ***don't*** interfere with the layout of other elements on the page (e.g. popups, control menus, UI features that can be dragged and dropped anywhere on the page,...)
## Fixed
 - `position: fixed` is like `position: absolute` on steroids: it stays on a specified location in the *viewport* **only** (i.e. it ignores almost ***every*** other elements and their layout flow, except those with `transform`, `filter`, or `will-change` property), even if the document moves around (e.g. an element with this rule and `top: 0px; right: 0px` will ***always*** stay at the outermost top-right of the document no matter how far you scroll down).
- If 2 fixed positioned elements are placed as siblings in the DOM tree, the one declared *after* in HTML will rendered *on top*.
	   Certain CSS properties (e.g. `transform`, `filter`, or `will-change`), when applied to an ancestor, will mess with fixed positioning. If that's the case, you can try to remove or replace the CSS property (e.g. for `filter: drop-shadow`, you can use `box-shadow` instead).
## Sticky
 - `position: sticky` is a mixed option of `relative` and `fixed` that keeps the element in place relative to its parent (e.g. an element with this rule and `top: 0px;` will ***always*** stay on top of its *scrollable* parent (that may or may not have a `position: relative`). Sticky elements only stick while *their container* *is **in view*** (i.e. the position values (`top`/`left`/`right`/`bottom`) control the **minimum gap between the element and the edge OF THE VIEWPORT** while the container *is in-frame*)
> - Sticky elements are considered "in-flow", while fixed and absolute elements aren’t. 
> - If a  `position: sticky` element is contained within a `overflow: hidden` ancestor, then the `position: sticky` won't work.

## z-index
- `z-index` is a reference to the *z-axis* (imagine the screen is a flat surface, the z-axis is like an arrow shooting straight through it). Its values affect where ***positioned elements*** sit on that axis; positive values move them higher up the stack, negative values move them lower down the stack. By default, all *positioned* elements have a `z-index` of `auto`, which is effectively `0`.
- `z-index` only accepts ***unitless*** integer values (i.e. you can't specify that you want one element to be `23px` up the z-axis) and it will have **_NO_** effect on an element being rendered in Flow layout (***still works for [Flex](https://courses.joshwcomeau.com/css-for-js/04-flexbox/11-flex-interactions) and [Grid](https://courses.joshwcomeau.com/css-for-js/07-css-grid/14-sticky-grids) displays***). Higher values will be placed above lower values.
- We can switch the DOM order of the elements to simulate `z-index`, but, when we swap the order of two DOM nodes, we also swap their order in the tab index. For folks who navigate with a keyboard, they encounter elements _based on the DOM order_. So be careful when you're using this approach.
- A stacking context is an element that contains a set of layers. An element with a higher stacking order appears on top of an element with a lower stacking order. Each stacking context is self-contained: after the element's contents are stacked, the whole element is considered in the stacking order of the parent stacking context:
	- Within a local stacking context, the `z-index` values of its children are set relative to that element rather than to the document root. Layers outside of that context — i.e. sibling elements of a local stacking context — can't sit between layers within it. If an element B sits on top of element A, a child element of element A, element C, can never be higher than element B even if element C has a higher `z-index` than element B.
- Be mindful of the [stacking context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context) by using `isolation: isolate` on the container so that your stacking context won't effect other surrounding elements. It has the same effect of flattening all of the child elements, but it does so without requiring that we also set a `z-index` on the parent.
