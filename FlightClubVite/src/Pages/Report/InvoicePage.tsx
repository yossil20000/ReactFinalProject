import { PDFViewer } from '@react-pdf/renderer'
import { InvoiceData, InvoiceProps } from '../../Interfaces/IReport'
import InvoiceReport from './InvoiceReport'


function InvoicePage() {
  const data: InvoiceData[] = [
    {
      name: "Yossi",
      date: new Date().toLocaleDateString()
    },
    {
      name: "Yossi 1",
      date: new Date().toLocaleDateString()
    },
    {
      name: "Yossi 2",
      date: new Date().toLocaleDateString()
    },
  ]
  const invoiceProps: InvoiceProps = {
    invoiceItems: data,
    invoiceDetailes: {
      member: {
        member_id: "123456",
        family_name: "Yosef",
        first_name: 'levy'
      },
      invoiceNo: "123456",
      date: (new Date()).toLocaleDateString()
    }
  }
  return (
    <>
      <PDFViewer width={"1000"} height={"600"}>
        <InvoiceReport invoiceDetailes={invoiceProps.invoiceDetailes} invoiceItems={invoiceProps.invoiceItems} />
      </PDFViewer>
    </>
  )
}

export default InvoicePage