/* https://react-pdf.org/styling#stylesheet-api */
import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { ITransactionReportTableHeader } from '../../../Interfaces/ITransactionsReport'
const borderColor = '#90e5fc'
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomColor: '#bff0fd',
    backgroundColor: '#bff0fd',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
    textAlign: 'center',
    fontStyle: 'bold',
    flexGrow: 1
  }
})
let stylesArray:Array<{style: {}}>=[
  StyleSheet.create({
  style: {
    width: '13%',
    height: 'auto',
    borderRightColor: borderColor,
    borderRightWidth: 1
  }
}),
StyleSheet.create({
  style: {
    width: '57%',
    height: 'auto',
    borderRightColor: borderColor,
    borderRightWidth: 1
  }
}),
StyleSheet.create({
  style: {
    width: '15%',
    height: 'auto',
    borderRightColor: borderColor,
    borderRightWidth: 1
  }
}),
StyleSheet.create({
  style: {
    width: '15%',
    height: 'auto'
  }
})
] 
console.info("TransactionsReportTitle/stylesArray",stylesArray)
function TransactionsReportTitle({header}: ITransactionReportTableHeader) {
  console.info("TransactionsReportTitle/header",header)
  return (
    <View style={styles.container}>
      {header.map((i,j) => (
      <Text style={stylesArray[j].style}>{i.title}</Text>  
      ))}
      
    </View>
  )
}

export default TransactionsReportTitle