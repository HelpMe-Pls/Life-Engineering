# REST
- REST (**Re**presentational **S**tate **T**ransfer) APIs are great for web services that prioritize simplicity and scalability. Use it when building public-facing APIs or when you want a stateless, cacheable and resource-oriented design.
- Stateless: means that every HTTP request happens in complete isolation. When the client makes a `http` request, it includes all information necessary for the server to fulfill that request. The server never relies on information from previous requests from the client.
- While REST APIs can be accessed through a number of communication protocols, most commonly, they are called over `http`.
- They are resource based, which basically means that *instead of* having names like `/getPostComments` or `/savePostInDatabase` we refer **directly to the resource** (in this case, the blog post) and use HTTP verbs such as GET, POST, PUT, and DELETE to determine the action:
  
Verb | Action | Example
-- | -- | --
POST | Create | `POST /posts` Creates a new blog post
GET | Read | `GET /posts` would return the entire list of blog posts while `GET /posts/:postid` specifies the exact blog post we want
PUT | Update | `PUT /posts/:postid` Updates a single post
DELETE | Delete | `DELETE /posts/:postid` Deletes a single post

- Some of the [best practices](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design#h-allow-filtering-sorting-and-pagination).
---
# tRPC
- RPC is a a client-to-service communication protocol that one program can use to request a service from a program located on another computer in a network without having to understand the network’s details. There are many implementations of RPC, including gRPC, XML-RPC, and ***tRPC*** (TypeScript Remote Procedure Call), but the overarching concept remains the same: you’re invoking a ***procedure*** on a remote machine.
- tRPC leverages TypeScript’s powerful inference to derive the type definitions of an API router. This allows developers to invoke API procedures directly from the frontend with full type safety and autocompletion, leading to a more integrated and efficient development experience.
- [How to use it](https://trpc.io/docs/quickstart#try-it-out-for-yourself).
