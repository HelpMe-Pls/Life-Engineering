# Inline script
- While it's not recommended to use inline scripts for a lot of code, there are [some cases](https://www.epicweb.dev/tips/javascript-module-evaluation-order-on-the-web) where using it (with the `dangerouslySetInnerHTML` attribute) could be helpful. For instance, when we need to get the global `ENV` variable (set from the server) on the client, so that when our code hydrates we have access to runtime environment variables using the same global variable in either environment (server or client):
```tsx
// app/root.tsx:
import { getEnv } from './utils/env.server.ts'
export async function loader() {
	return json({
		ENV: getEnv(),
	})
}

export default function App() {
	const data = useLoaderData<typeof loader>()
	return (
		<html>
			<head/>
			<body>
				<script
					type="module"
					dangerouslySetInnerHTML={{
						__html: `
			window.ENV = ${JSON.stringify(data.ENV)}
		`,
					}}
				/>
			</body>
		</html>
	)
}

// In any client-side `*.tsx` file, you can access the `ENV` variable and get TS suggestions like: 
ENV.[Ctrl+Space] == 'some string from .env'
```
> [!important]- Don't you ever set any user-submitted data as the value of `dangerouslySetInnerHTML`
> Such a neglect would make your site vulnerable to [XSS](https://owasp.org/www-community/attacks/xss/)

