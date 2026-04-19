import type { SupabaseClient } from '@supabase/supabase-js';
import type { FastifyReply, FastifyRequest } from 'fastify';

import type { Database, Profile } from 'common';

// ********************************************************************************
// == Type ========================================================================
export type AuthenticatedRequestContext = {
 payload: {
  email: Profile['email'];
  profileId: Profile['id'];
 };
 supabaseAccessToken: string;
 supabaseClient: SupabaseClient<Database>;
};

declare module 'fastify' {
 interface FastifyInstance {
  authenticateWithSupabase(request: FastifyRequest, reply: FastifyReply): Promise<void>;
 }

 interface FastifyRequest {
  authContext: AuthenticatedRequestContext | null;
 }
}
