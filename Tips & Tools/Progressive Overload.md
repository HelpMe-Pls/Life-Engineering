[[Annual Review]]
[[Self Authoring]]

- Much needed for a promotion/ CV Update/ Interviews
- Just start it right when a challenge arises, then document it along the way. Just begin with listing every obstacle that you faced, how you handle it, then clean them up and filter out those impactful ones later.
- Focus more on the IMPACT (especially ***meaningful*** ones) rather than the output just for the sake of getting something done. Explain your trajectory/decisions **in terms of the value** you bring to others. You need to make it clear it’s not about you; it’s more about the value you bring.
- Have the STAR method as your guidelines (master the Art of Storytelling)
- Update every month/quarter
- Make a summary of **highest-impact** checkpoint - the works that you're most proud of, after a year of working (or before switching to a new company)
- Make YOUR achievements sound like they're bringing a meaningful change for your team/company/community (i.e. if you have time, try to write a dramatic, intriguing STORY - the one with ups and downs, how you handle unexpected situations and make good use of opportunities - then spar it it in casual conversations)
> [!important]- Find common ground
> - If you can connect the dots between your past, present, and future; identify the underlying themes in your career trajectory; and explain the **unique** value you can bring to your new endeavor, you’re winning.
> - To make it happen, **==ask them==** MORE questions related to the difficulties that you outlined, the tools that you used while you're walking them through the story. The more similarities between your story and their challenges, the better. **==Sympathy is key==**.

---

# FPT
## Cloudflare
### Microservices
"Designed and developed an _**event-driven microservice**_ with RabbitMQ to decompose a monolith, ensuring _**eventual consistency**_ for inventory-update APIs and cutting timeout incidents by 75%."
#### The context
- "_What was the primary business driver or technical limitation that necessitated building this particular EDA (event-driven architecture)?_"
	- The primary driver was a critical **technical limitation** causing significant **business impact**:
		- Our application was initially built as a NextJS monolith to handle several _==synchronous calls to external third-party services for our core features==_, like inventory updates where each REST API call to the third-party service triggers a cascade of multiple reads and writes on our database. _==As usage grew==_ (e.g. multi-user scenario during high-traffic periods), the entire end-to-end business process for a single update would take a significant amount of time – sometimes several seconds – due to the _==third-party latency combined with the serial nature of the internal processing steps, leading to frequent timeouts==_ (504 Gateway Timeout to be specific).
		- The underlying reason is that _==the total duration==_ required to complete the _==entire transaction flow for one request==_ tied up the event loop thread for too long, preventing it from rapidly cycling through and processing other pending events or handling new incoming requests efficiently.
		- Roughly 4 out of every 10 requests for ==certain operations would fail _on our end_== simply because of these blocking synchronous events.
		- So to make our system **more resilient and responsive**, we introduced the event-driven approach with _==RabbitMQ specifically to decouple the third-party communication from the main request-response cycle==_.
		- After the decomposition, timeout incidents dropped from an average of _==4 timeouts for every 10 requests down to 1 in every 10==_.
- "_What aspects of the design and code did you **personally own**?_"
	- My ownership was centered entirely on _==the worker microservice, which serves as both a consumer and a producer==_ of this event-driven flow, where:
		- **The design**: deciding on core libraries, logging patterns, and error handling strategies for this Node & TS _==modular structure==_ worker service (e.g. `src > messaging / core / shared`).
		- **The implementation**: developing the _==idempotency logic==_ to safely handle potential message redeliveries from RabbitMQ, implementing _==retry mechanisms (with exponential backoff)==_ for transient third-party API failures, and integrating with the _==Dead Letter Queue mechanism==_ for undeliverable messages.
			- A simplified flow looks something like: `Producer (pub) → Open a connection → createChannel → Exchange (routing msg) → Queue → Consumer (sub)`
		- **Testing**: writing comprehensive _==unit tests and integration tests==_ using Vitest that mocked RabbitMQ interactions with third-party APIs (using `msw`) to verify the end-to-end flow within the worker under various success and failure conditions (e.g. API errors, redeliveries).
- "_Given the goal of eventual consistency, **why RabbitMQ** (not Kafka) was selected as the most appropriate solution, **despite other alternatives** like synchronous APIs with retries, change data capture, batch processing?_"
	- Our SLAs required that "any specific _==user action must eventually completes or is explicitly handled==_" and "the tasks need to be initiated relatively quickly after the user action, _==even if the final result takes time==_".
	- To satisfy those requirements, **batch processing** seems like a viable option, but it would introduce unwanted latency. It's _better suited for scheduled, non-time-sensitive **bulk operations**_.
		- Synchronous APIs with retries is exactly the initial cause of our problems. Simply adding more retries wouldn't solve the fundamental issue of blocking the primary API server and resource exhaustion, so there's no point sticking with it.
	- Compared to Kafka, which is more suitable for a distributed _streaming platform_, our use case leans toward _==discrete, individual task processing==_ (the third-party API calls) that _==needed robust acknowledgement, retry logic, and potential dead-lettering==_, so that's why RabbitMQ felt like a more natural fit.
#### Skin in the game
##### Technical
###### Implementation
- "_How was the RabbitMQ cluster itself **configured and operated** to ensure high **availability and eventual consistency** for the application?_"
	- We agreed on these configs and conventions for our worker service:
		- **Clustering**: the RabbitMQ server was run as a multi-node cluster (typically 3 nodes _spread across availability zones_) to provide fault tolerance at the broker level.
		- **Mirrored Queues**: to ensure that if one node went down, the queue remained available on the others, preventing message loss.
		- **Heartbeats & Monitoring**: network heartbeats were configured between consumers and the broker to detect dead connections quickly. Our monitoring put an emphasis on unacknowledged messages to spot issues proactively.
		- **==Durable Queues==**: with the `durable: true` flag, the queue definition itself would survive a broker restart.
		- ==**Persistent Messages**==: the NestJS producer published messages with the `{persistent: true}` flag, allowing messages to survive broker restarts.
		- ==**Manual Acknowledgements**==: to prevent message loss if the worker crashes mid-processing, I made sure that a message was _only_ removed from the queue after my service successfully processed it (via `channel.ack(msg)`) or explicitly rejected/dead-lettered it via `channel.nack(msg, false, requeue=false)`.
		- **Publisher Confirms**: the producer side used Publisher Confirms to ensure RabbitMQ actually received and accepted the message before the producer considered its job done.
- "_What were the **key trade-offs** made in this project, particularly concerning eventual consistency?_"
	- ==**Operational Overhead**==: running and monitoring RabbitMQ and the worker service added operational overhead compared to the single monolith deployment.
	- ==**Debugging Complexity**==: issues across distributed components (`producer → broker → consumer`) is inherently more complex and more time consuming to debug compared to a single application stack.
	- **Latency**: users lost immediate confirmation that the _entire operation_ was complete, receiving only confirmation that it was _accepted_ for processing. We updated our loading UI to compensate this UX compromise.
###### When shit hit the fan
- "_Tell me the most significant technical hurdles or **unexpected challenges** encountered specifically in the pursuit of **ensuring eventual consistency** during this project. How did you diagnose and overcome them?_"
	- The most time consuming challenge that I faced was to reliably _==distinguishing between transient, retryable errors and permanent, non-retryable errors==_ originating from poorly documented third-party APIs.
		- Getting eventual consistency right heavily depends on correctly _==deciding whether to retry a failed operation==_. Retrying permanent errors would waste worker resources and delayed other messages. _Not_ retrying transient errors meant the operation for that message might _never_ complete, breaking eventual consistency for that specific task.
		- This often required painstaking manual work when messages landed in the DLQ or logs showed repeated failures:
			- We created a rule regarding `http` status codes: _==5xx/timeouts → Retry==_ (with exponential backoff + max attempts). For _==4xx → Don't retry==_ (assume bad request data), log details, push it to the DLQ.
			- By _==analyzing the DLQ==_, we were able to refine the classification logic and _==identify underlying data issues or new third-party error patterns==_.
- "_How did you prevent divergence and maintain **idempotency** in certain failure conditions like **message loss or redeliveries**?_"
	- I followed the _**Check-Read-Write convention**_ to guarantee ==_at-least-once_ delivery==: 
		- First, the NestJS producer included an _==`Idempotency-Key` within each message_== (and this is _not_ the `correlationID` where it ensures that a response is matched with the correct request).
		- Next, apply the Check-Read-Write pattern with our Redis distributed cache as follows:
			- **Check:** upon receiving a message, the worker extracted the unique ID (i.e. the `Idempotency-Key`).
			- **Read:** then it read this ID from the _==Redis idempotency store==_.
			- **Write**: 2 things might happen:
				- First delivery: the ID did **not** exist in Redis → the worker **write** the ID to Redis.
					- If the write succeeded: the worker would process the message. On success, it would `ack` the message. If processing failed definitively (non-retryable), it would `nack` (without requeue) and log the operation.
					- If the write failed, the worker treats that message as a redelivery.
				- Redelivery: the ID **existed** → the worker logged it then `ack` the message. 
#### Ownership
- "_If you were to scale this microservice, what would be your initial approach?_"
	- My initial approach would be straightforward ==_horizontal scaling_== of the worker consumer instances. 
	- **Increase Consumer Instances**: since _==RabbitMQ distributes messages round-robin to consumers on the same queue==_, simply deploying _==more identical instances==_ of the worker service (e.g. increasing the replica count in Kubernetes) will increase the overall message processing throughput.
	- **Broker Scaling (secondary)**: if message rates become extremely high, eventually the RabbitMQ cluster itself might need scaling (more nodes, better hardware), but consumer scaling is the first lever to pull.

### Transformed manual testing process
"Implemented an **_automated QA pipeline_** with Vitest unit/integration and Playwright E2E that reduced the manual testing phase from 3 days to 1 day on average, contributing to a 67% reduction in _**deployment latency**_."
#### Metrics validation
- _"How confident are you that this pipeline was the primary driver of that specific 67% gain, and how did you isolate its impact?"_
	- Before the pipeline, we tracked metrics like the _average time bug tickets remained open_ (which was around 3 days), the duration of the manual QA cycle per release candidate, and the frequency of hotfixes needed shortly after deployment due to regressions.
	- Following the pipeline's implementation, our QA team could approve release candidates faster because their effort shifted from _==repetitive regression checks==_ (now automated) to more valuable exploratory testing and validation of new features, dropping our bug-fix cycle time _==from 3 days to 1 day on average==_.
- _"What were the **primary bottlenecks** in the previous manual testing process that this pipeline aimed to solve?_"
	- Implementing this pipeline was about _==making sure that the existing features keep on working throughout the monolith decomposition process==_.
	- The throughput of our releases was limited by QA's capacity to _manually_ test everything. _==Automation removed QA from being a blocker for **verifying existing functionalities**==_, freeing them to _focus on higher-value tasks_ like usability testing, ==exploratory testing of new features, and _edge case analysis_==.
#### Skin in the game
##### Technical
###### Implementation
- "_How did you decide what to cover with Vitest (unit/integration) versus Playwright (E2E)?_"
	- We followed the _**Testing Pyramid model**_ where we have _==a large base of fast, **isolated** unit tests, a smaller layer of integration tests, and a very selective top layer of E2E tests==_.
		- For testing ==_individual functions, components_ in isolation==, and to pinpoint failures precisely, we go for _**unit tests**_. All external dependencies (like database calls, API calls, other modules) were mocked or stubbed.
		- For testing the _==interaction between several units within a single service_== or application boundary, we use **_integration tests_**. A mocked database layer or a test database instance is usually required for this stage.
		- To ==_validate complete user flows **through the UI**_==, interacting with the deployed application (usually on a staging environment) just like a real user, we use E2E tests. They provide the highest confidence that the system works as a whole from the user's perspective. However, they are the slowest, most brittle, and most expensive to write and maintain, so we focus mostly on the absolute critical paths (i.e. smoke tests).
- "_What was your **strategy for test coverage**, and how did you decide what was **'enough' coverage**? What patterns did you implement to share test utilities and fixtures?_"
	- Our strategy focused on _**risk and value**_, not just hitting arbitrary code coverage percentages:
		- **_For unit tests_**, we aimed for a high line/branch coverage _==(80%+) for **core business logic**==_, complex algorithms, and utility functions. Lower coverage was acceptable for simple code (like basic CRUD controllers with little logic).
		- **_For integration tests_**, we focused on covering ==_**the contracts** between major components or services_== – ensuring API endpoints behaved as expected, key service methods interacted correctly.
		- _**For E2E tests**_, we explicitly decided _not_ to cover every edge case or UI variation but we did put an emphasis on the _==critical "**happy paths**" of major user **workflows**_== like authentication and core features usage.
	- Our test coverage was considered 'enough' when:
		- The automated tests were regularly _==catching regressions **before** they reached manual QA or production==_.
		- The time spent maintaining the tests felt proportionate to the value they provided (i.e., not bogged down fixing flaky tests constantly).
	- We had a _==`test/utils` directory containing helper functions==_ for common tasks like setting up mock data, mock services or initializing common test states.
	- We also made tests more readable and maintainable using Playwright's _==Page Object Model and fixtures==_ to handle common setup like browser context creation, logging in users via API before tests.
- "_Were there any tradeoffs between more comprehensive testing and maintaining fast CI/CD pipelines (e.g., speed vs. coverage vs. maintainability)?_"
	- More tests mean more confidence but longer feedback loops. We _==prioritized writing tests for areas known to be complex, critical, or historically buggy==_, rather than trying to achieve 100% coverage which includes unnecessary tests for implementation details.
	- We configured our CI environment (GitLab CI in this case) to _==run tests in parallel across multiple runners/jobs==_. Both Vitest and Playwright have excellent support for parallel execution, which drastically reduced the overall wall-clock time for the test suites. More specifically, ==we employed a _tiered execution strategy_==:
		- _**On Pull Requests/Commits**:_ Run all fast unit and integration tests.
		- _**On Merge to Main/Pre-Deployment**:_ Run the _full_ E2E suite.
		- _**Nightly Builds**:_ Run the full E2E suite and potentially longer-running integration tests or performance tests.
###### When shit hit the fan
- "_Describe a specific test you wrote that **caught a regression** that would have otherwise gone to production. What made this particular test valuable?_"
	- We had a Playwright E2E test for our user profile update flow. A developer was refactoring the backend API endpoint and _==updated the JSON payload structure for updating the user's time zone preference==_ – the frontend was sending `tzId` but the refactored backend now expected `timeZoneId`.
	- The unit tests for the backend endpoint passed (as they were updated with the new expectation), and the frontend unit tests for the profile component also passed (as they mocked the API call). However, the _**Playwright E2E test failed**_. It filled out the profile form (including the time zone dropdown), clicked 'Save', waited for the success notification, then reloaded the page and _asserted that the time zone dropdown **still held the newly selected value**_ (e.g. `await expect(page.locator('[data-testid="timezone-select"]')).toHaveValue('america_new_york');`. And _==due to the mismatched payload key, the assertion failed==_ – the time zone reverted to its old value on reload.
	- This test was valuable because:
		1. It _==tested the full flow==_ from UI interaction to data persistence and back to UI verification and _detected the mismatched payload_.
		2. It _==prevented a subtle bug==_ that would likely frustrate users without being immediately obvious, _saving us from deploying a broken profile update feature_.
- "_Tell me about **a critical production bug** that your automated tests failed to catch. How did you diagnose the bug and adjust your testing approach afterward?_"
	- A critical bug occurred where users _==under very specific network conditions==_ (high latency, intermittent packet loss – more common on mobile networks) _experienced duplicate form submissions when registering_, ==_occasionally creating two user accounts_== with slightly different states _**due to a race condition**_ between the client-side retry logic and the _==backend's non-idempotent registration endpoint==_.
	- Why our tests missed it:
	    - **Unit/Integration Tests:** These operated under ideal conditions, mocking network calls instantly or interacting with a fast local database. They _couldn't replicate real-world network flakiness_.
	    - **E2E Tests (Playwright):** Our standard E2E tests ran in CI environments with stable, fast network connections. While Playwright _can_ throttle network speed, _==we hadn't explicitly configured tests to simulate the specific kind of intermittent failure==_ that triggered the duplicate submission logic in the frontend JavaScript. _==The backend endpoint also wasn't designed to be fully idempotent for this specific call==_.
	- Solutions:
	    1. **Enhanced E2E Scenarios:** We added specific Playwright test cases that used its network throttling capabilities (`page.route()`, `route.abort()`, or network condition emulation) to _simulate poor network conditions_ during the registration submission, specifically aiming to trigger the client-side retry logic and assert that only one account was created.
	    2. **Backend Idempotency:** We updated the registration endpoint to be idempotent (_==using a unique `Idempotency-Key` sent **by the client** in the request header==_), preventing duplicate account creation even if the request arrived twice. This was the _real_ fix, but the E2E test ensures the frontend handles related errors gracefully too.
	    3. **Improved Client-Side State:** We also updated the frontend JavaScript to _==disable the submit button immediately on the first click attempt==_, reducing the window for accidental double clicks during latency.
- "_Give me a specific **example of a flaky test** you encountered and how you stabilized it._"
	- So flaky tests happen in pretty much the _==same conditions as those transient API failures==_. We had a flaky Vitest integration test that checked _our notification service_. The test would trigger an action, then _==poll a mocked WebSocket connection for an expected notification message==_. It failed maybe 5% of the time in CI with a timeout waiting for the message.
	- We realized the notification service had some asynchronous processing internally. While _usually_ fast, _==under certain CI load conditions, the processing could occasionally take slightly longer==_ than the fixed 500ms timeout we'd arbitrarily chosen. The test logic itself was correct, but the timing assumption was too tight and didn't reflect potential real-world variability.
	- So we decided to increase the timeout duration to accommodate CI load conditions and ==_replace manual `setTimeout` loops with Vitest built-in `expect.poll` method with a timeout argument for better maintainability_==.
##### People
- "_When implementing this pipeline, you likely faced resistance from some team members. Tell me about the **most significant push back** you received and how you addressed it._"
	- The most significant pushback, as mentioned in the context, was the cultural resistance based on the idea that **'_testing is QA's job, not developers_'**. This manifested as reluctance to allocate time for writing tests alongside feature code and _==skepticism about the ROI==_.
	- Getting _==buy-in from our team lead==_ was crucial. They helped reinforce the message that quality and sustainable pace were team priorities, supported by the evidence of customer impact from the existing technical debt.
	- _==I built a small but functional PoC pipeline with a simple unit test==_ for a function which returns the strictest (i.e., smallest or most limiting) directives for _Cache-Control headers_. This demonstrated _concretely_ how tests could be written, how fast they could run in CI, and _==how they could catch a simple, simulated regression==_. Seeing it in action was more powerful than just talking about it.
	- I emphasized how automated tests _==benefit **developers** directly==_ by providing faster feedback, increased confidence in refactoring, and _==scalable as they reduce time spent debugging regressions==_.
#### Ownership
- "_Looking back, what is the single biggest thing you would do differently if you were to build this QA pipeline again today, knowing what you know now?_"
	- Embedding the _habit_ and ==_shared ownership of testing more strongly and formally from the absolute beginning_== would likely have smoothed the adoption curve and accelerated the cultural shift even further.

### Fullstack development
"Developed a Next.js application implementing role-based access control (**_RBAC_**) to restrict user access to **_specific features_** based on their subscription tier in a pay-as-you-go model."
#### Context
- "_What was the product's primary **purpose**, who were the **target users**, and what were your specific **responsibilities**?_"
	- The application served as a platform _==providing tools and workflows==_ built on top of unique capabilities derived from integrating with _==third-party APIs==_.
	- The users were _==professionals within our enterprise partner organizations==_ who needed access to these specialized tools and data to _perform their job functions_.
	- I developed the user-facing sections related to _==account management and user profiles==_, allowing users to view their subscription status, manage settings, and potentially initiate upgrades.
		- I also own a worker service which handled the _==asynchronous business logic and interactions with the core third-party APIs==_, often applying different logic or quotas based on the user's subscription tier determined by the RBAC system.
- "_What kind of **features** were gated, and how did the RBAC system reflect the billing status?_"
	- Access control was applied to various aspects based on the subscription tier (Trial, Tier 1, Tier 2):
		- **Feature Access:** enabling/disabling entire sections or specific functionalities.
		- **Usage Quotas:** _==limiting the number of API calls to the underlying third-party service==_ per month or the number of specific resources a user could create. Higher tiers received higher or unlimited quotas.
	- Through _==Stripe webhooks==_, changes in subscription status (e.g., `customer.subscription.updated`, `checkout.session.completed`) triggered updates in our application's database, assigning a corresponding _role_ (e.g., `ROLE_TRIAL`, `ROLE_TIER_1`, `ROLE_TIER_2`) to the user record.
		- This **role** was then used by the backend (and potentially included in the user's session/token) to _==determine their specific **permissions**==_ (e.g., `feature:export:enabled`, `quota:api_calls:5000`).
- "_Why were **Next.js and TailwindCSS** chosen for this project? What are the **trade-offs**?_"
	- I wasn't the one who decided to choose NextJS, but if I had to make a guess, the main reason would be that it has a _==large ecosystem and community support==_ in case things go sideways.
	- Choosing TailwindCSS is _==just a matter of convention==_, because most of NextJS app out there go with it. Besides, its utility classes with built-in responsive modifiers make creating adaptive layouts straightforward.
	- The main trade-off is that this tech stack decision presents a _==slight learning curve overhead==_ for those who are not familiar with the modern frontend conventions.
#### Implementation
##### Technical
- "_Tell me about the key **Next.js features** that you used and your rationale behind them._"
	- **Server Components** for Initial Load: this keeps the initial load fast and secure by _==fetching the core profile data **on the server before** the page is sent to the browser==_ (using `async/await` and the `fetch` API)
	- **Client Components** for Dynamic/Interactive Parts: for parts of the profile _==where the data is fetched **in the browser** and needs to update frequently **after** the page loads==_ (e.g. recent activity, notifications)
	- **Server Actions** for Updates: when server actions are triggered by a form submission, we can securely _==handle that update on the server and then revalidate the cached data==_ so the profile screen shows the latest info.
- "_How was the **RBAC system** designed and implemented? How did you ensure role integrity?_"
	- It was not my responsibility to handle the user roles and permissions, but as far as I know, we use _==Stripe webhooks updated the user's role in our application database based on their subscription status==_. A payment related event from Stripe is what drives the RBAC system.
	- By using _==JWT signatures==_, we secure the API responses containing role/permission information.
	- Permissions (from the validated token) is what gate the features of our products. _==Guards and Decorators from NestJS are the primary handlers for these operations==_.
#### Security
- "_Describe how you secured sensitive operations, particularly those related to updating billing information or modifying user roles/permissions, against **common web vulnerabilities** (e.g., CSRF, XSS, unauthorized access)._"
	- Regarding authentication, we used ==_JWTs stored in secure, `HttpOnly` cookies to prevent XSS from easily stealing tokens_==. Short token expiry times with refresh token rotation.
	- Strict enforcement of permissions on **every backend API call** related to sensitive data or actions are handled by the Guards and Decorators from our NestJS backend. 

## Autocall
### Account hierarchies
"Developed secure API queries that resolved a long-standing _**security vulnerability**_ related to _**missing authorization**_ in account management, reducing unauthorized data access incidents by **90%** across different account types."
#### Security deficiencies identification
- Looking at our security timeline, we had a nine-month period from when issues were first flagged to when I completed the implementation, which was like 3 months of narrowing down the bug, 2 months of planning, and 4 months of implementation and migration. My analysis of our audit records reported that most of our vulnerabilities were about permission inconsistencies. More specifically: 
	- Our **_AWS CloudTrail_** security audits and database access logs revealed unauthorized access through ==_race conditions_== during permission checks.
- So here's how it all started: we took over this project from a team that had just been let go, right when they were in the middle of scaling it up for new business requirements. 
- Originally, they used a simple boolean flag (`is_root`) for permission management, which worked swimmingly for the old business where they had very few customers; but ever since they upgraded the business model, it led to _==scattered permission handling throughout the backend code==_, **not scaling** with their multi-tiered account structure, and the company was actually **_losing serious revenue_** because of all these _==permission-related security holes==_ that kept popping up.
	- Our business logic was updated to include ==_three subscription packages_==, which resulted in breaking changes to the database schema. 
	- For example, in the highest tier, root accounts (level 1) have full administrative privileges, whereas accounts at levels 2 through 4 are granted progressively fewer permissions.
#### Technical deep dives
##### MariaDB
- "_What specific **features of MariaDB** did you leverage in your redesign that addressed the security vulnerabilities?_"
	- Before the fix, we had ==_permission queries exposed to the application layer_== in the backend code with Eloquent ORM. We had *slightly* _**different checks scattered**_ across multiple controllers or services for this, which led to **bugs in distributed logic** where fixing a bug one place might not get replicated correctly elsewhere, leading to ==diverging logic and **_inconsistent access control_**== over time.
	- To fix it, I implemented those centralized, Single Source of Truth "_secure API queries_" which were essentially calls to ==_parameterized views_== (through **_stored procedures_**) to make sure that the backend code only calls the procedure by its name so that ==_the actual filtering logic stays secured in the database_==.
	  ```sql
CREATE PROCEDURE sp_GetAccountDetails_Secure (
    IN p_requesting_user_id INT,  -- ID of the user making the request, its value is passed into the stored procedure from the caller
    IN p_target_account_id INT    -- ID of the account being requested
)
BEGIN
    SELECT
    FROM
    WHERE
    IF
    ELSEIF
END
		```
	- We also enhanced speed by leveraging _**database indexing**_. Without it, the stored procedure approach wouldn't have been viable performance-wise.
- "_Walk me through your database **schema design**, specifically focusing on foreign key constraints, **indexing strategies**, and how they related to **security enforcement**."_
	- I implemented a _**self-referential schema**_ with `level`, `parent_id`, and `hierarchy_path` columns, like:
	```sql
CREATE TABLE accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  parent_id INT NULL,
  customer_id VARCHAR(36) NOT NULL,
  level TINYINT NOT NULL,
  hierarchy_path VARCHAR(255) NOT NULL,
  subscription_tier TINYINT NOT NULL,
  FOREIGN KEY (parent_id) REFERENCES accounts(id) 
);

CREATE INDEX idx_hierarchy ON accounts(hierarchy_path);  --Indexing
``` 
	- I also added constraints **_preventing circular references_** when ==_updating an account's parent_== by checking the new parent's `hierarchy_path` to make sure that it doesn't include the current account's ID.
		- It's like saying: "Before making someone your parent, check their family tree. If you already see your name in their tree, then you're trying to be your own grandparent—which is invalid." 
		- We actually didn't think this case would happen in production until we got notified on Sentry. I just can't imagine the consequences if we hadn't _==conformed to the ACID properties== for destructive operations_. So I just added the constraint for good measure so that we don't have to rely on the database's default lock wait timeout mechanism for blocking operations (which was 50s).  
	- Our business also enforced maximum depth based on `subscription_tier`.
- "_How did you ensure consistency across these hierarchies during **concurrent operations**?_"
	- I addressed that by applying ==_ACID-compliant transactions_ using **_row-level locking_**== (via `lockForUpdate()` in Laravel) to ensure that only one operation can modify a particular parent record at a time.
	- We also leverage the `hierarchy_path` column for a quick and intuitive snapshot of the entire lineage without needing recursive joins.
- _"How did you handle **backward compatibility** regarding the transition of existing data to the new architecture while maintaining security and integrity?"_
	- Oh, that was definitely _one of the most time consuming challenges_ that I faced. I had to create a **_staged migration_** using temporary _**shadow tables**_ with both old and new schema structures. For each customer:
		1. Generate hierarchy IDs and levels for existing accounts
		2. Validate data consistency using ***transaction blocks***
		3. Apply changes in **_atomic batches_** of 1000 accounts
		4. Run parallel _**verification jobs**_ to ensure data integrity
	- This part alone took us almost a month to finish.
##### Laravel
- "_How did you implement the **authorization layer** to interact with your redesigned database architecture? What were the **limitations** you encountered?_ "
	- I extended ==_Laravel's built-in Auth façade_== called `Gate` with **_custom middleware_** that injected account hierarchy data into all authenticated requests. 
	- There were no significant limitations since I made use of Laravel's built-in utilities. 
- "_How did you handle **permission inheritance** across your account hierarchy? Show me the Laravel's feature you used for enforcing these cascading permissions._"
	- To propagate permission changes down the hierarchy tree, I implemented a ACID-compliant transaction combined with **_batch processing using Laravel's Events system_** and make use of the `hierarchy_path` defined in the database schema.  
##### Scalability
- "_What specific scalability issues did your redesign address, and how did you **validate the improvement**?_
	- We were able to reduce our customer permission query times from ~300ms to ~15ms at our peak load by implementing _**hierarchy-aware caching**_ layers using **Redis** and _**database read replicas**_ for hierarchy lookups. 
	- We validated the improvement by performing **_stress testing with JMeter_** and **_chaos testing_** by _==simulating random node failure==_, resulting in about 85% percentile response times remained under 100ms at 3x our projected load. Which is not too bad, but definitely could be better. 
- "_Under what conditions would your solution begin to show **performance degradation**, and what would be your **mitigation strategy**?_"
	- We haven't actually encountered a significant performance degradation, but I imagine if there's such a case, it'd be due to extremely wide hierarchies (we're talking thousands of siblings).
	- In that case, I'd identify and implement _**hierarchy partitioning**_ for wide trees (by adding a `root_id` column to the `account` table) as well as denormalizing frequently traversed paths with **_database trigger_** to automatically update the `hierarchy_path` column whenever an account is inserted.
##### Race condition
- "_Walk me through a specific **cross-site data inconsistencies** that could occur in your system and how your architecture prevents it._"
	- The 'cross-site' inconsistencies primarily referred to discrepancies in data visibility and state _**across the different tiers and branches of our account hierarchy**_. It wasn't about geographically separate sites, but rather logical separation within the data structure.
	- Race condition is not something that happen very often, however, there was a case where _==two administrators attempted to modify the same account's permissions concurrently==_ (e.g. one admin is moving a child account while the other is changing its parent's permissions). We tracked and handled such incidents by:
		- Creating an event log table that recorded all permission change attempts.
		- **_Implementing row-level locks_** (using Laravel's `lockForUpdate()`) during permission change transactions, preventing partial update inconsistencies.
		- Using database constraints to enforce hierarchy rules by **_checking if an accounts' parent is valid_** (i.e. must exist via a foreign key) and an account cannot be its own parent. 
			- So even if two admins trigger changes simultaneously, _==any attempt to violate the hierarchy rules will be rejected by the database==_.
#### Team work & Impact
##### Measurables
 - We achieved a significant in **_enterprise tier upgrades_** due to confidence in our isolation guarantees between the tiers, as well as _==90% reduction in permission-related support tickets==_.
 - Our quality control reports **_zero permission bypass incidents_** in production over the past 3 months, validated through Sentry audits, and permission queries now sustain sub-100ms p99 latency at scale, _==meeting all customer SLAs==_.
##### Resolving conflicts
- The most challenging disagreement was whether to implement the solution at the application or database layer. I resolved this by:
	- Building **_proof-of-concept implementations_** of both approaches.
	- Facilitating a **_technical design review_** with the team to compare the trade offs.
	- **_Building consensus_** around the hybrid approach that leveraged database constraints for permission related operations and keep other business logic handlings with Eloquent for maintainability.
- "_Kindly discuss any significant ==**technical tradeoffs**== that were necessitated during the project's lifecycle._"
	- The decision to centralize permission handling logic with stored procedures, planning the staged migration with shadow tables, and ensuring backward compatibility **_required significant upfront effort_** compared to keep patching the existing application logic (which likely wouldn't scale or be fully secure).
	- The row-level locks (`lockForUpdate`) during permission updates also introduced a direct tradeoff: ==_increased data consistency_== at the cost of **_reduced concurrency_** for those specific operations. We deemed this necessary for critical permission changes but _mitigated the impact_ by keeping transactions short, specific, and using _batch processing_ for bulk updates where possible.
##### Cutting-edge alternatives
- If I were to build everything from scratch, I'd probably use NestJS with Prisma, you know, just **_switch the tech stack_** to my advantage without changing anything about the business logic and the way we conceptualize the system.  
##### Persuasion
- I secured our technical stakeholders buy-in by:
	- Building a **_working MVP_** that demonstrated the solution with some mock data
	- Developing a **_phased migration approach_** that minimized customer disruption
- For non-technical stakeholders, I created visual hierarchy **_diagrams showing "before/after"_** permission flows and framed the discussion around **_competitive advantage and reduced security liability_** rather than implementation details.

### Responsive design
"Owned the front-end implementation of _**responsive layouts using CSS Grids**_ for authentication screens of a _**legacy desktop-only application**_, ensuring correct display and usability across desktop, tablet, and mobile viewports."
#### Problem identification
- _"When you say you '**owned**' the implementation, explain exactly what **your responsibilities** were versus your team members. What specific code or components did you personally write versus oversee?"_
	- When I say I 'owned' the implementation, I did collaborate closely with our design team on wireframes and prototypes, but I was the primary engineer responsible for the end-to-end delivery of the responsive authentication UI. Specifically I wrote:
		- The _==media query breakpoints==_ for mobile, tablet, and desktop views
		- The form element _==resizing logic==_ for the authentication pages (login, register, password reset)
		- The integration between new TailwindCSS classes and existing Laravel Blade templates
- _"You mentioned a **legacy** desktop-only application - explain the specific **architectural constraints** you faced when implementing responsive design on a system not originally built for it."_
	- The most challenging constraint was the _==side-by-side layout pattern==_ used throughout the app. 
		- Authentication screens had the form on the left and a prominent background image on the right at fixed widths. 
		- On narrow mobile screens, this _==forced the form to become very narrow, causing long input fields like 'Email' to look too cramped and unusable==_.
		- Additionally, each view relied on a mix of server-rendered Blade templates and jQuery for client-side interactivity, creating tight coupling between markup, styling, and behavior.
#### Biggest challenges
##### Technical
- _"How did you balance **business requirements** for mobile support against **technical limitations** of the legacy system? Give me an example of a **tradeoff** you had to make."_
	- The core business requirement was _==enabling mobile signups to increase conversion rates==_ without disrupting the existing desktop experience.
	- We had to find the path of least resistance to deliver the _most critical_ aspect of the mobile experience (usability of auth forms) without destabilizing the existing application or requiring a massive refactor. This meant focusing _only_ on the auth screens first, and accepting that we'd be working _within_ the legacy constraints (jQuery, Blade, Bootstrap)
	- I proposed using Tailwind classes _specifically_ for its layout utilities (Flexbox, Grid, spacing) on these new auth screens. _==The cost was the initial setup effort, some developer discussion==_ (mitigated by its utility focus resembling Bootstrap conventions), and the need for careful management of CSS scope.
	- We agreed _not_ to refactor existing Bootstrap components immediately but to allow Tailwind for _new_ layout work. We were just so ==fed up with fighting those _CSS specificity problems_ and maintaining backward compatibility== felt like keep piling more overrides onto that already bloated legacy stylesheet.
- "_What was the most difficult and time consuming **technical challenge** that you faced while migrating to mobile-friendly?_"
	- CSS specificity battles were the biggest hurdle. It limited how cleanly we could structure our new CSS, often forcing us into overrides rather than clean implementation.
	- Coming from a React background, working directly with _==jQuery for DOM manipulation, event handling, and simple state management==_ (like showing/hiding error messages or loading spinners) **_felt imperative_** and less organized.
	- Backward compatibility was paramount, so replacing jQuery wasn't an option for this scope, which means that I had to make my new Blade template work with the existing jQuery.
- "_Imagine the legacy backend sometimes returned **inconsistent error states** or had timing issues that only manifested on slower mobile connections. How would you architect the front-end logic to handle such **backend unreliability** gracefully for the user during authentication, without simply showing a generic 'error occurred' message?_"
	- First of all, I'd think of leveraging the _==HTML5 built-in validation attributes==_ (`required`, `type="email"`, `pattern`, `minlength`,...) and potentially _lightweight **jQuery validation plugins**_ to catch obvious errors _before_ hitting the backend, reducing unnecessary requests to the server.
	- On timeout or network error (`jqXHR.status === 0`), display a specific message ("Could not reach the server. Please check your connection.") and offer a clear "Try Again" button that re-submits the _same_ data without the user re-typing.
	- Ideally, work with the backend team to ensure auth submission endpoints are idempotent where possible, so a retry doesn't accidentally create multiple accounts or send multiple OTPs.
##### People
- "_Describe a conflict that arose regarding design or implementation decisions during this project. How did you handle it, and what was the outcome?_"
	- The most significant discussion, which could be termed a healthy technical conflict, was precisely around the _**introduction of Tailwind CSS**_.
	- When I proposed using Tailwind for faster responsive development, some team members understandably raised concerns about the bundle size, learning curve and maintainability.
	- ==I made it clear that my stance wasn't about dismissing Bootstrap but finding the best tool for the _new_ requirements.==
	- I explicitly suggested we limit its use _initially_ to only the auth screen refactor, not a site-wide change, and develop clear guidelines on how/when to use it alongside existing styles (e.g., use Tailwind for the layout, existing styles/Bootstrap for component look-and-feel)
	- Regarding the bundle size concerns, I managed to address their bundle size concerns by _==setting up Tailwind with the `cssnano` plugin==_, and I also presented a small proof-of-concept refactoring one part of the problematic layout ==_highlighting the similarities in naming conventions_== for common utilities with Bootstrap to ease the learning curve concern. 
#### Ownership
- "_You mentioned ensuring '**rendering fidelity**'. What qualitative feedback did you gather, and **how did you validate** that the changes truly improved the user experience?_"
	- While maybe not a formal metric, we monitored customer support channels and _==noticed a significant drop in complaints==_ specifically related to difficulties using the auth screens on mobile devices post-launch.
	- Although harder to quantify, the introduction of Tailwind for layout _did_ subjectively _**improve the developer's experience**_ of making _these specific screens_ responsive compared to fighting with complex CSS overrides, suggesting better maintainability for future tweaks.
- "_Let's imagine we're building a new authentication system **from scratch** today that needs to work across all devices. Walk me through your **architecture decisions**, focusing on frontend considerations._"
	- If building a new, modern, responsive authentication system from scratch today, my frontend architecture decisions would _==prioritize maintainability, developer experience, performance, and security==_ with RemixJS, ShadcnUI, rely entirely on backend validation. Client-side validation is for UX only.
	- For testing, I'd employ Vitest for unit test and Playwright for integration and end-to-end tests. 

## Oncall Report
### WebSocket
"Increased user response rate to critical task deadline alerts by 38% and eliminated **_distractions caused by context-switching_** with the integration of a centralized **_WebSocket real-time notification system_** using Antd UI."
#### Context
- "_What was the product's primary **purpose**, who were the **target users**, and what were your specific **responsibilities**?_"
	- The application served as a centralized digital platform to manage workflows previously handled by manual paperwork and scattered communications (email, Workchat) within a specific department. Its core functions included task management, displaying task-related data visualizations, and _==providing **prioritized notifications for required actions**. Like a simplified version of the Jira ticketing system._==
	- The end-users were employees within that specific internal department who relied on this application daily to _==receive, track, and act upon their assigned tasks==_.
	- My role was primarily focused on designing and implementing the entire _==real-time notification system==_, including the UI elements (bell icon dropdown using Antd, toast popups using `react-toastify`) and the client-side WebSocket integration logic.
- "_Why did you prefer **RemixJS** over NextJS for this project?_"
	- RemixJS felt like a particularly strong fit for _this specific **dashboard** application_ at the time, primarily due to its intuitive handling of nested routes where the _==parent route's component file itself acts as the layout==_, compared to the manual setup in NextJS where you have to explicitly create a layout file in each folder to act as the shared layout for that section of your app and its children, which may feel more fragmented and less immediately obvious in how they relate.
- "_What were these '**critical alerts**', and why was improving the **response rate** important for users or the business?_"
	- Those are alerts for the most urgent tasks where failure to act promptly could lead to missed deadlines, operational disruptions, or violations of internal SLAs.
	- The notification system _reduced the time employees spent ==context-switching or searching for urgent tasks amongst less important notifications==_.
- "_Can you walk me through how the '**38% increase** in user response rate' was measured?_"
	- It was measured by comparing the average time taken for users to acknowledge or ==complete Level 1 tasks _before_ and _after_== the real-time system was implemented.
	- The formula to calculate that percentage increase is as simple as `((Baseline Average Time - New Average Time) / Baseline Average Time) * 100%`
#### Implementation
- "_How did you **authenticate WebSocket connections** and **authorize users** to receive specific alerts?_"
	- The primary application login issued a _==JWT stored in a secure `HttpOnly` cookie==_. 
		- When the Remix frontend initiated the WebSocket connection, the handshake request included the necessary authentication credentials.
		- The backend WebSocket endpoint validated these credentials _before_ upgrading the `http` request to a WebSocket connection. Unauthenticated connection attempts were rejected.
	- Once authenticated, the backend associated the WebSocket connection with the specific `userId`.
		- When an alert needed to be sent, the backend logic _==looked up the active WebSocket connection(s)==_ for the targeted `userId`(s) and pushed the notification message _only_ to those specific, authorized connections.
- "_How was the **reliability** of delivering these 'critical alerts' ensured? What happened if a user was temporarily disconnected when an alert was sent?_"
	- The WebSocket push was a delivery enhancement, not the primary record. The source of truth was always the backend database. A notification was _**persisted first** before_ any attempt was made to push it via WebSocket. 
	- We _==configured WebSocket **ping/pong frames** to allow both client and server to detect unresponsive connections more quickly==_ than relying solely on TCP timeouts, triggering reconnection logic sooner.
- "_Why were WebSockets chosen over **alternatives** like Server-Sent Events or polling for this specific use case?_"
	- SSE is a great option for _one-way_ server-to-client communication and is simpler than WebSockets. ==We could have used **SSE _just for receiving_** notifications==, but our SLAs stated that the user _==must be able to update their notification statuses==_.   
	- Real-time experience is crucial for the product, and _==**polling introduces latency**==_, which doesn't provide a true real-time experience. It also _==puts unnecessary load on the server **if we were to shrink the intervals**==_.
- "_What were the most significant **technical challenges** you encountered during this integration?_"
	- Since it was a back office app which serves a single department, scalability wasn't an issue. As a frontend developer, my struggles were mostly UI related.
	- So the requirement was to mark notifications as "Read" if the user _manually_ close its corresponding toast, except for Level 1 (highest priority) notifications.
	- And I caused a bug where _==manually closing a Level 1 severity alert would also mark it as "Read"==_, whereas such notifications could only be marked as "Read" _after_ the user checked off all the boxes in the detail screen.
	- There were no automated testing back then, so _==the bug was caught by our manual tester.==_ It was a quick fix nonetheless, but certainly gave me a lesson early in my career.
#### Incident
- "_If the backend system generating the source events experienced **delays or became unavailable**, how would the notification system behave? How were users informed of **potential staleness**, if applicable?_"
	- The real-time system can only deliver events as fast as they are produced upstream. _==There wasn't much the frontend could do other than reflect the timestamps accurately when notifications **did** arrive==_.
	- As soon as the WebSocket backend recovered and the client reconnected, _==the **catch-up API call** would execute, fetching all notifications missed during the outage==_, ensuring eventual consistency of the notification list.
		- Implementation detail: using `useEffect` and Remix's `useFetcher` to call a backend endpoint defined by the `loader` function.
