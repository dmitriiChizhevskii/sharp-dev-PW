import appAxios, { AxiosError } from '../../../infrastructure/appAxios';
import { AppDispatch } from '../../index';
import { setPartners, setWallet, setTransactions, addTransaction } from './reducer';
import { setError } from '../error/reducer';
import { Wallet, Partner, Transaction } from './types';

export const setWalletAction = () => async (dispatch: AppDispatch) => {
  try {
    const response = await appAxios.post<Wallet>('wallet/info');
    const wallet = response.data;
    dispatch(setWallet(wallet));
  } catch(e: any | AxiosError) {
    if (e.response) {
      dispatch(setError(`${e.response.status} ${e.response.statusText}`))
    } else {
      dispatch(setError(`${e.code} ${e.message}`))
    }
  }
}

export const setPartnersAction = () => async (dispatch: AppDispatch) => {
  try {
    const response = await appAxios.post<Partner[]>('user/list');
    const partners = response.data;
    dispatch(setPartners(partners));
  } catch(e: any | AxiosError) {
    if (e.response) {
      dispatch(setError(`${e.response.status} ${e.response.statusText}`))
    } else {
      dispatch(setError(`${e.code} ${e.message}`))
    }
  }
}

export const setTransactionsAction = () => async (dispatch: AppDispatch) => {
  try {
    const response = await appAxios.post<Transaction[]>('transaction/list');
    const transactions = response.data;
    dispatch(setTransactions(transactions));
  } catch(e: any | AxiosError) {
    if (e.response) {
      dispatch(setError(`${e.response.status} ${e.response.statusText}`))
    } else {
      dispatch(setError(`${e.code} ${e.message}`))
    }
  }
}

export const addTransactionAction = (receiverId: string, amount: number) => async (dispatch: AppDispatch) => {
  try {
    const response = await appAxios.post<Transaction>('transaction/add', { receiverId, amount });
    const transaction = response.data;
    dispatch(addTransaction(transaction));
  } catch(e: any | AxiosError) {
    if (e.response) {
      dispatch(setError(`${e.response.status} ${e.response.statusText}`))
    } else {
      dispatch(setError(`${e.code} ${e.message}`))
    }
  }
}