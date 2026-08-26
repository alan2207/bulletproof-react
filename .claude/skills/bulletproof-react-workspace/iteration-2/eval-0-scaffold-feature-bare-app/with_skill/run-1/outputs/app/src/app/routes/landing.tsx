import { Link } from '@/components/ui/link';
import { paths } from '@/config/paths';

const LandingRoute = () => (
  <main style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
    <h1>My App</h1>
    <p style={{ color: 'var(--color-text-muted)' }}>
      A bulletproof-react starter.
    </p>
    <Link to={paths.app.tasks.getHref()}>Go to tasks</Link>
  </main>
);

export default LandingRoute;
