import { OrderStatus } from "./IAccount"
import { MemberType } from "./IMember"
export enum Utilizated {
  HOURS_0000= "HOURS_0000",
  HOURS_0001= "HOURS_0001",
  HOURS_0100= "HOURS_0100",
  HOURS_0150= "HOURS_0150",
  HOURS_0200= "HOURS_0200",
  HOURS_0250= "HOURS_0250",
  HOURS_0300= "HOURS_0300",
  HOURS_0350= "HOURS_0350",
  HOURS_0400= "HOURS_0400",
  HOURS_0450= "HOURS_0450",
  HOURS_0500= "HOURS_0500",
  HOURS_1000= "HOURS_1000",
  HOURS_1500= "HOURS_1500",
  HOURS_2000= "HOURS_2000"
}
export enum ESizePerUnit {
  UNIT = 'Unit',
  GALON_PER_HOUR= 'GalonPerHour',
  QUART = 'Quart',
  HOUR_AND_PART = 'H & Part',
  PACKAGE = 'Package'
}
export interface IUpsertExpanse {
  filter?:object,
  update?: IExpense | IExpenseBase 
}

export interface IExpenseBase {
  date:Date,
  units: number,
  pricePeUnit: number,
  amount: number,
  sizePerUnit: string,
  expense: {
    category: string,
    type: string,
    utilizated: Utilizated
  }
  description: string,
  status: OrderStatus,
  source: {
    id: string,
    type: MemberType,
    display: string,
    account_id: string
  }
  destination: {
    id: string,
    type: MemberType,
    display: string,
    account_id: string
  }
}
export interface IExpense extends IExpenseBase {
  _id: string
}

export const newExpense : IExpenseBase= {
  date: new Date(),
  units: 0,
  pricePeUnit: 0,
  amount: 0,
  sizePerUnit: 'Unit',
  expense: {
    category:"",
    type: "",
    utilizated: Utilizated.HOURS_0000
  },
  description: "",
  status: OrderStatus.CREATED,
  source: {
    id: "",
    type: MemberType.Member,
    display: "",
    account_id: ""
  },
  destination: {
    id: "",
    type: MemberType.Member,
    display: "",
    account_id: ""
  }
}