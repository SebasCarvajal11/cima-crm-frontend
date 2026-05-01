import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { ProjectProvider } from './context/ProjectContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from './App';
import './index.css';

const theme = createTheme({
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
    },
  },
  typography: {
    fontFamily: '"Inter", system-ui, sans-serif',
    h1: { fontFamily: '"Outfit", system-ui, sans-serif', fontWeight: 600 },
    h2: { fontFamily: '"Outfit", system-ui, sans-serif', fontWeight: 600 },
    h3: { fontFamily: '"Outfit", system-ui, sans-serif', fontWeight: 600 },
    h4: { fontFamily: '"Outfit", system-ui, sans-serif', fontWeight: 600 },
    h5: { fontFamily: '"Outfit", system-ui, sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Outfit", system-ui, sans-serif', fontWeight: 600 },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ProjectProvider>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </ProjectProvider>
    </Provider>
  </React.StrictMode>
);
