/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/jsx-no-comment-textnodes */
import { Box, Typography, createStyles, makeStyles, Hidden } from '@material-ui/core';
import { Player } from 'video-react';

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

    '& .video-react-fluid.': {
      position: 'relative',
    },

    '& .video-react': {
      position: 'absolute',
      top: 0,
    },
  })
);

export const VideoSection = () => {
  const classes = useStyles();

  return (
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
      <Player>
        <video controls>
          <source src="/videos/pexels-marc-espejo-6548176.mp4" type="video/mp4" />
        </video>
      </Player>
    </Box>
  );
};
