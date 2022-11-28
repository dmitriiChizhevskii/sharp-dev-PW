import { useEffect, useState } from 'react';
import {
  Box,
  CssBaseline
} from '@mui/material';

import { setWalletAction, setPartnersAction, setTransactionsAction } from '../../store/reducers/wallet/actionCreators';
import { useAppDispatch } from "../../hooks/redux";

import NewTransactionForm from './components/newTransactionForm';
import ApplicationBar from './components/applicationBar';
import TransactionTable from './components/transactionTable';

export default function MainPage() {
  const dispatch = useAppDispatch();
  const [newTransactionFormOpen, setNewTransactionFormOpen] = useState(false);

  useEffect(() => {
    dispatch(setWalletAction());
    dispatch(setPartnersAction());
    dispatch(setTransactionsAction());
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <ApplicationBar
        setNewTransactionFormOpen={setNewTransactionFormOpen}
      />
      <NewTransactionForm
        onClose={() => setNewTransactionFormOpen(false)}
        open={newTransactionFormOpen}
      />

      <div style={{ paddingTop: 64, width: '100%', minHeight: '100vh' }} className="designed">
        <TransactionTable />
      </div>
    </Box>
  );
}
