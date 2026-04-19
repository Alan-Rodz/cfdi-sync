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
  <Container className='flex h-[70vh] items-center' component='main' maxWidth='xs'>
   <Box className='w-full'>
    <Typography className='mb-2 text-center' variant='h5'>{t('auth.recover_password')}</Typography>
    <Typography className='mb-3 text-center' variant='body2'>{t('auth.recover_password_description')}</Typography>

    <form onSubmit={handleSubmit(onSubmit)}>
     <Box className='flex flex-col gap-2'>
      <TextField
       {...register(recoverPasswordSchemaKeys.email)}
       error={!!errors.email}
       fullWidth
       helperText={errors.email?.message}
       label={t('common.email')}
       type='email'
      />

      <Button
       className='p-3'
       disabled={isSubmitting}
       type='submit'
      >
       {t('common.send_email')}
      </Button>

      <Box className='flex flex-col gap-1 items-center mt-2'>
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
