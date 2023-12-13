- Use the `Links` to dynamically access the HTML `<link/>` tags from anywhere in your project (that being said, in those files that don't have access to the `<head/>` tag). You can also get your resources dynamically cached on the browser:
```tsx
import { type LinksFunction } from '@remix-run/node'
import { Links } from '@remix-run/react'
import faviconAssetUrl from './assets/favicon.svg'
import fontStylesheetUrl from './styles/font.css'
import tailwindStylesheetUrl from './styles/tailwind.css'

// The browser automatically invalidates the cache whenever there's an update on these resources:
export const links: LinksFunction = () => {
	return [
		{ rel: 'icon', type: 'image/svg+xml', href: faviconAssetUrl },
		{ rel: 'stylesheet', href: fontStylesheetUrl },
		{ rel: 'stylesheet', href: tailwindStylesheetUrl },
	]
}

export default function App() {
	return (
		<html lang="en">
			<head>
			{/* Using Remix's <Links/> to configure the plain HTML <link/> tags*/}
				<Links />
			</head>
			<body>
				<p>Hello World</p>
			</body>
		</html>
	)
}
```