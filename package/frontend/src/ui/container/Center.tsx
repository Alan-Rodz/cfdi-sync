import { Box, type BoxProps } from '@mui/material';
import type { FC, PropsWithChildren } from 'react';

// ********************************************************************************
// == Type ========================================================================
type Props = {
 id?: string;
 sx?: BoxProps['sx'];
} & PropsWithChildren;

// == Component ===================================================================
export const Center: FC<Props> = ({ children, id = '', sx }) =>
 <Box
  id={id}
  sx={{ alignItems: 'center', display: 'flex', gap: '1em', justifyContent: 'center', ...sx }}
 >
  {children}
 </Box>;
