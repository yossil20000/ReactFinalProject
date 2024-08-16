/* https://react-pdf.org/styling#stylesheet-api */
import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { ITransactionReportTableHeader } from '../../../Interfaces/ITransactionsReport'
const borderColor = '#90e5fc'
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomColor: '#bff0fd',
    backgroundColor: '#bff0fd',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
    textAlign: 'left',
    fontStyle: 'bold',
    flexGrow: 1,
  }
})
let stylesArray:Array<{style: {}}>=[
  StyleSheet.create({
  style: {
    width: '20%',
    height: 'auto',
    borderRightColor: borderColor,
    borderRightWidth: 1
  }
}),
StyleSheet.create({
  style: {
    width: '20%',
    height: 'auto',
    borderRightColor: borderColor,
    borderRightWidth: 1
  }
}),
StyleSheet.create({
  style: {
    width: '20%',
    height: 'auto',
    borderRightColor: borderColor,
    borderRightWidth: 1
  }
}),
StyleSheet.create({
  style: {
    width: '20%',
    height: 'auto',
    borderRightColor: borderColor,
    borderRightWidth: 1
  }
}),
StyleSheet.create({
  style: {
    width: '15%',
    height: 'auto',
    borderRightColor: borderColor,
    borderRightWidth: 1
  }
})
] 
console.info("TransactionsTableHeader/stylesArray",stylesArray)
function TransactionsTableHeader({header}: ITransactionReportTableHeader) {
  console.info("TransactionsTableHeader/header",header)
  return (
    <View style={styles.container}>
      {header.map((i,j) => {
        let s : any = stylesArray[j].style;
        s.width = i.width;
        return (
      <Text style={s}>{i.title}</Text>  
      )})}
      
    </View>
  )
}

export default TransactionsTableHeader