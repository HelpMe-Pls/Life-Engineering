HTML, CSS, and JavaScript. These are the foundational technologies upon which
everything else on the web is based. They work together to create the excellent
user experiences our users expect in web applications today.

To get CSS loaded into your web application, there are a few options, but the
best is to load a stylesheet file (in a `.css` file extension) via a special
HTML tag called `<link>`.

```html
<link rel="stylesheet" href="styles.css" />
```

The `link` tag is an element that establishes a relationship between the HTML
document and an external resource. In this case, the `rel` attribute is set to
`stylesheet` and the `href` attribute is set to `styles.css`. This tells the
browser to load the CSS from the `styles.css` file. (Presumably the same server
that sent the HTML document is prepared to serve the CSS file as well).

The `link` tag can also be used to link to other types of resources like
favicons:

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

This tells the browser to load the favicon for the site from the `favicon.svg`
file.

And beyond that, `link` can be used for non-stylistic resources as well, like
telling the browser to prefetch some data, preload a stylesheet, or preload a JS
module:

```html
<link rel="prefetch" href="/some-resource" as="fetch" />
<link rel="preload" href="/some-file.css" as="style" />
<link rel="modulepreload" href="/some-file.js" />
```