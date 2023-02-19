import "../Types/date.extensions"
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useEffect, useMemo, useState } from 'react';
import { useClubAccountQuery, useFetchTransactionQuery } from '../features/Account/accountApiSlice';
import { Box } from '@mui/material';
import { IClubAccount, ITransaction } from '../Interfaces/API/IClub';
import { InputComboItem } from './Buttons/ControledCombo';
import { IDateFilter } from '../Interfaces/IDateFilter';

interface ITransactionTableProps {
  hideAction?: boolean;
  filter?: ITransactionTableFilter;
  selectedClubAccount: InputComboItem | null;

}
const today = new Date();
export interface ITransactionTableFilter {
    dataFilter : IDateFilter
}
const transactionTableFilter: ITransactionTableFilter = {
  dataFilter: {
    from: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0).addDays(-1),
    to: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0).addDays(1),
    currentOffset: 0
  }
  
}
export default function TransactionTable({ hideAction = false, filter = {} as ITransactionTableFilter, selectedClubAccount }: ITransactionTableProps) {
  const { data: bankAccounts } = useClubAccountQuery();
  const { data: dataTransaction } = useFetchTransactionQuery(filter.dataFilter)
  const [bank, setBank] = useState<IClubAccount | undefined>();
  const [rowId, setRowId] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(5);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
useEffect(()=>{
  console.log("TransactionTable/filter", filter)
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
      paymentMethod : row.payment.method,
      paymentReferance: row.payment.referance,
      order: row.order.type,
      description: row.description
    }))
    if (rows !== undefined) {
      console.log("TransactionTable/orders", rows, transactions);
      return rows
    }
    return []


  }, [transactions])

  const columns: GridColDef[] = useMemo(() => [
    { field: 'id', hide: true },
    { field: 'date', hide: false, headerName: 'Date', minWidth: 80, flex: 1 },
    { field: 'source', headerName: 'Source', minWidth: 100, flex: 3 },
    { field: 'destination', headerName: 'Destination', minWidth: 100, flex: 3 },
    { field: 'order', headerName: 'Order', minWidth: 70, flex: 1 },
    { field: 'amount', headerName: 'Amount', type: 'number', minWidth: 70, flex: 1 },
    { field: 'paymentMethod', headerName: 'PayMethod', type: 'text', minWidth: 80, flex: 1 },
    { field: 'paymentReferance', headerName: 'PayRef', type: 'text', minWidth: 80, flex: 1 },
    { field: 'description', headerName: 'Description', minWidth: 300, flex: 1 },


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