import { LocaledTranslationFn } from 'common';

import { LoggerPort } from '../service/logger/type';

// ********************************************************************************
export type ControllerResponse<T = null> = {
 data: T | null;
 message: string;
 supabaseAccessToken?: string;
 token?: string;
};

export type ControllerDependencies = {
 loggerPort: LoggerPort;
 t: LocaledTranslationFn;
};
