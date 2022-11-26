import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthState, AuthStatesEnum, User } from './types';

const initialState: AuthState = {
  state: AuthStatesEnum.pending,
  user: {} as User
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn(state, action: PayloadAction<User>) {
      state.state = AuthStatesEnum.allowed;
      state.user = action.payload;
    },
    signUp(state, action: PayloadAction<User>) {
      state.state = AuthStatesEnum.allowed;
      state.user = action.payload;
    },
    logout(state) {
      state.state = AuthStatesEnum.denied;
      state.user = {} as User
    }
  },
})

export const { signIn, signUp, logout } = authSlice.actions

export default authSlice.reducer