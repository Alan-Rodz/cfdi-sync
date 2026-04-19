import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import { DefaultLayout } from '@/ui/layout/DefaultLayout';

// ********************************************************************************
// == Type ========================================================================
export type RouterContext = { isAuthenticated: boolean; isLoading: boolean; };

// == Component ===================================================================
const RootLayout = () => {
 // -- UI -------------------------------------------------------------------------
 return (
  <DefaultLayout>
   <Outlet />
   <TanStackRouterDevtools />
  </DefaultLayout>
 );
};

// == Export ======================================================================
export const Route = createRootRouteWithContext<RouterContext>()({ component: RootLayout });
