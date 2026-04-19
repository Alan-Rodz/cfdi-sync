import { FastifyInstance } from 'fastify';

import { backendApiRoutes, logConsoleError, LoginData, Profile, RegisterProfileData, ResponseStatus } from 'common';

import { ProfileLifecycle } from '../../service/entity/profile/ProfileLifecycle';

import { Controller } from '../Controller';
import { ControllerResponse } from '../type';
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

  // -- Login ---------------------------------------------------------------------
  server.post<{ Body: LoginData }>(backendApiRoutes.auth.login, async (request, reply) => {
   try {
    const result = await this.profileLifecycle.login(request.body, (payload) => server.jwt.sign(payload));
    if (result.status !== ResponseStatus.SUCCESS) {
     const response: ControllerResponse = { data: null, message: result.message };
     return reply.status(result.status).send(response);
    } /* else -- login successful */

    const response: ControllerResponse<Profile> = { data: result.data, message: result.message, token: result.token };
    return reply.send(response);
   } catch (error) {
    logConsoleError(error, '#d32322a1')
    const response: ControllerResponse = { data: null, message: this.t('auth.login_failed') };
    return reply.status(ResponseStatus.ERROR).send(response);
   }
  });

  // -- Register ------------------------------------------------------------------
  server.post<{ Body: RegisterProfileData }>(backendApiRoutes.auth.register, async (request, reply) => {
   try {
    const result = await this.profileLifecycle.register(request.body, (payload) => server.jwt.sign(payload));
    if (result.status !== ResponseStatus.CREATED) {
     const response: ControllerResponse = { data: null, message: result.message };
     return reply.status(result.status).send(response);
    } /* else -- registration successful */

    const response: ControllerResponse<Profile> = { data: result.data, message: result.message, token: result.token };
    return reply.status(ResponseStatus.CREATED).send(response);
   } catch (error) {
    logConsoleError(error, '#cd7ebd08')
    const response: ControllerResponse = { data: null, message: this.t('auth.registration_failed') };
    return reply.status(ResponseStatus.ERROR).send(response);
   }
  });

  // -- Get Current Profile -------------------------------------------------------
  server.get(backendApiRoutes.auth.me, async (request, reply) => {
   try {
    await request.jwtVerify();
    const payload = request.user as TokenPayload;
    const result = await this.profileLifecycle.getCurrentProfile(payload.profileId);
    if (result.status !== ResponseStatus.SUCCESS) {
     const response: ControllerResponse = { data: null, message: result.message };
     return reply.status(result.status).send(response);
    } /* else -- profile loaded */

    const response: ControllerResponse<Profile> = { data: result.data, message: result.message };
    return reply.send(response);
   } catch (error) {
    logConsoleError(error, '#6bdb681d')
    const response: ControllerResponse = { data: null, message: this.t('auth.profile_not_found') };
    return reply.status(ResponseStatus.UNAUTHORIZED).send(response);
   }
  });
 }
}
