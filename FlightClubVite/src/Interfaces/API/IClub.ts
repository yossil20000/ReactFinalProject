import { IAccount, IAccountsCombo, IOrder } from "./IAccount";
import { Status } from "./IStatus";

export interface IClubAccountBase {
  
  accounts: [IAccount],
  transactions: [ITransaction],
  balance: number,
  description: string,
  status: Status,
  club: {
    account_id: string,
    brand: string,
    branch: string,
  },
  contact: {
    address: {
      line1: string,
      line2: string,
      city: string,
      postcode: string,
      province: string,
      state: string,
    },
    phone: {
      country: string,
      area: string,
      number: string,
    },
    email: string,

  }
}

export interface IClubAccount extends IClubAccountBase {
  _id: string
}
export enum EAccountType {
  EAT_BANK= "100100",
  EAT_ACCOUNT= '200200',
  EAT_SUPPLIERS = '200300'
}
export enum Transaction_OT {
  FLIGHT = "Flight",
  EXPENSE = "Expense",
  MONTLY = "Montly",
  ORDER = 'Order',
  OTHER = "Other"
}
export interface IAddTransaction {
  source: {
    _id: string,
    accountType: string
  },
  destination: {
    _id: string,
    accountType: string
  },
  amount: number,
  order: {
    type: Transaction_OT,
    _id: string
  }
  description: string,
  date: Date
}

export interface ITransactionBase {
  source: string,
  destination: string,
  amount: number,
  order: {
    type: Transaction_OT,
    _id: string
  }
  description: string,
  date: Date
}

export interface ITransaction extends ITransactionBase {
  _id: string
}


export interface IClubAddAccount {
  
}
export interface IClubAddAccount {
  _id: string,
  account_id: string
}
export interface IClubAccountCombo {
  
  _id: string,
  account_id: string,
  member: {
    _id: string,
    member_id: string,
    family_name: string,
    member_type : string
  }
}
export interface IClubAccountsCombo {
  _id: string,
  account_id: string,
  club: {
    brand: string,
    branch: string,
    account_id: string
  },
  accounts: IClubAccountCombo[]
}
