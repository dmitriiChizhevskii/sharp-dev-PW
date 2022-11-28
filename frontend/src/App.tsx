import { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { Routes, Route } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import { ProtectedRoute, Loader } from './components';
import { useAppSelector, useAppDispatch } from "./hooks/redux";
import './App.scss';
import './locales/i18n';

import MainPage from './pages/mainPage';

import AuthPage from './pages/authPage';
import { AuthStatesEnum } from './store/reducers/auth/types';
import { checkAuth } from './store/reducers/auth/actionCreators';

function App() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { state } = useAppSelector(state => state.auth);
  const error = useAppSelector(state => state.error.errorText);

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
