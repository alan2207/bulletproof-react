import { Link } from 'react-router';

import { paths } from '@/config/paths';

export const NotFoundRoute = () => (
  <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
    <h1>404</h1>
    <p>We could not find that page.</p>
    <Link to={paths.home.getHref()}>Go back home</Link>
  </main>
);
