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

interface Props {
  logout():void
  amountMajor: number
  currency: string
  userName: string
  email: string
  setNewTransactionFormOpen(value:boolean):void
}

export default function ApplicationBar({
  logout,
  amountMajor,
  currency,
  userName,
  email,
  setNewTransactionFormOpen
}: Props) {
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  }

  return (
    <AppBar>
      <Toolbar style={{ color: 'white', background: '#2E3B55' }}>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          {t('brand')}
        </Typography>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography style={{ paddingRight: 16 }}>
            {amountMajor} {currency}
          </Typography>
          
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
              {userName} ({email})
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