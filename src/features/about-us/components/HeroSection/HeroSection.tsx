import { Box, Hidden, Typography } from '@mui/material';

const classes = {
  pageContainer: {
    maxWidth: '1280px',
    width: '100%',
    margin: '0 auto',
    display: 'block',
    background: 'linear-gradient(180deg, #FFFFFF 74.71%, #F7F3F0 100%)',

    md: {
      background: 'transparent',
      maxWidth: '100%',
      width: '100%',
    },
  },

  heroImage: {
    margin: '0 auto',
    display: 'block',
    maxWidth: '1280px',
  },

  subHeading: {
    color: '#3F3F3F',
    maxWidth: '990px',
    margin: '0 auto',
    display: 'block',

    md: {
      marginTop: '32px',
    },
  },

  mainSection: {
    background: 'linear-gradient(180deg, #FFFFFF 74.71%, #F7F3F0 100%)',
    '& > *': {
      display: 'block',
      margin: '0 auto',
    },

    '& > h2': {
      marginBottom: '16px',
    },
  },

  videoSection: {
    background: 'linear-gradient(180deg, #F7F3F0 0%, #FFFFFF 18.44%)',
    maxWidth: '1280px',
    margin: '0 auto',

    '& > *': {
      display: 'block',
      margin: '0 auto',
    },
  },
};

export const HeroSection = () => {
  return (
    <Box>
      <Box pl={2} pr={2}>
        <Box sx={(classes.mainSection, classes.pageContainer)}>
          <Typography variant="h2" color="primary" align="center">
            Renovation at your fingertips
          </Typography>
          <Typography variant="h6" align="center" color="primary" sx={classes.subHeading}>
            With our propriety AI technology, we believe in traditional renovation incorporating
            technology.
            <br />
            Bringing an empowering experience to every homeowner.
          </Typography>
          <Hidden lgDown>
            <img alt="hero" style={classes.heroImage} src="/images/Homeez-Heights-1.png" />
          </Hidden>
        </Box>
      </Box>
      <Hidden mdUp>
        <img alt="hero" src="/images/Homeez-Heights-Mobile.png" />
      </Hidden>
    </Box>
  );
};
