// ********************************************************************************
// == Type ========================================================================
export type ApiResponse<T = null> = {
 data?: T;
 message: string;
 supabaseAccessToken?: string;
 token?: string;
}

// == Api Route ===================================================================
export const backendApiRoutes = {
 auth: {
  login: '/auth/login',
  me: '/auth/me',
  profile: '/auth/profile',
  register: '/auth/register',
 },
}
