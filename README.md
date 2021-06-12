# Bulletproof React 🛡️ ⚛️

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)

Simple, scalable and powerful architecture of React applications.

### Motivation

React is an amazing tool for building feature rich applications. It has a very diverse eco-system with hundreds of libraries for literally anything you might need. Which is great, but in the other hand it can be overwhelming to be forced to make so many choices.

It is also very flexible, you can write React applications in any way you like. That flexibility comes with a cost.

There is no pre-defined architecture developers can to follow which often leads to messy, uncosistent or over-complicated codebases.

This is an attempt to present the way how I prefer to structure React applications using the best tools in the eco-system and a good project structure.

The goal of this repo is to serve as a collection of good practices when developing React applications. It is supposed to showcase most of real-world problems in a practical way.

### The Application

The application is very simple. Users can create teams where other users can join, and they can run discussions on different topics between each other.

### Data model

The development of this project is driven by mocking API server and the data with msw. It contains the following models:

- User: this can be a team admin or a team user. It's been determined during user's registration. Admins can manage teams.
- Team: represents a team that has 1 admin and many users that can create discussions between each other.
- Discussion: represents discussions created by team members.
- Comment: represents all the messages in a discussion.

### Roadmap

- [x] Authentitication
- [ ] Authorization
- [x] Routing
- [x] Forms
- [x] API calls
- [ ] Client related state
- [x] Server related state
- [x] Project structure
- [x] TypeScript
- [ ] ESLint, Prettier, Husky setup
- [ ] Testing
- [x] API Mocking
- [ ] Appendix

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

## License

[MIT](https://choosealicense.com/licenses/mit/)
