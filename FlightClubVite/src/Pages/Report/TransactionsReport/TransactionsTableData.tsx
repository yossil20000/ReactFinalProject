import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { ITransactionTableRow, ITransactionTableRowProps } from '../../../Interfaces/ITransactionsReport'
import { textAlign } from '@mui/system'

const borderColor = '#90e5fc'
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomColor: '#bff0fd',
    backgroundColor: '#bee0fd',
    borderBottomWidth: 1,
    alignItems: 'flex-start',
    height: 24,
    textAlign: 'left',
    fontStyle: 'bold',

  }
})

let stylesArray: Array<{ style: {} }> = [
  StyleSheet.create({
    style: {
      width: '20%',
      borderRightColor: borderColor,
      borderRightWidth: 1,
      height: "20px",
      
    }
  }),
  StyleSheet.create({
    style: {
      width: '20%',
      borderRightColor: borderColor,
      borderRightWidth: 1,
      height: "20px"
    }
  }),
  StyleSheet.create({
    style: {
      width: '20%',
      borderRightColor: borderColor,
      borderRightWidth: 1,
      height: "20px"
    }
  }),
  StyleSheet.create({
    style: {
      width: '20%',
      borderRightColor: borderColor,
      borderRightWidth: 1,
      height: "20px"
    }
  }),
  StyleSheet.create({
    style: {
      width: '20%',
      borderRightColor: borderColor,
      borderRightWidth: 1,
      height: "20px"
    }
  })
]
function TransactionsTableData(items: ITransactionTableRowProps) {
  const rows = items.items.rows.map((item: ITransactionTableRow, index: number) => 
    <View style={styles.row} key={index}>
      {item.row.map((i, j) => {
        let s : any = stylesArray[j].style;
        /* s.width = i.width; */
        return (
        
        <Text style={s} key={`col${j}`}>{i.data}</Text>
    )})}
    </View>
  )
  { console.log("TransactionsTableData/rows", rows,items) }
  return (
    <>
      {rows}
    </>
  )
}

export default TransactionsTableData