import { useDataGridProps } from "@mui/x-data-grid/DataGrid/useDataGridProps";
import { IAccount } from "./IAccount";
import { Status } from "./IStatus";
import { QuarterType } from "../../Utils/enums";

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
    bank_accoundt_id: string,
    bank_branch: string,
    bank_id: string
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

  },
  account_saving: [
    {
      _id: string,
      id: string,
      balance: number,
      description: string
    }
  ]
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
  account_saving: [
    {
      _id: string,
      id: string,
      balance: number,
      description: string
    }
  ]
}
export interface IUpdateAccountSaving {
  reserve_id: string,
  new_balance: number
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
  TRANSFER = "Transfer",
  REFUND = "Refund",
  VARIABLE = "Variable"
}
export enum Transaction_Type {
  CREDIT = "Credit",
  DEBIT = "Debit",
  TRANSFER = "Transfer"
}
export enum TransactionCombo_Type {
  CREDIT = "Credit",
  DEBIT = "Debit"
}
export enum Transaction_Calc_type {
  TRANSACTION = "TRANSACTION",
  AMOUNT = "AMOUNT"
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
  engine_fund_amount: number,
  type: Transaction_Type,
  order: {
    type: Transaction_OT,
    _id: string,
    quarter: QuarterType
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
  engine_fund_amount: number,
  source_balance: number,
  destination_balance: number,
  type: Transaction_Type,
  calculation_type: Transaction_Calc_type,
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
    if (item.calculation_type == Transaction_Calc_type.AMOUNT)
      return item.amount >= 0 ? "green" : "red";

    if (item.type.toLocaleUpperCase() === Transaction_Type.TRANSFER.toUpperCase()) {
      return 'gray';
    }

    if (item.type.toLocaleUpperCase() === Transaction_Type.CREDIT.toUpperCase())
      return "red"
    else if (accountId !== undefined && item.source.includes(accountId))
      return "red"
    else
      return "green";

  }

  static getAmount = (item: ITransaction, accountId: string | undefined, balance: boolean = false): number => {
    if (item.calculation_type == Transaction_Calc_type.AMOUNT)
      return balance ? Number(item.destination_balance.toFixed(2)) : Number(item.amount.toFixed(2))
    if (item.type.toLocaleUpperCase() === Transaction_Type.TRANSFER.toLocaleUpperCase())
      return item.amount;
    if (item.type.toLocaleUpperCase() === Transaction_Type.CREDIT.toLocaleUpperCase())
      return item.amount * -1
    else if (accountId !== undefined && item.destination.includes(accountId))
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

let newTransaction: IAddTransaction = {
  source: {
    _id: "",
    accountType: ""
  },
  destination: {
    _id: "",
    accountType: ""
  },
  amount: Number("0"),
  engine_fund_amount: Number("0"),
  type: Transaction_Type.DEBIT,
  order: {
    type: Transaction_OT.TRANSFER,
    _id: '',
    quarter: QuarterType.NONE
  },
  payment: {
    method: PaymentMethod.TRANSFER,
    referance: ''
  },
  description: '',
  date: new Date()
}
export type PayInfo = {
  selectedTransaction: IAddTransaction,
  recipe:IPaymentRecipe
}

export const newPayInfo = () : PayInfo =>{
  const transaction = newTransaction;
  transaction.order.type = Transaction_OT.TRANSFER
  const recipe =  getTransactionToPaymentReciept().getReciep(transaction)
  transaction.payment.referance = JSON.stringify(recipe)
  return {
    selectedTransaction: transaction,
    recipe: recipe
  }

}
export interface IPaymentRecipe {
  format: string;
  companyId: string;
  companyName: string;
  phone: string;
  email: string;
  to: string;
  reciepeId: string;
  date: Date;
  accountId: string;
  cardId: string;
  bank: string;
  branch: string;
  amount: number;
  tax: number;
  description: string
  referance: string;
  type: Transaction_Type

}
type rConvert = <T, U>(x: T) => U
interface IRecipeProcess<T, U> {
  convert(object: T): U
}
export class CPaymentRecipe<F , T> {
  private convert: (f:F,t?:T) => T;
/*   private from: F;*/
  private to: T | undefined; 
  constructor( convert : (f:F,t?:T) => T) {
   this.convert = convert
/*     this.from = from;*/
    
  }
  public getReciep(from:F,to?: T):T  {
    this.to = this.convert(from,to)
      return this.to;
  }
  public toString() : string {
    return this.to === undefined ? JSON.stringify({}) : JSON.stringify(this.to)
  }
  public toObject(object: string) : T {
    return object === undefined ? JSON.parse("") : JSON.parse(object)
  }
}
const ppp  = (x: IPaymentRecipe): IPaymentRecipe =>  x
const x: IPaymentRecipe = {
  format: "",
  companyId: "",
  companyName: "",
  phone: "",
  email: "",
  to: "",
  reciepeId: "",
  date: new Date(),
  accountId: "",
  cardId: "",
  bank: "",
  branch: "",
  amount: 0,
  tax: 0,
  description: "",
  referance: "",
  type: Transaction_Type.DEBIT
}
export const nameofFactory = <T>() => (name: keyof T) => name;

const convert = (f: ITransaction | IAddTransaction,t?:IPaymentRecipe) : IPaymentRecipe => {
  const s  = "IPaymentRecipe"
  
  /* const recipe : IPaymentRecipe = JSON.parse(f.payment.referance) */
  let reciept: IPaymentRecipe = {
    format: s.toString(),
    companyId: t ? t.companyId : "580091627",
    companyName: t ? t.companyName : "BAZ",
    phone: t ? t.phone : "0506523099",
    email: t ? t.email : "golan.bartal@gmail.com",
    to: t ? t.to : "",
    reciepeId: t ? t.reciepeId : "00000",
    date: f.date,
    accountId: t ? t.accountId : "",
    cardId: t ? t.cardId : "",
    bank: t ? t.bank : "",
    branch: t ? t.branch : "",
    amount: f.amount,
    tax: t ? t.tax : 0,
    description: f.description,
    referance: t ? t.referance : "",
    type: f ? f.type : Transaction_Type.DEBIT
  }
  return reciept;
}
const transactions: ITransaction = {
  _id: "",
  source: "",
  destination: "",
  amount: 0,
  engine_fund_amount: 0,
  source_balance: 0,
  destination_balance: 0,
  type: Transaction_Type.CREDIT,
  calculation_type: Transaction_Calc_type.AMOUNT,
  order: {
    type: Transaction_OT.FLIGHT,
    _id: ""
  },
  payment: {
    method: PaymentMethod.VISA,
    referance: ""
  },
  description: "",
  date: new Date()
}
export const  getTransactionToPaymentReciept = () => new CPaymentRecipe<ITransaction | IAddTransaction,IPaymentRecipe> (convert)
const ccc = new CPaymentRecipe<ITransaction,IPaymentRecipe> (convert)
const cccc = getTransactionToPaymentReciept()
getTransactionToPaymentReciept().getReciep(transactions)
console.error("ICLub/ccc",cccc.getReciep(transactions))
console.error("ICLub/toString",cccc.toString())
console.error("ICLub/fromString",cccc.toObject(cccc.toString()))