import { PDFViewer } from '@react-pdf/renderer'
import TransactionsReport from './TransactionsReport'
import { ITransactionReportProps } from '../../../Interfaces/ITransactionsReport'



function TranasctionsPage(props:ITransactionReportProps)  {

  return (
    <>
      <PDFViewer width={"1000"} height={"800"}>
        <TransactionsReport />
      </PDFViewer>
    </>
  )
}

export default TranasctionsPage