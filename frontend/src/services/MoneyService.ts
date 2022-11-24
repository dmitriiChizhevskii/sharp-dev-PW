import HttpService from "./HttpService";


export interface UserInterface {
  createdAt: string
  email: string
  id: string
  name: string
}

export interface WalletInterface {
  amountMajor: number
  amountMinor: number
  currency: string
}

export interface TransactionInterface {
  amountMajor: number
  amountMinor: number
  createdAt: string
  currency: string
  id: string
  receiverId: string
  senderId: string
  updatetAt: string
}
export default class MoneyService {

  data:WalletInterface | undefined;

  users:UserInterface[] = [];

  transactions:TransactionInterface[] = [];

  constructor(private httpService: HttpService) {}

  async getWallet() {
    const data = await this.httpService.send('wallet/info');
    this.data = data;
  }

  async getUsers() {
    const users = await this.httpService.send('user/list');
    this.users = users;
  }

  async addTransaction(receiverId:string, amount:number) {
    const transaction = await this.httpService.send('transaction/add', { receiverId, amount });
    this.transactions.unshift(transaction);
    return this.transactions;
  }

  async getTransactions() {
    const transactions = await this.httpService.send('transaction/list');
    this.transactions = transactions;
  }
}