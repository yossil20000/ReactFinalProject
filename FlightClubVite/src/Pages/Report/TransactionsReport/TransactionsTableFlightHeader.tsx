/* https://react-pdf.org/styling#stylesheet-api */
import ReactPDF, { View, Text, StyleSheet } from '@react-pdf/renderer'
import { ITransactionReportTableHeader } from '../../../Interfaces/ITransactionsReport'
const borderColor = '#90e5fc'
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
    fontStyle: 'bold',
  },
  date: {
    width: '20%',
    height: 'auto',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    backgroundColor: '#bff0fd',
  },
  start: {
    width: '20%',
    height: 'auto',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    backgroundColor: '#bff0fd',
  },
  stop: {
    width: '20%',
    height: 'auto',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    backgroundColor: '#bff0fd',
  },
  duration: {
    width: '20%',
    height: 'auto',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    backgroundColor: '#bff0fd',
  },
  amount: {
    width: '20%',
    height: 'auto',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    backgroundColor: '#bff0fd',
  }

})

console.info("TransactionsTableFlightHeader/stylesArray",styles)
function TransactionsTableFlightHeader({header,isTitle}: ITransactionReportTableHeader) {
  console.info("TransactionsTableFlightHeader/header",header)
  return (
    <View style={styles.container}>
      <Text style={styles.date}>Date</Text>  
      <Text style={styles.start}>Engeine Start</Text>
      <Text style={styles.stop}>Engeine Stop</Text>
      <Text style={styles.duration}>Duration</Text>
      <Text style={styles.amount}>Amount</Text>
    </View>
  )
}

export default TransactionsTableFlightHeader