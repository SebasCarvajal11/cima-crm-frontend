import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import App from './App';
import './index.css';

const HEADING_FONT = '"Outfit", system-ui, sans-serif';
const BODY_FONT = '"Inter", system-ui, sans-serif';

let theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: '#592d2d',
      light: '#8e3031',
    },
    secondary: {
      main: '#1a237e',
      light: '#3949ab',
    },
    background: {
      default: '#f4f6f9',
      paper: '#ffffff',
    },
    success: {
      main: '#10b981',
      light: '#d1fae5',
    },
    warning: {
      main: '#f59e0b',
      light: '#fef3c7',
    },
    error: {
      main: '#ef4444',
      light: '#fee2e2',
    },
    info: {
      main: '#3b82f6',
      light: '#dbeafe',
    },
    text: {
      primary: '#1a1a2e',
      secondary: '#7e8299',
    },
    divider: '#ebedf3',
  },
  typography: {
    fontFamily: BODY_FONT,
    h1: { fontFamily: HEADING_FONT, fontWeight: 600 },
    h2: { fontFamily: HEADING_FONT, fontWeight: 600 },
    h3: { fontFamily: HEADING_FONT, fontWeight: 600 },
    h4: { fontFamily: HEADING_FONT, fontWeight: 600 },
    h5: { fontFamily: HEADING_FONT, fontWeight: 600 },
    h6: { fontFamily: HEADING_FONT, fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '1rem',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '0.75rem',
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
