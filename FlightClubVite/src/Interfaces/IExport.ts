import { IExpense } from "./API/IExpense";

export interface IExportExelTable {
  file: string;
  sheet: string;
  title: string;
  header: string[];
  body: Array<string[]>
  save:boolean;
  showSelfSave?:boolean;
  summary?:  Map<string, number>;
}

export type MapTotal = {
  map:  Map<string, MapTotal | ExportExpensesType>;
    subtotal: number;
    total: number;
  
}

export type Dictionary<T> = {
  [key: string]: T;
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
