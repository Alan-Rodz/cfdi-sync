import 'fastify';

import type { Profile } from 'common';

// ********************************************************************************
// == Type ========================================================================
export type AuthenticatedRequestContext = {
 payload: {
  email: Profile['email'];
  profileId: Profile['id'];
 };
 supabaseAccessToken: string;
};

declare module 'fastify' {
 interface FastifyInstance {
  authenticateWithSupabase(request: FastifyRequest, reply: FastifyReply): Promise<void>;
 }

 interface FastifyRequest {
  authContext: AuthenticatedRequestContext | null;
 }
}
