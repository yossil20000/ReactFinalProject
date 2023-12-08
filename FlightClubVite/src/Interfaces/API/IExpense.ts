import { OrderStatus } from "./IAccount"
import { MemberType } from "./IMember"
export enum Utilizated {
  HOURS_0000= "HOURS_0000",
  HOURS_0100= "HOURS_0100",
  HOURS_0200= "HOURS_0200",
  HOURS_0500= "HOURS_0500",
  HOURS_1000= "HOURS_1000",
  HOURS_1500= "HOURS_1500",
  HOURS_2000= "HOURS_2000"
}
export interface IUpsertExpanse {
  filter?:{
  },
  update?: IExpense | IExpenseBase 
}

export interface IExpenseBase {
  date:Date,
  units: number,
  pricePeUnit: number,
  amount: number,
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