import { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { Routes, Route } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import { ProtectedRoute, Loader } from './components';
import { useAppSelector, useAppDispatch } from "./hooks/redux";
import { RootState } from "./store";
import './App.scss';
import './locales/i18n';

import MainPage from './pages/mainPage';

import tokenManager from './utils/tokenResolver';
import AuthPage from './pages/authPage';
import { AuthStatesEnum } from './store/reducers/auth/types';
import { checkAuth } from './store/reducers/auth/actionCreators';


axios.defaults.baseURL = process.env.REACT_APP_ENDPOINT;
axios.defaults.headers.common['Authorization'] = `Bearer ${tokenManager.get('accessToken')}`;

function App() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { state } = useAppSelector((state: RootState) => state.auth);
  const error = useAppSelector((state: RootState) => state.error.errorText);

  useEffect(() => {
    dispatch(checkAuth());
  }, []);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      setTimeout(() => {
        closeSnackbar();
      }, 5000)
    }
  }, [error]);


  if (state === AuthStatesEnum.pending) {
    return <Loader />
  }
  
  return (
    <Routes>
      <Route
        path="/auth"
        element={
          <AuthPage />
        }
      />

      <Route path="/" element={
        <ProtectedRoute state={state}>
          <MainPage />
        </ProtectedRoute>
       
      } />
      <Route path="*" element={
        <div className='centerIt'>
          {t('Page not found')}
        </div>
      }>
        
      </Route>
    </Routes>
  );
}

export default App;
