- _CSS **Grid**_ is a latest CSS layout algorithm (i.e. there are no DOM nodes that represent the rows or columns in CSS Grid) designed for 2D layouts with various numbers of rows and columns.
- Even though the DOM order doesn't matter for the *visual layout* of our elements, it's important that we consider it when adding elements to the grid (consider `tabindex)`.
- The rows/columns don't have to be the same size, but they do have to be *consistent* (i.e. every row needs to have the same *number* of columns (and vice-versa)). Every cell in the same column needs to have the same `width`, every cell in the same row needs to have the same `height`. 
  The default behavior of the content is *stretched to fill* the cell containing it. There is no rule that says a grid child must be the same size as the cell it's aligned with. Grid children can be assigned to the same cell and are allowed to overlap. 
>  A grid child can span multiple rows and columns, but it must always produce a square/rectangle.
- A grid can be contained within a bigger parent element, resulting in "dead space" around the grid, and that's still a valid grid (even though you shouldn't let that happen).
---

## Fundamentals
### Flow 
- The *rows* are always arranged along the "*block*" axis (just like the block-level elements in Flow layout, i.e. the vertical axis). Rows are always stacked one on top of the other. *Columns* are always arranged along the *"inline*" axis (horizontally).
- When we change `grid-auto-flow` from `row` to `column`, we're *not* fundamentally changing the orientation of our grid; everything stays the same, except for the fact that our grid will have multiple columns instead of multiple rows.

### Construction
- A _grid **container**_ is defined by adding a `display: grid` rule to an element. All of the immediate *children* are then laid out automatically as _grid items_ (or grid children).
- Grid parents _aren't always_ block-level elements though. For example, we can have our grid parent be an inline element with `display: inline-grid` (which is rarely practical though).
#### Columns and rows
- The `grid-template-columns` property controls *the number* of columns we want our grid to have and the individual `width` of each column. Use the `fr` unit to set a ***flexible*** distribution for your **columns** (not their content) - like how `flex-grow` works: if we only have _one_ child using the `fr` unit, it'll consume all of the extra space, regardless of whether it's set to `2fr`, `1fr`, or `6996fr`. Any other units set a fixed `width`:
```html
<style>
  .wrapper {
    display: grid;
    /* The first column is fixed at 200px (i.e. its content will overflow to the next column if it is a very long string.
    Then, it distributes whatever space remains to the other 2, as if you set `flex-grow: 2` and `flex-grow: 1` on them
    */
    grid-template-columns: 200px 2fr 1fr;
  }
</style>

<div class="wrapper">
  <aside>1</aside>
  <main>2</main>
  <section>3</section>
</div>
```
- If we set the `height` of each cell unevenly, the resulting height of that row will be of the *tallest* child.
- Same for rows with the `grid-template-rows` property. Use in tandem with the `min-height: 100%` if we want the grid to fully flexible with the `fr` unit:
```html
<style>
  .wrapper {
    display: grid;
    grid-template-rows: 64px 1fr 300px;
    min-height: 100%
  }
</style>

<div class="wrapper">
  <header>My Website</header>
  <main>Content goes here</main>
  <footer>Copyright notice</footer>
</div>
```
- If you want many rows (or columns) to have the same unit, use the `repeat()` function instead of specifying the same value multiple times. The `auto-fill` param directs the grid to fill as many *columns* as possible (based on its container size):
```css
.random-grid {
  grid-template-columns: 250px repeat(5, 1fr);  /* same as: 250px 1fr 1fr 1fr 1fr 1fr */
  grid-template-columns:
      repeat(auto-fill, 150px);
}
```
- To sketch out a grid layout, use the properties `grid-template-areas` (in the grid container) and `grid-area` (in the grid items). Each "layout" is a row in form of a quoted `string` (with `grid-area`s defined within). Use the period sign (`.`) to refer to a grid item with no `grid-area` specified. [Example](https://www.w3schools.com/cssref/tryit.php?filename=trycss_grid-template-areas2).
- Use the `grid-row` and `grid-column` properties to (dynamically) specify a cell's coordinates (according to the "grid lines or tracks" in the Devtools).
#### Alignment
- Grid syntax is extensive, and allows defining sets of columns and rows with varying *repeated patterns*:
  - For the grid *container*:
	  1. `grid-gap` (or just `gap`):  specifies the size of rows and *columns* gutters (first value is for rows, the next one is for columns). If there's just 1 value, then it applies for both row and column gaps.
	  2. `justify-content`: allows us to change how our *columns* are distributed on row axis. Its common values are `start`/ `center` / `end` / `stretch` / `space-between` / `space-around` / `space-evenly` .
	  3. `align-content`: same as `justify-content` but for column axis. Also takes the same values. Only works when there's a fixed `height` set on the container (otherwise the rows are tightly packed together).
	  4. `place-content`: sets both the `align-content` and `justify-content` properties in a single declaration, respectively. If the second value is omitted, the first value is assigned to both properties.
	- For the grid *items*:
		1. `justify-items`: controls the grid item**s** position (_within_ a column) along the *row* axis - without affecting the shape of the grid. Its common values are `start` / `center` / `end` / `stretch`. The `space-*` properties only work when we're trying to distribute ***multiple** things* in a *shared space*, whereas `justify-items` is only concerned with each (single) item, within its own cell.
		2. `align-items`: same as `justify-items` but for column axis.
		3. `justify-self`: places *the content* ***inside a cell*** along the *row axis*. Its common values are `start` / `center` / `end` / `stretch.`
		4. `align-self`: same as `justify-self` but for the column axis.


## Features and recipes
### Fluid grids
- If there's no `width` (or `height`) set on the grid, then the `fr` unit will be calculated based on the `min-content` (or `min-height`) size of the largest child.
- The `minmax` function (as a value) takes 2 params. A flexible unit (`fr`) must *NOT* be the first param. It is essentially a way set a `min-width` on our grid columns (or a `min-height` when used with `grid-template-rows`):  
```html 
<style>
  /* Each column will stretch to be the same width (1fr), and it'll try and pack in (horizontally) as many columns as possible while each of them staying above 150px */
  .grid {
    display: grid;
    gap: 16px;
    grid-template-columns:
      repeat(auto-fill, minmax(150px, 1fr));
    /* We can use the functional values in conjunction with each other to create a fluid/responsive
    grid layout. For example, this declaration will return `100%` width for a less than 400px
    viewport (so that it won't overflow horizontally) and set `400px` column width for 400px++
    viewport:
    grid-template-columns: repeat(auto-fill, minmax(min(400px, 100%), 1fr));
     */
  }
</style>

<main class="grid">
  <div class="item"></div>
  <div class="item"></div>
  <div class="item"></div>
  <div class="item"></div>
  <div class="item"></div>
  <div class="item"></div>
</main>
```

### Evenly distributed
- The `auto-fit` value allows the columns (*not* their content) to stretch and take up 100% of the available space (horizontally), whereas the `auto-fill` adds more columns to fill the available space (i.e. if there's not enough columns, it'll just fill in more empty columns). Make use of this property (and be mindful of your content's `width`, so things don't get distorted) when you want your content to "look" evenly distributed on a row (with the `gap` equality sacrificed)
- Make use of the `fr` unit (and `auto`) as a "centering trick":
```css
  .wrapper {
    display: grid;
    /* Our two side columns will share whatever space remains (like `auto` margins) */
    grid-template-columns:
      1fr
      min(30ch, 100%)  /* so that it never grows above 100% of the available space */
      1fr;
	/* If there's no specific `width` for the middle content, use the `auto` value and it will be
	treated as `max-content`: 
	grid-template-columns: 1fr auto 1fr;
	*/
  }
  .wrapper > * {
  /* Every child we pop into this grid will be lined up inside the 2nd (centered) column */
    grid-column: 2;
  }
```

### Recipes
- Use `background-color`, `margin`, `border`, `padding` to create a [visual display](https://courses.joshwcomeau.com/css-for-js/07-css-grid/11-grid-dividers) of the grid lines.
- Use the `minmax` function with `0` as the first param to enable ***horizontal overflow*** for a column. Having `1fr` for a column means the `min-content` size of the content will always be the `width` of that column, which may create horizontal overflow for the whole grid (if it doesn't fit in its container).
  By setting `minmax(0, 1fr)`, we're telling the column that it can be as small as it wants, therefore, the column's `width` should always contain its content, and when the content's `width` is larger than column's `width`, the horizontal overflow will only apply for that column:
```html
<style>
  .grid {
    display: grid;
    /* Instead of this:
    grid-template-columns: 175px 1fr;
    
	Do this:*/
	grid-template-columns: 175px minmax(0, 1fr);
    gap: 16px;
  }

  /*
Or just simply define the overflow container at the direct grid child:
  .image-container {
	overflow: auto;
   }
  */
  
  .image-list {
    display: flex;
    gap: 16px;

	/* Get rid of these 2 declarations if you decided to use the
	.image-container above */
    max-width: 100%;
    overflow: auto;
  }
</style>

<div class="grid">
  <div class="intro">
    <h2>My Photos</h2>
    <p>Here are some animals I saw on holiday:
  </div>
  <div class="image-container">
    <ul class="image-list">
       <li>
        <img src="/cfj-mats/cat-four-300px.jpg" />
      </li>
      <li>
        <img src="/cfj-mats/otter.jpg" />
      </li>
       <li>
        <img src="/cfj-mats/dog-three-300px.jpg" />
      </li>
       <li>
        <img src="/cfj-mats/meerkat.jpg" />
      </li>
    </ul>
  </div>
</div>
```
- If you have just *one* row and want horizontal overflow in it:
```jsx
const Wrapper = styled.div`
    grid-template-columns: 100%;   // minmax(0px, auto)  || minmax(0px, 1fr)
`

const GridChild = styled.div`
	display: flex;
	overflow: auto;
`
```
- Consider `react-window` if you want to render a [large](https://react-window.vercel.app/#/examples/list/fixed-size) grid/list.
- Use the `verticle-align` property to [vertically position](https://developer.mozilla.org/en-US/docs/Web/CSS/vertical-align#values_for_table_cells) the content of a cell in a table.