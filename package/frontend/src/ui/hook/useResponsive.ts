import { useMediaQuery, useTheme } from '@mui/material';

// ********************************************************************************
export const useResponsive = (query: 'up' | 'down', breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => {
 const theme = useTheme();

 switch (query) {
  case 'up': return useMediaQuery(theme.breakpoints.up(breakpoint));
  case 'down': return useMediaQuery(theme.breakpoints.down(breakpoint));
  default: throw new Error('Invalid useResponsive query');
 }
};
