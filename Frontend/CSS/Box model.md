The size of a given *element* is made up of several pieces (going inside-out):
1.  **Content**: it is what it is
2.  **Padding**: the (inner) spacing around the content but still *inside* the element
3.  **Border** : the lines that *wrap around* the padding
4.  **Margin**: the spacing *outside* the border

The `box-sizing` property with `content-box` value gives you the *default* CSS box-sizing behavior (i.e the size of your element is calculated by adding the **actual** measurements of *padding + border **+ content***), therefore, the final rendered result could be larger than expected. For example:
```css
<style>
	section {
		width: 500px;
	}

	.box {
		width: 100%;
		padding: 20px;
		border: 4px solid;
	}
</style>

<section>
	<div class="box"></div>
</section>

/*
When we set our `.box` to have `width: 100%`, we're saying that the box's CONTENT SIZE should be equal to the available space, `500px`. The padding and border is added ON TOP.

Our box winds up being 548px wide because it adds 20px of padding and 4px of border to each side: `500 + 20 * 2 + 4 * 2`.

The same thing happens with height: because the element is empty, it has a content size of 0px, with the same border and padding added on top.*/
```

What you need is *almost **always*** use the `box-sizing` property with `border-box` value so that the size of your element is calculated by automatically *adjusting* the measurements of *padding + border + content* to ***fit*** the given dimensions (i.e. the content could be shrinked responsively and the final rendered result includes all of its border and padding as well)
```css
/*Set the default `box-sizing` for your project:*/
*,
*::before,
*::after {
	box-sizing: border-box;
}
```