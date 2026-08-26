import { Link } from 'react-router';

import { paths } from '@/config/paths';

export const NotFound = () => (
  <div>
    <h2>Page not found</h2>
    <Link to={paths.home.getHref()}>Go back home</Link>
  </div>
);
