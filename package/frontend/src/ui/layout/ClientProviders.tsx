import { createTheme, CssBaseline, ThemeProvider, type Theme } from '@mui/material';
import type { FC, PropsWithChildren } from 'react';

import { appColors } from '../constant/color';
import { AuthProvider } from '../context/auth/AuthProvider';
import { LocaleProvider } from '../context/locale/LocaleProvider';

// ********************************************************************************
// == Constant ====================================================================
const darkTheme: Theme = createTheme({
 palette: {
  mode: 'dark',

  background: {
   default: appColors.darkBackground,
   paper: appColors.darPaperBackground,
  },

  divider: appColors.white,

  primary: { main: appColors.white },

  text: {
   primary: appColors.white,
   secondary: appColors.white,
  },
 },

 typography: {
  fontFamily: 'system-ui',
 },
});

// == Component ===================================================================
export const ClientProviders: FC<PropsWithChildren> = ({ children }) =>
 <ThemeProvider theme={darkTheme}>
  <CssBaseline />
  <LocaleProvider>
   <AuthProvider>
    {children}
   </AuthProvider>
  </LocaleProvider>
 </ThemeProvider>;
