import { backendApiRoutes, logConsoleError, RequestContentType, RequestHeader, RequestMethod, type ApiResponse, type LoginData, type Profile, type RegisterProfileData } from 'common';

import { WEBSITE_NAME } from '@/constant/website';

// ********************************************************************************
// == Type ========================================================================
export type ProfileResponse = ApiResponse<Profile>;

// == Constant ====================================================================
const API_BASE = import.meta.env.VITE_BACKEND_URL!;
const PROFILE_KEY = `${WEBSITE_NAME}-authProfile`;
const TOKEN_KEY = `${WEBSITE_NAME}-authToken`;

// == Service =====================================================================
export const authService = {
 // -- Auth -----------------------------------------------------------------------
 getCurrentUser: async (): Promise<Profile | null> => {
  const token = authService.getToken();
  if (!token) { return null; }

  try {
   const response = await authService.fetchWithAuth(backendApiRoutes.auth.me);
   if (!response.ok) { return null; }

   const json = await response.json() as ProfileResponse;
   return json.data || null;
  } catch (error) {
   logConsoleError(error, '#a7d6f3fd - Failed to fetch current user');
   return null;
  }
 },

 login: async (loginData: LoginData): Promise<ProfileResponse> => {
  const response = await fetch(`${API_BASE}${backendApiRoutes.auth.login}`, {
   body: JSON.stringify(loginData),
   headers: { [RequestHeader.ContentType]: RequestContentType.Json },
   method: RequestMethod.POST,
  });

  if (!response.ok) {
   const error = await response.json();
   logConsoleError(error, '#cee06566 - Login failed');
   throw error;
  } /* else -- successful request */

  const answer = await response.json() as ProfileResponse;
  if (answer.data && answer.token) {
   authService.saveToken(answer.token);
   authService.saveProfile(answer.data);
  } /* else -- no data or no token */

  return answer;
 },

 logout: (): void => {
  authService.clearToken();
  authService.clearProfile();
 },

 register: async (userData: RegisterProfileData): Promise<ProfileResponse> => {
  const response = await fetch(`${API_BASE}${backendApiRoutes.auth.register}`, {
   body: JSON.stringify(userData),
   headers: { [RequestHeader.ContentType]: RequestContentType.Json },
   method: RequestMethod.POST,
  });

  if (!response.ok) {
   const error = await response.json();
   logConsoleError(error, '#ffaad0ae - Registration failed');
   throw error;
  } /* else -- successful request */

  const json = await response.json() as ProfileResponse;
  if (json.data && json.token) {
   authService.saveToken(json.token);
   authService.saveProfile(json.data);
  } /* else -- no data or no token */

  return json;
 },

 // -- Token ----------------------------------------------------------------------
 clearToken: (): void => localStorage.removeItem(TOKEN_KEY),
 getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
 saveToken: (token: string): void => localStorage.setItem(TOKEN_KEY, token),

 // -- Profile --------------------------------------------------------------------
 clearProfile: (): void => localStorage.removeItem(PROFILE_KEY),
 getProfile: (): Profile | null => {
  const profile = localStorage.getItem(PROFILE_KEY);
  return profile ? JSON.parse(profile) : null;
 },
 saveProfile: (profile: Profile): void => localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)),

 // -- Authenticated Request ------------------------------------------------------
 fetchWithAuth: async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  const token = authService.getToken();

  return fetch(`${API_BASE}${endpoint}`, {
   ...options,
   headers: {
    ...options.headers,
    ...(token && { 'Authorization': `Bearer ${token}` })
   }
  });
 }
};
