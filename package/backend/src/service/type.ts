import { ResponseStatus } from 'common';

// ********************************************************************************
export type ServiceResult<T = null> = {
 data: T | null;
 message: string;
 status: ResponseStatus;
 token?: string;
};
