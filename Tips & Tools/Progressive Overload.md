[[Annual Review]]
[[Self Authoring]]

- Much needed for a promotion/ CV Update/ Interviews
- Just start it right when a challenge arises, then document it along the way. Just begin with listing every obstacle that you faced, how you handle it, then clean them up and filter out those impactful ones later.
- Focus more on the IMPACT (especially ***meaningful*** ones) rather than the output just for the sake of getting something done. Explain your trajectory/decisions **in terms of the value** you bring to others. You need to make it clear it’s not about you; it’s more about the value you bring.
- Have the STAR method as your guidelines (master the Art of Storytelling)
- Update every month/quarter
- Make a summary of **highest-impact** checkpoint - the works that you're most proud of, after a year of working (or before switching to a new company)
- Make YOUR achievements sound like they're bringing a meaningful change for your team/company/community (i.e. if you have time, try to write a dramatic, intriguing STORY - the one with ups and downs, how you handle unexpected situations and make good use of opportunities - then spar it it in casual conversations)
> If you can connect the dots between your past, present, and future; identify the underlying themes in your career trajectory; and explain the **unique** value you can bring to your new endeavor, you’re winning.
---

# FPT
## Autocall
### Account hierarchies
"Engineered **_secure API queries_** that resolved critical 9-month **_security management_** gaps, reducing cross-site **_data inconsistencies_** by 90% across 3-tier account hierarchies."
#### Security deficiencies identification
- Looking at our security timeline, we had a nine-month period from when issues were first flagged to when I completed the implementation, which was like 3 months of narrowing down the bug, 2 months of planning, and 4 months of implementation and migration. My analysis of our audit records reported that most of our vulnerabilities were about permission inconsistencies. More specifically: 
	- Our **_AWS CloudTrail_** security audits and database access logs revealed unauthorized access through ==_race conditions_== during permission checks.
- So here's how it all started: we took over this project from a team that had just been let go, right when they were in the middle of scaling it up for new business requirements. 
  Originally, they used a simple boolean flag (`is_root`) for permission management, which worked swimmingly for the old business where they had very few customers; but ever since they upgraded the business model, it led to _==scattered permission handling throughout the backend code==_, **not scaling** with their multi-tiered account structure, and the company was actually **_losing serious revenue_** because of all these _==permission-related security holes==_ that kept popping up.
	- Our business logic was updated to include ==_three subscription packages_==, which resulted in breaking changes to the database schema. 
	- For example, in the highest tier, root accounts (level 1) have full administrative privileges, whereas accounts at levels 2 through 4 are granted progressively fewer permissions.
#### Technical deep dives
##### MariaDB
- "_What specific **features of MariaDB** did you leverage in your redesign that addressed the security vulnerabilities?_"
	- Before the fix, we had ==_permission queries exposed to the application layer_== in the backend code with Eloquent ORM. We had slightly _**different checks scattered**_ across multiple controllers or services for this, which led to _**bugs in distributed logic**_ where fixing a bug one place might not get replicated correctly elsewhere, leading to diverging logic and **_inconsistent access control_** over time.
	- To fix it, I implemented those centralized, Single Source of Truth "_secure API queries_" which were essentially calls to ==_parameterized views_== (through **_stored procedures_**) to make sure that the backend code only calls the procedure by its name so that ==_the actual filtering logic stays secured in the database_==.
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
	- Race condition is not something that happen very often, however, there was a case where _==two administrators attempted to modify the same account's permissions concurrently==_ (e.g. moving a child account while changing its parent's permissions). We tracked and handled such incidents by:
		- Creating an event log table that recorded all permission change attempts.
		- **_Implementing row-level locks_** (using Laravel's `lockForUpdate()`) during permission change transactions, preventing partial update inconsistencies.
		- Using database constraints to enforce hierarchy rules by **_checking if an accounts' parent is valid_** (i.e. must exist via a foreign key) and an account cannot be its own parent. 
			- So even if two admins trigger changes simultaneously, _==any attempt to violate the hierarchy rules will be rejected by the database==_.
#### Team work & Impact
##### Measurables
 - We achieved a significant in **_enterprise tier upgrades_** due to confidence in our isolation guarantees between the tiers, as well as 90% reduction in permission-related support tickets.
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
"Owned the front-end implementation of **_responsive layouts_** for authentication screens of a **_legacy desktop application_**, ensuring **_rendering fidelity_** and better navigation on mobile and tablet devices."
#### Problem identification
- _"When you say you '**owned**' the implementation, explain exactly what **your responsibilities** were versus your team members. What specific code or components did you personally write versus oversee?"_
	- When I say I 'owned' the implementation, I did collaborate closely with our design team on wireframes and prototypes, but I was the primary engineer responsible for the end-to-end delivery of the responsive authentication UI. Specifically I wrote:
		- The media query breakpoints for mobile, tablet, and desktop views
		- The form element resizing logic for the authentication pages (login, register, password reset)
		- The integration between new TailwindCSS classes and existing Laravel Blade templates
- _"You mentioned a **legacy** desktop-only application - explain the specific **architectural constraints** you faced when implementing responsive design on a system not originally built for it."_
	- The most challenging constraint was the side-by-side layout pattern used throughout the app. 
		- Authentication screens had the form on the left and a prominent background image on the right at fixed widths. 
		- On narrow mobile screens, this forced the form to become very narrow, causing long input fields like 'Email' to look too cramped and unusable.
		- Additionally, each view relied on a mix of server-rendered Blade templates and jQuery for client-side interactivity, creating tight coupling between markup, styling, and behavior.
#### Biggest challenges
##### Technical
- _"How did you balance **business requirements** for mobile support against **technical limitations** of the legacy system? Give me an example of a **tradeoff** you had to make."_
	- The core business requirement was enabling mobile signups to _==increase conversion rates==_ without disrupting the existing desktop experience.
	- We had to find the path of least resistance to deliver the _most critical_ aspect of the mobile experience (usability of auth forms) without destabilizing the existing application or requiring a massive refactor. This meant focusing _only_ on the auth screens first, and accepting that we'd be working _within_ the legacy constraints (jQuery, Blade, Bootstrap)
	- I proposed using Tailwind classes _specifically_ for its layout utilities (Flexbox, Grid, spacing) on these new auth screens. The cost was the initial setup effort, some developer discussion/training (mitigated by its utility focus resembling Bootstrap conventions), and the need for careful management of CSS scope.
	- We agreed _not_ to refactor existing Bootstrap components immediately but to allow Tailwind for _new_ layout work. We were just so fed up with fighting those _CSS specificity problems_ and maintaining backward compatibility felt like keep piling more overrides onto that already bloated legacy stylesheet.
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

## Cloudflare
### Transformed manual testing process
"Accelerated release velocity by 70% through implementation of an automated quality assurance pipeline with Vitest for unit/integration testing and Playwright for E2E validation, eliminating critical bottlenecks of previously manual testing process in the development lifecycle."