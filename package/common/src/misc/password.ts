import { z } from 'zod';

import { englishTranslationFunction, type LocaledTranslationFn } from '../locale/functionality';

// ********************************************************************************
// == Constant ====================================================================
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;

// == Schema ======================================================================
export const getPasswordSchema = (t: LocaledTranslationFn = englishTranslationFunction) =>
 z.string({ error: t('schema.misc.password.type') })
  .nonempty({ error: t('schema.misc.password.required') })
  .min(PASSWORD_MIN_LENGTH, { error: t('schema.misc.password.min', { min: PASSWORD_MIN_LENGTH }) })
  .max(PASSWORD_MAX_LENGTH, { error: t('schema.misc.password.max', { max: PASSWORD_MAX_LENGTH }) });
