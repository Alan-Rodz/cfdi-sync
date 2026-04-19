import { englishTranslationFunction, LocaledTranslationFn, LoginData, Profile, RegisterProfileData, ResponseStatus } from 'common';

import { LoggerPort } from '../../logger/type';
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
 private readonly loggerPort: LoggerPort | null;
 private readonly profileAuthPort: ProfileAuthPort;
 private readonly profileRepositoryPort: ProfileRepositoryPort;
 private readonly t: LocaledTranslationFn;

 // -- Initialization -------------------------------------------------------------
 constructor(profileAuthPort: ProfileAuthPort, profileRepositoryPort: ProfileRepositoryPort, t: LocaledTranslationFn = englishTranslationFunction, loggerPort: LoggerPort | null = null) {
  this.loggerPort = loggerPort;
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
  } catch (error) {
   await this.safeLogError('#cc8c4dc9 Failed to fetch profile during login', error);
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
  await this.safeLogInfo('#4649f23e Login successful', { profileId: profile.id });
  return { data: profile, message: this.t('auth.login_successful'), status: ResponseStatus.SUCCESS, token };
 }

 public async register(data: RegisterProfileData, createToken: CreateTokenFn): Promise<ServiceResult<Profile>> {
  const { email } = data;
  let existing = false;

  try {
   existing = await this.profileRepositoryPort.isEmailRegistered(email);
  } catch (error) {
   await this.safeLogError('#58a94e76 Failed to check email before registration', error);
   return { data: null, message: this.t('auth.registration_failed'), status: ResponseStatus.BAD_REQUEST };
  }

  if (existing) {
   return { data: null, message: this.t('auth.registration_failed'), status: ResponseStatus.CONFLICT };
  } /* else -- profile doesn't exist yet */

  const signUpResult = await this.profileAuthPort.signUpWithPassword(data);
  if (!signUpResult.profileId) {
   return { data: null, message: signUpResult.errorMessage || this.t('auth.registration_failed'), status: ResponseStatus.BAD_REQUEST };
  } /* else -- user created successfully */

  const profile = await this.profileRepositoryPort.findProfileById(signUpResult.profileId);
  if (!profile) {
   return { data: null, message: this.t('auth.registration_failed'), status: ResponseStatus.BAD_REQUEST };
  } /* else -- profile created successfully */

  const token = createToken({ email: profile.email, profileId: profile.id });
  return { data: profile, message: this.t('auth.registration_successful'), status: ResponseStatus.CREATED, token };
 }

 public async getCurrentProfile(profileId: Profile['id']): Promise<ServiceResult<Profile>> {
  let profile: Profile | null = null;

  try {
   profile = await this.profileRepositoryPort.findProfileById(profileId);
  } catch (error) {
   await this.safeLogError('#f96251d3 Failed to fetch current profile', error);
   return { data: null, message: this.t('auth.profile_not_found'), status: ResponseStatus.NOT_FOUND };
  }

  if (!profile) {
   return { data: null, message: this.t('auth.profile_not_found'), status: ResponseStatus.NOT_FOUND };
  } /* else -- profile found */

  return { data: profile, message: this.t('auth.login_successful'), status: ResponseStatus.SUCCESS };
 }

 // -- Private --------------------------------------------------------------------
 private async safeLogError(message: string, error: unknown) {
  await this.loggerPort?.safeLogError(message, error);
 }

 private async safeLogInfo(message: string, context: Record<string, unknown>) {
  try {
   await this.loggerPort?.info(message, { context });
  } catch (error) {
   await this.safeLogError('#16f119c5 Failed to log login success', error);
  }
 }
}
