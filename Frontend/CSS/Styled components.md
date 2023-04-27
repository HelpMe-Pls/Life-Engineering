- It is what it is: the styling of a component is isolated within its boundaries so that we can avoid styling collision.
- It is recommended to use in tandem with an unopinionated styling component lib (like Reach UI) for maintainability.
- The styling are generated an run time if you're using this "styled component" approach (i.e. the style of a component is not computed if that component isn't mounted)
- Inline styles are quick and easy to add, but they carry two significant disadvantages:
	1.  They make it harder to understand what's going on by "splitting up" where the CSS definitions live.
	2.  They aren't compatible with media queries, pseudo-classes, and any CSS that isn't straight-up property/value.
- Use the `as` prop to render a component as a HTML tag or other component. In this example we render a component as a `<button/>` or as a `<Link/>`:
```jsx
import { Link } from 'react-router-dom';

function Button({ href, children }) {
	return (
		<Wrapper to={href} as={href ? Link : 'button'}>
			{children}
		</Wrapper>
	);
}

const Wrapper = styled.button`
/* styles */
`;

// In this case render the Button component as a <Link/>
render(<Button href="/">Hello</Button>);
```
---
## Common patterns
### Wrapper component
- To keep components truly reusable, it is highly recommended to isolate the specific styles for a component, and then add more context-related styles for it by wrapping (or extending) it with an other component:
```jsx
// Instead of this:
// In SecondaryStory.js
const SecondaryStory = ({ id, title, image, location, abstract }) => {
	return (
		<Wrapper>
			<Image alt={image.alt} src={image.src} />
			<Heading>{title}</Heading>
			<Abstract>{abstract}</Abstract>
		</Wrapper>
	)
}
const Wrapper = styled.article`
	display: grid;
	gap: 4px 16px;
	grid-template-columns: 120px 1fr;

	// Context-specific styles:
		&:not(:last-child) {
		margin-bottom: 16px;
		border-bottom: 1px solid gray;
		padding-bottom: 16px;
	}
`
// In MainStoryGrid.js
const MainStoryGrid = () => {
	return (
		// Other jsx...
		<SecondaryStorySection>
			{SECONDARY_STORIES.map((story, _index) => (
				<SecondaryStory key={story.id}{...story} />
			))}
		</SecondaryStorySection>
		// Other jsx...
}

//---------------------------------------------
// Do this:
// In SecondaryStory.js
const SecondaryStory = ({ id, title, image, location, abstract }) => {
	return (
		<Wrapper>
			<Image alt={image.alt} src={image.src} />
			<Heading>{title}</Heading>
			<Abstract>{abstract}</Abstract>
		</Wrapper>
	)
}
const Wrapper = styled.article`
	display: grid;
	gap: 4px 16px;
	grid-template-columns: 120px 1fr;

	// Get rid of context-dependent styles
`

// In MainStoryGrid.js
const MainStoryGrid = () => {
	return (
		// Other jsx...
		<SecondaryStorySection>
			{SECONDARY_STORIES.map((story, _index) => (
				// Wrapper component:
				<StoryWrapper key={story.id}>
					<SecondaryStory {...story} />
				</StoryWrapper>
			))}
		</SecondaryStorySection>
		// Other jsx...
}
const StoryWrapper = styled.div`
	&:not(:last-child) {
		margin-bottom: 16px;
		border-bottom: 1px solid gray;
		padding-bottom: 16px;
	}
`
```
#### Interpolation
##### Inversion of control nesting
- This technique to dynamically apply contextual styles, e.g. we want to apply a style *only when* it's within another component, or in a specific context.
	- **Pro**: It saves the developer (us) from having to remember to use a specific variant prop in a specific situation.
	- **Con**: Having access to _all possible_ contextual styles in 1 place can be overwhelming. It also bloats our JavaScript bundle (i.e. it has to download all of the markup and code for the contextual styles). Try _not_ to use this approach for one-off variants (i.e. only use it for components tend to be small, and/or really widely-used)
```js
const Wrapper = styled.a`
	position: relative;
	display: block;
	font-size: 1.125rem;
	text-transform: uppercase;
	text-decoration: none;
	color: var(--color-gray-900);
	font-weight: ${WEIGHTS.medium};

	/* Text slide-up effect */
	overflow: hidden;
	&:first-of-type {
		color: var(--color-secondary);
	}
`

// Applying the animation to the <Text/> when hovering on <Wrapper/>:
const Text = styled.span`
	display: block;
	transform: translateY(var(--translate-from));
	transition: transform 500ms;
	@media (prefers-reduced-motion: no-preference) {
		/* Kinda like `.Wrapper:hover Text` if it's in vanilla CSS */
		${Wrapper}:hover & {
			transition: transform 250ms;
			transform: translateY(var(--translate-to));
		}
	}
`
```
##### Dynamic values from props
```jsx
const Button = ({ color, onClick, children }) => {
  return (
    <Wrapper onClick={onClick} color={color}>
      {children}
    </Wrapper>
  );
}

const Wrapper = styled.button`
  color: ${props => props.color};
  padding: 16px 24px;
`;
```


### Breadcrumbs
- They show the hierarchy of the content's structure, and let you quickly hop up to the parent or grandparent category page. Use HTML `nav` tag to contain breadcrumbs.
  E.g. this code sample will return `Home / Living Room / Couches / Sectionals
```jsx
const Breadcrumbs = ({ children }) => {
	return (
		<nav aria-label="Breadcrumb">
			<BreadcrumbList>{children}</BreadcrumbList>
		</nav>
	);
};

const Crumb = ({ href, isCurrentPage, children }) => {
	return (
		<CrumbWrapper>
			<CrumbLink
				href={href}
				aria-current={isCurrentPage ? 'page' : undefined}
             >			
				{children}
			</CrumbLink>
		</CrumbWrapper>
	);
};

const BreadcrumbList = styled.ol`
	padding: 0;
	margin: 0;
	list-style-type: none;
`;

const CrumbWrapper = styled.li`
	display: inline;
	--spacing: 12px;
	
	&:not(:first-of-type) {
		margin-left: var(--spacing);
		&::before {
			content: '/';
			opacity: 0.25;
			margin-right: var(--spacing);

/* Note: The ideal version of this solution
* would instead use a transformed border,
* to avoid using a real character.
* For example, something like this:
*
* content: '';
* display: inline-block;
* transform: rotate(15deg);
* border-right: 1px solid;
* margin-right: var(--spacing);
* height: 0.8em;
*/
		}
	}
`;

const CrumbLink = styled.a`
	color: inherit;
	text-decoration: none;
	&:hover {
		text-decoration: revert; /*to "undo" the `text-decoration: none` above*/
	}
`;

render(
	<Breadcrumbs>
		<Crumb href="/">Home</Crumb>
		<Crumb href="/living">Living Room</Crumb>
		<Crumb href="/living/couch">Couches</Crumb>
		<Crumb
			href="/living/couch/sectional"
			isCurrentPage={true}
        >
			Sectionals
		</Crumb>
	</Breadcrumbs>
);
```


### Buttons
- Use component [composition](https://codesandbox.io/s/jwc-button-exercise-solution-4dbpw?file=/src/Button.js) pattern to have a common reusable component (i.e. `ButtonBase` in this example).

### Responsive
- With styled-components, all of the declarations for an element are in the *same* spot:
```jsx
// All Title styles
const Title = styled.h2`
  font-size: 2rem;

  @media (min-width: 550px) {
    font-size: 2.5rem;
  }

  @media (min-width: 1100px) {
    font-size: 3rem;
  }
`;
```
- Clone & extend a component to display (show/hide) it at different breakpoints:
```jsx
const Header = () => {
	return (
		<header>
			<SuperHeader>
				<Row>
					<ActionGroup>
						<button>
							<Search size={24} />
						</button>
						<button>
							<Menu size={24} />
						</button>
					</ActionGroup>
				</Row>
			</SuperHeader>
			<MainHeader>
				<DesktopActionGroup>
					<button>
						<Search size={24} />
					</button>
					<button>
						<Menu size={24} />
					</button>
				</DesktopActionGroup>
				<Logo />
			</MainHeader>
		</header>
	)
}

const ActionGroup = styled.div`
	display: flex;
	gap: 24px;
`
// This is it:
const DesktopActionGroup = styled(ActionGroup)`
	display: none;

	@media ${QUERIES.desktopAndUp} {
		display: flex;
		margin-top: 16px;
	}
`
```

## Animation
- The `keyframes` function is called using tagged template literals, just like the `styled` helper functions. To apply our animation, we interpolate it within the styles for a specific component:
```jsx
import styled, { keyframes } from 'styled-components';

function App() {
  return <FloatingCircle />;
}

const float = keyframes`
  from {
    transform: translateY(10px);
  }
  to {
    transform: translateY(-10px);
  }
`;

const FloatingCircle = styled.div`
  animation: ${float} 1000ms infinite alternate ease-in-out;
`;
```

