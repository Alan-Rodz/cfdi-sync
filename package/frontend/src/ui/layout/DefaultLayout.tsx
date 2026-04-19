import { Box } from '@mui/material';
import type { FC, PropsWithChildren } from 'react';

import { Center } from '../container/Center';
import { Flex } from '../container/Flex';
import { ApplicationBar } from './appBar/ApplicationBar';
import { ApplicationFooter } from './ApplicationFooter';

// ********************************************************************************
// == Constant ====================================================================
const PAGE_MAX_WIDTH = '1200px';

// == Component ===================================================================
export const DefaultLayout: FC<PropsWithChildren> = ({ children }) =>
 <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
  <ApplicationBar />
  <Center sx={{ flexDirection: 'column' }}>
   <Flex sx={{ flexDirection: 'column', gap: '0em', minHeight: 'calc(100vh - 120px)', maxWidth: PAGE_MAX_WIDTH, width: '100%' }}>
    <Box sx={{ flex: 1, padding: '2em 1em' }}>
     {children}
    </Box>
   </Flex>
  </Center>
  <ApplicationFooter />
 </Box>;
