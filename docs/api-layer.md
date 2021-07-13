# API Layer

#### Use a single instance of the API client

No matter if your application is consuming RESTful or GraphQL API, have a single instance of the API client that's been preconfigured and reused throughout the application. e.g have a single `axios`/`graphql-request`/`apollo-client` instance preconfigured with `baseUrl`, `headers`, etc.

[Example Code](../src/lib/axios.ts)

#### Define and export request declarations

Instead of declaring API requests on the go, have it defined and exported separately. For an example, check the `api` folder in any feature. If it's a restful API the declaration would be a fetcher function. On the other hands, requests for GraphQL APIs are declared via queries and mutations that could be consumed by data fetching libraries such as `react-query`, `apollo-client`, `urql`, etc. This makes it easier to track which endpoints are defined and available in the application You can also type the responses and infer it further for a good type safety of the data.

[Example Code](../src/features/discussions/api/index.ts)
