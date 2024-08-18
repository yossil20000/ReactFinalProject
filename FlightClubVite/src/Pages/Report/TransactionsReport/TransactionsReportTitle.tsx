import { View , Text,StyleSheet,Image} from '@react-pdf/renderer'
import invoiceLogo from '../../../../src/Asset/images/favicon_baz.jpg'
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
    fontSize: 35,
    margin: 'auto',
    textAlign: 'center',
    textTransform: 'uppercase',
    textDecoration: 'underline'
  },
  logo: {
    width: 35,
    height: 35,
   
    margin: 'auto'
  }
})
function TransactionsReportTitle({title} : title) {
  return (
    <View style={styles.titleContainer}>
      <Image style={styles.logo} src={invoiceLogo} />
      <Text style={styles.reportTitle}>{title}</Text>
      <Image style={styles.logo} src={invoiceLogo} />
    </View>
  )
}

export default TransactionsReportTitle