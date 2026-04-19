import { Database } from '../../db/type';

// ********************************************************************************
// == Type ========================================================================
export type FullProfile = Profile & {}

export type Profile = Database['public']['Tables']['profile']['Row'];

export type ProfileIdObj = { profile_id: Profile['id']; };
