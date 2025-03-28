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
"Resolved **_critical_** nine-month **_security management deficiencies_** through strategic _**database architecture redesign**_, driving reliable **_scalability_** and ensuring robust **_consistency_** across multi-tier _**account hierarchies**_."
#### Security deficiencies identification
- Looking at our security timeline, we had a nine-month period from when issues were first flagged to when I completed the implementation, which was like 3 months of narrowing down the bug, 2 months of planning, and 4 months of implementation and migration. My analysis of our audit records reported that most of our vulnerabilities were about permission inconsistencies. More specifically: 
	- Our **_AWS CloudTrail_** security audits and database access logs revealed child accounts occasionally accessing parent data through ==_race conditions_== during permission checks.
- The original architecture before the fix used a simple boolean flag (`is_root`) for permission management, which worked swimmingly for the old business where they had very few customers; but for our new business, it leads to a _==flat permission model not scaling with our multi-tiered account structure==_.
	- Our business logic was updated to include ==_three subscription packages_==, which resulted in breaking changes to our database schema. 
	- For example, in the highest tier, root accounts (level 1) have full administrative privileges, whereas accounts at levels 2 through 4 are granted progressively fewer permissions.
#### Technical deep dives
##### MariaDB
- "_What specific **features of MariaDB** did you leverage in your redesign that addressed the security vulnerabilities?_"
	- Before the fix, we had ==_raw queries exposed to the application layer_== where the permission handlings were exposed in the backend code.
	- To fix it, I implemented ==_parameterized views_== (through **_stored procedures_**) to make sure that the backend code only calls the procedure by its name so that ==_the actual filtering logic stays secured in the database_==.
	- So we enhanced speed by leveraging _**database indexing**_ (with `WHERE`/`JOIN` clauses) and improved security in case our backend code got compromised, the hackers still can’t access unauthorized data without the stored procedure.
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

CREATE INDEX idx_hierarchy ON accounts(hierarchy_path);
``` 
	- I also added constraints **_preventing circular references_** when ==_updating an account's parent_== by checking the new parent's `hierarchy_path` to make sure that it doesn't include the current account's ID.
		- It's like saying: "Before making someone your parent, check their family tree. If you already see your name in their tree, then you're trying to be your own grandparent—which is invalid." 
		- We actually didn't think this case would happen in production until we got notified on Sentry. I just can't imagine the consequences if we hadn't _==conformed to the ACID properties== for destructive operations_. So I just added the constraint for good measure so that we don't have to rely on the database's default lock wait timeout mechanism for blocking operations.  
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
- "_How did you handle permission inheritance across your account hierarchy? Show me the Laravel's feature you used for enforcing these cascading permissions._"
	- To propagate permission changes down the hierarchy tree, I implemented a ACID-compliant transaction combined with **_batch processing using Laravel's Events system_** and make use of the `hierarchy_path` defined in the database schema.  
##### Scalability
- "_What specific scalability issues did your redesign address, and how did you validate the improvement?_
	- We were able to reduce our customer permission query times from ~300ms to ~15ms at our peak load by implementing _**hierarchy-aware caching**_ layers using **Redis** and _**database read replicas**_ for hierarchy lookups. 
	- We validated the improvement by performing **_stress testing with JMeter_** and **_chaos testing_** by _==simulating random node failure==_, resulting in about 85% percentile response times remained under 100ms at 3x our projected load. Which is not too bad, but definitely could be better. 
- "_Under what conditions would your solution begin to show performance degradation, and what would be your mitigation strategy?_"
	- We haven't actually encountered a significant performance degradation, but I imagine if there's such a case, it'd be due to extremely wide hierarchies (we're talking thousands of siblings).
	- In that case, I'd identify and implement _**hierarchy partitioning**_ for wide trees (by adding a `root_id` column to the `account` table) as well as denormalizing frequently traversed paths with **_database trigger_** to automatically update the `hierarchy_path` column whenever an account is inserted.
##### Race condition
- "_Walk me through a specific race condition that could occur in your system and how your architecture prevents it._"
	- A critical race condition occurred when two administrators attempted to modify the same user's permissions simultaneously. We tracked and handled such incidents by:
		- Creating an event log table that recorded all permission change attempts
		- Implementing row-level locks (using Laravel's `lockForUpdate()`) during permission change transactions, preventing conflicting modifications.
		- Using database constraints to enforce hierarchy rules by checking if an accounts' parent is valid (i.e. must exist via a foreign key) and an account cannot be its own parent. 
			- So even if two admins trigger changes simultaneously, any attempt to violate the hierarchy rules will be rejected by the database.
#### Team work & Impact
##### Measurables
 - We achieved a significant in enterprise tier upgrades due to confidence in our isolation guarantees, as well as 95% reduction in permission-related support tickets
 - Our quality control also reported that permission bypass incidents are no longer a thing, and customers are very happy with their permission query performance.
##### Resolving conflicts
- f
- f
##### Persuasion
- f
- f
### Responsive design
"Transformed the **_desktop-first_** application by integrating _**responsive mobile layouts**_, ensuring a seamless and engaging experience across all devices."

## Cloudflare
### Transformed manual testing process
"Accelerated release velocity by 70% through implementation of an automated quality assurance pipeline with Vitest for unit/integration testing and Playwright for E2E validation, eliminating critical bottlenecks of previously manual testing process in the development lifecycle."