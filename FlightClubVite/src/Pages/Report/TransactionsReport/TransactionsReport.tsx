import { Page, Document, StyleSheet } from "@react-pdf/renderer";
import { ITransactionReportProps } from "../../../Interfaces/ITransactionsReport";
import TransactionsReportTitle from "./TransactionsReportTitle";
import { useEffect } from "react";
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
function TransactionsReport({transactionTitleHeader,transactons}: ITransactionReportProps) {
  useEffect(() => {
    if(transactons){
      CustomLogger.info("TransactionsReport/transactons",transactons);
      let group = Object.groupBy(transactons,({destination}) => destination)
      
      let values = Object.values(group);
      let keys = Object.keys(group);
      CustomLogger.info("TransactionsReport/b.length,b,keys",values.length,values,keys);
      if(values){
        CustomLogger.info("TransactionsReport/group[keys[0]]",group[keys[0]]);
        keys.forEach(element => {
          CustomLogger.info("TransactionsReport/group[element]",element,group[element]);
          if(group[element])
          {
            CustomLogger.info("TransactionsReport/element",element)
            let orderGroup =  Object.groupBy(group[element],({order}) => {return order.type.toLocaleUpperCase()} )
            CustomLogger.info("TransactionsReport/orderGroup",orderGroup);
            let orderValues = Object.values(orderGroup);
            let orderKeys = Object.keys(orderGroup);
            orderKeys.forEach(order => {
              const amount = orderGroup[order]?.reduce((accumulator,current) => {return current.amount + accumulator },0)
            CustomLogger.info("TransactionsReport/order,orderGroup[order],amount",order,orderGroup[order],amount)  
            })
            CustomLogger.info("TransactionsReport/element,orderValues,orderKeys",element,orderValues,orderKeys);
          }
        });
      }
    }
  },[transactons])
  return (
    <Document>
      <Page size={"A4"} style={styles.page}>
        <TransactionsReportTitle header={transactionTitleHeader} isTitle={true}/>
        <TransactionsReportTitle header={transactionTitleHeader} isTitle={false}/>
      </Page>
    </Document>
  )
}

export default TransactionsReport;