import { FastifyInstance } from 'fastify';

import { ControllerDependencies } from './type';

// ********************************************************************************
// == Controller ==================================================================
export abstract class Controller {

 // -- Attribute ------------------------------------------------------------------
 protected readonly client: ControllerDependencies['client'];
 protected readonly t: ControllerDependencies['t'];

 // -- Lifecycle ------------------------------------------------------------------
 constructor({ client, t }: ControllerDependencies) {
  this.client = client;
  this.t = t;
 }

 // -- Public ---------------------------------------------------------------------
 public abstract addRoutes(server: FastifyInstance): Promise<void>;
}
