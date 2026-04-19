import { createContext } from 'react';

import type { LoginData, PatchProfileNameData, Profile, RegisterProfileData } from 'common';

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
 updateProfileName: (data: PatchProfileNameData) => Promise<void>;
};

// == Context =====================================================================
export const AuthContext = createContext<State | null>(null);
