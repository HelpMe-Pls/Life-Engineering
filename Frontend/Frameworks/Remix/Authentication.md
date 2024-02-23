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
- Checkout [an example](https://github.com/epicweb-dev/web-auth/tree/main/exercises/10.email/04.solution.session/app) of using cookie to pass data between routes and properly redirect users (`/utils/verification.server.ts` -> `routes/_auth+/onboarding.tsx > requireOnboardingEmail()` -> `routes/_auth+/signup.tsx > verifySession`) 

## Role-based access
- In an authenticated system, each user has a set of roles, and each role has a set of permissions. Then when the user is trying to perform an action, the app checks whether the user's roles have the necessary permissions.
- The primary benefit of assigning roles instead of permissions to users is it makes it easier to manage permissions across a large number of users. 
	  For example, if you have 100 users and you want to give them all the same permissions, it's easier to create a role with those permissions and assign the role to all 100 users than it is to assign the permissions to each user individually. Especially when you decide you want to change or add new permissions to those users.
- It is highly recommended to have [[Databases#Many-to-many |many-to-many relationships]] for our roles and permissions. User has many roles, roles can be assigned to many users. Role has many permissions and permissions can be assigned to many roles.

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

## Managed sessions
- Instead of storing the user ID in a cookie, we can create a new database model called "session" which has an expiration time, ID, and a user ID. When a user logs in, we create a new session record for them in the database and *instead of putting the user's ID in the cookie*, we put the session ID. When the user makes a request, we use that to find the user attached to the (unexpired) session.
- Some apps even store the IP address of the session so users can use that to help them identify which session to delete.

> [!info]- Expired sessions
> When you query the database for the session, make sure you filter out expired sessions.
> You can also add cron job that deletes expired sessions on a regular basis which can help prevent the database from getting unnecessarily large.
- Example:
```tsx
//------------------- 1. Create model and relationship
model Session {
  id             String   @id @default(cuid())
  expirationDate DateTime

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  userId String

  // non-unique foreign key for one-to-many relationship
  @@index([userId])
}
model User {
  //...existing fields...
  sessions Session[]
}
//------------------- 2. Update db
npx prisma migrate dev --name sessions

//------------------- 3. Initiate the session
export async function login({
	username,
	password,
}: {
	username: User['username']
	password: string
}) {
	const user = await verifyUserPassword({ username }, password)
	if (!user) return null
	const session = await prisma.session.create({
		select: { id: true, expirationDate: true },
		data: {
			expirationDate: getSessionExpirationDate(),
			userId: user.id,
		},
	})
	return session
}

export async function signup({
	email,
	username,
	password,
	name,
}: {
	email: User['email']
	username: User['username']
	name: User['name']
	password: string
}) {
	const hashedPassword = await getPasswordHash(password)

	const session = await prisma.session.create({
		data: {
			expirationDate: getSessionExpirationDate(),
			user: {
				create: {
					email: email.toLowerCase(),
					username: username.toLowerCase(),
					name,
					roles: { connect: { name: 'user' } },
					password: {
						create: {
							hash: hashedPassword,
						},
					},
				},
			},
		},
		select: { id: true, expirationDate: true },
	})

	return session
}

export async function logout({request, redirectTo = '/'}: {request: Request, redirectTo?: string}, nmresponseInit?: ResponseInit) {
	const cookieSession = await sessionStorage.getSession(
		request.headers.get('cookie'),
	)
	const sessionId = cookieSession.get(userIdKey)
	// delete the session if it exists, but don't wait for it, go ahead an log the user out with `void` instead of `await`
	if (sessionId) {
		void prisma.session.deleteMany({ where: { id: sessionId } }).catch(() => {})
	}
	throw redirect(
		safeRedirect(redirectTo),
		combineResponseInits(responseInit, {
			headers: {
				'set-cookie': await sessionStorage.destroySession(cookieSession),
			},
		}),
	)
}
//------------------- 3. Use the session
export async function loader({ request }: DataFunctionArgs) {
	const userId = await requireUserId(request)
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			_count: {
				select: {
					sessions: {
						where: {
							expirationDate: { gt: new Date() },
						},
					},
				},
			},
		},
	})

	invariantResponse(user, 'User not found', { status: 404 })

	return json({ user })
}
function SignOutOfSessions() {
	const data = useLoaderData<typeof loader>()
	const dc = useDoubleCheck()

	const fetcher = useFetcher<typeof signOutOfSessionsAction>()
	const otherSessionsCount = data.user._count.sessions - 1
	return (
		<div>
			{otherSessionsCount ? (
				// JSX
			) : (
				// More JSX
			)}
		</div>
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

## TOTP (time-based one-time password)
- An alternative to setting a [[Frontend/Network/Data Transfer#Rate Limiting |rate limit]] for your authentication codes is to use TOTP. Libraries like [@epic-web/totp](https://npm.im/@epic-web/totp) are made for this. You need to verify the code the user submits with *the same settings* you used to generate the code. We'll start with creating a model to save all this information in the database when we generate the code:
  ```cs
model Verification {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())

  /// The type of verification, e.g. "email" or "phone"
  type String

  /// The thing we're trying to verify, e.g. a user's email or phone number
  target String

  /// The secret key used to generate the otp
  secret String

  /// The algorithm used to generate the otp
  algorithm String

  /// The number of digits in the otp
  digits Int

  /// The number of seconds the otp is valid for
  period Int

  /// The valid characters for the otp
  charSet String

  /// When it's safe to delete this verification
  expiresAt DateTime?

// `@@unique` does include the functionality of `@@index` (which implicitly creates an index for faster lookups by the fields specified), but in addition to indexing, it also enforces attempting to create a duplicate record would result in an error. (i.e. only 1 OTP code is valid at a time for an "email" or "phone" type). This constraint will generate a `target_type` field when you access the `where` clause in your `prisma.verification` expression 
  @@unique([target, type])
}
```
   
And then generate the OTP code and send it with the email:
```ts
//---------------------- signup.tsx
import { generateTOTP, verifyTOTP } from '@epic-web/totp'
import { sendEmail } from '#app/utils/email.server.ts'
import { codeQueryParam, targetQueryParam, typeQueryParam } from './verify.tsx'

export async function action({ request }: ActionFunctionArgs) {
// This will give you an object that has the otp you can email to the user and all the verification config which you'll save in the db 
	const { otp, ...verificationConfig } = generateTOTP({
		algorithm: 'SHA256',
		period: 10 * 60,
	})

// use `getDomainUrl(request)` to get the domain to redirect the user
	const redirectToUrl = new URL(${getDomainUrl(request)}/verify)

// Building the "Redirect URL"
	redirectToUrl.searchParams.set(targetQueryParam, email)

	const type = 'onboarding'
	redirectToUrl.searchParams.set(typeQueryParam, type)

// The verification email contains this URL with a pre-filled `otp` code (More details in the `### Auto verify` section below)
	const verifyUrl = new URL(redirectToUrl)
	verifyUrl.searchParams.set(codeQueryParam, otp)

	const verificationData = {
		// set the type to "onboarding" and target to the user's email
		type,
		target: email,
		...verificationConfig,
		// set the expiresAt to a date 10 minutes in the future
		expiresAt: new Date(Date.now() + verificationConfig.period * 1000),
	}
	// insert & update a verification with the verification config
	await prisma.verification.upsert({
		where: { target_type: { target: email, type } },
		update: verificationData,
		create: verificationData,
	})

	// send the verification email to the user
	const response = await sendEmail({
		to: email,
		subject: Welcome to Epic Notes!,
		text: "Here's your code: ${otp}. Or open this: ${verifyUrl.toString()}",
	})

	if (response.status === 'success') {
		return redirect(redirectToUrl.toString())
	} else {
		// Return a `json` with an error status
	}
}

//---------------------- verify.tsx
import { verifyTOTP } from '@epic-web/totp'
import { verifySessionStorage } from '#app/utils/verification.server.ts'

export const codeQueryParam = 'code'
export const targetQueryParam = 'target'
export const typeQueryParam = 'type'

const types = ['onboarding'] as const
const VerificationTypeSchema = z.enum(types)
const VerifySchema = z.object({
	[codeQueryParam]: z.string().min(6).max(6),
	[typeQueryParam]: VerificationTypeSchema,
	[targetQueryParam]: z.string(),
})

async function validateRequest(
	request: Request,
	body: URLSearchParams | FormData,
) {
	const submission = await parse(body, {
		schema: () =>
			VerifySchema.superRefine(async (data, ctx) => {
				const verification = await prisma.verification.findUnique({
					select: {
						secret: true,
						period: true,
						digits: true,
						algorithm: true,
						charSet: true,
					},
					where: {
						target_type: {
							target: data[targetQueryParam],
							type: data[typeQueryParam],
						},
						OR: [{ expiresAt: { gt: new Date() } }, { expiresAt: null }],
					},
				})
				if (!verification) {
					ctx.addIssue({
						path: ['code'],
						code: z.ZodIssueCode.custom,
						message: `Invalid code`,
					})
					return z.NEVER
				}
				const codeIsValid = verifyTOTP({  // << The meat
					otp: data[codeQueryParam],
					...verification,
				})
				if (!codeIsValid) {
					ctx.addIssue({
						path: ['code'],
						code: z.ZodIssueCode.custom,
						message: `Invalid code`,
					})
					return z.NEVER
				}
			}),

		async: true,
	})

	if (!submission.value) {
		return json({ status: 'error', submission } as const, { status: 400 })
	}

	const { value: submissionValue } = submission

// So that only 1 pass of verification is available, e.g. if the user entered the code to verify then the `verifyUrl` in the email will be invalid, and vice versa
	await prisma.verification.delete({
		where: {
			target_type: {
				target: submissionValue[targetQueryParam],
				type: submissionValue[typeQueryParam],
			},
		},
	})

	const verifySession = await verifySessionStorage.getSession(
		request.headers.get('cookie'),
	)
// Using cookie to persist the user's email between routes (in this case, we want to get the user's email so we can pass it to the `/signup` route which is redirected from the `/boarding` route)
	verifySession.set(
		'onBoardingEmail',
		 submission.value[targetQueryParam], // user's email
	)
	return redirect('/onboarding', {
	  headers: {
		'set-cookie': await verifySessionStorage.commitSession(verifySession),
	  },
	})
}
```
### Auto verify
- In addition to sending the code for the user to copy/paste or type in, we can also send them a link that takes them straight to the `/verify` page with the code pre-filled. We can even have the `loader` automatically validate the code without them having to do anything.
> [!info]- You may not want to use this 
>  Some anti-virus software will automatically open links in emails, causing the validate code to be marked as "used" and it's no longer valid, so you may prefer to not auto-validate the code or you may choose to not delete the code once it's been used and just let it expire. Still, the best option is to have both the manual code verification in tandem with the `verifyUrl` as demonstrated in the example above.
## Reset password
- The user's email address acts as the final authority on ownership of the account. They can always recover their account (using TOTP) so long as they have access to their email.
- The recommended flow: `/login` -> Click on "Forgot Password" button -> `/forgot-password` -> `/verify` -> `/reset-password` -> `/login` (with new password). An example:
```tsx
//------------- /login -> /forgot-password
import { prepareVerification } from './verify.tsx'

export async function action({ request }: ActionFunctionArgs) {
//...Some code to check if username or email is valid

	const { verifyUrl, redirectTo, otp } = await prepareVerification({
		period: 10 * 60,
		request,
		type: 'reset-password',
		target: usernameOrEmail,
	})

	const response = await sendEmail({
	  to: user.email,
	  subject: `Epic Notes Password Reset`,
	  react: (
		<ForgotPasswordEmail onboardingUrl={verifyUrl.toString()} otp={otp} />
	  ),
	})

	if (response.status === 'success') {
		return redirect(redirectTo.toString())  // redirect to `/verify`
	} else {
		// return status 500
	}
}

//------------- verify.tsx
// This function is then called in the `action`
async function validateRequest(request: Request, body: URLSearchParams | FormData) {
	//...Same code that handles verification code for signup
	switch (submissionValue[typeQueryParam]) {
		case 'reset-password': {
// Set the `username` to the cookie then forward it to `/reset-password`
			return handleResetPasswordVerification({ request, body, submission })
		}
		case 'onboarding': {
			return handleOnboardingVerification({ request, body, submission })
		}
	}
}

//------------- reset-password.tsx
export async function action({ request }: DataFunctionArgs) {
// `requireResetPasswordusername` is an util function which verifies if it's the right user requesting this password reset to make sure unauthenticated can't get to this route, and returns the corresponding `username` for the password reset
	const resetPasswordUsername = await requireResetPasswordUsername(request)
	const formData = await request.formData()
	const submission = parse(formData, {
		schema: ResetPasswordSchema,
	})
	if (submission.intent !== 'submit') {
		return json({ status: 'idle', submission } as const)
	}
	if (!submission.value?.password) {
		return json({ status: 'error', submission } as const, { status: 400 })
	}

	const { password } = submission.value

// The `resetuserPassword` hashes the new password using `bcrypt` and then update it for the corresponding `username`
	await resetUserPassword({ username: resetPasswordUsername, password })
	const verifySession = await verifySessionStorage.getSession(
		request.headers.get('cookie'),
	)
	return redirect('/login', {
		headers: {
// We're done so it makes sense to destroy the session
			'set-cookie': await verifySessionStorage.destroySession(verifySession),
		},
	})
}
```

# Verification
- Verification helps you to reduce the number of spam accounts made on your site, since you can require that a user verify their email address before they can use it. You need to make sure the only way to verify the information is if the user _actually_ has access to it.
- Email is one of the most common ways to verify a user's identity. It's highly recommended to use [resend](https://resend.com) as a service for this. It's important to have [[Frontend/Network/Data Transfer#Rate Limiting |rate limiting]] for all verification codes that we're receiving from users.
- An authentication flow with email may look like:
	1. The user submits an email to the server
	2. The server creates a verification in the database
	3. The server redirects the user to a `/verify` route
	4. The server sends the code to the user's email address
	5. The user checks their email client for the code
	6. The user submits the code
	7. The server verifies the code with the verification in the database
	8. The server redirects with a cookie
	9. The user proceeds to onboard with a signed cookie identifying them as the owner of the email address their onboarding with
- An example of a `sendEmail` function from the server:
```ts
import { getErrorMessage } from './misc.tsx'

export async function sendEmail(options: {
	to: string
	subject: string
	html?: string
	text: string
}) {
	const from = 'hello@epicstack.dev'

	const email = {
		from,
		...options,
	}

	const response = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		body: JSON.stringify(email),
		headers: {
			Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
			'content-type': 'application/json',
		},
	})
	const data = await response.json()

	if (response.ok) {
		return { status: 'success' } as const
	} else {
		return {
			status: 'error',
			error: getErrorMessage(data),
		} as const
	}
}
```
- Checkout [an example](https://github.com/epicweb-dev/web-auth/tree/main/exercises/10.email/02.solution.mocks) of mocking and asserting a send email flow (`index.ts` -> `server/dev-server.ts` -> `tests/mocks/resend.ts` -> `tests/mocks/index.ts` -> `app/utils/email.server.ts` -> `app/routes/_auth+/signup.tsx > loader()`).
## Reset email
- A common approach is to send a verification to the new address, and once verified, we can change to that new email address, and simply notify the old address that the change has been made. If the user didn't initiate the change, they can contact us and we can revert the change:
```tsx
// The flow is quite similar to "Reset Password", the main difference is in the vreification handling
//------------------ profile.change-email.tsx
export async function handleVerification({ request, submission}: VerifyFunctionArgs) {
	const verifySession = await verifySessionStorage.getSession(
		request.headers.get('Cookie'),
	)
	const newEmail = verifySession.get(newEmailAddressSessionKey)
	
	if (!newEmail) {
		submission.error[''] = [
			'You must submit the code on the same device that requested the email change.',
		]
		return json({ status: 'error', submission } as const, { status: 400 })
	}

	// Get the user's email address before the change so we can notify it of the change
	const preUpdateUser = await prisma.user.findFirstOrThrow({
		select: { email: true },
		where: { id: submission.value.target },
	})

	// Update the user with the new email address where the ID is the submission.value.target
	const user = await prisma.user.update({
		select: { id: true, username: true, email: true },
		where: { id: submission.value.target },
		data: { email: newEmail },
	})

	// Send a notify email to the user's old email
	void sendEmail({
		to: preUpdateUser.email,
		subject: 'Your email was changed',
		react: <EmailChangeNoticeEmail userId={user.id} />,
	})
	
	// Notify the email change was successful and redirect them to their profile page
	throw await redirectWithToast('/settings/profile', {
		title: 'Email Changed',
		type: 'success',
		description: Your email address has been changed to ${user.email},
	},
	// Clean up
	{
	    headers: {
	      'set-ccokie': await verifySessionStorage.destroySession(verifySession),
	   }
	}
  )
}
```
- Another approach which provides better UX more also more complicated is to allow multiple email addresses per user, and allow the user to designate one as primary. Then you can verify the new address before making it primary, and the user can always revert to the old address if they need to. Your GitHub account has an example of this.

# 2FA (Two factor Authentication)
- This method is a way to add an extra layer of security to your user's accounts by requiring them to enter a code from another device (usually their phone) in addition to their username and password. The device is the second "factor" (in addition to the password) that is used to verify the user's identity.
- The main difference from [[Authentication#TOTP (time-based one-time password) |TOTP]] is:
	- It won't have an expiration
	- The period will be much shorter (30 seconds)
	- The code will be generated by the user's 2FA app instead of being sent to them via email
## Enable 2FA
- Here are the steps to enable 2FA:
	1. The user enables 2FA in their account settings
	2. The server creates a "verify verification" meaning a verification that will be used to make sure the user can generate 2FA codes. 
	3. The server provides the user with an Auth URI (and a QR code to make it easy to add to their verification app).
	4. The user scans the QR code to add it to their 2FA app (like 1Password).
	5. The 2FA app generates a 6 digit code that is valid for 30 seconds.
	6. The user submits that code
	7. The server verifies the code
	8. The server upgrades the verification from a "verify" type of verification to a "2FA" verification.
- Code flow example:
```tsx

```
## Verify 2FA
- f
- f
- f
## Disable 2FA
- f
- f

