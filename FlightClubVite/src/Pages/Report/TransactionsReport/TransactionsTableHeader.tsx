/* https://react-pdf.org/styling#stylesheet-api */
import ReactPDF, { View, Text, StyleSheet } from '@react-pdf/renderer'
import { ITransactionReportTableHeader } from '../../../Interfaces/ITransactionsReport'
const borderColor = '#90e5fc'
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop:0,
    borderBottomColor: '#bff0fd',
    backgroundColor: '#bff0fd',
    borderBottomWidth: 1,
    alignItems: 'flex-start',
    height: 24,
    textAlign: 'left',
    fontStyle: 'bold',
  }
})
let stylesArray:Array<{style: {}}>=[
  StyleSheet.create({
  style: {
    width: '100%',
    height: 'auto',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    backgroundColor: '#bff0fd',
  }
}),
StyleSheet.create({
  style: {
    width: '57%',
    height: 'auto',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    backgroundColor: '#bff0fd',
  }
}),
StyleSheet.create({
  style: {
    width: '15%',
    height: 'auto',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    backgroundColor: '#bff0fd',
  }
}),
StyleSheet.create({
  style: {
    width: '15%',
    height: 'auto',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    backgroundColor: '#bff0fd',
  }
}),
StyleSheet.create({
  style: {
    width: '15%',
    height: 'auto',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    backgroundColor: '#bff0fd',
  }
})
] 
console.info("TransactionsTableHeader/stylesArray",stylesArray)
function TransactionsTableHeader({header,isTitle}: ITransactionReportTableHeader) {
  console.info("TransactionsTableHeader/header",header)
  return (
    <View style={styles.container}>
      {header.map((i,j) => {
        let s : any = stylesArray[j].style;
        s.width = i.width;
        console.info("TransactionsTableHeader/header,s",header,s);
        return (
      <Text style={stylesArray[j].style}>{isTitle ? i.title : i.data}</Text>  
      )})}
      
    </View>
  )
}

export default TransactionsTableHeader