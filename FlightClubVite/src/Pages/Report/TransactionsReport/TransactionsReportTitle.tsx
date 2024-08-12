/* https://react-pdf.org/styling#stylesheet-api */
import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { ITransactionReportTableHeader } from '../../../Interfaces/ITransactionsReport'
const borderColor = '#90e5fc'
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginTop:0,
    borderBottomColor: '#bff0fd',
    
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
   
    fontStyle: 'bold',
    
  }
})
let stylesArray:Array<{style: {}}>=[
  StyleSheet.create({
  style: {
    width: '13%',
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
})
] 
console.info("TransactionsReportTitle/stylesArray",stylesArray)
function TransactionsReportTitle({header,isTitle}: ITransactionReportTableHeader) {
  console.info("TransactionsReportTitle/header",header)
  return (
    <View style={styles.container}>
      {header.map((i,j) => {
        let s : any = stylesArray[j].style;
        s.width = i.width;
        /* s.backgroundColor =  isTitle == false ? '#bff0fd' :  '#d2cfe6'; */
        return (
      <Text style={s}>{isTitle ? i.title : i.data}</Text>  
      )})}
      
    </View>
  )
}

export default TransactionsReportTitle