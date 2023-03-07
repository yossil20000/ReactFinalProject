import "../Types/date.extensions"
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useEffect, useMemo, useState } from 'react';
import { IDateFilter } from '../Interfaces/IDateFilter';
import IReservation, { IReservationUpdate, ReservationUpdate } from "../Interfaces/API/IReservation";
import { useFetchAllReservationsQuery } from "../features/Reservations/reservationsApiSlice";
import { useAppSelector } from "../app/hooks";
import { ILoginResult } from "../Interfaces/API/ILogin";
import GeneralCanDo, { CanDo } from "../Utils/owner";
import { Box } from "@mui/material";
import ActionButtons, { EAction } from "./Buttons/ActionButtons";
import UpdateReservationDialog from "../Pages/Reservations/UpdateReservationDialog";

let reservationUpdateIntitial: IReservationUpdate = {
  date_from: new Date(),
  date_to: new Date(),
  _id: "",
  device_name: "",
  member_name: ""

}


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
  const [reservationUpdate, setReservationUpdate] = useState<IReservationUpdate>(reservationUpdateIntitial);
  const { data: dataReservations, isError, isLoading, isSuccess, error, refetch } = useFetchAllReservationsQuery(filter.dateFilter);
  const [openUpdate,setOpenUpdate] = useState(false)
  const [openDelete,setOpenDelete] = useState(false)
  const [rowId, setRowId] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(5);
  const [reservations, setReservations] = useState<IReservation[]>();
useEffect(()=>{
  console.log("ReservationTable/filter", filter)
},[filter])

useEffect(() => {
  console.log("ReservationTable/useEffect", dataReservations)
  if(dataReservations?.data)
   setReservations(dataReservations.data)
},[isLoading])

  const transactionRows = () => {

    const rows = reservations?.map((row: IReservation) => ({
      id: row._id,
      device: row.device.device_id,
      date_from: new Date(row.date_from).toLocaleString(),
      date_to: new Date(row.date_to).toLocaleString(),
      name: row.member.family_name,
      member_id: row.member.member_id,
      validOperation : GeneralCanDo(row.member._id, login.member._id, login.member.roles)
    }))
    if (rows !== undefined) {
      console.log("ReservationTable/rows", rows, reservations);
      return rows
    }
    return []


  }
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

  ], [rowId, hideAction,reservations]);
  function onAction(action: EAction, event?: React.MouseEvent<HTMLButtonElement, MouseEvent>, item?: string) {
    event?.defaultPrevented
    console.log("ReservationTable/onAction", event?.target, action, item)
    switch (action) {

      case EAction.EDIT:
        if (item !== undefined) {
          getReservationUpdate(item)
          setOpenUpdate(true);
        }
        break;
      case EAction.DELETE:
        if(item !== undefined){
          setOpenDelete(true);
        }
    }
  }
  const handleOnClose = () => {
    setOpenDelete(false);
    setOpenUpdate(false);
  }
 const getReservationUpdate = (item: string) : any => {
  const reservation = reservations?.find((i) => i._id == item) 
  if(reservation !== undefined)
  {
    const updateReservation = new ReservationUpdate();
    updateReservation.copyReservation(reservation);
    setReservationUpdate(updateReservation as IReservationUpdate)
    return updateReservation as unknown as IReservationUpdate
  }
  

  
  return new ReservationUpdate() as IReservationUpdate
 }
  return (
    <div style={{ height: "100%", width: '100%' }}>
      {openUpdate && <UpdateReservationDialog onClose={handleOnClose} value={reservationUpdate} open={openUpdate} onSave={handleOnClose} />}
      <DataGrid
        rows={transactionRows()}
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