import { z } from 'zod';

import { englishTranslationFunction, type LocaledTranslationFn } from '../locale/functionality';

// ********************************************************************************
// == Schema ======================================================================
export const getEmailSchema = (t: LocaledTranslationFn = englishTranslationFunction) =>
 z.email({ error: t('schema.misc.email.valid') })
  .refine((val) => typeof val === 'string', { error: t('schema.misc.email.type') })
  .nonempty({ error: t('schema.misc.email.required') });
