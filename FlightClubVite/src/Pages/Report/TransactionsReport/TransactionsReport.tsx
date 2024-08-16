import { Page, Document, StyleSheet } from "@react-pdf/renderer";
import { ITransactionReportProps, ITransactionReportTableCell, ITransactionTableData, ITransactionTableRow, ITransactionTableRowProps, transactionTableItemHeader } from "../../../Interfaces/ITransactionsReport";
import TransactionsReportTitle from "./TransactionsReportTitle";
import { useEffect, useState } from "react";
import TransactionsItemTable from "./TransactionsItemTable";
import { ITransaction } from "../../../Interfaces/API/IClub";
import { get } from "nested-property";
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
let initTransactionData: ITransactionData[] = [{
  memberKey: "Yossi",
  orders: [{
    data: {
      rows: [],
      total: 0
    },
    orderKey: "Flight"
  }]
}]
function GetTransactionCells(item: ITransaction) : ITransactionReportTableCell[] {
  let cells: ITransactionReportTableCell[] =[]
  const dateCell: ITransactionReportTableCell = {
    data: item.date.getDisplayDate(),
    toolTip: "",
    width: "10%"
  }
  cells[0] =  dateCell
  const descriptionCell: ITransactionReportTableCell = {
    data: item.description,
    toolTip: "",
    width: "40%"
  }
  cells[1] =  descriptionCell  
  return cells
}
function TransactionsReport({ transactionTitleHeader, transaction }: ITransactionReportProps) {
  const [transactionData, setTransactionData] = useState<ITransactionData[]>(initTransactionData)

  useEffect(() => {
    if (transaction) {
      let membersProps : string[] = [];
      let rowsProps: ITransactionTableRowProps[] = [];
      let itemProps: ITransactionTableRowProps = {
        items: {
          rows: [],
          total: 0
        },
        headers: {
          header: [],
          isTitle: true
        }
      }
      CustomLogger.info("TransactionsReport/transactons", transaction);
      let group = Object.groupBy(transaction, ({ destination }) => destination)

      let values = Object.values(group);
      let keysMembers = Object.keys(group);
     
      CustomLogger.info("TransactionsReport/values.length,values,keys", values.length, values, keysMembers);
      if (values) {

        CustomLogger.info("TransactionsReport/group[keys[0]]", group[keysMembers[0]]);
        keysMembers.forEach(element => {
          let current: ITransactionData = {
            memberKey: element,
            orders: []
          }
          let transactionRows : ITransactionTableRow[]=[]
          CustomLogger.info("TransactionsReport/group[element]", element, group[element]);
          if (group[element]) {
            CustomLogger.info("TransactionsReport/element", element)
            let orderGroup = Object.groupBy(group[element], ({ order }) => { return order.type.toLocaleUpperCase() })
            CustomLogger.info("TransactionsReport/orderGroup", orderGroup);
            let orderValues = Object.values(orderGroup);
            let orderKeys = Object.keys(orderGroup);
            orderKeys.forEach(order => {
              let currentData : ITransactionTableData = {
                rows: [],
                total: 0
              }
              let currentOrder : ITransactionOrders = {
                data: currentData,
                orderKey: order
              }
              orderGroup[order]?.map((item)=> {
                const temp =GetTransactionCells(item)
                const row : ITransactionTableRow = {
                  row: temp
                }
                
                currentData.rows.push(row)
              })
              const amount = orderGroup[order]?.reduce((accumulator, current) => { return current.amount + accumulator }, 0)
              if(amount)
                currentData.total = amount
              CustomLogger.info("TransactionsReport/order,orderGroup[order],amount", order, orderGroup[order], amount)
            })
            CustomLogger.info("TransactionsReport/element,orderValues,orderKeys", element, orderValues, orderKeys);
          }
        });
      }
      
      setTransactionData(initTransactionData)
    }
  }, [transaction])
  return (
    <Document>
      <Page size={"A4"} style={styles.page}>
        <TransactionsReportTitle key={"tr_title_h"} header={transactionTitleHeader} isTitle={true} />
        <TransactionsReportTitle key={"tr_title_d"} header={transactionTitleHeader} isTitle={false} />
        {transactionData.map((member) =>
          <>
            <TransactionsReportTitle key={`tr_title_${member.memberKey}`} header={[{ title: `${member.memberKey}`, toolTip: "For Member", data: `${member.memberKey}`, width: "100%" }]} isTitle={false} />
            {member.orders.map((order) =>
              <>
              <TransactionsReportTitle key={`tr_title_${order.orderKey}`} header={[{ title: `${order.orderKey}`, toolTip: "For Member", data: `${order.orderKey}`, width: "100%" }]} isTitle={false} />
              <TransactionsItemTable key={`tr_ti${order.orderKey}`} items={order.data} headers={transactionTableItemHeader} />
              </>
    
            )}
          </>


        )}


      </Page>
    </Document>
  )
}

export default TransactionsReport;