import '../../../Types/date.extensions';
import { Page, Document, StyleSheet, Text, View } from "@react-pdf/renderer";
import { ITransactionReportProps, transactionTableFlightItemHeader, transactionTableFlightTotal, transactionTableItemHeader } from "../../../Interfaces/ITransactionsReport";
import TransactionsReportTitle from "./TransactionsReportTitle";
import TransactionsItemTable from "./TransactionsItemTable";
import { Transaction_OT } from "../../../Interfaces/API/IClub";
import TransactionsFlightTable from './TransactionsFlightTable';
import InvoiceClubInfo from './InvoiceClubInfo';
import TransactionsReportTitles from './TransactionsReportTitles';
import useGetTransacReportData from '../../../hooks/useGetTransacReportData';

const borderColor = '#000000'
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 10,
    lineHeight: 1.5,
    flexDirection: 'column'
  },
  blank: {
    width: '20%',
    height: 'auto',
    borderTopColor: borderColor,
    borderTopWidth: 1,
    backgroundColor: '#FFFFFF',
    textAlign: 'center'
  },
  desription: {
    width: '60%',
    height: 'auto',
    borderTopColor: borderColor,
    borderTopWidth: 1,
    backgroundColor: '#bff0fd',
    textAlign: 'center'
  },
  total: {
    width: '20%',
    height: 'auto',
    borderTopColor: borderColor,
    borderTopWidth: 1,
    backgroundColor: '#bff0fd',
    textAlign: 'left'
  },
  tableContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#bff0fd',
    marginRight: 10,
  }
}
)


function TransactionsReport({ transactions, bankAccount }: ITransactionReportProps) {
  const [transactionData, bankAccounts] = useGetTransacReportData(transactions, bankAccount)
  let flightDurationTotal : number =0
  CustomLogger.log("TransactionsReport/props", transactionData, bankAccounts)
  return (
    <Document>
      <Page size={"A4"} style={styles.page}>
        <TransactionsReportTitle key={"tr_title_h"} title='BAZ Haifa Club' />
        <InvoiceClubInfo />
        <Text break />
        {transactionData?.map((member) =>
          <>
            <TransactionsReportTitles key={`tr_titles_${member.memberKey}`} title={`${member.memberKey}`} style={{ width: "40%" }} />
            {
              
              member.orders.map((order) => {
                const isFlight = order.orderKey.toLocaleUpperCase() === Transaction_OT.FLIGHT.toLocaleUpperCase();
                
                return (<>
                  <TransactionsReportTitles key={`tr_title_${order.orderKey}`} title={`${order.orderKey}`} style={{ width: "100%", marginLeft: 0, marginRight: 10, marginTop: 10 }} />

                  {isFlight === true ? (
                    <TransactionsFlightTable key={`tr_ti${order.orderKey}`} items={order.data} headers={transactionTableFlightItemHeader}
                      addTotalRow={true} total={order.data.total.toFixed(2)} totalRowHEader={transactionTableFlightTotal("", order.data.total.toFixed(1))} />
                  ) : (
                    <TransactionsItemTable key={`tr_ti${order.orderKey}`} items={order.data} headers={transactionTableItemHeader}
                      addTotalRow={true} total={order.data.total.toFixed(2)} totalRowHEader={transactionTableFlightTotal("", order.data.total.toFixed(1))} />
                  )}
                </>)
              }
              )
            }
            <View style={styles.tableContainer}>
              <Text style={styles.blank} />
              <Text style={styles.desription}>{`Total for ${member.memberKey}`}</Text>
              <Text style={styles.total}>{member.totalAmount}</Text>
            </View>
            <Text break />
          </>
        )}
      </Page>
    </Document>
  )
}

export default TransactionsReport;