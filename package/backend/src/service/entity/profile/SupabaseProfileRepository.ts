import { SupabaseClient } from '@supabase/supabase-js';

import { Database, Profile, profileTableColumns, profileTableName } from 'common';

import { ProfileRepositoryCreateInput, ProfileRepositoryPort } from './type';

// ********************************************************************************
// == Repository ==================================================================
export class SupabaseProfileRepository implements ProfileRepositoryPort {

 // -- Attribute ------------------------------------------------------------------
 private readonly client: SupabaseClient<Database>;

 // -- Lifecycle ------------------------------------------------------------------
 constructor(client: SupabaseClient<Database>) {
  this.client = client;
 }

 // -- Public ---------------------------------------------------------------------
 public async createProfile(data: ProfileRepositoryCreateInput): Promise<Profile> {
  const { data: createdProfile, error: createdProfileError } = await this.client
   .from(profileTableName)
   .insert({
    [profileTableColumns.email]: data.email,
    [profileTableColumns.id]: data.id,
   })
   .select()
   .single();

  if (createdProfileError || !createdProfile) {
   throw new Error('#e9a6d017 Failed to create profile');
  } /* else -- profile created successfully */

  return createdProfile as Profile;
 }

 public async findProfileByEmail(email: Profile['email']): Promise<Profile | null> {
  const { data: profileObj, error: profileObjError } = await this.client
   .from(profileTableName)
   .select('*')
   .eq(profileTableColumns.email, email)
   .limit(1);

  if (profileObjError) {
   throw new Error('#1c5ca8f2 Failed to fetch profile by email');
  } /* else -- profile query completed */

  if (!profileObj || profileObj.length === 0) {
   return null;
  } /* else -- profile found */

  return profileObj[0] as Profile;
 }

 public async findProfileById(profileId: Profile['id']): Promise<Profile | null> {
  const { data: profile, error } = await this.client
   .from(profileTableName)
   .select('*')
   .eq(profileTableColumns.id, profileId)
   .single();

  if (error) {
   throw new Error('#f53f9706 Failed to fetch profile by id');
  } /* else -- profile query completed */

  if (!profile) {
   return null;
  } /* else -- profile found */

  return profile as Profile;
 }

 public async isEmailRegistered(email: Profile['email']): Promise<boolean> {
  const { data: existing, error: existingError } = await this.client
   .from(profileTableName)
   .select(profileTableColumns.email)
   .eq(profileTableColumns.email, email)
   .limit(1);

  if (existingError) {
   throw new Error('#d8ec8877 Failed to check profile email');
  } /* else -- profile existence query completed */

  return !!existing && existing.length > 0;
 }
}
