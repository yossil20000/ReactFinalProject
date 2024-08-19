import '../../../Types/date.extensions';
import { Page, Document, StyleSheet ,Text} from "@react-pdf/renderer";
import { bankTitleHeader, ITransactionReportProps, ITransactionReportTableCell, ITransactionTableData, ITransactionTableRow, transactionTableFlightItemHeader, transactionTableFlightTotal, transactionTableItemHeader } from "../../../Interfaces/ITransactionsReport";
import TransactionsReportTitle from "./TransactionsReportTitle";
import { useEffect, useState } from "react";
import TransactionsItemTable from "./TransactionsItemTable";
import { ITransaction, Transaction_OT } from "../../../Interfaces/API/IClub";
import { orderDescription } from '../../../Interfaces/API/IAccount';
import TransactionsFlightTable from './TransactionsFlightTable';
import TransactionsTableHeader from './TransactionsTableHeader';
import InvoiceClubInfo from './InvoiceClubInfo';
import TransactionsReportTitles from './TransactionsReportTitles';

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
    data: new Date(item.date).getDisplayDate(),
    toolTip: "",
    width: "20%"
  }
  cells[0] =  dateCell
  if(item.order.type.toLocaleUpperCase() == Transaction_OT.FLIGHT.toLocaleUpperCase()){
    const flight =JSON.parse(item.description) as orderDescription
    console.info("GetTransactionCells/flight", flight)
    const start: ITransactionReportTableCell = {
      data: flight.engien_start.toFixed(1),
      toolTip: "",
      width: "20%"
    }
    cells[1] =  start 
    const stop: ITransactionReportTableCell = {
      data: flight.engien_stop.toFixed(1),
      toolTip: "",
      width: "20%"
    }
    cells[2] =  stop 
    const duration: ITransactionReportTableCell = {
      data: Number(flight.total).toFixed(1),
      toolTip: "",
      width: "20%"
    }
    cells[3] =  duration
    const amount: ITransactionReportTableCell = {
      data: Number(item.amount).toFixed(2),
      toolTip: "",
      width: "20%"
    }
    cells[4] =  amount  
  }
  else{
    const description: ITransactionReportTableCell = {
      data: item.description,
      toolTip: "",
      width: "60%"
    }
    cells[1] =  description
    const amount: ITransactionReportTableCell = {
      data: item.amount.toFixed(2),
      toolTip: "",
      width: "20%"
    }
    cells[2] =  amount 
  }
  
 
  return cells
}
function GetTransactionTotalCells(isFlight:boolean,total:number,totalFlight: number) : ITransactionReportTableCell[] {
  let cells: ITransactionReportTableCell[] =[]
  const dateCell: ITransactionReportTableCell = {
    data: "",
    toolTip: "",
    width: "20%"
  }
  cells[0] =  dateCell
  if(isFlight){
    
    const start: ITransactionReportTableCell = {
      data: "",
      toolTip: "",
      width: "20%"
    }
    cells[1] =  start 
    const stop: ITransactionReportTableCell = {
      data: "",
      toolTip: "",
      width: "20%"
    }
    cells[2] =  stop 
    const duration: ITransactionReportTableCell = {
      data: "Total",
      toolTip: "",
      width: "20%"
    }
    cells[3] =  duration
    const amount: ITransactionReportTableCell = {
      data: "",
      toolTip: "",
      width: "20%"
    }
    cells[4] =  amount  
  }
  else{
    const description: ITransactionReportTableCell = {
      data: "Total",
      toolTip: "",
      width: "60%"
    }
    cells[1] =  description
    const amount: ITransactionReportTableCell = {
      data: total.toFixed(2),
      toolTip: "",
      width: "20%"
    }
    cells[2] =  amount 
  }
  
 
  return cells
}

function TransactionsReport({ transactionTitleHeader, transaction }: ITransactionReportProps) {
  const [transactionData, setTransactionData] = useState<ITransactionData[]>(initTransactionData)

  useEffect(() => {
    let transactionDataInner: ITransactionData[] =[]
    if (transaction) {
      CustomLogger.info("TransactionsReport/transactons", transaction);
      let group = Object.groupBy(transaction, ({ destination }) => destination)

      let values = Object.values(group);
      let keysMembers = Object.keys(group);
      CustomLogger.info("TransactionsReport/values.length,values,keys", values.length, values, keysMembers);
      if (values) {
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
            let memberOrders: ITransactionTableData;
            let ordersForMember: ITransactionOrders[] = [];
            orderKeys.forEach(order => {
              memberOrders = {
                rows: [],
                total: 0
              }
              let currentOrder : ITransactionOrders = {
                data: memberOrders,
                orderKey: order
              }
              orderGroup[order]?.map((item)=> {
                const row : ITransactionTableRow = {
                  row: GetTransactionCells(item)
                }
                
                memberOrders.rows.push(row)
              })
              const amount = orderGroup[order]?.reduce((accumulator, current) => { return current.amount + accumulator }, 0)
              if(amount)
                memberOrders.total = amount
              currentOrder.data = memberOrders
              ordersForMember.push(currentOrder)
              current.orders = ordersForMember
              CustomLogger.info("TransactionsReport/order,orderGroup[order],amount", order, orderGroup[order], amount)
              CustomLogger.info("TransactionsReport/currentOrder",currentOrder)
            })
            transactionDataInner.push(current)
            CustomLogger.info("TransactionsReport/current", current);
          }
        });
      }
      CustomLogger.info("TransactionsReport/transactionDataInner", transactionDataInner);
      setTransactionData(transactionDataInner )
    }
  }, [transaction])
  return (
    <Document>
      <Page size={"A4"} style={styles.page}>
        <TransactionsReportTitle key={"tr_title_h"} title='BAZ Haifa Club' />
        <InvoiceClubInfo/>
        <Text break/>
        {transactionData.map((member) =>
          <>
            <TransactionsReportTitles key={`tr_titles_${member.memberKey}`} title={`${member.memberKey}`} style={{width: "40%"}}/>
            
            {
            member.orders.map((order) => {
              
              const isFlight = order.orderKey.toLocaleUpperCase() === Transaction_OT.FLIGHT.toLocaleUpperCase();
              const totalCell = GetTransactionTotalCells(isFlight,order.data.total,0);
              const tableRows: ITransactionTableRow[] =[ {
                row: totalCell
              }]
              const totalData: ITransactionTableData = {
                rows: tableRows,
                total: 0
              }
              return (              <>
                <TransactionsReportTitles key={`tr_title_${order.orderKey}`} title={`${order.orderKey}`} style={{width: "100%",marginLeft: 0, marginRight: 10, marginTop:10}}/>
                
                {isFlight === true ? (
                  <TransactionsFlightTable key={`tr_ti${order.orderKey}`} items={order.data} headers={ transactionTableFlightItemHeader} 
                addTotalRow={true} total={order.data.total.toFixed(2)} totalRowHEader={transactionTableFlightTotal("",order.data.total.toFixed(1))}/>
                ) : (
                  <TransactionsItemTable key={`tr_ti${order.orderKey}`} items={order.data} headers={ transactionTableItemHeader} 
                addTotalRow={true} total={order.data.total.toFixed(2)} totalRowHEader={transactionTableFlightTotal("",order.data.total.toFixed(1))}/>
                )}
                {/* <TransactionsTableHeader key={"ti_Header"} header={transactionTableFlightTotal("",order.data.total.toFixed(1)).header} isTitle={true}/> */}
                {/* <TransactionsItemTable key={`tr_ti${order.orderKey}`} items={totalData} headers={isFlight ?  transactionTableFlightItemHeader : transactionTableItemHeader} /> */}
                </>)
            }

    
            )}
            <Text break/>
          </>


        )}


      </Page>
    </Document>
  )
}

export default TransactionsReport;