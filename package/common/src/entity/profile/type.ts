// ********************************************************************************
// == Type ========================================================================
export type FullProfile = Profile & {}

export type Profile = {
 email: string;
 id: string;
 img_url: string | null;
 name: string;

 created_at: string;
 updated_at: string;
};

export type ProfileIdObj = { profile_id: Profile['id']; };
