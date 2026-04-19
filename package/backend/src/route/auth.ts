import { createClient } from '@supabase/supabase-js';
import { FastifyInstance } from 'fastify';

import { backendApiRoutes, Database, englishTranslationFunction, logConsoleError, LoginData, Profile, profileTableColumns, profileTableName, RegisterProfileData, ResponseStatus } from 'common';

// ********************************************************************************
// == Type ========================================================================
export type AuthResponse<T = null> = {
 data?: T;
 message: string;
 token?: string;
};

type TokenPayload = {
 email: Profile['email'];
 profileId: Profile['id'];
}

// == Constant ====================================================================
const supaBaseClient = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

// ********************************************************************************
// == Handler =====================================================================
export const addAuthRoutes = async (server: FastifyInstance, t = englishTranslationFunction) => {
 server.register(require('@fastify/jwt'), { secret: process.env.JWT_SECRET, sign: { expiresIn: '7d' } });

 // -- Login ----------------------------------------------------------------------
 server.post<{ Body: LoginData }>(backendApiRoutes.auth.login, async (request, reply) => {
  const { email, password } = request.body;

  try {
   const { data: profileObj, error: profileObjError } = await supaBaseClient
    .from(profileTableName)
    .select('*')
    .eq(profileTableColumns.email, email);

   if (profileObjError) {
    return reply.status(ResponseStatus.ERROR).send({ data: null, message: t('auth.failed_to_fetch_profile') });
   } /* else -- no error */

   if (!profileObj || profileObj.length === 0) {
    return reply.status(ResponseStatus.UNAUTHORIZED).send({ data: null, message: t('auth.invalid_credentials') });
   } /* else -- profile found */

   const profile = profileObj[0];
   const { data: authedProfile, error: authedProfileError } = await supaBaseClient.auth.signInWithPassword({ email, password });

   if (authedProfileError || !authedProfile) {
    return reply.status(ResponseStatus.UNAUTHORIZED).send({ data: null, message: t('auth.invalid_credentials') });
   } /* else -- authentication successful */

   const payload: TokenPayload = { email: profile.email, profileId: profile.id };
   const token = server.jwt.sign(payload);
   return reply.send({ data: profile, message: t('auth.login_successful'), token });
  } catch (error) {
   logConsoleError(error, '#d32322a1')
   return reply.status(ResponseStatus.ERROR).send({ data: null, message: t('auth.login_failed') });
  }
 });

 // -- Register -------------------------------------------------------------------
 server.post<{ Body: RegisterProfileData }>(backendApiRoutes.auth.register, async (request, reply) => {
  const { email, password } = request.body;

  try {
   const { data: existing } = await supaBaseClient
    .from(profileTableName)
    .select(profileTableColumns.email)
    .eq(profileTableColumns.email, email)
    .limit(1);

   if (existing && existing.length > 0) {
    return reply.status(ResponseStatus.CONFLICT).send({ data: null, message: t('auth.registration_failed') });
   } /* else -- profile doesn't exist yet */

   const { data: authProfile, error: authError } = await supaBaseClient.auth.signUp({ email, password });
   if (authError || !authProfile.user) {
    return reply.status(ResponseStatus.BAD_REQUEST).send({
     data: null,
     message: authError?.message || t('auth.registration_failed'),
    });
   } /* else -- user created successfully */

   const { data: createdProfile, error: createdProfileError } = await supaBaseClient
    .from(profileTableName)
    .insert({
     [profileTableColumns.email]: email,
     [profileTableColumns.id]: authProfile.user.id,
    })
    .select()
    .single();
   if (createdProfileError || !createdProfile) {
    return reply.status(ResponseStatus.BAD_REQUEST).send({ data: null, message: t('auth.failed_to_create_profile') });
   } /* else -- profile created successfully */

   const profile = createdProfile as Profile;
   const payload: TokenPayload = { email: profile.email, profileId: profile.id };
   const token = server.jwt.sign(payload);

   return reply.status(ResponseStatus.CREATED).send({ data: profile, message: t('auth.registration_successful'), token });
  } catch (error) {
   logConsoleError(error, '#cd7ebd08')
   return reply.status(ResponseStatus.ERROR).send({ data: null, message: t('auth.registration_failed') });
  }
 });

 // -- Get Current Profile --------------------------------------------------------
 server.get(backendApiRoutes.auth.me, async (request, reply) => {
  try {
   await request.jwtVerify();
   const payload = request.user as TokenPayload;

   const { data: profile, error } = await supaBaseClient
    .from(profileTableName)
    .select('*')
    .eq(profileTableColumns.id, payload.profileId)
    .single();
   if (error || !profile) {
    return reply.status(ResponseStatus.NOT_FOUND).send({ data: null, message: t('auth.profile_not_found') });
   } /* else -- profile found */

   return reply.send({ data: profile as Profile, message: t('auth.login_successful') });
  } catch (error) {
   logConsoleError(error, '#6bdb681d')
   return reply.status(ResponseStatus.UNAUTHORIZED).send({ data: null, message: t('auth.profile_not_found') });
  }
 });
}
