import { useState } from 'react';
import {
  Box,
  CssBaseline
} from '@mui/material';

import { AuthDataInterface } from '../../services/AuthService';
import { UserInterface, TransactionInterface, WalletInterface } from '../../services/MoneyService';

import NewTransactionForm from './components/NewTransactionForm';
import ApplicationBar from './components/ApplicationBar';
import TransactionTable from './components/TransactionTable';

export default function MainPage(
  { 
    userInfo,
    walletState,
    usersState,
    transactionsState,
    logout,
    addTransaction
  }: {
    userInfo: AuthDataInterface
    walletState: WalletInterface
    usersState: UserInterface[]
    transactionsState: TransactionInterface[]
    logout():void
    addTransaction(id:string, amount:number):void
  },
) {
  const [newTransactionFormOpen, setNewTransactionFormOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <ApplicationBar
        logout={logout}
        amountMajor={walletState.amountMajor}
        currency={walletState.currency}
        userName={userInfo.name}
        email={userInfo.email}
        setNewTransactionFormOpen={setNewTransactionFormOpen}
      />
      <NewTransactionForm
        addTransaction={addTransaction}
        onClose={() => setNewTransactionFormOpen(false)}
        open={newTransactionFormOpen}
        usersState={usersState}
      />

      <div style={{ paddingTop: 64, width: '100%' }} className="designed">
        <TransactionTable
          transactionsState={transactionsState}
          userInfo={userInfo}
          usersState={usersState}
        />
      </div>
    </Box>
  );
}
