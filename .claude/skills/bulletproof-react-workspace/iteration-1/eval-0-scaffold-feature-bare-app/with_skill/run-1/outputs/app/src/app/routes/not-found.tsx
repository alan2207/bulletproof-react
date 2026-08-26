import { Link } from 'react-router';

import { paths } from '@/config/paths';

const NotFoundRoute = () => {
  return (
    <div className="screen-center">
      <h1>404</h1>
      <p className="muted">That page does not exist.</p>
      <Link to={paths.home.getHref()}>Go home</Link>
    </div>
  );
};

export default NotFoundRoute;
