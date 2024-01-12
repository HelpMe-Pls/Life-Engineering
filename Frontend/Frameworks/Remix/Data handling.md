# Loaders
- You can define handlers and the UI (have backend and frontend code) for a route inside of a single file by using the async `loader` function for `GET` requests. You can get some of the benefits from `graphQL` and `tRPC` when using it: 
```tsx
// In #app/utils/db.server.ts
export function invariantResponse(
	condition: any,
	message?: string | (() => string),
	responseInit?: ResponseInit,
): asserts condition {
	if (!condition) {
		throw new Response(
			typeof message === 'function'
				? message()
				: message ||
				  'An invariant failed, please provide a message to explain why.',
			{ status: 400, ...responseInit },
		)
	}
}

// In #app/routes/users+/$username_+/notes.$noteId.tsx
import { json, type DataFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { db } from '#app/utils/db.server.ts'
import { errorHandler } from '#app/utils/misc.tsx'

export async function loader({ params }: DataFunctionArgs) {
	const note = db.note.findFirst({
		where: {
			id: {
				equals: params.noteId,
			},
		},
	})

	errorHandler(note, 'Note not found', { status: 404 })
	
	// graphQL's benefit where you can specify exactly the shape of the data that the client needs
	return json({
		note: { title: note.title, content: note.content },
	})
}

export default function NoteRoute() {
	const data = useLoaderData<typeof loader>()

	return (
		// And then get tRPC's strong typing with TS suggestions: Now TS only suggests `title` and `content` when hitting "Ctrl + Space" on `note.`, instead of suggesting all properties from `note`
		<h2>{data.note.title}</h2>
		<div className="overflow-y-auto pb-24">
			<p className="whitespace-break-spaces text-sm md:text-lg">
				{data.note.content}
			</p>
		</div>
		</div>
	)
}
```

> Throw a `Response` with an appropriate status rather than throwing an `Error`:
```tsx
// Prefer the above ↑ example for unexpected response rather than just throwing an ambiguous `Error`:
export async function loader({ params }: DataFunctionArgs) {
	const note = db.note.findFirst({
		where: {
			id: {
				equals: params.noteId,
			},
		},
	})
// Status 500 Response with an `Error`:
	if (!note) throw new Error('No note found')

	return json({
		note: { title: note.title, content: note.content },
	})
}
```

# Mutations
## Form submission
- While Remix supports all `HTTP` methods for ***form submission***, the browser itself only supports `GET` (the default - if `method="POST"` isn't declared) and `POST` methods. Which mean on slow connections or low-end devices, `HTTP` methods other than `GET` and `POST` may not work. Prefer cooking your mutating requests with `POST` and  [`action`](https://remix.run/docs/en/main/route/action) instead to maintain the progressive enhancement aspect:
```tsx
// Example with methods other than POST
```