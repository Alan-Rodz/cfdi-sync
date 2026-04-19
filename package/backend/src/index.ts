import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import { createClient } from '@supabase/supabase-js';
import fastify from 'fastify';

import { Database, englishTranslationFunction, RequestMethod } from 'common';

import { getControllers } from './controller';
import { SupabaseProfileAuth } from './service/entity/profile/SupabaseProfileAuth';
import { SupabaseProfileRepository } from './service/entity/profile/SupabaseProfileRepository';
import { Logger } from './service/logger/Logger';

// ********************************************************************************
// == Constant ====================================================================
const server = fastify();
await server.register(fastifyCors, { methods: [RequestMethod.DELETE, RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH], origin: process.env.FRONTEND_URL! });
await server.register(fastifyJwt, { secret: process.env.JWT_SECRET!, sign: { expiresIn: '7d' } });
const supaBaseClient = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

const loggerPort = new Logger(supaBaseClient, { scope: 'General' });
const profileAuth = new SupabaseProfileAuth(supaBaseClient, new Logger(supaBaseClient, { scope: 'SupabaseProfileAuth' }));
const profileRepository = new SupabaseProfileRepository(supaBaseClient, new Logger(supaBaseClient, { scope: 'SupabaseProfileRepository' }));

// == Setup =======================================================================
const controllers = getControllers({
 auth: {
  profileAuthPort: profileAuth,
  profileRepositoryPort: profileRepository,
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
