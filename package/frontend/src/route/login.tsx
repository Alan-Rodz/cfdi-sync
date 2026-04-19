import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Container, TextField } from '@mui/material';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';

import { frontendRoutes, getLoginSchema, type LoginData, loginSchemaKeys } from 'common';

import { useAuth } from '@/ui/hook/useAuth';
import { useLocale } from '@/ui/hook/useLocale';

// ********************************************************************************
// == Component ===================================================================
const LoginPage = () => {
 const navigate = useNavigate();
 const { t } = useLocale();
 const { login, isLoading, error: authError } = useAuth();

 // -- Form -----------------------------------------------------------------------
 const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<LoginData>({
  defaultValues: { email: '', password: '' },
  resolver: zodResolver(getLoginSchema(t)),
 });

 // -- Handler --------------------------------------------------------------------
 const onSubmit = async (data: LoginData) => {
  try {
   await login(data.email, data.password);
   navigate({ to: frontendRoutes.authed.dashboard.index });
  } catch (err) {
   const errorMessage = err instanceof Error ? err.message : t('common.login_failed');
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
       {...register(loginSchemaKeys.email)}
       disabled={disabled}
       error={!!errors.email}
       fullWidth
       helperText={errors.email?.message}
       label={t('common.email')}
       type='email'
      />

      <TextField
       {...register(loginSchemaKeys.password)}
       disabled={disabled}
       error={!!errors.password}
       fullWidth
       helperText={errors.password?.message}
       label={t('common.password')}
       type='password'
      />

      <Button
       className='p-3'
       disabled={disabled}
       type='submit'
      >
       {disabled ? t('common.loading') : t('common.login')}
      </Button>

      <Box className='flex flex-col gap-1 items-center mt-2'>
       <Link to={frontendRoutes.nonAuthed.register}><Button>{t('common.no_account_yet')}</Button></Link>
       <Link to={frontendRoutes.nonAuthed.recover_password}><Button>{t('common.forgot_password')}</Button></Link>
      </Box>
     </Box>
    </form>
   </Box>
  </Container>
 );
};

// == Export ======================================================================
export const Route = createFileRoute(frontendRoutes.nonAuthed.login.index)({ component: LoginPage });
