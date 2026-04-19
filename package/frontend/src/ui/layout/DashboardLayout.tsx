import { Box } from '@mui/material';
import type { FC, PropsWithChildren } from 'react';

import { useDrawerDisclosure } from '../hook/useDrawerDisclosure';
import { ApplicationBar } from './appBar/ApplicationBar';
import { ApplicationFooter } from './ApplicationFooter';
import { Sidebar } from './Sidebar';

// ********************************************************************************
// == Component ===================================================================
export const DashboardLayout: FC<PropsWithChildren> = ({ children }) => {
 const drawerDisclosure = useDrawerDisclosure();

 // -- UI -------------------------------------------------------------------------
 return (
  <Box sx={{ display: 'flex', height: '100vh', width: '100%' }}>
   <Sidebar drawerDisclosure={drawerDisclosure} />
   <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', overflow: 'hidden' }}>
    <ApplicationBar drawerDisclosure={drawerDisclosure} />
    <Box sx={{ flex: 1, overflowY: 'auto', padding: '2em 1.5em' }}>
     {children}
    </Box>
    <ApplicationFooter />
   </Box>
  </Box>
 );
};
