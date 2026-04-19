-- Select -------------------------------------------------------------------------
CREATE POLICY "Profiles can see their own admin_profile rows" ON admin_profile
FOR SELECT
USING (profile_id = (SELECT id FROM profile WHERE id = (SELECT auth.uid())));

-- Insert -------------------------------------------------------------------------
-- admin_profile rows are not meant to be inserted

-- Update -------------------------------------------------------------------------
-- admin_profile rows are not meant to be updated

-- Delete -------------------------------------------------------------------------
-- admin_profile rows are not meant to be deleted
