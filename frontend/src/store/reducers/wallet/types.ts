export interface Partner {
  createdAt: string
  email: string
  id: string
  name: string
}

export interface Wallet {
  amountMajor: number
  amountMinor: number
  currency: string
}

export interface Transaction {
  amountMajor: number
  amountMinor: number
  createdAt: string
  currency: string
  id: string
  receiverId: string
  senderId: string
  updatetAt: string
}

export interface State {
  wallet: Wallet
  partners: Partner[],
  transactions: Transaction[]
}