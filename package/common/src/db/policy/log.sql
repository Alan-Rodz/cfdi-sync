-- Select -------------------------------------------------------------------------
CREATE POLICY "Logs can be read by admins" ON log
FOR SELECT
USING (is_profile_admin((SELECT auth.uid())));

-- Insert -------------------------------------------------------------------------
-- Logs get inserted by an rpc call 

-- Update -------------------------------------------------------------------------
-- Logs are not meant to be updated

-- Delete -------------------------------------------------------------------------
-- Logs get deleted by a cron job when they are older than 30 days
