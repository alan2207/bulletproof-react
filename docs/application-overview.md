# 💻 Application Overview

The sample application has been bootstrapped using `Vite` and its `react-ts` template. It allows us to create applications quickly without dealing with a complex tooling setup such as bundling, transpiling etc. Another reason for using Vite is simplicity, as it doesn't force us to use the meta-framework specific things, and allows us to focus on React.

Other popular ways you can bootstrap the application are:

- [Next.js](https://nextjs.org/)
- [Remix](https://remix.run/)

The application is relatively simple. Users can create teams where other users can join, and they start discussions on different topics between each other.

A team is created during the registration if the user didn't choose to join an existing team and the user becomes the admin of it.

[Demo](https://bulletproof-react-app.netlify.app)

## Data model

The application contains the following models:

- User - can have one of these roles:

  - `ADMIN` can:
    - create/edit/delete discussions
    - create/delete all comments
    - delete users
    - edit own profile
  - `USER` - can:
    - edit own profile
    - create/delete own comments

- Team: represents a team that has 1 admin and many users that can participate in discussions between each other.

- Discussion: represents discussions created by team members.

- Comment: represents all the messages in a discussion.

## Get Started

Prerequisites:

- Node 20+
- Yarn 1.22+

To set up the app execute the following commands.

```bash
git clone https://github.com/alan2207/bulletproof-react.git
cd bulletproof-react
cd apps/react-vite
cp .env.example .env
yarn install
```

##### `yarn dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

##### `yarn build`

Builds the app for production to the `dist` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

See the section about [deployment](https://vitejs.dev/guide/static-deploy) for more information.
