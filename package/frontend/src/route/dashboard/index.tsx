import { Box, Typography } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';

import { frontendRoutes } from 'common';

// ********************************************************************************
// == Component ===================================================================
const DashboardPage = () =>
 <Box sx={{ padding: '1em' }}>
  <Typography>Dashboard Hello!</Typography>
 </Box>;

// == Export ======================================================================
export const Route = createFileRoute(`${frontendRoutes.authed.dashboard.index}/`)({ component: DashboardPage });
