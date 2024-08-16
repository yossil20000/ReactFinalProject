import { View, StyleSheet } from '@react-pdf/renderer'

import TransactionsTableHeader from './TransactionsTableHeader'
import TransactionsTableData from './TransactionsTableData'
import TransactionsTableBlackLines from './TransactionsTableBlackLines'
import { ITransactionTableRowProps } from '../../../Interfaces/ITransactionsReport'


function TransactionsItemTable({items,headers}: ITransactionTableRowProps) {
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
    <View style={styles.tableContainer} key={"treansaction_item"}>
      <TransactionsTableHeader key={"ti_Header"} header={headers.header} isTitle={true}/>
      <TransactionsTableData key={"ti_data"} items={items} headers={headers}/>
      <TransactionsTableBlackLines key={"ti_bl"} rowCounts={1}/>
     
    </View>
  )
}

export default TransactionsItemTable