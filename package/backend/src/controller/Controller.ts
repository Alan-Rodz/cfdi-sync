import { FastifyInstance, FastifyReply } from 'fastify';

import { logConsoleError, ResponseStatus } from 'common';

import { ServiceResult } from '../service/type';

import { ControllerDependencies, ControllerResponse } from './type';

// ********************************************************************************
// == Controller ==================================================================
export abstract class Controller {

 // -- Attribute ------------------------------------------------------------------
 protected readonly t: ControllerDependencies['t'];

 // -- Lifecycle ------------------------------------------------------------------
 constructor({ t }: ControllerDependencies) {
  this.t = t;
 }

 // -- Protected ------------------------------------------------------------------
 protected createControllerResponse<T>(result: ServiceResult<T>): ControllerResponse<T> {
  return { data: result.data, message: result.message, token: result.token };
 }

 protected sendServiceResult<T>(reply: FastifyReply, result: ServiceResult<T>, successStatuses: ResponseStatus[] = [ResponseStatus.SUCCESS]) {
  const response = this.createControllerResponse(result);

  if (!successStatuses.includes(result.status)) {
   return reply.status(result.status).send(response);
  } /* else -- expected success status */

  if (result.status !== ResponseStatus.SUCCESS) {
   return reply.status(result.status).send(response);
  } /* else -- standard success status */

  return reply.send(response);
 }

 protected sendUnexpectedError(reply: FastifyReply, error: unknown, errorId: string, messageKey: Parameters<ControllerDependencies['t']>[0], status: ResponseStatus = ResponseStatus.ERROR) {
  logConsoleError(error, errorId);
  const response: ControllerResponse = { data: null, message: this.t(messageKey) };
  return reply.status(status).send(response);
 }

 // -- Public ---------------------------------------------------------------------
 public abstract addRoutes(server: FastifyInstance): Promise<void>;
}
