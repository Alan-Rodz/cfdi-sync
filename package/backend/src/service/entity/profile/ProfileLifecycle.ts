import { englishTranslationFunction, LocaledTranslationFn, LoginData, Profile, RegisterProfileData, ResponseStatus } from 'common';

import { ServiceResult } from '../../type';
import { ProfileAuthPort, ProfileRepositoryPort } from './type';

// ********************************************************************************
// == Type ========================================================================
type TokenPayload = {
 email: Profile['email'];
 profileId: Profile['id'];
};

type CreateTokenFn = (payload: TokenPayload) => string;

// == Service =====================================================================
export class ProfileLifecycle {
 // -- Attribute ------------------------------------------------------------------
 private readonly profileAuthPort: ProfileAuthPort;
 private readonly profileRepositoryPort: ProfileRepositoryPort;
 private readonly t: LocaledTranslationFn;

 // -- Initialization -------------------------------------------------------------
 constructor(profileAuthPort: ProfileAuthPort, profileRepositoryPort: ProfileRepositoryPort, t: LocaledTranslationFn = englishTranslationFunction) {
  this.profileAuthPort = profileAuthPort;
  this.profileRepositoryPort = profileRepositoryPort;
  this.t = t;
 }

 // -- Public ---------------------------------------------------------------------
 public async login(data: LoginData, createToken: CreateTokenFn): Promise<ServiceResult<Profile>> {
  const { email, password } = data;
  const credentials = { email, password };
  let profile: Profile | null = null;

  try {
   profile = await this.profileRepositoryPort.findProfileByEmail(email);
  } catch {
   return { data: null, message: this.t('auth.failed_to_fetch_profile'), status: ResponseStatus.ERROR };
  }

  if (!profile) {
   return { data: null, message: this.t('auth.invalid_credentials'), status: ResponseStatus.UNAUTHORIZED };
  } /* else -- profile found */

  const signInResult = await this.profileAuthPort.signInWithPassword(credentials);

  if (!signInResult.authenticated) {
   return { data: null, message: this.t('auth.invalid_credentials'), status: ResponseStatus.UNAUTHORIZED };
  } /* else -- authentication successful */

  const token = createToken({ email: profile.email, profileId: profile.id });
  return { data: profile, message: this.t('auth.login_successful'), status: ResponseStatus.SUCCESS, token };
 }

 public async register(data: RegisterProfileData, createToken: CreateTokenFn): Promise<ServiceResult<Profile>> {
  const { email } = data;
  let existing = false;

  try {
   existing = await this.profileRepositoryPort.isEmailRegistered(email);
  } catch {
   return { data: null, message: this.t('auth.registration_failed'), status: ResponseStatus.BAD_REQUEST };
  }

  if (existing) {
   return { data: null, message: this.t('auth.registration_failed'), status: ResponseStatus.CONFLICT };
  } /* else -- profile doesn't exist yet */

  const signUpResult = await this.profileAuthPort.signUpWithPassword(data);
  if (!signUpResult.profileId) {
   return { data: null, message: signUpResult.errorMessage || this.t('auth.registration_failed'), status: ResponseStatus.BAD_REQUEST };
  } /* else -- user created successfully */

  let profile: Profile;
  try {
   profile = await this.profileRepositoryPort.createProfile({
    email,
    id: signUpResult.profileId,
   });
  } catch {
   return { data: null, message: this.t('auth.failed_to_create_profile'), status: ResponseStatus.BAD_REQUEST };
  }

  const token = createToken({ email: profile.email, profileId: profile.id });
  return { data: profile, message: this.t('auth.registration_successful'), status: ResponseStatus.CREATED, token };
 }

 public async getCurrentProfile(profileId: Profile['id']): Promise<ServiceResult<Profile>> {
  let profile: Profile | null = null;

  try {
   profile = await this.profileRepositoryPort.findProfileById(profileId);
  } catch {
   return { data: null, message: this.t('auth.profile_not_found'), status: ResponseStatus.NOT_FOUND };
  }

  if (!profile) {
   return { data: null, message: this.t('auth.profile_not_found'), status: ResponseStatus.NOT_FOUND };
  } /* else -- profile found */

  return { data: profile, message: this.t('auth.login_successful'), status: ResponseStatus.SUCCESS };
 }
}
