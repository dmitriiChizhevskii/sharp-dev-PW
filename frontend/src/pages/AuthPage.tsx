import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Box, Tab, Tabs, Grid, TextField, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { validateEmail } from '../utils/validations';
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import { signInAction, signUpAction } from '../store/reducers/auth/actionCreators';
import { AuthStatesEnum } from '../store/reducers/auth/types';
import { RootState } from "../store";

enum TabsEnum {
  SignIn,
  SignUp
}

export default function AuthPage() {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { state } = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (state === AuthStatesEnum.allowed) navigate('/');
  }, [state]);
  

  const [currentTab, setCurrenTab] = useState<TabsEnum>(TabsEnum.SignIn);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleTabChange = (event: React.ChangeEvent<{}>, newTabIndex: TabsEnum) => {
    setCurrenTab(newTabIndex);
  };

  const handleSubmit = async (e:React.ChangeEvent<{}>) => {
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

    currentTab === TabsEnum.SignIn && await dispatch(signInAction({ email, password }));
    currentTab === TabsEnum.SignUp && await dispatch(signUpAction({ name, email, password }));
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
                    onChange={(e) => setName(e.target.value)}
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
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
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
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              )
            }
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {t(currentTab === TabsEnum.SignIn ? 'signIn' : 'signUp')}
            </Button>
          </Box>
        </Box>
      </Grid>
    </div>
  )
}