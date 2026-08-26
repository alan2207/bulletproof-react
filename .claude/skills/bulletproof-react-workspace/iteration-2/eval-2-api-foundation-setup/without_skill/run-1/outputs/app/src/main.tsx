import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const mountPoint = document.getElementById('root');

if (!mountPoint) {
  throw new Error('Root element `#root` was not found in index.html.');
}

const rootElement: HTMLElement = mountPoint;

/**
 * Last-resort renderer for failures that happen before React can mount -
 * chiefly env validation in `@/config/env`, which throws at import time.
 * Without this the page would just stay blank and the reason would be buried in
 * the console.
 */
const renderStartupError = (error: unknown) => {
  console.error(error);

  const container = document.createElement('div');
  container.setAttribute('role', 'alert');
  container.style.cssText =
    'max-width:44rem;margin:3rem auto;padding:1.5rem;border:1px solid #fecaca;border-radius:0.5rem;background:#fef2f2;color:#7f1d1d;font-family:ui-monospace,SFMono-Regular,Menlo,monospace';

  const heading = document.createElement('h1');
  heading.textContent = 'The app failed to start';
  heading.style.cssText = 'margin:0 0 0.75rem;font-size:1.125rem';

  const details = document.createElement('pre');
  // `textContent`, not `innerHTML` - the message may echo back config values.
  details.textContent = error instanceof Error ? error.message : String(error);
  details.style.cssText = 'margin:0;white-space:pre-wrap;font-size:0.8125rem;line-height:1.5';

  container.append(heading, details);
  rootElement.replaceChildren(container);
};

/**
 * The app modules are imported dynamically so a throw during their evaluation
 * (again: env validation) is catchable. A static import would fail the whole
 * module graph before a single line here ran.
 */
const bootstrap = async () => {
  try {
    // Validate configuration first and explicitly, so a missing variable is
    // reported at startup no matter which module happens to read `env` - not on
    // whichever request first hits `undefined/users`.
    await import('@/config/env');

    const [{ AppProvider }, { AppRouter }] = await Promise.all([
      import('./app/provider'),
      import('./app/router'),
    ]);

    createRoot(rootElement).render(
      <StrictMode>
        <AppProvider>
          <AppRouter />
        </AppProvider>
      </StrictMode>,
    );
  } catch (error) {
    renderStartupError(error);
  }
};

void bootstrap();
