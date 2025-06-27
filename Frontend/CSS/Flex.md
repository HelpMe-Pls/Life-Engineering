- **Flexbox** is a CSS *layout algorithm* that allows aligning items into rows or columns, with rules for aligning items and wrapping them as they overflow.
- A _flex parent_ (or the **flex container**) is defined by adding a `display: flex` rule to an element. All of the ***immediate children*** are then laid out automatically as _flex items_.
- The children will be positioned by default according to the following 2 rules:
	1.  **Primary/main axis:** Children will be bunched up at the _start_ of the container.
	2.  **Cross axis:** Children will `stretch` out to ==fill the entire container== (i.e. the default value for `align-*`  is  `stretch`).

- Key properties (for the flex ***container***):
1.  `flex-direction`: establishes the main layout axis (`row` / `column` / `row-reverse` / `column-reverse`).
2.  `justify-content`:  distributes the *group* of children in the extra space on the main axis (`flex-start` / `center` / `flex-end` / `space-between` / `space-around` / `space-evenly` / `stretch`).
3.  `align-items`: determines how flex *items* are laid out ([individually](https://www.joshwcomeau.com/css/interactive-guide-to-flexbox/#content-vs-items-4)) on the *cross axis* (`flex-start` / `center` / `flex-end` / `stretch` /`baseline`). The `space-*` properties only work when we're trying to distribute multiple things in a *shared space*. `align-items` interprets its "items" singularly on the cross axis, that's why there's no `space-*` props for it (i.e. you can't add space between a *single* element). Consider the `baseline` value when you want your items to be set on the same line.
4. `align-content`: works exactly like `justify-content` but for the cross-axis. This property has no effect on single line flex containers (i.e. ones with `flex-wrap: nowrap`). Checkout a [practical case](https://www.joshwcomeau.com/css/interactive-guide-to-flexbox/#wrapping-14) where it makes sense.
5. `gap`: specifies the space between its children. It receives 2 values for horizontal and/or vertical gap. If there's just one value then it's just the row gap. 

- Centering items both vertically and horizontally had been an exceptionally difficult task on the web for many years, but Flexbox allows centering things fairly easily, such as `display: flex; justify-content: center; align-items: center;` (be mindful of the container's space - width/height - when applying flexbox).
- If we want *a child* to have specific alignments, use `align-self` (which has all the same values as `align-items`). ==***There is no `justify-self` in flexbox***== (just as how `justify-items` doesn't make sense in flexbox). In this example,  `← Go back`  sticks to the start of the container, while all other children are centered:
```css
<style>
  section {
    display: flex;
    flex-direction: column;
    /* Set all children to be center-aligned */
    align-items: center;
  }
  
  a:first-of-type {
    /* Override that default alignment */
    align-self: flex-start;
  }
</style>

<section>
  <a href="">← Go back</a>
  <a href="">View account</a>
  <a href="">Make a transfer</a>
  <a href="">Request a loan</a>
</section>
```

## Sizing and Ratios
- The ***minimum content size*** is the smallest an item can get without its contents overflowing.
- Setting `width` in a flex row (or `height` in a flex column) sets the **_hypothetical_ size**. It isn't a guarantee, it's a suggestion (i.e. it will apply that size value if there's *enough* space, and if its container is shrinking below that value, it will also scale along).
- `flex-basis` has the same effect as `width` in a flex row (or `height` in a flex column) - for the main axis - so it takes the value of length unit (e.g. `200px`). Both `width` and `flex-basis` will change the _hypothetical_ size of an element.
  You can use them interchangeably, but `flex-basis` will win if there's a conflict (e.g. if the `flex-basis` prop (or it's included in the `flex` shorthand) is in the *same* rule with `width` or `height`, then `width` or `height` has no effect; but there's a catch: `width` can set that value *below* the minimum content size while `flex-basis` can't).
- `flex-grow` controls how the _extra space is distributed_ when the items are *smaller* than their container. It will allow a child to ==*grow and **consume***== any _excess_ space in the container (consider `margin: auto` if what you want is the positioning of the child within that extra space). It has no effect if there ***isn't*** any excess space.
- `flex-shrink` controls how _space is removed_ when the items are *bigger* than their container. It will pick ***which element*** to consume space from, when the container is too small (you can set the threshold for the shrinking with  `min-width`, e.g. we can set an item to shrink to oblivion with `min-width: 0`, but please, don't). It has no effect if there **_is_** any excess space.
- `flex-shrink` can't shrink an item below its minimum content size (e.g. the length of the longest word in the item).
- `flex-grow`  and  `flex-shrink` values are in numbers, which indicate a _ratio of the available space_:
```html
<!--
We want the `main` element to consume _3 times_ as much space as `nav` or `aside`. It gets 3 "units" of space, whereas `nav` and `aside` only get 1 unit.

To find out the actual percentage, add all the numbers together. In this example, there are 5 units total (1 + 3 + 1). That means that `nav` and `aside` each get 20% of the total space (1 / 5), whereas `main` gets 60% (3 / 5).

When shrinking, the same concept applies; an element with `flex-shrink: 3` will shrink 3x faster than an element with `flex-shrink: 1`. It shrinks by 3 pixels for every 4 pixels of total shrinking (if these are the only two elements involved)
-->
<style>
  .row {
    display: flex;
  }

  nav, aside {
    flex-grow: 1;
  }

  main {
    flex-grow: 3;
  }
</style>

<div class="row">
  <nav></nav>
  <main></main>
  <aside></aside>
</div>
```
- The short hand  `flex`  property (in a flex item) represents all 3 props:  `flex-grow`, `flex-shrink`, `flex-basis`. For example `flex: 1` will assign `flex-grow: 1`, but it will _also_ set `flex-basis: 0`  (and _the value_ `0` will override any `width` you set with `width: min-content`) and it won't affect the default value for `flex-shrink` (which is `1`).

> It is *highly recommended* to use the  `flex`  shorthand (with  `flex-basis` value included) instead of having  `flex`  props AND `width` / `height` in the same declaration.

## Ordering and overflow
- `flex-direction: row-reverse || column-reverse`  flips the order of its children (like in `Array.reverse()`) on the main axis.
- If we want to flip the order of children *without* changing their alignment: 
```css
.row {
  flex-direction: row-reverse;
  justify-content: flex-end;
}
```
- When we flip the order of flex children, it's just for cosmetic only (i.e. `aria`-ish is still having the original ordering).
- The `flex-wrap` property (in a flex container) sets whether its *flex items* are allowed to overflow (with `nowrap` value) or can wrap onto multiple lines (with `wrap` *so that the items won't shrink below their hypothetical size*: highly consider this before reaching for [[Queries|media queries]]). 
  Commonly used with `flex-basis` (shorthand form) and `max-width` || `min-width` for responsive designs.
- `flex-wrap: wrap-reverse` causes elements to wrap upwards rather than downwards.
- Nice trick: you can use DOM-ordering and `flex-direction` as a [substitute](https://courses.joshwcomeau.com/css-for-js/04-flexbox/10-ordering?videoId=513160445&bookmarkedTime=159.691) for HTML `tabindex`.