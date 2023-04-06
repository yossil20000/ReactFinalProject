import "../Types/date.extensions"
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useMemo, useState } from 'react';
import { useFetchTransactionQuery } from '../features/Account/accountApiSlice';
import { ITransaction } from '../Interfaces/API/IClub';
import { InputComboItem } from './Buttons/ControledCombo';
import { IDateFilter } from '../Interfaces/IDateFilter';


export interface ITransactionTableFilter {
  dateFilter : IDateFilter
}
interface ITransactionTableProps {
  hideAction?: boolean;
  filter?: ITransactionTableFilter;
  selectedClubAccount: InputComboItem | null;
}

export default function TransactionTable({ hideAction = false, filter = {} as ITransactionTableFilter, selectedClubAccount }: ITransactionTableProps) {
  
  const { data: dataTransaction } = useFetchTransactionQuery(filter.dateFilter)
  const [rowId, setRowId] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(5);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
useEffect(()=>{
  CustomLogger.info("TransactionTable/filter", filter)
},[filter])
const getData = useMemo(() => {

  console.log("TransactionTable/getData", dataTransaction)
  if (dataTransaction?.success) {
    if (selectedClubAccount?.lable !== "") {
      const filterAccount = dataTransaction.data.filter((item) => (item.source == selectedClubAccount?.lable) || (item.destination == selectedClubAccount?.lable))
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
      date: new Date(row.date).toLocaleDateString(),
      source: row.source,
      destination: row.destination,
      amount: row.amount,
      transactionType: row.type,
      paymentMethod : row.payment.method,
      paymentReferance: row.payment.referance,
      order: row.order.type,
      description: row.description
    }))
    if (rows !== undefined) {
      CustomLogger.info("TransactionTable/orders", rows, transactions);
      return rows
    }
    return []


  }, [transactions])

  const columns: GridColDef[] = useMemo(() => [
    { field: 'id', hide: true },
    { field: 'date', hide: false, headerName: 'Date', minWidth: 90, flex: 1 },
    { field: 'source', headerName: 'Source', minWidth: 100, flex: 3 },
    { field: 'destination', headerName: 'Destination', minWidth: 100, flex: 3 },
    { field: 'order', headerName: 'Order', minWidth: 70, flex: 1 },
    { field: 'amount', headerName: 'Amount', type: 'number', minWidth: 70, flex: 1 },
    { field: 'transactionType', headerName: 'Type', type: 'number', minWidth: 70, flex: 1 },
    { field: 'paymentMethod', headerName: 'PayMethod', type: 'text', minWidth: 80, flex: 1 },
    { field: 'paymentReferance', headerName: 'PayRef', type: 'text', minWidth: 80, flex: 1 },
    { field: 'description', headerName: 'Description', minWidth: 300, flex: 2 },


  ], [rowId, hideAction]);

  return (
    <div style={{ height: "100%", width: '100%' }}>
      <DataGrid
        rows={transactionRows}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 15, 20]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        checkboxSelection={false}
        getRowId={(row) => row.id}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        onCellEditCommit={(params) => setRowId(params.id.toString())}
      /* rowHeight={123} */

      />
    </div>
  );
}