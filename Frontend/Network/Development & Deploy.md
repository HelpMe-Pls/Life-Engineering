# SEO
Helping search engines like Google to properly categorize your content is called Search Engine Optimization (SEO). Good SEO helps Google leverage a site's ranking and reliability.

Lots of what applies to search engines also applies to other tools and social media platforms as well. So it's a good idea to spend some time thinking about your website's sources of traffic and learning how to optimize your website's presentation on those platforms.

## HTML Tags
### `<title/>` and `<head/>`
- The `<title>` tag appears in the `<head>` and is typically what is displayed in the browser tab. It's also what is displayed in search engine results.
### `<meta/>` 
- The `<meta>` tag (also a child of `<head/>`) is typically used to provide information about the page to search engines. The `name` attribute is used to specify the type of metadata, and the `content` attribute is used to provide the actual metadata:
```HTML
<!-- - You'll want around 5 keywords for each page -->
<meta name="keywords" content="HTML, CSS, JavaScript">
```

- The `description` metadata is used to provide a short description of the page and is often used in search engine results as well as social media preview cards:
```tsx
<meta name="description" content="This is my page" />
```

- The `viewport` metadata is used to configure the viewport of a mobile browser:
```tsx
<!-- tell the browser to set the width of the viewport to the width of the device, and to set the initial zoom level to 1. This is a common configuration for mobile browsers. -->
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

- The `charset` metadata is used to specify the character encoding of the page:
```tsx
<meta charset="utf-8" />
```

## Optimizing SEO
#### Regular Updates
- The more recently your site has been updated, the higher it will rank in the results.
- You should aim to update your site’s content about once per week or more.
#### Backlinks
- A backlink is a link that goes to your page from another site. If other sites are linking to your page, it shows Google that you probably have helpful, accurate information.
- The more reliable and successful the site that gives you a backlink is, the more that backlink will help your SEO.
#### Views
- It is what it is. 
- Use the Open Graph tags to improve the site's appearance on social media, so you can get more views:
```HTML
<meta property="og:url"               content="http://www.nytimes.com/arts/international/when-great-minds.html" />

<meta property="og:type"               content="article" />
<meta property="og:title"              content="When Great Minds Don’t Think Alike" />
<meta property="og:description"        content="How much does culture influence creative thinking?" />
<meta property="og:image"              content="http://static01.nyt.com/images/2015/02/19/arts/international/19iht-btnumbers19A/19iht-btnumbers19A-facebookJumbo-v2.jpg" />
```

#### Bounce Rate
- It is the percentage of people who come to your site but only visit one page before leaving. 
- Google sees a high bounce rate as an indication of an unattractive website.
- To reduce bounce rate: include similar articles at the end of each blog or page, suggesting other pages the user may find interesting.
#### Optimize for Your Local Area
- If you’re a local business rather than online only, you want to optimize your site for your local area.
- Make sure your business name, address, and phone number are prominently displayed and consistent throughout your site.
- It’s important to make sure Google Maps shows your correct contact information.
---
# Deploy
- To make it quick and easy, just opt for Vercel, Fly.io or Netlify. If you have enough resources, use [[DevOps#Docker |Docker|]] with a proper CI/CD pipeline.
