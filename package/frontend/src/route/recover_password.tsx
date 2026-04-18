import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';

import { getRecoverPasswordSchema, recoverPasswordSchemaKeys, type RecoverPasswordData } from 'common';

import { webRouter } from '@/constant/route';
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
  <Container component='main' maxWidth='xs' sx={{ alignItems: 'center', display: 'flex', height: '70vh' }}>
   <Box sx={{ width: '100%' }}>
    <Typography variant='h5' sx={{ mb: 2, textAlign: 'center' }}>{t('common.recover_password')}</Typography>
    <Typography variant='body2' sx={{ mb: 3, textAlign: 'center' }}>{t('common.recover_password_description')}</Typography>

    <form onSubmit={handleSubmit(onSubmit)}>
     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
       {...register(recoverPasswordSchemaKeys.email)}
       label={t('common.email')}
       type='email'
       error={!!errors.email}
       helperText={errors.email?.message}
       fullWidth
      />

      <Button
       type='submit'
       disabled={isSubmitting}
       style={{ padding: '0.75rem' }}
      >
       {t('common.send_email')}
      </Button>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mt: 2 }}>
       <Link to={webRouter.nonAuthed.login.index}><Button>{t('common.already_got_account')}</Button></Link>
       <Link to={webRouter.nonAuthed.register}><Button>{t('common.no_account_yet')}</Button></Link>
      </Box>
     </Box>
    </form>
   </Box>
  </Container>
 );
};

// == Export ======================================================================
export const Route = createFileRoute(webRouter.nonAuthed.recover_password)({ component: RecoverPasswordPage });
