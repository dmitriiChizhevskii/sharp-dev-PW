import appAxios from './appAxios';
type Key ='accessToken' | 'refreshToken';

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
}

const tokenResolver = new TokenResolver();
export default tokenResolver;