'use client';

import { createContext } from 'react';

import type { AppLocale, LocaledTranslationFn } from '@catenae/common';

// ********************************************************************************
// == Type ========================================================================
type State = Readonly<{
 changeLocale: ((l: AppLocale) => Promise<void>) | null;
 currentLocale: AppLocale | null;
 t: LocaledTranslationFn | null;
}>;

// == Context =====================================================================
export const LocaleContext = createContext<State>({ currentLocale: null/*default*/, t: null/*default*/, changeLocale: null/*default*/ });
LocaleContext.displayName = 'LocaleContext';
