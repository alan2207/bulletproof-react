import { Box, createStyles, makeStyles, Typography } from '@material-ui/core';

import { VerticalTabs } from '../tabs';

const useStyles = makeStyles(() =>
  createStyles({
    gridHeading: {
      paddingTop: '80px',
      paddingBottom: '32px',
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
  })
);

export const GuidanceSection = () => {
  const classes = useStyles();

  return (
    <Box className={classes.videoSection}>
      <Typography variant="h3" align="center" className={classes.gridHeading}>
        Quick and easy{' '}
        <Typography variant="h3" component="span" color="primary">
          with Xyz
        </Typography>
      </Typography>
      <VerticalTabs />
    </Box>
  );
};
