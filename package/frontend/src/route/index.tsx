import { createFileRoute } from '@tanstack/react-router';

import { frontendRoutes } from 'common';

// ********************************************************************************
// == Component ===================================================================
const LandingPage = () =>
 <div className='p-8'>
  <h1>Welcome!</h1>
 </div>;

// == Export ======================================================================
export const Route = createFileRoute(frontendRoutes.nonAuthed.landing_page)({ component: LandingPage });
