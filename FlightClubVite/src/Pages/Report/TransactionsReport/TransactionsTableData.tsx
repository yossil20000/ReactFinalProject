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
    height: 24,
    textAlign: 'left',
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
    borderRightWidth: 1,
    textAlign: 'left',
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

let stylesArray: Array<{ style: {} }> = [
  StyleSheet.create({
    style: {
      width: '13%',
      borderRightColor: borderColor,
      borderRightWidth: 1,
      height: "20px",
      
    }
  }),
  StyleSheet.create({
    style: {
      width: '57%',
      borderRightColor: borderColor,
      borderRightWidth: 1,
      height: "20px"
    }
  }),
  StyleSheet.create({
    style: {
      width: '15%',
      borderRightColor: borderColor,
      borderRightWidth: 1,
      height: "20px"
    }
  }),
  StyleSheet.create({
    style: {
      width: '15%',
      borderRightColor: borderColor,
      borderRightWidth: 1,
      height: "20px"
    }
  }),
  StyleSheet.create({
    style: {
      width: '15%',
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
        s.width = i.width;
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