import { Box, Typography } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';

import { frontendRoutes } from 'common';

// ********************************************************************************
// == Component ===================================================================
const LandingPage = () =>
 <Box sx={{ padding: '1em' }}>
  <Typography>Welcome!</Typography>
 </Box>;

// == Export ======================================================================
export const Route = createFileRoute(frontendRoutes.nonAuthed.landing_page)({ component: LandingPage });
