import { groupBy } from "lodash";
import { StyleSheet } from "@react-pdf/renderer";
import { ITransactionTableFilter } from "../Components/TransactionTable";
import { useEffect, useMemo, useState } from "react";
import { IClubAccount, ITransaction, Transaction_OT } from "../Interfaces/API/IClub";
import { orderDescription } from "../Interfaces/API/IAccount";
import { ITransactionReportTableCell, ITransactionTableData, ITransactionTableRow } from "../Interfaces/ITransactionsReport";
import IResultBase from "../Interfaces/API/IResultBase";
export interface IGetTransacReportDataProps {
  filter: ITransactionTableFilter,
  account: string,
}

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
  data: ITransactionTableData,
  orderKey: string
}
interface ITransactionData {

  memberKey: string,
  orders: ITransactionOrders[]
  totalAmount: number
}
let initTransactionData: ITransactionData[] = [{
  memberKey: "Yossi",
  totalAmount: 0,
  orders: [{
    data: {
      rows: [],
      total: 0
    },
    orderKey: "Other",

  }]
}]
function GetTransactionCells(item: ITransaction): ITransactionReportTableCell[] {
  let cells: ITransactionReportTableCell[] = []
  try {
    const dateCell: ITransactionReportTableCell = {
      data: new Date(item.date).getDisplayDate(),
      toolTip: "",
      width: "20%"
    }
    cells[0] = dateCell
    if (item.order.type.toLocaleUpperCase() == Transaction_OT.FLIGHT.toLocaleUpperCase()) {
      const flight = JSON.parse(item.description) as orderDescription
      console.info("GetTransactionCells/flight", flight)
      const start: ITransactionReportTableCell = {
        data: flight.engien_start.toFixed(1),
        toolTip: "",
        width: "20%"
      }
      cells[1] = start
      const stop: ITransactionReportTableCell = {
        data: flight.engien_stop.toFixed(1),
        toolTip: "",
        width: "20%"
      }
      cells[2] = stop
      const duration: ITransactionReportTableCell = {
        data: Number(flight.total).toFixed(1),
        toolTip: "",
        width: "20%"
      }
      cells[3] = duration
      const amount: ITransactionReportTableCell = {
        data: Number(item.amount).toFixed(2),
        toolTip: "",
        width: "20%"
      }
      cells[4] = amount
    }
    else {
      let itemDescription = item.description;
      if (item.order.type.toLocaleUpperCase() === Transaction_OT.EXPENSE.toLocaleUpperCase()) {
        let items = item.description.split("|")
        itemDescription = items.slice(0, items.length - 2).join(" ")
      }
      const description: ITransactionReportTableCell = {
        data: itemDescription,
        toolTip: "",
        width: "60%"
      }
      cells[1] = description
      const amount: ITransactionReportTableCell = {
        data: Number(item.amount).toFixed(2),
        toolTip: "",
        width: "20%"
      }
      cells[2] = amount
    }
  }
  catch (error) {
    CustomLogger.error("GetTransactionCells:  error", error)
  }
  return cells
}

function useGetTransacReportData(transactions: IResultBase<ITransaction> | undefined, bankAccounts: IResultBase<IClubAccount> | undefined): [ITransactionData[], string] {

  const [bank, setBank] = useState<IClubAccount | undefined>();
  const [transactionData, setTransactionData] = useState<ITransactionData[]>([])
  const getData = useMemo(() => {
    let bankFound: IClubAccount | undefined = undefined;
    if (bankAccounts?.data !== undefined && bankAccounts?.data.length > 0) {
      bankFound = bankAccounts?.data.find((bank) =>
        (bank.club.brand === "BAZ" && bank.club.branch === "HAIFA"))
      if (bankFound === undefined && bankAccounts?.data.length == 1)
        bankFound = bankAccounts.data[0]
      setBank(bankFound)
    }
  }, [bankAccounts])

  useEffect(() => {
    let transactionDataInner: ITransactionData[] = []
    if (transactions && transactions.data) {
      const dataTransaction = transactions.data
      CustomLogger.info("TransactionsReport/transactons", dataTransaction);
      let group = groupBy(dataTransaction, tr => tr.destination)

      let values = Object.values(group);
      let keysMembers = Object.keys(group);
      CustomLogger.info("TransactionsReport/values.length,values,keys,group", values.length, values, keysMembers, group);

      if (keysMembers && keysMembers.length > 0) {
        let totalAmount: number = 0
        keysMembers.forEach(element => {
          let current: ITransactionData = {
            memberKey: element,
            orders: [],
            totalAmount: 0
          }
          totalAmount = 0;
          let transactionRows: ITransactionTableRow[] = []
          CustomLogger.info("TransactionsReport/group[element]", element, group[element]);
          if (group[element]) {
            CustomLogger.info("TransactionsReport/element", element)
            let orderGroup = groupBy(group[element], order => order.order.type)
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
              let currentOrder: ITransactionOrders = {
                data: memberOrders,
                orderKey: order
              }
              orderGroup[order]?.map((item) => {
                const row: ITransactionTableRow = {
                  row: GetTransactionCells(item)
                }

                memberOrders.rows.push(row)
              })
              let totalTransaction: number = 0
              const amount = orderGroup[order]?.reduce((accumulator, current) => {
                if (current.order.type !== Transaction_OT.TRANSFER) { return current.amount + accumulator }
                else {
                  totalTransaction += current.amount
                  return accumulator
                }
              }, 0)
              CustomLogger.info("TransactionsReport/order,orderGroup[order],reduce/,amount,totalAmount ", amount, totalAmount)
              if (amount !== undefined) {

                if (orderGroup[order].length > 0 && orderGroup[order][0].order.type.toLocaleUpperCase() == Transaction_OT.TRANSFER.toLocaleUpperCase())
                  memberOrders.total = totalTransaction
                else
                  memberOrders.total = amount;
                totalAmount += amount;
              }
              currentOrder.data = memberOrders
              ordersForMember.push(currentOrder)
              current.orders = ordersForMember
              CustomLogger.info("TransactionsReport/order,orderGroup[order],amount", order, orderGroup[order], amount)
              CustomLogger.info("TransactionsReport/currentOrder", currentOrder)
            })
            current.totalAmount = totalAmount;
            transactionDataInner.push(current)
            CustomLogger.info("TransactionsReport/current", current);
          }
        });
      }
      CustomLogger.info("TransactionsReport/transactionDataInner", transactionDataInner);
      if (transactionDataInner)
        setTransactionData(transactionDataInner)
    }
  }, [transactions])

  if (transactionData && bank)
    return [transactionData, bank.club.account_id]
  else
    return [[], ""]
}

export default useGetTransacReportData