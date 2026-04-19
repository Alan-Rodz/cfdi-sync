import { useEffect } from 'react';

import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { frontendRoutes } from 'common';

import { ensureProfileIs } from './guard';

import { useAuth } from '@/ui/hook/useAuth';

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

 return null;
};

// == Export ======================================================================
export const Route = createFileRoute(frontendRoutes.nonAuthed.logout)({
 beforeLoad: ensureProfileIs('loggedIn', frontendRoutes.nonAuthed.landing_page),
 component: LogoutPage,
});
