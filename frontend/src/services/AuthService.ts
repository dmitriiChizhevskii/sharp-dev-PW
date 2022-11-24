import { runInThisContext } from 'vm';
import HttpService from './HttpService';

export enum AuthStatesEnum {
  'pending' = 'pending',
  'allowed' = 'allowed',
  'denied' = 'denied'
}

export interface AuthDataInterface {
  sub: string;
  name: string
  email: string
  password: string
}

function getExpiredTime(token:string):number {
  const parsedToken = JSON.parse(window.atob(token.split('.')[1]));
  if (parsedToken) return parsedToken.exp;
  return 0;
}

export default class AuthService {
  userInfo:AuthDataInterface | undefined;

  state = AuthStatesEnum.pending;
  
  constructor(
    private httpService: HttpService,
    private dispatchStateChange: (value: AuthStatesEnum) => void
  ) {
    this.updateRefreshToken();
  }

  async checkAuth() {
    if (this.getAccessToken()) this.httpService.setToken(this.getAccessToken());
    const token = this.getAccessToken();
    if (!token) {
      this.state = AuthStatesEnum.denied;
      this.dispatchStateChange(this.state);
    } else {
      const res = await this.httpService.send('auth/check');
      if (res) {
        this.state = AuthStatesEnum.allowed;
        this.setUserInfo(res);
        this.dispatchStateChange(this.state);
      }
    }
  }

  async signin(data: Omit<AuthDataInterface, 'name'|'sub'>) {
    const { access_token, refresh_token } = await this.httpService.send('auth/signin', data);
    if (access_token && refresh_token) {
      this.setAcccessToken(access_token);
      this.setRefreshToken(refresh_token);
      await this.checkAuth();
      await this.updateRefreshToken();
    }
  }

  async signup(data: Omit<AuthDataInterface, 'sub'>) {
    const { access_token, refresh_token } = await this.httpService.send('auth/signup', data);
    if (access_token && refresh_token) {
      this.setAcccessToken(access_token);
      this.setRefreshToken(refresh_token);
      await this.checkAuth();
      await this.updateRefreshToken();
    }
  }

  async logout() {
    await this.httpService.send('auth/logout');
    this.setAcccessToken('');
    this.setRefreshToken('');
    this.state = AuthStatesEnum.denied;
    delete this.userInfo;
    this.dispatchStateChange(this.state);
  }

  timer:ReturnType<typeof setTimeout> | null = null;

  // Update access token two minutes before it's expriration time in silent mode.
  async updateRefreshToken() {
    const UPDATE_BEFORE_MINUTES = 2;
    const expTime = getExpiredTime(this.getAccessToken());

    if (expTime) {
      const timer = Math.max(expTime * 1000 - (UPDATE_BEFORE_MINUTES * 60 * 1000) - new Date().getTime(), 0);

      if (this.timer) clearTimeout(this.timer);
  
      this.timer = setTimeout(async () => {
        const { access_token, refresh_token } = await this.httpService.send('auth/refresh', {}, this.getRefrsehToken());
        if (access_token && refresh_token) {  // if it's ok, update httpService
          this.setAcccessToken(access_token);
          this.setRefreshToken(refresh_token);
          this.httpService.setToken(access_token)
        } else { // if no, go to login page
          localStorage.clear();
          this.state = AuthStatesEnum.denied;
        }
      }, timer)
    }
  }

  setUserInfo(userInfo:AuthDataInterface) {
    this.userInfo = userInfo;
  }

  getUserInfo() {
    return this.userInfo;
  }


  setAcccessToken(token:string) {
    localStorage.accessToken = token;
  }

  getAccessToken() {
    return localStorage.accessToken;
  }

  setRefreshToken(token:string) {
    localStorage.refreshToken = token;
  }

  getRefrsehToken() {
    return localStorage.refreshToken;
  }
}