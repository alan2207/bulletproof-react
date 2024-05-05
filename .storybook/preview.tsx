import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import '../src/index.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};

export const decorators = [
  (Story) => (
    <Router>
      <Story />
    </Router>
  ),
];
