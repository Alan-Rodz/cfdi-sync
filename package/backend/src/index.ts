import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import { createClient } from '@supabase/supabase-js';
import fastify from 'fastify';

import { Database, englishTranslationFunction, RequestHeader, RequestMethod, ResponseStatus } from 'common';

import type { AuthenticatedRequestContext } from './fastify';

import { getControllers } from './controller';
import { SupabaseProfileAuth } from './service/entity/profile/SupabaseProfileAuth';
import { SupabaseProfileRepositoryFactory } from './service/entity/profile/SupabaseProfileRepositoryFactory';
import { Logger } from './service/logger/Logger';

// ********************************************************************************
// == Constant ====================================================================
const server = fastify();
await server.register(fastifyCors, { methods: [RequestMethod.DELETE, RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH], origin: process.env.FRONTEND_URL! });
await server.register(fastifyJwt, { secret: process.env.JWT_SECRET!, sign: { expiresIn: '7d' } });

const supaBaseClient = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
server.decorateRequest('authContext', null);
server.decorate('authenticateWithSupabase', async (request, reply) => {
 await request.jwtVerify();

 const header = request.headers[RequestHeader.SupabaseAccessToken.toLowerCase()];
 const supabaseAccessToken = typeof header === 'string'
  ? header.trim()
  : Array.isArray(header)
   ? header[0]?.trim() || ''
   : '';

 if (!supabaseAccessToken) {
  return reply.status(ResponseStatus.UNAUTHORIZED).send({ data: null, message: englishTranslationFunction('auth.invalid_credentials') });
 } /* else -- Supabase token is available */

 request.authContext = {
  payload: request.user as AuthenticatedRequestContext['payload'],
  supabaseAccessToken,
 };
});

const loggerPort = new Logger(supaBaseClient, { scope: 'General' });
const profileAuth = new SupabaseProfileAuth(supaBaseClient, new Logger(supaBaseClient, { scope: 'SupabaseProfileAuth' }));
const profileRepositoryFactory = new SupabaseProfileRepositoryFactory(
 process.env.SUPABASE_URL!,
 process.env.SUPABASE_KEY!,
 new Logger(supaBaseClient, { scope: 'SupabaseProfileRepository' })
);

// == Setup =======================================================================
const controllers = getControllers({
 auth: {
  profileAuthPort: profileAuth,
  profileRepositoryFactoryPort: profileRepositoryFactory,
 },
 loggerPort,
 t: englishTranslationFunction,
});

for (const controller of controllers) {
 await controller.addRoutes(server);
}

// == Listen ======================================================================
server.listen({ port: Number(process.env.PORT) }, (error, address) => {
 if (error) {
  console.error(error);
  process.exit(1);
 } /* else -- no error */

 console.log(`#cb4ebf33 Server listening at ${address}`);
});
