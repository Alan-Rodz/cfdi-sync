import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Container, TextField } from '@mui/material';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';

import { getRegisterUserSchema, registerUserSchemaKeys, type RegisterUserData } from 'common';

import { webRouter } from '@/constant/route';
import { useLocale } from '@/ui/hook/useLocale';

// ********************************************************************************
// == Component ===================================================================
const RegisterPage = () => {
 const navigate = useNavigate();
 const { t } = useLocale();

 // -- Form -----------------------------------------------------------------------
 const defaultValues: RegisterUserData = { email: '', password: '', passwordConfirmation: '' };
 const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterUserData>({ resolver: zodResolver(getRegisterUserSchema(t)), defaultValues });

 // -- Handler --------------------------------------------------------------------
 const onSubmit = async (data: RegisterUserData) => {
  try {
   // const result = await authService.signup(data);
   // authService.setToken(result.token!);
   navigate({ to: webRouter.authed.dashboard.index });
  } catch (error) {
   console.error('Registration error:', error);
  }
 };

 // -- UI -------------------------------------------------------------------------
 return (
  <Container className='flex h-[70vh] items-center' component='main' maxWidth='xs'>
   <Box className='w-full'>
    <form onSubmit={handleSubmit(onSubmit)}>
     <Box className='flex flex-col gap-2'>
      <TextField
       {...register(registerUserSchemaKeys.email)}
       error={!!errors.email}
       fullWidth
       helperText={errors.email?.message}
       label={t('common.email')}
       type='email'
      />

      <TextField
       {...register(registerUserSchemaKeys.password)}
       error={!!errors.password}
       fullWidth
       helperText={errors.password?.message}
       label={t('common.password')}
       type='password'
      />

      <TextField
       {...register(registerUserSchemaKeys.passwordConfirmation)}
       error={!!errors.passwordConfirmation}
       fullWidth
       helperText={errors.passwordConfirmation?.message}
       label={t('common.confirm_password')}
       type='password'
      />

      <Button
       className='p-3'
       disabled={isSubmitting}
       type='submit'
      >
       {t('common.register')}
      </Button>

      <Box className='flex flex-col gap-1 items-center mt-2'>
       <Link to={webRouter.nonAuthed.login.index}><Button>{t('common.already_got_account')}</Button></Link>
       <Link to={webRouter.nonAuthed.recover_password}><Button>{t('common.forgot_password')}</Button></Link>
      </Box>
     </Box>
    </form>
   </Box>
  </Container>
 );
};

// == Export ======================================================================
export const Route = createFileRoute('/register')({ component: RegisterPage });
