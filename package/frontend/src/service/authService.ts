import { backendApiRoutes, logConsoleError, RequestContentType, RequestHeader, RequestMethod, type ApiResponse, type LoginData, type PatchProfileNameData, type Profile, type RegisterProfileData } from 'common';

import { WEBSITE_NAME } from '@/constant/website';

// ********************************************************************************
// == Type ========================================================================
export type ProfileResponse = ApiResponse<Profile>;

// == Constant ====================================================================
const API_BASE = import.meta.env.VITE_BACKEND_URL!;
const PROFILE_KEY = `${WEBSITE_NAME}-authProfile`;
const SUPABASE_ACCESS_TOKEN_KEY = `${WEBSITE_NAME}-supabaseAccessToken`;
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
  if (answer.data && answer.supabaseAccessToken && answer.token) {
   authService.saveSupabaseAccessToken(answer.supabaseAccessToken);
   authService.saveToken(answer.token);
   authService.saveProfile(answer.data);
  } /* else -- no data or no token */

  return answer;
 },

 logout: (): void => {
  authService.clearSupabaseAccessToken();
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
  if (json.data && json.supabaseAccessToken && json.token) {
   authService.saveSupabaseAccessToken(json.supabaseAccessToken);
   authService.saveToken(json.token);
   authService.saveProfile(json.data);
  } /* else -- no data or no token */

  return json;
 },

 updateProfileName: async (data: PatchProfileNameData): Promise<ProfileResponse> => {
  const response = await authService.fetchWithAuth(backendApiRoutes.auth.profile, {
   body: JSON.stringify(data),
   headers: { [RequestHeader.ContentType]: RequestContentType.Json },
   method: RequestMethod.PATCH,
  });

  if (!response.ok) {
   const error = await response.json();
   logConsoleError(error, '#188d8fe6 - Update profile failed');
   throw error;
  } /* else -- successful request */

  const json = await response.json() as ProfileResponse;
  if (json.data) {
   authService.saveProfile(json.data);
  } /* else -- no profile data */

  return json;
 },

 // -- Authenticated Request ------------------------------------------------------
 fetchWithAuth: async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  const supabaseAccessToken = authService.getSupabaseAccessToken();
  const token = authService.getToken();

  return fetch(`${API_BASE}${endpoint}`, {
   ...options,
   headers: {
    ...options.headers,
    ...(supabaseAccessToken && { [RequestHeader.SupabaseAccessToken]: supabaseAccessToken }),
    ...(token && { [RequestHeader.Authorization]: `Bearer ${token}` }),
   }
  });
 },

 // -- Profile --------------------------------------------------------------------
 clearProfile: (): void => localStorage.removeItem(PROFILE_KEY),
 getProfile: (): Profile | null => {
  const profile = localStorage.getItem(PROFILE_KEY);
  return profile ? JSON.parse(profile) : null;
 },
 saveProfile: (profile: Profile): void => localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)),

 // -- Supabase Access Token ------------------------------------------------------
 clearSupabaseAccessToken: (): void => localStorage.removeItem(SUPABASE_ACCESS_TOKEN_KEY),
 getSupabaseAccessToken: (): string | null => localStorage.getItem(SUPABASE_ACCESS_TOKEN_KEY),
 saveSupabaseAccessToken: (supabaseAccessToken: string): void => localStorage.setItem(SUPABASE_ACCESS_TOKEN_KEY, supabaseAccessToken),

 // -- Token ----------------------------------------------------------------------
 clearToken: (): void => localStorage.removeItem(TOKEN_KEY),
 getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
 saveToken: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
};
