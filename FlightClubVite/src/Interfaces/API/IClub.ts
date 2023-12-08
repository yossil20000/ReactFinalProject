import { IAccount } from "./IAccount";
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
export interface IClubAccountSaving {
  _id: string;
  balance: number,
  club: {
      account_id: string,
      brand: string,
      branch: string,
      _id: string
  },
  reserve: [
      {
          _id: string,
          id: string,
          balance:number,
          description: string
      }
  ]
}
export interface IUpdateAccountSaving {
  reserve_id: string,
  new_balance : number
}
export enum EAccountType {
  EAT_BANK = "100100",
  EAT_ACCOUNT = '200200',
  EAT_SUPPLIERS = '200300'
}
export enum Transaction_OT {
  FLIGHT = "Flight",
  EXPENSE = "Expense",
  MONTLY = "Montly",
  ORDER = 'Order',
  OTHER = "Other",
  TRANSFER = "Transfer"
}
export enum Transaction_Type {
  CREDIT = "Credit",
  DEBIT = "Debit",
  TRANSFER = "Transfer"
}
export enum PaymentMethod {

  VISA = "VISA",
  CHECK = "CHECK",
  TRANSFER = "TRANSFER",
  NONE = "NONE"
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
  type: Transaction_Type,
  order: {
    type: Transaction_OT,
    _id: string
  },
  payment: {
    method: PaymentMethod,
    referance: string
  },
  description: string,
  date: Date
}

export interface ITransactionBase {
  source: string,
  destination: string,
  amount: number,
  type: Transaction_Type,
  order: {
    type: Transaction_OT,
    _id: string
  },
  payment: {
    method: PaymentMethod,
    referance: string
  },
  description: string,
  date: Date
}

export interface ITransaction extends ITransactionBase {
  _id: string
}
export class CTransaction {

  static getAccountSign = (item: ITransaction, accountId: string | undefined): string => {
    CustomLogger.info("CTransaction/item", item, item.type, Transaction_Type.CREDIT)
    if (item.type.toLocaleUpperCase() === Transaction_Type.TRANSFER.toUpperCase()) {
      return 'gray';
    }
    if (item.type.toLocaleUpperCase() === Transaction_Type.CREDIT.toUpperCase())
    return "red"
    else if (accountId !== undefined && item.source.includes(accountId) )
      return "red"
    else
      return "green";

  }

  static getAmount = (item: ITransaction, accountId: string | undefined): number => {
    if (item.type.toLocaleUpperCase() === Transaction_Type.TRANSFER.toLocaleUpperCase())
      return item.amount;
    if (item.type.toLocaleUpperCase() === Transaction_Type.CREDIT.toLocaleUpperCase())
    return item.amount * -1
    else if (accountId !== undefined && item.source.includes(accountId) )
      return item.amount * -1
    else
      return item.amount

  }
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
    first_name: string,
    member_type: string
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
