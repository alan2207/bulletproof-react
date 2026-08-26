import { Link } from 'react-router';

import { paths } from '@/config/paths';

export const NotFoundRoute = () => {
  return (
    <div className="stack">
      <h1>404 - Not found</h1>
      <p className="muted">That page does not exist.</p>
      <Link className="link" to={paths.home.getHref()}>
        Go home
      </Link>
    </div>
  );
};
