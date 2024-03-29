## Overview
A typical web application is made up of:
-   **User Interface** - how users will consume and interact with your application.
-   **Routing** - how users navigate between different parts of your application.
-   **Data Fetching** - where your data lives and how to get it.
-   **Rendering** - when and where you render static or dynamic content.
-   **Integrations** - what third-party services you use (CMS, auth, payments, etc.) and how you connect to them.
-   **Infrastructure** - where you deploy, store, and run your application code (Serverless, CDN, Edge, etc.).
-   **Performance** - how to optimize your application for end-users.
-   **Scalability** - how your application adapts as your team, data, and traffic grow.
-   **Developer Experience** - your team’s experience building and maintaining your application.

##### What happens when an user type an URL in the address bar and hit enter?
- ELI5: When a user goes to a URL, the browser makes a request to the server. The server then sends back a response, which is usually HTML. The browser then renders the HTML into a page. The HTML can contain references to other resources, such as images, CSS, and JavaScript. The browser will make requests for these resources and process them as well.
- As an engineer:
1. **Domain Name System (DNS) Lookup**: The browser checks its cache for the IP address associated with the URL. If it doesn’t find it, it sends a request to a DNS server to resolve the domain name into an IP address.
2. **Establishing a Connection**: Once the browser has the IP address, it establishes a TCP/IP socket connection (which is a protocol to establish a reliable connection) with the web server (or a CDN, if the site's owner has enabled CDN/edge server service), typically on TCP port 80 (for `http`) or 443 (for `https`).
3. **Sending an HTTP Request**: The browser sends an HTTP `GET` request to the web server for the resource specified in the URL.
4. **Server Response**: The web server processes the request and sends back an HTTP response, typically containing HTML.
5. **Rendering**: The browser receives the response and renders the HTML. It may need to send additional requests for resources such as images, stylesheets, or scripts that are linked in the HTML.
##### Misconceptions
- Sending a request and receiving a response from a website ***does not*** necessarily require JS. Before the advent of JavaScript, websites were primarily static and all interactions were handled through `http` requests and responses.
  JS is used to enhance UX by sending requests and receiving responses ***without requiring a full page reload*** (with AJAX) and add interactivity to your HTML & CSS.
- The `http` methods (`GET`, `POST`, `PUT`, `DELETE`, etc.) are just ***purely semantic***, serve as a way for the client (a web browser or an API client) to communicate its intention, and they do not strictly enforce or guarantee the behavior of the server-side code or database operations.

---

[[Connections and protocols]]
[[Browser]]
[[Frontend/Network/Data Transfer]]
[[Frontend/Network/Caching]]
[[Development & Deploy]]
