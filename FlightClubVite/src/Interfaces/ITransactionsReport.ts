import "../Types/date.extensions"


export interface ITransactionReportHeader {
  title: string,
  toolTip: string
}
export interface ITransactionReportTableHeader {
  header: ITransactionReportHeader[]
}
export interface ITransactionReportTableCell {
  data: string,
  toolTip: string,
}
export interface ITransactionReportProps {
  transactionTitleHeader: ITransactionReportHeader[]
  }