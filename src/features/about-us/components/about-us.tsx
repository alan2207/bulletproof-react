import { Box, createStyles, Grid, Hidden, makeStyles, Typography } from '@material-ui/core';
import { Theme } from '@mui/material';
import React from 'react';

import { VerticalTabs } from './tabs';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pageContainer: {
      maxWidth: '1280px',
      width: '100%',
      margin: '0 auto',
      display: 'block',
      padding: '0 1rem',
      background: 'linear-gradient(180deg, #FFFFFF 74.71%, #F7F3F0 100%)',

      [theme.breakpoints.down('md')]: {
        background: 'transparent',
      },
    },
    heroImage: {
      margin: '0 auto',
      display: 'block',
      maxWidth: '1280px',
    },
    mainSection: {
      background: 'linear-gradient(180deg, #FFFFFF 74.71%, #F7F3F0 100%)',
      '& > *': {
        display: 'block',
        margin: '0 auto',
      },
    },
    mainHeading: {
      textAlign: 'center',
      fontSize: '42px',
      color: '#EE3126',
      lineHeight: '56px',
    },
    subHeading: {
      color: '#3F3F3F',
      maxWidth: '990px',
      margin: '0 auto',
      display: 'block',

      [theme.breakpoints.down('md')]: {
        marginTop: '32px',
      },
    },
    gridContainer: {
      textAlign: 'center',
      backgroundColor: '#F7F3F0',
      padding: '80px 70px',
      maxWidth: '1280px',
      margin: '0 auto',

      [theme.breakpoints.down('md')]: {
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F7F3F0 23.85%)',
        padding: '0 15px 80px 15px',
      },
    },

    howWeStartedSection: {
      maxWidth: '1280px',
      margin: '0 auto',
      background: 'linear-gradient(180deg, #FFFFFF 62.71%, #F7F3F0 100%)',
      padding: '65px',

      [theme.breakpoints.down('md')]: {
        padding: '0px',
      },
    },

    gridHeading: {
      paddingTop: '80px',
      paddingBottom: '32px',
    },

    gridIcon: {
      display: 'block',
      margin: '0 auto',
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
    flexText: {
      display: 'flex',
      margin: '0 auto',
      flexDirection: 'column',
      justifyContent: 'center',
      height: '100%',

      [theme.breakpoints.down('md')]: {
        textAlign: 'center',
        marginBottom: '32px',
      },
    },
    sectionPadding: {
      paddingTop: '55px',
    },
    goalsTitle: {
      fontFamily: 'Poppins-Bold',
      fontSize: '30px',
    },

    contentContainer: {
      textAlign: 'left',

      [theme.breakpoints.down('md')]: {
        textAlign: 'center',
      },
    },
  })
);

export const AboutUs: React.FC = () => {
  const classes = useStyles();

  return (
    <Box>
      <Box pl={2} pr={2}>
        <Box className={(classes.mainSection, classes.pageContainer)}>
          <Typography variant="h2" color="primary" align="center">
            Renovation at your fingertips
          </Typography>
          <Typography variant="h6" align="center" color="primary" className={classes.subHeading}>
            With our propriety AI technology, we believe in traditional renovation incorporating
            technology.
            <br />
            Bringing an empowering experience to every homeowner.
          </Typography>
          <Hidden mdDown>
            <img alt="hero" className={classes.heroImage} src="/images/Homeez-Heights-1.png" />
          </Hidden>
        </Box>
      </Box>
      <Hidden mdUp>
        <img alt="hero" src="/images/Homeez-Heights-Mobile.png" />
      </Hidden>
      <Box>
        <Box className={classes.gridContainer}>
          <Typography variant="h3" align="center" className={classes.gridHeading}>
            Simplyifying Home Renos
          </Typography>
          <Grid container spacing={5}>
            <Grid item xs={12} md={4}>
              <Box justifyContent="center">
                <img alt="first-icon" src="/icons/image-19.png" className={classes.gridIcon} />
                <Typography variant="h6" align="center" style={{ padding: '16px 0px' }}>
                  Empowering Homeowners
                </Typography>
                <Typography variant="subtitle1" align="center">
                  With us, the control is back in your hands. You decide which route you want to
                  take, which service you really need and how your dream home is going to be!
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box justifyContent="center">
                <img alt="first-icon" src="/icons/image-17.png" className={classes.gridIcon} />
                <Typography variant="h6" align="center" style={{ padding: '16px 0px' }}>
                  Assurance
                </Typography>
                <Typography variant="subtitle1" align="center">
                  We only work with trusted suppliers who provide quality workmanship. Using our
                  escrow system, payments will only made to suppliers when you’re happy with the
                  work done!
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box justifyContent="center">
                <img alt="first-icon" src="/icons/image-18.png" className={classes.gridIcon} />
                <Typography variant="h6" align="center" style={{ padding: '16px 0px' }}>
                  Transparency
                </Typography>
                <Typography variant="subtitle1" align="center">
                  As we connect you to direct suppliers, we remove the markup and the extra costs.
                  This is made available to you immediately complete Design Now!
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box className={classes.videoSection}>
          <Hidden mdDown>
            <Typography variant="h3" align="center" className={classes.gridHeading}>
              Understand more about us
            </Typography>
          </Hidden>
          <Hidden mdUp>
            <Typography variant="h4" align="center" className={classes.gridHeading}>
              Understand more about us
            </Typography>
          </Hidden>
          <img alt="video-img" src="/images/image-867.png" style={{ marginTop: '40px' }} />
        </Box>
        <Box className={classes.howWeStartedSection}>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h3" align="center" className={classes.gridHeading}>
                How we started
              </Typography>
            </Grid>

            <Grid item xs={12} md={6} className={classes.contentContainer}>
              <Typography variant="subtitle1">
                Xyz came about when our team of interior designers noticed a major gap in the
                industry.
              </Typography>
              <br />
              <Typography variant="subtitle1">
                With the high middle man costs, lack of control for homeowners, and dubious nature
                of pricing, the renovation industry has always been unregulated and one of the most
                complained.
              </Typography>
              <br />
              <Typography variant="subtitle1">
                Seeing the need to change this, Xyz wants to help homeowners by maximise cost
                savings, and disrupt the current nature of the industry, Xyz works hard to bring
                transparent prices, quality workmanship and control back to the homeowners!
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <img alt="img-sef" src="/images/Rectangle-100.png" />
            </Grid>
          </Grid>
          <Box className={classes.heroImage}>
            <Grid container className={classes.sectionPadding}>
              <Hidden mdDown>
                <Grid item xs={12} md={6}>
                  <img alt="img-sef" src="/images/image-868.png" />
                </Grid>
              </Hidden>
              <Grid item xs={12} md={6}>
                <Box className={classes.flexText} style={{ maxWidth: '570px' }}>
                  <Typography variant="subtitle1">
                    Seeing the need to change this, Xyz wants to help homeowners by maximise cost
                    savings, and disrupt the current nature of the industry.
                  </Typography>
                  <br />
                  <Typography variant="subtitle2">
                    With this, it is Xyz’s mission to work hard in bringing transparent prices,
                    quality workmanship and control back to the homeowners!
                  </Typography>
                </Box>
              </Grid>
              <Hidden smUp>
                <Grid item xs={12} md={6}>
                  <img alt="img-sef" src="/images/image-868.png" />
                </Grid>
              </Hidden>
            </Grid>
          </Box>
        </Box>
        <Box className={classes.gridContainer}>
          <Typography variant="h3" className={classes.gridHeading}>
            As a XXX based start up,&nbsp;
            <Typography variant="h3" component="span" color="primary">
              xyz has
            </Typography>
          </Typography>
          <Grid container spacing={5}>
            <Grid item xs={12} md={4}>
              <Box justifyContent="center">
                <Typography
                  variant="h3"
                  align="center"
                  color="primary"
                  style={{ padding: '16px 0px' }}
                  className={classes.goalsTitle}
                >
                  {'>'} 10000 +
                </Typography>
                <img
                  alt="first-icon"
                  src="/icons/648-victory-success-outline.png"
                  className={classes.gridIcon}
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
                  className={classes.goalsTitle}
                >
                  Assurance
                </Typography>
                <img
                  alt="first-icon"
                  src="/icons/453-savings-pig-outline.png"
                  className={classes.gridIcon}
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
                  className={classes.goalsTitle}
                >
                  Transparency
                </Typography>
                <img
                  alt="first-icon"
                  src="/icons/1754-nails-screw-carpentry-outline.png"
                  className={classes.gridIcon}
                />
                <Typography variant="h5" align="center" style={{ padding: '16px 0px' }}>
                  Suppliers onboard
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box className={classes.videoSection}>
          <Typography variant="h3" align="center" className={classes.gridHeading}>
            Quick and easy{' '}
            <Typography variant="h3" component="span" color="primary">
              with Xyz
            </Typography>
          </Typography>
          <VerticalTabs />
        </Box>
      </Box>
    </Box>
  );
};
