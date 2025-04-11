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
- f
- f
### Reliability
- f
- f
### Latency
- f
- f
### Consistency
- f
- f
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
- d
- d
#### NoSQL
- d
- d
- d
### Caching
- f
- f
- f
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
- Design Excalidraw.

