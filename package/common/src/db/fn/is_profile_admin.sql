-- check if a profile is admin
CREATE OR REPLACE FUNCTION is_profile_admin(input_profile_id UUID)
RETURNS BOOLEAN
SET search_path = ''
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    is_admin BOOLEAN;
BEGIN
    SELECT TRUE INTO is_admin
    FROM public.admin_profile
    WHERE profile_id = input_profile_id;

    IF FOUND THEN
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$;
