import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: { main: '#43a047' },
    secondary: { main: '#ffb300' },
    background: { default: '#f5f6fa' },
  },
  typography: {
    fontFamily: 'Cairo, Arial, sans-serif',
  },
});

document.body.dir = 'rtl';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
