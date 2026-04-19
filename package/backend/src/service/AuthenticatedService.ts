import { SupabaseClient } from '@supabase/supabase-js';

import { Database, Profile } from 'common';
import { Logger } from './logger/Logger';

// ********************************************************************************
// == Service =====================================================================
export abstract class AuthenticatedService {

 // -- Attribute ------------------------------------------------------------------
 protected client: SupabaseClient<Database> | null;
 protected initialized: boolean;
 protected logger: Logger | null;
 protected profileId: Profile['id'];
 private readonly scope: string;

 // -- Lifecycle ------------------------------------------------------------------
 constructor(scope: string) {
  this.client = null;
  this.initialized = false;
  this.logger = null;
  this.profileId = '';
  this.scope = scope;
 }

 protected async initializeService(client: SupabaseClient<Database>) {
  try {
   this.client = client;
   this.logger = new Logger(client, { scope: this.scope });

   const { data: { user } } = await this.client.auth.getUser();
   if (!user) { throw new Error(`#bf1fe01d ${this.scope} user not authenticated`); }

   this.profileId = user.id;
   return this;
  } catch (error) {
   await this.logger?.safeLogError(`#6d8dfe25 Failed to initialize ${this.scope}`, error);
   throw error;
  }
 }

 // -- Protected ------------------------------------------------------------------
 protected checkClientAndLogger() {
  if (!this.client) {
   throw new Error(`#863625f4 Supabase client not set in ${this.scope}`);
  }

  if (!this.logger) {
   throw new Error(`#97439e2c ${this.scope} logger not initialized`);
  }

  return this.client;
 }

 protected checkInitialized() {
  this.checkClientAndLogger();

  if (!this.initialized) {
   throw new Error(`#df84fb62 ${this.scope} not initialized`);
  }
 }
}
