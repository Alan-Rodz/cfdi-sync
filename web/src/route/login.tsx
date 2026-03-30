import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Container, TextField } from '@mui/material';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';

import { getLoginSchema, loginSchemaKeys, type LoginData } from '@catenae/common';

import { webRouter } from '@/constant/route';
import { useLocale } from '@/ui/hook/useLocale';

// ********************************************************************************
// == Component ===================================================================
const LoginPage = () => {
 const navigate = useNavigate();
 const { t } = useLocale();

 // -- Form -----------------------------------------------------------------------
 const defaultValues: LoginData = { email: '', password: '' };
 const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginData>({ resolver: zodResolver(getLoginSchema(t)), defaultValues });

 // -- Handler --------------------------------------------------------------------
 const onSubmit = async (data: LoginData) => {
  console.log('Login data submitted:', data);
  navigate({ to: webRouter.authed.dashboard.index });
 };

 // -- UI -------------------------------------------------------------------------
 return (
  <Container component='main' maxWidth='xs' sx={{ alignItems: 'center', display: 'flex', height: '70vh' }}>
   <Box sx={{ width: '100%' }}>
    <form onSubmit={handleSubmit(onSubmit)}>
     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
       {...register(loginSchemaKeys.email)}
       label={t('common.email')}
       type='email'
       error={!!errors.email}
       helperText={errors.email?.message}
       fullWidth
      />

      <TextField
       {...register(loginSchemaKeys.password)}
       label={t('common.password')}
       type='password'
       error={!!errors.password}
       helperText={errors.password?.message}
       fullWidth
      />

      <Button
       type='submit'
       disabled={isSubmitting}
       style={{ padding: '0.75rem' }}
      >
       {t('common.login')}
      </Button>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mt: 2 }}>
       <Link to={webRouter.nonAuthed.register}><Button>{t('common.no_account_yet')}</Button></Link>
       <Link to={webRouter.nonAuthed.recover_password}><Button>{t('common.forgot_password')}</Button></Link>
      </Box>
     </Box>
    </form>
   </Box>
  </Container>
 );
};

// == Export ======================================================================
export const Route = createFileRoute(webRouter.nonAuthed.login.index)({ component: LoginPage });
