import '../../Types/date.extensions'
import { IExportExelTable } from "../../Components/Report/Exel/ExportExelTable";
import { IExpense } from "./IExpense";

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