- Next.js does code splitting automatically, so each page only loads what’s necessary for that page.
- It means that pages become isolated. If a certain page throws an error, the rest of the application would still work.
- By default, Next.js **pre-renders** every page. This means that Next.js generates HTML for each page in advance and can be served from a CDN geographically closer to the user, instead of having it **all** done by client-side JavaScript. Pre-rendering can result in better performance and SEO.
- In a production build of Next.js, whenever [`Link`](https://nextjs.org/docs/api-reference/next/link) components appear in the browser’s viewport, Next.js automatically **prefetches** the code for the corresponding linked page in the background.
---

# Next $\geqslant$ 13
- As of React v18++, it can render on the client *and* the server, meaning you can choose the rendering environment at the component level.
- You may noticed that the majority of components are ***non-interactive*** (static) and can be ***fully rendered on the server*** as Server Components (SC). For smaller pieces of *interactive* UI, we can _sprinkle in_ Client Components (CC - which are **pre**rendered (with HTML-CSS) on the server *and then* hydrated (with JS) on the client).
- SCs allow you to move data fetching to the server - closer to your database - reducing both the back-and-forth communication between client and server; keep sensitive information on the server (access tokens, API keys,...) and keep large dependencies that previously would impact the client JavaScript bundle size on the server, leading to improved performance.
> Since **SCs *are the default***, all components are part of the SC module graph **unless** defined as a CC (i.e. imported in a module that ***STARTS WITH*** the `"use client"` directive).
- `"use client"` does **not** mean client side rendering. The content (HTML & CSS) is still going to be prerendered *on the server* (just like with `pages` directory) and you'll also get the benefit of interactivity with JavaScript on the client, while SCs are only HTML & CSS, no interactivity added.
- For CC: `"use client"` does **not** need to be defined in every file. The Client module boundary only needs to be [defined once](https://nextjs.org/docs/getting-started/react-essentials#rendering-third-party-context-providers-in-server-components), at the "entry point", for all modules imported into it (including child components) to be considered a CC.
- [Project structure](https://nextjs.org/docs/app/building-your-application/routing/colocation). Use the [Module Path Aliases](https://nextjs.org/docs/app/building-your-application/configuring/absolute-imports-and-module-aliases) to make it easier to read and maintain imports across *deeply nested* project files.

## Routing
- By default, the [app router](https://nextjs.org/docs/app/building-your-application/routing#the-app-router) uses SC, allowing you to easily *render components **on the server*** and reducing the amount of JavaScript sent to the client.
- When a route is loaded [with Next.js](https://nextjs.org/docs/pages/api-reference/components/link), the initial HTML is rendered on the server. This HTML is then **progressively enhanced** in the browser, allowing the client to take over the application and add interactivity, (e.g. when a user [navigates](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#link-component) to a new route, the browser will not reload the page. Instead, the URL will be updated and Next.js will only render the segments that change).
- In routes that share a layout, the layout will be preserved when a user navigates [between sibling pages](https://nextjs.org/docs/app/building-your-application/routing#partial-rendering).

### Segments structure
- Folders are used to define routes. Each folder represents a route segment that is mapped to a corresponding segment in a URL path. A nested route is created by nesting folders *inside* each other under the `app` directory.
- This is [[Next#Static routes |similar]] to previous versions of Next.js. However, there's a set of [preserved file names](https://nextjs.org/docs/app/building-your-application/routing#file-conventions) which are used for creating UI with specific behavior in nested routes (e.g. a [`page.js`](https://nextjs.org/docs/app/api-reference/file-conventions/page#props) file is required to make a route segment publicly accessible).
- A layout is UI that is **shared** between multiple pages. On navigation, layouts preserve state, remain interactive, *and do not re-render*. Layouts can also be [nested](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#nesting-layouts).
> The `app` directory **must** include a [root layout](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required). It's a SC by default and ***cannot*** be set to a CC. The root layout is **implicitly implemented** when you define its `children` (same for `template.js`). 
- A [template](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#templates) is a smaller version of layout (i.e. included in the `children` of `layout.js` and wraps the `page.js` for that route and everything nested below). It creates a new instance for each of their children on navigation, which means state is ***not** preserved*, and effects are re-synchronized.
- To omit a specific folder name from the URL segment or to create multiple root layouts, use [route groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups#examples). Use the `_` prefix to omit a folder [and all of its subfolders](https://nextjs.org/docs/app/building-your-application/routing/colocation#private-folders) out of routing.
- To access route segments, you can use [`useSelectedLayoutSegment()`](https://nextjs.org/docs/app/api-reference/functions/use-selected-layout-segment) or [`useSelectedLayoutSegments()`](https://nextjs.org/docs/app/api-reference/functions/use-selected-layout-segments) in a CC.

### Navigation
- You can use [`usePathname()`](https://nextjs.org/docs/app/api-reference/functions/use-pathname#returns) to read the current URL's path.
- For complex route behaviors (e.g. refresh, back, forward,...), use [`useRouter()`](https://nextjs.org/docs/app/api-reference/functions/use-router). For [redirecting](https://nextjs.org/docs/app/api-reference/functions/redirect#redirect).  
- [[Next#getStaticPaths |getStaticPaths]] is replaced with [`generateStaticParams`](https://nextjs.org/docs/app/api-reference/functions/generate-static-params).
- Prefetching is a way to preload a route in the background before it's visited. The rendered result of prefetched routes is added to the router's client-side cache.
	- By default, routes are prefetched as they become visible in the viewport when using the `<Link>` component.
	- Prefetching is only enabled in production.
	- Prefetching can be disabled by passing `prefetch={false}` to `<Link>`.
- Soft navigation is used if the route you are navigating to has been prefetched, and either doesn't include [[Next#Dynamic routes |dynamic segments]] **or** has the *same dynamic parameters* as the current route. Otherwise it's hard navigation (i.e. the server re-fetches data and re-renders the changed segments).
#### Streaming
- Streaming allows you to break down the page's HTML into smaller chunks and progressively send those chunks from the server to the client, allowing parts of the page to be displayed sooner, and show a [loading state](https://nextjs.org/docs/app/api-reference/file-conventions/loading) for parts of the page that are fetching data, without waiting for all the data to load before any UI can be rendered.
- Streaming is particularly beneficial when you want to prevent long data requests from blocking the page from rendering.
- Use the [`<Suspense/>`](https://react.dev/reference/react/Suspense#usage) API and [selective hydration](https://www.patterns.dev/posts/react-selective-hydration) to leverage streaming.
#### Error handling
- The `error.js` file convention allows you to [gracefully](https://nextjs.org/docs/app/building-your-application/routing/error-handling#recovering-from-errors) handle runtime errors.
- Error components must be CCs. If your component follows the [recommended hierarchy](https://nextjs.org/docs/app/building-your-application/routing#component-hierarchy), `error.js` file will handle errors for all its nested child segments. More or less granular error UI can be achieved by placing `error.js` files at different levels in the nested folders of a route.
- If an error is thrown during data fetching or inside a SC, Next.js will forward the resulting `Error` object to the nearest `error.js` file as the `error` prop.
- To handle errors within a specific layout or template, place an `error.js` file in the layouts parent segment.
- To catch errors from the root layout (`app/layout.js`) or root template (`app/template.js`), use the `global-error.js` file. It is recommended that you should still keep the root `error.js` file to catch errors from the routes within `app`:
```tsx
// app/global-error.tsx: 
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
  // The `<html>` and `<body>` tags are REQUIRED for the global error file
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
```

### Advanced techniques
#### Parallel routes
- Parallel Routing allows you to simultaneously or conditionally render [one or more](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes#examples) pages in the *same* layout (visually, those pages are like "slots" in a parent route). Error and loading states for each of them can also be defined independently.
- "Slots" are defined with the `@` prefix for its folder name. 
	- Like [route groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups#examples), the "slots" _do not affect_ the URL structure (e.g. the file path `/@team/members` would be accessible at `/members`). 
	- The "slots" are passed in as props to the parent route. In this example, the component in `app/layout.js` now accepts the `@analytics` and `@team` slots:
```tsx
export default function Layout(props: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  team: React.ReactNode;
}) {
  return (
    <>
      {props.children}
      {props.team}
      {props.analytics}
    </>
  );
}
```
#### Intercepting routes
- Created by using the `(..)` folder prefix. To intercept multiple levels, follow [the convention](https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes#convention).
- Commonly used together with Parallel Routes to [create modals](https://github.com/vercel-labs/nextgram).

### API Routes
- Use the [`route.js`](https://nextjs.org/docs/app/api-reference/file-conventions/route) file convention (recommended to be placed with `app/api` folder) to create *[custom](https://nextjs.org/docs/app/building-your-application/data-fetching/revalidating#using-on-demand-revalidation) request handlers* with HTTP methods for a given route:
```tsx
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = formData.get('name');

  try {
    // Process the form data, e.g., save it to a database or send an email

    // Return a response with a success message
    const htmlContent = `
      <html>
        <head>
          <title>Form Submitted</title>
        </head>
        <body>
          <h1>Form Submitted Successfully</h1>
          <p>Thank you, ${name}!</p>
        </body>
      </html>
    `;

    return new NextResponse(htmlContent, {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    // Return a response with an error message
    const htmlContent = `
      <html>
        <head>
          <title>Error</title>
        </head>
        <body>
          <h1>Form Submission Failed</h1>
          <p>There was an error processing your request. Please try again later.</p>
        </body>
      </html>
    `;

    return new NextResponse(htmlContent, {
      status: 500,
      headers: { 'Content-Type': 'text/html' },
    });
  }
}
```
- There ***cannot*** be a `route.js` file at the same level as `page.js`.
- Use `next/headers` if you want to access [read-only](https://nextjs.org/docs/app/building-your-application/routing/router-handlers#dynamic-functions) cookies and headers. This will make the route segment dynamic and *not* cached.


## Rendering
- You ***must NOT*** import SCs into CCs. Instead, you can pass SCs [as *props (or children)*](https://nextjs.org/docs/getting-started/react-essentials#recommended-pattern-passing-server-components-to-client-components-as-props) to CCs. The SC will be rendered on the server, and when the CC is rendered on the client, the prop _"hole"_ will be filled in with the rendered result of the SC.
> Those "props" **MUST** be serializable (i.e. values such as functions, Dates,... **cannot** be passed directly to Client Components) because they're [crossing](https://nextjs.org/docs/getting-started/react-essentials#keeping-server-only-code-out-of-client-components-poisoning) the network boundary between Server and Client.
- Use the [global singletons](https://nextjs.org/docs/getting-started/react-essentials#sharing-data-between-server-components) pattern and [colocating data fetching](https://nextjs.org/docs/getting-started/react-essentials#sharing-fetch-requests-between-server-components) if you want to share data between SCs.
- **Node** runtimes are **server-side** environments optimized for heavy processing and serving ***multiple** clients*, while **Edge** runtimes are **client-side** environments located closer to end-users, focusing on ***local execution*** and enhancing performance. You can [specify a runtime](https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes#segment-runtime-option) for individual route segments in your Next.js application.

### Static Rendering
- This is the default behavior in Next.js.
- Both SC *and* CC can be **pre**rendered on the server at **build time**. The result of the work is [cached](https://nextjs.org/docs/app/building-your-application/data-fetching/caching) and served from a CDN geographically closer to the user; reusable on subsequent requests. The cached result can also be revalidated.
- This is equivalent to [[Next#Static Generation (recommended) |SSG]] and [[Next#ISR (Incremental Static Regeneration) |ISR]] from previous versions of Next.js.

### Dynamic Rendering
- Occurs when a [dynamic function](https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic-rendering#dynamic-functions) or a dynamic [`fetch()`](https://nextjs.org/docs/app/building-your-application/data-fetching/caching#fetch) request (no caching) is discovered during static rendering.
- Both SC *and* CC are rendered on the server at **request time**. The result of the work *is **not** cached*.
- This is equivalent to [[Next#getServerSideProps |SSR]] from previous versions of Next.js.


## Data fetching
- Basically, with SCs, you might want to move your data-loading concerns out of your CCs.
- To perform [server-side data mutations](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions#on-demand-revalidation) and [progressively enhance forms](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions#invocation) (asynchronous side effects in response to user interaction), use the [`use-server`](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions#creation) directive.
### Middleware
- Middleware allows you to run code [before](https://nextjs.org/docs/app/building-your-application/routing/middleware) a request is completed. Then, based on the incoming request, you can modify the response by rewriting, redirecting, modifying the request or response headers, or responding directly.
- Middleware runs before cached content and routes are matched.

### Fetching
- By default, Next.js automatically does ***static*** [fetches](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#async-and-await-in-server-components) (i.e. the data will be fetched at *build* time, cached indefinitely, and *reused* on each request). If your data changes often or can be specific to users (e.g. a shopping cart list), you can mark requests as **_dynamic_** and fetch data on each request [without caching](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#dynamic-data-fetching).
- [Parallel data fetching](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#parallel-data-fetching) requests in a route are eagerly initiated and will load data at the same time. This reduces client-server waterfalls and the total time it takes to load data, however, the user won't see the rendered result until both promises are resolved. Recommended to be paired with [`<Suspense/>`](https://react.dev/reference/react/Suspense#usage) and the [preload pattern](https://nextjs.org/docs/app/building-your-application/data-fetching/caching#preload-pattern-with-cache) to break up the rendering work and show part of the result as soon as possible.
- [Sequential data fetching](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#sequential-data-fetching) requests in a route are *dependent on each other*. Each fetch request and nested segment in the route cannot start fetching data and rendering until the previous request or segment has completed which create waterfalls. It's good practice to locate your data fetching to the specific component which needs it (even if you're requesting the [same data](https://nextjs.org/docs/app/building-your-application/data-fetching#automatic-fetch-request-deduping) in multiple components) rather than fetching it from a container component then pass it down as props.
> For [layouts](https://nextjs.org/docs/app/api-reference/file-conventions/layout), it's ***not*** possible to pass data between a parent layout and its `children` components. You must relocate fetching data **directly inside** the layout that needs it.
- Use [`useSearchParams()`](https://nextjs.org/docs/app/api-reference/functions/use-search-params) to read the current URL's **query string** in a CC.

### Caching
- By default, all [`fetch()`](https://nextjs.org/docs/app/building-your-application/data-fetching/caching#fetch) requests are *cached and deduplicated* automatically. During server rendering, when Next.js comes across a fetch, it will check the cache to see if the data is already available. If it is, it will return the cached data. If not, it will fetch and store data for future requests.
- [Revalidation](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#revalidate) is the process of purging the cache and re-fetching the latest data. Useful when your data changes and you want to ensure your application shows the latest version *without having to rebuild* your entire application. There are two types of revalidation in Next.js:
	- [Background](https://nextjs.org/docs/app/building-your-application/data-fetching/revalidating#background-revalidation): Revalidates the data at a specific time interval.
	- [On-demand](https://nextjs.org/docs/app/building-your-application/data-fetching/revalidating#on-demand-revalidation): Revalidates the data based on an event such as an update.


---
# Next $\leqslant$ 12
## Routing (client-side navigation)
### Static routes
- Simply create a JS/TS file under the `pages` directory, and the path to the file becomes the URL path. E.g. a route called `/authors/me` has its file located at `pages/authors/me.js.`
- The routes are determined at build time, and the corresponding HTML files are pre-rendered
- You can use the `Link` Component from [`next/link`](https://nextjs.org/docs/api-reference/next/link) to navigate between pages in your application.
- [Notice](https://nextjs.org/docs/api-reference/next/link#if-the-child-is-a-functional-component) when the `Link`'s child is a functional component.

### Dynamic routes
- To match a dynamic segment, you can use the bracket syntax:
```js

pages/blog/[slug].js → /blog/:slug (/blog/whatever && /blog/what-ever?foo=bar)
pages/[username]/settings.js → /:username/settings (/foo/settings)

Catch all routes: pages/post/[...all].js → `/post/* (/post/6996/id/title/whatever)`
Optional Catch all routes: pages/post/[[...param]].js → /post && /post/*
```
- In a **dynamic** route, components are rendered on the server at request time.
- [`useRouter`](https://nextjs.org/docs/pages/api-reference/functions/use-router) where the `<Link/>` is insufficient (e.g. redirecting)

### API Routes
- Any file inside the folder `pages/api` is mapped to the route `/api/*` and will be treated as an API endpoint instead of a `page.`
- For an API route to work, you need to export a function (i.e. **request handler**) as `default`. To handle different HTTP methods in an API route, you can use `req.method` in your request handler:
```js
export default function handler(req, res) {
  if (req.method === 'POST') {
    // Process a POST request
  } else {
    // Handle any other HTTP method
  }
}
```
- Dynamic API Routes is [similar](https://nextjs.org/docs/api-routes/dynamic-api-routes) to the dynamic page routes.
- Checkout [related](https://nextjs.org/docs/api-routes/introduction#related) docs if you're interested in backend.

## Rendering
- SSG and SSR components are considered ***server**-rendered* components. If a page is not using [[Next#getStaticProps |getStaticProps]] or [[Next#getServerSideProps |getServerSideProps]], the component is *client-rendered* just like in traditional React.
### Static Site Generation (recommended)
- If a page uses Static Generation, the page HTML is generated (*at **build** time, on the **server***) when you run  `next build` . This HTML will then be *reused on each request*. It can be ***cached*** by a CDN.
- You should ask yourself: "Can I pre-render this page **ahead** of a user's request?" If the answer is "yes", then you should choose Static Generation.
- If the answer is "no", it's most likely that your page shows frequently updated data, and *the entire (or most of)* page content changes on every request. In that case, you can use SSG with **Client-side data fetching:** skip pre-rendering some parts of a page and then use client-side JavaScript to populate them later.
- You can statically generate pages [**with**](https://nextjs.org/docs/pages/building-your-application/rendering/static-site-generation#static-generation-with-data) or [**without (fetching) data**](https://nextjs.org/docs/pages/building-your-application/rendering/static-site-generation#static-generation-without-data).
#### getStaticProps
- Your page [***content***](https://nextjs.org/docs/pages/building-your-application/data-fetching/get-static-props#when-should-i-use-getstaticprops) depends on external data:
```jsx
// Need to fetch `posts` (by calling some API endpoint) BEFORE this PAGE can be pre-rendered (i.e. at build time).
export default function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li>{post.title}</li>
      ))}
    </ul>
  )
}

//  `export` an `async` function called `getStaticProps` from the SAME file (i.e. you CANNOT export it from non-page files)
export async function getStaticProps() {
// As `getStaticProps` never run on the client-side, it runs only on the server-side
// Which means instead of fetching an API route from within this function, you can write the server-side code directly in `getStaticProps`. 
// For more details: https://nextjs.org/docs/pages/building-your-application/data-fetching/get-static-props#write-server-side-code-directly

  // Call an external API endpoint to get posts:
  const res = await fetch('https://randomapi/posts')
  const posts = await res.json()

  // By returning { props: { posts } }, the Blog component will receive `posts` as its prop at BUILD time
  return {
    props: {
      posts,
    },
  }
}
```
##### ISR (Incremental Static Regeneration)
- ISR enables you to use static-generation on a per-page basis, without needing to rebuild the **entire site** (i.e. you can create or update static pages _after_ you’ve built your site).
- With ISR, you can retain the benefits of static while scaling to millions of pages.
- To use ISR, add the [`revalidate`](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration) prop to `getStaticProps`.

#### getStaticPaths
- Your page [***paths***](https://nextjs.org/docs/pages/building-your-application/data-fetching/get-static-paths#when-should-i-use-getstaticpaths) depend on external data:
```jsx
// In pages/posts/[id].js file:
// Need to fetch `postData` (by calling some API endpoint) before this page can be pre-rendered.
export default function Blog({ postData }) {
  return (
    <h1>{postData.title}</h1>
  )
}

// To handle this, Next.js will statically pre-render ALL the paths specified by `export` an `async` function called `getStaticPaths` FROM a dynamic PAGE
// It gets called at BUILD time and lets you specify which paths you want to pre-render:
export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await fetch('https://randomapi/posts')
  const posts = await res.json()

  // Get ALL the paths we want to pre-render based on `posts`
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }))

  // { fallback: false } means other routes should render 404.
  return { paths, fallback: false }
}

// `getStaticPaths` REQUIRES using `getStaticProps`
export async function getStaticProps({ params }) {
  // `getStaticPaths` return value is implicitly passed in as the destructured `params` prop
  // If the route is like /posts/1, then `params.id` is 1
  // So this means that Next can pre-render as many pages as the `params` contains
  const res = await fetch(`https://randomapi/posts/${params.id}`)
  const postData = await res.json()

  // Pass postData to the page via props
  return { props: { postData } }
}
```

### Server-side Rendering
- Next.js **pre-renders** a page on ***each request*** (i.e. *at **run** time, on the **server***). This could be due to the nature of the data or properties of the request (such as `authorization` headers or geo location).
- Because Server-side Rendering results in slower performance than Static Generation (but the pre-rendered page will always be up-to-date though), use this only if absolutely necessary.
> If your page contains frequently updating data, and you [**DON'T NEED**](https://nextjs.org/docs/pages/building-your-application/data-fetching/get-server-side-props#fetching-data-on-the-client-side) to pre-render the data, you can fetch the data [on the client side](https://nextjs.org/docs/pages/building-your-application/data-fetching/client-side) instead.
- For example, suppose that your page needs to *pre-render* ***frequently*** updated data (fetched from an external API): 
```jsx
export default function Page({ data }) {
  // Render data...
}

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`https://.../data`)
  const data = await res.json()

  // Pass data to the page via props
  return { props: { data } }
}

export default Page
```

#### getServerSideProps
- Useful if you want to fetch data that *changes often*, and have the page update to show the most current data.
> It is similar to `getStaticProps`, but the main difference is that it's run on *every request* instead of on build time.
- Not recommended: use [`getInitialProps`](https://refine.dev/blog/next-js-getinitialprops-and-getserversideprops/#getinitialprops-vs-getserversideprops) if you want your page to be loaded from the server during the initial page load and, subsequently, run in the browser if you make client-side transition to other parts of the application.



