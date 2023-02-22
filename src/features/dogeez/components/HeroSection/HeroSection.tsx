import { Box, Grid, Typography } from '@mui/material';

import styles from './../../../../theme/globalStyles';

const classes = {
  pageContainer: {
    maxWidth: '1280px',
    width: '100%',
    margin: '0 auto',
    display: 'block',
    background: '#FFFFFF',
    padding: {
      md: '0 65px',
      xs: '0 16px',
    },
  },

  heroImage: {
    maxWidth: '1280px',
  },

  heading: {
    marginTop: {
      xs: '48px',
    },
    fontWeight: {
      xs: 400,
    },
    lieHeight: {
      xs: '42px',
    },
  },

  subHeading: {
    color: '#3F3F3F',
    fontSize: '18px',
    lineHeight: {
      md: '160%',
      xs: '28.8px',
    },
    fontWeight: 500,
    maxWidth: '472px',
  },
};

export const HeroSection = () => {
  return (
    <Box sx={(styles.container, classes.pageContainer)}>
      <Grid container>
        <Grid item xs={12} md={6} display="flex" flexDirection="column" justifyContent="center">
          <Typography variant="h2" sx={classes.heading}>
            Dogeez sticker
          </Typography>
          <Typography
            variant="h6"
            sx={
              (classes.subHeading,
              {
                display: {
                  xs: 'none',
                  md: 'inherit',
                },
              })
            }
          >
            The source for all your Homeez news! Read our press releases, company updates and all
            about us in the news.
          </Typography>
          <Typography
            variant="h6"
            sx={
              (classes.subHeading,
              {
                display: {
                  md: 'none',
                  xs: 'inherit',
                },
              })
            }
          >
            Have some fun expressing yourself with our mascot, Dogeez!
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: {
                xs: 'none',
                md: 'block',
              },
            }}
          >
            <img alt="hero" style={classes.heroImage} src="/images/Group16655.png" />
          </Box>
          <Box
            sx={{
              display: {
                sm: 'block',
                md: 'none',
              },
              marginTop: {
                xs: '94px',
              },
            }}
          >
            <img alt="hero" src="/images/Group16655-mobile.png" />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
