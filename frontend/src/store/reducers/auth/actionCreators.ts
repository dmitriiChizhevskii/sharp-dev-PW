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

    const res = await appAxios.post<User>('auth/check', {});
    dispatch(signIn(res.data));
    updateRefreshToken(() => dispatch(logout()));
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
    await await appAxios.post<Tokens>('auth/logout');
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

function parseTokenAndGetExpiredDate(token:string):number {
  const parsedToken = JSON.parse(window.atob(token.split('.')[1]));
  if (parsedToken) return parsedToken.exp;
  return 0;
}

let timer:ReturnType<typeof setTimeout> | null = null;

// Update access token two minutes before it's expriration time in silent mode.
async function updateRefreshToken(callback: () => void) {
  const UPDATE_BEFORE_MINUTES = 2;
  const expTime = parseTokenAndGetExpiredDate(tokenResolver.get('accessToken'));

  if (expTime) {
    const time = Math.max(expTime * 1000 - (UPDATE_BEFORE_MINUTES * 60 * 1000) - new Date().getTime(), 0);

    if (timer) clearTimeout(timer);

    timer = setTimeout(async () => {
      const res = await appAxios.post<Tokens>('auth/refresh', {}, {
        headers: {
          'Authorization': `Bearer ${tokenResolver.get('refreshToken')}`
        }
      });
      const { access_token, refresh_token } = res.data;
      if (access_token && refresh_token) {  // if it's ok, update httpService
        tokenResolver.set('accessToken', access_token, true);
        tokenResolver.set('refreshToken', refresh_token);
      } else { // if no, go to login page
        localStorage.clear();
        callback();
      }
    }, time)
  }
}
