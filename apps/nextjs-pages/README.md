# Next.js Pages Application

## Get Started

Prerequisites:

- Node 20+
- Yarn 1.22+

To set up the app execute the following commands.

```bash
git clone https://github.com/alan2207/bulletproof-react.git
cd bulletproof-react
cd apps/nextjs-pages
cp .env.example .env
yarn install
```

#### `yarn run-mock-server`

Make sure to start the mock server before running the app.
The mock server runs on [http://localhost:8080/api](http://localhost:8080/api).

##### `yarn dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

Since the `pages` folder isn't very flexible and doesn't allow file collocation, we are keeping the `app` folder which is our application layer where we compose all the features, and then we just re-export Next.js page specific files (the pages and `getServerSideProps`) from the `pages` folder so Next.js can pick them up and serve as pages.
