import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFD700', // Bright Yellow
    },
    secondary: {
      main: '#FF69B4', // Hot Pink
    },
    background: {
      default: '#F5F5F5', // Off-white
      paper: '#FFFFFF',
    },
    text: {
      primary: '#000000',
      secondary: '#333333',
    },
  },
  shape: {
    borderRadius: 0, // Sharp corners for Brutalist look
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 900,
      textTransform: 'uppercase',
      letterSpacing: '-0.05em',
    },
    button: {
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          border: '2px solid #000',
          boxShadow: '4px 4px 0px #000',
          '&:active': {
            boxShadow: '0px 0px 0px #000',
            transform: 'translate(4px, 4px)',
          },
          '&:hover': {
            backgroundColor: '#FFD700', // Stay yellow on hover
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              border: '2px solid #000',
              borderRadius: 0,
            },
            '&.Mui-focused fieldset': {
              border: '2px solid #000',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: '2px solid #000',
          boxShadow: '8px 8px 0px #000',
          borderRadius: 0,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '2px solid #000',
          boxShadow: '8px 8px 0px #000',
          borderRadius: 0,
        },
      },
    },
  },
});

export default theme;
