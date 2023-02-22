import { Box } from '@mui/material';
import React from 'react';

import { ExpressSection } from './components/ExpressSection/ExpressSection';
import { HeroSection } from './components/HeroSection/HeroSection';

export const Dogeez: React.FC = () => {
  return (
    <Box p={0} m={0}>
      <HeroSection />
      <ExpressSection />
    </Box>
  );
};
