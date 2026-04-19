import fastifyCors from '@fastify/cors';
import { createClient } from '@supabase/supabase-js';
import fastify from 'fastify';

import { Database, englishTranslationFunction } from 'common';

import { AuthController } from './controller/auth/AuthController';

// ********************************************************************************
// == Constant ====================================================================
const server = fastify();
await server.register(fastifyCors, { origin: process.env.FRONTEND_URL! });
const supaBaseClient = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

// == Setup =======================================================================
const controllers = [
 new AuthController({ client: supaBaseClient, t: englishTranslationFunction }),
];

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
