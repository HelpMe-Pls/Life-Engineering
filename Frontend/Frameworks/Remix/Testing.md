- Manual testing is to manually check your app after making a change and see if everything is behaving as expected. But as your app scales, it's becoming harder to ensure your entire app is working with every change you make, especially when you make a change that affects multiple parts of the app.
- Make sure you don't impact your source code to make it easier to mock. If you're accessing all your data from APIs then you'll likely spend a lot more time mocking things out using [a tool](https://mswjs.io/) capable of unobtrusively [[Frontend/Frameworks/Remix/Testing#Mocking requests |intercepting HTTP]] requests made by your app.
 - Checkout the [Best practices](https://kentcdodds.com/blog/avoid-nesting-when-youre-testing).
 > The more your tests resemble the way your software is used, the more confidence they can give you.
---
# E2E (End-to-End) testing
- Think about the way you're current manually testing your app. An "End to End test" is just doing that with an [automation tool](https://playwright.dev/docs/intro).
- Your tests should be as self-contained as possible so that it won't depend on or interfere with production data, i.e. creating the data you need for your tests to run when they run ***and clean them up** after the test is done*.
- The tests themselves should also be isolated, i.e. each test should be able to run in any order, and the results should be the same. 
> It's best practice to have each test handle its own setup and cleanup by using [fixtures](https://playwright.dev/docs/test-fixtures#introduction).
- Code example:
```tsx
// The test flow is guided by `await page.*` for mocking actions or waiting for something to show up, and `await.expect(...)` for asserting something to be (or not to be) in its place.
// The "roles" that we're getting from `getByRole` is from inspecting the Accessibility in the Playwright test page 
// With this test, any time we make changes to the search page (or components the search page uses), we'll have confidence we didn't break the experience

//-------------- test.e2e.search.test.ts
// Testing the "Search" flow
import { test as base } from '@playwright/test'
import { prisma } from '#app/utils/db.server.ts'
import { createUser } from '../db-utils.ts'

// Creating a fixture
const test = base.extend<{
	insertNewUser(): Promise<{
		id: string
		name: string | null
		username: string
	}>
}>({
	insertNewUser: async ({}, use) => {
		let userId: string | undefined = undefined
		await use(async () => {
			const userData = createUser()
			const newUser = await prisma.user.create({
				select: { id: true, name: true, username: true },
				data: userData,
			})
			userId = newUser.id
			return newUser
		})
		// Cleanup: To make sure that the `mockUser` is deleted even if the test isn't fully executed (e.g. some unexpected error along the flow)
		await prisma.user.deleteMany({ where: { id: userId } })
	},
})
const { expect } = test

test('Search from home page', async ({ page, insertNewUser }) => {
  // Get the test to be self-contained by creating a mockUser
  const mockUser = await insertNewUser()
	
  // Go to the home page ("/")
  await page.goto('/')
  
  // Fill in the search box with the username (its implicit role is "searchbox" and it's named "search")
  await page.getByRole('searchbox', { name: /search/i }).fill(mockUser.username)
  
  // Click the search button (it's named "search")
  await page.getByRole('button', { name: /search/i }).click()
  
  // Wait for the right URL to be loaded (page.waitForURL)
  // In this case, it made a lot of sense to make this assertion because the end user want to be able to bookmark stuff
  await page.waitForURL(`/users?${new URLSearchParams({ search: newUser.username })}`)
  
  // Assert that the text "Epic Notes Users" is visible
  await expect(page.getByText('Epic Notes Users')).toBeVisible()
  
  // Get the list of users and assert that there's only one user you're looking for a "list" element, but we've got others on the page
  const userList = page.getByRole('main').getByRole('list')
  // Then from there, you can chain another query to get the "listitems" inside the list
  await expect(userList.getByRole('listitem')).toHaveCount(1)
  
  // Assert that the image with alt text that user is visible 
  await expect(page.getByAltText(mockUser.name ?? mockUser.username)).toBeVisible()
  
  // Fill in the search box with "_nonexistent_" (that shouldn't match anyone)
  await page.getByRole('searchbox', { name: /search/i }).fill('_nonexistent_')
  
  // Click the search button
  await page.getByRole('button', { name: /search/i }).click()
  
  // Wait for the URL to be "/users?search=__nonexistent__"
  await page.waitForURL(/users?search=__nonexistent__)
  
  // Get the list of users and assert that there are no users (query for the listitem and assert not.toBeVisible())
  await expect(userList.getByRole('listitem')).not.toBeVisible()

  // Assert that the text "no users found" is visible
  await expect(page.getByText(/no users found/i)).toBeVisible()
})
```

## E2E Mocking
- It's a good idea to fake out certain things when testing. *Especially third parties*. And this isn't just a good idea for testing, it's also good for development as well. ==**Just make sure you don't impact your source code just to make it easier to mock**==.
- Cases where you need to mock things in an E2E is not that common, because we can't easily communicate between the testing server and our app server because they are running in different processes. E2E tests should be applied for happy path user flows, and leave the edge cases to be handled by integration tests with [Vitest](https://vitest.dev/guide). But when we need to mock in E2E tests, the best way to communicate is through the file system.
- Code example:
```ts
//------------- tests/mocks/resend.ts
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { faker } from '@faker-js/faker'
import fsExtra from 'fs-extra'
import { HttpResponse, http, type HttpHandler } from 'msw'
import { z } from 'zod'

const { json } = HttpResponse

const EmailSchema = z.object({
	to: z.string(),
	from: z.string(),
	subject: z.string(),
	text: z.string(),
	html: z.string().optional(),
})

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const emailFixturesDirPath = path.join(__dirname, '..', 'fixtures', 'email')
await fsExtra.ensureDir(emailFixturesDirPath)

// This function is then called in the mocking process, check out the file below
export async function requireEmail(recipient: string) {
	// Step 2: Read from fs
	const email = await fsExtra.readJSON(
		path.join(emailFixturesDirPath, `${recipient}.json`),
	)
	return EmailSchema.parse(email)
}

// This function is then used to setup the testing server 
export const handlers: Array<HttpHandler> = [
	http.post(`https://api.resend.com/emails`, async ({ request }) => {
		const email = EmailSchema.parse(await request.json())
		console.info('🔶 mocked email contents:', email)
	
	// Step 1: Write to fs
		await fsExtra.writeJSON(
			path.join(emailFixturesDirPath, `./${email.to}.json`),
			email,
		)

		return json({
			id: faker.string.uuid(),
			from: email.from,
			to: email.to,
			created_at: new Date().toISOString(),
		})
	}),
]

//------------------- tests/e2e/onboarding.test.ts
import { requireEmail } from '#tests/mocks/resend.ts'

test('onboarding with link', async ({ page, getOnboardingData }) => {
	const onboardingData = getOnboardingData()

	// Other steps...

	// The meat:
	const email = await waitFor(() => requireEmail(onboardingData.email))

	// Usage example:
	expect(email.to).toBe(onboardingData.email.toLowerCase())
	expect(email.from).toBe('hello@epicstack.dev')
	expect(email.subject).toMatch(/welcome/i)
	const onboardingUrl = extractUrl(email.text)
	invariant(onboardingUrl, 'Onboarding URL not found')
	await page.goto(onboardingUrl)

	// Other steps...
})
```
## E2E Authentication
- In most apps, this involves setting a [cookie](https://playwright.dev/docs/api/class-browsercontext#browser-context-add-cookies) in the Playwright page. The steps are:
	1. Create a new user
	2. Create a session for that user
	3. Create a cookie for that session
	4. Get that cookie value from the `set-cookie` header:
		- Our tested application utilities are all about creating `set-cookie` headers *for a response*, not cookie headers for a request; but in our test, we're mocking the behavior from a request, so to work around this, we're using the `set-cookie-parser`
	5. Put that `cookie` value into the page via `page.context().addCookies`
- Code example:
```ts
import * as setCookieParser from 'set-cookie-parser'
import { expect, test } from '#tests/playwright-utils.ts'

test('Users can add 2FA to their account and use it when logging in', async ({
	page,
	insertNewUser,
}) => {
	const password = faker.internet.password()

	// Step 1
	const user = await insertNewUser({ password })
	invariant(user.name, 'User name is not defined')

	// Step 2
	const session = await prisma.session.create({
		data: {
			expirationDate: getSessionExpirationDate(),
			userId: user.id,
		},
		select: { id: true },
	})
	const cookieSession = await sessionStorage.getSession()

	// Step 3
	cookieSession.set(sessionKey, session.id)

	// Step 4.1
	// This `await` only returns the `set-cookie` for the `header` ON THE SERVER
	const setCookieHeader =	await sessionStorage.commitSession(cookieSession),
	// Step 4.2
	// We're using the `setCookieParser` to parse the `setCookieHeader` from the server into a format (the whole cookie that would be included in requests) that can be used BY THE CLIENT (because our test is performing on the client)
	const cookieConfig = setCookieParser.parseString(setCookieHeader) as any // as `any` because the shape of the cookie could be dynamic, and we're too lazy to assert that, so...yeh, it is what it is

	// Step 5
	await page.context().addCookies([{ ...cookieConfig, domain: 'localhost' }])

	// The rest of the flow
	await page.goto('/settings/profile')

	await page.getByRole('link', { name: /enable 2fa/i }).click()

	await expect(page).toHaveURL('/settings/profile/two-factor')
	const main = page.getByRole('main')
	await main.getByRole('button', { name: /enable 2fa/i }).click()
})
```

# Integration test
## Testing in Remix app
- Use an utility called [`createRemixStub`](https://remix.run/docs/en/main/utils/create-remix-stub) which allows you to create a mini-Remix app that you can render in your test and have all the routes you need for testing the component.
- Code example:
```tsx
/**
 * @vitest-environment jsdom
 */
import { faker } from '@faker-js/faker'
import { json } from '@remix-run/node'
import { createRemixStub } from '@remix-run/testing'
import { render, screen } from '@testing-library/react'
import { AuthenticityTokenProvider } from 'remix-utils/csrf/react'
import { test } from 'vitest'
import { type loader as rootLoader } from '#app/root.tsx'
import { honeypot } from '#app/utils/honeypot.server.ts'
import { default as UsernameRoute, type loader } from './$username.tsx'

// You can also create a real user in the db for this test, but REMEMBER to cleanup after that
function createFakeUser() {
	const user = {
		id: faker.string.uuid(),
		name: faker.person.fullName(),
		username: faker.internet.userName(),
		createdAt: faker.date.past(),
		image: {
			id: faker.string.uuid(),
		},
	}
	return user
}

// If you decided to create a real user for testing, you can follow the steps (to step 4) in the E2E example, and then get the cookie's `header` instead of the whole cookie like:
//const cookieHeader = new URLSearchParams({
//    [parsedCookie.name]: parsedCookie.value,
//}).toString()

test('The user profile when NOT logged in as self', async () => {
	const user = createFakeUser()
	const App = createRemixStub([
		{
			path: '/users/:username',
			Component: UsernameRoute,
			// If you're creating a testing `user` in the db for this test, then you can use the real `loader` as-is instead of mocking it like this
 			loader(): Awaited<ReturnType<typeof loader>> {
				return json({
					user,
					userJoinedDisplay: user.createdAt.toLocaleDateString(),
				})
			},
			// Use the `loader` as-is like:
			// loader,
		},
	])

	const routeUrl = `/users/${user.username}`
	await render(<App initialEntries={[routeUrl]} />, {
		wrapper: ({ children }) => (
			<AuthenticityTokenProvider token="test-csrf-token">
				{children}
			</AuthenticityTokenProvider>
		),
	})

	await screen.findByRole('heading', { level: 1, name: user.name })
	await screen.findByRole('img', { name: user.name })
	await screen.findByRole('link', { name: `${user.name}'s notes` })
})

test('The user profile when logged in as self', async () => {
	const user = createFakeUser()
	const App = createRemixStub([
		{
// Because this test relies on an util that's basically like:
// `const data = useRouteLoaderData<typeof rootLoader>('root')`
// So that's why we're specifying the `id: 'root' here`
			id: 'root',
// Using the root route as the parent of the `username` route so we can provide the the `username` route with the root's `loader` data.
			path: '/', 
			loader(): Awaited<ReturnType<typeof rootLoader>> {
				const honeyProps = honeypot.getInputProps()
				return json({
					ENV: { MODE: 'test' },
					theme: 'light',
					username: 'testuser',
					toast: null,
					user: { // << The meat
						...user,
						roles: [],
					},
					csrfToken: 'test-csrf-token',
					honeyProps,
				})
			},
			children: [
				{
					path: 'users/:username',
					Component: UsernameRoute,
					loader(): Awaited<ReturnType<typeof loader>> {
						return json({
							user,
							userJoinedDisplay: user.createdAt.toLocaleDateString(),
						})
					},
					// If we're using the real `loader` instead of a mocked `typeof loader>` version of it, we can save the mocked `user` session to a cookie (checkout the comment above), and then get that session like:
				//   loader: async args => {
				//      args.request.headers.set('cookie', cookieHeader)
				//      return loader(args)
				//   }, 
				},
			],
		},
	])

	const routeUrl = `/users/${user.username}`
	await render(<App initialEntries={[routeUrl]} />, {
		wrapper: ({ children }) => (
			<AuthenticityTokenProvider token="test-csrf-token">
				{children}
			</AuthenticityTokenProvider>
		),
	})

	await screen.findByRole('heading', { level: 1, name: user.name })
	await screen.findByRole('img', { name: user.name })
	await screen.findByRole('button', { name: /logout/i })
	await screen.findByRole('link', { name: /my notes/i })
	await screen.findByRole('link', { name: /edit profile/i })
})
```
## Mocking requests
- Third party integrations made a very good case for mocking requests due to these reasons:
	1. If their system goes down, your tests will be completely broken.
	2. During development, you're reliant on their progress if they're actively working on their end of the integration.
	3. You can't work offline if you're reliant on their system.
	4. Their APIs (may) costs money.
- It's much better to have an established process (or production monitoring) to identify when the integration is broken. That way you can safely mock for local development and testing while still being confident it will work in production.
- Code example:
```tsx
import { faker } from '@faker-js/faker'
import { http } from 'msw'
import * as setCookieParser from 'set-cookie-parser'
import { afterEach, expect, test } from 'vitest'
import { connectionSessionStorage } from '#app/utils/connections.server.ts'
import { invariant } from '#app/utils/misc.tsx'
import { server } from '#tests/mocks/index.ts'
import { consoleError } from '#tests/setup/setup-test-env.ts'
import { loader } from './auth.$provider.callback.ts'

const ROUTE_PATH = '/auth/github/callback'
const PARAMS = { provider: 'github' }
const BASE_URL = 'https://www.epicstack.dev'

// Resets all runtime request handlers added by `server.use`
afterEach(() => {
	server.resetHandlers()
})

test('a new user goes to onboarding', async () => {
	const request = await setupRequest()
	
// The actual thing that we're testing
	const response = await loader({ request, params: PARAMS, context: {} })
	assertRedirect(response, '/onboarding/github')
})

test('when auth fails, send the user to login with a toast', async () => {
	consoleError.mockImplementation(() => {})
	server.use(
		http.post('https://github.com/login/oauth/access_token', async () => {  // Mocking a failed Response
			return new Response('error', { status: 400 })
		}),
	)
	const request = await setupRequest()
	const response = await loader({ request, params: PARAMS, context: {} }).catch(err => err) // turns that thrown response into just a resolved response
	invariant(response instanceof Response, 'the response should be of the Response type')
	assertRedirect(response, '/login')
	assertToastSent(response)
	expect(consoleError).toHaveBeenCalledTimes(1)
})

// Util function to conform best practices in testing by abstracting repeated code
async function setupRequest() {
	const url = new URL(ROUTE_PATH, BASE_URL)
	const state = faker.string.uuid()
	const code = faker.string.uuid()
	url.searchParams.set('state', state)
	url.searchParams.set('code', code)

	const connectionSession = await connectionSessionStorage.getSession()
	connectionSession.set('oauth2:state', state)
	const connectionSetCookieHeader =
		await connectionSessionStorage.commitSession(connectionSession)
	const request = new Request(url.toString(), {
		method: 'GET',
		headers: {
			cookie: convertSetCookieToCookie(connectionSetCookieHeader),
		},
	})
	return request
}

function assertToastSent(response: Response) {
	const setCookie = response.headers.get('set-cookie')
	invariant(setCookie, 'set-cookie header should be set')
	const parsedCookie = setCookieParser.splitCookiesString(setCookie)
	expect(parsedCookie).toEqual(
		expect.arrayContaining([expect.stringContaining('en_toast')]),
	)
}

function assertRedirect(response: Response, redirectTo: string) {
	expect(response.status).toBeGreaterThanOrEqual(300)
	expect(response.status).toBeLessThan(400)
	expect(response.headers.get('location')).toBe(redirectTo)
}

// An util function to parse the `set-cookie` header from the server into a format that can be used by the client
function convertSetCookieToCookie(setCookie: string) {
	const parsedCookie = setCookieParser.parseString(setCookie)
	return new URLSearchParams({
		[parsedCookie.name]: parsedCookie.value,
	}).toString()
}
```

# Unit testing
- Unit testing comes in handy when you have a complicated utility function that:
	1. Really complex and has many edge cases
	2. Widely used and would therefore be disastrous if it broke
- Testing pure functions (functions that don't have side effects) is often much more straightforward. But if you have a really complex bit of logic that can't be reasonably broken down into smaller functions, you can still test at this lower level by mocking the functions and modules it uses. Mocking `http` requests or establishing a test database is often necessary.
- To have your unit test clean (i.e. not being polluted with logs from your application), and to not violating the rule of "modifying what being tested just to make the test pass" (i.e. preserving the logs in the tested functions), we can use a [spy](https://vitest.dev/api/vi.html#vi-spyon) to mock the logs. A spy is a function that records how it was called. And we can also change its implementation. 
- Code example:
```ts
//------------------ app/utils/misc.tsx
// We're going to test this function in the file below
export function getErrorMessage(error: unknown) {
	if (typeof error === 'string') return error
	if (
		error &&
		typeof error === 'object' &&
		'message' in error &&
		typeof error.message === 'string'
	) {
		return error.message
	}
	console.error('Unable to get error message for error', error)
	return 'Unknown Error'
}

//------------------ app/utils/misc.error-message.test.ts
import { faker } from '@faker-js/faker'
import { expect, test, vi } from 'vitest'
import { getErrorMessage } from './misc.tsx'

test('Error object returns message', () => {
	const message = faker.lorem.words(6)
	expect(getErrorMessage(new Error(message))).toBe(message)
})

test('String returns itself', () => {
	const message = faker.lorem.words(9)
	expect(getErrorMessage(message)).toBe(message)
})

test('undefined falls back to Unknown', () => {
    // Mocking the `console.error`
	const consoleError = vi.spyOn(console, 'error')
	consoleError.mockImplementation(() => {})
    // Testing the arguments of your `console.error`
	expect(consoleError).toHaveBeenCalledWith(
		'Unable to get error message for error',
		undefined,
	)
	// Pre-cleanup assertion
	expect(consoleError).toHaveBeenCalledTimes(1) 
	consoleError.mockRestore()  // Clean up so that the logs in the remaining tests aren't affected

    expect(getErrorMessage(undefined)).toBe('Unknown Error')
})

// We can abstract this "Spy" thing to be reusable and remove code duplication across the tests by setting up the tesing env:
//---------------- vitest.config.ts
/// <reference types="vitest" />

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [react()],
	css: { postcss: { plugins: [] } },
	test: {
		include: ['./app/**/*.test.{ts,tsx}'],
		setupFiles: ['./tests/setup/setup-test-env.ts'],  // << This
		restoreMocks: true,
		coverage: {
			include: ['app/**/*.{ts,tsx}'],
			all: true,
		},
	},
})

//---------------- tests/setup/setup-test-env.ts
import 'dotenv/config'
import '#app/utils/env.server.ts'
import { installGlobals } from '@remix-run/node'
import { beforeEach, vi, type SpyInstance } from 'vitest'

installGlobals()

export let consoleError: SpyInstance<Parameters<typeof console.error>>

beforeEach(() => {
	const originalConsoleError = console.error
	consoleError = vi.spyOn(console, 'error')
	consoleError.mockImplementation(
		(...args: Parameters<typeof console.error>) => {
			originalConsoleError(...args)
			throw new Error(
				'Console error was called. Call consoleError.mockImplementation(() => {}) if this is expected.',
			)
		},
	)
})

//--------------- (Updated) app/utils/misc.error-message.test.ts
import { faker } from '@faker-js/faker'
import { expect, test } from 'vitest'
import { consoleError } from '#tests/setup/setup-test-env.ts'
import { getErrorMessage } from './misc.tsx'

// Other tests...
test('undefined falls back to Unknown', () => {
// Notice that we're calling the `.mockImplementation` where we're expecting a `console.error` in the tested code. Without this call, the `Error` in the `beforeEach` util will be thrown
	consoleError.mockImplementation(() => {})
	expect(getErrorMessage(undefined)).toBe('Unknown Error')
	expect(consoleError).toHaveBeenCalledWith(
		'Unable to get error message for error',
		undefined,
	)
	expect(consoleError).toHaveBeenCalledTimes(1)
})
```
>[!Caution]- Clean up after yourself
> - If you run the tests passed individually but failed when you run them together, then you've got a cleanup issue.
> - If you add `test.only` to a failing test and it starts passing, you know that some other test isn't cleaning up properly. If you add `test.only` to a passing test and it starts failing, you know that some other test is setting up state that it's depending on.
> - The best kind of cleanup is the kind that happens automatically, so it makes sense to abstract your cleanups and use them colocating to your tests.
## Component testing
- Using [`testing-library`](https://testing-library.com/docs/queries/about) (which runs in Node), the most common utility to find elements in the DOM is `getByRole`. If you're trying to figure out how to write a query to find an element, use `screen.logTestingPlaygroundURL()` and it will log a URL you can use to open up and inspect the queries for the current DOM.
- When you need to assert on non-existence of elements, use the `queryBy*` or `queryAllBy*` methods. 
- If you want to know what the DOM looks like at any time, you can place (multiple) `screen.debug()` in your test and it will log out the current DOM.
- Code example:
```tsx
/**
 * @vitest-environment jsdom
 */
 // The comment above is called a pragma, which tells the `vitest` server to simulate the DOM env (because the `vitest` is running in Node)
import { faker } from '@faker-js/faker'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import { ErrorList } from './forms.tsx'

// It is what it is
afterEach(() => {
	cleanup()
})

test('shows nothing when given an empty list', async () => {
	await render(<ErrorList />)
	expect(screen.queryAllByRole('listitem')).toHaveLength(0)
})

test('shows multiple errors', async () => {
	const errors = [faker.lorem.words(3), faker.lorem.words(3)]
	await render(<ErrorList errors={errors} />)
	const errorEls = screen.getAllByRole('listitem')
	expect(errorEls.map(e => e.textContent)).toEqual(errors)
})

test('adds id to the ul', async () => {
	const id = faker.lorem.word()
	await render(<ErrorList id={id} errors={[faker.lorem.words(3)]} />)
	const ul = screen.getByRole('list')
	expect(ul).toHaveAttribute('id', id)
})
```
### Testing React hooks
- What makes it special regarding testing is if you try to call a hook outside of a React component, React doesn't know what to do with it and will error out on you. So `@testing-library/react` has a special function called [`renderHook`](https://testing-library.com/docs/react-testing-library/api#renderhook) that allows you to test a hook in isolation.
- Code example:
```tsx
//------------------------- app/utils/misc.tsx
function callAll<Args extends Array<unknown>>(
	...fns: Array<((...args: Args) => unknown) | undefined>
) {
	return (...args: Args) => fns.forEach(fn => fn?.(...args))
}

/**
 * Use this hook with a button and it will make it so the first click sets a
 * `doubleCheck` state to true, and the second click will actually trigger the
 * `onClick` handler. This allows you to have a button that can be like a
 * "are you sure?" experience for the user before doing destructive operations.
 */
export function useDoubleCheck() {
	const [doubleCheck, setDoubleCheck] = useState(false)

	function getButtonProps(
		props?: React.ButtonHTMLAttributes<HTMLButtonElement>,
	) {
		const onBlur: React.ButtonHTMLAttributes<HTMLButtonElement>['onBlur'] =
			() => setDoubleCheck(false)
		const onClick: React.ButtonHTMLAttributes<HTMLButtonElement>['onClick'] =
			doubleCheck
				? undefined
				: e => {
						e.preventDefault()
						setDoubleCheck(true)
				  }
		const onKeyUp: React.ButtonHTMLAttributes<HTMLButtonElement>['onKeyUp'] =
			e => {
				if (e.key === 'Escape') {
					setDoubleCheck(false)
				}
			}
		return {
			...props,
			onBlur: callAll(onBlur, props?.onBlur),
			onClick: callAll(onClick, props?.onClick),
			onKeyUp: callAll(onKeyUp, props?.onKeyUp),
		}
	}

	return { doubleCheck, getButtonProps }
}

//------------------------- app/utils/misc.use-double-check.test.tsx
/**
 * @vitest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react'
import { expect, vi, test } from 'vitest'
import { useDoubleCheck } from './misc.tsx'

test('hook: prevents default on the first click, and does not on the second', async () => {
	const { result } = await renderHook(() => useDoubleCheck())
// Be sure to always reference values off of `result.current`. Do NOT destructure values off of it (e.g. `const { doubleCheck } = result.current`) and then reference them because that will lead you to referencing stale values and your tests won't work reliably.	
	expect(result.current.doubleCheck).toBe(false)

	// Create a mock function with
	const mockClick = vi.fn()

	// Create a new click event with `new MouseEvent`, because we're not rendering a component, we can't just click a button to call the click handler
	const firstClick = new MouseEvent('click', {
		bubbles: true,
		cancelable: true,
	}) as unknown as React.MouseEvent<HTMLButtonElement>

	// Create props for a button using your `mockClick`
	const buttonProps = result.current.getButtonProps({ onClick: mockClick })

	// See `act` as a way to isolate events that cause state change in React to keep your states fresh & correct. Most of the times its implicitly implemented in the methods of `@testing-library`, so you only need to call it where you manually invoking state-related events in your code (in this case, it's the `setDoubleCheck` call)
	await act(() => buttonProps.onClick(firstClick))

	// Asserting expected behaviors
	expect(mockClick).toHaveBeenCalledTimes(1)
	expect(firstClick.defaultPrevented).toBe(true)

	// Clean up the mock event so it doesn't conflict with the upcoming `secondClick`
	mockClick.mockClear()

	// Same deal
	const secondClick = new MouseEvent('click', {
		bubbles: true,
		cancelable: true,
	}) as unknown as React.MouseEvent<HTMLButtonElement>

	await act(() => buttonProps.onClick(secondClick))
	expect(mockClick).toHaveBeenCalledTimes(1)
	expect(secondClick.defaultPrevented).toBe(true)
})
```
- An alternative of `renderHook` is to create a test component acting as a consumer of the hook you're testing. Sometimes, it just make more sense to use one over the other, so consider your case to use the suitable approach:
```tsx
//------------------------- app/utils/misc.use-double-check.test.tsx
/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { useState } from 'react'
import { expect, test } from 'vitest'
import { useDoubleCheck } from './misc.tsx'

// Setting up a use case for the `useDoubleCheck` hook 
function TestComponent() {
	const [defaultPrevented, setDefaultPrevented] = useState<
		'idle' | 'no' | 'yes'
	>('idle')
	const dc = useDoubleCheck()
	return (
		<div>
			<output role='status'>Default Prevented: {defaultPrevented}</output>
			<button
				{...dc.getButtonProps({
					onClick: e => setDefaultPrevented(e.defaultPrevented ? 'yes' : 'no'),
				})}
			>
				{dc.doubleCheck ? 'You sure?' : 'Click me'}
			</button>
		</div>
	)
}

test('TestComponent: prevents default on the first click, and does not on the second', async () => {
	const user = userEvent.setup()
	await render(<TestComponent />)

	const status = screen.getByRole('status')
	const button = screen.getByRole('button')

	expect(status).toHaveTextContent('Default Prevented: idle')
	expect(button).toHaveTextContent('Click me')

	await user.click(button)
	expect(button).toHaveTextContent('You sure?')
	expect(status).toHaveTextContent('Default Prevented: yes')

	await user.click(button)
	expect(button).toHaveTextContent('You sure?')
	expect(status).toHaveTextContent('Default Prevented: no')
})
```
## Custom matchers
- When abstracting your assertions (checkout `assertRedirect` in this [[Frontend/Frameworks/Remix/Testing#Mocking requests |code example]]), there's a trade-off that if one of those assertions fails, the error message and stack trace will point to the location of the failed assertion **within that abstraction**, *not* the location in the test where it was called. This can make it harder to immediately identify which test was running when the failure occurred.
- A solution to that is to use the [`expect.extend`](https://vitest.dev/guide/extending-matchers.html) API to create a custom matcher, for example, we can refactor [[Frontend/Frameworks/Remix/Testing#Mocking requests |this code example]] to be:
```ts
// Replace the `assertRedirect` with this
expect.extend({
	toHaveRedirect(response: Response, redirectTo: string) {
		const location = response.headers.get('location')
		return {
			// Assertion condition
			pass: location === redirectTo,
			// the error message to show when the test fails
			message: () =>
				`Expected response to redirect to ${this.utils.printExpected(
					redirectTo,
				)} but got ${this.utils.printReceived(location)}`,
		}
	},
})

// Get the typings to work
interface CustomMatchers<R = unknown> {
	toHaveRedirect(redirectTo: string): R
}
declare module 'vitest' {
	interface Assertion<T = any> extends CustomMatchers<T> {}
	interface AsymmetricMatchersContaining extends CustomMatchers {}
}

// Call the custom matcher in your test instead
test('a new user goes to onboarding', async () => {
	const request = await setupRequest()
	const response = await loader({ request, params: PARAMS, context: {} })
	expect(response).toHaveRedirect('/onboarding/github') // << The meat
})
```

# Test database
- If *most of* the connections that you're testing require a database, we can create a special instance of our database for testing purposes. 
- So what we're going to do is create a special file (`db-setup.ts`) we'll import in our test setup (`setup-test-env.ts`) that will manage all of this database setup for us, and import `db-setup.ts` at the top of the test setup file ***before anything else*** has a chance to import `prisma` (otherwise, `prisma` will start up and use our development database).
> Make sure to colocate your test databases and your tests so that the tests are not conflicting with each other.
- Code example:
```ts
//-------------------- tests/setup/db-setup.ts
import path from 'node:path'
import { execaCommand } from 'execa'
import fsExtra from 'fs-extra'
import { afterAll, afterEach, beforeAll } from 'vitest'

// To make sure each test gets its own unique test database
const databaseFile = `./tests/prisma/data.${process.env.VITEST_POOL_ID || 0}.db`
const databasePath = path.join(process.cwd(), databaseFile)
process.env.DATABASE_URL = `file:${databasePath}`  // << The meat

beforeAll(async () => {
// To reset the database before all the tests start. We can skip seeding because we don't need (or want) to assume there's any existing data other than what our migrations apply. The `--skip-generate` is important because we don't want to mess up our development client.
	await execaCommand(
		'prisma migrate reset --force --skip-seed --skip-generate',
		{ stdio: 'inherit' },
	)
})

// With these cleanups, we no longer need to manually cleanup in the individual tests anymore
afterEach(async () => {
// Dynamic import here to make sure we're setting the `DATABASE_URL` BEFORE using `prisma`
	const { prisma } = await import('#app/utils/db.server.ts')
	await prisma.user.deleteMany()
})

afterAll(async () => {
	const { prisma } = await import('#app/utils/db.server.ts')
	await prisma.$disconnect()
	await fsExtra.remove(databasePath)
})

//-------------------- tests/setup/setup-test-env.ts
import 'dotenv/config'
import './db-setup.ts'  //<< The meat. Notice the import order of this. It should be placed before other imports
import '#app/utils/env.server.ts'
import '@testing-library/jest-dom/vitest'
import { installGlobals } from '@remix-run/node'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi, type SpyInstance } from 'vitest'
import { server } from '../mocks/index.ts'
import './custom-matchers.ts'

installGlobals()

afterEach(() => server.resetHandlers())
afterEach(() => cleanup())

export let consoleError: SpyInstance<Parameters<typeof console.error>>

beforeEach(() => {
	const originalConsoleError = console.error
	consoleError = vi.spyOn(console, 'error')
	consoleError.mockImplementation(
		(...args: Parameters<typeof console.error>) => {
			originalConsoleError(...args)
			throw new Error(
				'Console error was called. Call consoleError.mockImplementation(() => {}) if this is expected.',
			)
		},
	)
})
```
- To speed up the process of creating and cleaning up databases for the tests, we can make a "base" database and *then copy it* for each test run. We just need to make sure to get our base database [set up](https://vitest.dev/config/#globalsetup) **_before any_** of the test processes run, so when they are spawned, the "base" database is ready to be copied:
```ts
//------------------ vitest.config.ts
/// <reference types="vitest" />

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [react()],
	css: { postcss: { plugins: [] } },
	test: {
		include: ['./app/**/*.test.{ts,tsx}'],
		setupFiles: ['./tests/setup/setup-test-env.ts'],
		globalSetup: ['./tests/setup/global-setup.ts'], // << The meat
		restoreMocks: true,
		coverage: {
			include: ['app/**/*.{ts,tsx}'],
			all: true,
		},
	},
})

//----------------- tests/setup/global-setup.ts
import path from 'node:path'
import { execaCommand } from 'execa'
import fsExtra from 'fs-extra'

export const BASE_DATABASE_PATH = path.join(
	process.cwd(),
	`./tests/prisma/base.db`,
)

export async function setup() {
	const databaseExists = await fsExtra.pathExists(BASE_DATABASE_PATH)
	if (databaseExists) return

	await execaCommand(
		'prisma migrate reset --force --skip-seed --skip-generate',
		{
			stdio: 'inherit',
			env: {
				...process.env,
				// The meat:
				DATABASE_URL: `file:${BASE_DATABASE_PATH}`,
			},
		},
	)
}

//----------------- tests/setup/db-setup.ts
// Everything else is the same as the example above, but for the `beforeAll`, we're applying the commands in the `global-setup.ts` instead:
import { BASE_DATABASE_PATH } from './global-setup.ts'

beforeAll(async () => {
// Copy the "base" database for each test run
	await fsExtra.copyFile(BASE_DATABASE_PATH, databasePath)
})
```