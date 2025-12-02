import { OrderStatus } from "./IAccount"
import { MemberType } from "./IMember"
import { ExportExpensesType, getNewExportExpensesType, IExportExelTable, MapTotal } from "../IExport"
import { get, groupBy } from "lodash";
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
  HOURS_0050 = "HOURS_0050",
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
  HOURS_OSEQ = "HOURS_OSEQ",
  HOURS_UPQP = "HOURS_UPQP"
}
export const UtilizatedDictionary = {
  [Utilizated.HOURS_0000]: "Expense Not Depend on Time",
  [Utilizated.HOURS_0001]: "expense for 1 hour flight",
  [Utilizated.HOURS_0050]: "expense for 50 hours flight",
  [Utilizated.HOURS_0100]: "expense for 100 hours flight",
  [Utilizated.HOURS_0150]: "expense for 150 hours flight",
  [Utilizated.HOURS_0200]: "expense for 200 hours flight", 
  [Utilizated.HOURS_0250]: "expense for 250 hours flight",
  [Utilizated.HOURS_0300]: "expense for 300 hours flight", 
  [Utilizated.HOURS_0350]: "expense for 350 hours flight",
  [Utilizated.HOURS_0400]: "expense for 400 hours flight", 
  [Utilizated.HOURS_0450]: "expense for 450 hours flight",
  [Utilizated.HOURS_0500]: "expense for 500 hours flight", 
  [Utilizated.HOURS_1000]: "expense for 1000 hours flight",
  [Utilizated.HOURS_1500]: "expense for 1500 hours flight",
  [Utilizated.HOURS_2000]: "expense for 2000 hours flight",
  [Utilizated.HOURS_UPEQ]: "Unpredectibale Expense With Equaly divided",
  [Utilizated.HOURS_OSEQ]: "Over Sea Equipments Handlement Expense",
  [Utilizated.HOURS_UPQP]: "Unpredectibale Expense Quarterly Paid by Members"
}

function getEnumKeyByValue(value: string): keyof typeof Utilizated  {
  const key = Object.keys(Utilizated).find(
    (key) => Utilizated[key as keyof typeof Utilizated] === value
  );
  if (key && Object.prototype.hasOwnProperty.call(Utilizated, key)) {
    return key as keyof typeof Utilizated;
  }
  return Utilizated.HOURS_0000;
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
  private from: Date;
  private to: Date;
  private tachStart: number;
  private tachEnd: number;
  constructor(expenses: IExpense[], from: Date, to: Date,tachStart:number,tachEnd:number) {
    this.expenses = expenses;
    this.from = from;
    this.to = to;
    this.tachStart = tachStart;
    this.tachEnd = tachEnd;
    console.info("CExpenseGroupToReport/CTOR_expeses", this.expenses)
  }

  getExpesesCategoryToExel(file: string = "ExpensesCategoryReport", sheet: string = "Expenses", title: string = "Expense Reports by Category"): IExportExelTable {
    let report: IExportExelTable = {
      file: file,
      sheet: `${sheet} -${this.from.getDisplayDate()} to ${this.to.getDisplayDate()}`,
      title: `${title}  From ${this.from.getDisplayDate()} To ${this.to.getDisplayDate()}`,
      header: [],
      body: [],
      save: false
    }
    const reportData = this.getExpesesByCategoryObject();
    report.header = ["Category", "Type", "Total", "Amount", "Description"]
    report.body = [];
    report.body.push([title, "", "", "", ""]);
    reportData.map.forEach((categoryMap, category) => {
      console.info("CExpenseGroupToReport/categoryMap", category, categoryMap.subtotal);
      report.body.push([category, "", "", "", ""]);
      
      (categoryMap as MapTotal).map.forEach((typeMap, type) => {
        console.info("CExpenseGroupToReport/typeMap", type, typeMap.subtotal);
        report.body.push(["", type, "", typeMap.subtotal.toFixed(2), ""]);
        
        
      })
      report.body.push(["", "", "Total", categoryMap.subtotal.toFixed(2), ""]);
      report.body.push(["", "", "Total Flight Time", (this.tachEnd - this.tachStart).toFixed(1), ""]);
    })
    console.info("CExpenseGroupToReport/report", report)
    return report;
  }
  getExpesesUtilizationToExel(file: string = "ExpensesUtilizationReport", sheet: string = "Expenses", title: string = "Expense Reports"): IExportExelTable {
    let report: IExportExelTable = {
      file: file,
      sheet: `${sheet} - ${this.from.getDisplayDate()} to ${this.to.getDisplayDate()}`,
      title: `${title}  From ${this.from.getDisplayDate()} To ${this.to.getDisplayDate()}`,
      header: [],
      body: [],
      save: false,
      summary:  new Map<string, number>()
    }
    report.summary = new Map<string, number>(); 
    report.summary.set("FlightHours", this.tachEnd - this.tachStart);
    report.summary.set("Members", 12);
    report.summary.set("PricePerHour", 0);
    report.summary.set("PricePerMonth", 0);
    report.summary.set("AnnualUnExpectedPaid", 0);
    report.summary.set("UnExpectedPerMonth", 0);
    
    report.summary.set("TotalPrice", 0);

    const reportData = this.getExpesesByUtilizationObject();
    report.header = ["Utilized","Utilized description","Type", "Amount", "Category","Total"]
    report.body = [];
    report.body.push([title, "", "", "", ""]);
    console.info("getExpesesUtilizationToExel/Sumary start");
    reportData.map.forEach((utilizedMap, utilizated) => {
      console.info("getExpesesUtilizationToExel/utilizatedMap", utilizated, utilizedMap.subtotal);
      report.body.push([utilizated, `${UtilizatedDictionary[getEnumKeyByValue(utilizated)]}`,"", "", "", utilizedMap.subtotal.toFixed(2)]);
      console.info("getExpesesUtilizationToExel/Sumary/typeMap start");
      (utilizedMap as MapTotal).map.forEach((typeMap, type) => {
        console.info("getExpesesUtilizationToExel/Sumary/typeMap", type, typeMap, typeof typeMap);
        report.body.push(["", "",type,  typeMap.subtotal.toFixed(2), `${Array.from((typeMap as MapTotal).map.keys()).join(", ")}`]);
        if(utilizated==="HOURS_0000" || utilizated==="HOURS_UPEQ" || utilizated==="HOURS_OSEQ"){
          
          report.summary?.set("TotalPerMonth", Number((report.summary.get("TotalPerMonth") || 0) + typeMap.subtotal));
          customLogger.log("getExpesesUtilizationToExel/Sumary/HOURS_0000 and HOURS_UPEQ and HOURS_OSEQ", utilizated,typeMap.subtotal.toFixed(2),report.summary?.get("TotalPerMonth"));
        }
         if(utilizated==="HOURS_0001" || utilizated==="HOURS_0050" || utilizated==="HOURS_0100" || utilizated==="HOURS_0150" || utilizated==="HOURS_0200" || utilizated==="HOURS_0250" || utilizated==="HOURS_0300" || utilizated==="HOURS_0350" || utilizated==="HOURS_0400" || utilizated==="HOURS_0450" || utilizated==="HOURS_0500"){
          const priceDeviced = Number(utilizated.split("_")[1]);
          report.summary?.set("TotalPerHour", Number((report.summary.get("TotalPerHour") || 0) + typeMap.subtotal / priceDeviced));
          customLogger.log("getExpesesUtilizationToExel/Sumary/HOURS_0001 and above",utilizated, typeMap.subtotal.toFixed(2),report.summary?.get("TotalPerHour"));
        }
        if(utilizated==="HOURS_UPQP"){
          customLogger.log("getExpesesUtilizationToExel/Sumary/HOURS_UPQP", typeMap.subtotal.toFixed(2));
          report.summary?.set("AnnualUnExpectedPaid", Number((report.summary?.get("AnnualUnExpectedPaid") || 0) + typeMap.subtotal));
          customLogger.log("getExpesesUtilizationToExel/Sumary/HOURS_UPQP",utilizated, typeMap.subtotal.toFixed(2),report.summary?.get("AnnualUnExpectedPaid"));
        }
      })
      console.info("getExpesesUtilizationToExel/Sumary/typeMap end");
    })
    report.summary.set("PricePerHour", Number(((report.summary.get("TotalPerHour") || 0) / (report.summary.get("FlightHours") || 1)).toFixed(2)));
    report.summary.set("PricePerMonth", Number(((report.summary.get("TotalPerMonth") || 0) / (report.summary.get("Members") || 1)).toFixed(2))/12); ;
    report.summary.set("UnExpectedPerMonth", Number(((report.summary.get("AnnualUnExpectedPaid") || 0) / (report.summary.get("Members") || 1)).toFixed(2))/12); ;
    console.info("getExpesesUtilizationToExel/Sumary end",
    report.summary.get("TotalPerMonth"), report.summary.get("TotalPerHour"), report.summary.get("AnnualUnExpectedPaid") );
    report.body.push(["", "", "", "", "",""]);
    report.body.push(["", "Estimated PricePer Hour Calculation", "", "",""]);
    report.body.push(["Flight Hours", (report.summary.get("FlightHours") || 0).toFixed(1), "Formula", ""]);
    report.body.push(["Total Expenses Per Hour Flight", (report.summary.get("TotalPerHour") || 0).toFixed(2), "=SUM(HOURS_000x / x) where x is flight hours in the table above", ""]);
    report.body.push(["Calculated Price Per Hour", (report.summary.get("PricePerHour") || 0).toFixed(2), "Total Expenses Per Hour Flight / Flight Hours", ""]);
    
    report.body.push(["","Estimated Price Per Month Calculation","",""]);
    report.body.push(["Members", (report.summary.get("Members") || 0).toFixed(0), "", ""]);
    report.body.push(["Total Expenses For Month Calculation", (report.summary.get("TotalPerMonth") || 0).toFixed(2), "`=(HOURS_0000+HOURS_UPEQ+HOURS_OSEQ)`", "", "",""]);
    report.body.push(["Total UnExpected Expenses Paid", (report.summary.get("AnnualUnExpectedPaid") || 0).toFixed(2), "`=HOURS_UPQP`", "", "",""]);
    report.body.push(["Price Per Month Per Member", (report.summary.get("PricePerMonth") || 0).toFixed(2), "`=(Total Expenses For Month Calculation)  / Members_Count / 12[month]`", ""]);
    report.body.push(["UnExpected Per Month Per Member", (report.summary.get("UnExpectedPerMonth") || 0).toFixed(2), "`=Price Per Month Per Member + UnExpected Per Month Per Member`", ""]);
    report.body.push(["Total Estimated Price Per Month Per Member", ((report.summary.get("PricePerMonth") || 0)+(report.summary.get("UnExpectedPerMonth") || 0)).toFixed(2), "", ""]);  
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
}