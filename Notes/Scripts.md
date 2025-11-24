# Negotiate
## AI Accounts
- It seems like the company has paid AI accounts that could double my speed. 
- And it looks like we're getting deep into the automation thing with n8n.
- So, can you add my work email to those accounts so I can automate the heavy lifting?
# Suggestions
## TF
- I can already imagine what a high-level view of this email sync that we could implement in TF.
- So it goes something like this: Our employee, the salesperson, goes into their TF settings and there's a button to "Connect their Gmail/Outlook/Lark Email" or whatever, let's take Gmail as an example.
- Once they clicked on that btn, they are sent to a standard Google/Microsoft login page where they enter their own username and password. 
- They approve the request from TF to "read, compose, and send emails on their behalf."
- And from that moment on, our APIs will subscribe to their new mail events or periodically poll their inbox
- When it finds a correspondence with an email address that matches a contact in the CRM, it logs a copy of that email in the contact's activity timeline.
- So that's where this HubSpot-like automation takes place
- Our backend will automatically create a record of all communication without requiring the user to BCC a special address or manually log their interactions.
- So the entire pipeline should be intuitive and accessible on the frontend with little to no manual intervention from the user. 
- That's pretty much it.