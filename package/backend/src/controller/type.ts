import { LocaledTranslationFn } from 'common';

// ********************************************************************************
export type ControllerResponse<T = null> = {
 data: T | null;
 message: string;
 token?: string;
};

export type ControllerDependencies = {
 t: LocaledTranslationFn;
};
