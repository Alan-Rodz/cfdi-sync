import { Button } from '@mui/material';
import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import { frontendRoutes } from 'common';

// ********************************************************************************
// == Component ===================================================================
export const Route = createRootRoute({
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
