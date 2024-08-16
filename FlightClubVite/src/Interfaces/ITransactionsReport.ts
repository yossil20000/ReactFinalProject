import "../Types/date.extensions"
import { ITransaction } from "./API/IClub";


export interface ITransactionReportHeader {
  title: string,
  toolTip: string,
  data: string,
  width: string
}
export interface ITransactionReportTableHeader {
  header: ITransactionReportHeader[];
  isTitle: boolean
}
export interface ITransactionReportTableCell {
  data: string,
  toolTip: string,
  width: string
}
export interface ITransactionTableRow {
  row: ITransactionReportTableCell[]
}
export interface ITransactionReportProps {
  transactionTitleHeader: ITransactionReportHeader[];
  transaction: ITransaction[]
  }
  export interface ITransactionTableData {
    rows: ITransactionTableRow[];
    total:number;
  }
  export interface ITransactionTableRowProps {
    items: ITransactionTableData
    headers: ITransactionReportTableHeader;
  }
  export const bankTitleHeader :ITransactionReportTableHeader ={
    header:[
      {title: "Account Number", toolTip: "Bank account number", data: "18700031", width: "30%"},
      {title: "Bank", toolTip: "Brand", data: "LEUMI", width: "30%"},
      {title: "Branch", toolTip: "Name", data: "CARMEL", width: "20%"},
      {title: "Bank Number", toolTip: "Bank number", data: "891", width: "20%"}
    ],
    isTitle:true
  }
  export const transactionTableItemHeader : ITransactionReportTableHeader = {
    header: [
      {title: "Date", toolTip: "Date", data: "18700031", width: "10%"},
      {title: "Tach", toolTip: "Bank account number", data: "18700031", width: "10%"},
      {title: "Start", toolTip: "Bank account number", data: "18700031", width: "20%"},
      {title: "Stop", toolTip: "Bank account number", data: "18700031", width: "30%"},
      {title: "Amount", toolTip: "Bank account number", data: "18700031", width: "30%"},

    ],
    isTitle: true
  }