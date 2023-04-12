import { View, Text, StyleSheet } from '@react-pdf/renderer'
export interface IInvoiceFooterProps {
  message?: string,
}
const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'column',

    marginTop: 'auto',
    marginBottom: 24
  },
  message: {
    fontSize: 10,
    textAlign: 'center'
  },
  greating: {
    fontSize: 12,
    textAlign: 'center',
    textTransform: 'uppercase'
  }
})
function InvoiceFooter({ message }: IInvoiceFooterProps) {
  return (
    <View style={styles.footerContainer}>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.greating}>Have a safe flights</Text>
      <Text style={styles.greating}>Baz Club Haifa</Text>

    </View>
  )
}

export default InvoiceFooter