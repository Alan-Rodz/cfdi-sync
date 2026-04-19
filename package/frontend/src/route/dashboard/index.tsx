import { createFileRoute } from '@tanstack/react-router';

import { frontendRoutes } from 'common';

// ********************************************************************************
// == Component ===================================================================
const DashboardPage = () =>
 <div className='p-8'>
  <h1>Dashboard</h1>
 </div>;

// == Export ======================================================================
export const Route = createFileRoute(`${frontendRoutes.authed.dashboard.index}/`)({ component: DashboardPage });
