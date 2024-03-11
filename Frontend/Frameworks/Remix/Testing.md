- Manual testing is to manually check your app after making a change and see if everything is behaving as expected. But as your app scales, it's becoming harder to ensure your entire app is working with every change you make, especially when you make a change that affects multiple parts of the app.
- Make sure you don't impact your source code to make it easier to mock. This is why it's great to have [a tool](https://mswjs.io/) capable of unobtrusively intercepting HTTP requests made by your app.
 > The more your tests resemble the way your software is used, the more confidence they can give you.
---
# E2E (End-to-End) testing
- Think about the way you're current manually testing your app. An "End to End test" is just doing that with an [automation tool](https://playwright.dev/docs/intro).
- Your tests should be as self-contained as possible so that it won't depend on or interfere with production data, i.e. creating the data you need for your tests to run when they run.
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
		// To make sure that the mockUser is deleted even if the test isn't fully executed (e.g. some unexpected error along the flow)
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
- It's a good idea to fake out certain things when testing. Especially third parties. And this isn't just a good idea for testing, it's also a good idea for development as well. Just make sure you don't impact your source code to make it easier to mock.
- Cases where you need to mock things in an E2E is not that common, because we can't easily communicate between the testing server and our app server because they are running in different processes. E2E tests should on happy path user flows and edge cases are handled by integration tests with [Vitest](https://vitest.dev/guide). But when we need it, the best way to communicate is through the file system.
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
	4. Get that cookie value from the `set-cookie` header
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

	// Step 4
	// We're using the `setCookieParser` to parse the `set-cookie` header from the server into a format (the whole cookie that would be included in requests) that can be used by the client (because our test is performing on the client)
	const cookieConfig = setCookieParser.parseString(
	// This `await` only returns the `header` for the `set-cookie` on the server
		await sessionStorage.commitSession(cookieSession),
	) as any

	// Step 5
	await page.context().addCookies([{ ...cookieConfig, domain: 'localhost' }])

	// The rest of the flow
	await page.goto('/settings/profile')

	await page.getByRole('link', { name: /enable 2fa/i }).click()

	await expect(page).toHaveURL(/settings/profile/two-factor)
	const main = page.getByRole('main')
	await main.getByRole('button', { name: /enable 2fa/i }).click()
})
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
