# `<Meta/>
- The [`<Meta />`](https://remix.run/docs/en/main/components/meta) component is placed in the `<head>` of your document in your `app/root.tsx` to render all of the *corresponding* `<meta>` tags created by your route module [`meta`](https://remix.run/docs/en/main/route/meta) export:
```tsx
// These `<meta/>` tags are rendered in the `<head/>` of your document. The first 2 `<meta/>`s are fixed in `app/root.tsx`, and the `<title/>` and last one is dynamically returned from the corresponding currently active route (in this case, `app/routes/sandwiches.$sandwichId.tsx`):
<title>Sandwich Shop</title>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="description" content="Fill your tummy with something yummy" />

// In `app/routes/sandwiches.$sandwichId.tsx`:
import { json } from '@remix-run/node'
import { type MetaFunction } from '@remix-run/react'
import { getSandwich } from '../sandwiches.server'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: data.sandwich.name },
		{ name: 'description', content: data.sandwich.description },
	]
}

export function loader({ params }) {
	return json({ sandwich: getSandwich(params.sandwichId) })
}
```

## Get dynamic data from parent route
- Instead of adding more data to the current `loader` of the route to use them as runtime evaluated values, look around and see if those data is already defined in the parent route. If that's the case, you can utilize TS generics to get those data:
```tsx
// In `routes/users+/$username_+/notes.$noteId.tsx`, its parent route is `routes/users+/$username_+/notes.tsx`:
export const meta: MetaFunction<
	typeof loader, // for `data`, where `loader` is the corresponding one of this route
	{ 'routes/users+/$username_+/notes': typeof notesLoader } // for `matches`, where `notesLoader` is the `loader` from the parent route 
> = ({ data, params, matches }) => {
    // Now `notesMatch` has `typeof notesLoader`
	const notesMatch = matches.find(
		m => m.id === 'routes/users+/$username_+/notes',
	)
	const displayName = notesMatch?.data?.owner.name ?? params.username
	// `data` has `typeof loader`
	const noteTitle = data?.note.title ?? 'Note'
	const noteContentsSummary =
		data && data.note.content.length > 100
			? data?.note.content.slice(0, 97) + '...'
			: 'No content'
	return [
		{ title: `${noteTitle} | ${displayName}'s Notes | Epic Notes` },
		{
			name: 'description',
			content: noteContentsSummary,
		},
	]
}
```