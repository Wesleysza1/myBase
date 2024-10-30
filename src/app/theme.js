// src/theme.js
import { createTheme } from '@mui/material/styles';
import '@fontsource/audiowide';
import '@fontsource-variable/oxanium';

// Mantendo sua configuração de tipografia
const typography = {
  fontFamily: '"Oxanium Variable", "system-ui"',
  h1: {
    fontFamily: '"Audiowide", "system-ui"',
    fontWeight: 700,
    fontSize: '2.5rem',
    lineHeight: 1.2,
  },
  h2: {
    fontFamily: '"Audiowide", "system-ui"',
    fontWeight: 700,
    fontSize: '2rem',
    lineHeight: 1.3,
  },
  h3: {
    fontFamily: '"Audiowide", "system-ui"',
    fontWeight: 600,
    fontSize: '1.75rem',
    lineHeight: 1.4,
  },
  h4: {
    fontFamily: '"Audiowide", "system-ui"',
    fontWeight: 600,
    fontSize: '1.5rem',
    lineHeight: 1.4,
  },
  h5: {
    fontFamily: '"Audiowide", "system-ui"',
    fontWeight: 600,
    fontSize: '1.25rem',
    lineHeight: 1.4,
  },
  h6: {
    fontFamily: '"Audiowide", "system-ui"',
    fontWeight: 600,
    fontSize: '1rem',
    lineHeight: 1.4,
  },
  subtitle1: {
    fontFamily: '"Oxanium Variable", "system-ui"',
    fontWeight: 500,
    fontSize: '1rem',
    lineHeight: 1.75,
    letterSpacing: '0.00938em',
  },
  subtitle2: {
    fontFamily: '"Oxanium Variable", "system-ui"',
    fontWeight: 500,
    fontSize: '0.875rem',
    lineHeight: 1.57,
    letterSpacing: '0.00714em',
  },
  body1: {
    fontFamily: '"Oxanium Variable", "system-ui"',
    fontWeight: 400,
    fontSize: '1rem',
    lineHeight: 1.5,
    letterSpacing: '0.00938em',
  },
  body2: {
    fontFamily: '"Oxanium Variable", "system-ui"',
    fontWeight: 400,
    fontSize: '0.875rem',
    lineHeight: 1.43,
    letterSpacing: '0.01071em',
  },
  button: {
    fontFamily: '"Oxanium Variable", "system-ui"',
    fontWeight: 500,
    fontSize: '0.875rem',
    lineHeight: 1.75,
    letterSpacing: '0.02857em',
    textTransform: 'uppercase',
  },
  caption: {
    fontFamily: '"Oxanium Variable", "system-ui"',
    fontWeight: 400,
    fontSize: '0.75rem',
    lineHeight: 1.66,
    letterSpacing: '0.03333em',
  },
  overline: {
    fontFamily: '"Oxanium Variable", "system-ui"',
    fontWeight: 400,
    fontSize: '0.75rem',
    lineHeight: 2.66,
    letterSpacing: '0.08333em',
    textTransform: 'uppercase',
  },
};

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#5865F2',
      light: '#7983F5',
      dark: '#4752C4',
      contrastText: '#FFFFFF',
      black: '#000000',
      white: '#ffffff',
    },
    secondary: {
      main: '#747F8D',
      light: '#95A0B0',
      dark: '#5C646F',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F2F3F5', 
      hover: {
        paper: '#E3E5E8',
      }
    },
    text: {
      primary: '#2E3338',    
      secondary: '#747F8D',  
      disabled: '#C7CCD1',
    },
    error: {
      main: '#ED4245',   
      light: '#F16D6F',
      dark: '#BE3437',
    },
    warning: {
      main: '#FAA61A',    
      light: '#FBB746',
      dark: '#C88415',
    },
    info: {
      main: '#5865F2',    
      light: '#7983F5',
      dark: '#4752C4',
    },
    success: {
      main: '#3BA55C',  
      light: '#5BB77A',
      dark: '#2F844A',
    },
  },
  typography,
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#5865F2',
      light: '#7983F5',
      dark: '#4752C4',
      contrastText: '#FFFFFF',
      black: '#000000',
      white: '#ffffff',
    },
    secondary: {
      main: '#B9BBBE',
      light: '#C9CACD',
      dark: '#949597',
    },
    background: {
      default: '#36393F', 
      paper: '#2F3136', 
      hover: {
        paper: '#4F545C',
      }
    },
    text: {
      primary: '#FFFFFF',    
      secondary: '#B9BBBE',  
      disabled: '#72767D',
    },
    error: {
      main: '#ED4245',    
      light: '#F16D6F',
      dark: '#BE3437',
    },
    warning: {
      main: '#FAA61A',    
      light: '#FBB746',
      dark: '#C88415',
    },
    info: {
      main: '#5865F2',    
      light: '#7983F5',
      dark: '#4752C4',
    },
    success: {
      main: '#3BA55C', 
      light: '#5BB77A',
      dark: '#2F844A',
    },
  },
  typography,
});