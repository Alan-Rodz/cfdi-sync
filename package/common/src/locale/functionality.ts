import { enUS, es } from 'date-fns/locale';
import { string } from 'yup';

import englishLanguageData from './locales/EN.json';

// ********************************************************************************
// == Type ========================================================================
// (SEE: package/common/src/db/enum.sql)
export enum AppLocale {
 EN = 'EN',
 ES = 'ES',
}

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

export type BoringHomesTranslationFn = TranslationFn<LocaleJsonObj>;

// -- Data ------------------------------------------------------------------------
export type LocaleData = { [key: string]: string | LocaleData; };

// -- Usage -----------------------------------------------------------------------
type LocaleJsonObj = typeof englishLanguageData;
export type LocaleKey = NestedKeys<LocaleJsonObj>;

// == Constant ====================================================================
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
  case AppLocale.EN: return englishLanguageData;
  // case AppLocale.ES: return spanishLanguageData;
  default: return englishLanguageData;
 }
};

export const getLocaleForDateFns = (locale: AppLocale) => {
 switch (locale) {
  case AppLocale.ES: return es;
  case AppLocale.EN: return enUS;
  default: return es;
 }
};

// == Defaults ====================================================================
// used on the server side as default for schemas
export const spanishTranslationFunction: BoringHomesTranslationFn = (path, replacement) =>
 commonTranslationFunctionality(FALLBACK_LANGUAGE_DATA, path, replacement);

export const englishTranslationFunction: BoringHomesTranslationFn = (path, replacement) =>
 commonTranslationFunctionality(englishLanguageData, path, replacement);

// == Schema ======================================================================
export const getLocaleSchema = (t: BoringHomesTranslationFn = spanishTranslationFunction) =>
 string()
  .typeError(t('schema.misc.locale.type'))
  .oneOf(Object.values(AppLocale), t('schema.misc.locale.one_of'))
  .required(t('schema.misc.locale.required'));

// == Util ========================================================================
export const displayLocale = (locale: AppLocale): string => {
 switch (locale) {
  case AppLocale.EN: return 'English';
  case AppLocale.ES: return 'Español';
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
