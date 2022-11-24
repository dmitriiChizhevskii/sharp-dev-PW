import { useEffect, useState } from 'react';
import { ThemeProvider } from "@mui/material";
import { useSnackbar } from 'notistack';

import CircularProgress from '@mui/material/CircularProgress';

import './App.scss';

import './locales/i18n';
import { theme } from "./theme";

import MainPage from './pages/MainPage/MainPage';
import AuthPage from './pages/AuthPage';

import HttpService from './services/HttpService';
import AuthService, { AuthStatesEnum } from './services/AuthService';
import { AuthDataInterface } from './services/AuthService';
import MoneyService, { TransactionInterface, UserInterface, WalletInterface } from './services/MoneyService';


function App() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [state, setState] = useState<AuthStatesEnum>();
  const [error, setError] = useState('');

  const [services, setServices] = useState<{[key: string]: any}>({});


  const [userInfo, setUserInfo] = useState<AuthDataInterface>();
  const [walletState, setWalletState] = useState<WalletInterface>();
  const [usersState, setUsersState] = useState<UserInterface[]>();
  const [transactionsState, setTransactionsState] = useState<TransactionInterface[]>();

  useEffect(() => {
    const httpService = new HttpService(process.env.REACT_APP_ENDPOINT, setError);
    const moneyService = new MoneyService(httpService);
    const authService = new AuthService(httpService, async (st:AuthStatesEnum) => {
      if (st === AuthStatesEnum.allowed) {
        await moneyService.getWallet();
        await moneyService.getUsers();
        await moneyService.getTransactions();
        setState(st);

        setUserInfo(authService.userInfo);
        setWalletState(moneyService.data);
        setUsersState(moneyService.users);
        setTransactionsState(moneyService.transactions);

      } else {
        setState(st);
      }
    });

    authService.checkAuth()
    
    setServices({ httpService, authService, moneyService });
  }, []);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      setError('')
    }
  }, [error]);
  

  return (
    <ThemeProvider theme={theme}>
        {
          state === AuthStatesEnum.pending && (
            <div className='centerIt'>
              <CircularProgress />
            </div>
          )
        }
        {
          state === AuthStatesEnum.denied && (
            <AuthPage
              authService={services.authService}
            />
          )
        }

        {
          (
            state === AuthStatesEnum.allowed
            && userInfo
            && walletState
            && usersState
            && transactionsState
          ) && (
            <MainPage
              userInfo={userInfo}
              walletState={walletState}
              usersState={usersState}
              transactionsState={transactionsState}
              logout={() => services.authService.logout()}
              addTransaction={async (id:string, amount:number) => {
                const transactions = await services.moneyService.addTransaction(id, amount);
                setTransactionsState([...transactions]);
              }}
            />
          )
        }
    </ThemeProvider>
  );
}

export default App;
