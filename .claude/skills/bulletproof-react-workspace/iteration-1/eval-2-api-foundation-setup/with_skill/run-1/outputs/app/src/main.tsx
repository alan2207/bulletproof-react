import * as React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from '@/app/app';

const root = document.getElementById('root');

if (!root) {
  throw new Error('No root element found — check index.html');
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
