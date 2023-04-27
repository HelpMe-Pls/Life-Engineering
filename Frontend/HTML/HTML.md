[[HTML/Meta]]
[[Document]]
[[Typography]]
[[Hyperlinks]]

- HTML is space sensitive:
```html
<!-- This will render 3 images with a `space` in between them -->
<img
  src="/cfj-mats/placekitten-100.jpg"
  width="100"
  alt="Cat photo"
/>
<img
  src="/cfj-mats/placekitten-100.jpg"
  width="100"
  alt="Cat photo"
/>
<img
  src="/cfj-mats/placekitten-100.jpg"
  width="100"
  alt="Cat photo"
/>

<!-- But this will have them packed -->
<img src="/cfj-mats/placekitten-100.jpg" width="100" alt="Cat photo" /><img src="/cfj-mats/placekitten-100.jpg" width="100" alt="Cat photo" /><img src="/cfj-mats/placekitten-100.jpg" width="100" alt="Cat photo" />
```