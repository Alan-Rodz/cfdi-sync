import { useEffect } from 'react';

import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { frontendRoutes } from 'common';

import { useAuth } from '@/ui/hook/useAuth';

import { ensureProfileIs } from './guard';

// ********************************************************************************
// == Component ===================================================================
const LogoutPage = () => {
 const navigate = useNavigate();
 const { logout } = useAuth();

 // -- Effect ---------------------------------------------------------------------
 useEffect(() => {
  logout();
  navigate({ to: frontendRoutes.nonAuthed.landing_page });
 }, [logout, navigate]);

 // -- UI -------------------------------------------------------------------------
 return null;
};

// == Export ======================================================================
export const Route = createFileRoute(frontendRoutes.nonAuthed.logout)({
 beforeLoad: ensureProfileIs('loggedIn', frontendRoutes.nonAuthed.landing_page),
 component: LogoutPage,
});
