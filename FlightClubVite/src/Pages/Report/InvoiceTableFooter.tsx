import { View, Text, StyleSheet } from '@react-pdf/renderer'
const borderColor = '#90e5fc'
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomColor: '#bff0fd',
    backgroundColor: '#bff0fd',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
    textAlign: 'center',
    fontStyle: 'bold',

  },
  description: {
    width: '85%',
    textAlign: 'right',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingRight: 8
  },
  total: {
    width: '15%',
    paddingRight: 8
  },
})
export interface ITableFooterProps {
  total: number
}
function InvoiceTableFooter({ total }: ITableFooterProps) {
  
  return (
    <View style={styles.row} >
      <Text style={styles.description}>Total</Text>
      <Text style={styles.total}>{total.toFixed(2)}</Text>
    </View>
  )
}

export default InvoiceTableFooter