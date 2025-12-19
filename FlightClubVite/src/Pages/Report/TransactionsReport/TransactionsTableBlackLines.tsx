import { View, Text, StyleSheet } from '@react-pdf/renderer'
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
    fontWeight: 700,

  },
  date: {
    width: '13%',
    borderRightColor: borderColor,
    borderRightWidth: 1
  },
  description: {
    width: '57%',
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
export interface ITableBlacLineProps {
  rowCounts: number
}
function TransactionsTableBlackLines({ rowCounts }: ITableBlacLineProps) {
  const blankRows = Array(rowCounts).fill(0);
  const rows = blankRows.map((x, i) =>
    <View style={styles.row} key={`BR${i}`}>
      <Text style={styles.date}>-</Text>
      <Text style={styles.description}>-</Text>
      <Text style={styles.rate}>-</Text>
      <Text style={styles.amount}>-</Text>
    </View>
  )
  return (
    <>{rows}</>
  )
}

export default TransactionsTableBlackLines