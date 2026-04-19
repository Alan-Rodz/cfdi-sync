import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import { createClient } from '@supabase/supabase-js';
import fastify from 'fastify';

import { Database, englishTranslationFunction } from 'common';

import { getControllers } from './controller';

// ********************************************************************************
// == Constant ====================================================================
const server = fastify();
await server.register(fastifyCors, { origin: process.env.FRONTEND_URL! });
await server.register(fastifyJwt, { secret: process.env.JWT_SECRET!, sign: { expiresIn: '7d' } });
const supaBaseClient = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

// == Setup =======================================================================
const controllers = getControllers({ client: supaBaseClient, t: englishTranslationFunction });
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
