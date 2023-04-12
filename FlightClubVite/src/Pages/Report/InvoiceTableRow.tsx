import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { ITableRowProps } from './InvoiceItemTable'
const borderColor = '#90e5fc'
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomColor: '#bff0fd',
    backgroundColor: '#bee0fd',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
    textAlign: 'center',
    fontStyle: 'bold',

  },
  date: {
    width: '13%',
    borderRightColor: borderColor,
    borderRightWidth: 1
  },
  description: {
    width: '47%',
    borderRightColor: borderColor,
    borderRightWidth: 1
  },
  qyt: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1
  },
  rate: {
    width: '15%',
    borderRightColor: borderColor,
    borderRightWidth: 1
  },
  amount: {
    width: '15%'
  },
})

function InvoiceTableRow({ items }: ITableRowProps) {
  const rows = items.map((item, index) =>
    <View style={styles.row} key={index}>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={styles.description}>{item.name}</Text>
      <Text style={styles.qyt}>{item.name}</Text>
      <Text style={styles.rate}>{item.name}</Text>
      <Text style={styles.amount}>{item.name}</Text>
    </View>
  )
  return (
    <>
      {rows}
    </>
  )
}

export default InvoiceTableRow