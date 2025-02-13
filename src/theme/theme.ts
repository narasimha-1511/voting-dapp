import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#A288A6',
      light: '#BB9BB0',
      dark: '#1C1D21',
    },
    secondary: {
      main: '#CCBCBC',
      light: '#F1E3E4',
      dark: '#BB9BB0',
    },
    background: {
      default: '#1C1D21',
      paper: 'rgba(44, 46, 53, 0.95)',
    },
    text: {
      primary: '#F1E3E4',
      secondary: '#CCBCBC',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(162, 136, 166, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(44, 46, 53, 0.95)',
          backdropFilter: 'blur(8px)',
          borderRadius: 16,
          border: '1px solid rgba(162, 136, 166, 0.2)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1C1D21',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(44, 46, 53, 0.95)',
          backdropFilter: 'blur(8px)',
          color: '#F1E3E4',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#F1E3E4',
        },
      },
    },
  },
}); 