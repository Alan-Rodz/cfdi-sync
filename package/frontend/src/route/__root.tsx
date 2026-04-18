import { Button } from '@mui/material';
import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import { webRouter } from '@/constant/route';

// ********************************************************************************
// == Component ===================================================================
export const Route = createRootRoute({
 component: () => (
  <>
   <div>
    <nav className='border-[#ccc] border-b p-4'>
     <Link to={webRouter.nonAuthed.landing_page}><Button>Landing page</Button></Link>
     <Link to={webRouter.nonAuthed.login.index}><Button>Login</Button></Link>
    </nav>
   </div>
   <Outlet />
   <TanStackRouterDevtools />
  </>
 ),
});
