import { Box, Button, IconButton } from '@mui/material';
import { Link } from '@tanstack/react-router';
import type { FC } from 'react';

import { frontendRoutes } from 'common';

import { appIcons } from '@/ui/constant/icon';
import { useAuth } from '@/ui/hook/useAuth';
import type { DrawerDisclosure } from '@/ui/hook/useDrawerDisclosure';

// ********************************************************************************
// == Type ========================================================================
type Props = {
 drawerDisclosure?: DrawerDisclosure;
};

// == Component ===================================================================
export const ApplicationBar: FC<Props> = ({ drawerDisclosure }) => {
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
    justifyContent: 'space-between',
    alignItems: 'center',
    p: 2,
   }}
  >
   {
    drawerDisclosure && (
     <IconButton
      size='small'
      onClick={drawerDisclosure.onDrawerOpen}
      sx={{ display: { xs: 'flex', md: 'none' } }}
     >
      {appIcons.menu()}
     </IconButton>
    )
   }
   <Box sx={{ flex: 1 }} />
   <Box sx={{ display: 'flex', gap: 1 }}>
    <Link to={frontendRoutes.nonAuthed.landing_page}><Button size='small'>Landing</Button></Link>
    {
     isAuthenticated
      ? <Link to={frontendRoutes.nonAuthed.logout}><Button size='small'>Log out</Button></Link>
      : <Link to={frontendRoutes.nonAuthed.login.index}><Button size='small'>Login</Button></Link>
    }
   </Box>
  </Box>
 );
};
