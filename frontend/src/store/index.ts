import { configureStore } from '@reduxjs/toolkit';
import authReducer  from './reducers/auth/reducer';
import errorReducer  from './reducers/error/reducer';
import walletReducer  from './reducers/wallet/reducer';

export const store = configureStore(
  {
    reducer: {
      auth: authReducer,
      error: errorReducer,
      wallet: walletReducer
    }
  }
)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch