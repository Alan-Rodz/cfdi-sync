import type { Database } from '../../db/type';
import type { AdminProfileRelation } from './type';

// ********************************************************************************
// == Table =======================================================================
export const adminProfileTableName: Extract<keyof Database['public']['Tables'], 'admin_profile'> = 'admin_profile' as const;

// == Column ======================================================================
export const adminProfileTableColumns: { [key in keyof AdminProfileRelation]: key } = {
 profile_id: 'profile_id',
} as const;
