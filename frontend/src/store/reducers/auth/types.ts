export enum AuthStatesEnum {
  'pending' = 'pending',
  'allowed' = 'allowed',
  'denied' = 'denied'
}

export interface User {
  sub: string
  name: string
  email: string
  password: string
}

export interface AuthState {
  state: AuthStatesEnum
  user: User
}

export type Tokens = {
  access_token: string;
  refresh_token: string;
};
