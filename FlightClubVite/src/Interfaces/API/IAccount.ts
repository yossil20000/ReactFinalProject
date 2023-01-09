
import { IFilter } from "./IFilter"
import {  Status } from "./IStatus"

export enum OT_OPERATION {
  CREDIT =  "Credit",
  DEBIT = "Debit"
}
export enum OT_REF {
  FLIGHT = "Flight",
  EXPENSE = "Expense",
  MONTLY = "Montly",
  OTHER = "Other"
}
export interface IOrderType {
  operation: OT_OPERATION, 
  referance: OT_REF
}
export interface IProductBase {

}
export interface IProduct extends IProductBase {
  _id: string
}
export interface IOrderBase { 
  order_date: Date,
  products:  IProduct[],
  units: number,
  pricePeUnit: number,
  amount: number,
  orderType: IOrderType,
  desctiption: string,
}

export interface IOrder extends IOrderBase {
  _id: string
}
export interface ITransactionBase {
  source: IAccount,
  destination: IAccount,
  amount: number,
  order:  IOrder,
  desctiption: string
}
export interface ITransaction extends ITransactionBase {
  _id: string
}

export interface IAccountBase {
  account_id: string,
  member: string,
  transactions: ITransaction[],
  balance: number,
  desctiption: string,
  status: Status
}

export interface IAccount extends IAccountBase {
  _id: string
}
export const newAccount = ()  : IAccountBase => {
  let account : IAccountBase = {
    account_id: "",
    member: "",
    transactions: [],
    balance: 0,
    desctiption: "",
    status: Status.Active
  }
  return account;
}
export interface IAccountsCombo {
  
  member: {
    _id: string,
    member_id: string,
    first_name: string,
    family_name: string,
  }

  account_id: string, 
  _id:string

}
export interface IAccountsComboFilter extends IFilter{
  filter?:{
      status: Status
  },
  select?: string,
  find_select?: {
      _id: string;
      device_id: number;
      engien_meter: number;
      maintanance: number;
  }
}