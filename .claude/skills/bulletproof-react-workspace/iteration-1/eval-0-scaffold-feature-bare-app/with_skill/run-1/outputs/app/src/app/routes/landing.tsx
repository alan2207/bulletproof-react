import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button/button';
import { paths } from '@/config/paths';

const LandingRoute = () => {
  const navigate = useNavigate();

  return (
    <div className="screen-center">
      <h1>My App</h1>
      <p className="muted">A place to keep track of what needs doing.</p>
      <Button type="button" onClick={() => navigate(paths.app.tasks.getHref())}>
        Go to tasks
      </Button>
    </div>
  );
};

export default LandingRoute;
