export interface IExpenseItem {
  _id?: string;
  item_name: string;
  expense: {
    category: string;
    type: string;
    utilizated: string;
  };
}
export class CExpenseItem implements IExpenseItem {
  _id?: string;
  item_name: string;
  expense: {
    category: string;
    type: string;
    utilizated: string;
  };
  constructor() {
    this.item_name = "";
    this.expense = {  
      category: "",
      type: "",
      utilizated: ""
    };
  }
}
