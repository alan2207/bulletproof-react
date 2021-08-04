# Forms

Forms are a very important component of almost every React application. They allow users to provide input data to applications.

Depending on the application needs, they might be pretty complex with many different fields which require validation.

Forms in React can be [controlled](https://reactjs.org/docs/forms.html#controlled-components) and [uncontrolled](https://reactjs.org/docs/uncontrolled-components.html).

Although it is possible to build any form using only React, there are pretty good solutions out there that help with handling forms such as:

- [React Hook Form](https://react-hook-form.com/)
- [Formik](https://formik.org/)
- [React Final Form](https://github.com/final-form/react-final-form)

Create abstracted `Form` component and all the input field components that wrap the library functionality and are adapted to the application needs. You can reuse it then throughout the application.

[Form Example Code](../src/components/Form/Form.tsx)

[Input Field Example Code](../src/components/Form/InputField.tsx)

You can also integrate validation libraries with the mentioned solutions to validate inputs on the client. Some good options are:

- [zod](https://github.com/colinhacks/zod)
- [yup](https://github.com/jquense/yup)

[Validation Example Code](../src/features/auth/components/RegisterForm.tsx)
