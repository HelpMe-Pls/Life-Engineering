[[Flex]]
[[Grid]]
[[Media queries]]

- **Responsive design** is the idea that all clients will receive identical HTML files from the server, but those HTML files will be flexible, and will display differently on different devices. Using CSS, we can tweak the layout to work across many different form factors.
---

## Clamping values
- `clamp` allows us to set a fixed boundary.
- The thing about `clamp` is that _it's a value_, not a property. This means that it can be used with just about any property. 
- It works quite a bit like the trio of `min-width`,  `width`, and `max-width`, but it combines it into _a single property value_.
- The `clamp` function takes 3 params and allows us to set 2 `max-width`:
```css
clamp(min-val, ideal-val, max-val)

.column {
  width: clamp(500px, 65%, 800px);
}
/* Equivalent to the rule above */
.column {
  min-width: 500px;
  width: 65%;
  max-width: 800px;
}

/*In this snippet, we're essentially applying TWO maximum widths: `800px` and `100%`. Our `.column` element will never be larger than 800px OR 100% of the available space.*/
.column {
  width: clamp(500px, 65%, 800px);
  max-width: 100%;
}
```

> Use `min` or `max` function if you want to limit only one end (consider this approach before reaching for media queries):
```css
/* our `.box` will have dynamic padding that scales with the viewport width, but ONLY UNTIL it reaches `32px`; it won't grow larger than that: */
.box {
  padding: min(32px, 5vw);
}
```

- The `clamp` function (along with `min` and `max`) will automatically resolve any `calc`-style equations within.
> Take advantage of this [to calculate](https://courses.joshwcomeau.com/css-for-js/05-responsive-css/16-fluid-calculator) the `ideal_val` (with mixed units) for the rate of scale ***IF*** you want to have a "smooth" transition between breakpoints (with the trade-off is you'll have obscure looking code):
```css
/*Instead of this*/
h1 {
  font-size: clamp(
    1.5rem,
    calc(4vw + 1rem),
    3rem
  );
}

/*Do this*/
h1 {
  font-size: clamp(
    1.5rem,
    4vw + 1rem,  /*This `ideal_val` will scale along the size of `vw`*/
    3rem
  );
  margin-bottom: 0.5em;
}
```


## Aspect ratio
- The `aspect-ratio` property controls the `width` to `height` ratio of ***ANY*** element. Particularly useful when used to *proportionally scale* replaced elements (e.g. an image with an aspect ratio of `2 / 1` means that it will be twice as wide as it is tall and will keep that ratio when being scaled)