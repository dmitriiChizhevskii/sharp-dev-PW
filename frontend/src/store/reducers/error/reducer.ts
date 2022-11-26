import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ErrorState } from './types';

const initialState: ErrorState = {
  errorText: ''
}

export const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string>) => {
      state.errorText = action.payload;
    }
  },
})

export const { setError } = errorSlice.actions

export default errorSlice.reducer