import { View, StyleSheet } from '@react-pdf/renderer'
import { ITableRowProps } from '../../Interfaces/IReport'
import InvoiceTableBlackLines from './InvoiceTableBlackLines'
import InvoiceTableFooter from './InvoiceTableFooter'
import InvoiceTableData from './InvoiceTableRow'
import InvoiceTableHeader from './InvoiceTableHeader'
import InvoiceTableBlackLinesShort from './InvoiceTableBlackLinesShort'

function InvoiceItemTable({items,headers}: ITableRowProps) {
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
    <View style={styles.tableContainer} key={"invoice"}>
      <InvoiceTableHeader key={"tabHeader"} header={headers.header}/>
      <InvoiceTableData key={""} items={items} headers={headers}/>
      <InvoiceTableBlackLines rowCounts={1}/>
      <InvoiceTableFooter total={items.total}/>
      <InvoiceTableBlackLinesShort rowCounts={1}/>
    </View>
  )
}

export default InvoiceItemTable