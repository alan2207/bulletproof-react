import React from 'react';
import ReactDOM from 'react-dom/client';

import { StartupError } from '@/components/errors/startup-error';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    'Could not find an element with id "root" to mount the app into. Check index.html.',
  );
}

const root = ReactDOM.createRoot(rootElement);

/**
 * `App` is imported dynamically, and nothing above this line touches the app's
 * modules.
 *
 * The environment is validated at import time in `@/config/env`, which the API
 * client pulls in. With a static import that validation would throw while the
 * module graph is still being evaluated — before React exists — and the user
 * would get a blank page with the reason buried in the console. Loading the app
 * inside a promise makes that failure catchable, so a missing variable renders
 * as a screen that names it.
 */
import('@/app')
  .then(({ App }) => {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  })
  .catch((error: unknown) => {
    console.error(error);
    root.render(<StartupError error={error} />);
  });
