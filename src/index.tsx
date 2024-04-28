import * as React from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App';
import { initMocks } from './test/server';

const root = createRoot(document.getElementById('root') as HTMLElement);

initMocks().then(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
