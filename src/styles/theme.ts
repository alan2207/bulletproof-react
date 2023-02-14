import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    hColors: {
      orange: string;
      ratingActive: string;
    };
  }
  interface PaletteOptions {
    hColors: {
      orange: string;
      ratingActive: string;
    };
  }
}

const theme = createTheme({
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          fontFamily: 'Poppins',
          color: '#3f3f3f',
          fontSize: '18px',
          fontWeight: '500',
          lineHeight: '160%',
          letterSpacing: '0.15px',
          textDecoration: 'none',
        },
      },
    },
    MuiButton: {
      variants: [
        {
          props: { variant: 'contained' },
          style: {
            backgroundColor: '#EE3126',
            color: 'white',
            ':hover': {
              backgroundColor: '#EE3150',
            },
          },
        },
        {
          props: { variant: 'text' },
          style: {
            color: '#EE3126',
          },
        },
      ],
      styleOverrides: {
        root: {
          fontWeight: '600',
          fontFamily: 'Poppins',
          ':focus': {
            outline: 'none',
          },
          boxShadow: 'none',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          ':focus': {
            outline: 'none',
          },
        },
      },
    },
    MuiTypography: {
      variants: [
        {
          props: { variant: 'h3' },
          style: {
            fontWeight: '700',
            fontSize: '36px',
            lineHeight: '42px',
          },
        },
        {
          props: { variant: 'caption' },
          style: {
            fontFamily: 'Nunito',
            fontWeight: '400',
            fontSize: '12px',
            lineHeight: '19.92px',
            letterSpacing: '0.4 px',
          },
        },
        {
          props: { variant: 'h5' },
          style: {
            fontFamily: 'Poppins',
            fontWeight: '400',
            fontSize: '1.25rem',
            lineHeight: '27px',
          },
        },
        {
          props: { variant: 'h4' },
          style: {
            fontSize: '1.975rem',
            fontWeight: '400',
            lineHeight: '37px',
          },
        },
        {
          props: { variant: 'h6' },
          style: {
            fontSize: '1.125rem',
            fontWeight: '500',
            lineHeight: '29px',
            fontFamily: 'Poppins',
            letterSpacing: '0.15px',
          },
        },

        {
          props: { variant: 'body1' },
          style: {
            fontSize: '1rem',
            fontWeight: '400',
            lineHeight: '24px',
            fontFamily: 'Nunito',
            letterSpacing: '0.15px',
          },
        },
        {
          props: { variant: 'subtitle1' },
          style: {
            fontSize: '1rem',
            fontWeight: '400',
            lineHeight: '28px',
            fontFamily: 'Nunito',
          },
        },
        {
          props: { variant: 'subtitle2' },
          style: {
            fontSize: '	0.75rem',
            fontWeight: '500',
            lineHeight: '22px',
            fontFamily: 'Nunito',
            letterSpacing: '0.1 px',
          },
        },
      ],
      styleOverrides: {
        root: {
          fontFamily: 'Poppins',
          color: '#3f3f3f',
        },
      },
    },
  },
  palette: {
    hColors: {
      orange: '#EE3126',
      ratingActive: '#FFB400',
    },
    secondary: {
      main: '#EE3126',
    },
    primary: {
      main: '#EE3126',
    },
  },
});

export default theme;
