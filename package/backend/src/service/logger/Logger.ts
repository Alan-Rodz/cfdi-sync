import { SupabaseClient } from '@supabase/supabase-js';

import { Database, rpcNames } from 'common';

import { LoggerLevel, LoggerLogOptions, LoggerPort, LoggerServiceConfig } from './type';

// ********************************************************************************
// == Service =====================================================================
export class Logger implements LoggerPort {

 // -- Attribute ------------------------------------------------------------------
 private client: SupabaseClient<Database>;
 private scope: string | null;
 private includeTimestamp: boolean;

 // -- Lifecycle ------------------------------------------------------------------
 constructor(client: SupabaseClient<Database>, config: LoggerServiceConfig = {}) {
  this.client = client;
  this.scope = config.scope ?? null;
  this.includeTimestamp = config.includeTimestamp ?? process.env.NODE_ENV === 'production'/*include timestamps by default in prod*/;
 }

 // -- Public ---------------------------------------------------------------------
 public async debug(message: string, options: LoggerLogOptions = {}) {
  await this.log('DEBUG', message, options);
 }

 public async error(message: string, options: LoggerLogOptions = {}) {
  await this.log('ERROR', message, options);
 }

 public async info(message: string, options: LoggerLogOptions = {}) {
  await this.log('INFO', message, options);
 }

 public async log(level: LoggerLevel, message: string, options: LoggerLogOptions = {}) {
  const text = this.formatMessage(level, message, options);

  const { error } = await this.client.rpc(rpcNames.insert_log, { input_text: text });
  if (error) { throw error; }
  console.log(text);
 }

 public async safeLogError(message: string, error: unknown) {
  try {
   await this.error(message, {
    context: this.toErrorContext(error),
   });
  } catch {
   // intentionally swallow logger failures so original errors are not masked.
  }
 }

 public toErrorContext(error: unknown) {
  if (error instanceof Error) {
   return {
    errorMessage: error.message,
    errorName: error.name,
    stack: error.stack,
   };
  } else {
   return { rawError: error };
  }
 }

 public async warn(message: string, options: LoggerLogOptions = {}) {
  await this.log('WARN', message, options);
 }

 // -- Private --------------------------------------------------------------------
 private formatMessage(level: LoggerLevel, message: string, options: LoggerLogOptions) {
  const timestampPrefix = this.includeTimestamp ? `[${new Date().toISOString()}] ` : '';
  const scope = options.scope ?? this.scope;
  const scopePrefix = scope ? `[${scope}] ` : '';
  const contextSuffix = options.context ? ` ${this.serializeContext(options.context)}` : '';

  return `${timestampPrefix}[${level}] ${scopePrefix}${message}${contextSuffix}`;
 }

 private serializeContext(context: NonNullable<LoggerLogOptions['context']>) {
  try {
   return JSON.stringify(context);
  } catch {
   return '[context:unserializable]';
  }
 }
}
