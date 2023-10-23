# CORS
- Cross Origin Resource Sharing is a system that allows web servers to specify which ***other* domains** (outside the domain from which the resource originated) are allowed to access their resources, enabling safe communication between different origins while protecting against security risks. For example:
	- Suppose a page on `www.social-network.example` attempts to access a user’s data in `online-personal-calendar.example`. If the user’s browser implements CORS, the following request header would be sent: `Origin: www.social-network.example`.
	   If `online-personal-calendar.example` allows the request, it sends an `Access-Control-Allow-Origin: www.social-network.example` header in its response. 
	   If `online-personal-calendar.example` does not allow the cross-origin request, the browser will deliver an error to `social-network.example` page instead of the `online-personal-calendar.example` response.
