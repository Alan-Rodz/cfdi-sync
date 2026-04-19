import type { Database } from '../../db/type';
import type { Log } from './type';

// ********************************************************************************
// == Table =======================================================================
export const logTableName: Extract<keyof Database['public']['Tables'], 'log'> = 'log' as const;

// == Column ======================================================================
export const logTableColumns: { [key in keyof Log]: key } = {
 id: 'id',
 text: 'text',

 created_at: 'created_at',
} as const;
