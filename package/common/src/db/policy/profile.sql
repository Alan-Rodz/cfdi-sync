-- Select -------------------------------------------------------------------------
CREATE POLICY "Profiles are public for logged in users" ON profile 
FOR SELECT 
TO authenticated
USING (true);

-- Insert -------------------------------------------------------------------------
CREATE POLICY "Profiles can insert their own profiles" ON profile
FOR INSERT  
WITH CHECK (id = (SELECT auth.uid()));

-- Update -------------------------------------------------------------------------
CREATE POLICY "Profiles can update themselves" ON profile
FOR UPDATE 
USING (id = (SELECT auth.uid()));

-- Delete -------------------------------------------------------------------------
-- profiles are not meant to be deleted
