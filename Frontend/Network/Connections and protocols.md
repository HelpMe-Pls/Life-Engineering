# CORS
- By default, web <big>browsers</big> enforce the Same-Origin Policy, which prevents a script from one origin from accessing resources from another origin for security reasons.
- Cross Origin Resource Sharing is a system that allows web <big>servers</big> to specify which ***other* domains** (outside the domain from which the resource originated) are allowed to access their resources, enabling safe communication between different origins while protecting against security risks.
- For example:
	- Suppose a source page on `www.social-network.example` attempts to access a user’s data in a target page `online-personal-calendar.example`. If the target page is in the list of CORS-enabled sent from the ***response** header* of the source page (e.g. `Access-Control-Allow-Origin: https://online-personal-calendar.example`), the following ***request** header* would be sent: `Origin: www.social-network.example`. 
	- The server (source page) can then check the `Origin` request header and decide if its value matches the site listed in its CORS configuration.
	- If the source page response header is using the wildcard (`Access-Control-Allow-Origin: *`), then the browser (target page) won't block its request to its corresponding source page.
	- The `Origin` header is required for cross-origin requests and same-origin requests that are ***not*** `GET` and `HEAD`. 
- The best practice for implementing CORS is to be as specific and restrictive as possible, allowing only the necessary origins to access your resources:
```ts
const allowedOrigins = ['https://my-trusted-domain.com'];

app.use(cors({
// Detailed handling for a request `origin` header
  origin: function(origin, callback) {
    // Check if the origin is allowed
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Deny the request
    }
  },
  methods: ['GET', 'POST'], // Allowed HTTP methods
// Allowed headers to be included in the request other than `origin`
  allowedHeaders: ['Content-Type', 'Authorization'], 
// Headers the client can access from the server's response
  exposedHeaders: ['X-Custom-Header'],
  credentials: true, // Allow sending cookies with cross-origin requests
  maxAge: 3600 // Cache preflight requests for 1 hour
}));
```

# TCP, TLS, HTTP, HTTPS
- **TCP** (Transmission Control Protocol) operates at the transport layer, it establishes a connection between two devices and responsible for breaking data into packets, sending them, and reassembling them at the destination, without any loss or duplication.
- **TLS** (Transport Layer Security) requires `tcp`. It operates _==at the session layer==_ (*above the transport layer*), which has those reliable data transmission capabilities of `tcp` but adds encryption, authentication, and data integrity features to secure the communication channel.
- **HTTP** is the language that web browsers and servers use to communicate with each other. The client (web browser) sends a `http` request and the server sends a corresponding `http` response.
- **HTTPS** is the combination of `http` (for communication) and `tls` (for encryption and security):
```
//------------------ http:
POST /login HTTP/1.1
Host: www.example.com
Content-Type: application/x-www-form-urlencoded
Content-Length: 27

username=random&password=pass // which means anyone who intercepts this data can read it.

//------------------ https:
POST /login HTTP/1.1
Host: www.example.com
Content-Type: application/x-www-form-urlencoded
Content-Length: 50

9sdfj923k4j2349sdfj9234k2j34k2j3k4j23k4j23k4j2k34  // Encrypted and can only be decrypted and read by the intended recipient
```
- To be able to listen for different kinds of communication at the same time on a single machine, each listener has a number (called a _port_) associated with it. Most protocols specify which port should be used *by default*. For example, when we want to send an email using the SMTP protocol, the machine through which we send it is expected to be listening on port `25`.
- Another computer can then establish a connection by connecting to the target machine using the correct port number. If the target machine can be reached and is listening on that port, the connection is successfully created. The listening computer is called the _server_, and the connecting computer is called the _client_.
# Web Socket
- It is especially great for services that require ***continuous*** data exchange, e.g. online games, ***real-time*** trading systems and so on.
- WebSocket allows for ***server-initiated*** communication, whereas `http` relies on the client to initiate requests. WebSocket connections are initially established using an `http` request/response handshake. Once the handshake is completed successfully, the protocol is "upgraded" from `http` to the WebSocket (`ws://`) protocol. WebSocket connections can be secured (`wss://`) using `tls` encryption.  
- There are totally 4 events available in a `ws` connection:
	-   **`open`** – connection established,
	-   **`message`** – data received,
	-   **`error`** – websocket error,
	-   **`close`** – connection closed.
- The events flow:  `open` → `message` → `close` with the optional `error` at any step.
## WS vs Polling
- Polling is to repeatedly calling GET requests for receiving real-time updates from a server.
- With ws, the server can initiate communication and send updates to the client without the client having to repeatedly request data. Web sockets minimize network overhead by maintaining a persistent connection and efficiently transmitting only the necessary data updates.
- With polling, the client must continuously send requests to the server to check for updates, which can be inefficient and lead to unnecessary network overhead (each request creates a new TCP connection, which consumes server resources and can increase latency).