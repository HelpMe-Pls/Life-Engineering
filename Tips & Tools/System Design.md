- Check [this](https://gist.github.com/vasanthk/485d1c25737e8e72759f)out.
- [This](https://github.com/checkcheckzz/system-design-interview) also.
- Guidelines to follow:
	- **Requirements** exploration: Understand the problem thoroughly and determine the scope by asking a number of clarifying questions.
		- "What's the primary device that users will access the system on?"
		- "Which browsers should we support?"
		- "Do we need to support internationalization?"
		- "Does the app need to work offline?"
	- **Architecture** / High-level design: Identify the key components of the product and how they are related to each other.
		- For components, list down the various subcomponents that will exist within it and what data is being passed among each component.
		- Check out [[Repository structures]].
	- **Data model**: Describe the various data entities, the fields they contain and which component(s) they belong to.
		- State management [[Where to put state.png |best practices]] and immutability.
	- **Interface definition** (API): Define the interface (API) between components in the product, functionality of each API, their parameters and responses.
		- Good components are designed in a way that they can be reused in multiple scenarios and abstract complexities.
		- Components should be open for extension but closed for modification.
		- [[Design Patterns |Read more]].
	- **Optimizations** and deep dive: Discuss about possible optimization opportunities and specific areas of interest when building the product.
		- UX: debounce input, disable interactive elements if they trigger an async request, "View more" button for long data, pagination, styling [[CSS#Overflow |overflow]], reflect state of the component to the user (e.g. loading, error, no data,...)
		- Performance: latency (loading speed), SSR, code splitting, [[Frontend/Libraries/React/Performance#Code Splitting|memory management]], [[Concurrency#Render as you fetch |render as you fetch]], prefetching/caching (with react-query),...
		- [Accessibility](https://www.w3.org/WAI/fundamentals/accessibility-intro/): good color contrast, keyboard friendliness (`tabindex`), visual impairment (`aria-role`, `aria-label`, `alt` props), transcript for audio components,...
		- Internationalization: design and development of a product, application or document content that enables easy localization for target audiences that vary in culture, region, or language. Components shouldn't be hardcoded to a specific language, consider display order for RTL languages.
		- Multi-device support: good memory management, increasing the hit box of interactive elements,...
		- Security: XSS, CSRF, [`rel=noopener`](https://mathiasbynens.github.io/rel-noopener/), [clickjacking](https://owasp.org/www-community/attacks/Clickjacking),...
---
# Essentials (for interviews)
- Know [[Networking#What happens when an user type an URL in the address bar and hit enter? |this]].
## General ideas
- Relate each of your design choice directly to these core system properties and discuss the inherent _tradeoffs_.
### Scalability
- Scaling addresses how to increase system capacity to handle more users, data, or processing load. There are 2 types: horizontal and vertical.
- You might choose reasonably powerful instances (vertical scaling to a point) and then add more of those instances as needed (horizontal scaling).
#### Horizontal
- Adding _**more servers**_ or instances to your resource pool and _distributing the load_ across them (usually via a load balancer).
- Use it when:
	- High _availability_ and fault tolerance are _critical_ requirements.
	- You need to handle large, potentially _unpredictable_ amounts of traffic.
	- Your application is (or can be made) stateless.
#### Vertical
- Increasing the resources (CPU, RAM, Disk I/O, Network I/O) of a _**single existing server**_ or instance.
- Prefer this approach when:
	- _Simplicity_ is a primary concern, and high availability _isn't critical_ (or handled by other means). 
	- Load increases are _predictable_ and within the limits of a single machine's potential upgrade path.
	- You have a stateful application that's _difficult_ to distribute.
### Availability
- It's about making sure the system is always functional when users need it. Having backups/copies is key here.
- Emphasize **redundancy** at every layer: multiple servers, LBs, DB replicas, across multiple **Availability Zones (AZs)** or even **regions**.
- Mention **monitoring and alerting** as crucial for _detecting_ failures quickly to minimize downtime.
### Reliability
- It's about expected behavior. Does the system do what it's supposed to, correctly?
- Mention **testing** strategies (unit, integration, end-to-end) as foundational. Discuss **error handling** and **retries** (especially with idempotent operations and transient errors).
### Latency
- How long does a request take? Lower is better! 
- Identify major **sources of latency**: network calls (especially cross-region), disk I/O (slow DB queries), CPU processing, locking contention.
- Discuss mitigation strategies: **caching** (various layers), **CDNs**, optimizing **database queries** (indexing, avoiding N+1 queries), efficient **code algorithms**, potentially placing services/data geographically closer to users.
### Consistency
- It's about data freshness on different devices. For example:
	- With eventual consistency for "likes", a user might see different counts on different devices for a short time.
- Discuss the **tradeoff**: strong consistency often limits availability/scalability (CAP theorem), while eventual consistency enables higher performance/availability but requires careful handling in the application logic.
#### CAP Theorem
- CAP theorem is a fundamental principle for _==distributed data systems==_. It stands for Consistency, Availability, Partition tolerance. 
- Any distributed data store can only guarantee **two** out of the following three properties simultaneously, especially when facing network issues.
	- **Consistency**: all nodes in the system see the same data at the same time. Strong consistency means every read receives the most recent write or an error.
	- **Availability**: every request made to a non-failing node in the system receives a response, without guaranteeing it contains the most recent write. 
	- **Partition Tolerance**: the system continues to operate even if _network communication_ breaks down between nodes (a network partition).
- In real-world distributed systems, _==network partitions (P) are unavoidable==_. Therefore, the theorem forces a tradeoff: you generally have to choose between prioritizing **Consistency** _(making it a CP system)_ or **Availability** _(making it an AP system)_ when a partition occurs.
	- **CP systems** avoids returning potentially incorrect or stale data. Some configurations of _==**traditional SQL** databases can lean towards **CP**==_.
	- **AP systems** will keep responding, but might return older data or allow conflicting writes that need reconciliation later (leading to eventual consistency). Many NoSQL databases like Cassandra or DynamoDB are designed as AP systems.
##### Examples
- There's no one-size-fits-all database – the choice depends on the specific requirements and acceptable tradeoffs for the feature.
- If we're designing a system needing strict transactional integrity like banking, we might lean towards CP. 
- If we need high availability and can tolerate eventual consistency, like for a social media feed's 'like' count, an AP system might be better.
## Technical 
- Know your [[APIs]]. 
### Load balancing
- Load balancing basically means having dedicated server(s) to distribute incoming traffic among the servers (or instances) of the same application.
	- Think of it like having multiple checkout lanes in a busy store—each lane serves customers so that no single lane becomes a bottleneck.
- This kind of setup maintains performance, improves _reliability_, and increases overall system _availability_ by distributing traffic among several servers.
#### Health check
- Load balancers in a cluster send regular “heartbeat” messages to each other to monitor health and responsiveness. If one fails to respond, the others can automatically take over its responsibilities.
- Many load balancers continuously check the health of servers (e.g. hitting a `/health` endpoint on each app server), routing traffic only to those that are operational.
#### Routing strategies
- There are 2 common strategies to manage how incoming traffic is distributed among the servers: 
	- **Round-Robin**: works best when all servers have similar capacity and load. It cycles through your pool of servers one by one. Every new request goes to the next server in line, ensuring an even distribution.
	- **Least Connection**: effective when your servers experience varying loads or the duration of each connection differs. It checks each server's current number of active connections and directs the new request to the one with the fewest connections

### Databases
- Have a look at the [[Databases |deep dive]].
#### SQL
- Use it when _==ACID transactions==_ are required (i.e. you need strong consistency, reliability, and data integrity), especially if the business domain is about banking, Enterprise Resource Planning (ERP).
- We can offset its tradeoffs with _==read replicas for better scalability and indexing for query performance==_.
#### NoSQL
- For a distributed system where high scalability is preferred and [[#CAP Theorem]] is considered, NoSQL is suitable for rapid development with large volumes of flexible documents. 
> Eventual consistency is a compensation for high availability and partition tolerance.
- NoSQL databases scale horizontally with built-in sharding:
	- Sharding is a method of horizontally partitioning a database so that a single dataset is divided into smaller, more manageable pieces called 'shards.'
	- Each shard contains a subset of the overall data based on a shard key, which is used to distribute data and queries across multiple servers.
### Caching
- Discuss _what **not_** to cache (e.g., highly dynamic, sensitive data).
- Discuss _what_ data to cache (e.g. DB results, rendered pages, user sessions), _why_ we need caching (to improve latency, DB load), _where_ to store the cache (e.g. client, CDN, server-side like Redis/Memcached).
- Discuss **cache invalidation** strategies beyond TTL: 
	- **Write-through**: write to cache and DB simultaneously - consistent but slower writes.
	- **Write-around**: write directly to DB, only cache on read miss - handles infrequent writes well.
	- **Write-back**: write to cache, update DB later - fast writes but risk of data loss on cache failure.

## Whiteboarding 
- Don't jump into solutions! Clarify everything. ==_**ASK** more_== questions.
- Start simple and build up, clearly explain _why_ you're choosing components (and mention the tradeoffs!)
- Follow this guideline:
	1. **Ask clarifying questions**, like:
		- What exactly should it do?
		- How fast should it be? How available? Is data consistency critical?
		- How many users? How much data? Reads vs. writes?
	2. **Quick guesstimate**: put some rough numbers down. This helps justify needing replicas or caches later.
	3. **Sketch it out**: high-level boxes and arrows. Something like `Client → LB → Servers → DB/Cache` 
	4. **Zoom in**: pick **_1-2 areas_** to flesh out based on the requirements or interviewer's prompts. Play to your advantage. Usual suspects:
		- DB Schema: show them why you choose SQL over NoSQL or vice versa.
		- API Endpoints: make sure to follow the path convention
		- Caching: Redis
		- Message queues: writes are heavy or slow, use this to handle them asynchronously. Kafka vs RabbitMQ.
		- Trade offs: last but not least, explain the pros and cons of every choice
### Examples
#### Excalidraw
##### Clarifying questions
- Real-time collaboration?
- Users per session?
- Authentication?
- Autosave?
- Sharing?
- Target latency for updates?
- Scale (concurrent users/sessions)? 
- Availability needs?
##### Guesstimate
- Let's make some rough estimates based on 10k concurrent users (using WebSockets).
- Let's say there are 5 users per session, and there's an update every 5 seconds, we'll have: `(10000/5) * (1/5) = 400` updates per second. 
	- And if each update must be displayed to the rest of the users in that group (4 users), then we'll broadcast `400*4 = 1600` messages per second 
- If an average drawing has ~100 elements, and each element takes ~1KB (as JSON), that's 100KB per drawing. If we have 1M drawings, that's `1M * 100KB = 100GB` of drawing data.
- Suggests a need for a solid real-time layer and scalable storage.
##### High-level design
- Basic flow: HTTP for initial loads, WebSockets for real-time collaboration. Might [look](https://mermaid.live) something like this:
```
graph TD
    subgraph "User Interface"
        Client[Browser - JS/Canvas]
    end

    subgraph "Load Balancing"
        LB_HTTP[HTTP Load Balancer]
        LB_WS[WebSocket Load Balancer]
    end

    subgraph "Web Tier"
        WebServers[Stateless WebServer]
    end

    subgraph "Real-time Tier"
        WSGateway[WebSocket Servers/Gateway]
    end

    subgraph "Application Logic & State"
        Backend[Backend Service]
        Cache[(Cache - Redis?)]
    end

    subgraph "Data Persistence"
        Database[(NoSQL - MongoDB)]
    end

    %% HTTP Flow for Initial Load & API Calls
    Client -- HTTP Request --> LB_HTTP
    LB_HTTP -- Distributes HTTP --> WebServers
    WebServers -- Serves Static Assets --> Client
    WebServers -- API Calls --> Backend

    %% WebSocket Flow for Real-time Collaboration
    Client -- Establishes WS Connection --> LB_WS
    LB_WS -- Distributes WS --> WSGateway
    Client -- Sends Drawing Updates (WS) --> WSGateway
    WSGateway -- Forwards Updates --> Backend
    Backend -- Processes & Validates --> WSGateway
    WSGateway -- Broadcasts Updates (WS) --> Client

    %% Backend Interactions
    Backend -- Reads/Writes Drawing Data --> Database
    Backend -- Autosave --> Database
    Backend -- Reads/Writes Session Info --> Cache
    WSGateway -- Reads/Writes Session Info --> Cache
```
##### Deep dive
- **Mechanism**:
	- Client sends changes (JSON diff) via WebSocket → backend validates, updates state, broadcasts to others in the room.
	- Conflicting edits can be solved with _Last Write Wins strategy_ for simplicity, acknowledging potential data loss.
- **Data persistence**:
	- Autosave needed. Backend can _**debounce** saves_ to reduce DB load.
	- NoSQL (e.g. MongoDB) fits well due to flexible schema for drawing elements and easier scaling.
	- Eventual consistency is acceptable for high availability and partition tolerance
- **Bottlenecks**:
	- Handling many ws connections requires horizontal scaling and external state management (e.g., Redis/Kafka for room info/pub-sub)
	- Frequent autosaves need optimization (debouncing, batching)
	- Network distance impacts real-time feel. Consider geo-distributed CDNs or deploying backend services closer to users through _==edge computing==_.
#### API Rate Limiter
##### Clarifying questions
- **Scope & Keys:** 
	- What identifier do we use to track limits? (e.g., User ID, API Key, IP Address, a combination?). 
	- Is it for a single API endpoint, a group of APIs, or globally?
- **Rules & Limits:** 
	- What kind of limits? (e.g., 100 requests per minute? 10 requests per second?)
	- Are limits static or dynamic (e.g., different tiers for different users)? 
	- What time window _algorithm_ (fixed window, sliding window)?
- **Expected behavior**:
	- What happens when a client exceeds the limit? (Reject immediately with HTTP 429? Throttle/delay the request? Silently drop?)
	- How many requests per second does the system need to handle overall? 
	- What happens if the rate limiter service fails? Should it fail open (allow requests) or fail closed (block requests)?
##### Guesstimate
- High throughput with minimal latency (e.g. 10,000 requests/sec total)
- If we have 1 million active API keys, we need to track counters for each.
- Storing a counter and timestamp per key per minute for 1M API keys → something like an _==in-memory storage solution==_ like Redis is feasible and desirable for speed.
##### High-level design
- The Rate Limiter intercepts requests, checks against rules using data stored in a fast distributed cache like Redis, and either forwards the request or rejects it:
```
flowchart TD
  %% Client Layer
  subgraph Client
    A["Client<br/>(API Request + API Key)"]
  end

  %% Gateway & Rate Limiter
  subgraph Gateway
    B["API Gateway<br/>(Load Balancer)"]
    C["Rate Limiter<br/>(Extract Key, Check Quota)"]
    B --> C
    C -->|Allowed| D["API Service"]
    C -->|Denied<br/>429 Too Many Requests| E["Error Response"]
  end

  %% Distributed Cache
  subgraph DataStore
    F["Redis Counter"]
    C -->|INCR & EXPIRE| F
    F -->|Quota| C
  end

  %% Response arrows (no extra subgraph needed)
  D -->|200 + X-RateLimit-*| A
  E -->|429| A

  %% Dark‑theme styling
  style A fill:#222222,stroke:#FFFFFF,stroke-width:1px,color:#FFFFFF
  style B fill:#2C3E50,stroke:#FFFFFF,stroke-width:1px,color:#FFFFFF
  style C fill:#34495E,stroke:#FFFFFF,stroke-width:1px,color:#FFFFFF
  style D fill:#2C3E50,stroke:#FFFFFF,stroke-width:1px,color:#FFFFFF
  style E fill:#C0392B,stroke:#FFFFFF,stroke-width:1px,color:#FFFFFF
  style F fill:#1F2A37,stroke:#FFFFFF,stroke-width:1px,color:#FFFFFF
```

##### Deep dive
- **Redis is ideal.** It's an in-memory datastore providing very low latency reads/writes needed for rate limiting.
- High traffic could overload a single Redis instance. Requires clustering/sharding, adding complexity.

#### URL Shortener
##### Clarifying questions
- Do we need support for custom aliases (e.g., `short.ly/myname`)?
- Should links expire after a certain time or number of clicks?
- Do we need to track the number of clicks per link?
- Any auth requirements for user accounts (e.g., to manage links)?
- How many new links created per day? How many redirects per second (peak)? (This helps determine read vs. write load)
##### Guesstimate
- Manageable write: 1 million new URLs/day ≈ 12 **writes**/sec
- Read-heavy system: 1000 redirects/sec peak
- Storage: 1M links/day for 5 years ≈ 1.8 billion links, if each mapping needs ~500 bytes then we need ~900 GB
##### High-level view
- [Implement](https://mermaid.live) a K-V store to support aggressive caching for fast, scalable redirects with optional auth and analytics:

```
flowchart TD
  subgraph Client
    A[User Browser or App] -->|Shorten URL Request| B[API Gateway]
    A -->|Click Short URL| G[API Gateway]
  end

  subgraph API
    B --> C[URL Shortener Service]
    G --> H[Redirection Service]
  end

  subgraph Data Layer
    C -->|Read/Write| D[(Relational DB)]
    H -->|Read| D
    C -->|Cache Write| E[(Redis Cache)]
    H -->|Cache Read| E
  end

  subgraph Async & Analytics
    C -->|Emit Event| F[Message Queue]
    F --> I[Analytics Worker]
    I --> J[(Analytics DB)]
  end

  style A fill:#222222,stroke:#FFFFFF,stroke-width:1px,color:#FFFFFF
  style B fill:#2C3E50,stroke:#FFFFFF,stroke-width:1px,color:#FFFFFF
  style C fill:#34495E,stroke:#FFFFFF,stroke-width:1px,color:#FFFFFF
  style H fill:#34495E,stroke:#FFFFFF,stroke-width:1px,color:#FFFFFF
  style D fill:#1F2A37,stroke:#FFFFFF,stroke-width:1px,color:#FFFFFF
  style E fill:#1F2A37,stroke:#FFFFFF,stroke-width:1px,color:#FFFFFF
  style F fill:#2C3E50,stroke:#FFFFFF,stroke-width:1px,color:#FFFFFF
  style I fill:#2C3E50,stroke:#FFFFFF,stroke-width:1px,color:#FFFFFF
  style J fill:#1F2A37,stroke:#FFFFFF,stroke-width:1px,color:#FFFFFF
```
##### Deep dive
- **Mechanism**:
	- Generate unique 64-bit integer ID (6 characters) then convert it into a short string for the "short-alias" using Base-62 encoding. 
	- Use **_Key-Value Store_** (e.g. Redis, DynamoDB, Cassandra) where `short_alias` is the key and `long_URL` (+ metadata) is the value. This selection optimizes read performance and scalability needed for the redirect flow.
		- SQL database with an index on the `short_alias` column might be overkill for simple key-value lookups, potentially less scalable for massive read volumes compared to dedicated K-V stores.
		- A relational DB might help if we need user authentication.
	- Use HTTP status code `300`s for redirection messages., 
- **Analytics**: log clicks _asynchronously_ (e.g., via message queue) to keep redirects fast.
- **Bottlenecks**:
	- Availability: use master‑slave or multi‑AZ deployments for your DB and Redis.
	- Security: sanitize inputs, monitor for abuse (bots spamming links).

