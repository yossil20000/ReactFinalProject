import '../../Types/date.extensions'
import { IExportExelTable, ExportExpensesType, getNewExportExpensesType, MapTotal } from "../IExport"
import { IExpense } from "./IExpense";
import { ITransaction } from './IClub';
import { groupBy } from "lodash";
import { Dictionary } from "@reduxjs/toolkit";
import { customLogger } from '../../customLogging';

export class CExpenseToReport {
  private expenses: IExpense[] = [];
  constructor(expenses: IExpense[]) {
    this.expenses = expenses;
    console.info("CExpenseToReport/CTOR_expeses", this.expenses)
  }
  getExpesesToExel(file: string = "expensesReport", sheet: string = "Expenses", title: string = "Expense Reports"): IExportExelTable {
    let report: IExportExelTable = {
      file: file,
      sheet: sheet,
      title: title,
      header: [],
      body: [],
      save: false
    }

    report.header = ["Index", "Date", "Source", "Destination", "Supplier", "Category", "Type", "Utilized", "Amount", "Description"]
    report.body = this.expenses?.map((expense, i) => {
      console.info("CExpenseToReport/expense", expense)
      return [i.toFixed(0),
      (new Date(expense.date)).getDisplayDate(),
      expense.source.display,
      expense.destination.display,
      expense.supplier,
      expense.expense.category,
      expense.expense.type,
      expense.expense.utilizated,
      expense.amount.toFixed(2),
      expense.description
      ]
    })
    console.info("CExpenseToReport/report", report)
    return report;
  }
  getExpesesByCategoryMap(): Map<string, Map<string, Map<string, ExportExpensesType>>> {

    let threeLevelMap = new Map<string, Map<string, Map<string, ExportExpensesType>>>();
    this.expenses.forEach((expense) => {
      let category = expense.expense.category.toLocaleUpperCase();
      let type = expense.expense.type.toLocaleUpperCase();
      let utilized = expense.expense.utilizated.toLocaleUpperCase();

      if (!threeLevelMap.has(category)) {
        threeLevelMap.set(category, new Map<string, Map<string, ExportExpensesType>>());
      }
      let typeMap = threeLevelMap.get(category);
      if (!typeMap?.has(type)) {
        typeMap?.set(type, new Map<string, ExportExpensesType>());
      }
      let utilizedMap = typeMap?.get(type);
      if (!utilizedMap?.has(utilized)) {
        utilizedMap?.set(utilized, getNewExportExpensesType());
      }
      const currentUtilized = utilizedMap?.get(utilized);
      if (currentUtilized) {
        currentUtilized.expenses.push(expense);
        currentUtilized.subtotal = (currentUtilized.subtotal || 0) + expense.amount;
      }

    })
    console.info("CExpenseToReport/getExpesesByCategoryMap/threeLevelMap", threeLevelMap);
    return threeLevelMap;
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
  getExpesesByCategory(): Dictionary<IExpense[]> {
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
  }
}
export class CTransactionToReport {
  private transaction: ITransaction[] = [];
  constructor(transaction: ITransaction[]) {
    this.transaction = transaction;
    console.info("CTransactionToReport/CTOR_transaction", this.transaction)
  }
  getTransactionsToExel(file: string = "transactionReport", sheet: string = "Transactions", title: string = "Transactions Reports"): IExportExelTable {
    let report: IExportExelTable = {
      file: file,
      sheet: sheet,
      title: title,
      header: [],
      body: [],
      save: false
    }
    report.header = ["Index", "_id", "Date", "CalcType", "Source", "Destination",
      "O.Type", "O.Id", "S.PrevBalance", "D.PrevBalance", "Amount", "EngineFund", "Type", "Payment Method", "Payment Referance", "Description"]
    report.body = this.transaction?.map((transaction, i) => {
      console.info("CExpenseToReport/expense", transaction)
      return [i.toFixed(0),
      transaction._id,
      (new Date(transaction.date)).getDisplayDate(),
      transaction.calculation_type,
      transaction.source,
      transaction.destination,
      transaction.order.type.toString(),
      transaction.order._id,
      transaction.source_balance.toFixed(2),
      transaction.destination_balance.toFixed(2),
      transaction.amount.toFixed(2), 
      transaction.engine_fund_amount.toFixed(2),
      transaction.type.toString(),
      transaction.payment.method.toString(),
      transaction.payment.referance,
      transaction.description
      ]
    })
    console.info("CTransactionToReport/report", report)
    return report;
  }
}