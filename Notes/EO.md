# Friday, Nov 21st, 2025
- The problem that we're having with this data/properties duplicates is that we are putting data in Custom Props, but Reports read Default Props. That's why the report doesn't work.
- To make the reports work, we need to map our custom props/pipelines/stages/etc., to HubSpot’s default.
- Use the "Deals" records and its built-in props instead of tracking them with custom props in Contact.
- Once we cleaned up the mess, make sure that we don't create "imposter" props that HubSpot defaults already have.
- How do we create a dictionary/docs so that we don't make the same mistake again?
> [!warning] TODO
> - Cleanup Contact's Lifecycle Stage:
> 	- dru@tictag.io: Applicant → Lead
> 	- Customer → Member (many types?)
> 	- Elumni → ??
> - Kanban board 
> - Emails (cluster fuck that has forms but no submissions saved)
> - Automation
----
# Monday, Dec 8th, 2025
- All-in on this HubSpot thing until Dave finds more experts
- Dave's dog named `Nah`
- Notes: https://docs.google.com/document/d/1QxnWTzkjVTL9ee__1kfqVF7ApBA0caQkBPKhaSVQP-s/edit?pli=1&tab=t.44mngk70agp#heading=h.nd5u94qfzzza
## Events
- Build workflows for the first 2 stages: https://app-na2.hubspot.com/contacts/243769902/objects/0-3/views/all/board
### Sync these
- Wix event signups to HubSpot
- Survey submissions to HubSpot
## Funnels
- Some of the records not showed up in the `Prospect` funnel (i.e. they're like 30 sth but only a handful of them showed up): https://app-na2.hubspot.com/contacts/243769902/objects/0-3/views/all/board  --> The corresponding [report](https://app-na2.hubspot.com/reports-list/243769902/231590198/) doesn't work for the `Paid` stage (3 in the pipeline but none in the report)
- Rise || Podcast --> Prospect.
## Leads
- SQL: Rise || Podcast
- Opportunity == Deal
- Active Leads should not have Members
## Workflows
- https://docs.google.com/document/d/1QxnWTzkjVTL9ee__1kfqVF7ApBA0caQkBPKhaSVQP-s/edit?pli=1&tab=t.fl2wzaws6jjb
- Audit the existing workflows: 
	- Rename them to follow a better convention
	- Update the corresponding Lead statuses
- ==Rise funnel==: 2 workflows (if we already have their numbers --> create a task for Arlene to call them)
	- If we don't have their phone numbers: ask for their number in the email
	- If they don't response after 3 attempts -> update their Lead status to `Connected` or `Attempted...`
- What we ultimately want: Leads -> Prospect -> Member or not