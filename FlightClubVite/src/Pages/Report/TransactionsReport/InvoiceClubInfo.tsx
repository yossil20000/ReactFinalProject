import { View, Text, StyleSheet } from '@react-pdf/renderer'

function InvoiceClubInfo() {
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
      width: 140,textDecoration:'underline'
    }
  
  })
  
  
    return (
      <>
        <View style={styles.invoiceNoContainer}>
          <Text style={styles.lable}>Bank</Text>
          <Text style={styles.invoiceDate}>Leumi</Text>
        </View>
        <View style={styles.invoiceNoContainer}>
          <Text style={styles.lable}>Account Number</Text>
          <Text style={styles.invoiceDate}>18700031</Text>
        </View>
        <View style={styles.invoiceNoContainer}>
          <Text style={styles.lable}>Branch</Text>
          <Text >CARMEL</Text>
        </View>
        <View style={styles.invoiceNoContainer}>
          <Text style={styles.lable}>Branch No'</Text>
          <Text style={styles.invoiceDate}>891</Text>
        </View>
      </>
    )
  }

export default InvoiceClubInfo