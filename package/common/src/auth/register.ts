import { z } from 'zod';

import type { ApiResponse } from '../api';
import type { Profile } from '../entity/profile/type';
import { englishTranslationFunction, type LocaledTranslationFn } from '../locale/functionality';
import { getEmailSchema } from '../misc/email';
import { getPasswordSchema } from '../misc/password';

// ********************************************************************************
// == Type ========================================================================
export type RegisterProfileData = z.infer<ReturnType<typeof getRegisterUserSchema>>;
export type RegisterProfileResponseData = ApiResponse<Profile | null>;

// == Constant ====================================================================
export const registerUserSchemaKeys: { [key in keyof RegisterProfileData]: key; } = {
 email: 'email',
 password: 'password',
 passwordConfirmation: 'passwordConfirmation',
};

// == Schema ======================================================================
export const getRegisterUserSchema = (t: LocaledTranslationFn = englishTranslationFunction) =>
 z.object({
  email: getEmailSchema(t),
  password: getPasswordSchema(t),
  passwordConfirmation: getPasswordSchema(t),
 })
  .refine((val) => typeof val === 'object', { error: t('schema.misc.object.type') })
  .refine((val) => val !== null, { error: t('schema.misc.object.required') })
  .superRefine((val, ctx) => {
   if (val.password === val.passwordConfirmation) { return; }

   ctx.addIssue({
    code: 'custom',
    message: t('schema.misc.password_confirmation.match'),
    path: ['passwordConfirmation'],

   });
  });
