import "../Types/date.extensions"
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useEffect, useMemo, useState } from 'react';
import { IDateFilter } from '../Interfaces/IDateFilter';
import IReservation from "../Interfaces/API/IReservation";
import { useFetchAllReservationsQuery } from "../features/Reservations/reservationsApiSlice";
import { IReservationFilterDate } from "../Interfaces/API/IFlightReservation";
import { useAppSelector } from "../app/hooks";
import { ILoginResult } from "../Interfaces/API/ILogin";
import GeneralCanDo, { CanDo } from "../Utils/owner";
import { Box } from "@mui/material";
import ActionButtons, { EAction } from "./Buttons/ActionButtons";
import ReservationAction from "../Pages/Reservations/ReservationAction";


export interface IReservationTableFilter {
  dateFilter : IDateFilter
}
interface IReservationTableProps {
  hideAction?: boolean;
  filter?: IReservationTableFilter;
  
}
export interface IReservationTable extends IReservation {
  validOperation: CanDo
}

export default function ReservationTable({ hideAction = false, filter = {} as IReservationTableFilter }: IReservationTableProps) {
  const login: ILoginResult = useAppSelector<ILoginResult>((state) => state.authSlice);

  const { data: dataReservations, isError, isLoading, isSuccess, error, refetch } = useFetchAllReservationsQuery(filter.dateFilter);
  
  const [rowId, setRowId] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(5);
  const [reservations, setReservations] = useState<IReservation[]>([]);
useEffect(()=>{
  console.log("ReservationTable/filter", filter)
},[filter])

useEffect(() => {
  console.log("ReservationTable/useEffect", dataReservations)
  if(dataReservations?.data)
   setReservations(dataReservations.data)
},[dataReservations])

  const transactionRows = useMemo(() => {

    const rows = reservations?.map((row: IReservation) => ({
      id: row._id,
      device: row.device.device_id,
      date_from: new Date(row.date_from).toLocaleDateString(),
      date_to: new Date(row.date_to).toLocaleDateString(),
      name: row.member.family_name,
      member_id: row.member.member_id,
      validOperation : GeneralCanDo(row.member._id, login.member._id, login.member.roles)
    }))
    if (rows !== undefined) {
      console.log("ReservationTable/orders", rows, reservations);
      return rows
    }
    return []


  }, [reservations])
  const getCanDoAction = (canDo : CanDo) : EAction[] => {
    console.log("ReservationTable/getCanDoAction",canDo)
    let actions : EAction[] = []

    if(canDo & CanDo.Edit)
       actions.push(EAction.EDIT)
    if(canDo & CanDo.Delete)
      actions.push(EAction.DELETE)
    console.log("ReservationTable/getCanDoAction/actions",actions)
    return actions;
  }
  const columns: GridColDef[] = useMemo(() => [
    { field: 'id', hide: true },
    { field: 'device', hide: false, headerName: 'Device', minWidth: 70, flex: 1 },
    { field: 'date_from', hide: false, headerName: 'From', minWidth: 80, flex: 1 },
    { field: 'date_to', headerName: 'To', minWidth: 80, flex: 1 },
    { field: 'name', headerName: 'Name', minWidth: 80, flex: 1 },
    { field: 'member_id', headerName: 'Id Number', minWidth: 100, flex: 1 },
    {
      field: 'actions',
      flex:1,
      headerName: 'Actions',
      minWidth: 140,
      type: 'actions',
      hide: hideAction,
      renderCell: (params: GridRenderCellParams) => (
        <Box display={'flex'} flexDirection={'row'} gap={1} height={"5ch"} >
         {params.row.validOperation === CanDo.Edit}
         <ActionButtons OnAction={onAction} show={getCanDoAction(params.row.validOperation)} item={params.row.id} display={[{ key: EAction.EDIT, value: "" },{ key: EAction.DELETE, value: "" } ]} />
         
        </Box>
      )

    },

  ], [rowId, hideAction]);
  function onAction(action: EAction, event?: React.MouseEvent<HTMLButtonElement, MouseEvent>, item?: string) {
    event?.defaultPrevented
    console.log("ReservationTable/onAction", event?.target, action, item)
    switch (action) {
      case EAction.ADD:

        
        break;
      case EAction.EDIT:
        if (item !== undefined) {
          
        }
        break;
      case EAction.PAY:
        if (item !== undefined) {
          
        }
        break;
      case EAction.DELETE:
        if(item !== undefined){
          
        }
    }
  }
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