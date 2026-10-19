import { createTheme } from '@mui/material/styles';

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#0284c7', // Brand deep ocean blue
      light: '#38bdf8',
      dark: '#0369a1',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#06b6d4', // Aqua accent
      light: '#67e8f9',
      dark: '#0891b2',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000ff',
      secondary: '#475569',
    },
  },
  typography: {
    fontFamily: ['Inter', 'system-ui', '-apple-system', 'sans-serif'].join(','),
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 20px',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
        variant: 'outlined',
      },
    },
  },
});
