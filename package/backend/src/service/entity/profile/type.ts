import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from 'common';
import { LoginData, Profile, RegisterProfileData } from 'common';

// ********************************************************************************
// == Type ========================================================================
export type ProfileRepositoryClient = string /*token*/ | SupabaseClient<Database>;

export type ProfileAuthSignInResult = {
 authenticated: boolean;
 profileId: Profile['id'] | null;
 supabaseAccessToken: string | null;
};

export type ProfileAuthSignUpResult = {
 errorMessage: string | null;
 profileId: Profile['id'] | null;
 supabaseAccessToken: string | null;
};

export type ProfileAuthPort = {
 signInWithPassword(data: LoginData): Promise<ProfileAuthSignInResult>;
 signUpWithPassword(data: RegisterProfileData): Promise<ProfileAuthSignUpResult>;
};

export type ProfileRepositoryCreateInput = Pick<Profile, 'email' | 'id'>;

export type ProfileRepositoryPort = {
 findProfileByEmail(email: Profile['email'], profileRepositoryClient: ProfileRepositoryClient): Promise<Profile | null>;
 findProfileById(profileId: Profile['id'], profileRepositoryClient: ProfileRepositoryClient): Promise<Profile | null>;
 isEmailRegistered(email: Profile['email']): Promise<boolean>;
 updateProfileName(profileId: Profile['id'], name: Profile['name'], profileRepositoryClient: ProfileRepositoryClient): Promise<Profile | null>;
};
