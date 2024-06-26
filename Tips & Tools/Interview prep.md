[[Screening]]
[[Behavioral]]
[[Technical]]
[[Progressive Overload]]

---
# Before the interview
- Pay attention to the yearly reports from Adecco, First Alliance, Navigos, Vietnamwork, Talentnet, NodeFlair,... to see where the market is heading, and base your skills on that.
- Include keywords from job descriptions into your resume. Analyze the job description and determine how important each skill and experience is, then optimize the *frequency* of the keyword according to its importance/relevance.
- The interview is all about selling how well you communicate. Be sure that you can answer 2-3 levels deep questions clarifying each and every of your bullet points in your CV. For example, the interviewer may ask 3 questions to clarify this one: "*With an everlasting curiosity and a relentless drive to adapt, I am experienced in modern web development with a strong foundation in web technologies*.":
	- Give me an experience in your work that highlights your trait of "everlasting curiosity and a relentless drive to adapt".
	- How does that have anything to do with a strong foundation in web technologies?
	- Some random follow-up question based on your answer to those 2 questions above.
- The most important takeaway is that “***every interview is a learning process***”. If you made it to the screening rounds, consider that a win already. Don't beat yourself up that you didn't get the offer that you're hoping for. Maybe that's a bless in disguise that you just haven't realized yet. *Take it like a man. Don't be a little bitch. Stop feeling sorry for yourself. Dust off and move on. Life is so much more than that*. Write down what you learned from that one what could be better for the next ones.
- It is essential to realize that even if you are well-suited to a position, there is always the possibility that a more experienced candidate is also being interviewed. So, rather than being idle and having high hopes for some particular interview, just keep practicing and review your knowledge to prepare for upcoming ones. 
- Pride in appearance can be equated with pride in a role.
- [Watch this](https://www.youtube.com/watch?v=IInaPtwdNCQ)
- If you're unsure whether or not the interview will be technical, ask your recruiting coordinator what position your interviewer holds (or what the interview might cover). An engineer will usually perform a technical interview.
- You typically do one or two virtual interviews before being brought on-site.
- [Do your research](https://www.experis.com/en/insights/articles/2021/05/25/20-tips-for-great-job-interviews), figure out what problems their business is trying to solve. Ask for an example of their product, and it'd be great if you can offer *specific* improvements and/or alternate approaches, better yet, mention the trade offs of your suggestions as well (get [refactoring UI](https://www.refactoringui.com/?ref=biblidev.fr))
- Be _extremely_ familiar with the following concepts:
	- CSS: Specificity, Box model, Layout, Positioning
	- JS: `this` keyword, Prototypes, closures, Async-style code, Promises, Timers (`setTimeout`, `setInterval`)
	- JS design patterns: Observer pattern, Module pattern
	- HTML: [Event delegation](https://www.frontendinterviewhandbook.com/javascript-questions#explain-event-delegation) (useful in almost every interview), [DOM traversal](https://javascript.info/dom-navigation), [DOM Manipulation](https://www.javascripttutorial.net/javascript-dom), [form controls](https://javascript.info/forms-controls)
	- Vanilla JS, or jQuery at the very least. Not all interviews allow you to use React as they want to see mastery of the fundamentals.
	- [[Networking |Basic]] networking knowledge.
- Many ***startups*** might post job listings, but for the hottest startups, often *the best way in is through a personal referral*. This reference doesn't necessarily need to be a close friend or a coworker. Often just by reaching out and expressing your interest, you can get someone to pick up your resume to see if you're a good fit.
- Regardless of the outcome, always ask yourself, did I present myself to the best of my ability? If you did, then there's no reason to keep lingering on it. If you didn't, ask yourself: "What are the things that I learned from this interview that can help me to get better in subsequent interviews?"
- Aim for the companies that on the bottom of your list in the first month of applying (i.e. treat them as foreplay for the companies that you *really* want to work at)
> [!Info]- Good to know
> - It is recommended to carefully pick your next company once you already have 1+ YoE. It's not just about the benefits that the company offers, you should also have a good sense that the company fits you.
> - Make an effort to update your CV and scout for jobs every 6 months and apply selectively, just to see where you're at in the market and to take an opportunity if its tradeoff is good enough.
> - You should typically stay with a company for 2-3 years before really **hunt** for a new one. It looks better on your CV, and you get to go **all the way** through the life cycle of a project and learn everything that evolved around it.
> - It is almost a red flag if you change your job too frequently, so consider your time with a company in the "year" unit. 
# During the interview
- Listen until the question is finished, and take a breath. Ask clarifying questions if you didn't really get what their intention is about.
> Initiate the speech from the diaphragm to add confidence in your voice.
## Screening
- Typically lasts *under an hour*. [[Screening|Checkout]] what kind of questions you should be expecting.
- Usually starts with self introduction. First impression is important. Cultivate that.
- Do not spend too long ($\leqslant$ 3mins ) on your self introduction as you will have less time left to code.
- Go in this order: 
	1. Current Role, current work responsibility
	2. College: my background is in computer science. I did my undergrad at HCMUE and...
	3. Post College: Internship, isolation
	4. Current Role: after college, I wanted to get some exposure to larger corporations so I joined FPT as a developer. It was a great experience. I learned a ton about...
	5. Outside of Work: a bit about hobbies, adventurous,...
	6. Wrap Up: I'm looking now for something new, and your company came up. I've always loved the connection with the user, and I really want to be a part of a great team.
## Technical
- Coding questions tend to be vague and underspecified on purpose to allow the interviewer to gauge the candidate's attention to detail and carefulness. Ask at least 2-3 clarifying questions.
> Make sure you understand **exactly** what they are asking. Do not ignore any piece of information given.
- Your initial approach should be discussing with the interviewer and verify that your interpretation of the problem is on the right track with [pseudo code](https://www.interviewkickstart.com/learn/how-to-write-pseudocode) (the simplest form can be just a text-based line-by-line description that details the requirements). 
- You should be vocal about every solution that you could think of (don't go too much into implementation details just yet), then *narrow down and explain why you're elected one approach over another* (including analysis of the time and space complexity, and you'd prefer choosing the one with *lower time complexity*).
- Discuss the tradeoffs of each approach with your interviewer as if the interviewer was your coworker and you all are collaborating on a problem.
- If the problem appears too hard to even come up with pseudo code, walk through the brute force solution and look for areas to narrow down the goal, then optimize it.
- Even if you can't come up with the code or DSA, don't fret. Always strive to demonstrate your reasoning and the follow the [[Technical#Best practices|best practices]] that you know of. *When possible, always use code that has been shown to be effective. Don't try to reinvent the wheel.*
> Solve the problem **conceptually** first > Use the appropriate tools/DSA > Optimize the solution.

## Behavioral
- Typically, behavioral interview [questions](https://www.techinterviewhandbook.org/behavioral-interview-questions) can be split into several types:
	- Getting to know your career preferences, ambitions and plans
	- Discuss [[Progressive Overload#Behavioral - What to tell |the details]] of experiences or projects written in your resume
	- "Tell me about a time where you" type of questions where you describe how you demonstrated certain traits or responded to a situation
- Display pride in previous work-related experiences you've had. And have some questions [[You as an interviewer|prepared]]. Take this time to learn something about what is being sought.
- Prepare your stories to [[Behavioral|showcase fit]] to the company's culture / core values.
- Refrain from exaggerating your abilities or being negative towards yourself.
> Do whatever it takes to not sound desperate, even if you are.
- Rather than saying "I failed at that task", you could say that task was challenging but provided me with some ideas for future areas of research to explore.
- Additionally, avoid excessive slang cursing or inappropriate humor.

## Benefits & negotiation
- Startups usually offer a bit higher for fresh graduate ($120,000 - $130,000) to make up for the lack of liquidity of the equity grant (not yet real cash).
- Your goal should be to have as many offers overlapping at the same time as possible. This will maximize your window for negotiating:
	- "I've received another offer from `OTHER CORP` that's very compelling on salary, but I really love the mission of `YOUR COMPANY` and think that it would overall be a better fit for me."
- Your first answer to the salary question should be: "Based on what we've been through, and the compatibility between my abilities and your requirement for this position, what's the highest offer that you can give ?"
- If you notice that they're giving out an ambiguous answer to that (i.e. no specific number or range has been mentioned), well, that means it's time for you to reveal your desired number (*not* range), based on these guidelines:
	- If you honestly think you absolutely nailed that interview ($\geqslant$ 96,69%), give out the *highest* number in the market for that position.
	- Same case as above, but you have *no interest* in working for them, add an extra `$2000` to that number.
	- If the interview was like, meh...(50%-80%), try to negotiate with the aim of increasing 30%-50% from your current salary.
	- If the interview was ***not*** on your side, but you still really want to work there (maybe you spotted someone great to learn from), try to negotiate with the aim of maximum 30% increase from your current salary.
- You should **not** reveal to companies what you're currently making.
> I'm sure we'll be able to find a package that we're both happy with, because I really would love to be a part of the team.
- It's better to have a *specific* "Ask": It's more effective to ask for an additional  `$6996`  in salary than to just ask for "more" or give the range.
- Check out other benefits from the compensation package and company culture which may make up for a low/undesirable income.  
- Annual Bonus: Annual bonuses at tech companies can range from anywhere from 3% to 30%. Your recruiter might reveal the average annual bonus, but if not, check with friends at the company.
- [Equity/stock](https://github.com/jlevy/og-equity-compensation). Read [more](https://gist.github.com/yossorion/4965df74fd6da6cdc280ec57e83a202d).
- Consider the "happiness" factor: 
	- **Healthy oncall as a priority**: Is the oncall load manageable?
	- The Product: are they crafting art of just getting shit done ?
	- Manager and teammates: it's best to directly meet them and ask about their impression on the job/company
	- Company Culture: how decisions get made, to the social atmosphere, to how the company is organized. Ask your future teammates how they would describe the culture.
	- Work hours: work life balance, is OT well compensated or is the company expecting you to be ready for the job at all time ? 
- Choose companies/teams that resonate with what you value. The aim of an interview is to find a good match between the company and the candidate.
- Despite whatever is happening in the negotiation, give the company the impression that 1) you still like the company, and that 2) you're still excited to work there, even if the numbers or the money or the timing is not working out.
> Try to notice something good about them at a personal level, then give them an honest praise for that. Don't expect anything from them, just give a simple, heartfelt praise.

# After the interview
- Interviewers assess you *relative to other candidates* on that same question by the same interviewer. It's a *relative* comparison.
- If you haven't heard back from a company within ***3 - 5*** business days after your interview, check in (politely) with your recruiter.
- Establishing a friendly, engaging conversation with your interviewers is your ticket to future job offers.
- If you're still waiting to hear back from other companies, you can ask for an extension. Usually these deadlines are one to four weeks out
- Rejected, ask for feedback like: "Is there anything you'd suggest I work on for next time?". If you comeback to give it another shot, ask: "What are some of the most impressive achievements of your team/company for the last `x` months (since our last meeting) ?"