import { createFileRoute, Outlet } from '@tanstack/react-router';

import { frontendRoutes } from 'common';

import { ensureProfileIs } from './guard';

// ********************************************************************************
// == Component ===================================================================
const DashboardShell = () =>
 <Outlet />;

// == Export ======================================================================
export const Route = createFileRoute(frontendRoutes.authed.dashboard.index)({
 beforeLoad: ensureProfileIs('loggedIn', frontendRoutes.nonAuthed.login.index),
 component: DashboardShell,
});
