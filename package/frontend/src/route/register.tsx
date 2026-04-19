import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Container, TextField } from '@mui/material';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';

import { getRegisterUserSchema, registerUserSchemaKeys, frontendRoutes, type RegisterProfileData } from 'common';

import { ensureProfileIs } from './guard';

import { useAuth } from '@/ui/hook/useAuth';
import { useLocale } from '@/ui/hook/useLocale';

// ********************************************************************************
// == Component ===================================================================
const RegisterPage = () => {
 const navigate = useNavigate();
 const { t } = useLocale();
 const { register: registerAuth, isLoading, error: authError } = useAuth();

 // -- Form -----------------------------------------------------------------------
 const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<RegisterProfileData>({
  defaultValues: { email: '', password: '', passwordConfirmation: '' },
  resolver: zodResolver(getRegisterUserSchema(t)),
 });

 // -- Handler --------------------------------------------------------------------
 const onSubmit = async (data: RegisterProfileData) => {
  try {
   await registerAuth(data);
   navigate({ to: frontendRoutes.authed.dashboard.index });
  } catch (error) {
   const errorMessage = error instanceof Error ? error.message : t('auth.registration_failed');
   setError('root', { message: errorMessage });
  }
 };

 // -- UI -------------------------------------------------------------------------
 const disabled = isLoading || isSubmitting;
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
    <form onSubmit={handleSubmit(onSubmit)}>
     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

      {
       (errors.root || authError) && (
        <Box
         sx={{
          backgroundColor: 'error.main',
          borderRadius: 1,
          color: 'error.contrastText',
          fontSize: (theme) => theme.typography.body2.fontSize,
          p: 2,
         }}
        >
         {errors.root?.message || authError}
        </Box>
       )
      }

      <TextField
       {...register(registerUserSchemaKeys.email)}
       disabled={disabled}
       error={!!errors.email}
       fullWidth
       helperText={errors.email?.message}
       label={t('common.email')}
       type='email'
      />

      <TextField
       {...register(registerUserSchemaKeys.password)}
       disabled={disabled}
       error={!!errors.password}
       fullWidth
       helperText={errors.password?.message}
       label={t('auth.password')}
       type='password'
      />

      <TextField
       {...register(registerUserSchemaKeys.passwordConfirmation)}
       disabled={disabled}
       error={!!errors.passwordConfirmation}
       fullWidth
       helperText={errors.passwordConfirmation?.message}
       label={t('auth.confirm_password')}
       type='password'
      />

      <Button
       disabled={disabled}
       sx={{ p: 3 }}
       type='submit'
      >
       {disabled ? t('common.loading') : t('auth.register')}
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
       <Link to={frontendRoutes.nonAuthed.recover_password}><Button>{t('auth.forgot_password')}</Button></Link>
      </Box>
     </Box>
    </form>
   </Box>
  </Container>
 );
};

// == Export ======================================================================
export const Route = createFileRoute(frontendRoutes.nonAuthed.register)({
 beforeLoad: ensureProfileIs('loggedOut', frontendRoutes.authed.dashboard.index),
 component: RegisterPage,
});
