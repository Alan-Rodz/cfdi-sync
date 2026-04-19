import fastifyCors from '@fastify/cors';
import fastify from 'fastify';

import { registerAuthRoutes } from './auth';

// ********************************************************************************
// == Constant ====================================================================
const server = fastify();
await server.register(fastifyCors, { origin: process.env.FRONTEND_URL! });

// == Setup =======================================================================
await registerAuthRoutes(server);

// == Listen ======================================================================
server.listen({ port: Number(process.env.PORT) }, (error, address) => {
 if (error) {
  console.error(error);
  process.exit(1);
 } /* else -- no error */

 console.log(`#cb4ebf33 Server listening at ${address}`);
});
