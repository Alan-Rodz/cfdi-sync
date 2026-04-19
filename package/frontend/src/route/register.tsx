import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Container, TextField } from '@mui/material';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';

import { getRegisterUserSchema, registerUserSchemaKeys, frontendRoutes, type RegisterProfileData } from 'common';

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
   const errorMessage = error instanceof Error ? error.message : t('common.registration_failed');
   setError('root', { message: errorMessage });
  }
 };

 // -- UI -------------------------------------------------------------------------
 const disabled = isLoading || isSubmitting;
 return (
  <Container className='flex h-[70vh] items-center' component='main' maxWidth='xs'>
   <Box className='w-full'>
    <form onSubmit={handleSubmit(onSubmit)}>
     <Box className='flex flex-col gap-2'>

      {
       (errors.root || authError) && (
        <Box className='bg-red-500 p-2 rounded text-white text-sm'>
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
       label={t('common.password')}
       type='password'
      />

      <TextField
       {...register(registerUserSchemaKeys.passwordConfirmation)}
       disabled={disabled}
       error={!!errors.passwordConfirmation}
       fullWidth
       helperText={errors.passwordConfirmation?.message}
       label={t('common.confirm_password')}
       type='password'
      />

      <Button
       className='p-3'
       disabled={disabled}
       type='submit'
      >
       {disabled ? t('common.loading') : t('common.register')}
      </Button>

      <Box className='flex flex-col gap-1 items-center mt-2'>
       <Link to={frontendRoutes.nonAuthed.login.index}><Button>{t('common.already_got_account')}</Button></Link>
       <Link to={frontendRoutes.nonAuthed.recover_password}><Button>{t('common.forgot_password')}</Button></Link>
      </Box>
     </Box>
    </form>
   </Box>
  </Container>
 );
};

// == Export ======================================================================
export const Route = createFileRoute(frontendRoutes.nonAuthed.register)({ component: RegisterPage });
