import { LocaledTranslationFn } from 'common';

import { LoggerPort } from '../service/logger/type';

// ********************************************************************************
export type ControllerResponse<T = null> = {
 data: T | null;
 message: string;
 token?: string;
};

export type ControllerDependencies = {
 loggerPort: LoggerPort;
 t: LocaledTranslationFn;
};
