import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';

import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle
} from '@mui/material';
import { SelectChangeEvent } from "@mui/material";

import { UserInterface } from '../../../services/MoneyService';

export default function NewTransactionForm({
  addTransaction,
  onClose,
  open,
  usersState
}: {
  usersState: UserInterface[]
  open: boolean
  addTransaction(id:string, amount:number):void
  onClose():void
}) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const handleClose = () => {
    onClose();
  };

  const [receiverId, setReceiverId] = useState('');
  const [amount, setAmount] = useState<number | null>(null);

  const submitTransaction = async (e:React.ChangeEvent<{}>) => {
    e.preventDefault();
    if (!receiverId) {
      enqueueSnackbar(t('Choose receiver'), { variant: 'error' });
      return;
    }

    if (!amount || amount < 0 || Math.floor(amount) !== amount) {
      enqueueSnackbar(t('Choose correct sum'), { variant: 'error' });
      return;
    }
    addTransaction(receiverId, amount);
    setReceiverId('');
    setAmount(null);
    onClose();
  }

  return (
    <Dialog onClose={handleClose} open={open} sx={{
      "& .MuiDialog-container": {
        "& .MuiPaper-root": {
          width: "100%",
          maxWidth: "500px",  // Set your width here
        },
      },
    }}>
      <DialogTitle>{t('Make a transaction')}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={submitTransaction} noValidate>
          <Select
            fullWidth
            size="small"
            label={t('users')}
            id="demo-simple-select"
            value={receiverId}
            onChange={(e: SelectChangeEvent<string>) => setReceiverId(e.target.value)}
          >
            {
              usersState.map(({id, name, email}: { id: string, name: string, email:string}) => (
                <MenuItem key={id} value={id}>{name} ({email})</MenuItem>
              ))
            }
          </Select>
          <TextField
            margin="normal"
            required
            fullWidth
            id="sum"
            label={t('sumLabel')}
            name="sum"
            type="number"
            size="small"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(+e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {t('add')}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
} 