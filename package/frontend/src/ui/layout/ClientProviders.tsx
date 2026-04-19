import { createTheme, CssBaseline, GlobalStyles, ThemeProvider, type Theme } from '@mui/material';
import { StyledEngineProvider } from '@mui/material/styles';
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
 <StyledEngineProvider enableCssLayer>
  <GlobalStyles styles='@layer theme, base, mui, components, utilities;' />
  <ThemeProvider theme={darkTheme}>
   <CssBaseline />
   <AuthProvider>
    <LocaleProvider>
     {children}
    </LocaleProvider>
   </AuthProvider>
  </ThemeProvider>
 </StyledEngineProvider>;
