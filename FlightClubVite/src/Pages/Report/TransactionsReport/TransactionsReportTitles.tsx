import { View , Text,StyleSheet} from '@react-pdf/renderer'
type title = {
  title: string,
  style?: {}
}
let styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    marginTop:0
  },
  reportTitle: {
    
    letterSpacing: 2,
    fontSize: 11,
    
    textAlign: 'left',
    textTransform: 'uppercase',
    textDecoration: 'underline',
    backgroundColor: '#bff0fd',
    width: "90%",
    marginLeft: 'auto',
    marginRight: 'auto'
  }
})
function TransactionsReportTitles({title,style} : title) {
  let s : {} = {...styles.reportTitle,...style}
  return (
    <View style={styles.titleContainer}>
      <Text style={s}>{title}</Text>
    </View>
  )
}

export default TransactionsReportTitles