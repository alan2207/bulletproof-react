# 👨‍🦯 Accessibility

For accessibility concern we recommand to follow the Web Content Accessibility Guidelines (WCAG). WCAG documents explain how to make web content more accessible to people with disabilities.

For application and advanced pattern of components like dialog, tabs, combobox you have to follow a ARIA Authoring Practices Guide. But: No ARIA is better than Bad ARIA. Before using any ARIA, read this to understand why.

- [WCAG 2 Overview](https://www.w3.org/WAI/standards-guidelines/wcag/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)

## Checklist
This checklist is a set of recommendations for ways applications developed at Yale may best meet WCAG 2 requirements. It is not a substitute for the WCAG 2 specification, and it may not cover all use cases
- [WCAG 2 A and AA Checklist](https://usability.yale.edu/web-accessibility/articles/wcag2-checklist)

## Learning
- [Accessibility Fundamentals](https://www.w3.org/WAI/fundamentals/accessibility-intro/)
- [A11ycasts with Rob Dodson](https://www.youtube.com/playlist?list=PLNYkxOF6rcICWx0C9LVWWVqvHlYJyqw7g)
- [web.dev Accessible to all](https://web.dev/accessible/)

## Implementation

To simplify the implementation of WCAG and Aria rules, you can use a headless component library like Radix. This library allows you to implement your styles with the guarantee of well-implemented components.
Each description of components have a section `Accessibility` where you can know with which Aria pattern the component is related too.

- [Radix](https://www.radix-ui.com/)
- [Reakit](https://reakit.io/)
