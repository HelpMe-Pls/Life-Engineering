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
## Form validation
- Users can easily bypass simple form validation by manually adding `novalidate` to the `<form/>` tag or making the `HTTP` request directly using another tool. *==You **always** must validate on the server side==*. And you'll also want to render the errors from the server. Client-side validation should be seen as a nice progressive enhancement for a better user experience, not a replacement for server-side validation.
- As far as the server is concerned, there is no standard way to handle validation other than to respond with a `400` status code if there are validation errors. Remix has a nice way to get the error messages the server responds with using the [`useActionData()`](https://remix.run/docs/en/main/hooks/use-action-data) hook.
- You can manually control the `noValidate` prop on your `<Form/>` to enable server-side validation for better aesthetic, but it's still good practice to keep the client-side validation, just in case of slow network:
```tsx
type ActionErrors = {
	formErrors: Array<string>
	fieldErrors: {
		title: Array<string>
		content: Array<string>
	}
}

const titleMaxLength = 100
const contentMaxLength = 10000

export async function action({ request, params }: DataFunctionArgs) {
	invariantResponse(params.noteId, 'noteId param is required')

	const formData = await request.formData()
	const title = formData.get('title')
	const content = formData.get('content')
	invariantResponse(typeof title === 'string', 'title must be a string')
	invariantResponse(typeof content === 'string', 'content must be a string')
// Form validate on the server:
	const errors: ActionErrors = {
		formErrors: [],
		fieldErrors: {
			title: [],
			content: [],
		},
	}

	if (title === '') {
		errors.fieldErrors.title.push('Title is required')
	}
	if (title.length > titleMaxLength) {
		errors.fieldErrors.title.push('Title must be at most 100 characters')
	}
	if (content === '') {
		errors.fieldErrors.content.push('Content is required')
	}
	if (content.length > contentMaxLength) {
		errors.fieldErrors.content.push('Content must be at most 10000 characters')
	}

	const hasErrors =
		errors.formErrors.length ||
		Object.values(errors.fieldErrors).some(fieldErrors => fieldErrors.length)
	if (hasErrors) {
		return json({ status: 'error', errors } as const, { status: 400 })
	}

	await updateNote({ id: params.noteId, title, content })

	return redirect(`/users/${params.username}/notes/${params.noteId}`)
}

// 🐨 here's a good place to put the useHydrated hook
function useHydrated() {
	const [hydrated, setHydrated] = useState(false)
	useEffect(() => setHydrated(true), [])
	return hydrated
}

export default function NoteEdit() {
	const data = useLoaderData<typeof loader>()
	const actionData = useActionData<typeof action>()
	const isSubmitting = useIsSubmitting()
	const formId = 'note-editor'

	const fieldErrors =
		actionData?.status === 'error' ? actionData.errors.fieldErrors : null
	const formErrors =
		actionData?.status === 'error' ? actionData.errors.formErrors : null

	// 🐨 here's a good place for the isHydrated variable you get from useHydrated
	const isHydrated = useHydrated()

	return (
		<div className="absolute inset-0">
			<Form
				id={formId}
				// 🐨 set the noValidate prop to the isHydrated variable
				noValidate={isHydrated}
				method="post"
				className="flex h-full flex-col gap-y-4 overflow-y-auto overflow-x-hidden px-10 pb-28 pt-12"
			>
				<div className="flex flex-col gap-1">
					<div>
						<Label>Title</Label>
						<Input
							name="title"
							defaultValue={data.note.title}
	// Notice that we're not omitting the client-side validation 
							required
							maxLength={titleMaxLength}
						/>
						<div className="min-h-[32px] px-4 pb-3 pt-1">
							<ErrorList errors={fieldErrors?.title} />
						</div>
					</div>
					<div>
						<Label>Content</Label>
						<Textarea
							name="content"
							defaultValue={data.note.content}
	// Notice that we're not omitting the client-side validation 
							required
							maxLength={contentMaxLength}
						/>
						<div className="min-h-[32px] px-4 pb-3 pt-1">
							<ErrorList errors={fieldErrors?.content} />
						</div>
					</div>
				</div>
				<ErrorList errors={formErrors} />
			</Form>
			<div className={floatingToolbarClassName}>
				<StatusButton
					form={formId}
					type="submit"
					disabled={isSubmitting}
					status={isSubmitting ? 'pending' : 'idle'}
				>
					Submit
				</StatusButton>
			</div>
		</div>
	)
}
```

## Form submission
- While Remix supports all `HTTP` methods for ***form submission***, the browser itself only supports `GET` (the default - if `method="POST"` isn't declared) and `POST` methods. Which mean on slow connections or low-end devices, `HTTP` methods other than `GET` and `POST` may not work. Prefer cooking your mutating requests with `POST` and  [`action`](https://remix.run/docs/en/main/route/action) instead to maintain the progressive enhancement aspect:
```tsx
// Example with methods other than POST
```