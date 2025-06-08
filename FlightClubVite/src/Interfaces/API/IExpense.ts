import { OrderStatus } from "./IAccount"
import { MemberType } from "./IMember"
import { IExportExelTable } from "../IExport"
import { get, groupBy } from "lodash";
import { Dictionary } from "@reduxjs/toolkit";

export enum Utilizated {
  HOURS_0000 = "HOURS_0000",
  HOURS_0001 = "HOURS_0001",
  HOURS_0100 = "HOURS_0100",
  HOURS_0150 = "HOURS_0150",
  HOURS_0200 = "HOURS_0200",
  HOURS_0250 = "HOURS_0250",
  HOURS_0300 = "HOURS_0300",
  HOURS_0350 = "HOURS_0350",
  HOURS_0400 = "HOURS_0400",
  HOURS_0450 = "HOURS_0450",
  HOURS_0500 = "HOURS_0500",
  HOURS_1000 = "HOURS_1000",
  HOURS_1500 = "HOURS_1500",
  HOURS_2000 = "HOURS_2000"
}
export enum ESizePerUnit {
  UNIT = 'Unit',
  GALON_PER_HOUR = 'GalonPerHour',
  QUART = 'Quart',
  HOUR_AND_PART = 'H & Part',
  PACKAGE = 'Package'
}
export interface IUpsertExpanse {
  filter?: object,
  update?: IExpense | IExpenseBase
}

export interface IExpenseBase {
  date: Date,
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

export const newExpense: IExpenseBase = {
  date: new Date(),
  units: 0,
  pricePeUnit: 0,
  amount: 0,
  sizePerUnit: 'Unit',
  expense: {
    category: "",
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

export class CExpenseToReport {
  private expenses: IExpense[] = [];
  constructor(expenses: IExpense[]) {
    this.expenses = expenses;
  }
  getExpenseToExcel(file: string = "expenseReport", sheet: string = "Expenses", title: string = "Expense Reports"): IExportExelTable {
    let report: IExportExelTable = {
      file: file,
      sheet: sheet,
      title: title,
      header: [],
      body: [],
      save: false
    }
    this.getExpesesByCategory();
    report.header = ["Index", "Date", "Category", "Type", "Utilizated", "Units", "PricePerUnit", "Amount", "Description"];
    report.body = this.expenses.map((expense, i) => {
      return [i.toFixed(0), expense.date.getDisplayDate(), expense.expense.category, expense.expense.type, expense.expense.utilizated, expense.units.toFixed(1), expense.pricePeUnit.toFixed(1), expense.amount.toFixed(1), expense.description]
    })
    
    return report;
  }
  getExpesesByCategory(): Dictionary<IExpense[]> {
    let group = groupBy(this.expenses, tr => tr.expense.category);
    Object.keys(group).forEach(key => {
      console.info("CExpenseToReport/getExpesesByCategory/group", group[key]);
    })
    return group;
  }
}