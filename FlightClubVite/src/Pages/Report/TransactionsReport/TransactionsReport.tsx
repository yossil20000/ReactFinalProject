import { Page, Document, StyleSheet } from "@react-pdf/renderer";
import { ITransactionReportProps } from "../../../Interfaces/ITransactionsReport";
import TransactionsReportTitle from "./TransactionsReportTitle";
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
function TransactionsReport(props: ITransactionReportProps) {
  return (
    <Document>
      <Page size={"A4"} style={styles.page}>
        <TransactionsReportTitle header={props.transactionTitleHeader} />
      </Page>
    </Document>
  )
}

export default TransactionsReport;