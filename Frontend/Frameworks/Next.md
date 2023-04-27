- Next.js does code splitting automatically, so each page only loads what’s necessary for that page
- It means that pages become isolated. If a certain page throws an error, the rest of the application would still work
- By default, Next.js **pre-renders** every page. This means that Next.js generates HTML for each page in advance, instead of having it all done by client-side JavaScript. Pre-rendering can result in better performance and SEO.
- in a production build of Next.js, whenever [`Link`](https://nextjs.org/docs/api-reference/next/link) components appear in the browser’s viewport, Next.js automatically **prefetches** the code for the corresponding linked page in the background.



# Routing (client-side navigation)
---

## Static routes
- Simply create a JS file under the `pages` directory, and the path to the file becomes the URL path. E.g. a  route called `/authors/me` has its file located at `pages/authors/me.js`
- You can use the `Link` Component [`next/link`](https://nextjs.org/docs/api-reference/next/link) to link between pages in your application
- [Notice](https://nextjs.org/docs/api-reference/next/link#if-the-child-is-a-functional-component) when the `Link`'s child is a functional component

## Dynamic routes
- To match a dynamic segment, you can use the bracket syntax:
```js
pages/blog/[slug].js → /blog/:slug (/blog/whatever && /blog/what-ever?foo=bar)
pages/[username]/settings.js → /:username/settings (/foo/settings)

Catch all routes: pages/post/[...all].js → `/post/* (/post/6996/id/title/whatever)`
Optional Catch all routes: pages/post/[[...param]].js → /post && /post/*
```
- Predefined routes [take precedence](https://nextjs.org/docs/routing/dynamic-routes#caveats) over dynamic routes, and dynamic routes over catch all routes
- [`useRouter`](https://nextjs.org/docs/api-reference/next/router#usage) where the `<link/>` is insufficient (e.g. redirecting)



# Static Generation (recommended)
- If a page uses Static Generation, the page HTML is generated (*at build time*) when you run  `next build` . This HTML will then be reused on each request. It can be ***cached*** by a CDN.
- You should ask yourself: "Can I pre-render this page **ahead** of a user's request?" If the answer is "yes", then you should choose Static Generation.
- If the answer is "no", it's most likely that your page shows frequently updated data, and *the entire (or most of)* page content changes on every request. In that case, you can use SSG with **Client-side data fetching:** skip pre-rendering some parts of a page and then use client-side JavaScript to populate them.
- You can statically generate pages [**with**](https://nextjs.org/docs/basic-features/pages#static-generation-with-data) or [**without (fetching) data**](https://nextjs.org/docs/basic-features/pages#static-generation-without-data)
---

## `getStaticProps`
- Your page [***content***](https://nextjs.org/docs/api-reference/data-fetching/get-static-props) depends on external data:
```jsx
// Need to fetch `posts` (by calling some API endpoint) before this PAGE can be pre-rendered.
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
// This function gets called at BUILD time and lets you pass fetched data to the page's `props` on pre-render:
export async function getStaticProps() {
// As `getStaticProps` never run on the client-sid, it runs only on the server-side
// Which means that instead of fetching an API route from within this function, you can write the server-side code directly in `getStaticProps`. 
// For more details: https://nextjs.org/docs/api-reference/data-fetching/get-static-props#reading-files-use-processcwd

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

## ISR (Incremental Static Regeneration)
- ISR enables you to use static-generation on a per-page basis, without needing to rebuild the **entire site** (i.e. you can create or update static pages _after_ you’ve built your site)
- With ISR, you can retain the benefits of static while scaling to millions of pages
- To use ISR, add the [`revalidate`](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration) prop to `getStaticProps`


## `getStaticPaths`
- Your page [***paths***](https://nextjs.org/docs/api-reference/data-fetching/get-static-paths) depend on external data:
```jsx
// In pages/posts/[id].js file:
// Need to fetch `postData` (by calling some API endpoint) before this page can be pre-rendered.
export default function Blog({ postData }) {
  return (
    <h1>{postData.title}</h1>
  )
}

// To handle this, Next.js will statically pre-render all the paths specified by `export` an `async` function called `getStaticPaths` FROM a dynamic PAGE
// It gets called at BUILD time and lets you specify which paths you want to pre-render:
export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await fetch('https://randomapi/posts')
  const posts = await res.json()

  // Get the paths we want to pre-render based on posts
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }))

  // { fallback: false } means other routes should render 404.
  return { paths, fallback: false }
}

// `getStaticPaths` REQUIRES using `getStaticProps`
export async function getStaticProps({ params }) {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  // So this means that Next can pre-render as many pages as the `params` contains
  const res = await fetch(`https://randomapi/posts/${params.id}`)
  const postData = await res.json()

  // Pass postData to the page via props
  return { props: { postData } }
}
```



# Server-side Rendering
- Next.js pre-renders a page on ***each request*** (i.e. *at run time*). This could be due to the nature of the data or properties of the request (such as `authorization` headers or geo location)
- Because Server-side Rendering results in slower performance than Static Generation (but the pre-rendered page will always be up-to-date tho), use this only if absolutely necessary
- ==If your page contains frequently updating data, and you [**DON'T NEED**](https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props#fetching-data-on-the-client-side) to pre-render the data, you can fetch the data on the client side instead==
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
---

## getServerSideProps
- Useful if you want to fetch data that changes often, and have the page update to show the most current data
- [`getServerSideProps`](https://nextjs.org/docs/api-reference/data-fetching/get-server-side-props) is similar to `getStaticProps`, but the main difference is that it's run on every request instead of on build time
- Not recommended: use [`getInitialProps`](https://refine.dev/blog/next-js-getinitialprops-and-getserversideprops/#getinitialprops-vs-getserversideprops) if you want your page to be loaded from the server during the initial page load and, subsequently, run in the browser if you make client-side transition to other parts of the application



# API Routes
- Any file inside the folder `pages/api` is mapped to the route `/api/*` and will be treated as an API endpoint instead of a `page`
- For an API route to work, you need to export a function as `default` (i.e **request handler**). To handle different HTTP methods in an API route, you can use `req.method` in your request handler:
```js
export default function handler(req, res) {
  if (req.method === 'POST') {
    // Process a POST request
  } else {
    // Handle any other HTTP method
  }
}
```
- Dynamic API Routes is [similar](https://nextjs.org/docs/api-routes/dynamic-api-routes) to the dynamic page routes
- Checkout [related](https://nextjs.org/docs/api-routes/introduction#related) docs if you're interested in backend

