# Storage
- Useful when you need to store data so that it won't go away after a page refresh (like theme, user's settings, user's action...)
- Only store data as key-value pairs and the value as `string`
- Several types of storage
## Cookie
- They were invented to solve the problem of state management in web applications. Cookies allow websites to store small pieces (maximum of `4KB` per cookie) of data on a user's device which is then sent along (*from the browser*) with every request to the server (along with `http` requests - on the `header`).
- It enables the server to maintain session information and remember user preferences across different interactions.
```ts
// Server-side
const response = new Response(body, {
	headers: {
		'set-cookie': 'name=John Doe',
	},
})
```
- *==**Prefer setting your cookies from your server**==* if the values you're going to store is vulnerable to security measures (e.g. access tokens). You often want to set the cookie as part of ***the response*** to a request anyway. A response can have multiple `set-cookie` headers. One for each cookie we want to set. 
  But in practice, it's generally best to avoid storing too much data in the cookie itself as it will be sent to the server with every request. This can slow down the user's experience and can also cause problems if the cookie is getting closer to its capacity.
	- Some cases where setting cookies from your client-side code is more suitable like when you use those stored values for client-side state management or there's no server involvement (no SSR).  
	- Most of the time the only persistent data stored in a session cookie is an ID that can be used to look up the rest of the data in a database. Sometimes temporary data is also stored in the cookie using a pattern called a ["Cookie Flash"](https://remix.run/docs/en/main/utils/sessions#sessionflashkey-value).
- Each cookie has a name, value, and a set of attributes. The attributes are optional and can be used to configure the cookie's behavior:
	- `Path`: The path on the server for which the cookie is valid. Defaults to the current path. This means if the path is set to `/my-page`, the cookie will only be sent to the server when the user is on the `/my-page` path.
	- `Domain`: The domain for which the cookie is valid. Defaults to the current domain. This means if the domain is set to `example.com`, the cookie will be sent to the server for *all subdomains* of `example.com`.
	- `Expires`: The date and time when the cookie expires. When set, the deadline is *relative to the client* the cookie is being set on, not the server. If not set, the cookie will expire *when the browser is closed*.
	- `Max-Age`: The number of seconds until the cookie expires. If not set, the cookie will expire *when the browser is closed*.  If both `Expires` and `Max-Age` are set, Max-Age has precedence.
	- `Secure`: If set, the cookie will only be sent to the server over `https`.
	- `HttpOnly`: If set, the cookie will not be accessible to JavaScript (browser extensions, malicious code,...). This is useful for preventing cross-site scripting attacks.
	- `SameSite`: If set, the cookie will only be sent to the server if the request originated from the same site. This is useful for preventing [[Security#CSRF |CSRF]] attacks.
- [[Authentication#Cookies and Sessions |Checkout]] an examples of using cookie in Remix.
### GDPR Banner
- The GDPR (General Data Protection Regulation) banner is a pop-up or footer on a webpage that requests user's consent for the use of cookies on that website. It doesn't mean that if the user reject it, then *all* cookies for the site is disabled. It only applies for non-essential cookies (for tracking and advertising purposes). The essential cookies (for auth & security reasons) are still enabled (unless the user manually turn them off in the DevTools).
### Good practice
It's recommended to use the [cookie](https://www.npmjs.com/package/cookie) package which provides a `sign` function that will sign the cookie value using a cryptographic hash function. It also provides a `verify` function that will verify the signature. This way, if the user modifies the cookie value, the signature will no longer match and we'll know the cookie has been tampered with.

## Local storage
- Stores data on browser only. Should not be used to store sensitive data (e.g., tokens, keys, etc.), as this could create a security vulnerability..
- 5**MB** capacity
- Accessible from any window
- **Never expires**
## Session storage
- Stores data on browser only.
- 5**MB** capacity
- Accessible **ONLY** from within the same tab
- Expires on *tab/browser* close (still persists on refresh/restore)