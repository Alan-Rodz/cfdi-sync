import { LoginData, Profile, RegisterProfileData } from 'common';

// ********************************************************************************
// == Type ========================================================================
export type ProfileAuthSignInResult = {
 authenticated: boolean;
};

export type ProfileAuthSignUpResult = {
 errorMessage: string | null;
 profileId: Profile['id'] | null;
};

export type ProfileAuthPort = {
 signInWithPassword(data: LoginData): Promise<ProfileAuthSignInResult>;
 signUpWithPassword(data: RegisterProfileData): Promise<ProfileAuthSignUpResult>;
};

export type ProfileRepositoryCreateInput = Pick<Profile, 'email' | 'id'>;

export type ProfileRepositoryPort = {
 findProfileByEmail(email: Profile['email']): Promise<Profile | null>;
 findProfileById(profileId: Profile['id']): Promise<Profile | null>;
 isEmailRegistered(email: Profile['email']): Promise<boolean>;
};
