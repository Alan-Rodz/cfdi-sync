import { SupabaseClient } from '@supabase/supabase-js';

import { Database, LoginData, RegisterProfileData } from 'common';

import { ProfileAuthPort, ProfileAuthSignInResult, ProfileAuthSignUpResult } from './type';

// ********************************************************************************
// == Auth ========================================================================
export class SupabaseProfileAuth implements ProfileAuthPort {

 // -- Attribute ------------------------------------------------------------------
 private readonly client: SupabaseClient<Database>;

 // -- Lifecycle ------------------------------------------------------------------
 constructor(client: SupabaseClient<Database>) {
  this.client = client;
 }

 // -- Public ---------------------------------------------------------------------
 public async signInWithPassword(data: LoginData): Promise<ProfileAuthSignInResult> {
  const { data: authedProfile, error: authedProfileError } = await this.client.auth.signInWithPassword(data);
  return { authenticated: !authedProfileError && !!authedProfile };
 }

 public async signUpWithPassword(data: RegisterProfileData): Promise<ProfileAuthSignUpResult> {
  const { data: authProfile, error: authError } = await this.client.auth.signUp(data);

  if (authError || !authProfile.user) {
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
}
