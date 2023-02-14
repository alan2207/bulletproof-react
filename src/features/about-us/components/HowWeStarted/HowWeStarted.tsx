import { Box, Grid, Hidden, Typography } from '@mui/material';

const classes = {
  gridHeading: {
    paddingTop: '100px',
    paddingBottom: '96px',
  },

  howWeStartedSection: {
    maxWidth: '1280px',
    margin: '0 auto',
    background: 'linear-gradient(180deg, #FFFFFF 62.71%, #F7F3F0 100%)',
    padding: '65px',

    md: {
      maxWidth: '100%',
      padding: '0 15px',
    },
  },

  gridIcon: {
    display: 'block',
    margin: '0 auto',
  },

  contentContainer: {
    textAlign: 'left',
    paddingRight: '16px',

    md: {
      padding: '0px',
      textAlign: 'center',
    },
  },

  sectionPadding: {
    paddingTop: '55px',
  },

  flexText: {
    display: 'flex',
    margin: '0 auto',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',

    md: {
      textAlign: 'center',
      marginBottom: '32px',
    },
  },

  heroImage: {
    margin: '0 auto',
    display: 'block',
    maxWidth: '1280px',
  },
};

export const HowWeStarted = () => {
  return (
    <Box sx={classes.howWeStartedSection}>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h3" align="center" sx={classes.gridHeading}>
            How we started
          </Typography>
        </Grid>

        <Grid item xs={12} md={6} sx={classes.contentContainer}>
          <Typography variant="subtitle1">
            Xyz came about when our team of interior designers noticed a major gap in the industry.
          </Typography>
          <br />
          <Typography variant="subtitle1">
            With the high middle man costs, lack of control for homeowners, and dubious nature of
            pricing, the renovation industry has always been unregulated and one of the most
            complained.
          </Typography>
          <br />
          <Typography variant="subtitle1">
            Seeing the need to change this, Xyz wants to help homeowners by maximise cost savings,
            and disrupt the current nature of the industry, Xyz works hard to bring transparent
            prices, quality workmanship and control back to the homeowners!
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <img alt="img-sef" src="/images/Rectangle-100.png" />
        </Grid>
      </Grid>
      <Box sx={classes.heroImage}>
        <Grid container sx={classes.sectionPadding}>
          <Hidden lgDown>
            <Grid item xs={12} md={6}>
              <img alt="img-sef" src="/images/image-868.png" />
            </Grid>
          </Hidden>
          <Grid item xs={12} md={6}>
            <Box sx={classes.flexText} style={{ maxWidth: '570px' }}>
              <Typography variant="subtitle1">
                Seeing the need to change this, Xyz wants to help homeowners by maximise cost
                savings, and disrupt the current nature of the industry.
              </Typography>
              <br />
              <Typography variant="subtitle2">
                With this, it is Xyz’s mission to work hard in bringing transparent prices, quality
                workmanship and control back to the homeowners!
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
  );
};
