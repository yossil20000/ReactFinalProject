import { OrdefStatus } from "./IAccount"
import { EAccountType } from "./IClub"
import { MemberType } from "./IMember"

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
    type: string
  }
  description: string,
  status: OrdefStatus,
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
    type: ""
  },
  description: "",
  status: OrdefStatus.CREATED,
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