import { Button } from '@mui/material';
import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import { frontendRoutes } from 'common';

import { useAuth } from '@/ui/hook/useAuth';

// ********************************************************************************
// == Type ========================================================================
export type RouterContext = { isAuthenticated: boolean; isLoading: boolean; };

// == Component ===================================================================
const RootLayout = () => {
 const { isAuthenticated } = useAuth();

 // -- UI -------------------------------------------------------------------------
 return (
  <>
   <div>
    <nav className='border-[#ccc] border-b p-4 flex gap-4 justify-end'>
     <Link to={frontendRoutes.nonAuthed.landing_page}><Button>Landing page</Button></Link>
     {
      isAuthenticated
       ? <Link to={frontendRoutes.nonAuthed.logout}><Button>Log out</Button></Link>
       : <Link to={frontendRoutes.nonAuthed.login.index}><Button>Login</Button></Link>
     }
    </nav>
   </div>
   <Outlet />
   <TanStackRouterDevtools />
  </>
 );
};

// == Export ======================================================================
export const Route = createRootRouteWithContext<RouterContext>()({ component: RootLayout });
