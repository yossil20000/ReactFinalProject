import "../Types/date.extensions"
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useMemo, useState } from 'react';
import { useFetchTransactionQuery } from '../features/Account/accountApiSlice';
import { ITransaction } from '../Interfaces/API/IClub';
import { InputComboItem } from './Buttons/ControledCombo';
import { IDateFilter } from '../Interfaces/IDateFilter';
import { COrderDescription } from "../Interfaces/API/IAccount";
import FullScreenLoader from "./FullScreenLoader";
import ReportDialog from "./Report/Exel/ReportDialog";
import { CTransactionToReport } from "../Interfaces/API/IAccountReport";
import { GridInitialStateCommunity } from "@mui/x-data-grid/models/gridStateCommunity";


export interface ITransactionTableFilter {
  dateFilter : IDateFilter
}
interface ITransactionTableProps {
  hideAction?: boolean;
  filter?: ITransactionTableFilter;
  selectedClubAccount: InputComboItem | null;
  transactionSave: boolean;
  setTransactionSave: React.Dispatch<React.SetStateAction<boolean>>
}
let initialState: GridInitialStateCommunity = {
  columns: {
    columnVisibilityModel: {
      _id: true,
      date: false
    }
  },
  pagination: { paginationModel: { pageSize: 100 } },
}
export default function TransactionTable({transactionSave,setTransactionSave, hideAction = false, filter = {} as ITransactionTableFilter, selectedClubAccount }: ITransactionTableProps) {
  console.log("TransactionTable/filter", filter)
  const { data: dataTransaction , isLoading,error } = useFetchTransactionQuery(filter.dateFilter)
  const [rowId, setRowId] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  
useEffect(()=>{
  CustomLogger.info("TransactionTable/filter", filter)
},[filter])
const getData = useMemo(() => {

  console.log("TransactionTable/getData", dataTransaction)
  if (dataTransaction?.success) {
    if (selectedClubAccount?.lable !== "") {
      console.log("TransactionTable/selectedClubAccount", dataTransaction.data,selectedClubAccount)
      const filterAccount = dataTransaction.data.filter((item) => (item.source == selectedClubAccount?.lable) || (item.destination == selectedClubAccount?.lable))
      console.log("TransactionTable/filterAccount", filterAccount)
      setTransactions(filterAccount);
    }
    else {

      setTransactions(dataTransaction.data)
    }
  }
}, [dataTransaction, selectedClubAccount])

  const transactionRows = useMemo(() => {
    
    
    const rows = transactions?.map((row: ITransaction) => ({
      id: row._id,
     /*  _id: row._id, */
      date: new Date(row.date).getDisplayDate(),
      source: row.source,
      destination: row.destination,
      source_balance: row.source_balance,
      destination_balance: row.destination_balance,
      amount: row.amount,
      transactionType: row.type,
      paymentMethod : row.payment.method,
      paymentReferance: row.payment.referance,
      order: row.order.type,
      description: COrderDescription.displayTransaction(row.description) 
    }))
    if (rows !== undefined) {
      CustomLogger.info("TransactionTable/orders", rows, transactions);
      return rows
    }
    return []


  }, [transactions])

  const columns: GridColDef[] = useMemo(() => [
    { field: 'id',hideable: true },
    /* { field: '_id',hideable: true }, */
    { field: 'date', hideable: true, headerName: 'Date', minWidth: 90, flex: 1 },
    { field: 'source', headerName: 'Source', minWidth: 100, flex: 3 },
    { field: 'destination', headerName: 'Destination', minWidth: 100, flex: 3 },
    { field: 'order', headerName: 'Order', minWidth: 70, flex: 1 },
    { field: 'destination_balance', headerName: 'D.Balance', type: 'number', minWidth: 70, flex: 1 },
    { field: 'source_balance', headerName: 'S.Balance', type: 'number', minWidth: 70, flex: 1 },
    { field: 'amount', headerName: 'Amount', type: 'number', minWidth: 70, flex: 1 },
    { field: 'transactionType', headerName: 'Type', type: 'number', minWidth: 70, flex: 1 },
    { field: 'paymentMethod', headerName: 'PayMethod', type: 'text', minWidth: 90, flex: 1 },
    { field: 'paymentReferance', headerName: 'PayRef', type: 'text', minWidth: 80, flex: 1 },
    { field: 'description', headerName: 'Description', minWidth: 200, flex: 2 },


  ], [rowId, hideAction]);
  if (isLoading) {
    CustomLogger.info('TransactionTable/isLoading', isLoading)
    return (
      <div className='main' style={{ overflow: 'auto' }}>
        <FullScreenLoader />
      </div>
    )
  }
  
  if (error) {
    if ('status' in error) {
      // you can access all properties of `FetchBaseQueryError` here
      const errMsg = 'error' in error ? error.error : JSON.stringify(error.data)
      CustomLogger.error('TransactionTable/error', errMsg)
      return (
        <div>
          <div>AccountExpenseTab</div>
          <div>An error has occurred:</div>
          <div>{errMsg}</div>
        </div>
      )
    } else {
      // you can access all properties of `SerializedError` here
      return <div>{error.message}</div>
    }
  }
  return (
    <div style={{ height: "100%", width: '100%' }}>
      {transactionSave && <ReportDialog onClose={()=> setTransactionSave(false)} open={transactionSave} table={(new CTransactionToReport(dataTransaction?.data ? dataTransaction.data : [])).getTransactionsToExel()} action="TransactionExport" />}
      <DataGrid
      
       sx={{"& .MuiDataGrid-cellContent": {whiteSpace: "break-spaces"}}}
       getRowHeight={() => 'auto'} 
       columnVisibilityModel={{id:false}}
        rows={transactionRows}
        columns={columns}
        pageSizeOptions={[5, 10, 15, 20,100]}
        paginationModel={{page,pageSize}}
        onPaginationModelChange={(newPageSize) => {setPageSize(newPageSize.pageSize),setPage(newPageSize.page) }}
        initialState={initialState}
        checkboxSelection={false}
        getRowId={(row) => row.id}
        disableRowSelectionOnClick
        onCellEditStop={(params, event) => setRowId(params.id.toString())}
      /* rowHeight={123} */

      />
    </div>
  );
}