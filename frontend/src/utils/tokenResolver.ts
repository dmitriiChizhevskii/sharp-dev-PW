import axios from 'axios';
type Key ='accessToken' | 'refreshToken';

class TokenManager {
  get(key: Key):string {
    return localStorage.getItem(key) as string;
  }

  set(key: Key, value: string, attachToHeader:boolean = false):void {
    localStorage.setItem(key, value);
    if (attachToHeader) axios.defaults.headers.common['Authorization'] = `Bearer ${value}`;
  }

  delete(key: Key):void {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem(key);
  }
}

const tokenManager = new TokenManager();
export default tokenManager;