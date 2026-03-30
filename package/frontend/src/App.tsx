import { createRouter, RouterProvider } from '@tanstack/react-router';

import { routeTree } from './routeTree.gen';

// ********************************************************************************
// == Type ========================================================================
declare module '@tanstack/react-router' { interface Register { router: typeof router; } }

// == Constant ====================================================================
const router = createRouter({ routeTree });

// == Component ===================================================================
const App = () => <RouterProvider router={router} />;

// == Export ======================================================================
export default App;
