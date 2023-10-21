import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { IInvoiceTableHeader } from '../../Interfaces/IReport'
const borderColor = '#90e5fc'
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomColor: '#bff0fd',
    backgroundColor: '#bff0fd',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
    textAlign: 'center',
    fontStyle: 'bold',
    flexGrow: 1
  },
  date: {
    width: '13%',
    borderRightColor: borderColor,
    borderRightWidth: 1
  },
  description: {
    width: '47%',
    borderRightColor: borderColor,
    borderRightWidth: 1
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
let stylesArray:Array<{style: {}}>=[
  StyleSheet.create({
  style: {
    width: '13%',
    borderRightColor: borderColor,
    borderRightWidth: 1
  }
}),
StyleSheet.create({
  style: {
    width: '47%',
    borderRightColor: borderColor,
    borderRightWidth: 1
  }
}),
StyleSheet.create({
  style: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1
  }
}),
StyleSheet.create({
  style: {
    width: '15%',
    borderRightColor: borderColor,
    borderRightWidth: 1
  }
}),
StyleSheet.create({
  style: {
    width: '15%'
  }
})
] 
function InvoiceTableHeader({header}: IInvoiceTableHeader) {
  return (
    <View style={styles.container}>
      {header.map((i,j) => (
      <Text style={stylesArray[j].style}>{i.title}</Text>  
      ))}
      
    </View>
  )
}

export default InvoiceTableHeader