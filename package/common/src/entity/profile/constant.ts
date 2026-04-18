import { Profile } from './type';

// ********************************************************************************
// == Table =======================================================================
export const profileTableName =  'profile' as const;

// == Column ======================================================================
export const profileTableColumns: { [key in keyof Profile]: key } = {
 email: 'email',
 id: 'id',
 img_url: 'img_url',
 name: 'name',

 created_at: 'created_at',
 updated_at: 'updated_at',
} as const;
