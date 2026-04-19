import { createContext } from 'react';

// ********************************************************************************
// == Type ========================================================================
type State = {
 isLoading: boolean;
 error: string | null;
 login: (email: string, password: string) => Promise<void>;
 logout: () => void;
 register: (email: string, password: string, passwordConfirmation: string) => Promise<void>;
};

// == Context =====================================================================
export const AuthContext = createContext<State | null>(null);
