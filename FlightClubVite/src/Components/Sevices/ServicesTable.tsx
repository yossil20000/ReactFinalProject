import '../../Types/date.extensions'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { InputComboItem } from '../Buttons/ControledCombo';
import TransactionAction from '../Accounts/TransactionAction';
import FullScreenLoader from '../FullScreenLoader';
import { Services } from '../../Interfaces/API/IDevice';
import { useFetchDeviceQuery } from '../../features/Device/deviceApiSlice';


interface IServicesTableProps {
  hideAction?: boolean;
  selectedDevice: InputComboItem | null;
}
export default function ServicesTable({selectedDevice, hideAction=false}: IServicesTableProps) {
  const [rowId, setRowId] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(5);
  const { data: devices ,isLoading,error} = useFetchDeviceQuery(selectedDevice?._id === undefined ? "" : selectedDevice?._id);
  CustomLogger.log("ServicesTable/selectedDevice/",selectedDevice)
  
  const getServices = useMemo (() => (id: string ,date: Date, engien_meter: number,type: string ,description: string) : Services => {
    CustomLogger.log("ServicesTable/getServices/selectedDevice",selectedDevice)
    let addService : Services = {
      _id: "",
      date: new Date(),
      engien_meter: 0,
      type: '',
      description: ''
    }
    CustomLogger.info("ServicesTable/getServices",addService,devices)
    return addService;
  },[selectedDevice] )

  const serviceRows = useMemo(() => {
    CustomLogger.info("ServicesTable/serviceRows",devices)
    if(devices == null || devices.data ===null || Array.isArray(devices.data))
      return [];
    const rows = devices?.data?.maintanance.services.map((row : Services) => ({
      id: row._id, 
      date: new Date(row.date).getDisplayDate(),
      type: row.type,
      engien_meter: row.engien_meter,
      description: `${row.description}`
      ,
    }))
    if (rows !== undefined) {
      CustomLogger.info("ServicesTable/servicesRows/rows",rows);
      return rows
    }
    return []


  }, [devices])

  const columns: GridColDef[] = useMemo(() => [
    { field: 'id',type: 'string', hide: true },
    { field: 'date',hide: false, headerName: 'Date', sortable: true,editable: true,
    filterable: true,flex:1,minWidth:100},
    { field: 'type', headerName: 'Type', minWidth: 50,flex:1 },
    { field: 'engien_meter', headerName: 'Meter', type: 'number', minWidth: 70 , flex: 1 },
    { field: 'description', headerName: 'Description', hide: false,flex:4},
    {
      field: 'actions',
      flex:2,
      headerName: 'Actions',
      minWidth: 80,
      type: 'actions',
      hide: hideAction,
      renderCell: (params: GridRenderCellParams) => (
        <Box display={'flex'} flexDirection={'column'} gap={1} height={"5ch"} >
         {/* <TransactionAction {...{params,rowId,setRowId,orderId : params.row.product !== OT_REF.FLIGHT ? params.row.id : undefined  ,transaction: getTransaction("",selectedClubAccount ? selectedClubAccount._id : "",params.row.id, params.row.amount,params.row.description)}}/> */}
         
        </Box>
      )

    },

  ], [rowId,hideAction,selectedDevice]);
  
  if (isLoading) {
    CustomLogger.info('ServicesTable/isLoading', isLoading)
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
      CustomLogger.error('ServicesTable/error', errMsg)
      return (
        <div>
          <div>ServicesTable</div>
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
        rows={serviceRows}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10,15, 20]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        checkboxSelection={false}
        getRowId={(row) => row.id}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        onCellEditCommit={(params) => setRowId(params.id.toString())} 
        rowHeight={48}
      />
    </div>
  );
}