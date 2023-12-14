# URLs
- Using the URL as the primary mechanism for storing state (e.g. bookmark, sharing, site navigation,...) is not only common, but often necessary for an excellent user experience. URLs can be broken into segments:
![[url-breakdown.png]]
- The pathname can be further broken into segments. For example, if we wanted to show a specific user's profile, we could use the pathname `/users/123` where `123` is the user's ID. The user's ID segment is often referred to as a "route parameter".
  Route params are often represented by a `:` in the URL, e.g.: `https://github.com/:username/:repo`. This tells the router that the `username` and `repo` segments are params, and that they can be any value.
- The "Parameters" in the figure above is often called "query params" or "search params."
- You can also navigate to other pages on the web using a `<form>` tag. For example, if we wanted to search for users, we could use the following:
```html
<!-- This will take the value of the input and add it to the URL as a query param (`?q=...`)
The `method` attribute tells the browser to use the `GET` HTTP method when submitting the form. -->
<form action="/users/search" method="GET">
	<input type="text" name="q" />
	<button type="submit">Search</button>
</form>
```

# <link/> tags 
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