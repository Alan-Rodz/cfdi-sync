import { createFileRoute } from '@tanstack/react-router';

import { webRouter } from '@/constant/route';

// ********************************************************************************
// == Component ===================================================================
const DashboardPage = () =>
 <div style={{ padding: '2rem' }}>
  <h1>Dashboard</h1>
 </div>;

// == Export ======================================================================
export const Route = createFileRoute(`${webRouter.authed.dashboard.index}/`)({ component: DashboardPage });
