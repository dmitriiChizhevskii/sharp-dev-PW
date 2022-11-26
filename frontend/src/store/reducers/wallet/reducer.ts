import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Partner, Wallet, Transaction, State } from './types';

const initialState: State = {
  wallet: {} as Wallet,
  partners: [],
  transactions: []
}

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWallet: (state, action: PayloadAction<Wallet>) => {
      state.wallet = action.payload;
    },
    setPartners: (state, action: PayloadAction<Partner[]>) => {
      state.partners = action.payload;
    },
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload);
    }
  },
})

export const { setWallet, setPartners, setTransactions, addTransaction } = walletSlice.actions

export default walletSlice.reducer