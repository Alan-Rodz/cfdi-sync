
import { type PropsWithChildren, useCallback, useEffect, useState } from 'react';

import type { LoginData, PatchProfileNameData, Profile, RegisterProfileData } from 'common';

import { authService } from '@/service/authService';
import { useLocale } from '@/ui/hook/useLocale';

import { AuthContext } from './AuthContext';

// ********************************************************************************
// == Component ===================================================================
export const AuthProvider = ({ children }: PropsWithChildren) => {
 const { t } = useLocale();

 // -- State ----------------------------------------------------------------------
 const [error, setError] = useState<string | null>(null);
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [isLoading, setIsLoading] = useState(true);
 const [profile, setProfile] = useState<Profile | null>(null);
 const [token, setToken] = useState<string | null>(null);

 // -- Effect ---------------------------------------------------------------------
 useEffect(() => {
  const initAuth = async () => {
   try {
    const storedToken = authService.getToken();
    const storedSupabaseAccessToken = authService.getSupabaseAccessToken();
    const storedProfile = authService.getProfile();

    if (storedSupabaseAccessToken && storedToken && storedProfile) {
     setToken(storedToken);
     setProfile(storedProfile);
     setIsAuthenticated(true);

     const currentUser = await authService.getCurrentUser();
     if (currentUser) {
      setProfile(currentUser);
      authService.saveProfile(currentUser);
     } else {
      authService.logout();
      setIsAuthenticated(false);
      setToken(null);
      setProfile(null);
     }
    }
   } catch (err) {
    console.error('#0602e7cb Auth initialization error:', err);
    authService.logout();
   } finally {
    setIsLoading(false);
   }
  };

  initAuth();
 }, []);

 // -- Handler --------------------------------------------------------------------
 const handleLogin = useCallback(
  async (data: LoginData) => {
   setIsLoading(true);
   setError(null);

   try {
    const response = await authService.login(data);
    if (response.data && response.supabaseAccessToken && response.token) {
     setProfile(response.data);
     setToken(response.token);
     setIsAuthenticated(true);
    } /* else -- no data or no token */

   } catch (err) {
    const errorMessage = err instanceof Error ? err.message : t('auth.login_failed');
    setError(errorMessage);
    throw err;
   } finally {
    setIsLoading(false);
   }
  },
  [t]
 );

 const handleRegister = useCallback(
  async (data: RegisterProfileData) => {
   setIsLoading(true);
   setError(null);

   try {
    const response = await authService.register(data);
    if (response.data && response.supabaseAccessToken && response.token) {
     setProfile(response.data);
     setToken(response.token);
     setIsAuthenticated(true);
    } /* else -- no data or no token */

   } catch (err) {
    const errorMessage = err instanceof Error ? err.message : t('auth.registration_failed');
    setError(errorMessage);
    throw err;
   } finally {
    setIsLoading(false);
   }
  }, [t]);

 const handleLogout = useCallback(() => {
  authService.logout();
  setIsAuthenticated(false);
  setToken(null);
  setProfile(null);
  setError(null);
 }, []);

 const handleUpdateProfileName = useCallback(
  async (data: PatchProfileNameData) => {
   setIsLoading(true);
   setError(null);

   try {
    const response = await authService.updateProfileName(data);

    if (response.data) {
     setProfile(response.data);
    } /* else -- nothing to update */

   } catch (err) {
    const errorMessage = err instanceof Error ? err.message : t('auth.registration_failed');
    setError(errorMessage);
    throw err;
   } finally {
    setIsLoading(false);
   }
  },
  [t]
 );

 // -- UI -------------------------------------------------------------------------
 return (
  <AuthContext.Provider value={{
   error,
   isAuthenticated,
   isLoading,
   login: handleLogin,
   logout: handleLogout,
   profile,
   register: handleRegister,
   token,
   updateProfileName: handleUpdateProfileName,
  }}>
   {children}
  </AuthContext.Provider>
 );
}
