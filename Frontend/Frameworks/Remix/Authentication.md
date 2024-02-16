# Cookies and Sessions
- [[Browser#Cookie |Checkout]] what cookies are. Here's an example using cookie to set the theme:
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
## Role-based access
- In an authenticated system, each user has a set of roles, and each role has a set of permissions. Then when the user is trying to perform an action, the app checks whether the user's roles have the necessary permissions.
- The primary benefit of assigning roles instead of permissions to users is it makes it easier to manage permissions across a large number of users. 
	  For example, if you have 100 users and you want to give them all the same permissions, it's easier to create a role with those permissions and assign the role to all 100 users than it is to assign the permissions to each user individually. Especially when you decide you want to change or add new permissions to those users.
- It is highly recommended to have ***many-to-many relationships*** for our roles and permissions. User has many roles, roles can be assigned to many users. Role has many permissions and permissions can be assigned to many roles.
- f
- f



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
### Logout
- Use React hooks and the `useSubmit` hook from Remix to implement an auto logout feature to enhance security for your user's account:
```tsx
//--------------------- logout.tsx
import { type DataFunctionArgs, redirect } from '@remix-run/node'
import { sessionStorage } from '#app/utils/session.server.ts'

export async function loader() {
	return redirect('/')
}

export async function action({ request }: DataFunctionArgs) {
	const cookieSession = await sessionStorage.getSession(
		request.headers.get('cookie'),
	)
	// Assuming we're only having ONE cookie session responsible for the user's session
	return redirect('/', {
		headers: {
			'set-cookie': await sessionStorage.destroySession(cookieSession),
		},
	})
}


//--------------------- root.tsx
import {useLocation, useSubmit} from '@remix-run/react'

function LogoutTimer() {
	const location = useLocation()
	const submit = useSubmit()
	const logoutTime = 1000 * 60 * 60 * 24;
	const modalTime = logoutTime - 1000 * 60 * 2;
	const modalTimer = useRef<ReturnType<typeof setTimeout>>()
	const logoutTimer = useRef<ReturnType<typeof setTimeout>>()

// `useCallback` to memoize this function (to prevent re-computing) because it's included in a `useCallback` dependency array				
	const logout = useCallback(() => {
		submit(null, { method: 'POST', action: '/logout' })
	}, [submit])
	
// `useCallback` to prevent infinite re-render loop because this function is included in a `useEffect` dependency array
	const cleanupTimers = useCallback(() => {
		clearTimeout(modalTimer.current)
		clearTimeout(logoutTimer.current)
	}, [])

	const resetTimers = useCallback(() => {
		cleanupTimers()
		modalTimer.current = setTimeout(() => {
		   setSomeState(...)
		}, modalTime)
		logoutTimer.current = setTimeout(logout, logoutTime)
	}, [cleanupTimers, logout, logoutTime, modalTime])

	useEffect(() => resetTimers(), [resetTimers, location.key])
	useEffect(() => cleanupTimers, [cleanupTimers])

	return (
		{/* JSX code... */}
			<Form method="POST" action="/logout">
				<AlertDialogAction type="submit">Logout</AlertDialogAction>
			</Form>
        {/* More JSX code...*/}
	)
}

function Document({
	children,
	isLoggedIn = false,
}: {
	children: React.ReactNode
	isLoggedIn?: boolean
}) {
	return (
		<html>
			<head/>
			<body>
				{children}
				{isLoggedIn ? <LogoutTimer /> : null}
			</body>
		</html>
	)
}

function App() {
	const user = getUser()
	return (
		<Document isLoggedIn={Boolean(user)} 
		// More JSX...
		/>
	)
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
model User {
  id          String  @id @default(cuid())
  email       String  @unique
  username    String  @unique
  name        String?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  image       UserImage?
  password    Password?
  notes       Note[]
}

model Password {
  hash      String

  user      User   @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  userId    String @unique
}
```

## Using cookie to verify an user
- We can utilize `bcrypt` and cookies to make sure the currently active user is legitimate: 
```tsx
//--------------------- signup.tsx
export async function action({ request }: DataFunctionArgs) {
	const formData = await request.formData()
	const submission = await parse(formData, {
		schema: SignupFormSchema.superRefine(async (data, ctx) => {
			const existingUser = await prisma.user.findUnique({
				where: { username: data.username },
				select: { id: true },
			})
			if (existingUser) {
				ctx.addIssue({
					path: ['username'],
					code: z.ZodIssueCode.custom,
					message: 'A user already exists with this username',
				})
				return
			}
		}).transform(async data => {
			const { username, email, name, password } = data

			const user = await prisma.user.create({
				select: { id: true },
				data: {
					email: email.toLowerCase(),
					username: username.toLowerCase(),
					name,
					password: {   // <<< Here
						create: {
							hash: await bcrypt.hash(password, 10),
						},
					},
				},
			})

			return { ...data, user }
		}),
		async: true,
	})
// More code to set the cookie...
}

//--------------------- login.tsx
export async function action({ request }: DataFunctionArgs) {
	const formData = await request.formData()
	const submission = await parse(formData, {
		schema: intent =>
			LoginFormSchema.transform(async (data, ctx) => {
				if (intent !== 'submit') return { ...data, user: null }

				const userWithPassword = await prisma.user.findUnique({
					select: { id: true, password: { select: { hash: true } } },
					where: { username: data.username },
				})
				if (!userWithPassword || !userWithPassword.password) {
					ctx.addIssue({
						code: 'custom',
						message: 'Invalid username or password',
					})
					return z.NEVER
				}

				const isValid = await bcrypt.compare( // <<< Here
					data.password,
					userWithPassword.password.hash,
				)

				if (!isValid) {
					ctx.addIssue({
						code: 'custom',
						message: 'Invalid username or password',
					})
					return z.NEVER
				}

				return { ...data, user: { id: userWithPassword.id } }
			}),
		async: true,
	})
	// get the password off the payload that's sent back
	delete submission.payload.password

// More code to set the cookie...
}
```