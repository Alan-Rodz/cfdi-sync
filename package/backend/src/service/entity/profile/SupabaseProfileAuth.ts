import { SupabaseClient } from '@supabase/supabase-js';

import { Database, LoginData, RegisterProfileData } from 'common';

import { LoggerPort } from '../../logger/type';
import { ProfileAuthPort, ProfileAuthSignInResult, ProfileAuthSignUpResult } from './type';

// ********************************************************************************
// == Auth ========================================================================
export class SupabaseProfileAuth implements ProfileAuthPort {

 // -- Attribute ------------------------------------------------------------------
 private readonly client: SupabaseClient<Database>;
 private readonly loggerPort: LoggerPort | null;

 // -- Lifecycle ------------------------------------------------------------------
 constructor(client: SupabaseClient<Database>, loggerPort: LoggerPort | null = null) {
  this.client = client;
  this.loggerPort = loggerPort;
 }

 // -- Public ---------------------------------------------------------------------
 public async signInWithPassword(data: LoginData): Promise<ProfileAuthSignInResult> {
  const { data: authedProfile, error: authedProfileError } = await this.client.auth.signInWithPassword(data);

  if (authedProfileError) {
   await this.safeLogError('#9f4b0a8d Supabase sign-in failed', authedProfileError);
  } /* else -- no sign-in provider error */

  return { authenticated: !authedProfileError && !!authedProfile };
 }

 public async signUpWithPassword(data: RegisterProfileData): Promise<ProfileAuthSignUpResult> {
  const { data: authProfile, error: authError } = await this.client.auth.signUp(data);

  if (authError || !authProfile.user) {
   if (authError) {
    await this.safeLogError('#dd9bd457 Supabase sign-up failed', authError);
   } else {
    await this.safeLogError('#dc6b2f63 Supabase sign-up missing user', { data });
   }

   return {
    errorMessage: authError?.message || null,
    profileId: null,
   };
  } /* else -- user created successfully */

  return {
   errorMessage: null,
   profileId: authProfile.user.id,
  };
 }

 // -- Private --------------------------------------------------------------------
 private async safeLogError(message: string, error: unknown) {
  await this.loggerPort?.safeLogError(message, error);
 }
}
