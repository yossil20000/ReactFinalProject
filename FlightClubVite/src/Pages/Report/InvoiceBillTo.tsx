import { IInvoiceDetailes, InvoiceProps } from "../../Interfaces/IReport"
import { View, Text, StyleSheet } from '@react-pdf/renderer'

function InvoiceBillTo(invoiceDetailes: IInvoiceDetailes) {
  const styles = StyleSheet.create({
    headerContainer: {
      marginTop: 12
    },
    billTo: {
     
      paddingBottom: 3,
      fontFamily: 'Helvetica-Oblique'
    }

  })
  return (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.billTo}>Bill To:</Text>
        <Text>{invoiceDetailes.member.family_name} {invoiceDetailes.member.first_name}</Text>
        <Text>{invoiceDetailes.member.member_id}</Text>
      </View>
    </>
  )
}

export default InvoiceBillTo