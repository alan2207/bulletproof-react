# Components And Styling

### Abstract shared components

For larger projects, it is good idea to build abstractions around the shared components. It makes the application more consistent and easier to maintain. It is a good idea identify repetitions before creating the components in order to avoid wrong abstractions.

It is a good idea to wrap 3rd party components as well in order to adapt them to the applications needs. It might be easier to make the underlying changes in the future without affecting the application's functionality.

### Collocation

Keep components, functions, styles etc. as close as possible to the component where it's being used.

### Do not nest rendering functions

```javascript
// this is very difficult to maintain as soon as the component starts growing
function Component() {
  function renderItems() {
    return <ul>...</ul>;
  }
  return <div>{renderItems()}</div>;
}

// extract it in a separate component
import { Items } from 'components/Items';

function Component() {
  return (
    <div>
      <Items />
    </div>
  );
}
```

### Limit number of props a component is accepting as input

If your component accepts more than 4-5 props, it is a good idea to accept a single prop instead which is an object containing all of the config properties.

### Component libraries

Every project requires some of the most popular UI components such as modals, tabs, sidebars, menus etc. Instead of building those from scratch, you might want to use some of the existing, battle tested component libraries.

#### Fully featured component libraries:

- [Chakra UI](https://chakra-ui.com/) - great library with probably the best developer experience, allows very fast prototyping with decent design defaults. Plenty of components which are very flexible with great a11y already configured out of the box.

- [AntD](https://ant.design/) - another great component library which has a lot of different components. Best suitable for creating admin dashboards. However it might be a bit difficult to change the styles in order to adapt it to a custom design.

- [Material UI](https://material-ui.com/) - the most popular component library for react. Has a lot of different components. Although Material Design has it's purpose, it might be more suitable for building admin dashboards as it would not be easy to change the components to look like something else.

#### Headless component libraries:

If you have a specific design system from your designer, it might be easier and better solution to go with headless components than to adapt a fully featured library components such as e.g MaterialUI to your needs. Some good options are:

- [Reakit](https://reakit.io/)
- [HeadlessUI](https://headlessui.dev/)
- [Radix UI](https://www.radix-ui.com/)
- [react-aria](https://react-spectrum.adobe.com/react-aria/)

### Styling libraries

There are multiple ways to style a react application. Some of the good options are:

- [vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [SASS](https://sass-lang.com/)
- [tailwind](https://tailwindcss.com/)
- [CSS modules](https://github.com/css-modules/css-modules)
- [styled-components](https://styled-components.com/)
- [emotion](https://emotion.sh/docs/introduction)
- [linaria](https://github.com/callstack/linaria)
- [stiches](https://stitches.dev/)
- [vanilla-extract](https://github.com/seek-oss/vanilla-extract)

### Good combinations

- ChakraUI + emotion
- RadixUI + stitches
- HeadlessUI + Tailwind

### Storybook

Storybook is a great tool for developing and testing components in isolation. It also serves as a catalogue of components your application is using. Very useful especially for larger projects and onboarding new developers because it helps with discoverability of the components.
