import { Box } from '@mui/material';
import type { FC } from 'react';

import { WEBSITE_NAME } from '@/constant/website';

// ********************************************************************************
// == Component ===================================================================
export const ApplicationFooter: FC = () =>
 <Box
  component='footer'
  sx={{
   borderTop: 1,
   borderColor: 'divider',
   display: 'flex',
   justifyContent: 'center',
   p: 2,
   textAlign: 'center',
  }}
 >
  <Box>© {new Date().getFullYear()} {WEBSITE_NAME}</Box>
 </Box>;
