import { IExpense } from "./API/IExpense";

export interface IExportExelTable {
  file: string;
  sheet: string;
  title: string;
  header: string[];
  body: Array<string[]>
  save:boolean;
  showSelfSave?:boolean
}

export type ExportExpensesType  ={
  expenses: IExpense[] ;
  subtotal: number ;
  total: number ;
}
export const newExportExpensesType: ExportExpensesType = {
  expenses: [], 
  subtotal: 0,
  total: 0
};

export const getNewExportExpensesType = (): ExportExpensesType => {
  return {
    expenses: [],
    subtotal: 0,
    total: 0
  };
} 
