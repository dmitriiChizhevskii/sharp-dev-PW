import appAxios, { AxiosError } from '../../../infrastructure/appAxios';
import { AppDispatch } from '../../index';
import { signIn, logout } from './reducer';
import { User, Tokens } from './types';
import { setError } from '../error/reducer';
import tokenResolver from '../../../infrastructure/tokenResolver';

export const checkAuth = () => async (dispatch: AppDispatch) => {
  try {
    if (!tokenResolver.get('accessToken')) {
      dispatch(logout())
      return;
    }

    const res = await appAxios.get<User>('auth/check');
    dispatch(signIn(res.data));
    tokenResolver.updateRefreshToken(() => dispatch(logout()));
  } catch(e: any | AxiosError) {
    if (e.response && e.response.status === 401) {
      tokenResolver.delete('accessToken');
      tokenResolver.delete('refreshToken');
      dispatch(logout());
    }
    if (e.response) {
      dispatch(setError(`${e.response.status} ${e.response.statusText}`))
    } else {
      dispatch(setError(`${e.code} ${e.message}`))
    }
  }
}

export const signInAction = (data: Omit<User, 'name'|'sub'>) => async (dispatch: AppDispatch) => {
  try {
    const response = await await appAxios.post<Tokens>('auth/signin', data);
    const { access_token, refresh_token } = response.data;
    tokenResolver.set('accessToken', access_token, true);
    tokenResolver.set('refreshToken', refresh_token);
    dispatch(checkAuth());
  } catch(e: any | AxiosError) {
    if (e.response) {
      dispatch(setError(`${e.response.status} ${e.response.statusText}`))
    } else {
      dispatch(setError(`${e.code} ${e.message}`))
    }
  }
}

export const signUpAction = (data: Omit<User, 'sub'>) => async (dispatch: AppDispatch) => {
  try {
    const response = await await appAxios.post<Tokens>('auth/signup', data);
    const { access_token, refresh_token } = response.data;
    tokenResolver.set('accessToken', access_token, true);
    tokenResolver.set('refreshToken', refresh_token);
    dispatch(checkAuth());
  } catch(e: any | AxiosError) {
    if (e.response) {
      dispatch(setError(`${e.response.status} ${e.response.statusText}`))
    } else {
      dispatch(setError(`${e.code} ${e.message}`))
    }
  }
}

export const logoutAction = () => async (dispatch: AppDispatch) => {
  try {
    await await appAxios.get<Tokens>('auth/logout');
    tokenResolver.delete('accessToken');
    tokenResolver.delete('refreshToken');
    dispatch(logout());
  } catch(e: any | AxiosError) {
    if (e.response) {
      dispatch(setError(`${e.response.status} ${e.response.statusText}`))
    } else {
      dispatch(setError(`${e.code} ${e.message}`))
    }
  }
}

