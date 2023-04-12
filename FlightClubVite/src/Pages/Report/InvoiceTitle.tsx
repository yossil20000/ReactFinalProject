import { View , Text,StyleSheet,Image} from '@react-pdf/renderer'
import invoiceLogo from '../../Asset/invoice.png'
type title = {
  title: string
}
const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    marginTop:0
  },
  reportTitle: {
    color: '#61dafb',
    letterSpacing: 4,
    fontSize: 25,
    marginRight: 'auto',
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  logo: {
    width: 35,
    height: 35,
   
    marginRight: 'auto'
  }
})
function InvoiceTitle({title} : title) {
  return (
    <View style={styles.titleContainer}>
      <Image style={styles.logo} src={invoiceLogo} />
      <Text style={styles.reportTitle}>{title}</Text>
    </View>
  )
}

export default InvoiceTitle