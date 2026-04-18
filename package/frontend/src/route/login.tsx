import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Container, TextField } from '@mui/material';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';

import { getLoginSchema, loginSchemaKeys, type LoginData } from 'common';

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
  <Container className='flex h-[70vh] items-center' component='main' maxWidth='xs'>
   <Box className='w-full'>
    <form onSubmit={handleSubmit(onSubmit)}>
     <Box className='flex flex-col gap-2'>
      <TextField
       {...register(loginSchemaKeys.email)}
       error={!!errors.email}
       fullWidth
       helperText={errors.email?.message}
       label={t('common.email')}
       type='email'
      />

      <TextField
       {...register(loginSchemaKeys.password)}
       error={!!errors.password}
       fullWidth
       helperText={errors.password?.message}
       label={t('common.password')}
       type='password'
      />

      <Button
       className='p-3'
       disabled={isSubmitting}
       type='submit'
      >
       {t('common.login')}
      </Button>

      <Box className='flex flex-col gap-1 items-center mt-2'>
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
