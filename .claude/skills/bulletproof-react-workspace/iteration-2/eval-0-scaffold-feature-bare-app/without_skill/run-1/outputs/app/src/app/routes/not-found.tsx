import { Link } from 'react-router';

import { paths } from '@/config/paths';

export const NotFoundRoute = () => (
  <section>
    <h1>404 &mdash; Page not found</h1>
    <p>
      <Link to={paths.home.getHref()}>Go back home</Link>
    </p>
  </section>
);
