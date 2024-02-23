- Checkout [[Frontend/Network/Data Transfer#Rate Limiting|rate limiting]].
----
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

# Forms and Mutations
## Form validation
- Users can easily bypass simple form validation by manually adding `novalidate` to the `<form/>` tag or making the `HTTP` request directly using another tool. *==You **always** must validate on the server side==*. And you'll also want to render the errors from the server. Client-side validation should be seen as a nice progressive enhancement for a better user experience, not a replacement for server-side validation.
- As far as the server is concerned, there is no standard way to handle validation other than to respond with a `400` status code if there are validation errors. Remix has a nice way to get the error messages the server responds with using the [`useActionData()`](https://remix.run/docs/en/main/hooks/use-action-data) hook.
- You can manually control the `noValidate` prop on your `<Form/>` to enable server-side validation for better aesthetic, but it's still good practice to keep the client-side validation, in case of slow network:
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

	const fieldErrors = actionData?.status === 'error' ? actionData.errors.fieldErrors : null
	const formErrors = actionData?.status === 'error' ? actionData.errors.formErrors : null
	const isHydrated = useHydrated()

	return (
		<div className="absolute inset-0">
			<Form
				id={formId}
// Apply the server-side validation after React is loaded
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
### Schema validation
- `zod` and `conform` is common combination for abstracted and declarative type-safe schema & form validation:
```tsx
import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { z } from 'zod'

export async function loader({ params }: DataFunctionArgs) {
	const note = db.note.findFirst({
		where: {
			id: {
				equals: params.noteId,
			},
		},
	})
	if (!note) {
		throw new Response('Note not found', { status: 404 })
	}
	return json({
		note: { title: note.title, content: note.content },
	})
}

const titleMaxLength = 100
const contentMaxLength = 10000

const NoteEditorSchema = z.object({
	title: z.string().max(titleMaxLength),
	content: z.string().max(contentMaxLength),
})

export async function action({ request, params }: DataFunctionArgs) {
	invariantResponse(params.noteId, 'noteId param is required')
	const formData = await request.formData()
	
	// Server side validation, ensuring the values of `name` attributes of the <input/> fields to match the schema 
	const submission = parse(formData, {
		schema: NoteEditorSchema,
	})
// Progressive Enhancement: still submit the form with the action performed (in this case, it's something else other than the actual content edit - because that would have the `submission.intent === 'submit'`, e.g. add/remove an image) without relying on JS
	// Check the `value` field of `name='intent'` tags
	if (submission.intent !== 'submit') {
		return json({ status: 'idle', submission } as const)
	}
	// Check if the `formData` conforms to `NoteEditorSchema`
	if (!submission.value) {
		return json({ status: 'error', submission } as const, {
			status: 400,
		})
	}
	const { title, content } = submission.value

	await updateNote({ id: params.noteId, title, content })

	return redirect(`/users/${params.username}/notes/${params.noteId}`)
}

function ErrorList({
	id,
	errors,
}: {
	id?: string
	errors?: Array<string> | null
}) {
	return errors?.length ? (
		<ul id={id} className="flex flex-col gap-1">
			{errors.map((error, i) => (
				<li key={i} className="text-[10px] text-foreground-destructive">
					{error}
				</li>
			))}
		</ul>
	) : null
}

export default function NoteEdit() {
	const data = useLoaderData<typeof loader>()
	const actionData = useActionData<typeof action>()
	const isSubmitting = useIsSubmitting()

	const [form, fields] = useForm({
		id: 'note-editor',
// Represents client-side HTML validation attributes from the example above
		constraint: getFieldsetConstraint(NoteEditorSchema),
// Revalidate on every submission
		lastSubmission: actionData?.submission,
// The actual (client-side) validation
		onValidate({ formData }) {
			return parse(formData, { schema: NoteEditorSchema })
		},
		defaultValue: {
			title: data.note.title,
			content: data.note.content,
		},
	})

	return (
		<div className="absolute inset-0">
			<Form
				method="post"
				className="flex h-full flex-col gap-y-4 overflow-y-auto overflow-x-hidden px-10 pb-28 pt-12"
				 // client-side validation handled by `conform`
				{...form.props} 
			>
				<div className="flex flex-col gap-1">
					<div>
						<Label htmlFor={fields.title.id}>Title</Label>
						<Input autoFocus {...conform.input(fields.title)} />
						<div className="min-h-[32px] px-4 pb-3 pt-1">
							<ErrorList
								id={fields.title.errorId}
								errors={fields.title.errors}
							/>
						</div>
					</div>
					<div>
						<Label htmlFor={fields.content.id}>Content</Label>
						<Textarea {...conform.textarea(fields.content)} />
						<div className="min-h-[32px] px-4 pb-3 pt-1">
							<ErrorList
								id={fields.content.errorId}
								errors={fields.content.errors}
							/>
						</div>
					</div>
				</div>
				<ErrorList id={form.errorId} errors={form.errors} />
			</Form>
			<div className={floatingToolbarClassName}>
				<Button form={form.id} variant="destructive" type="reset">
					Reset
				</Button>
				<StatusButton
					form={form.id}
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
- While Remix supports all `HTTP` methods for ***form submission***, the browser itself only supports `GET` (the default - if `method="POST"` isn't declared) and `POST` methods. Which mean on slow connections or low-end devices, `HTTP` methods other than `GET` and `POST` may not work. Prefer cooking your mutating requests with `POST` and  [`action`](https://remix.run/docs/en/main/route/action) [[Frontend/Frameworks/Remix/Data Transfer#Complex structure |instead]] to maintain the progressive enhancement aspect.
> For Progressive Enhancement, check this out [at 3:20](https://www.epicweb.dev/workshops/professional-web-forms/complex-structures/interactive-image-management/solution).
### Complex structure
- By default, *nested forms and arrays aren't allowed*. By using `useFieldList` from `conform` and `z.array()` from `zod`, we can have a simulated interface to deal with that:
```tsx
const ImageFieldsetSchema = z.object({
	id: z.string().optional(),
	file: z
		.instanceof(File)
		.refine(file => {
			return file.size <= MAX_UPLOAD_SIZE
		}, 'File size must be less than 3MB')
		.optional(),
	altText: z.string().optional(),
})

const NoteEditorSchema = z.object({
	title: z.string().max(69),
	content: z.string().max(96),
	images: z.array(ImageFieldsetSchema),  // Here
})

export async function action({ request, params }: DataFunctionArgs) {
	const submission = parse(formData, {
		schema: NoteEditorSchema,
	})
	const { title, content, images } = submission.value // `images` here
	await updateNote({ id: params.noteId, title, content, images })
	return redirect(`/users/${params.username}/notes/${params.noteId}`)
}
export default function NoteEdit() {
	// Here:
	const imageList = useFieldList(form.ref, fields.images)

	return (
			<Form
				method="post"
				{...form.props}
				encType="multipart/form-data"
			>
					<div>
						<Label>Images</Label>
						<ul className="flex flex-col gap-4">
							{imageList.map((image, index) => (
								<li key={image.key}>
									<button
// `list` is from `'@conform-to/react'`, handling form item removal			
{...list.remove(fields.images.name, { index })}>
										<span aria-hidden>❌</span>{' '}
										<span className="sr-only">Remove image {index + 1}</span>
									</button>
									<ImageChooser config={image} />
								</li>
							))}
						</ul>
					</div>
			</Form>
	)
}
```

## Form accessibility
- One example of this is properly labeling your form elements so the browser knows which labels are associated to which form elements. A common way to do this is through the `for` and `id` attributes:
```tsx
<form>
	<label htmlFor="name">Name</label>
	<input id="name" type="text" />
</form>
```
- Don't use `aria-*` attributes if you can use native `HTML` for the corresponding feature. An example is to not apply `aria-invalid` and `aria-describedby` unless there is an error. To accomplish this, you can pass `undefined` as their values if there is no error:
```tsx
<form method="post">
	<label for="email-input">Email</label>
	<input
		id="email-input"
		type="email"
		// notice that it's `undefined`, not `false`
		aria-invalid={hasErrors || undefined} 
		aria-describedby={hasErrors ? 'email-errors' : undefined}
		required
	/>
	<ul id="email-errors">
		<li>Must be a valid email address</li>
	</ul>
</form>

```
 When an error occurs, the `aria-describedby` attribute ***creates an association*** between the input field and the error message. This means that assistive technologies, like screen readers, will read the error message when the user interacts with the input field.
 >Prefer using [`conform`](https://conform.guide/accessibility) for better DX
### Focus management
- Accessibility can also be used to enhance UX. For instance, focusing in the erred field after submitting a form: 
```tsx
export default function NoteEdit() {
	const data = useLoaderData<typeof loader>()
	const actionData = useActionData<typeof action>()
	const formRef = useRef<HTMLFormElement>(null)
	const formId = 'note-editor'
	const isSubmitting = useIsSubmitting()

	const fieldErrors =
		actionData?.status === 'error' ? actionData.errors.fieldErrors : null
	const formErrors =
		actionData?.status === 'error' ? actionData.errors.formErrors : null
	const isHydrated = useHydrated()

	const formHasErrors = Boolean(formErrors?.length)
	const formErrorId = formHasErrors ? 'form-error' : undefined
	const titleHasErrors = Boolean(fieldErrors?.title.length)
	const titleErrorId = titleHasErrors ? 'title-error' : undefined
	const contentHasErrors = Boolean(fieldErrors?.content.length)
	const contentErrorId = contentHasErrors ? 'content-error' : undefined

	// This is where it's at
	useEffect(() => {
		const formEl = formRef.current
		if (!formEl) return
		if (actionData?.status !== 'error') return

	// Focus on the form itself and the screen reader will announce the user the issue with the form, i.e. the value of `actionData.errors.formErrors`
		if (formEl.matches('[aria-invalid="true"]')) {
			formEl.focus()
		} else {
			const firstInvalid = formEl.querySelector('[aria-invalid="true"]')
// If there are two erred fields, focus on the first one
			if (firstInvalid instanceof HTMLElement) {
				firstInvalid.focus()
			}
		}
// Re-run those `focus` actions on every submit
	}, [actionData])

	return (
		<div className="absolute inset-0">
			<Form
				id={formId}
				noValidate={isHydrated}
				method="post"
				className="flex h-full flex-col gap-y-4 overflow-y-auto overflow-x-hidden px-10 pb-28 pt-12"
				aria-invalid={formHasErrors || undefined}
				aria-describedby={formErrorId}
				ref={formRef}
// So we can programmatically manipulate the `focus` effect
				tabIndex={-1}
			>
				<div className="flex flex-col gap-1">
					<div>
						<Label htmlFor="note-title">Title</Label>
						<Input
							id="note-title"
							name="title"
							defaultValue={data.note.title}
							required
							maxLength={titleMaxLength}
							aria-invalid={titleHasErrors || undefined}
							aria-describedby={titleErrorId}
							autoFocus
						/>
						<div className="min-h-[32px] px-4 pb-3 pt-1">
							<ErrorList id={titleErrorId} errors={fieldErrors?.title} />
						</div>
					</div>
					<div>
						<Label htmlFor="note-content">Content</Label>
						<Textarea
							id="note-content"
							name="content"
							defaultValue={data.note.content}
							required
							maxLength={contentMaxLength}
							aria-invalid={contentHasErrors || undefined}
							aria-describedby={contentErrorId}
						/>
						<div className="min-h-[32px] px-4 pb-3 pt-1">
							<ErrorList id={contentErrorId} errors={fieldErrors?.content} />
						</div>
					</div>
				</div>
				<ErrorList id={formErrorId} errors={formErrors} />
			</Form>
			<div className={floatingToolbarClassName}>
				<Button form={formId} variant="destructive" type="reset">
					Reset
				</Button>
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
> Prefer using [`conform`](https://conform.guide/focus-management) for better DX 
## File upload
- The `<input type="file" />` element is an essential part of the HTML specification that creates a user interface that allows users to select one or multiple files (with the `multiple` attribute) from their system. You can also use the accept attribute to specify the types of files that can be uploaded.
  To ensure the file data is sent correctly to the server, the file `<input/>` is set within a form with `enctype="multipart/form-data"`:
```tsx
<form action="/upload" method="post" enctype="multipart/form-data">
	<input 
		type="file" 
		id="file-upload" 
		name="file-upload" 
		accept="image/*"
		multiple 
	/>
	<input type="submit" value="Upload Image" />
</form>
```
- Once a file or files have been selected, they can be accessed via JavaScript using the `files` property on the file input element, which returns a `FileList` object:
```tsx
let fileList = document.getElementById('file-upload').files
```
### On the server
- In case of big files (in gigabyte of size), the server will then receive (stream) these chunks one at a time and then reassemble them into the original file.
- For smaller files (just a couple `MB`s), you can get away with storing those *in memory* for a short period of time. This is a fair bit simpler, but you do still need to deal with the stream of data to construct the file on the server.
- `createMemoryUploadHandler` and `parseMultipartFormData` are 2 common utils from Remix to handle file upload:
```tsx
import {
	unstable_createMemoryUploadHandler as createMemoryUploadHandler,
	unstable_parseMultipartFormData as parseMultipartFormData,
} from '@remix-run/node'
export const action = async ({ request }: ActionArgs) => {
// Store the file in memory and give you back a web standard `File` object. This is only suitable for small files and you should definitely use the `maxPartSize` option to limit the size of files it will load into your server's memory
	const uploadHandler = createMemoryUploadHandler({
		maxPartSize: 1024 * 1024 * 5, // 5 MB
	})
// Creates the stream of data and turn it into a `FormData` object. This is the same object you get from `request.formData()`
	const formData = await parseMultipartFormData(request, uploadHandler)

// file is a "File" (https://mdn.io/File) polyfilled for node
	const file = formData.get('avatar')
}
```
## Dealing with Spam bots
- A ***honeypot*** field is a form input that's designed to be invisible to genuine human users but enticing to bots. If any submissions contain data in that hidden field, it's a strong indicator that the submission is from a bot, allowing us to discard or flag the submission accordingly.
- To implement a honeypot field, you'd typically add an input field to your form and then *hide it using CSS*:
```tsx
export async function action({ request }: DataFunctionArgs) {
	const formData = await request.formData()
	if (formData.get('name')) throw new Response('Form not submitted properly', {status: 400}) 
}

// JSX:
<Form method="POST">
	<div style={{ display: 'none' }} aria-hidden>
		<label htmlFor="name-input">Please leave this field blank</label>
		<input id="name-input" name="name" type="text" />
	</div>
	<div>
		<Label htmlFor="email-input">Email</Label>
		<Input autoFocus id="email-input" name="email" type="email" />
	</div>
	<Button className="w-full" type="submit">
		Create an account
    </Button>
</Form>
```

- Using Remix utils:
```tsx
// honeypot.server.ts
import { Honeypot } from 'remix-utils/honeypot/server'
export const honeypot = new Honeypot({
	validFromFieldName: null,
})

// JSX
import { HoneypotInputs } from 'remix-utils/honeypot/react'
import { SpamError } from 'remix-utils/honeypot/server'
import { honeypot } from '#app/utils/honeypot.server.ts'

export async function action({ request }: DataFunctionArgs) {
	const formData = await request.formData()
	try {
		honeypot.check(formData)
	} catch (error) {
		if (error instanceof SpamError) {
			throw new Response('Form not submitted properly', { status: 400 })
		}
		throw error
	}
}

<Form method="POST">
	<HoneypotInputs />
	
	<div>
		<Label htmlFor="email-input">Email</Label>
		<Input autoFocus id="email-input" name="email" type="email" />
	</div>
	<Button className="w-full" type="submit">
		Create an account
    </Button>
</Form>
```
# CSRF
- [[Security#CSRF |Checkout]] what CSRF is. Here's an example of its implementation:
- On the server:
```tsx
//---------------------------- csrf.server.ts
import { createCookie } from '@remix-run/node'
import { CSRF } from 'remix-utils/csrf/server'

const cookie = createCookie('csrf', {
	path: '/',
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	sameSite: 'lax',
	secrets: process.env.SESSION_SECRET.split(','),
})

export const csrf = new CSRF({ cookie })

//---------------------------- .env
SESSION_SECRET="super-duper-secret"

//---------------------------- env.server.ts: Make the CSRF secret available for the app
const schema = z.object({
	SESSION_SECRET: z.string(),
})

declare global {
	namespace NodeJS {
		interface ProcessEnv extends z.infer<typeof schema> {}
	}
}
```
- On the client:
```tsx
//---------------------------- root.tsx
import { csrf } from './utils/csrf.server.ts'

export async function loader({ request }: DataFunctionArgs) {
	const honeyProps = honeypot.getInputProps()
// The CSRF token is tied to a user’s session, so the `request` object is needed to access this session information.
	const [csrfToken, csrfCookieHeader] = await csrf.commitToken(request)
	return json(
		{ username: os.userInfo().username, ENV: getEnv(), honeyProps, csrfToken },
		{
		// Save it to a cookie so that we can validate across the entire app
		headers: csrfCookieHeader ? { 'set-cookie': csrfCookieHeader } : {},
		},
	)
}
export default function AppWithProviders() {
	const data = useLoaderData<typeof loader>()
	return (
		<AuthenticityTokenProvider token={data.csrfToken}>
			<HoneypotProvider {...data.honeyProps}>
				<App />
			</HoneypotProvider>
		</AuthenticityTokenProvider>
	)
}

//---------------------------- notes.$nodeId.tsx (or some UI route):
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { csrf } from '#app/utils/csrf.server.ts'

export async function action({ request, params }: DataFunctionArgs) {
	const formData = await request.formData()
	try {
	// Double Submit Cookie pattern:
		await csrf.validate(formData, request.headers)
	} catch (error) {
		if (error instanceof CSRFError) {
			throw new Response('Invalid CSRF Token', { status: 403 })
		}
	}

	db.note.delete({ where: { id: { equals: params.noteId } } })
	return redirect(`/users/${params.username}/notes`)
}

// JSX:
<Form method="post">
	<AuthenticityTokenInput />
		<Button
			type="submit"
			variant="destructive"
			name="intent"
			value="delete"
		>
			Delete
		</Button>
</Form>
```
