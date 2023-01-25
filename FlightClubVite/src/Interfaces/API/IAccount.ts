
import { IFilter } from "./IFilter"
import IMember from "./IMember"
import { Status } from "./IStatus"

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
export enum OrdefStatus {
  "CREATED"= "Created",
  "CLOSE" = "Close"
}
export interface IOrderType {
  operation: OT_OPERATION, 
  referance: OT_REF
}
export interface IOrderStatus {

}
export interface IProductBase {

}
export interface IProduct extends IProductBase {
  _id: string
}
export interface IOrderBase { 
  order_date: Date,
  product:  string,
  units: number,
  pricePeUnit: number,
  amount: number,
  orderType: IOrderType,
  desctiption: string,
  status: OrdefStatus,
  _idMember: string,
  orderBy: string
}
export class COrderCreate  implements IOrderBase {
  order_date: Date;
  product: string;
  units: number;
  pricePeUnit: number
  amount: number
  orderType: IOrderType
  desctiption: string
  status: OrdefStatus
  _idMember:  string
  orderBy: string
  constructor(){
    this.order_date= new Date();
   this.product= "";
  this.units =  0;
  this.pricePeUnit = 0;
  this.amount= 0;
  this.orderType= {operation: OT_OPERATION.CREDIT,referance: OT_REF.FLIGHT};
  this.desctiption = "";
  this.status= OrdefStatus.CREATED;
  this._idMember = "";
  this.orderBy = ""
  }
  copy(obj: IOrderBase): void {
    this.order_date = obj.order_date
    this.units = obj.units
    this.product = obj.product
    this.pricePeUnit = obj.pricePeUnit
    this.amount = obj.amount
    this.orderType = obj.orderType
    this.desctiption = obj.desctiption
    this.status = obj.status
    this._idMember = obj._idMember
    this.orderBy = obj.orderBy
  }
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
  member: {
    _id: string,
    member_id: string,
    first_name: string,
    family_name: string
  },
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
    member: {
      _id: "",
    member_id: "",
    first_name: "",
    family_name: ""
    },
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