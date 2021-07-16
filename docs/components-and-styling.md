# Components And Styling

## Components Best Practices

#### Collocate things as close as possible to where it's being used

Keep components, functions, styles, state, etc. as close as possible to the component where it's being used.

#### Avoid nested rendering functions

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

#### Stay consistent

Keep your code style consistent. e.g If you name your components by using pascal case, do it everywhere. If you create components as arrow functions, do it everywhere.

#### Limit number of props a component is accepting as input

If your component accepts a lot of props you might consider splitting it into multiple components or use composition via children or slots.

[Composition Example Code](../src/components/Elements/ConfirmationDialog/ConfirmationDialog.tsx)

#### Abstract shared components into a component library

For larger projects, it is good idea to build abstractions around all the shared components. It makes the application more consistent and easier to maintain. Identify repetitions before creating the components to avoid wrong abstractions.

[Component Library Example Code](../src/components/Elements/Button/Button.tsx)

It is a good idea to wrap 3rd party components as well in order to adapt them to the application's needs. It might be easier to make the underlying changes in the future without affecting the application's functionality.

[3rd Party Component Example Code](../src/components/Elements/Link/Link.tsx)

## Component libraries

Every project requires some UI components such as modals, tabs, sidebars, menus, etc. Instead of building those from scratch, you might want to use some of the existing, battle-tested component libraries.

#### Fully featured component libraries:

- [Chakra UI](https://chakra-ui.com/) - great library with probably the best developer experience, allows very fast prototyping with decent design defaults. Plenty of components that are very flexible with accessibility already configured out of the box.

- [AntD](https://ant.design/) - another great component library that has a lot of different components. Best suitable for creating admin dashboards. However, it might be a bit difficult to change the styles in order to adapt it to a custom design.

- [Material UI](https://material-ui.com/) - the most popular component library for React. Has a lot of different components. It might be more suitable for building admin dashboards as it would not be easy to change the components to look like something else than Material Design.

#### Headless component libraries:

If you have a specific design system from your designer, it might be easier and better solution to go with headless components that come unstyled than to adapt a fully featured library components such as Material UI to your needs. Some of the good options are:

- [Reakit](https://reakit.io/)
- [Headless UI](https://headlessui.dev/)
- [Radix UI](https://www.radix-ui.com/)
- [react-aria](https://react-spectrum.adobe.com/react-aria/)

## Styling libraries

There are multiple ways to style a react application. Some of the good options are:

- [tailwind](https://tailwindcss.com/)
- [styled-components](https://styled-components.com/)
- [emotion](https://emotion.sh/docs/introduction)
- [stiches](https://stitches.dev/)
- [vanilla-extract](https://github.com/seek-oss/vanilla-extract)
- [CSS modules](https://github.com/css-modules/css-modules)
- [linaria](https://github.com/callstack/linaria)

## Good combinations

- [Chakra UI](https://chakra-ui.com/) + [emotion](https://emotion.sh/docs/introduction) - The best choice for most applications
- [Headless UI](https://headlessui.dev/) + [tailwind](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/) + [stiches](https://stitches.dev/)

## Storybook

[Storybook](https://storybook.js.org/) is a great tool for developing and testing components in isolation. Think of it as a catalogue of all the components your application is using. Very useful especially for larger projects because it helps exploring components.

[Storybook Story Example Code](../src/components/Elements/Button/Button.stories.tsx)
