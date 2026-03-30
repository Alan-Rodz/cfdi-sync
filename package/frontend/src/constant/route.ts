
// ********************************************************************************
// == Constant ====================================================================
export const REDIRECT_KEYWORD = 'redirect';

// == Web =========================================================================
const apiRouter = {} as const;

export const webRouter = {
 api: apiRouter,

 authed: {
  dashboard: {
   index: `/dashboard`,
  },
 },

 nonAuthed: {
  landing_page: '/',
  login: {
   index: '/login',
   redirect: (redirectPath: string) => `/login?${REDIRECT_KEYWORD}=${redirectPath}`,
  },
  logout: '/logout',
  privacy_policy: `/privacy_policy`,
  recover_password: '/recover_password',
  redirect: (redirectPath: string) => `/r?${REDIRECT_KEYWORD}=${redirectPath}`,
  register: '/register',
  terms_and_conditions: `/terms_and_conditions`,
 },
} as const;
