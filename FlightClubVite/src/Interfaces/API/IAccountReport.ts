import '../../Types/date.extensions'
import { IExportExelTable } from "../../Components/Report/Exel/ExportExelTable";
import { IExpense } from "./IExpense";
import { ITransaction } from './IClub';

export interface IAccountReport {
  
}

export class CExpenseToReport {
  private expenses: IExpense[] = [];
  constructor(expenses : IExpense[]){
      this.expenses= expenses;
      console.info("CExpenseToReport/CTOR_expeses",this.expenses)
  }
  getExpesesToExel(file: string="expensesReport",sheet:string ="Expenses",title:string= "Expense Reports"): IExportExelTable{
      let report : IExportExelTable = {
          file: file,
          sheet: sheet,
          title: title,
          header: [],
          body: [],
          save:false
      }
      report.header=["Index","Date","Source","Destination","Category","Type","Utilized","Amount","Description"]
      report.body = this.expenses?.map((expense,i) => {
          console.info("CExpenseToReport/expense",expense)
          return [i.toFixed(0),
            (new Date(expense.date)).getDisplayDate(),
            expense.source.display,
            expense.destination.display,
            expense.expense.category,
            expense.expense.type,
            expense.expense.utilizated,
            expense.amount.toFixed(2),
            expense.description
          ]
      })
      console.info("CExpenseToReport/report",report)
      return report;
  }
}
export class CTransactionToReport {
  private transaction: ITransaction[] = [];
  constructor(transaction : ITransaction[]){
      this.transaction= transaction;
      console.info("CTransactionToReport/CTOR_transaction",this.transaction)
  }
  getTransactionsToExel(file: string="transactionReport",sheet:string ="Transactions",title:string= "Transactions Reports"): IExportExelTable{
      let report : IExportExelTable = {
          file: file,
          sheet: sheet,
          title: title,
          header: [],
          body: [],
          save:false
      }
      report.header=["Index","_id","Date","CalcType","Source","Destination",
      "O.Type","O.Id","S.Balance","D.Balance","Amount","Type","Payment Method","Payment Referance","Description"]
      report.body = this.transaction?.map((transaction,i) => {
          console.info("CExpenseToReport/expense",transaction)
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
            transaction.type.toString(),
            transaction.payment.method.toString(),
            transaction.payment.referance,
            transaction.description
          ]
      })
      console.info("CTransactionToReport/report",report)
      return report;
  }
}