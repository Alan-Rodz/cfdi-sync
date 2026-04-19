import { redirect } from '@tanstack/react-router';

import type { RouterContext } from './__root';

// ********************************************************************************
// == Type ========================================================================
type AuthState = 'loggedIn' | 'loggedOut';

// == Guard =======================================================================
export const ensureProfileIs = (state: AuthState, redirectPath: string) =>
 ({ context }: { context: RouterContext }) => {
  if (context.isLoading) return;

  if (state === 'loggedIn' && !context.isAuthenticated) throw redirect({ to: redirectPath });
  if (state === 'loggedOut' && context.isAuthenticated) throw redirect({ to: redirectPath });
 };
