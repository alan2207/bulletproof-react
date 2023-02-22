import { Box, Button, Grid, Typography } from '@mui/material';
import { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/swiper.min.css';

const stickerPictures = [
  {
    fileName: '/images/res (8).png',
  },
  {
    fileName: '/images/res (12).png',
  },
  {
    fileName: '/images/res (13).png',
  },

  {
    fileName: '/images/res (19).png',
  },
  {
    fileName: '/images/res (18).png',
  },
  {
    fileName: '/images/res (16).png',
  },
  {
    fileName: '/images/res (23).png',
  },
  {
    fileName: '/images/res (27).png',
  },
  {
    fileName: '/images/res (26).png',
  },
];

const classes = {
  pageContainer: {
    maxWidth: '1280px',
    width: '100%',
    margin: '0 auto',
    display: 'block',
    background: 'linear-gradient(180deg, #FFFFFF 0%, #F7F3F0 5.52%);',
    padding: {
      md: '0 112px',
      sm: '0 30px',
    },
  },

  buttonsContainer: {
    width: '100%',
    margin: '0 auto',
    paddingTop: '90px',
    marginBottom: '83px',
    display: {
      xs: 'none',
      md: 'flex',
    },
  },

  buttonContainer: {
    backgroundColor: '#ffffff',
    maxWidth: '469px',
    borderRadius: '10px',
    padding: {
      md: '20px 80px',
      xs: '20px',
    },
    '.MuiTypography-root': {
      fontSize: {
        xs: '15px',
      },
    },
  },

  mySwiper: {
    width: '100%',
    height: '100%',
  },
};

export const ExpressSection = () => {
  return (
    <Box sx={classes.pageContainer}>
      <Grid container sx={classes.buttonsContainer}>
        <Grid item md={6}>
          <Button
            sx={classes.buttonContainer}
            startIcon={<img alt="whatsapp" src="./images/icons8-whatsapp.png" />}
          >
            <Typography variant="h6" textTransform="uppercase">
              Download for whatsapp
            </Typography>
          </Button>
        </Grid>
        <Grid item md={6}>
          <Button
            sx={classes.buttonContainer}
            startIcon={<img alt="telegram" src="/images/icons8-telegram-app.png" />}
          >
            <Typography variant="h6" textTransform="uppercase">
              Download for telegram
            </Typography>
          </Button>
        </Grid>
      </Grid>
      <Grid
        container
        sx={{
          flexDirection: {
            xs: 'column-reverse',
            md: 'row',
          },
          padding: {
            xs: '0 17px',
          },
        }}
      >
        <Grid item xs={12} md={6}>
          <img alt="iphone" src="/images/iPhone.png" />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography
            variant="h4"
            sx={{
              textAlign: {
                xs: 'center',
                md: 'left',
              },
              marginTop: {
                xs: '160px',
                md: '0',
              },
            }}
          >
            Express yourself!
          </Typography>
          <br />
          <Typography
            variant="body1"
            sx={{
              textAlign: {
                xs: 'center',
              },
            }}
          >
            We created a set of stickers with our mascot, Dogeez so that you can have fun expressing
            yourself in your conversations! For any scenario and situation!
          </Typography>
          <br />
          <Grid
            container
            spacing={2}
            sx={{
              display: {
                xs: 'none',
                md: 'flex',
              },
            }}
          >
            {stickerPictures.map((sticker: any, index: number) => (
              <Grid item md={4} key={index}>
                <img
                  alt={sticker.fileName}
                  src={sticker.fileName}
                  style={{ backgroundColor: '#ffffff', borderRadius: '6px' }}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
      <Box
        sx={{
          display: {
            xs: 'block',
            md: 'none',
          },
          padding: {
            xs: '0 17px',
            md: '0 65px',
          },
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          sx={{
            display: {
              md: 'none',
              sm: 'block',
            },
            marginTop: '134px',
            marginBottom: '24px',
          }}
        >
          20 Stickers to emote!
        </Typography>
        <Swiper
          slidesPerView={2.5}
          spaceBetween={16}
          pagination={{
            clickable: true,
          }}
          modules={[Autoplay]}
          style={classes.mySwiper}
          loop={true}
          autoplay={{
            delay: 1000,
            disableOnInteraction: false,
          }}
        >
          {stickerPictures.map((carouselItem, index) => (
            <SwiperSlide key={index}>
              <img
                alt={carouselItem.fileName}
                key={index}
                src={carouselItem.fileName}
                style={{ backgroundColor: '#ffffff', borderRadius: '6px' }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <Box
          sx={{
            display: {
              xs: 'flex',
              md: 'none',
            },
            flexDirection: 'column',
            marginTop: '80px',
            padding: '0 16px',

            '.MuiButton-root': {
              marginBottom: '10px',
            },
          }}
        >
          <Button
            sx={classes.buttonContainer}
            startIcon={<img alt="whatsapp" src="/images/icons8-whatsapp.png" />}
          >
            <Typography variant="h6" textTransform="uppercase">
              Download for whatsapp
            </Typography>
          </Button>
          <Button
            sx={classes.buttonContainer}
            startIcon={<img alt="telegram" src="/images/icons8-telegram-app.png" />}
          >
            <Typography variant="h6" textTransform="uppercase">
              Download for telegram
            </Typography>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
