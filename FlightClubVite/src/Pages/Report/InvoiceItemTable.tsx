import { View, Text, StyleSheet } from '@react-pdf/renderer'
import InvoiceTabHeader from './InvoiceTabHeader'
import { InvoiceData } from '../../Interfaces/IReport'
import InvoiceTableRow from './InvoiceTableRow'
import InvoiceTableBlackLines from './InvoiceTableBlackLines'
import InvoiceTableFooter from './InvoiceTableFooter'
export interface ITableRowProps {
  items: InvoiceData[]
}
function InvoiceItemTable({items}: ITableRowProps) {
  const styles = StyleSheet.create({
    tableContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 40,
      borderWidth: 1,
      borderColor: '#bff0fd',
      marginRight: 10,
    }
  })
  return (
    <View style={styles.tableContainer}>
      <InvoiceTabHeader />
      <InvoiceTableRow items={items}/>
      <InvoiceTableBlackLines rowCounts={4}/>
      <InvoiceTableFooter total={34.5}/>
    </View>
  )
}

export default InvoiceItemTable