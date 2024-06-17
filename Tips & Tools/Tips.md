[[Tips & Tools/Meta]]
[[Interview prep]]
[[Best practices]]
[[code-review.png |Code Review]]
[[Writing]]

---
# JS
- Generalized FizzBuzz using Map:
```js
var multipliers = [
  [3, "Fizz"],
  [5, "Buzz"]
]

for (let i = 1; i <= 100; i++) {
  let output = "";

  multipliers.forEach(function(item) {
     if (i % item[0] === 0) {
       output += item[1];
     }
  }); 

  console.log(output || i);
}
```
## Currying vs Piping 
- **Currying** is a technique where a function with multiple arguments is transformed into *a sequence of functions* (i.e. function returning functions), each taking a single argument. It's used to enable partial function application and create specialized functions. Here's an example of currying:
```javascript
const add = x => y => x + y;
const add5 = add(5);
console.log(add5(3));  // Output: 8
```

- On the other hand, **piping** is a technique where multiple functions are composed together to form a pipeline of operations. The output of one function becomes the input for the next function in the pipeline. It enhances code readability and promotes modular data transformation pipelines. Here's an example of piping:
```javascript
const add5 = x => x + 5;
const multiply2 = x => x * 2;
const subtract10 = x => x - 10;

const pipe = (...fns) => (value) => fns.reduce((acc, fn) => fn(acc), value);

const calculate = pipe(
  add5,
  multiply2,
  subtract10
);

console.log(calculate(3));  // Executes all those function sequentially, giving the output: 8 -> 16 -> 6
```
## Graceful error handling
- Creating an empty `class` to enhance the readability of your code:
```js
class InputError extends Error {}

function promptDirection(question) {
  let result = prompt(question);
  if (result.toLowerCase() == "left") return "L";
  if (result.toLowerCase() == "right") return "R";
  throw new InputError("Invalid direction: " + result);
}

for (;;) {
  try {
    let dir = promptDirection("Where?");
    console.log("You chose ", dir);
    break;
  } catch (e) {
    if (e instanceof InputError) {
      console.log("Not a valid direction. Try again.");
    } else {
      throw e;  // Suppose you called `prompDirection("Where?")` in the `try` block, a `ReferenceError` will be caught here
    }
  }
}
```
# JSX
- Check for empty object: 
```jsx
// Render this component only when `detailCampaign` object has data:
{Object.keys(detailCampaign).length > 0 && (
        <CardLayout
          title={<FormattedMessage id="pages.campaign-management.campaign.info" />}
          icon={<InfoCircleFilled style={{ color: '#526eff' }} />}
        >
          <CampaignInfo detailCampaign={detailCampaign} phoneCall={phoneCall} />
        </CardLayout>
)}
```

- Render a number of skeleton components based on a prop `count`:
```jsx
<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
    {Array.from({ length: category.count }).map((_, i) => (
          <SkeletonCard key={i} />
     ))}
</div>
```

- If your component has styling transformation, better isolate that animation part to an API and keep your main component SoC from that animation:
```tsx
//==========>> <Drawer/> helpers <<==========
const openedMixin = (theme: Theme): CSSObject => ({
	width: drawerWidth,
	overflowX: 'hidden',
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
});
const closedMixin = (theme: Theme): CSSObject => ({
	width: `calc(${theme.spacing(7)} + 1px)`,
	overflowX: 'hidden',
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
	({ theme, open }) => ({
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: 'nowrap',
		boxSizing: 'border-box',
		...(open && {
			...openedMixin(theme),
			'& .MuiDrawer-paper': openedMixin(theme),
		}),
		...(!open && {
			...closedMixin(theme),
			'& .MuiDrawer-paper': closedMixin(theme),
		}),
	}),
);

//=================|| Main Component ||===================
export default function CustomDrawer() {
	const [open, setOpen] = useState(false);
	const toggleDrawer = () => {
		setOpen(!open)
	}
	return (
			<Drawer variant="permanent" open={open}>
				{/*Do some*/}
			</Drawer>
	);
}

```

# CSS
- Centering trick with 1 side having content [in flex layout](https://github.com/css-for-js/sole-and-ankle/commit/ad2863febfccdcc58d87e5ad5210b2ebfcd2faf8) by using  *`flex: 1`  elements* to squeeze your desired center content.
- To disable the flash of the "tap rectangle" for a button on mobile devices:
```css
.pushable {
  -webkit-tap-highlight-color: transparent;
}
```

- Increase an element's hit box (useful on mobile devices) by using an empty `::after` absolute element:
```css
button {
    position: relative;
    height: 32px;
}
  
button::after {
    --tap-increment: -8px; /* extends outwards in all directions */
    content: '';
    position: absolute;
    top: var(--tap-increment);
    left: var(--tap-increment);
    right: var(--tap-increment);
    bottom: var(--tap-increment);
}
```

- Use `pointer-events` to control the pointer's behavior. Useful when you need to disable click on an element. We can also ***undo*** `pointer-events` in below-positioned elements:
```html
<style>
  .toast-wrapper {
    pointer-events: none;
  }
  
  .toast {
    pointer-events: auto;
  }
</style>

<!-- The `.toast-wrapper` will ignore clicks, so that we can click the ``.random` button behind it. But its child, `.toast` will happily accept pointer interactions. -->
<button class="random">
  Random button
</button>
<div class="toast-wrapper">
  <div class="toast">
    Your tweet was sent.
  </div>
</div>
```