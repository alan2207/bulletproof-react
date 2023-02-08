/* eslint-disable @typescript-eslint/no-unused-vars */
import { ThemeProvider } from '@material-ui/core';

import { AppProvider } from '@/providers/app';
import { AppRoutes } from '@/routes';

import theme from './styles/theme';

function App() {
  return (
    <AppProvider>
      <ThemeProvider theme={theme}>
        <AppRoutes />
      </ThemeProvider>
    </AppProvider>
  );
}

export default App;
