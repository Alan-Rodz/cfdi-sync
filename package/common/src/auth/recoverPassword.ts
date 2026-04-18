import { z } from 'zod';

import { englishTranslationFunction, LocaledTranslationFn } from '../locale/functionality';
import { getEmailSchema } from '../misc/email';

// ********************************************************************************
// == Type ========================================================================
export type RecoverPasswordData = z.infer<ReturnType<typeof getRecoverPasswordSchema>>;

// == Constant ====================================================================
export const recoverPasswordSchemaKeys: { [key in keyof RecoverPasswordData]: key; } = {
 email: 'email',
};

// == Schema ======================================================================
export const getRecoverPasswordSchema = (t: LocaledTranslationFn = englishTranslationFunction) =>
 z.object({ email: getEmailSchema(t) })
  .refine((val) => typeof val === 'object', { error: t('schema.misc.object.type') })
  .refine((val) => val !== null, { error: t('schema.misc.object.required') });
