import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';

import { frontendRoutes, getRecoverPasswordSchema, recoverPasswordSchemaKeys, type RecoverPasswordData } from 'common';

import { ensureProfileIs } from './guard';

import { useLocale } from '@/ui/hook/useLocale';

// ********************************************************************************
// == Component ===================================================================
const RecoverPasswordPage = () => {
 const { t } = useLocale();

 // -- Form -----------------------------------------------------------------------
 const defaultValues: RecoverPasswordData = { email: '' };
 const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RecoverPasswordData>({ resolver: zodResolver(getRecoverPasswordSchema(t)), defaultValues });

 // -- Handler --------------------------------------------------------------------
 const onSubmit = async (data: RecoverPasswordData) => {
  console.log('Recover password data submitted:', data);
 };

 // -- UI -------------------------------------------------------------------------
 return (
  <Container
   component='main'
   maxWidth='xs'
   sx={{
    alignItems: 'center',
    display: 'flex',
    minHeight: '70vh',
   }}
  >
   <Box sx={{ width: 1 }}>
    <Typography sx={{ mb: 2, textAlign: 'center' }} variant='h5'>{t('auth.recover_password')}</Typography>
    <Typography sx={{ mb: 3, textAlign: 'center' }} variant='body2'>{t('auth.recover_password_description')}</Typography>

    <form onSubmit={handleSubmit(onSubmit)}>
     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
       {...register(recoverPasswordSchemaKeys.email)}
       error={!!errors.email}
       fullWidth
       helperText={errors.email?.message}
       label={t('common.email')}
       type='email'
      />

      <Button
       disabled={isSubmitting}
       sx={{ p: 3 }}
       type='submit'
      >
       {t('common.send_email')}
      </Button>

      <Box
       sx={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        mt: 2,
       }}
      >
       <Link to={frontendRoutes.nonAuthed.login.index}><Button>{t('auth.already_got_account')}</Button></Link>
       <Link to={frontendRoutes.nonAuthed.register}><Button>{t('auth.no_account_yet')}</Button></Link>
      </Box>
     </Box>
    </form>
   </Box>
  </Container>
 );
};

// == Export ======================================================================
export const Route = createFileRoute(frontendRoutes.nonAuthed.recover_password)({
 beforeLoad: ensureProfileIs('loggedOut', frontendRoutes.authed.dashboard.index),
 component: RecoverPasswordPage,
});
