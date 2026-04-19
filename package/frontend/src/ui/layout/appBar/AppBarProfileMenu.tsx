import { Button, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuList } from '@mui/material';
import { Link, useNavigate } from '@tanstack/react-router';
import type { FC } from 'react';

import { frontendRoutes } from 'common';

import { appColors } from '@/ui/constant/color';
import { appIcons } from '@/ui/constant/icon';
import { useAuth } from '@/ui/hook/useAuth';
import { useLocale } from '@/ui/hook/useLocale';
import type { MenuDisclosure } from '@/ui/hook/useMenuDisclosure';

// ********************************************************************************
// == Type ========================================================================
type Props = {
 disclosure: MenuDisclosure;
};

// == Component ===================================================================
export const AppBarProfileMenu: FC<Props> = ({ disclosure }) => {
 const { isAuthenticated, logout, profile } = useAuth();
 const navigate = useNavigate();
 const { t } = useLocale();

 // -- Handler ---------------------------------------------------------------------
 const handleLogout = () => {
  logout();
  disclosure.handleCloseMenu();
  navigate({ to: frontendRoutes.nonAuthed.landing_page });
 };

 // -- UI -------------------------------------------------------------------------
 if (!isAuthenticated) {
  return (
   <Link to={frontendRoutes.nonAuthed.login.index}>
    <Button startIcon={appIcons.login()} variant='outlined' size='small'>
     {t('auth.login')}
    </Button>
   </Link>
  );
 }

 return (
  <>
   <IconButton onClick={(e) => disclosure.handleOpenMenu(e.currentTarget)}>
    {appIcons.profile()}
   </IconButton>

   <Menu
    anchorEl={disclosure.menuAnchor}
    anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
    keepMounted
    onClose={disclosure.handleCloseMenu}
    open={disclosure.isMenuOpen}
    sx={{ marginTop: '40px' }}
    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
   >
    {profile && (
     <MenuList sx={{ padding: 0 }}>
      <Link to={frontendRoutes.authed.dashboard.index} style={{ textDecoration: 'none' }}>
       <MenuItem onClick={disclosure.handleCloseMenu}>
        <ListItemIcon>{appIcons.home()}</ListItemIcon>
        <ListItemText sx={{ color: appColors.white }}>Dashboard</ListItemText>
       </MenuItem>
      </Link>
      <Link to={frontendRoutes.authed.dashboard.index} style={{ textDecoration: 'none' }}>
       <MenuItem onClick={disclosure.handleCloseMenu}>
        <ListItemIcon>{appIcons.profile()}</ListItemIcon>
        <ListItemText sx={{ color: appColors.white }}>{t('common.my_profile')}</ListItemText>
       </MenuItem>
      </Link>
      <MenuItem onClick={handleLogout}>
       <ListItemIcon>{appIcons.logout()}</ListItemIcon>
       <ListItemText sx={{ color: appColors.white }}>{t('auth.logout')}</ListItemText>
      </MenuItem>
     </MenuList>
    )}
   </Menu>
  </>
 );
};
