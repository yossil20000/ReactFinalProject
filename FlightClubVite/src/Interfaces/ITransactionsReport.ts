import { ITransactionTableFilter } from "../Components/TransactionTable";
import "../Types/date.extensions"
import { IClubAccount, ITransaction } from "./API/IClub";
import IResultBase from "./API/IResultBase";


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

  transactions: IResultBase<ITransaction> | undefined,
  bankAccount: IResultBase<IClubAccount> | undefined
}
export interface ITranasctionsReportPageProps {
  filter: ITransactionTableFilter,

}

export interface ITransactionTableData {
  rows: ITransactionTableRow[];
  total: number;
}
export interface ITransactionTableRowProps {
  items: ITransactionTableData
  headers: ITransactionReportTableHeader;
  addTotalRow: boolean,
  total: string;
  totalRowHEader: ITransactionReportTableHeader
}
export const bankTitleHeader: ITransactionReportTableHeader = {
  header: [
    { title: "Account Number", toolTip: "Bank account number", data: "18700031", width: "30%" },
    { title: "Bank", toolTip: "Brand", data: "LEUMI", width: "30%" },
    { title: "Branch", toolTip: "Name", data: "CARMEL", width: "20%" },
    { title: "Bank Number", toolTip: "Bank number", data: "891", width: "20%" }
  ],
  isTitle: true
}
export const transactionTableItemHeader: ITransactionReportTableHeader = {
  header: [
    { title: "Date", toolTip: "Date of order", data: "18700031", width: "20%" },
    { title: "Description123456789", toolTip: "Order Desription", data: "18700031", width: "60%" },
    { title: "Amount", toolTip: "Amount Charged", data: "18700031", width: "20%" },

  ],
  isTitle: true
}
export const transactionTableFlightItemHeader: ITransactionReportTableHeader = {
  header: [
    { title: "Date", toolTip: "Date of flight", data: "18700031", width: "20%" },
    { title: "Start", toolTip: "Engine Start", data: "18700031", width: "20%" },
    { title: "Stop", toolTip: "Engine Stop", data: "18700031", width: "20%" },
    { title: "Duration", toolTip: "Total Flight", data: "18700031", width: "20%" },
    { title: "Amount", toolTip: "Fligh amount charged", data: "18700031", width: "20%" },

  ],
  isTitle: true
}
export function transactionTableFlightTotal(totalDuration: string, total: string): ITransactionReportTableHeader {
  return {
    header: [
      { title: "", toolTip: "Date of flight", data: "18700031", width: "20%" },
      { title: "", toolTip: "Engine Start", data: "18700031", width: "20%" },
      { title: "Total", toolTip: "Engine Stop", data: "18700031", width: "20%" },
      { title: `${totalDuration}`, toolTip: "Total Flight", data: "18700031", width: "20%" },
      { title: `${total}`, toolTip: "Fligh amount charged", data: "18700031", width: "20%" },

    ],
    isTitle: true
  }
}