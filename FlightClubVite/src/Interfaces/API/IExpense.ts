import { OrderStatus } from "./IAccount"
import { MemberType } from "./IMember"
import { ExportExpensesType, getNewExportExpensesType, IExportExelTable, MapTotal } from "../IExport"
import { get, groupBy } from "lodash";
import { Dictionary } from "@reduxjs/toolkit";
import { customLogger } from "../../customLogging";

/**
 * Represents the possible utilization time slots for an expense.
 * Each value corresponds to a specific number of hours, formatted as "HOURS_xxxx",
 * where "xxxx" indicates the time in hours and minutes (e.g., "HOURS_0001" for 1 hour).
 * The "HOURS_UPEQ" value represents Unpredectibale Expense With Equaly divided.
 */
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
  HOURS_2000 = "HOURS_2000",
  HOURS_UPEQ = "HOURS_UPEQ",
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
  supplier:string
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
  },
  supplier: ""
}

/* export class CExpenseToReport {
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
} */
export class CExpenseGroupToReport {
  private expenses: IExpense[] = [];
  constructor(expenses: IExpense[]) {
    this.expenses = expenses;
    console.info("CExpenseGroupToReport/CTOR_expeses", this.expenses)
  }

  getExpesesCategoryToExel(file: string = "ExpensesCategoryReport", sheet: string = "Expenses", title: string = "Expense Reports"): IExportExelTable {
    let report: IExportExelTable = {
      file: file,
      sheet: sheet,
      title: title,
      header: [],
      body: [],
      save: false
    }
    const reportData = this.getExpesesByCategoryObject();
    report.header = ["Category", "Type", "Total", "Amount", "Description"]
    report.body = [];
    reportData.map.forEach((categoryMap, category) => {
      console.info("CExpenseGroupToReport/categoryMap", category, categoryMap.subtotal);
      report.body.push([category, "", "", "", ""]);
      
      (categoryMap as MapTotal).map.forEach((typeMap, type) => {
        console.info("CExpenseGroupToReport/typeMap", type, typeMap.subtotal);
        report.body.push(["", type, "", typeMap.subtotal.toFixed(2), ""]);
        
        
      })
      report.body.push(["", "", "Total", categoryMap.subtotal.toFixed(2), ""]);
    })
    console.info("CExpenseGroupToReport/report", report)
    return report;
  }
  getExpesesUtilizationToExel(file: string = "ExpensesUtilizationReport", sheet: string = "Expenses", title: string = "Expense Reports"): IExportExelTable {
    let report: IExportExelTable = {
      file: file,
      sheet: sheet,
      title: title,
      header: [],
      body: [],
      save: false
    }
    const reportData = this.getExpesesByUtilizationObject();
    report.header = ["Utilized","Type", "Amount", "Category","Total"]
    report.body = [];
    reportData.map.forEach((utilizedMap, utilizated) => {
      console.info("getExpesesUtilizationToExel/utilizatedMap", utilizated, utilizedMap.subtotal);
      report.body.push([utilizated, "", "", "", utilizedMap.subtotal.toFixed(2)]);
      
      (utilizedMap as MapTotal).map.forEach((typeMap, type) => {
        console.info("getExpesesUtilizationToExel/typeMap", type, typeMap, typeof typeMap);
        report.body.push(["", type,  typeMap.subtotal.toFixed(2), `${Array.from((typeMap as MapTotal).map.keys()).join(", ")}`]);
        
        
      })
    })
    console.info("getExpesesUtilizationToExel/report", report)
    return report;
  }
  getExpesesByCategoryObject(): MapTotal {
    
    let threeLevelMap: MapTotal = { map: new Map<string, MapTotal>(), subtotal: 0, total: 0 };
    threeLevelMap.map = new Map<string, MapTotal>();
    threeLevelMap.subtotal = 0;
    this.expenses.forEach((expense) => {
      let category = expense.expense.category.toLocaleUpperCase();
      let type = expense.expense.type.toLocaleUpperCase();
      let utilized = expense.expense.utilizated.toLocaleUpperCase();

      if (!threeLevelMap.map.has(category)) {
        threeLevelMap.map.set(category, { map: new Map<string, MapTotal>(), subtotal: 0, total: 0 });
      }
      let typeMap = threeLevelMap.map.get(category) as MapTotal;
      if (!typeMap?.map.has(type)) {
        typeMap?.map.set(type, { map: new Map<string, ExportExpensesType>(), subtotal: 0, total: 0 });
      }
      let utilizedMap = typeMap?.map.get(type) as MapTotal;
      if (!utilizedMap?.map.has(utilized)) {
        utilizedMap?.map.set(utilized, getNewExportExpensesType());
      }
      const currentUtilized = utilizedMap?.map.get(utilized) as ExportExpensesType;
      if (currentUtilized) {
        currentUtilized.expenses.push(expense);
        currentUtilized.subtotal = Number((currentUtilized.subtotal || 0).toFixed(2)) + Number(expense.amount.toFixed(2));
        utilizedMap.subtotal = Number(utilizedMap.subtotal) + Number(expense.amount.toFixed(2));
        threeLevelMap.map.get(category)!.subtotal = Number((threeLevelMap.map.get(category)!.subtotal).toFixed(2)) + Number(expense.amount.toFixed(2));
        threeLevelMap.subtotal = Number(threeLevelMap.subtotal.toFixed(2)) + Number(expense.amount.toFixed(2));
      }

    })
    console.info("CExpenseToReport/getExpesesByCategoryMap/threeLevelMap", threeLevelMap);
    return threeLevelMap;
  }
    getExpesesByUtilizationObject(): MapTotal {

    let threeLevelMap: MapTotal = { map: new Map<string, MapTotal>(), subtotal: 0, total: 0 };
    threeLevelMap.map = new Map<string, MapTotal>();
    threeLevelMap.subtotal = 0;
    this.expenses.forEach((expense) => {
      let category = expense.expense.category.toLocaleUpperCase();
      let type = expense.expense.type.toLocaleUpperCase();
      let utilized = expense.expense.utilizated.toLocaleUpperCase();

      if (!threeLevelMap.map.has(utilized)) {
        threeLevelMap.map.set(utilized, { map: new Map<string, MapTotal>(), subtotal: 0, total: 0 });
      }
      let typeMap = threeLevelMap.map.get(utilized) as MapTotal;
      if (!typeMap?.map.has(type)) {
        typeMap?.map.set(type, { map: new Map<string, ExportExpensesType>(), subtotal: 0, total: 0 });
      }
      let categoryMap = typeMap?.map.get(type) as MapTotal;
      if (!categoryMap?.map.has(category)) {
        categoryMap?.map.set(category, getNewExportExpensesType());
      }
      const currentCategory = categoryMap?.map.get(category) as ExportExpensesType;
      if (currentCategory) {
        currentCategory.expenses.push(expense);
        currentCategory.subtotal = Number((currentCategory.subtotal || 0).toFixed(2)) + Number(expense.amount.toFixed(2));
        categoryMap.subtotal = Number(categoryMap.subtotal) + Number(expense.amount.toFixed(2));
        threeLevelMap.map.get(utilized)!.subtotal = Number((threeLevelMap.map.get(utilized)!.subtotal).toFixed(2)) + Number(expense.amount.toFixed(2));
        threeLevelMap.subtotal = Number(threeLevelMap.subtotal.toFixed(2)) + Number(expense.amount.toFixed(2));
      }

    })
    console.info("CExpenseToReport/getExpesesByCategoryMap/threeLevelMap", threeLevelMap);
     return threeLevelMap;
  }
  /*   getExpesesByCategory(): Dictionary<IExpense[]> {
      let group_category = groupBy(this.expenses, tr => tr.expense.category.toLocaleUpperCase());
      let values = Object.values(group_category);
      let expenses = Object.keys(group_category);
      console.info("CExpenseToReport/getExpesesByCategory/group_category", group_category);
      let mapKeys: Map<string, Dictionary<IExpense[]>> = new Map<string, Dictionary<IExpense[]>>();
      expenses.forEach(element => {
        CustomLogger.info("CExpenseToReport/getExpesesByCategory/element", element);
        let group_type = groupBy(group_category[element], tr => tr.expense.type.toLocaleUpperCase());
        mapKeys.set(element, group_type);
        CustomLogger.info("CExpenseToReport/getExpesesByCategory/group_type", group_type);
        Object.keys(group_type).forEach((type) => {
          CustomLogger.info("CExpenseToReport/getExpesesByCategory/expensesByType/group_type, type", group_type, type);
        })
      })
  
      CustomLogger.info("CExpenseToReport/getExpesesByCategory/values.length,values,keys,group_category,mapKeys", values.length, values, expenses, group_category, mapKeys);
  
      this.getExpensesByCategoryAsArray(mapKeys, "expenseReport", "Expenses", "Expense Reports", false);
  
      return group_category;
    }
    getExpensesByCategoryAsArray(data: Map<string, Dictionary<IExpense[]>>, file: string = "flightReport", sheet: string = "Expenses", title: string = "Expenses Reports", filterWithDelta: boolean = false): IExportExelTable {
      let report: IExportExelTable = {
        file: file,
        sheet: sheet,
        title: title,
        header: [],
        body: [],
        save: false
      }
      report.header = ["Index", "Date", "Source", "Destination", "Category", "Type", "Utilized", "Amount", "Description", "Total For Type", "Total For Category"];
      customLogger.info("CExpenseToReport/getExpensesByCategoryAsArray/report,data,keys", report, data.keys());
      let expensesTable: Array<string[]> = [[]]
      data.forEach((value, key) => {
        console.info("CExpenseToReport/getExpensesByCategoryAsArray/key,value", key, value);
        expensesTable.push([]);
      });
  
      report.body = expensesTable;
      console.info("CExpenseToReport/getExpensesByCategoryAsArray/report", report)
      return report;
    } */
}