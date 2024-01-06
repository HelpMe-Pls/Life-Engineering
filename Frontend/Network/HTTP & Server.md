# CORS
- Cross Origin Resource Sharing is a system that allows web servers to specify which ***other* domains** (outside the domain from which the resource originated) are allowed to access their resources, enabling safe communication between different origins while protecting against security risks. For example:
	- Suppose a page on `www.social-network.example` attempts to access a user’s data in `online-personal-calendar.example`. ***If the user’s browser implements CORS***, the following request header would be sent: `Origin: www.social-network.example`.
	   If `online-personal-calendar.example` allows the request, it sends an `Access-Control-Allow-Origin: www.social-network.example` header in its response. 
	   If `online-personal-calendar.example` does not allow the cross-origin request, the browser will deliver an error to `social-network.example` page instead of the `online-personal-calendar.example` response.
# HTTP vs HTTPS
- The main difference between them is the added layer of security in `https`, which protects the data being transferred from being intercepted, and only the intended recipient can decrypt and read the data. Consider this example:
	**HTTP**: When the user submits the form on a website using HTTP, the data is sent as plain text. If an attacker is able to intercept the data (for example, by snooping on an unsecured Wi-Fi network), they can read the username and password directly. Here’s what the intercepted data might look like:
```
POST /login HTTP/1.1
Host: www.example.com
Content-Type: application/x-www-form-urlencoded
Content-Length: 27

username=random&password=pass // which means anyone who intercepts this data can read it.
```
  - **HTTPS**: the data is encrypted before it’s sent. If an attacker intercepts the data, they will only see the encrypted data, not the original username and password. Here’s what the intercepted data might look like:
```
POST /login HTTP/1.1
Host: www.example.com
Content-Type: application/x-www-form-urlencoded
Content-Length: 50

9sdfj923k4j2349sdfj9234k2j34k2j3k4j23k4j23k4j2k34  // Encrypted and can only be decrypted and read by the intended recipient
```