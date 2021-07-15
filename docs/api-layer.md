# API Layer

### Use a single instance of the API client

No matter if your application is consuming RESTful or GraphQL API, have a single instance of the API client that's been pre-configured and reused throughout the application. E.g have a single API client ([axios](https://github.com/axios/axios) / [graphql-request](https://github.com/prisma-labs/graphql-request) / [apollo-client](https://www.apollographql.com/docs/react/)) instance with pre-defined configuration.

[API Client Example Code](../src/lib/axios.ts)

### Define and export request declarations

Instead of declaring API requests on the go, have them defined and exported separately. If it's a restful API a declaration would be a fetcher function. On the other hand, requests for GraphQL APIs are declared via queries and mutations that could be consumed by data fetching libraries such as [react-query](https://react-query.tanstack.com/), [apollo-client](https://www.apollographql.com/docs/react/), [urql](https://formidable.com/open-source/urql/), etc. This makes it easier to track which endpoints are defined and available in the application You can also type the responses and infer it further for a good type safety of the data.

[API Request Declaration Example Code](../src/features/discussions/api/index.ts)
