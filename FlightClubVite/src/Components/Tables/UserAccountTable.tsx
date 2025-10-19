import '../../Types/date.extensions'
import { Fragment, useEffect, useMemo, useState } from "react"
import GridTable from "./GridTable"
import { GridColDef, GridRowsProp } from "@mui/x-data-grid"
import { GridInitialStateCommunity } from "@mui/x-data-grid/models/gridStateCommunity";
import { ITransaction } from "../../Interfaces/API/IClub";

export interface IUserAccountTableProps {
  transactions: ITransaction[]
}
function UserAccountTable({transactions=[]}: IUserAccountTableProps) {
  const [rows, setRows] = useState<GridRowsProp>([])
function createData(transaction: ITransaction){
  return {
    id: transaction._id,
    _id: transaction._id,
    date: new Date(transaction.date),
    source: transaction.source,
    destination_balance: transaction.destination_balance,
    amount: transaction.amount,
    order_type: transaction.order.type,
    order__id: transaction.order._id,
    description: transaction.description
  }
}
useEffect(() => {
const rows = transactions.map((item) => {
  return createData(item)
})
setRows(rows)
},[transactions])
  
  const columns: GridColDef[] = [
    { field: 'id', type: 'string',minWidth: 230, hideable: true },
    { field: '_id', type: 'string',minWidth: 230, hideable: true },
    {
      field: 'date', headerName: 'Date', type: 'date', sortable: true, editable: true,
      filterable: true, flex: 1, minWidth: 100,maxWidth: 100,valueFormatter: (params) => {
      const date = new Date(params.value);
      return date.getPadDateDisplay();
    }
    },
    { field: 'source', headerName: 'Source', type: 'string', minWidth: 160,maxWidth: 230, flex: 2, editable: true },
    { field: 'destination_balance', headerName: 'P.Balance', type: 'number', minWidth: 140,maxWidth: 140, flex: 1, editable: true },
    { field: 'amount', headerName: 'Amount', type: 'number', minWidth: 120, maxWidth: 120,flex: 1, editable: true },
    { field: 'order_type', headerName: 'Operation', type: 'string', minWidth: 140, maxWidth: 140,flex: 1, editable: true },
    { field: 'order__id', headerName: 'Order Ref', type: 'string', minWidth: 230, flex: 1, editable: true },
    { field: 'description', headerName: 'Description', type: 'string', minWidth: 170, flex: 5, editable: true },

  ];
  let initialState: GridInitialStateCommunity = {
    columns: {
      columnVisibilityModel: {
        _id: false,
        id: false,
        order__id: false
      }
    },
    pagination: { paginationModel: { pageSize: 100 } },
  }
  const onSave = () => {

  }
  return (
    <Fragment >
      <GridTable title={""} style={{}} children={<></>} rows={rows} setRows={setRows} columns={columns} initialState={initialState} onSave={onSave} actionColumn={false}></GridTable>
    </Fragment>
  )
}

export default UserAccountTable