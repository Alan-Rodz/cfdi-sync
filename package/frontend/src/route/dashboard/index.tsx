import { Box, Typography } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';

import { frontendRoutes } from 'common';

import { ensureProfileIs } from '../guard';

// ********************************************************************************
// == Component ===================================================================
const DashboardPage = () =>
 <Box sx={{ p: 8 }}>
  <Typography variant='h3'>Dashboard</Typography>
 </Box>;

// == Export ======================================================================
export const Route = createFileRoute(`${frontendRoutes.authed.dashboard.index}/`)({
 beforeLoad: ensureProfileIs('loggedIn', frontendRoutes.nonAuthed.login.index),
 component: DashboardPage,
});
