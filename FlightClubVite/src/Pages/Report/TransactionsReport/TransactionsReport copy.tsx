import { Page, Document, StyleSheet,Text } from "@react-pdf/renderer";
import { ITransactionReportProps, ITransactionTableData, ITransactionTableRow, ITransactionTableRowProps, transactionTableItemHeader } from "../../../Interfaces/ITransactionsReport";
import TransactionsReportTitle from "./TransactionsReportTitle";
import { useEffect, useState } from "react";
import TransactionsItemTable from "./TransactionsItemTable";
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
interface ITransactionOrders {
  data:ITransactionTableData,
  orderKey: string
}
interface ITransactionData {
  
  memberKey: string,
  orders: ITransactionOrders[]
}
const initTransactionData: ITransactionData[] = [{
  memberKey: "Yossi",
  orders: [{
    data: {
      rows: [],
      total: 0
    },
    orderKey: "Flight"
  }]
}]
function TransactionsReport({ transactionTitleHeader, transaction }: ITransactionReportProps) {
  const [transactionData, setTransactionData] = useState<ITransactionData[]>(initTransactionData)

  useEffect(() => {
    if (transaction) {
/*       let membersProps : string[] = [];
      let rowsProps: ITransactionTableRowProps[] = []; */
   /*    let itemProps: ITransactionTableRowProps = {
        items: {
          rows: [],
          total: 0
        },
        headers: {
          header: [],
          isTitle: true
        }
      } */
      CustomLogger.info("TransactionsReport/transactons", transaction);
      let group = Object.groupBy(transaction, ({ destination }) => destination)

      let values = Object.values(group);
      let keysMembers = Object.keys(group);
     
      CustomLogger.info("TransactionsReport/values.length,values,keys", values.length, values, keysMembers);
      if (values) {
        CustomLogger.info("TransactionsReport/group[keys[0]]", group[keysMembers[0]]);
        keysMembers.forEach(element => {
          /* let transactionRows : ITransactionTableRow[]=[] */
          CustomLogger.info("TransactionsReport/group[element]", element, group[element]);
          if (group[element]) {
            CustomLogger.info("TransactionsReport/element", element)
            let orderGroup = Object.groupBy(group[element], ({ order }) => { return order.type.toLocaleUpperCase() })
            CustomLogger.info("TransactionsReport/orderGroup", orderGroup);
            let orderValues = Object.values(orderGroup);
            let orderKeys = Object.keys(orderGroup);
            orderKeys.forEach(order => {
              const amount = orderGroup[order]?.reduce((accumulator, current) => { return current.amount + accumulator }, 0)
              CustomLogger.info("TransactionsReport/order,orderGroup[order],amount", order, orderGroup[order], amount)
            })
            CustomLogger.info("TransactionsReport/element,orderValues,orderKeys", element, orderValues, orderKeys);
          }
        });
      }
      setTransactionData((prev) => ({...prev,membersKeys: keysMembers}))
    }
  }, [transaction])
  return (
    <Document>
      <Page size={"A4"} style={styles.page}>
        <TransactionsReportTitle key={"tr_title_h"} title="BAZ Flight Club"/>
  
        {transactionData.map((member) =>
          <>
            
            {member.orders.map((order) =>
              <>
              <Text key={`tr_title_${order.orderKey}`}>`${order.orderKey}`</Text>
              </>
    
            )}
          </>


        )}


      </Page>
    </Document>
  )
}

export default TransactionsReport;