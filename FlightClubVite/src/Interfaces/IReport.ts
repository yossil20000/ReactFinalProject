export interface InvoiceData {
  name: string,
  date: string,
 }
 export interface InvoiceMember {
  member_id: string
  family_name: string
  first_name: string
 }
 export interface InvoiceProps {
   invoiceItems: InvoiceData[],
   invoiceDetailes: {
     member: InvoiceMember,
     invoiceNo: string,
     date: string
   }
 }