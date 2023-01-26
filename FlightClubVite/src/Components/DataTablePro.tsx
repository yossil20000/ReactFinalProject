import * as React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowProps, GridValueGetterParams } from '@mui/x-data-grid';
import { useEffect, useMemo, useState } from 'react';
import { useFetchAllOrdersQuery } from '../features/Account/accountApiSlice';
import ActionButtons, { EAction } from './Buttons/ActionButtons';
import { Box, Button } from '@mui/material';
import TransactionAction from './Accounts/TransactionAction';
import { IOrder } from '../Interfaces/API/IAccount';



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
      console.log("DataTablePro/orders",rows,orders);
      return rows
    }
    return []


  }, [orders])

  const columns: GridColDef[] = useMemo(() => [
    { field: 'id', hide: true },
    { field: '_idMember', hide: true },
    { field: 'date',hide: false, headerName: 'Date', minWidth: 100, sortable: true,
    filterable: false,flex:1},
    { field: 'orderBy', headerName: 'Order By', minWidth: 100,flex:2 },
    { field: 'product', headerName: 'Product', minWidth: 100,flex:1 },
    { field: 'units', headerName: 'Units', type: 'number', minWidth: 80 , flex: 1 },

    {
      field: 'unitPrice',
      headerName: 'Unit Price',
      type: 'number',
      minWidth: 80,flex:1
    },
    { field: 'amount', headerName: 'Total', type: 'number', minWidth: 80,flex:1 },
    { field: 'status', headerName: 'Status' ,flex:1},
    {
      field: 'actions',
      flex:1,
      headerName: 'Actions',
      minWidth: 80,
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