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
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
     <Link to={webRouter.nonAuthed.landing_page}><Button>Landing page</Button></Link>
     <Link to={webRouter.nonAuthed.login.index}><Button>Login</Button></Link>
    </nav>
   </div>
   <Outlet />
   <TanStackRouterDevtools />
  </>
 ),
});
