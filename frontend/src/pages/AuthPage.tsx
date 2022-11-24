import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { Box, Tab, Tabs, Grid, TextField, Button, Typography } from '@mui/material';

import { useTranslation } from 'react-i18next';

import { validateEmail } from '../utils/validations';
import AuthService from '../services/AuthService';

enum TabsEnum {
  SignIn,
  SignUp
}

export default function AuthPage({ authService }: { authService: AuthService}) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [currentTab, setCurrenTab] = useState<TabsEnum>(TabsEnum.SignIn);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleTabChange = (event: React.ChangeEvent<{}>, newTabIndex: TabsEnum) => {
    setCurrenTab(newTabIndex);
  };

  const handleSubmit = (e:React.ChangeEvent<{}>) => {
    e.preventDefault();

    if (currentTab === TabsEnum.SignUp && !name) {
      enqueueSnackbar(t('Check your name'), { variant: 'error' });
      return;
    }
    if (!email || validateEmail(email) === false) {
      enqueueSnackbar(t('Check your email'), { variant: 'error' });
      return;
    }
    if (!password) {
      enqueueSnackbar(t('Please check your password'), { variant: 'error' });
      return;
    }
    if (currentTab === TabsEnum.SignUp && password !== confirmPassword) {
      enqueueSnackbar(t('Please make sure your passwords match'), { variant: 'error' });
      return;
    }

    currentTab === TabsEnum.SignUp ? authService.signup({ name, email, password }) : authService.signin({ email, password })

  }

  return (
    <div className='centerIt designed'>
      <Grid item sx={{ maxWidth: 300 }}>
        <Typography variant="h5">{t('brand')}</Typography>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label={t('signIn')} />
          <Tab label={t('signUp')} />
        </Tabs>

        <Box
          sx={{
            marginTop: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {
                currentTab === TabsEnum.SignUp && (
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label={t('nameLabel')}
                    name="name"
                    type="text"
                    autoFocus
                    size="small"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                  />
                )
            }
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={t('emailLabel')}
              name="email"
              type="email"
              autoComplete="email"
              autoFocus
              size="small"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={t('passwordLabel')}
              type="password"
              id="password"
              autoComplete="current-password"
              size="small"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />
            {
              currentTab === TabsEnum.SignUp && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confrimPassword"
                  label={t('confirmPasswordLabel')}
                  type="password"
                  id="confirmPassword"
                  size="small"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                />
              )
            }
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {t('signIn')}
            </Button>
          </Box>
        </Box>
      </Grid>
    </div>
  )
}