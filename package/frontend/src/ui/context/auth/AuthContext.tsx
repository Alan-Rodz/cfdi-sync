import { createContext } from 'react';

import type { LoginData, Profile, RegisterProfileData } from 'common';

// ********************************************************************************
// == Type ========================================================================
type State = {
 isAuthenticated: boolean;
 isLoading: boolean;
 error: string | null;
 login: (data: LoginData) => Promise<void>;
 logout: () => void;
 profile: Profile | null;
 register: (data: RegisterProfileData) => Promise<void>;
 token: string | null;
};

// == Context =====================================================================
export const AuthContext = createContext<State | null>(null);
