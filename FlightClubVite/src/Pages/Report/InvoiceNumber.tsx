
import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { IInvoiceDetailes, InvoiceProps } from '../../Interfaces/IReport'
const styles = StyleSheet.create({
  invoiceNoContainer: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'flex-start',
    marginRight: 10
  },
  invoiceDateContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginRight: 10,
    
  },
  invoiceDate: {
    fontSize: 12,
    fontWeight: 700,
  },
  lable: {
    width: 140
  }

})

function InvoiceNumber( invoiceDetailes: IInvoiceDetailes) {
  return (
    <>
      <View style={styles.invoiceNoContainer}>
        <Text style={styles.lable}>Invoice No:</Text>
        <Text style={styles.invoiceDate}>{invoiceDetailes.invoiceNo}</Text>
      </View>
      <View style={styles.invoiceDateContainer}>
        <Text style={styles.lable}>Date:</Text>
        <Text >{invoiceDetailes.date}</Text>
      </View>
    </>
  )
}

export default InvoiceNumber