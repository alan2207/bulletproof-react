# 🧪 Accessibility

For accessibility concern we recommand to follow the Web Content Accessibility Guidelines (WCAG). WCAG documents explain how to make web content more accessible to people with disabilities.

For application and advanced pattern of components like dialog, tabs, combobox you have to follow a ARIA Authoring Practices Guide.

- [WCAG 2 Overview](https://www.w3.org/WAI/standards-guidelines/wcag/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)

## WCAG levels
WCAG is split into three levels of compliance – Level A, Level AA and Level AAA. These three levels provide an organized framework for tracking your accessibility efforts. As the levels increase, they demonstrate an increasing standard of accessibility.

- **Level A**: This level indicates basic conformance to WCAG. At this level, your website will not provide accessibility for all situations.
- **Level AA**: The most commonly required level of accessibility compliance in accessibility legislation and the recommended level to target. Conformance with Level AA means that your website will be usable to most users and understandable in most situations.
- **Level AAA**: The highest level of accessibility conformance. This is the most difficult level to attain and should be addressed only once Level AA has been achieved.

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
