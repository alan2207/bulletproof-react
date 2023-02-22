/* eslint-disable @typescript-eslint/no-unused-vars */
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material';

import { AppProvider } from '@/providers/app';
import { AppRoutes } from '@/routes';

import theme from './theme/index';
import 'swiper/swiper.min.css';
import 'swiper/swiper-bundle.css';

function App() {
  return (
    <AppProvider>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <AppRoutes />
        </ThemeProvider>
      </StyledEngineProvider>
    </AppProvider>
  );
}

export default App;
