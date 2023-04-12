import { View, Text, StyleSheet } from '@react-pdf/renderer'
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
function InvoiceTabHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.date}>Date</Text>
      <Text style={styles.description}>Item Description</Text>
      <Text style={styles.qyt}>Qyt</Text>
      <Text style={styles.rate}>@</Text>
      <Text style={styles.amount}>Amount</Text>
    </View>
  )
}

export default InvoiceTabHeader