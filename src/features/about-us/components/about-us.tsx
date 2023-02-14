import { Box } from '@mui/material';
import React from 'react';

import { GuidanceSection } from './GuidanceSection/GuidanceSection';
import { HeroSection } from './HeroSection/HeroSection';
import { HomeRenosSection } from './HomeRenosSection/HomeRenosSection';
import { HowWeStarted } from './HowWeStarted/HowWeStarted';
import { StartUpSection } from './StartUpSection/StartUpSection';
import { VideoSection } from './VideoSection/VideoSection';

export const AboutUs: React.FC = () => {
  return (
    <Box p={0} m={0}>
      <HeroSection />
      <HomeRenosSection />
      <VideoSection />
      <HowWeStarted />
      <StartUpSection />
      <GuidanceSection />
    </Box>
  );
};
