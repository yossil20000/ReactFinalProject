import * as React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowProps, GridValueGetterParams } from '@mui/x-data-grid';
import { useEffect, useMemo, useState } from 'react';
import { useFetchAllOrdersQuery } from '../features/Account/accountApiSlice';
import ActionButtons, { EAction } from './Buttons/ActionButtons';
import { Box, Button } from '@mui/material';
import TransactionAction from './Accounts/TransactionAction';
import { IOrder } from '../Interfaces/API/IAccount';



const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

export default function DataTablePro() {
  const [rowId, setRowId] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(5);
  const { data: orders } = useFetchAllOrdersQuery();

  const orderRows = useMemo(() => {
    const rows = orders?.data.map((row : IOrder) => ({
      id: row._id, date: new Date(row.order_date).toLocaleDateString(),
      amount: row.amount,
      product: row.orderType.referance,
      units: row.units,
      unitPrice: row.pricePeUnit,
      orderBy: row.orderBy,
      _idMember: row._idMember,
      status: row.status
      ,
    }))
    if (rows !== undefined) {
      return rows
    }
    return []


  }, [orders])
  useEffect(() => {
    console.log("DataTablePro/orders", orders);

  }, [orders])
  const columns: GridColDef[] = useMemo(() => [
    { field: 'id', hide: true },
    { field: 'status', hide: true },
    { field: 'date', headerName: 'Date', width: 100, sortable: false,
    filterable: false},
    { field: 'orderBy', headerName: 'Order By', width: 100 },
    { field: 'product', headerName: 'Product', width: 70 },
    { field: 'units', headerName: 'Units', type: 'number', width: 60 },

    {
      field: 'unitPrice',
      headerName: 'Unit Price',
      type: 'number',
      width: 80,
    },
    { field: 'amount', headerName: 'Total', type: 'number', width: 60 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 160,
      type: 'actions',
      renderCell: (params: GridRenderCellParams) => (
        <Box display={'flex'} flexDirection={'column'} gap={1} height={"5ch"} >

         <TransactionAction {...{params,rowId,setRowId}}/>

        </Box>
      )

    },

  ], [rowId]);

  return (
    <div style={{ height: "100%", width: '100%' }}>
      <DataGrid
        rows={orderRows}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10,15, 20]}
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