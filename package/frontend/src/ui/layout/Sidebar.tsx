import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from '@tanstack/react-router';
import type { FC } from 'react';

import { frontendRoutes } from 'common';

import { WEBSITE_NAME } from '@/constant/website';
import { appIcons } from '@/ui/constant/icon';
import { useAuth } from '@/ui/hook/useAuth';
import type { DrawerDisclosure } from '@/ui/hook/useDrawerDisclosure';
import { appColors } from '../constant/color';

// ********************************************************************************
// == Type ========================================================================
type Props = {
 drawerDisclosure: DrawerDisclosure;
};

// == Constant ====================================================================
const DRAWER_WIDTH = 250;

const menuItems = [
 { icon: appIcons.home, label: 'Home', href: frontendRoutes.nonAuthed.landing_page },
 { icon: appIcons.profile, label: 'Profile', href: frontendRoutes.nonAuthed.landing_page },
];

// == Component ===================================================================
export const Sidebar: FC<Props> = ({ drawerDisclosure }) => {
 const { isAuthenticated } = useAuth();

 // -- UI -------------------------------------------------------------------------
 return (
  <Drawer
   anchor='left'
   open={drawerDisclosure.isDrawerOpen}
   onClose={drawerDisclosure.onDrawerClose}
   sx={{
    '& .MuiDrawer-paper': {
     backgroundColor: 'background.paper',
     width: DRAWER_WIDTH,
    },
   }}
  >
   <Box
    role='presentation'
    onClick={drawerDisclosure.onDrawerClose}
    sx={{ padding: '1em' }}
   >
    <Box sx={{ marginBottom: '1em', fontSize: '1.2em', fontWeight: 'bold' }}>
     {WEBSITE_NAME}
    </Box>

    <List>
     {menuItems.map((item) => (
      <Link key={item.label} to={item.href}>
       <ListItem disablePadding>
        <ListItemButton>
         <ListItemIcon>
          {item.icon()}
         </ListItemIcon>
         <ListItemText sx={{ color: appColors.white }} primary={item.label} />
        </ListItemButton>
       </ListItem>
      </Link>
     ))}
    </List>

    {
     isAuthenticated && (
      <List sx={{ marginTop: 'auto', paddingTop: '1em', borderTop: '1px solid', borderColor: 'divider' }}>
       <Link to={frontendRoutes.nonAuthed.logout}>
        <ListItem disablePadding>
         <ListItemButton>
          <ListItemIcon>
           {appIcons.logout()}
          </ListItemIcon>
          <ListItemText sx={{ color: appColors.white }} primary='Log out' />
         </ListItemButton>
        </ListItem>
       </Link>
      </List>
     )
    }
   </Box>
  </Drawer>
 );
};
