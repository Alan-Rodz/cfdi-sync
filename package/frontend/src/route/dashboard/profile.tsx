import { Alert, Box, Button, Card, CardContent, TextField, Typography } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

import { frontendRoutes } from 'common';

import { useAuth } from '@/ui/hook/useAuth';

import { ensureProfileIs } from '../guard';

// ********************************************************************************
// == Component ===================================================================
const ProfilePage = () => {
 const { error, isLoading, profile, updateProfileName } = useAuth();

 // -- State ----------------------------------------------------------------------
 const [isSaving, setIsSaving] = useState(false);
 const [name, setName] = useState('');
 const [successMessage, setSuccessMessage] = useState<string | null>(null);

 // -- Effect ---------------------------------------------------------------------
 useEffect(() => {
  setName(profile?.name ?? '');
 }, [profile?.name]);

 // -- Handler --------------------------------------------------------------------
 const handleSave = async () => {
  if (!name.trim()) {
   setSuccessMessage(null);
   return;
  } /* else -- valid name */

  setIsSaving(true);
  setSuccessMessage(null);
  try {
   await updateProfileName({ name: name.trim() });
   setSuccessMessage('Profile name updated successfully.');
  } finally {
   setIsSaving(false);
  }
 };

 // -- UI -------------------------------------------------------------------------
 return (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 640, p: 2 }}>
   <Typography variant='h4'>My Profile</Typography>

   <Card>
    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
     <TextField disabled label='Email' value={profile?.email ?? ''} />
     <TextField
      label='Name'
      onChange={(event) => setName(event.target.value)}
      value={name}
     />
     <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Button disabled={isLoading || isSaving || !name.trim()} onClick={handleSave} variant='contained'>
       {isSaving ? 'Saving...' : 'Save'}
      </Button>
     </Box>
    </CardContent>
   </Card>

   {successMessage && <Alert severity='success'>{successMessage}</Alert>}
   {error && <Alert severity='error'>{error}</Alert>}
  </Box>
 );
};

// == Export ======================================================================
export const Route = createFileRoute(frontendRoutes.authed.dashboard.index)({
 beforeLoad: ensureProfileIs('loggedIn', frontendRoutes.nonAuthed.login.index),
 component: ProfilePage,
});
