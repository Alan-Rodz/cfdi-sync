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

 // -- Lifecycle ------------------------------------------------------------------
 constructor(loggerPort: LoggerPort | null = null) {
  this.loggerPort = loggerPort;
 }

 // -- Public ---------------------------------------------------------------------
 public forAuthenticatedRequest(supabaseAccessToken: string): ProfileRepositoryPort {
  const scopedClient: SupabaseClient<Database> = createClient<Database>(
   process.env.SUPABASE_URL!,
   process.env.SUPABASE_KEY!,
   { global: { headers: { Authorization: `Bearer ${supabaseAccessToken}` } } }
  );

  return new SupabaseProfileRepository(scopedClient, this.loggerPort);
 }
}
