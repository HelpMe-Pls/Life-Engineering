# Cookies and Sessions
- [[Browser#Cookie |Checkout]] what cookies are. Here's an example in Remix:
```tsx
//------------------------------- /utils/theme.server.ts
import * as cookie from 'cookie'

const cookieName = 'theme'
export type Theme = 'light' | 'dark'

export function getTheme(request: Request): Theme {
	const cookieHeader = request.headers.get('cookie')
	const parsed = cookieHeader ? cookie.parse(cookieHeader)[cookieName] : 'light'
	if (parsed === 'light' || parsed === 'dark') return parsed
	return 'light'
}

export function setTheme(theme: Theme) {
	return cookie.serialize(cookieName, theme, { path: '/' })
}

//------------------------------- root.tsx
import { getTheme, setTheme, type Theme } from './utils/theme.server.ts'

export async function loader({ request }: DataFunctionArgs) {
	const [csrfToken, csrfCookieHeader] = await csrf.commitToken(request)
	const honeyProps = honeypot.getInputProps()
	return json(
		{
			username: os.userInfo().username,
			theme: getTheme(request), // << This
			ENV: getEnv(),
			csrfToken,
			honeyProps,
		},
		{
			headers: csrfCookieHeader ? { 'set-cookie': csrfCookieHeader } : {},
		},
	)
}

const ThemeFormSchema = z.object({
	theme: z.enum(['light', 'dark']),
})

export async function action({ request }: DataFunctionArgs) {
	const formData = await request.formData()

	// Ensuring the values of the `<input name='theme'/>` satisfies `ThemeFormSchema`
	const submission = parse(formData, {
		schema: ThemeFormSchema,
	})
	// Check the `value` field of `name='intent'` tags
	if (submission.intent !== 'submit') {
		return json({ status: 'success', submission } as const)
	}
	// Check if the `formData` conforms to `ThemeFormSchema`
	if (!submission.value) {
		return json({ status: 'error', submission } as const, { status: 400 })
	}
	const { theme } = submission.value  // << This

	const responseInit = {
		headers: { 'set-cookie': setTheme(theme) }, // << This
	}
	return json({ success: true, submission }, responseInit)
}

const themeFetcherKey = 'theme-fetcher'
function useTheme() {
	const data = useLoaderData<typeof loader>()
    const themeFetcher = useFetcher<typeof action>({ key: themeFetcherKey })
	const optimisticTheme = themeFetcher?.formData?.get('theme')
	if (optimisticTheme === 'light' || optimisticTheme === 'dark') {
		return optimisticTheme
	}
	return data.theme
}

function ThemeSwitch({ userPreference }: { userPreference?: Theme }) {
	const fetcher = useFetcher<typeof action>({ key: themeFetcherKey })
	// This ^^
	
	const [form] = useForm({
		id: 'theme-switch',
		lastSubmission: fetcher.data?.submission,
		onValidate({ formData }) {
			return parse(formData, { schema: ThemeFormSchema })
		},
	})

	const mode = userPreference ?? 'light'
	const nextMode = mode === 'light' ? 'dark' : 'light'
	const modeLabel = {
		light: (
			<Icon name="sun">
				<span className="sr-only">Light</span>
			</Icon>
		),
		dark: (
			<Icon name="moon">
				<span className="sr-only">Dark</span>
			</Icon>
		),
	}

	return (
		<fetcher.Form method="POST" {...form.props}>
			<input type="hidden" name="theme" value={nextMode} />
												{/* This ^^ */}
			<div className="flex gap-2">
				<button
					name="intent"
					value="update-theme"
					type="submit"
					className="flex h-8 w-8 cursor-pointer items-center justify-center"
				>
					{modeLabel[mode]}
				</button>
			</div>
		</fetcher.Form>
	)
}

function App() {
	const theme = useTheme()
	return (
		<Document theme={theme}>
				<div className="flex items-center gap-2">
					<ThemeSwitch userPreference={theme} />
				</div>
		</Document>
	)
}
```
## Cookie sessions
- We can leverage cookies as an alternative for client-side state management, using the [`createCookieSessionStorage`](https://remix.run/docs/en/main/utils/sessions#createcookiesessionstorage) API to create cookies that are tied to the user's session, from which we can use to store and retrieve state change triggered by the UI. For example, showing a toast notification when the user deletes something:
```tsx
//--------------------- /utils/toast.server.ts
// Initialize the session storage object
import { createCookieSessionStorage } from '@remix-run/node'

export const toastSessionStorage = createCookieSessionStorage({
	cookie: {
		name: 'en_toast',
		sameSite: 'lax',
		path: '/',
		httpOnly: true,
		secrets: process.env.SESSION_SECRET.split(','), // using `.split` to maintain secure encryption in case one of the keys is tampered
		secure: process.env.NODE_ENV === 'production',
	},
})

//--------------------- An UI route where a state change is triggered
import { toastSessionStorage } from './utils/toast.server.ts'

export async function action({ request, params }: DataFunctionArgs) {
	await prisma.note.delete({ where: { id: note.id } })
	// Get all cookies
	const toastCookieSession = await toastSessionStorage.getSession(
		request.headers.get('cookie'),
	)
	// Initiate a cookie
	toastCookieSession.set('toast', {
		type: 'success',
		title: 'Note deleted',
		description: 'Your note has been deleted',
	})

	return redirect(`/users/${note.owner.username}/notes`, {
		headers: {
		// The cookie is automatically serialize when using `.commitSession`
			'set-cookie': 
			await toastSessionStorage.commitSession(toastCookieSession),
		},
	})
}

//--------------------- root.tsx
import { toastSessionStorage } from './utils/toast.server.ts'

export async function loader({ request }: DataFunctionArgs) {
	const toastCookieSession = await toastSessionStorage.getSession(
		request.headers.get('cookie'),
	)
	// Get the corresponding cookie
	const toast = toastCookieSession.get('toast')
	
	// Clean up so that it only shows once and not again after refreshes
	toastCookieSession.unset('toast')
	return json(
	 {
		...
		toast,
	 },
	 {
	      headers: combineHeaders(
			csrfCookieHeader ? { 'set-cookie': csrfCookieHeader } : null,
			{
			// Commit the clean up so that `toast` won't be included in next requests (because if it's included then the <ShowToast/> is rendered)
			  'set-cookie':
			   await toastSessionStorage.commitSession(toastCookieSession),
			},
		  ),
	  },
     )
}
// Renders the toast based on the session from the cookie:
function App() {
	const data = useLoaderData<typeof loader>()
	return (
		<Document>
			{/* The real meat in this context */}
			{data.toast ? <ShowToast toast={data.toast} /> : null}
		</Document>
	)
}
```

- For short-lived messages, opt for the "flash" pattern instead of the manual `set -> commit -> get -> unset -> commit` flow like the above example. The `session.flash` automatically `unset`s the value after the next `get` of that value. Applying to the above example, we use `.flash` instead of setting the cookie and get rid of the `.unset`:
```tsx
//--------------------- An UI route where a state change is triggered
export async function action({ request, params }: DataFunctionArgs) {
	...
  toastCookieSession.flash('toast', {
	  type: 'success',
	  title: 'Note deleted',
	  description: 'Your note has been deleted',
	})
	...
}

//--------------------- root.tsx
import { toastSessionStorage } from './utils/toast.server.ts'

export async function loader({ request }: DataFunctionArgs) {
	...
	// No need `.unset` because we're using `.flash`
	// toastCookieSession.unset('toast')
	...
}
```

# Password Management
## Keywords
- **Hashing**: A hash is a one-way function that takes in a string and returns a fixed-length string. The same input will always return the same output, but it's impossible to go from the output to the input. So, to verify the password is correct, you simply hash the password the user provides and compare it to the hash stored in the database. If they match, the password is correct.
- **Salt**: A Rainbow Table allows an attacker to simply look up the hash in the table to find the input. This means that if an attacker gets access to your database, they can simply look up the hashes to find the passwords.
	- To protect against this, password hashing algorithms use a salt, which is a random string that is added to the password before hashing. This means that even if two users have the same password, their hashes will be different. This makes it impossible for an attacker to use a rainbow table to find the passwords.
	- [bcrypt](https://www.npmjs.com/package/bcryptjs) hashes are slow and generate a random salt for you. This means that you don't need to worry about generating a salt and you can simply store the whole thing as is. Then when the user logs in, you provide the stored hash and the password they provide to `bcryptjs`'s compare function will verify the password is correct.
	  
> **NEVER** store the user's password as is (plain text)

## Data model for passwords
- It is preferred to have a separate `Password` model that has a one-to-one relationship to the `User` model. This way, the default of query the `User` will not include the password hash (at worst, it will include the `id` of the password which is not a concern):
```cs

```