import { View, StyleSheet,Text } from '@react-pdf/renderer'

import TransactionsTableHeader from './TransactionsTableHeader'
import TransactionsTableData from './TransactionsTableData'
import { ITransactionTableRowProps } from '../../../Interfaces/ITransactionsReport'


function TransactionsItemTable({items,headers,addTotalRow,total,totalRowHEader}: ITransactionTableRowProps) {
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
      <TransactionsTableHeader key={"ti_Header"} header={headers.header} isTitle={true}/>
      <TransactionsTableData key={"ti_data"} items={items} headers={headers} addTotalRow={addTotalRow} total={total} totalRowHEader={totalRowHEader}/>
      {addTotalRow == true ? (<Text style={styles.blank}/>) : (<></>)}
      {addTotalRow == true ? (<Text style={styles.desription}>Total</Text>) : (<></>)}
      {addTotalRow == true ? (<Text style={styles.total}>{total}</Text>) : (<></>)}
     
    </View>
  )
}

export default TransactionsItemTable