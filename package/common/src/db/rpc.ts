import { Database } from './type';

// ********************************************************************************
export const rpcNames: { [K in keyof Database['public']['Functions']]: K; } = {
 // -- admin_profile --------------------------------------------------------------
 is_profile_admin: 'is_profile_admin'/*used by rls*/,

 // -- log ------------------------------------------------------------------------
 insert_log: 'insert_log'/*used by backend*/,
};
