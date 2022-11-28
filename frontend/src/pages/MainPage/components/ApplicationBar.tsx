import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem
} from '@mui/material';

import { useAppSelector, useAppDispatch } from "../../../hooks/redux";
import { logoutAction, signInAction } from '../../../store/reducers/auth/actionCreators';

export default function ApplicationBar({
  setNewTransactionFormOpen
}: { setNewTransactionFormOpen: (p:boolean) => void}) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { name, email } = useAppSelector(state => state.auth.user);
  const wallet = useAppSelector(state => state.wallet.wallet);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    dispatch(logoutAction());
  }

  return (
    <AppBar>
      <Toolbar style={{ color: 'white', background: '#2E3B55' }}>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          {t('brand')}
        </Typography>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          {
            wallet && (
              <Typography style={{ paddingRight: 16 }}>
                {wallet.amountMajor} {wallet.currency}
              </Typography>
            )
          }

          
          <Button
            color="info"
            variant="outlined"
            onClick={() => setNewTransactionFormOpen(true)}
          >
            {t('add')}
          </Button>
          <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            style={{ color: 'white' }}
          >
            <span>
              {name} ({email})
            </span>
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem>{email}</MenuItem>
            <MenuItem onClick={handleLogout}>{t('Logout')}</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
} 