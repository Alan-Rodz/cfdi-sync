import { createFileRoute } from '@tanstack/react-router';

import { webRouter } from '@/constant/route';

// ********************************************************************************
// == Component ===================================================================
const LandingPage = () =>
 <div className='p-8'>
  <h1>Welcome!</h1>
 </div>;

// == Export ======================================================================
export const Route = createFileRoute(webRouter.nonAuthed.landing_page)({ component: LandingPage });
