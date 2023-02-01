import { IAccount, IOrder } from "./IAccount";
import { Status } from "./IStatus";

export interface IClubAccountBase {
  
  accounts: [IAccount],
  transactions: [ITransaction],
  balance: number,
  desctiption: string,
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
export interface ITransactionBase {
  source: string,
  destination: string,
  amount: number,
  order: IOrder,
  desctiption: string
}

export interface ITransaction extends ITransactionBase {
  _id: string
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
    family_name: string
  }
}
export interface IClubAccountsCombo {
  _id: string,
  account_id: string,
  club: {
    brand: string,
    branch: string
  },
  accounts: IClubAccountCombo[]
}
