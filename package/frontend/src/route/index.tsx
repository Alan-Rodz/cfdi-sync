import { createFileRoute } from '@tanstack/react-router';

import { webRouter } from '@/constant/route';

// ********************************************************************************
// == Component ===================================================================
const LandingPage = () =>
 <div style={{ padding: '2rem' }}>
  <h1>Welcome!</h1>
 </div>;

// == Export ======================================================================
export const Route = createFileRoute(webRouter.nonAuthed.landing_page)({ component: LandingPage });
