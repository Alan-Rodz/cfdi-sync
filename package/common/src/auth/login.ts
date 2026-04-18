import { z } from 'zod';

import { ApiResponse } from '../api';
import { englishTranslationFunction, LocaledTranslationFn } from '../locale/functionality';
import { getEmailSchema } from '../misc/email';
import { getPasswordSchema } from '../misc/password';

// ********************************************************************************
// == Type ========================================================================
export type LoginData = z.infer<ReturnType<typeof getLoginSchema>>;
export type LoginResponseData = ApiResponse;

// == Constant ====================================================================
export const loginSchemaKeys: { [key in keyof LoginData]: key; } = {
 email: 'email',
 password: 'password',
};

// == Schema ======================================================================
export const getLoginSchema = (t: LocaledTranslationFn = englishTranslationFunction) =>
 z.object({
  email: getEmailSchema(t),
  password: getPasswordSchema(t),
 })
  .refine((val) => typeof val === 'object', { error: t('schema.misc.object.type') })
  .refine((val) => val !== null, { error: t('schema.misc.object.required') });
