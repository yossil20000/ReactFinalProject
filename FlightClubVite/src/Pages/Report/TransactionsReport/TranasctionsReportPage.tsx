import { PDFViewer } from '@react-pdf/renderer'
import TransactionsReport from './TransactionsReport'
import { ITranasctionsReportPageProps, ITransactionReportProps } from '../../../Interfaces/ITransactionsReport'
import { useClubAccountQuery, useFetchTransactionQuery } from '../../../features/Account/accountApiSlice';
import { useEffect } from 'react';



function TranasctionsReportPage(props:ITranasctionsReportPageProps)  {
  const { data: bankAccount,refetch: refetchAccount } = useClubAccountQuery(false);
  const { data: transactions , isLoading,error ,refetch: refetchTransaction} = useFetchTransactionQuery(props.filter.dateFilter)
  useEffect(() => { 
    CustomLogger.info("TranasctionsReportPage/props", bankAccount, transactions)
  }, [bankAccount,transactions])
  return (
      <PDFViewer width={"1000"} height={"800"}>
        <TransactionsReport bankAccount={bankAccount} transactions={transactions}/>
      </PDFViewer>
  )
}

export default TranasctionsReportPage