import { Box, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import { Link } from '@tanstack/react-router';
import type { FC } from 'react';

import { frontendRoutes } from 'common';

import { appColors } from '@/ui/constant/color';
import { appIcons } from '@/ui/constant/icon';
import { useAuth } from '@/ui/hook/useAuth';
import type { DrawerDisclosure } from '@/ui/hook/useDrawerDisclosure';
import { useResponsive } from '@/ui/hook/useResponsive';
import { useLocale } from '../hook/useLocale';

// ********************************************************************************
// == Type ========================================================================
type Props = {
 drawerDisclosure: DrawerDisclosure;
};

// == Constant ====================================================================
const OPEN_DRAWER_WIDTH = 240;
const CLOSED_DRAWER_WIDTH = 65;


// == Component ===================================================================
export const Sidebar: FC<Props> = ({ drawerDisclosure }) => {
 const { isDrawerOpen, onDrawerOpen, onDrawerClose } = drawerDisclosure;
 const isDesktop = useResponsive('up', 'lg');

 // -- UI -------------------------------------------------------------------------
 if (isDesktop) {
  return (
   <Box
    sx={{
     backgroundColor: appColors.darPaperBackground,
     display: 'flex',
     flexDirection: 'column',
     flexShrink: 0,
     overflow: 'hidden',
     transition: 'width 0.2s',
     width: isDrawerOpen ? OPEN_DRAWER_WIDTH : CLOSED_DRAWER_WIDTH,
    }}
   >
    <Box sx={{ display: 'flex', justifyContent: isDrawerOpen ? 'flex-end' : 'center', p: 1 }}>
     <IconButton onClick={isDrawerOpen ? onDrawerClose : onDrawerOpen} sx={{ color: appColors.white }}>
      {isDrawerOpen ? appIcons.arrowLeft() : appIcons.menu()}
     </IconButton>
    </Box>
    <DrawerItems isOpen={isDrawerOpen} onClose={() => { /* desktop: keep open */ }} />
   </Box>
  );
 }

 return (
  <Drawer
   anchor='left'
   open={isDrawerOpen}
   onClose={onDrawerClose}
   sx={{ '& .MuiDrawer-paper': { backgroundColor: appColors.darPaperBackground, width: OPEN_DRAWER_WIDTH } }}
  >
   <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
    <IconButton onClick={onDrawerClose} sx={{ color: appColors.white }}>
     {appIcons.arrowLeft()}
    </IconButton>
   </Box>
   <DrawerItems isOpen={true} onClose={onDrawerClose} />
  </Drawer>
 );
};

// ================================================================================
const DrawerItems: FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
 const { isAuthenticated } = useAuth();
 const { t } = useLocale();

 // -- UI -------------------------------------------------------------------------
 const menuItems = [
  { icon: appIcons.profile, label: t('common.my_profile'), href: frontendRoutes.nonAuthed.landing_page },
 ];
 return (
  <List sx={{ padding: 0 }}>
   {menuItems.map((item) => (
    <Link key={item.label} to={item.href} onClick={onClose}>
     <Tooltip disableHoverListener={isOpen} placement='right' title={item.label}>
      <ListItem disablePadding>
       <ListItemButton sx={{ minHeight: 48, color: appColors.white, '&:hover': { backgroundColor: appColors.darkHover } }}>
        <ListItemIcon sx={{ color: appColors.white, minWidth: isOpen ? 40 : 'unset' }}>
         {item.icon()}
        </ListItemIcon>
        {isOpen && <ListItemText primary={item.label} sx={{ color: appColors.white }} />}
       </ListItemButton>
      </ListItem>
     </Tooltip>
    </Link>
   ))}

   {isAuthenticated && (
    <Link to={frontendRoutes.nonAuthed.logout} onClick={onClose}>
     <Tooltip disableHoverListener={isOpen} placement='right' title='Log out'>
      <ListItem disablePadding>
       <ListItemButton sx={{ minHeight: 48, color: appColors.white, '&:hover': { backgroundColor: appColors.darkHover } }}>
        <ListItemIcon sx={{ color: appColors.white, minWidth: isOpen ? 40 : 'unset' }}>
         {appIcons.logout()}
        </ListItemIcon>
        {isOpen && <ListItemText primary='Log out' sx={{ color: appColors.white }} />}
       </ListItemButton>
      </ListItem>
     </Tooltip>
    </Link>
   )}
  </List>
 );
};
