import { englishTranslationFunction, LocaledTranslationFn, LoginData, Profile, RegisterProfileData, ResponseStatus } from 'common';

import { LoggerPort } from '../../logger/type';
import { ServiceResult } from '../../type';
import { ProfileAuthPort, ProfileRepositoryFactoryPort, ProfileRepositoryPort } from './type';

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
 private readonly loggerPort: LoggerPort | null;
 private readonly profileAuthPort: ProfileAuthPort;
 private readonly profileRepositoryFactoryPort: ProfileRepositoryFactoryPort;
 private readonly t: LocaledTranslationFn;

 // -- Initialization -------------------------------------------------------------
 constructor(profileAuthPort: ProfileAuthPort, profileRepositoryFactoryPort: ProfileRepositoryFactoryPort, t: LocaledTranslationFn = englishTranslationFunction, loggerPort: LoggerPort | null = null) {
  this.loggerPort = loggerPort;
  this.profileAuthPort = profileAuthPort;
  this.profileRepositoryFactoryPort = profileRepositoryFactoryPort;
  this.t = t;
 }

 // -- Public ---------------------------------------------------------------------
 public async login(data: LoginData, createToken: CreateTokenFn): Promise<ServiceResult<Profile>> {
  const { email, password } = data;
  const credentials = { email, password };

  const signInResult = await this.profileAuthPort.signInWithPassword(credentials);
  if (!signInResult.authenticated || !signInResult.profileId || !signInResult.supabaseAccessToken) {
   return { data: null, message: this.t('auth.invalid_credentials'), status: ResponseStatus.UNAUTHORIZED };
  } /* else -- authentication successful */

  const repository = this.profileRepositoryFactoryPort.forAuthenticatedRequest(signInResult.supabaseAccessToken);
  const profile = await repository.findProfileById(signInResult.profileId);
  if (!profile) {
   return { data: null, message: this.t('auth.profile_not_found'), status: ResponseStatus.NOT_FOUND };
  } /* else -- profile found */

  const token = createToken({ email: profile.email, profileId: profile.id });
  await this.safeLogInfo('#4649f23e Login successful', { profileId: profile.id });
  return { data: profile, message: this.t('auth.login_successful'), status: ResponseStatus.SUCCESS, supabaseAccessToken: signInResult.supabaseAccessToken, token };
 }

 public async register(data: RegisterProfileData, createToken: CreateTokenFn): Promise<ServiceResult<Profile>> {
  const signUpResult = await this.profileAuthPort.signUpWithPassword(data);
  if (!signUpResult.profileId || !signUpResult.supabaseAccessToken) {
   return { data: null, message: signUpResult.errorMessage || this.t('auth.registration_failed'), status: ResponseStatus.BAD_REQUEST };
  } /* else -- user created successfully */

  const repository = this.profileRepositoryFactoryPort.forAuthenticatedRequest(signUpResult.supabaseAccessToken);
  const profile = await repository.findProfileById(signUpResult.profileId);
  if (!profile) {
   return { data: null, message: this.t('auth.registration_failed'), status: ResponseStatus.BAD_REQUEST };
  } /* else -- profile created successfully */

  const token = createToken({ email: profile.email, profileId: profile.id });
  return { data: profile, message: this.t('auth.registration_successful'), status: ResponseStatus.CREATED, supabaseAccessToken: signUpResult.supabaseAccessToken, token };
 }

 public async getCurrentProfile(profileId: Profile['id'], repository: ProfileRepositoryPort): Promise<ServiceResult<Profile>> {
  let profile: Profile | null = null;

  try {
   profile = await repository.findProfileById(profileId);
  } catch (error) {
   await this.safeLogError('#f96251d3 Failed to fetch current profile', error);
   return { data: null, message: this.t('auth.profile_not_found'), status: ResponseStatus.NOT_FOUND };
  }

  if (!profile) {
   return { data: null, message: this.t('auth.profile_not_found'), status: ResponseStatus.NOT_FOUND };
  } /* else -- profile found */

  return { data: profile, message: this.t('auth.login_successful'), status: ResponseStatus.SUCCESS };
 }

 public async patchProfileName(profileId: Profile['id'], name: Profile['name'], repository: ProfileRepositoryPort): Promise<ServiceResult<Profile>> {
  if (!name.trim()) {
   this.loggerPort?.info(`#1964cbf3 Invalid profile name provided ${profileId} - ${name}`);
   return { data: null, message: this.t('entity.profile.update_profile_failed'), status: ResponseStatus.BAD_REQUEST };
  } /* else -- valid name */

  let profile: Profile | null = null;
  try {
   profile = await repository.updateProfileName(profileId, name.trim());
  } catch (error) {
   await this.safeLogError('#5afe86f3 Failed to patch profile name', error);
   return { data: null, message: this.t('entity.profile.update_profile_failed'), status: ResponseStatus.BAD_REQUEST };
  }

  if (!profile) {
   return { data: null, message: this.t('auth.profile_not_found'), status: ResponseStatus.NOT_FOUND };
  } /* else -- profile updated */

  return { data: profile, message: this.t('auth.registration_successful'), status: ResponseStatus.SUCCESS };
 }

 // -- Private --------------------------------------------------------------------
 private async safeLogError(message: string, error: unknown) {
  await this.loggerPort?.safeLogError(message, error);
 }

 private async safeLogInfo(message: string, context: Record<string, unknown>) {
  try {
   await this.loggerPort?.info(message, { context });
  } catch (error) {
   await this.safeLogError('#48e48047 Failed to log', error);
  }
 }
}
