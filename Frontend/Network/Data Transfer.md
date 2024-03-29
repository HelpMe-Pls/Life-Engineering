# Rate Limiting
- Rate limiting helps to control the flow of incoming requests, ensuring that our server isn't overwhelmed (as one of the common methods used to protect against DDOS attacks). It does this by limiting the number of requests a user can make in a specific window of time.
- `GET` requests often have lower rate limit (than `POST`) because genuine users typically make many more of these types of requests than `POST` requests.
- While rate limiting can help protect your server, it can also impact legitimate users if not implemented carefully. It’s important to set reasonable rate limits that prevent abuse without hindering normal usage. 
- An example of rate limiting in an `express` server:
```tsx
import rateLimit from 'express-rate-limit'

// When we're testing, we don't want rate limiting to get in our way. So, we'll
// increase our rate limit thresholds.
const limitMultiple = process.env.TESTING ? 10_000 : 1

const rateLimitDefault = {
	windowMs: 60 * 1000, // 1 minute
	limit: 1000 * limitMultiple, // Adjust the limit based on our environment
	standardHeaders: true, // Send standard headers with limit information
	legacyHeaders: false, // Don't bother sending legacy headers
}

// The most strict rate limit, great for routes like /signup
const strongestRateLimit = rateLimit({
	...rateLimitDefault,
	limit: 10 * limitMultiple,
})

// A stricter rate limit for general POST requests
const strongRateLimit = rateLimit({
	...rateLimitDefault,
	limit: 100 * limitMultiple,
})

// A general rate limit for our application
const generalRateLimit = rateLimit(rateLimitDefault)

app.use((req, res, next) => {
	const strongPaths = ['/signup']
	if (req.method !== 'GET' && req.method !== 'HEAD') {
		if (strongPaths.some(p => req.path.includes(p))) {
			return strongestRateLimit(req, res, next)
		}
		return strongRateLimit(req, res, next)
	}

	return generalRateLimit(req, res, next)
})
```