import { SupabaseClient } from '@supabase/supabase-js';

import { Database, englishTranslationFunction, LocaledTranslationFn, LoginData, Profile, profileTableColumns, profileTableName, RegisterProfileData, ResponseStatus } from 'common';

import { AuthenticatedService } from '../../AuthenticatedService';
import { ServiceResult } from '../../type';

// ********************************************************************************
// == Type ========================================================================
type TokenPayload = {
 email: Profile['email'];
 profileId: Profile['id'];
};

type CreateTokenFn = (payload: TokenPayload) => string;

// == Service =====================================================================
export class ProfileLifecycle extends AuthenticatedService {
 // -- Attribute ------------------------------------------------------------------
 private readonly t: LocaledTranslationFn;

 // -- Initialization -------------------------------------------------------------
 constructor(client: SupabaseClient<Database>, t: LocaledTranslationFn = englishTranslationFunction) {
  super('ProfileLifecycle');
  this.client = client;
  this.t = t;
 }
 public async initialize(client: SupabaseClient<Database>): Promise<ProfileLifecycle> {
  await this.initializeService(client);
  this.initialized = true;
  return this;
 }

 // -- Public ---------------------------------------------------------------------
 public async login(data: LoginData, createToken: CreateTokenFn): Promise<ServiceResult<Profile>> {
  const { email, password } = data;
  const client = this.getClient();

  const { data: profileObj, error: profileObjError } = await client
   .from(profileTableName)
   .select('*')
   .eq(profileTableColumns.email, email);

  if (profileObjError) {
   return { data: null, message: this.t('auth.failed_to_fetch_profile'), status: ResponseStatus.ERROR };
  } /* else -- profile query completed */

  if (!profileObj || profileObj.length === 0) {
   return { data: null, message: this.t('auth.invalid_credentials'), status: ResponseStatus.UNAUTHORIZED };
  } /* else -- profile found */

  const profile = profileObj[0] as Profile;
  const { data: authedProfile, error: authedProfileError } = await client.auth.signInWithPassword({ email, password });

  if (authedProfileError || !authedProfile) {
   return { data: null, message: this.t('auth.invalid_credentials'), status: ResponseStatus.UNAUTHORIZED };
  } /* else -- authentication successful */

  const token = createToken({ email: profile.email, profileId: profile.id });
  return { data: profile, message: this.t('auth.login_successful'), status: ResponseStatus.SUCCESS, token };
 }

 public async register(data: RegisterProfileData, createToken: CreateTokenFn): Promise<ServiceResult<Profile>> {
  const { email, password } = data;
  const client = this.getClient();

  const { data: existing } = await client
   .from(profileTableName)
   .select(profileTableColumns.email)
   .eq(profileTableColumns.email, email)
   .limit(1);

  if (existing && existing.length > 0) {
   return { data: null, message: this.t('auth.registration_failed'), status: ResponseStatus.CONFLICT };
  } /* else -- profile doesn't exist yet */

  const { data: authProfile, error: authError } = await client.auth.signUp({ email, password });
  if (authError || !authProfile.user) {
   return { data: null, message: authError?.message || this.t('auth.registration_failed'), status: ResponseStatus.BAD_REQUEST };
  } /* else -- user created successfully */

  const { data: createdProfile, error: createdProfileError } = await client
   .from(profileTableName)
   .insert({
    [profileTableColumns.email]: email,
    [profileTableColumns.id]: authProfile.user.id,
   })
   .select()
   .single();

  if (createdProfileError || !createdProfile) {
   return { data: null, message: this.t('auth.failed_to_create_profile'), status: ResponseStatus.BAD_REQUEST };
  } /* else -- profile created successfully */

  const profile = createdProfile as Profile;
  const token = createToken({ email: profile.email, profileId: profile.id });
  return { data: profile, message: this.t('auth.registration_successful'), status: ResponseStatus.CREATED, token };
 }

 public async getCurrentProfile(profileId: Profile['id']): Promise<ServiceResult<Profile>> {
  const client = this.getClient();

  const { data: profile, error } = await client
   .from(profileTableName)
   .select('*')
   .eq(profileTableColumns.id, profileId)
   .single();

  if (error || !profile) {
   return { data: null, message: this.t('auth.profile_not_found'), status: ResponseStatus.NOT_FOUND };
  } /* else -- profile found */

  return { data: profile as Profile, message: this.t('auth.login_successful'), status: ResponseStatus.SUCCESS };
 }

 // -- Private --------------------------------------------------------------------
 private getClient() {
  if (!this.client) { throw new Error('#1642efba ProfileLifecycle client not initialized'); }
  else { /* else -- client is available */ }

  return this.client;
 }
}
