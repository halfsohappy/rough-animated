import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { Showcase } from './pages/Showcase.tsx';
import { RoughThemeProvider } from './components/RoughThemeContext.tsx';
import './index.css';
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Showcase />,
  },
  {
    path: '/playground',
    element: <App />,
  },
], { basename: '/rough-animated' });
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RoughThemeProvider>
      <RouterProvider router={router} />
    </RoughThemeProvider>
  </StrictMode>,
);
