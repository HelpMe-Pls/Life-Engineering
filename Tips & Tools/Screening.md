- This stage typically last for 1-2 rounds. 
	1. With the recruiter: briefly introduce your current role, your stack and what are your responsibilities. Maybe some mundane technical questions. 
	2. With the HR/Engineering Manager: same questions, but deep dive and ask more follow-up questions based on your answers.
	3. People sleep on this, but you can make a difference by presenting a positive first impression. 
---
# Technical
- If you can explain these concepts in Layman's language, you've got one foot in the door already.
## Concepts
- **HTTPS**: it's a protocol for transferring web resources (like text, HTML pages, images).
	- The **S** stands for the "secure" part which encrypts the connection between your browser and the site, keeping your information private.
- **HTTP Methods**: these are like verbs for the web, telling the server what action to take for a request.
	- Mention idempotency & `POST` requests
- **DNS**: translates easy-to-remember website names (like `google.com`) into the numerical addresses (IP addresses) computers use to find each other.
- **APIs**: they're contracts that allow different software programs to talk to each other and exchange information or request services in a structured way.
- **REST**: is a popular set of rules or style guide for building APIs. It makes them predictable and easier for different programs to communicate effectively.
- **Cookies**: help sites remember you or your preferences between visits, like keeping you logged in.
	- They're initially set from the server and sent to the browser, then they're exchanged between the server and the browser to keep track of users' states.
- **Session**: it's the server's way of remembering your ongoing visit after you log in. 
	- It often uses a cookie containing a unique ID as a temporary "passport" to recognize you on subsequent requests.
- **JWT**: it's a compact, secure digital "ticket" that a server gives your browser after you log in.
	- It contains verifiable information about you, so you don't have to log in again for every action.
- **CORS**: browsers normally only let scripts on `siteA.com` talk to `siteA.com`; anything else is blocked. **CORS** adds headers so that browsers can safely relax their strict same-site rules.
- **XSS**: it's an attack where malicious code is sneakily injected into a website then the code runs in the browsers of unsuspecting visitors, potentially stealing their information.
- **CSRF**: it's an attack that tricks a logged-in user into unknowingly sending a command to a website they trust.
	- This malicious "command" is delivered when the user clicks on the attacker's bait resource (e.g. an image, a link to another website,...) which has different origin that you visit, and then when the user navigates back to their authenticated site, their upcoming requests are now riddled with these "commands".
- **React's state vs props**: `props` are like settings passed _down_ to a UI building block (component) from its parent, which the block _itself can't change_. 
	- `state` is the block's own _internal_ memory or data that it _can_ manage and change over time.
- **Core Web Vitals**: those are the key measurements Google uses to judge a webpage's user experience. 
	- They focus on loading speed, how quickly you can interact with the page, and whether the layout jumps around unexpectedly.
- **localStorage vs sessionStorage**: both are ways for websites to store small amounts of data in your browser.
	- `localStorage` keeps the data even after you close the browser, while `sessionStorage` clears it when the browser tab is closed.
- **SQL vs NoSQL**: they're two major types of databases. 
	- SQL databases organize data in structured tables with predefined columns (like Excel), while NoSQL databases are more flexible and can store data in various ways (like documents or key-value pairs).
	- SQL is better for secured and complex queries, whereas NoSQL offers better scalability and flexibility.
- **Concurrency vs Parallelism**: concurrency is like a chef juggling multiple tasks by quickly switching between them on one stove. 
	- Parallelism is like having multiple chefs (or stoves) working on different tasks at the exact same time.
- **Authentication vs Authorization**: Authentication is verifying _who you are_ (like showing your ID card). 
	- Authorization is determining _what_ you are allowed to do once identified (like having the key to open a specific door).
# Spar interviews
- These should be include in your small - casual talks. Ask and answer these question:
## 1. Most memorable stages
- Most honorable moments/achievements in their career
- How long are they willing to stay/have been in the company, and if they'll leave, what will likely be the reason
## 2. What you've learnt from that
- Pick up from their answers and chain them along
- Look for similarities and going deeper into that
## 3. How it's like looking forward, what are you hoping for
- What makes you happy/content in terms of your career development ?
- What are the key determinators for success / a profound life ?
- Questions/advice/tips for me ?

