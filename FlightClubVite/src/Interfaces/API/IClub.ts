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
  TRANSFER = "Transfer"
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
      return balance ? Number(item.source_balance.toFixed(2)) : Number(item.amount.toFixed(2))
    if (item.type.toLocaleUpperCase() === Transaction_Type.TRANSFER.toLocaleUpperCase())
      return item.amount;
    if (item.type.toLocaleUpperCase() === Transaction_Type.CREDIT.toLocaleUpperCase())
      return item.amount * -1
    else if (accountId !== undefined && item.source.includes(accountId))
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
  referance: string

}
type rConvert = <T, U>(x: T) => U
interface IRecipeProcess<T, U> {
  convert(object: T): U
}
export class CPaymentRecipe<F , T> {
  private convert: (f:F) => T;
/*   private from: F;*/
  private to: T | undefined; 
  constructor( convert : (f:F) => T) {
   this.convert = convert
/*     this.from = from;*/
    
  }
  public getReciep(from:F):T  {
    this.to = this.convert(from)
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
  referance: ""
}
export const nameofFactory = <T>() => (name: keyof T) => name;

const convert = (f: ITransaction | IAddTransaction) : IPaymentRecipe => {
  const s  = "IPaymentRecipe"
  let reciept: IPaymentRecipe = {
    format: s.toString(),
    companyId: "580091627",
    companyName: "BAZ",
    phone: "0506523099",
    email: "golan.bartal@gmail.com",
    to: "",
    reciepeId: "",
    date: f.date,
    accountId: "",
    cardId: "",
    bank: "",
    branch: "",
    amount: f.amount,
    tax: 0,
    description: f.description,
    referance: ""
  }
  return reciept;
}
const transactions: ITransaction = {
  _id: "",
  source: "",
  destination: "",
  amount: 0,
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