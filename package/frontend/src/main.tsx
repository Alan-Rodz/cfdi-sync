import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { ClientProviders } from './ui/layout/ClientProviders.tsx';
import App from './App.tsx';

// ********************************************************************************
// == Component ===================================================================
createRoot(document.getElementById('root')!).render(
 <StrictMode>
  <ClientProviders>
   <App />
  </ClientProviders>
 </StrictMode>
);
