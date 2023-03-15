import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import { useGetOrderSearchQuery } from '../features/Account/accountApiSlice';
import { Box } from '@mui/material';
import TransactionAction from './Accounts/TransactionAction';
import { IOrder } from '../Interfaces/API/IAccount';
import { EAccountType, IAddTransaction, PaymentMethod, Transaction_OT, Transaction_Type } from '../Interfaces/API/IClub';
import { InputComboItem } from './Buttons/ControledCombo';

interface IOrderTableProps {
  hideAction?: boolean;
  filter?: any;
  selectedClubAccount: InputComboItem | null;
  selectedMember: InputComboItem | null;
}
export default function OrderTable({selectedMember, hideAction=false,filter={},selectedClubAccount}: IOrderTableProps) {
  const [rowId, setRowId] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(5);
  const { data: orders } = useGetOrderSearchQuery(filter);
  console.log("OrderTable/selectedClubAccount/",selectedClubAccount)
  
  const getTransaction = useMemo (() => (sourseId: string,destinationId: string , id: string ,amount: number,description: string) : IAddTransaction => {
    console.log("OrderTable/getTransaction/selectedClubAccount,orders",selectedClubAccount,orders)
    let addTransaction : IAddTransaction = {
      source: {
        _id: sourseId,
        accountType: EAccountType.EAT_ACCOUNT
      },
      destination: {
        _id: destinationId,
        accountType: EAccountType.EAT_BANK
      },
      amount: amount,
      type: Transaction_Type.CREDIT,
      order: {
        _id: id,
        type: Transaction_OT.ORDER
      },
      payment:{
        method: PaymentMethod.TRANSFER,
        referance: ""
      },
      description: description,
      date: new Date()
    }
    console.log("OrderTable/getTransaction/addTransaction",addTransaction,orders)
    return addTransaction;
  },[selectedClubAccount] )

  const orderRows = useMemo(() => {
    const rows = orders?.data.filter((item) => {
      console.log("OrderTable/orderRows/filter/item", item,selectedMember)
      
      if(!selectedMember  || selectedMember?.lable == "") return true;
      if(selectedMember?._id == item.member?._id)
        return true ;
      return false;
    }).map((row : IOrder) => ({
      id: row._id, date: new Date(row.order_date).toLocaleDateString(),
      amount: row.amount,
      product: row.orderType.referance,
      units: row.units,
      unitPrice: row.pricePeUnit,
      orderBy: `${row.member?.family_name}/${row.member?.member_id}`,
      member: row.member === undefined ? undefined : row.member,
      status: row.status,
      description: `${row.description}`
      ,
    }))
    if (rows !== undefined) {
      console.log("OrderTable/orders",rows,orders);
      return rows
    }
    return []


  }, [orders,selectedMember,selectedClubAccount])

  

  const columns: GridColDef[] = useMemo(() => [
    { field: 'id', hide: true },
    { field: 'member', hide: true },
    { field: 'description', hide: true },
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
      hide: hideAction,
      renderCell: (params: GridRenderCellParams) => (
        <Box display={'flex'} flexDirection={'column'} gap={1} height={"5ch"} >
 
         <TransactionAction {...{params,rowId,setRowId,transaction: getTransaction("",selectedClubAccount ? selectedClubAccount._id : "",params.row.id, params.row.amount,params.row.description)}}/>

        </Box>
      )

    },

  ], [rowId,hideAction,selectedClubAccount]);

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