import { createMiddleware } from '@mswjs/http-middleware';
import cors from 'cors';
import express from 'express';
import logger from 'pino-http';

import { env } from './src/config/env';
import { handlers } from './src/testing/mocks/handlers';

const app = express();

app.use(
  cors({
    origin: env.APP_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(logger());
app.use(createMiddleware(...handlers));

app.listen(env.APP_MOCK_API_PORT, () => {
  console.log(
    `Mock API server started at http://localhost:${env.APP_MOCK_API_PORT}`,
  );
});
