import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { backendApiRoutes, LoginData, RegisterProfileData, ResponseStatus } from 'common';

import { ProfileLifecycle } from '../../service/entity/profile/ProfileLifecycle';

import { Controller } from '../Controller';
import { AuthControllerDependencies, TokenPayload } from './type';

// ********************************************************************************
// == Controller ==================================================================
export class AuthController extends Controller {
 // -- Attribute ------------------------------------------------------------------
 private readonly profileLifecycle: ProfileLifecycle;

 // -- Lifecycle ------------------------------------------------------------------
 constructor(dependencies: AuthControllerDependencies) {
  super(dependencies);
  this.profileLifecycle = dependencies.profileLifecycle || new ProfileLifecycle(this.client, this.t);
 }

 // -- Public ---------------------------------------------------------------------
 public async addRoutes(server: FastifyInstance) {
  server.post<{ Body: LoginData }>(backendApiRoutes.auth.login, async (request, reply) => this.handleLogin(server, request, reply));
  server.post<{ Body: RegisterProfileData }>(backendApiRoutes.auth.register, async (request, reply) => this.handleRegister(server, request, reply));
  server.get(backendApiRoutes.auth.me, async (request, reply) => this.handleGetCurrentProfile(request, reply));
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

 private async handleRegister(server: FastifyInstance, request: FastifyRequest<{ Body: RegisterProfileData }>, reply: FastifyReply) {
  try {
   const result = await this.profileLifecycle.register(request.body, (payload) => server.jwt.sign(payload));
   return this.sendServiceResult(reply, result, [ResponseStatus.CREATED]);
  } catch (error) {
   return this.sendUnexpectedError(reply, error, '#cd7ebd08', 'auth.registration_failed');
  }
 }

 private async handleGetCurrentProfile(request: FastifyRequest, reply: FastifyReply) {
  try {
   await request.jwtVerify();
   const payload = request.user as TokenPayload;
   const result = await this.profileLifecycle.getCurrentProfile(payload.profileId);
   return this.sendServiceResult(reply, result);
  } catch (error) {
   return this.sendUnexpectedError(reply, error, '#6bdb681d', 'auth.profile_not_found', ResponseStatus.UNAUTHORIZED);
  }
 }
}
