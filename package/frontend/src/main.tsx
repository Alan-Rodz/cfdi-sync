import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import './global.css';
import { ClientProviders } from './ui/layout/ClientProviders.tsx';

// ********************************************************************************
// == Component ===================================================================
createRoot(document.getElementById('root')!).render(
 <StrictMode>
  <ClientProviders>
   <App />
  </ClientProviders>
 </StrictMode>
);
