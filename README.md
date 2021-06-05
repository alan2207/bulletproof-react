# Bulletproof React

A real-world team based discussion application built with React.

The application is used for having discussions between team members.

The goal if this application is to showcase the following real-world problems of a React application:

- [ ] Authentitication
- [ ] Authorization
- [ ] Routing
- [ ] Forms
- [ ] API calls
- [ ] Client related state
- [ ] Server related state
- [ ] Project structure
- [ ] TypeScript
- [ ] a11y
- [ ] i18n
- [ ] ESLint, Prettier, Husky setup
- [ ] Testing
- [ ] API Mocking

## Data model

The development of this project is driven by mocking API server and the data with msw. It contains the following models:

- User: this can be a team admin or a team user. It's been determined during user's registration. Admins can manage teams.
- Team: represents a team that has 1 admin and many users that can create discussions between each other.
- Discussion: represents discussions created by team members. During the creation, the creator of the discussion adds all the participants.
- Comment: represents all the messages in a discussion.

## Tech Stack

- TypeScript
- React with CRA setup
- react-query
- react-router v6
- react-hook-form
- tailwindcss
- headless-ui
- jest
- react-testing-library

### Available Scripts

In the project directory, you can run:

##### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

##### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

##### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

##### `yarn eject`
