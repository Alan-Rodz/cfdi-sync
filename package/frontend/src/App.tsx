import { createRouter, RouterProvider } from '@tanstack/react-router';

import { routeTree } from './routeTree.gen';
import { useAuth } from './ui/hook/useAuth';

// ********************************************************************************
// == Type ========================================================================
declare module '@tanstack/react-router' { interface Register { router: typeof router; } }

// == Constant ====================================================================
const router = createRouter({ routeTree, context: { isAuthenticated: false, isLoading: true } });

// == Component ===================================================================
const App = () => {
 const { isAuthenticated, isLoading } = useAuth();

 return <RouterProvider router={router} context={{ isAuthenticated, isLoading }} />;
};

// == Export ======================================================================
export default App;
