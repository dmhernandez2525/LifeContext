import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ScrollToTop from './components/ScrollToTop';
import { ToastProvider } from './components/Toast';
import { ThemeProvider } from './components/ThemeProvider';
import { ConvexClientProvider } from './components/ConvexClientProvider';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConvexClientProvider>
      <BrowserRouter>
        <ScrollToTop />
        <ToastProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </ToastProvider>
      </BrowserRouter>
    </ConvexClientProvider>
  </React.StrictMode>
);
