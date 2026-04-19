-- insert a log into the database
CREATE OR REPLACE FUNCTION insert_log(input_text TEXT DEFAULT '')
RETURNS TABLE(inserted_log_id UUID)
SET search_path = ''
SECURITY DEFINER
AS $$
BEGIN
 INSERT INTO public.log (text) VALUES (input_text)
 RETURNING id INTO inserted_log_id;
 RETURN NEXT;
END;
$$ LANGUAGE plpgsql;
