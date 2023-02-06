
import { ThirtyFpsRounded } from "@mui/icons-material"
import { ITransaction } from "./IClub"
import { IFilter } from "./IFilter"
import IMember, { MemberType } from "./IMember"
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
  discount: number,
  amount: number,
  orderType: IOrderType,
  description: string,
  status: OrdefStatus,
  member: IMember | undefined,
  orderBy: string
}
export class COrderCreate  implements IOrderBase {
  order_date: Date;
  product: string;
  units: number;
  pricePeUnit: number;
  discount: number;
  amount: number
  orderType: IOrderType
  description: string
  status: OrdefStatus
  member:  IMember | undefined
  orderBy: string
  constructor(){
    this.order_date= new Date();
   this.product= "";
  this.units =  0;
  this.pricePeUnit = 0;
  this.discount = 0;
  this.amount= 0;
  this.orderType= {operation: OT_OPERATION.CREDIT,referance: OT_REF.FLIGHT};
  this.description = "";
  this.status= OrdefStatus.CREATED;
  this.member = undefined;
  this.orderBy = ""
  }
  copy(obj: IOrderBase): void {
    this.order_date = obj.order_date
    this.units = obj.units
    this.product = obj.product
    this.pricePeUnit = obj.pricePeUnit
    this.discount = obj.discount
    this.amount = obj.amount
    this.orderType = obj.orderType
    this.description = obj.description
    this.status = obj.status
    this.member = obj.member
    this.orderBy = obj.orderBy
  }
}

export interface IOrder extends IOrderBase {
  _id: string
}


export interface IAccountBase {
  account_id: string,
  member: {
    _id: string,
    member_id: string,
    first_name: string,
    family_name: string,
    member_type: MemberType
  },
  transactions: ITransaction[],
  balance: number,
  description: string,
  status: Status
}

export interface IAccount extends IAccountBase {
  _id: string
}
export const newAccount = ()  : IAccount => {
  let account : IAccount = {
    account_id: "",
    member: {
      _id: "",
    member_id: "",
    first_name: "",
    family_name: "",
    member_type: MemberType.Member
    },
    transactions: [],
    balance: 0,
    description: "",
    status: Status.Active,
    _id: ""
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