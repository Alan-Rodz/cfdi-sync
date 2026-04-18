import { createFileRoute } from '@tanstack/react-router';

import { webRouter } from '@/constant/route';

// ********************************************************************************
// == Component ===================================================================
const DashboardPage = () =>
 <div className='p-8'>
  <h1>Dashboard</h1>
 </div>;

// == Export ======================================================================
export const Route = createFileRoute(`${webRouter.authed.dashboard.index}/`)({ component: DashboardPage });
