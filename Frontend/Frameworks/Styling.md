- Remix allows you to import CSS files that are bundled (those file could come from a styling lib). Use `cssBundleHref` to reference those files in your `links`:
```ts
// You'll use the URL in the `links` export
import faviconAssetUrl from './assets/favicon.svg'
import fontStylesheetUrl from './styles/font.css' 
import tailwindStylesheetUrl from './styles/tailwind.css'
// These are bundled CSS:
import './styles2.css' 
import './styles3.css'
import './styles4.css'
import './styles5.css'
// Use `cssBundleHref` to access all of them in our `links`:
import { cssBundleHref } from '@remix-run/css-bundle'

// Notice that the reources are not all bundled up using `cssBundleHref` because we want separate cache for each of them, and the order in which they're defined could also has an impact on the order of applying those styles:
export const links: LinksFunction = () => {
	return [
		{ rel: 'icon', type: 'image/svg+xml', href: faviconAssetUrl },
		{ rel: 'stylesheet', href: fontStylesheetUrl },
		{ rel: 'stylesheet', href: tailwindStylesheetUrl },
		cssBundleHref ? { rel: 'stylesheet', href: cssBundleHref } : null,
	].filter(Boolean)
}
```
