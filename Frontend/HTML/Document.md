- Check [this](https://javascript.info/document) out.
- The global binding `document` gives us access to HTML elements. We can change or create anything on the page using it:
	- `<html>` == `document.documentElement
	- `<head>` == `document.head`
	- `<body>` == `document.body`
- Code that interacts heavily with the DOM tends to get long, repetitive, and ugly. That's the whole reason why there are so many JS frameworks out there. They all try to offer the most intuitive abstractions to manipulate the DOM.
- Every node has a `parentNode` property that points to the node it is part of, if any. Likewise, every element-node has a `childNodes` property that points to an array-like object holding its children.
	- The `firstChild` and `lastChild` properties point to the first and last child elements or have the value `null` for nodes without children. 
	- Similarly, `previousSibling` and `nextSibling` point to adjacent nodes, which are nodes with the same parent that appear immediately before or after the node itself. For a first child, `previousSibling` will be null, and for a last child, `nextSibling` will be null.
- There’s also the `children` property, which is like `childNodes` but contains only  children node with type of element (`Node.ELEMENT_NODE`), not other types of child nodes. This can be useful when you aren’t interested in text-nodes (`Node.TEXT_NODE`).
- Example: the following function scans a document for text nodes containing a given string and returns `true` when it has found one:
```js
function talksAbout(node, string) {
  if (node.nodeType == Node.ELEMENT_NODE) {
    for (let child of node.childNodes) {
      if (talksAbout(child, string)) {
        return true;
      }
    }
    return false;
  } else if (node.nodeType == Node.TEXT_NODE) {
    return node.nodeValue.indexOf(string) > -1;
  }
}

console.log(talksAbout(document.body, "book"));
```
---
# Traversing the DOM
- If we want to find a specific node in the document, reaching it by starting at `document.body` and following a fixed path of properties is a bad idea. Doing so bakes assumptions into our program about the precise structure of the document—a structure you might want to change later.
- All element nodes have a `getElementsByTagName` method, which collects all elements with the given tag name that are ***descendants*** (direct or indirect children) *of that node* and returns them as an array-like object. For example, to “get the first link in the document”:
```js
let link = document.body.getElementsByTagName("a")[0];
console.log(link.href);
```
- To find a specific _single_ node, you can give it an `id` attribute and use `document.getElementById` instead:
```html
<p>My ostrich Gertrude:</p>
<p>
	<img id="gertrude" src="img/ostrich.png">
</p>

<script>
  let ostrich = document.getElementById("gertrude");
  console.log(ostrich.src);
</script>
```
- Similarly, `getElementsByClassName` retrieves all elements that have the given string in their `class` attribute.
## Modifying the DOM
- The shape of the document tree can be modified by changing parent-child relationships.
- Nodes have a `remove` method to remove them from their current *parent* node. 
- To add a child node to an element node, we can use `appendChild`, which puts it at the *end* of the list of children:
```html
<!doctype html>

<meta charset="utf8">

<h1>Mountains</h1>

<div id="mountains"></div>

<script>
  const MOUNTAINS = [
    {name: "Kilimanjaro", height: 5895, place: "Tanzania"},
    {name: "Everest", height: 8848, place: "Nepal"},
    {name: "Mount Fuji", height: 3776, place: "Japan"},
    {name: "Vaalserberg", height: 323, place: "Netherlands"},
    {name: "Denali", height: 6168, place: "United States"},
    {name: "Popocatepetl", height: 5465, place: "Mexico"},
    {name: "Mont Blanc", height: 4808, place: "Italy/France"}
  ];

  function buildTable(data) {
    let table = document.createElement("table");
  
    let fields = Object.keys(data[0]);
    let headRow = document.createElement("tr");
    fields.forEach(function(field) {
      let headCell = document.createElement("th");
      headCell.appendChild(document.createTextNode(field));
      headRow.appendChild(headCell);
    });
    table.appendChild(headRow);

    data.forEach(function(object) {
      let row = document.createElement("tr");
      fields.forEach(function(field) {
        let cell = document.createElement("td");
        
        // create a cell for each value
        cell.appendChild(document.createTextNode(object[field]));
        if (typeof object[field] == "number") {
          cell.style.textAlign = "right";
        }

		// place the created cell on its row
        row.appendChild(cell);  
      });
      table.appendChild(row); // create a row for each object
    });

    return table;
  }

  document.querySelector("#mountains")
		  .appendChild(buildTable(MOUNTAINS));
</script>
```
- The `insertBefore` method inserts the node given as the first argument before the node given as the second argument. For example, this script changes the position of the last `<p>`:
```html
<p>One</p>
<p>Two</p>
<p>Three</p>

<script>
  let paragraphs = document.body.getElementsByTagName("p");
  document.body.insertBefore(paragraphs[2], paragraphs[0]);
</script>

<!-- Output: -->
Three

One

Two
```
- The `replaceChild` method is used to replace a child node with another one. It takes as arguments two nodes: a *new* node and the node to be replaced (removed). 
	- The replaced node must be a child of the element the method is called on. Note that both `replaceChild` and `insertBefore` expect the _new_ node as their first argument.
### Creating nodes
- To create element nodes, you can use the `document.createElement` method. This method takes a tag name and returns a new empty node of the given type:
```html
<blockquote id="quote">
  No book can ever be finished. While working on it we learn
  just enough to find it immature the moment we turn away
  from it.
</blockquote>

<script>
  function elt(type, ...children) {
    let node = document.createElement(type);
    for (let child of children) {
      if (typeof child != "string") node.appendChild(child);
      else node.appendChild(document.createTextNode(child));
    }
    return node;
  }

  document.getElementById("quote").appendChild(
    elt("footer", "—",
        elt("strong", "Karl Popper"),
        ", preface to the second edition of ",
        elt("em", "The Open Society and Its Enemies"),
        ", 1950"));
</script>
```
The output would be:
No book can ever be finished. While working on it we learn just enough to find it immature the moment we turn away from it.
—**Karl Popper**, preface to the second edition of _The Open Society and Its Enemies_, 1950

- Given a string, `createTextNode` gives us a text node that we can insert into the document to make it show up on the screen:
```html
<p>The 
  <img src="img/cat.png" alt="Cat"> in the
  <img src="img/hat.png" alt="Hat">.
</p>

<p><button onclick="replaceImages()">Replace</button></p>

<script>
  function replaceImages() {
    let images = document.body.getElementsByTagName("img");
// Because `replaceChild` removes then inserts, we have to start the loop from the end; otherwise, it only runs once
    for (let i=images.length-1; i>=0; --i) {
      let image = images[i];
      if (image.alt) {
        let text = document.createTextNode(image.alt);
        image.parentNode.replaceChild(text, image);
      }
    }
  }
</script>

<!-- The output after hitting the "Replace" button: -->
The Cat in the Hat.
```
### Setting attributes
> HTML allows you to set **any** attribute you want on nodes. This can be useful because it allows you to store extra information in a document.
- To read or change _**custom** attributes_, which aren’t available as regular object properties, you have to use the `getAttribute` and `setAttribute` methods:
```html
<!-- It is recommended to prefix the names of such made-up attributes with `data-` to ensure they do not conflict with any other attributes. -->
<p data-random-attr="secret">The launch code is 00000000.</p>
<p data-random-attr="unclassified">I have two feet.</p>

<script>
  let paras = document.body.getElementsByTagName("p");
  for (let para of Array.from(paras)) {
    if (para.getAttribute("data-random-attr") == "secret") {
      para.remove();
    }
    if (para.getAttribute("data-random-attr") == "unclassified") {
      para.textContent = "no more secrets";
    }
  }
</script>
```
- For the `class` attribute, since it's conflicted with a reserved keyword in JS, you'll have to access it with `className` instead.
### Layout
- The `offsetWidth` and `offsetHeight` properties give you the space the element takes up in _pixels_. 
- Similarly, `clientWidth` and `clientHeight` give you the size of the space _inside_ the element, ignoring border width.
- The `getBoundingClientRect` method returns an object with `top`, `bottom`, `left`, and `right` properties, indicating the pixel positions of the sides of the element relative to the top left of the screen.
	- If you want pixel positions relative to the whole document, you must add the current scroll position, which you can find in the `pageXOffset` and `pageYOffset` bindings.
- Layout properties requires computations to happen and will consequently run very slowly. Consider breaking your computations into chunks for better performance:
```html
<p><span id="one"></span></p>
<p><span id="two"></span></p>

<script>
  function time(name, action) {
    let start = Date.now(); // Current time in milliseconds
    action();
    console.log(name, "took", Date.now() - start, "ms");
  }
// The loop runs many times, appending one character at a time, resulting in multiple, incremental changes to the DOM:
  time("naive", () => {
    let target = document.getElementById("one");
    while (target.offsetWidth < 2000) {
      target.appendChild(document.createTextNode("X"));
    }
  });
  // → naive took 16 ms

// Appends a small initial string, calculates the required number of characters, and sets the final string in one go, drastically reducing the number of DOM operations:
  time("clever", function() {
    let target = document.getElementById("two");
    target.appendChild(document.createTextNode("XXXXX"));
    let total = Math.ceil(2000 / (target.offsetWidth / 5));
    target.firstChild.nodeValue = "X".repeat(total);
  });
  // → clever took 1 ms
</script>
```
### Styling
- The `style` property holds an object that has properties for all possible CSS style properties. For hyphenated properties, you can access them either by camel case or brackets notation:
```html
<p id="para" style="color: purple">
  Nice text
</p>

<script>
  let para = document.getElementById("para");
  para.style.backgroundColor = "magenta"; 
  para.style['background-color'] = "red";
</script>
```
- Use the `querySelector` method if you want a specific single element. It will return only the first matching element or `null` when no element matches.
- The `querySelectorAll` method takes a selector string and returns a `NodeList` containing all the elements that it matches:
```html
<p>And if you go chasing
	<span class="animal">rabbits</span>
</p>
<p>And you know you're going to fall</p>
<p>Tell 'em a 
	<span class="character">hookah smoking
		<span class="animal">caterpillar</span>
	</span>
</p>
<p>Has given you the call</p>

<script>
  function count(selector) {
    return document.querySelectorAll(selector).length;
  }
  console.log(count("p"));           // All <p> elements
  // → 4
  console.log(count(".animal"));     // Class animal
  // → 2
  console.log(count("p .animal"));   // Animal inside of <p>
  // → 2
  console.log(count("p > .animal")); // Direct child of <p>
  // → 1
</script>
```
- Note that the `getElementsByTagName` returns a mutable result (meaning it updates accordingly to changes in the DOM), while `querySelectorAll` *doesn't*:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live vs Static NodeLists</title>
</head>
<body>
    <div id="container">
        <p>Paragraph 1</p>
        <p>Paragraph 2</p>
    </div>
    <button id="add">Add Paragraph</button>

    <script>
        // Select paragraphs using getElementsByTagName (live NodeList)
        let liveList = document.getElementsByTagName("p");
        // Output: 2
        
        console.log("Initial liveList length:", liveList.length); 
        
        // Select paragraphs using querySelectorAll (static NodeList)
        let staticList = document.querySelectorAll("p");
	    
	    // Output: 2
        console.log("Initial staticList length:", staticList.length); 

        // Add a new paragraph when the button is clicked
        document.getElementById("add").addEventListener("click", () => {
            let newPara = document.createElement("p");
            newPara.textContent = "New Paragraph";
            document.getElementById("container").appendChild(newPara);
            console.log("After adding new paragraph:");
            
            // Output: 3 (live list updates)
            console.log("liveList length:", liveList.length); 
            
            // Output: 2 (static list does NOT update)
            console.log("staticList length:", staticList.length); 
        });
    </script>
</body>
</html>
```
