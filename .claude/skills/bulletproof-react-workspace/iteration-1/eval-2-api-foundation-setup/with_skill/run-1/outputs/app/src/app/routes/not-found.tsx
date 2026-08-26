import { Link } from 'react-router';

import { paths } from '@/config/paths';

const NotFoundRoute = () => {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>404 — Not Found</h1>
      <p>Sorry, that page does not exist.</p>
      <Link to={paths.home.getHref()}>Go home</Link>
    </main>
  );
};

export default NotFoundRoute;
