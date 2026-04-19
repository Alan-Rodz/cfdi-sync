import { Box, type BoxProps } from '@mui/material';
import type { FC, PropsWithChildren } from 'react';

// ********************************************************************************
// == Type ========================================================================
type Props = {
 id?: string;
 sx?: BoxProps['sx'];
} & PropsWithChildren;

// == Component ===================================================================
export const Flex: FC<Props> = ({ children, id, sx }) =>
 <Box id={id ?? ''} sx={{ display: 'flex', gap: '1em', ...sx }}>
  {children}
 </Box>;
