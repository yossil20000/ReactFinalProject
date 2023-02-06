import { OrdefStatus } from "./IAccount"
import { EAccountType } from "./IClub"

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
  expense: string,
  description: string,
  status: OrdefStatus,
  source: {
    id: string,
    type: EAccountType
  }
  destination: {
    id: string,
    type: EAccountType
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
  expense: "",
  description: "",
  status: OrdefStatus.CREATED,
  source: {
    id: "",
    type: EAccountType.EAT_ACCOUNT
  },
  destination: {
    id: "",
    type: EAccountType.EAT_ACCOUNT
  }
}