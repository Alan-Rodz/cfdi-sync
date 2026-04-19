import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { Database } from 'common';

import { LoggerPort } from '../../logger/type';
import { SupabaseProfileRepository } from './SupabaseProfileRepository';
import { ProfileRepositoryFactoryPort, ProfileRepositoryPort } from './type';

// ********************************************************************************
// == Factory =====================================================================
export class SupabaseProfileRepositoryFactory implements ProfileRepositoryFactoryPort {

 // -- Attribute ------------------------------------------------------------------
 private readonly loggerPort: LoggerPort | null;
 private readonly supabaseKey: string;
 private readonly supabaseUrl: string;

 // -- Lifecycle ------------------------------------------------------------------
 constructor(supabaseUrl: string, supabaseKey: string, loggerPort: LoggerPort | null = null) {
  this.loggerPort = loggerPort;
  this.supabaseKey = supabaseKey;
  this.supabaseUrl = supabaseUrl;
 }

 // -- Public ---------------------------------------------------------------------
 public forAuthenticatedRequest(supabaseAccessToken: string): ProfileRepositoryPort {
  const scopedClient: SupabaseClient<Database> = createClient<Database>(
   this.supabaseUrl,
   this.supabaseKey,
   { global: { headers: { Authorization: `Bearer ${supabaseAccessToken}` } } }
  );

  return new SupabaseProfileRepository(scopedClient, this.loggerPort);
 }
}
