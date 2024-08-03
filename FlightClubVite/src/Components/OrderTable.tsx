import '../Types/date.extensions'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import { useGetOrderSearchQuery } from '../features/Account/accountApiSlice';
import { Box } from '@mui/material';
import TransactionAction from './Accounts/TransactionAction';
import { IOrder, OrderStatus, OT_REF } from '../Interfaces/API/IAccount';
import { EAccountType, IAddTransaction, PaymentMethod, Transaction_OT, Transaction_Type } from '../Interfaces/API/IClub';
import { InputComboItem } from './Buttons/ControledCombo';
import FullScreenLoader from './FullScreenLoader';
import { QuarterType } from '../Utils/enums';


interface IOrderTableProps {
  hideAction?: boolean;
  filter?: any;
  selectedClubAccount: InputComboItem | null;
  selectedMember: InputComboItem | null;
}
export default function OrderTable({selectedMember, hideAction=false,filter={},selectedClubAccount}: IOrderTableProps) {
  const [rowId, setRowId] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);
  const { data: orders ,isLoading,error} = useGetOrderSearchQuery(filter);
  CustomLogger.log("OrderTable/selectedClubAccount/",selectedClubAccount)
  
  const getTransaction = useMemo (() => (sourseId: string,destinationId: string , order_id: string ,amount: number,description: string, product: Transaction_OT,date:Date) : IAddTransaction => {
    CustomLogger.log("OrderTable/getTransaction/input",sourseId,destinationId,order_id)
    CustomLogger.log("OrderTable/getTransaction/selectedClubAccount,orders",selectedClubAccount,orders)
    let addTransaction : IAddTransaction = {
      source: {
        _id: sourseId,
        accountType: EAccountType.EAT_BANK
      },
      destination: {
        _id: destinationId,
        accountType: EAccountType.EAT_ACCOUNT
      },
      amount: amount,
      type: Transaction_Type.CREDIT,
      order: {
        _id: order_id,
        type: product,
        quarter: QuarterType.NONE
      },
      payment:{
        method: PaymentMethod.NONE,
        referance: ""
      },
      description: description,
      date: new Date(date)
    }
    CustomLogger.info("OrderTable/getTransaction/addTransaction",addTransaction)
    return addTransaction;
  },[selectedClubAccount] )

  const orderRows = useMemo(() => {
    CustomLogger.log("OrderTable/orderRows/filter/member", selectedMember)
    CustomLogger.log("OrderTable/orderRows/filter/filter", filter)
    const rows = orders?.data.filter((item) => {
      CustomLogger.info("OrderTable/orderRows/filter/item", item)

      /* CustomLogger.info("OrderTable/orderRows/filter/item.status.toString() == filter.orderStatus.toString()",item.status.toString() , (filter.orderStatus as OrderStatus)) */
      let doFilter = false;
      if(item.status.toString() == filter.orderStatus.toString())
         {
          doFilter = true;
          CustomLogger.info("OrderTable/orderRows/filter/dofilter_1", doFilter)
        }
      if((!selectedMember  || selectedMember?.lable == "") )
        {
          doFilter = doFilter && true;
          CustomLogger.info("OrderTable/orderRows/filter/dofilter_2", doFilter)
        }
      
      else if((selectedMember?._id == item.member?._id) && item.status == filter.orderStatus)
         { 
          doFilter = doFilter && true
          CustomLogger.info("OrderTable/orderRows/filter/dofilter_3", doFilter)
         }
      else
         { doFilter = false}
      CustomLogger.info("OrderTable/orderRows/filter/dofilter_4", doFilter)
      return doFilter;
    }).map((row : IOrder) => ({
      id: row._id, date: new Date(row.order_date).getDisplayDate(),
      amount: row.amount,
      product: row.orderType.referance,
      units: row.units,
      unitPrice: row.pricePeUnit,
      orderBy: `${row.member?.family_name}/${row.member?.member_id}`,
      member: row.member === undefined ? undefined : row.member,
      status: row.status,
      description: `${row.description}`,
    }))
    if (rows !== undefined) {
      CustomLogger.info("OrderTable/orderRows/orders",rows,orders);
      return rows
    }
    return []


  }, [orders,selectedMember,selectedClubAccount,filter.orderStatus])

  const columns: GridColDef[] = useMemo(() => [
    { field: 'id', hideable: true,minWidth:220 },
    { field: 'member', hide: true },
    { field: 'description', hide: true },
    { field: 'date',hide: false, headerName: 'Date', minWidth: 100, maxWidth: 100,  sortable: true,
    filterable: true,flex:1},
    { field: 'orderBy', headerName: 'Order By', minWidth: 100,flex:2 },
    { field: 'product', headerName: 'Product', minWidth: 80,maxWidth: 80,flex:1 },
    { field: 'units', headerName: 'Units', type: 'number', minWidth: 70 ,maxWidth: 70, flex: 1 },

    {
      field: 'unitPrice',
      headerName: 'Unit Price',
      type: 'number',
      minWidth: 100,maxWidth: 120,flex:1
    },
    { field: 'amount', headerName: 'Total', type: 'number', minWidth: 100,maxWidth: 120,flex:1 },
    { field: 'status', headerName: 'Status' ,minWidth: 120, maxWidth: 120,flex:1},
    {
      field: 'actions',
      flex:1,
      headerName: 'Actions',
      minWidth: 80,
      type: 'actions',
      hide: hideAction,
      renderCell: (params: GridRenderCellParams) => (
        <Box display={'flex'} flexDirection={'column'} gap={1} height={"5ch"} >
 
         <TransactionAction {...{params,rowId,setRowId,orderId : params.row.product !== OT_REF.FLIGHT ? params.row.id : undefined  ,
          transaction: getTransaction(
            selectedClubAccount?._id == undefined ? "" : selectedClubAccount?._id ,params.row.member._id,params.row.id, params.row.amount,params.row.description,params.row.product,params.row.date)}}/>

        </Box>
      )

    },

  ], [rowId,hideAction,selectedClubAccount]);
  
  if (isLoading) {
    CustomLogger.info('OrderTable/isLoading', isLoading)
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
      CustomLogger.error('OrderTable/error', errMsg)
      return (
        <div>
          <div>OrderTable</div>
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
      <DataGrid
      initialState={{
        columns:{
          columnVisibilityModel:{
            id: false,
            member: false,
            description: false
          }
        }
      }}
       
        rows={orderRows}
        columns={columns}
        pageSizeOptions={[5, 10,15, 20,50,100]}
        onPaginationModelChange={(newPageSize) => {setPageSize(newPageSize.pageSize), setPage(newPageSize.page)}}
        paginationModel={{page,pageSize}}
        checkboxSelection={false}
        getRowId={(row) => row.id}
        disableRowSelectionOnClick
        onCellEditStop={(params,event) => setRowId(params.id.toString())}
      /* rowHeight={123} */

      />
    </div>
  );
}