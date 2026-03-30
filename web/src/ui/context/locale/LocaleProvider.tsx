'use client';

import { type FC, type PropsWithChildren, useEffect, useState } from 'react';

import { WEBSITE_NAME } from '@/constant/website';
import { commonTranslationFunctionality, FALLBACK_LANGUAGE_DATA, getLocaleObject, getLocaleSchema, type AppLocale, type LocaleData, type LocaledTranslationFn } from '@catenae/common';

import { LocaleContext } from './LocaleContext';

// ********************************************************************************
// == Constant ====================================================================
const LOCALE_STORAGE_ITEM = `${WEBSITE_NAME}-locale`;

export const LocaleProvider: FC<PropsWithChildren> = ({ children }) => {
 // -- State ---------------------------------------------------------------------
 const [currentLocale, setCurrentLocale] = useState<AppLocale>('EN');
 const [languageData, setLanguageData] = useState<LocaleData>(FALLBACK_LANGUAGE_DATA);

 // -- Effect --------------------------------------------------------------------
 useEffect(() => {
  const locale = localStorage.getItem(LOCALE_STORAGE_ITEM);
  if (!locale) { return/*nothing to do*/; }
  if (!getLocaleSchema().safeParse(locale).success) {
   localStorage.removeItem(LOCALE_STORAGE_ITEM);
   changeLocale('EN');
   return/*nothing left to do*/;
  } /* else -- valid */

  changeLocale(locale as AppLocale);
 }, [/*on mount*/]);

 // -- Handler -------------------------------------------------------------------
 const t: LocaledTranslationFn = (path, replacement) => commonTranslationFunctionality(languageData, path, replacement);

 const changeLocale = async (locale: AppLocale) => {
  const object = await getLocaleObject(locale);

  setCurrentLocale(locale);
  setLanguageData(object);

  localStorage.setItem(LOCALE_STORAGE_ITEM, locale);
 };

 // -- UI ------------------------------------------------------------------------
 return (
  <LocaleContext.Provider value={{ currentLocale, changeLocale, t }}>
   {children}
  </LocaleContext.Provider>
 );
};
