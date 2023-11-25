import "../Types/date.extensions"
export interface IInvoiceHeader {
  title: string,
  toolTip: string
}
export interface IInvoiceTableHeader {
  header: IInvoiceHeader[]
}
export interface IInvoiceTableCell {
  data: string,
  toolTip: string,
}


export interface InvoiceMember {
  member_id: string
  family_name: string
  first_name: string
}
export interface IInvoiceDetailes {
  member: InvoiceMember,
  invoiceNo: string,
  date: string,
  mainTitle: string
}
export interface InvoiceProps {
  invoiceItems: IInvoiceTableData,
  invoiceHeader: IInvoiceTableHeader,
  invoiceDetailes: IInvoiceDetailes
}

export interface IInvoiceTableRow {
  row: IInvoiceTableCell[]
}

export interface IInvoiceTableData {
  rows: IInvoiceTableRow[],
  total: number
}


export interface ITableRowProps {
  items: IInvoiceTableData,
  headers: IInvoiceTableHeader
}
const defaultInvoiceItems: IInvoiceTableData = {
  rows: [
    { row: [{ data: "d1", toolTip: "tT1" }, { data: "d1", toolTip: "tT1" }] },
    { row: [{ data: "d1", toolTip: "tT1" }, { data: "d1", toolTip: "tT1" }] }
  ],
  total: 0
}
const defautInvoiceHeader: IInvoiceTableHeader = {
  header: [
    { title: "Date", toolTip: "Issue Date" },
    { title: "Description", toolTip: "Description" },
    { title: "Operation", toolTip: "Flight/" },
    { title: "Total", toolTip: "Total in shekel" }
  ]
}
export const defaultInvoiceMember: InvoiceMember = {
  member_id: "000000",
  family_name: "Yos",
  first_name: "Levy"
}
export const defaultInvoiceDetailes: IInvoiceDetailes = {
  member: defaultInvoiceMember,
  invoiceNo: "12345",
  date: (new Date()).getDisplayDate(),
  mainTitle: "Invoice"
}
export const defaultInvoiceProps: InvoiceProps = {
  invoiceItems: defaultInvoiceItems,
  invoiceHeader: defautInvoiceHeader,
  invoiceDetailes: defaultInvoiceDetailes
}