# 🧱 Components And Styling

## Components Best Practices

#### Colocate things as close as possible to where it's being used

Keep components, functions, styles, state, etc. as close as possible to the component where it's being used. This will not only make your codebase more readable and easier to understand but it will also improve your application performance since it will reduce redundant re-renders on state updates.

#### Avoid large components with nested rendering functions

Do not add multiple rendering functions inside your application, this gets out of control pretty quickly. What you should do instead is if there is a piece of UI that can be considered as a unit, is to extract it in a separate component.

```javascript
// this is very difficult to maintain as soon as the component starts growing
function Component() {
  function renderItems() {
    return <ul>...</ul>;
  }
  return <div>{renderItems()}</div>;
}

// extract it in a separate component
function Items() {
  return <ul>...</ul>;
}

function Component() {
  return (
    <div>
      <Items />
    </div>
  );
}
```

#### Stay consistent

Keep your code style consistent. e.g If you name your components by using pascal case, do it everywhere. More on this can be found [here](./style-guide.md)

#### Limit the number of props a component is accepting as input

If your component is accepting too many props you might consider splitting it into multiple components or use the composition technique via children or slots.

[Composition Example Code](../src/components/Elements/ConfirmationDialog/ConfirmationDialog.tsx)

#### Abstract shared components into a component library

For larger projects, it is a good idea to build abstractions around all the shared components. It makes the application more consistent and easier to maintain. Identify repetitions before creating the components to avoid wrong abstractions.

[Component Library Example Code](../src/components/Elements/Button/Button.tsx)

It is a good idea to wrap 3rd party components as well in order to adapt them to the application's needs. It might be easier to make the underlying changes in the future without affecting the application's functionality.

[3rd Party Component Example Code](../src/components/Elements/Link/Link.tsx)

## Component libraries

Every project requires some UI components such as modals, tabs, sidebars, menus, etc.

#### Kiwi: our own UI component library:

Kiwi is our **UI components package**, it is built on **Stitches** api.
It is a fully **typed** package with Typescript.
Accessibility standard in these components is brought by **Radix UI** primitives components.

1. A component must expose an API in accordance with the responsibilities its name suggests, making its purpose obvious.
   i.e: A `<Text />` component might expose props to modify its font weight or its alignment, not for defining his margin.
2. If a component exposes props related to CSS, it must allow only theme tokens if any.
   i.e: A `fontWeight` props on a `<Text />` component should expose theme tokens like `$bold` or `$light` . Raw values like `700` must be forbidden.
3. A low-level component must expose stitches’s `css` prop to be able to override underlaying css, or to pass contextual style.
4. A component should not cover every edge cases, modifying `letterSpacing` is not common and therefore should not be exposed on a `<Text />` component.

```javascript
<Text
  variant="title"
  fontWeight="$bold"
  css={{
    marginTop: 20, // contextual positioning
  }}
/>
```

As a general rule, a component should be clear on its usage and its intent, the same goes for an incorrect usage ; it should be obvious for the developer or the reviewer.

#### Radix UI: Headless component library:

This component library come with their components unstyled. If you have a specific design system to implement, it might be easier and better solution to go with headless components that come unstyled than to adapt a styled components library such as Material UI to your needs.

[Radix UI](https://www.radix-ui.com/)

## Styling Solutions

We are using [Stitches](https://stitches.dev/) as main styling api (for Kiwi and applications). Api and theme configuration is exported by `@yousign/theme` internal library.

You might still encounter the [styled-components](https://styled-components.com/) api because we used this api before; please consider it deprecated.

## Ladle

[Ladle](https://ladle.dev/) is a great tool for developing and testing components in isolation. Think of it as a catalogue of all the components your application is using. Very useful for developing and discoverability of components.

[Story Example Code](../src/components/Elements/Button/Button.stories.tsx)
