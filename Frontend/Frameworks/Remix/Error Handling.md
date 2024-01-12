Each route module can export a conventional `ErrorBoundary` component and that component can *automatically* (i.e. without the need to actually render the `<ErrorBoundary/>` in the JSX) access the error it's handling via the [`useRouteError()`](https://remix.run/docs/en/main/hooks/use-route-error) hook, *which allows much of the application to still be functional if only a part of the nested layout is affected*:
```tsx
import { useRouteError } from '@remix-run/react'

export function ErrorBoundary() {
	const error = useRouteError()
	console.error(error)

	return (
		<div>
			<h1>Oh no!</h1>
			<p>Something bad happened! Sorry!</p>
		</div>
	)
}
```
- Remix can "error bubbling" when a route module does not export an `ErrorBoundary`, it will find its nearest ancestor that does and render that one in place of that ancestor.
---
# Thrown `Response`
- When you ***throw*** a `Response` from a `loader` or `action`, Remix will catch it and render your `ErrorBoundary` component instead of the regular route component. In that case, the `error` you get from `useRouteError` will be the response object that was thrown.
- Remix also has a `isRouteErrorResponse` utility which checks whether the error is a `Response`. If it is, then you can access its `.status` property to know the status code and render the right message based on that. Your response can also have a body if you want the error message to be determined by the server:
```tsx
export function ErrorBoundary() {
	const error = useRouteError()
	if (isRouteErrorResponse(error)) {
		if (error.status === 404) {
			return <p>Not Found</p>
		}
		if (error.status === 401) {
			return <p>Unauthorized</p>
		}
	}
	return <p>Something went wrong</p>
}
```

# Root Error
- It's good practice to extract the static content of your root UI to a reusable component so that the `ErrorBoundary` can be properly rendered with all the styles and meta we're expecting:
```tsx
// The reusable component:
function Document({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="h-full overflow-x-hidden">
			<head>
				<Meta />
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<Links />
			</head>
			<body className="flex h-full flex-col justify-between bg-background text-foreground">
				{children}
				<ScrollRestoration />
				<Scripts />
				<KCDShop />
				<LiveReload />
			</body>
		</html>
	)
}

// Our root UI:
export default function App() {
	// Uncomment the below line to try it out:
	// throw new Error('🐨 root component error')
	const data = useLoaderData<typeof loader>()
	return (
		<Document>
			<header className="container mx-auto py-6">
				<nav className="flex justify-between">
					<Link to="/">
						<div className="font-light">epic</div>
						<div className="font-bold">notes</div>
					</Link>
					<Link className="underline" to="users/kody">
						Kody
					</Link>
				</nav>
			</header>

			<div className="flex-1">
				<Outlet />
			</div>

			<div className="container mx-auto flex justify-between">
				<Link to="/">
					<div className="font-light">epic</div>
					<div className="font-bold">notes</div>
				</Link>
				<p>Built with ♥️ by {data.username}</p>
			</div>
			<div className="h-5" />
			<script
				dangerouslySetInnerHTML={{
					__html: `window.ENV = ${JSON.stringify(data.ENV)}`,
				}}
			/>
		</Document>
	)
}

// The `ErrorBoundary`:
export function ErrorBoundary() {
	return (
		<Document>
			<div className="flex-1">
				<GeneralErrorBoundary />
			</div>
		</Document>
	)
}
```

- Also checkout [[Routing#Splat route |splat route]] for a more fine-tuned 404 page.