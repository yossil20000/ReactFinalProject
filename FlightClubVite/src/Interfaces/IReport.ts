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
     date: string
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
  rows: IInvoiceTableRow[]
 }


 export interface ITableRowProps {
  items: IInvoiceTableData,
  headers: IInvoiceTableHeader
}