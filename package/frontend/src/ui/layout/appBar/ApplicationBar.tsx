import { Box, Button } from '@mui/material';
import { Link } from '@tanstack/react-router';
import type { FC } from 'react';

import { frontendRoutes } from 'common';

import { useAuth } from '@/ui/hook/useAuth';

// ********************************************************************************
// == Component ===================================================================
export const ApplicationBar: FC = () => {
 const { isAuthenticated } = useAuth();

 // -- UI -------------------------------------------------------------------------
 return (
  <Box
   component='nav'
   sx={{
    borderBottom: 1,
    borderColor: 'divider',
    display: 'flex',
    gap: 2,
    justifyContent: 'flex-end',
    p: 2,
   }}
  >
   <Link to={frontendRoutes.nonAuthed.landing_page}><Button size='small'>Landing</Button></Link>
   {
    isAuthenticated
     ? <Link to={frontendRoutes.nonAuthed.logout}><Button size='small'>Log out</Button></Link>
     : <Link to={frontendRoutes.nonAuthed.login.index}><Button size='small'>Login</Button></Link>
   }
  </Box>
 );
};
