import { enUS, es } from 'date-fns/locale';
import { z } from 'zod';

import englishLanguageData from './locales/EN.json';
// import spanishLanguageData from './locales/ES.json';

// ********************************************************************************
// == Type ========================================================================
export type AppLocale = 'EN' | 'ES';

// -- Generic ---------------------------------------------------------------------
export type NestedKeys<T> = T extends object
 ?
 {
  [K in keyof T]: K extends string
  ? T[K] extends object
  ? `${K}` | `${K}.${NestedKeys<T[K]>}`
  : `${K}`
  : never;
 }[keyof T]
 : never;

type LocalePath<T> = NestedKeys<T>;

export type AppLocaleObj = { locale: AppLocale; };

// -- Translation -----------------------------------------------------------------
export type TranslationReplacement = { [key: string]: string | number; };

export type TranslationFn<T> = (path: LocalePath<T>, replacement?: TranslationReplacement) => string;

export type LocaledTranslationFn = TranslationFn<LocaleJsonObj>;

// -- Data ------------------------------------------------------------------------
export type LocaleData = { [key: string]: string | LocaleData; };

// -- Usage -----------------------------------------------------------------------
export type LocaleJsonObj = typeof englishLanguageData;
export type LocaleKey = NestedKeys<LocaleJsonObj>;

// == Constant ====================================================================
export const appLocales: AppLocale[] = ['EN', 'ES'];

// NOTE: this is exposed so the front end uses it, where locale is stateful
export const FALLBACK_LANGUAGE_DATA = englishLanguageData;

export const commonTranslationFunctionality = (languageData: LocaleData, path: LocaleKey, replacement?: TranslationReplacement) => {
 const tokens = path.split('.');

 let translation = getTranslationFromData(languageData, tokens) ?? getTranslationFromData(FALLBACK_LANGUAGE_DATA, tokens);
 if (!translation) { return path; }
 if (!replacement) { return translation; }

 const keys = Object.keys(replacement);
 for (let i = 0; i < keys.length; i++) {
  translation = translation.replaceAll(`{{${keys[i]}}}`, String(replacement[keys[i]]));
 }
 return translation;
};

export const getLocaleObject = async (locale: AppLocale) => {
 switch (locale) {
  case 'EN': { return englishLanguageData; }
  case 'ES': { return englishLanguageData; }
  default: { return englishLanguageData; }
 }
};

export const getLocaleForDateFns = (locale: AppLocale) => {
 switch (locale) {
  case 'EN': return enUS;
  case 'ES': return es;
  default: return es;
 }
};

// == Defaults ====================================================================
// used on the server side as default for schemas
export const spanishTranslationFunction: LocaledTranslationFn = (path, replacement) =>
 commonTranslationFunctionality(FALLBACK_LANGUAGE_DATA, path, replacement);

export const englishTranslationFunction: LocaledTranslationFn = (path, replacement) =>
 commonTranslationFunctionality(englishLanguageData, path, replacement);

// == Schema ======================================================================
export const getLocaleSchema = (t: LocaledTranslationFn = spanishTranslationFunction) =>
 z.enum(['EN', 'ES'], { message: t('schema.misc.locale.one_of') });

// == Util ========================================================================
export const displayLocale = (locale: AppLocale): string => {
 switch (locale) {
  case 'EN': return 'English';
  case 'ES': return 'Español';
  default: return locale;
 }
};

const getTranslationFromData = (data: LocaleData, tokens: string[]): string | undefined => {
 for (let i = 0; i < tokens.length; i++) {
  const token = tokens[i];
  if (data[token] === undefined) { return undefined/*non existent*/; }

  data = data[token] as LocaleData;
 }

 if (typeof data !== 'string') { return undefined/*an object*/; }
 return data;
};
