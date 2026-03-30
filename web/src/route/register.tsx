import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Container, TextField } from '@mui/material';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';

import { getRegisterUserSchema, registerUserSchemaKeys, type RegisterUserData } from '@catenae/common';

import { webRouter } from '@/constant/route';
import { authService } from '@/service/authService';
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
   const result = await authService.signup(data);
   authService.setToken(result.token!);
   navigate({ to: webRouter.authed.dashboard.index });
  } catch (error) {
   console.error('Registration error:', error);
  }
 };

 // -- UI -------------------------------------------------------------------------
 return (
  <Container component='main' maxWidth='xs' sx={{ alignItems: 'center', display: 'flex', height: '70vh' }}>
   <Box sx={{ width: '100%' }}>
    <form onSubmit={handleSubmit(onSubmit)}>
     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
       {...register(registerUserSchemaKeys.email)}
       label={t('common.email')}
       type='email'
       error={!!errors.email}
       helperText={errors.email?.message}
       fullWidth
      />

      <TextField
       {...register(registerUserSchemaKeys.password)}
       label={t('common.password')}
       type='password'
       error={!!errors.password}
       helperText={errors.password?.message}
       fullWidth
      />

      <TextField
       {...register(registerUserSchemaKeys.passwordConfirmation)}
       label={t('common.confirm_password')}
       type='password'
       error={!!errors.passwordConfirmation}
       helperText={errors.passwordConfirmation?.message}
       fullWidth
      />

      <Button
       type='submit'
       disabled={isSubmitting}
       style={{ padding: '0.75rem' }}
      >
       {t('common.register')}
      </Button>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mt: 2 }}>
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
