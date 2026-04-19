import { ResponseStatus } from 'common';

// ********************************************************************************
export type ServiceResult<T = null> = {
 data: T | null;
 message: string;
 status: ResponseStatus;
 supabaseAccessToken?: string;
 token?: string;
};
