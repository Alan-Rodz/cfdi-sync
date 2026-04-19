import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { backendApiRoutes, LoginData, PatchProfileNameData, RegisterProfileData, ResponseStatus } from 'common';

import { ProfileLifecycle } from '../../service/entity/profile/ProfileLifecycle';

import { Controller } from '../Controller';
import { AuthControllerDependencies } from './type';

// ********************************************************************************
// == Controller ==================================================================
export class AuthController extends Controller {
 // -- Attribute ------------------------------------------------------------------
 private readonly profileLifecycle: ProfileLifecycle;

 // -- Lifecycle ------------------------------------------------------------------
 constructor(dependencies: AuthControllerDependencies) {
  super(dependencies);
  this.profileLifecycle = dependencies.profileLifecycle || new ProfileLifecycle(dependencies.profileAuthPort, dependencies.profileRepositoryPort, this.t, this.loggerPort);
 }

 // -- Public ---------------------------------------------------------------------
 public async addRoutes(server: FastifyInstance) {
  server.patch<{ Body: PatchProfileNameData }>(backendApiRoutes.auth.profile, { preHandler: server.authenticateWithSupabase }, async (request, reply) => this.handlePatchProfileName(request, reply));
  server.post<{ Body: LoginData }>(backendApiRoutes.auth.login, async (request, reply) => this.handleLogin(server, request, reply));
  server.post<{ Body: RegisterProfileData }>(backendApiRoutes.auth.register, async (request, reply) => this.handleRegister(server, request, reply));
  server.get(backendApiRoutes.auth.me, { preHandler: server.authenticateWithSupabase }, async (request, reply) => this.handleGetCurrentProfile(request, reply));
 }

 // -- Handler --------------------------------------------------------------------

 private async handleLogin(server: FastifyInstance, request: FastifyRequest<{ Body: LoginData }>, reply: FastifyReply) {
  try {
   const result = await this.profileLifecycle.login(request.body, (payload) => server.jwt.sign(payload));
   return this.sendServiceResult(reply, result);
  } catch (error) {
   return this.sendUnexpectedError(reply, error, '#d32322a1', 'auth.login_failed');
  }
 }

 private async handleGetCurrentProfile(request: FastifyRequest, reply: FastifyReply) {
  try {
   const authContext = request.authContext;
   if (!authContext) {
    return reply.status(ResponseStatus.UNAUTHORIZED).send({ data: null, message: this.t('auth.invalid_credentials') });
   } /* else -- authenticated request context available */

   const result = await this.profileLifecycle.getCurrentProfile(authContext.payload.profileId, authContext.supabaseClient);
   return this.sendServiceResult(reply, result);
  } catch (error) {
   return this.sendUnexpectedError(reply, error, '#6bdb681d', 'auth.profile_not_found', ResponseStatus.UNAUTHORIZED);
  }
 }

 private async handlePatchProfileName(request: FastifyRequest<{ Body: PatchProfileNameData }>, reply: FastifyReply) {
  try {
   const authContext = request.authContext;
   if (!authContext) {
    return reply.status(ResponseStatus.UNAUTHORIZED).send({ data: null, message: this.t('auth.invalid_credentials') });
   } /* else -- authenticated request context available */

   const result = await this.profileLifecycle.patchProfileName(authContext.payload.profileId, request.body.name, authContext.supabaseClient);
   return this.sendServiceResult(reply, result);
  } catch (error) {
   return this.sendUnexpectedError(reply, error, '#a8cf9328', 'entity.profile.update_profile_failed', ResponseStatus.UNAUTHORIZED);
  }
 }

 private async handleRegister(server: FastifyInstance, request: FastifyRequest<{ Body: RegisterProfileData }>, reply: FastifyReply) {
  try {
   const result = await this.profileLifecycle.register(request.body, (payload) => server.jwt.sign(payload));
   return this.sendServiceResult(reply, result, [ResponseStatus.CREATED]);
  } catch (error) {
   return this.sendUnexpectedError(reply, error, '#cd7ebd08', 'auth.registration_failed');
  }
 }
}
