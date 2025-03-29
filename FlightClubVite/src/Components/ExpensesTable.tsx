import '../Types/date.extensions'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import { useFetchExpenseQuery } from '../features/Account/accountApiSlice';
import { Box } from '@mui/material';
import { IExpense } from '../Interfaces/API/IExpense';
import FullScreenLoader from './FullScreenLoader';
import { Status } from '../Interfaces/API/IStatus';
import { OrderStatus } from '../Interfaces/API/IAccount';
import ActionButtons, { EAction } from './Buttons/ActionButtons';
import { Role } from '../Interfaces/API/IMember';
import { UseIsAuthorized } from './RequireAuth';


interface IExpenseTableProps {
  hideAction?: boolean;
  filter?: any;
  onAction?: (action: EAction, event?: React.MouseEvent<HTMLButtonElement, MouseEvent>, item?: string) => void;
  // selectedClubAccount: InputComboItem | null;
}
export default function ExpenseTable({  hideAction = false, filter = {}, onAction = () => {} }: IExpenseTableProps) {
  const isAuthorized = UseIsAuthorized({ roles: [Role.desk, Role.admin, Role.account] })
      
  const [rowId, setRowId] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(50);
  const [page, setPage] = useState(1);
  const { data: Expenses,  isLoading, error } = useFetchExpenseQuery({});
  
  const  getExpenseStatistics = (expenses: IExpense[]) => {
    const total = expenses.reduce((acc, expense) => acc + expense.amount, 0); 
    const average = total / expenses.length;
    const max = Math.max(...expenses.map(expense => expense.amount));
    const min = Math.min(...expenses.map(expense => expense.amount));
    const groupByCategory = Object.groupBy(expenses, (expense) => expense.expense.category)
    const groupByType = Object.entries(groupByCategory).map(([key, value]) => {
      if(value)
      return [key,Object.groupBy(value, (expense) => expense.expense.type)]
      
    })

    const groupBy = Object.entries(groupByCategory).map(([key, value]) => { 
      const total = value?.reduce((acc, expense) => acc + expense.amount, 0); 
      /* const average = total / value?.length; */
      /* const max = Math.max(...value?.map(expense => expense.amount));
      const min = Math.min(...value?.map(expense => expense.amount)); */
      return { key, total };
    }); 
    CustomLogger.error("ExpenseTable/getExpenseStatistics/groupByCategory", groupBy,groupByCategory,groupByType)
    return { total, average, max, min,groupBy ,groupByCategory};  
  }
  const ExpenseRows = useMemo(() => {

    CustomLogger.log("ExpenseTable/ExpenseRows/filter/filter", filter)
    const rows = Expenses?.data.filter((item) => true).map((row: IExpense) => ({
      _id: row._id, date: new Date(row.date),
      units: row.units,
      pricePeUnit: row.pricePeUnit,
      amount: row.amount,
      category: row.expense.category,
      type: row.expense.type,
      utilizated: row.expense.utilizated,
      description: row.description,
      status: row.status,
      source: row.source.display,
      destination: row.destination.display,
    }))
    if(Expenses?.data.length ){
      getExpenseStatistics(Expenses.data)
      CustomLogger.info("ExpenseTable/ExpenseRows/Expenses", getExpenseStatistics(Expenses.data))
     
    }
    if (rows !== undefined) {
      CustomLogger.info("ExpenseTable/ExpenseRows/Expenses", rows, Expenses);
      return rows
    }
    
    return [filter]


  }, [Expenses,  filter.ExpenseStatus])
 
  const columns: GridColDef[] = useMemo(() => [
    { field: '_id', headerName: 'id',hideable: true, minWidth: 50, type: 'string' },
    { field: 'date', headerName: 'Date', minWidth: 30, type: 'date' },
    { field: 'units', headerName: 'Units', minWidth: 40, type: 'number' },
    { field: 'pricePeUnit', headerName: 'Per Unit', minWidth: 90, type: 'number' },
    { field: 'amount', headerName: 'Amount', minWidth: 70, type: 'number' },
    { field: 'category', headerName: 'Category', minWidth: 70, type: 'string' },
    { field: 'type', headerName: 'Type', minWidth: 70, type: 'string', flex:2 },
    { field: 'utilizated', headerName: 'Utilizated', minWidth: 70, type: 'string' , flex:2},
    { field: 'description', headerName: 'Description', minWidth: 170, type: 'string' },
    { field: 'status', headerName: 'Status', minWidth: 70, type: 'string', format: (value: Status) => value.toLocaleUpperCase(), isCell: true },
    { field: 'source', headerName: 'Source', minWidth: 170, type: 'string' },
    { field: 'destination', headerName: 'Destination', minWidth: 170, type: 'string',flex: 2 },
    {
      field: 'actions',
      flex: 3,
      headerName: 'Actions',
      minWidth: 180,
      type: 'actions',
      hide: hideAction,
      renderCell: (params: GridRenderCellParams) => (
        <Box display={'flex'} flexDirection={'row'} gap={1} height={"5ch"} >
        <>{params.row.status == OrderStatus.CREATED ? (<>
          <Box display={'flex'} flexDirection={'row'} gap={1}>
            <ActionButtons OnAction={onAction} show={[EAction.EDIT]} item={params.row._id} display={[{ key: EAction.EDIT, value: "Edit" }]} disable={[{ key: EAction.EDIT, value: !isAuthorized }]} />
            <ActionButtons OnAction={onAction} show={[EAction.PAY]} item={params.row._id} display={[{ key: EAction.PAY, value: "Transact" }]} disable={[{ key: EAction.PAY, value: !isAuthorized }]} />
            <ActionButtons OnAction={onAction} show={[EAction.DELETE]} item={params.row._id} display={[{ key: EAction.DELETE, value: "Delete" }]} disable={[{ key: EAction.DELETE, value: !isAuthorized }]} />
          </Box>
        </>) : (<></>)}
        </>
        </Box>
      )

    },

  ], [rowId, hideAction,isAuthorized]);

  if (isLoading) {
    CustomLogger.info('ExpenseTable/isLoading', isLoading)
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
      CustomLogger.error('ExpenseTable/error', errMsg)
      return (
        <div>
          <div>ExpenseTable</div>
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
          columns: {
            columnVisibilityModel: {
              _id: false,
              member: false,
              description: false
            }
          }
        }}

        rows={ExpenseRows}
        columns={columns}
        pageSizeOptions={[5, 10, 15, 20, 50, 100]}
        onPaginationModelChange={(newPageSize) => { setPageSize(newPageSize.pageSize), setPage(newPageSize.page) }}
        paginationModel={{ page, pageSize }}
        checkboxSelection={false}
        getRowId={(row) => row._id}
        disableRowSelectionOnClick
        onCellEditStop={(params, event) => setRowId(params.id.toString())}
      /* rowHeight={123} */

      />
    </div>
  );
}