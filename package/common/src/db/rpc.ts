import { Database } from './type';

// ********************************************************************************
export const rpcNames: { [K in keyof Database['public']['Functions']]: K; } = {
 // -- log ------------------------------------------------------------------------
 insert_log: 'insert_log'/*used by route*/,
};
