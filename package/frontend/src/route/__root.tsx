import { Button } from '@mui/material';
import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import { frontendRoutes } from 'common';

// ********************************************************************************
// == Type ========================================================================
export type RouterContext = { isAuthenticated: boolean; isLoading: boolean; };

// == Component ===================================================================
export const Route = createRootRouteWithContext<RouterContext>()({
 component: () => (
  <>
   <div>
    <nav className='border-[#ccc] border-b p-4'>
     <Link to={frontendRoutes.nonAuthed.landing_page}><Button>Landing page</Button></Link>
     <Link to={frontendRoutes.nonAuthed.login.index}><Button>Login</Button></Link>
    </nav>
   </div>
   <Outlet />
   <TanStackRouterDevtools />
  </>
 ),
});
