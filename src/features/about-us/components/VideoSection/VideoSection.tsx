import { Box, Typography, Hidden } from '@mui/material';
import ReactPlayer from 'react-player';

const classes = {
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

  playerWrapper: {
    position: 'relative',
    paddingTop: '56.25%',
  },
  reactPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
};

export const VideoSection = () => {
  return (
    <Box sx={classes.videoSection}>
      <Hidden lgDown>
        <Typography variant="h3" align="center" sx={classes.gridHeading}>
          Understand more about us
        </Typography>
      </Hidden>
      <Hidden mdUp>
        <Typography variant="h4" align="center" sx={classes.gridHeading}>
          Understand more about us
        </Typography>
      </Hidden>

      <Box sx={classes.playerWrapper}>
        <ReactPlayer
          sx={classes.reactPlayer}
          url="https://www.youtube.com/watch?v=DqJt-kcCaZw&ab_channel=Homeez"
          width="100%"
          height="100%"
          type="video/mp4"
          controls
          // you can use the following property to set a thumbnail if needed
          // light={<img src="https://example.com/thumbnail.png" alt="Thumbnail" />}
        />
      </Box>
    </Box>
  );
};
