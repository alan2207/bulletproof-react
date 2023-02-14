import { Box, Grid, Typography } from '@mui/material';
import { useState, useEffect } from 'react';

const classes = {
  gridContainer: {
    sm: {
      textAlign: 'center',
      backgroundColor: '#F7F3F0',
      padding: '80px 70px',
      maxWidth: '1280px',
      margin: '0 auto',
    },

    xs: {
      background: 'linear-gradient(180deg, #FFFFFF 0%, #F7F3F0 23.85%)',
      padding: '0 15px 80px 15px',
    },
  },

  gridIcon: {
    display: 'block',
    margin: '0 auto',
  },

  gridHeading: {
    paddingTop: '70px',
    paddingBottom: '75px',
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

  goalsTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: '30px',
  },
};

export const StartUpSection = () => {
  const [clientsCounter, setCounter] = useState(0);

  const counter = (minimum: number, maximum: number) => {
    for (let count = minimum; count <= maximum; count++) {
      setTimeout(() => {
        setCounter(count);
      }, 1000);
    }
  };

  useEffect(() => {
    counter(0, 1000);
  }, []);

  return (
    <Box sx={classes.gridContainer}>
      <Typography variant="h3" sx={classes.gridHeading}>
        As a XXX based start up,&nbsp;
        <Typography variant="h3" component="span" color="primary">
          xyz has
        </Typography>
      </Typography>
      <Grid container>
        <Grid item xs={12} md={4}>
          <Box justifyContent="center">
            <Typography
              variant="h3"
              align="center"
              color="primary"
              style={{ padding: '16px 0px' }}
              sx={classes.goalsTitle}
            >
              {'>'} {clientsCounter}+
            </Typography>
            <img
              alt="first-icon"
              src="/icons/648-victory-success-outline.png"
              style={classes.gridIcon}
            />
            <Typography variant="h5" align="center" style={{ padding: '16px 0px' }}>
              Clients served
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box justifyContent="center">
            <Typography
              variant="h3"
              align="center"
              color="primary"
              style={{ padding: '16px 0px' }}
              sx={classes.goalsTitle}
            >
              {'>'}$10 mil
            </Typography>
            <img
              alt="first-icon"
              src="/icons/453-savings-pig-outline.png"
              style={classes.gridIcon}
            />
            <Typography variant="h5" align="center" style={{ padding: '16px 0px' }}>
              SDG served
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box justifyContent="center">
            <Typography
              variant="h3"
              align="center"
              color="primary"
              style={{ padding: '16px 0px' }}
              sx={classes.goalsTitle}
            >
              {'>'}100+
            </Typography>
            <img
              alt="first-icon"
              src="/icons/1754-nails-screw-carpentry-outline.png"
              style={classes.gridIcon}
            />
            <Typography variant="h5" align="center" style={{ padding: '16px 0px' }}>
              Suppliers onboard
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
