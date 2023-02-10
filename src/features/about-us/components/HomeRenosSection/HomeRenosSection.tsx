import { Box, Typography, Grid, createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    gridContainer: {
      textAlign: 'center',
      backgroundColor: '#F7F3F0',
      padding: '80px 70px',
      maxWidth: '1280px',
      margin: '0 auto',

      [theme.breakpoints.down('md')]: {
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F7F3F0 23.85%)',
        padding: '0 15px',
      },
    },

    gridItem: {
      padding: '0 17px',
    },

    gridHeading: {
      paddingTop: '100px',
      paddingBottom: '96px',
    },

    gridIcon: {
      display: 'block',
      margin: '0 auto',
    },
  })
);

export const HomeRenosSection = () => {
  const classes = useStyles();
  return (
    <Box className={classes.gridContainer}>
      <Typography variant="h3" align="center" className={classes.gridHeading}>
        Simplyifying Home Renos
      </Typography>
      <Grid container>
        <Grid item xs={12} md={4} className={classes.gridItem}>
          <Box justifyContent="center">
            <img alt="first-icon" src="/icons/image-19.png" className={classes.gridIcon} />
            <Typography variant="h6" align="center" style={{ padding: '16px 0px' }}>
              Empowering Homeowners
            </Typography>
            <Typography variant="subtitle1" align="center">
              With us, the control is back in your hands. You decide which route you want to take,
              which service you really need and how your dream home is going to be!
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4} className={classes.gridItem}>
          <Box justifyContent="center">
            <img alt="first-icon" src="/icons/image-17.png" className={classes.gridIcon} />
            <Typography variant="h6" align="center" style={{ padding: '16px 0px' }}>
              Assurance
            </Typography>
            <Typography variant="subtitle1" align="center">
              We only work with trusted suppliers who provide quality workmanship. Using our escrow
              system, payments will only made to suppliers when you’re happy with the work done!
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4} className={classes.gridItem}>
          <Box justifyContent="center">
            <img alt="first-icon" src="/icons/image-18.png" className={classes.gridIcon} />
            <Typography variant="h6" align="center" style={{ padding: '16px 0px' }}>
              Transparency
            </Typography>
            <Typography variant="subtitle1" align="center">
              As we connect you to direct suppliers, we remove the markup and the extra costs. This
              is made available to you immediately complete Design Now!
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
