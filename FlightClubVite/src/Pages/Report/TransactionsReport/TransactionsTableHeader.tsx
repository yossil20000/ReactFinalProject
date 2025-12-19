/* https://react-pdf.org/styling#stylesheet-api */
import ReactPDF, { View, Text, StyleSheet } from '@react-pdf/renderer'
import { ITransactionReportTableHeader } from '../../../Interfaces/ITransactionsReport'
const borderColor = '#000000'
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop:0,
    borderBottomColor: '#bff0fd',
    backgroundColor: '#bff0fd',
    borderBottomWidth: 1,
    alignItems: 'flex-start',
    height: 24,
    textAlign: 'left',
    fontWeight: 700,
  },
  date: {
    width: '20%',
    height: '100%',
    borderBottomColor: borderColor,
    borderBottomWidth: 1,
    backgroundColor: '#bff0fd',
  },
  desription: {
    width: '60%',
    height: '100%',
    borderBottomColor: borderColor,
    borderBottomWidth: 1,
    backgroundColor: '#bff0fd',
  },
  total: {
    width: '20%',
    height: '100%',
    borderBottomColor: borderColor,
    borderBottomWidth: 1,
    backgroundColor: '#bff0fd',
  }
})

console.info("TransactionsTableHeader/stylesArray",styles)
function TransactionsTableHeader({header,isTitle}: ITransactionReportTableHeader) {
  console.info("TransactionsTableHeader/header",header)
  return (
    <View style={styles.container}>
      <Text style={styles.date}>Date</Text>  
      <Text style={styles.desription}>Description</Text>
      <Text style={styles.total}>Total</Text>
    </View>
  )
}

export default TransactionsTableHeader