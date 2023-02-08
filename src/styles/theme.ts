// eslint-disable-next-line import/no-unresolved
import { createTheme } from '@mui/material';

// eslint-disable-next-line import/no-unresolved
import './fonts.scss';

let theme = createTheme({});

theme = createTheme(theme, {
  breakpoints: {
    values: {
      xs: 0,
      sm: 361,
      md: 580,
      lg: 600,
      xl: 1200,
    },
  },
  palette: {
    primary: {
      main: '#EE3126',
    },
  },
  typography: {
    fontFamily: ['Poppins-Regular', 'Nunito-Regular', 'sans-serif'].join(','),
    h1: {
      fontSize: '30px',
      lineHeight: '58px',
      textTransform: 'none',
      fontFamily: 'Poppins-Bold',
    },
    h2: {
      fontSize: '48px',
      lineHeight: '58px',
      textTransform: 'none',
      fontFamily: 'Poppins-Light',

      [theme.breakpoints.down('md')]: {
        fontSize: '32px',
        lineHeight: '40px',
        fontFamily: 'Poppins-Bold',
      },
    },
    h3: {
      fontSize: '36px',
      lineHeight: '42px',
      textTransform: 'none',
      fontFamily: 'Poppins-Regular',

      [theme.breakpoints.down('md')]: {
        fontSize: '30px',
        lineHeight: '37px',
      },
    },
    h4: {
      fontSize: '18px',
      fontWeight: 600,
      lineHeight: '36px',
      textTransform: 'none',
      fontFamily: 'Poppins-Regular',

      [theme.breakpoints.down('md')]: {
        fontWeight: 400,
        fontSize: '40px',
        lineHeight: '37px',
      },
    },
    h5: {
      fontSize: '20px',
      fontWeight: 400,
      lineHeight: '32px',
      textTransform: 'none',
      fontFamily: 'Poppins-Regular',
    },
    h6: {
      fontSize: '18px',
      lineHeight: '29px',
      fontFamily: 'Poppins-Regular',
      textTransform: 'none',

      [theme.breakpoints.down('md')]: {
        fontSize: '16px',
        lineHeight: '24px',
        fontFamily: 'Nunito-Bold',
      },
    },
    subtitle1: {
      fontSize: '16px',
      lineHeight: '24px',
      textTransform: 'none',
      fontFamily: 'Nunito-Regular',
    },
    subtitle2: {
      fontSize: '16px',
      lineHeight: '24px',
      textTransform: 'none',
      fontFamily: 'Nunito-Bold',
    },
    button: {
      fontSize: '20px',
      fontWeight: 600,
      lineHeight: '30px',
      fontFamily: 'Radial-SemiBold',
      textTransform: 'none',
    },
  },

  components: {},
});
export default theme;
