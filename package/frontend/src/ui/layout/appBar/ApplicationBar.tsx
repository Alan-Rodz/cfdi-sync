import { Box, IconButton } from '@mui/material';
import type { FC } from 'react';

import { appIcons } from '@/ui/constant/icon';
import type { DrawerDisclosure } from '@/ui/hook/useDrawerDisclosure';
import { useMenuDisclosure } from '@/ui/hook/useMenuDisclosure';

import { AppBarProfileMenu } from './AppBarProfileMenu';

// ********************************************************************************
// == Type ========================================================================
type Props = {
 drawerDisclosure?: DrawerDisclosure;
};

// == Component ===================================================================
export const ApplicationBar: FC<Props> = ({ drawerDisclosure }) => {
 const profileMenuDisclosure = useMenuDisclosure();

 // -- UI -------------------------------------------------------------------------
 return (
  <Box
   component='nav'
   sx={{
    alignItems: 'center',
    borderBottom: 1,
    borderColor: 'divider',
    display: 'flex',
    gap: 2,
    justifyContent: 'space-between',
    p: 2,
   }}
  >
   {drawerDisclosure && (
    <IconButton
     size='small'
     onClick={drawerDisclosure.onDrawerOpen}
     sx={{ display: { lg: 'none', xs: 'flex' } }}
    >
     {appIcons.menu()}
    </IconButton>
   )}
   <Box sx={{ flex: 1 }} />
   <AppBarProfileMenu disclosure={profileMenuDisclosure} />
  </Box>
 );
};
