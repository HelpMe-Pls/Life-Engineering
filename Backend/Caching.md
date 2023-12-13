# On the browser
- We can cache assets on the browser, and by doing so, we can eliminate unnecessary requests to the server for the unchanged resource:
```ts
// Aggressively cache static assets for a year
app.use(
	'/build',
	express.static('public/build', { immutable: true, maxAge: '1y' }),
)
```
- So to update a cached asset, e.g. an icon in this case, you'll have to manually invalidate its cache by updating its path like:
```html
<!-- Everytime there's an update for a reource, let's say a color change for an icon, and you want to reflect that update ASAP, you'll have to add a query string (`?v=2`) so that the server sees this a new resource request, and therefore, invalidate the cache -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg?v=2" />

<!-- If you don't want to change the path, then the browser have to wait for the next `maxAge` tick so that the cache will automatically invalidates itself by then. Other options like having the "Disable cache" box checked in the browser's Devtool, or a hard reload would also work, but those options require maunal work from the user -->
```
- Frameworks like [[Routing |Remix]] enables dynamic cache on the browser by adding a "fingerprint" to the cached resources.
