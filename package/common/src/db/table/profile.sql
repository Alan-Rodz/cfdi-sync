-- Definition ---------------------------------------------------------------------
CREATE TABLE profile (
 email               TEXT NOT NULL DEFAULT '',
 id                  UUID NOT NULL DEFAULT UUID_GENERATE_V4() REFERENCES auth.users ON DELETE CASCADE,
 img_url             TEXT NOT NULL DEFAULT '',
 name                TEXT NOT NULL DEFAULT '',

 created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('UTC'::text, NOW()),
 updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('UTC'::text, NOW()),

 PRIMARY KEY(id)
);

-- handle_updated_at_profile ------------------------------------------------------
CREATE TRIGGER handle_updated_at_profile BEFORE UPDATE ON profile
FOR EACH ROW EXECUTE PROCEDURE moddatetime(updated_at);

-- Function -----------------------------------------------------------------------
CREATE FUNCTION insert_profile()
RETURNS TRIGGER
SET search_path = ''
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- insert a new row into profile table
  INSERT INTO public.profile (id, email)
  VALUES (new.id, new.email);

  RETURN new;
END;
$$;

-- Trigger ------------------------------------------------------------------------
CREATE TRIGGER create_profile_on_auth_user_creation
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE insert_profile();
