import { PDFViewer } from '@react-pdf/renderer'
import { IInvoiceTableData,IInvoiceTableHeader, InvoiceProps } from '../../Interfaces/IReport'
import InvoiceReport from './InvoiceReport'


function InvoicePage({ invoiceItems,invoiceDetailes,invoiceHeader }: InvoiceProps) {

  return (
    <>
      <PDFViewer width={"1000"} height={"800"}>
        <InvoiceReport invoiceHeader={invoiceHeader} invoiceDetailes={invoiceDetailes} invoiceItems={invoiceItems} />
      </PDFViewer>
    </>
  )
}

export default InvoicePage