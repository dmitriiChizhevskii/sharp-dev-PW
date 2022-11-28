import { Tokens } from '../store/reducers/auth/types';
import appAxios from './appAxios';
type Key ='accessToken' | 'refreshToken';

function parseTokenAndGetExpiredDate(token:string):number {
  const parsedToken = JSON.parse(window.atob(token.split('.')[1]));
  if (parsedToken) return parsedToken.exp;
  return 0;
}

let timer:ReturnType<typeof setTimeout> | null = null;

class TokenResolver {
  get(key: Key):string {
    return localStorage.getItem(key) as string;
  }

  set(key: Key, value: string, attachToHeader:boolean = false):void {
    localStorage.setItem(key, value);
    if (attachToHeader) appAxios.defaults.headers.common['Authorization'] = `Bearer ${value}`;
  }

  delete(key: Key):void {
    delete appAxios.defaults.headers.common['Authorization'];
    localStorage.removeItem(key);
  }

  updateRefreshToken(callback: () => void) {
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
}

const tokenResolver = new TokenResolver();
export default tokenResolver;