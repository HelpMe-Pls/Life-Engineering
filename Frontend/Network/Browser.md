# Storage
- Useful when you need to store data so that it won't go away after a page refresh (like theme, user's settings, user's action...)
- Only store data as key-value pairs and the value as `string`
- Several types of storage
## Cookie:
- Stores data on **BOTH** browser and server (which means that data stored in cookie is sent along with `http` requests - on the `header`).
- Prefer setting your cookies from your server if the values you're going to store is vulnerable to security measures (e.g. access tokens). Some of the attributes which included in those type of cookies are `HttpOnly`, `Secure`, `Expires`, `SameSite`.
	- Some cases where setting cookies from your client-side code is more suitable like when you use those stored values for client-side state management or there's no server involvement (no SSR).  
- 4**KB** capacity
- Accessible from any window
- Expiration is *manually* set
## Local storage
- Stores data on browser only.
- 5**MB** capacity
- Accessible from any window
- **Never expires**
## Session storage
- Stores data on browser only.
- 5**MB** capacity
- Accessible **ONLY** from within the same tab
- Expires on *tab/browser* close (still persists on refresh/restore)