import { SupabaseClient } from '@supabase/supabase-js';

import { Database, Profile, profileTableColumns, profileTableName } from 'common';

import { LoggerPort } from '../../logger/type';
import { ProfileRepositoryCreateInput, ProfileRepositoryPort } from './type';

// ********************************************************************************
// == Repository ==================================================================
export class SupabaseProfileRepository implements ProfileRepositoryPort {

 // -- Attribute ------------------------------------------------------------------
 private readonly client: SupabaseClient<Database>;
 private readonly loggerPort: LoggerPort | null;

 // -- Lifecycle ------------------------------------------------------------------
 constructor(client: SupabaseClient<Database>, loggerPort: LoggerPort | null = null) {
  this.client = client;
  this.loggerPort = loggerPort;
 }

 // -- Public ---------------------------------------------------------------------
 public async findProfileByEmail(email: Profile['email']): Promise<Profile | null> {
  const { data: profileObj, error: profileObjError } = await this.client
   .from(profileTableName)
   .select('*')
   .eq(profileTableColumns.email, email)
   .limit(1);

  if (profileObjError) {
   await this.safeLogError('#9bf1c2e3 Supabase fetch profile by email failed', profileObjError);
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
   await this.safeLogError('#586593ad Supabase fetch profile by id failed', error);
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
   await this.safeLogError('#f8f4f627 Supabase check email failed', existingError);
   throw new Error('#d8ec8877 Failed to check profile email');
  } /* else -- profile existence query completed */

  return !!existing && existing.length > 0;
 }

 // -- Private --------------------------------------------------------------------
 private async safeLogError(message: string, error: unknown) {
  await this.loggerPort?.safeLogError(message, error);
 }
}
