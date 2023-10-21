import { Page, Document, StyleSheet, Image } from "@react-pdf/renderer"
import invoiceLogo from '../../Asset/invoice.png'
import InvoiceTitle from "./InvoiceTitle";
import { InvoiceProps } from "../../Interfaces/IReport";
import InvoiceNumber from "./InvoiceNumber";
import InvoiceBillTo from "./InvoiceBillTo";
import InvoiceItemTable from "./InvoiceItemTable";
import InvoiceFooter from "./InvoiceFooter";

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 10,
    lineHeight: 1.5,
    flexDirection: 'column'
  },
  logo: {
    width: 74,
    height: 66,
    marginLeft: 'auto',
    marginRight: 'auto'
  }
});

function InvoiceReport({ invoiceItems,invoiceDetailes,invoiceHeader }: InvoiceProps)  {
  return (
    <Document>
      <Page size={"A4"} style={styles.page}>
        
      <InvoiceTitle title="Quarter 1 expense" key={"title"}/>
        <InvoiceNumber key={"number"} member={invoiceDetailes.member} invoiceNo={invoiceDetailes.invoiceNo} date={invoiceDetailes.date}  />
        <InvoiceBillTo key={"bill"} member={invoiceDetailes.member} invoiceNo={invoiceDetailes.invoiceNo} date={invoiceDetailes.date} />
        <InvoiceItemTable key={"table"} items={ invoiceItems} headers={invoiceHeader}/>
        <InvoiceFooter key={"footer"} message="Club Account: 12335"/>
      </Page>
    </Document>
  )
}
export default InvoiceReport;