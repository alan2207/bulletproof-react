import { Link } from '@/components/ui/link';
import { paths } from '@/config/paths';

const NotFoundRoute = () => (
  <main style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
    <h1>404</h1>
    <p>We could not find the page you were looking for.</p>
    <Link to={paths.home.getHref()}>Go home</Link>
  </main>
);

export default NotFoundRoute;
