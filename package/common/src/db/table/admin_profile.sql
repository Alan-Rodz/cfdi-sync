-- Definition ---------------------------------------------------------------------
CREATE TABLE admin_profile (
 profile_id          UUID NOT NULL REFERENCES profile(id) ON DELETE CASCADE,  
 PRIMARY KEY(profile_id)
);
