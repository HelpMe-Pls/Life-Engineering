# REST
- REST (**Re**presentational **S**tate **T**ransfer) APIs are great for web services that prioritize simplicity and scalability. Use it when building public-facing APIs or when you want a stateless, cacheable and resource-oriented design.
- **Stateless**: means that every HTTP request happens in complete isolation. When the client makes a `http` request, it includes all information necessary for the server to fulfill that request (including auth tokens). _==The server never relies on information from previous requests from the client.==_
- While REST APIs can be accessed through a number of communication protocols, most commonly, they are called over `http`.
- They are resource based, which basically means that *instead of* having names like `/getPostComments` or `/savePostInDatabase` we refer **directly to the resource** (in this case, the blog post) and use HTTP verbs such as `GET`, `POST`, `PUT`, and `DELETE` to determine the action:

Verb | Action | Example
-- | -- | --
POST | Create | `POST /posts` Creates a new blog post
GET | Read | `GET /posts` would return the entire list of blog posts while `GET /posts/:postid` specifies the exact blog post we want
PUT | Update | `PUT /posts/:postid` Updates a single post
DELETE | Delete | `DELETE /posts/:postid` Deletes a single post
- `GET` is generally _safe_ (doesn't change server state) and _idempotent_ (multiple identical requests have the same effect as one), while `POST` is typically _unsafe_ and _not idempotent_ (multiple requests create multiple resources, therefore, they shouldn't be retried without checks).
- Some of the [best practices](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design#h-allow-filtering-sorting-and-pagination).
## Conventions
- `GET`, `PUT`, `DELETE` should be idempotent (i.e. should be safe to retry).
- Avoid verbs in URLs. Use plural nouns for collections (`/users`) and IDs for specific items (e.g. `/users/{userId}`).
- Use well-structured JSON for request/response bodies. Maintain consistent naming (e.g., `camelCase`).
- Use query params for collections: filtering (`?status=active`), sorting (`?sort=name`), pagination (`?page=1&limit=20`).
- Authentication/authorization best practices (e.g. needing API keys or [[#JWTs]] passed in headers).
- API versioning for breaking changes, commonly via URL path (e.g. `/v1/users`).
- Common `http` status code:
	- `200`: OK
	- `201`: Created
	- `204`: No Content
	- `400`: Bad Request - the server received malformed request from the client
	- `401`: Unauthorized - auth needed/failed
	- `403`: Forbidden - auth ok, no permission
	- `404`: Not Found
	- `500`: Internal Server Error
### JWTs
- Upon successful login, _**the server creates**_ a JSON Web Token (JWT). This token itself contains user information (the "payload," e.g., user ID, roles) and is digitally signed _by the server_ using a secret key.
- The server sends this entire JWT back to the client, often stored in a secure, `HttpOnly` cookie (`HttpOnly` prevents JS access, mitigating XSS attacks stealing the token).
- On _subsequent_ requests, the client _automatically_ sends the JWT cookie back to the server. The server then **_verifies_ the signature** of the received JWT using its secret key.
- If the signature is valid (meaning the token hasn't been tampered with and was issued by this server) and the token hasn't expired, the server **trusts the information inside the JWT's payload** to identify the user and sends the API response.
> [!important] Stateless
> - JWTs enable statelessness for REST APIs by the fact that there's **no storage** for any individual user's session on the server-side.
> - The server uses the **_same_** key(s) to validate tokens from _all_ users. It doesn't need to look up "which key belongs to user X's current session".
- To [visualize it](https://mermaid.live), paste this code in:
```
graph TD
    %% Initial Login Process
    subgraph "Initial Request / Login"
        A[User visits site / tries to access protected resource] 
        A --> B(Client sends HTTP Request)
        B --> C{Server: Is a valid JWT cookie received?}
        C -- No --> D[Server: Responds with Login Page / Returns 401]
        D --> E[User submits Username & Password]
        E --> F(Client sends Login Request)
        F --> G{Server: Are credentials valid?}
        G -- Yes --> H[Server: Creates JWT with header, payload, and signature]
        H --> I[Server: Sends Response with Set-Cookie header: HttpOnly, Secure, contains JWT]
        I --> J(Client automatically stores the cookie)
        J --> K[Client redirects/shows Protected Content]
        G -- No --> L[Server: Returns Login Error / 401]
        L --> D
    end

    %% Subsequent Requests with JWT
    subgraph "Subsequent Request"
        M[User accesses another protected resource] 
        M --> N(Client sends HTTP Request with stored JWT cookie)
        N --> O{Server: Is the JWT cookie present?}
        O -- Yes --> P{Server: Is JWT signature valid & not expired?}
        P -- Yes --> Q[Server: Extracts user info from JWT Payload]
        Q --> R[Server: Authorizes request]
        R --> S[Server: Serves Protected Content / API Response]
        P -- No --> D
        O -- No --> D
    end
```

> [!info] When to use it
> - When [[System Design#Scalability |Scalability]] is a major concern. Stateless servers are generally easier to scale horizontally.
> - When you need **cross-domain authentication** or need to easily pass authentication context between different services or applications (e.g. REST APIs).
> - When you want to **minimize server load** by not storing session data for every active user.
> - Practical implementations could be found in microservice architectures, Single Page Applications, or mobile apps. 
> 	- An application primarily using sessions might issue a short-lived JWT for a specific, isolated purpose like a secure password reset link, without using JWTs for the main user session.

---
# tRPC
- RPC is a a client-to-service communication protocol that one program can use to request a service from a program located on another computer in a network without having to understand the network’s details. There are many implementations of RPC, including gRPC, XML-RPC, and ***tRPC*** (TypeScript Remote Procedure Call), but the overarching concept remains the same: you’re invoking a ***procedure*** on a remote machine.
- tRPC leverages TypeScript’s powerful inference to derive the type definitions of an API router. This allows developers to invoke API procedures directly from the frontend with full type safety and autocompletion, leading to a more integrated and efficient development experience.
- [How to use it](https://trpc.io/docs/quickstart#try-it-out-for-yourself).
