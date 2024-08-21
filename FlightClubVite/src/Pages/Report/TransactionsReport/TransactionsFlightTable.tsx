import { View, StyleSheet,Text } from '@react-pdf/renderer'

import TransactionsTableHeader from './TransactionsTableHeader'
import TransactionsTableData from './TransactionsTableData'
import { ITransactionTableRowProps } from '../../../Interfaces/ITransactionsReport'
import TransactionsFlightTableData from './TransactionsFlightTableData'
import TransactionsTableFlightHeader from './TransactionsTableFlightHeader'


function TransactionsFlightTable({items,headers,addTotalRow,total,totalRowHEader}: ITransactionTableRowProps) {
  const borderColor = '#000000'
  const styles = StyleSheet.create({
    tableContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 10,
      borderWidth: 1,
      borderColor: '#bff0fd',
      marginRight: 10,
      
    },
    blank: {
      width: '60%',
      height: 'auto',
      borderTopColor: borderColor,
      borderTopWidth: 1,
      backgroundColor: '#FFFFFF',
      textAlign: 'center'
    },
    desription: {
      width: '20%',
      height: 'auto',
      borderTopColor: borderColor,
      borderTopWidth: 1,
      backgroundColor: '#bff0fd',
      textAlign: 'center'
    },
    total: {
      width: '20%',
      height: 'auto',
      borderTopColor: borderColor,
      borderTopWidth: 1,
      backgroundColor: '#bff0fd',
      textAlign: 'left'
    }
  })
  return (
    <View style={styles.tableContainer} key={"treansaction_item"}>
      <TransactionsTableFlightHeader key={"ti_Header"} header={headers.header} isTitle={true}/>
      <TransactionsFlightTableData key={"ti_data"} items={items} headers={headers} addTotalRow={addTotalRow} total={total} totalRowHEader={totalRowHEader}/>
      {addTotalRow == true ? (<Text style={styles.blank}></Text>) : (<></>)}
      {addTotalRow == true ? (<Text style={styles.desription}>Total</Text>) : (<></>)}
      {addTotalRow == true ? (<Text style={styles.total}>{total}</Text>) : (<></>)}
    </View>
  )
}

export default TransactionsFlightTable