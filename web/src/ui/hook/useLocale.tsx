import { useContext } from 'react';

import { LocaleContext } from '../context/locale/LocaleContext';

// ********************************************************************************
// == Hook ========================================================================
export const useLocale = () => {
 const context = useContext(LocaleContext);

 const { changeLocale, currentLocale, t } = context;
 if (!changeLocale || !currentLocale || !t) { throw new Error('useLocale must be used within LocaleProvider'); }

 return { changeLocale, currentLocale, t };
};
