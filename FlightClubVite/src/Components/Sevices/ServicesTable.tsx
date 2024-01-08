import '../../Types/date.extensions'
import { DataGrid, GridActionsCellItem, GridColDef, GridEventListener, GridRowEditStopReasons, GridRowId, GridRowModel, GridRowModes, GridRowModesModel, GridRowsProp, GridToolbarContainer } from '@mui/x-data-grid';
import { useEffect, useMemo, useState } from 'react';
import { Box, Button } from '@mui/material';
import { InputComboItem } from '../Buttons/ControledCombo';
import FullScreenLoader from '../FullScreenLoader';
import { DEVICE_SERVICE, Services } from '../../Interfaces/API/IDevice';
import { useFetchDeviceQuery, useUpdateOneDeviceMutation } from '../../features/Device/deviceApiSlice';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { IValidationAlertProps } from '../Buttons/TransitionAlert';
import { getValidationFromError } from '../../Utils/apiValidation.Parser';

interface IServicesTableProps {
  hideAction?: boolean;
  selectedDevice: InputComboItem | null;
}
export default function ServicesTable({ selectedDevice, hideAction = false }: IServicesTableProps) {
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const { data: devices, isLoading, error, refetch } = useFetchDeviceQuery(selectedDevice?._id === undefined ? "" : selectedDevice?._id);
  const [updateOneDevice] = useUpdateOneDeviceMutation()
  const [isNeedSave, setIsNeedSave] = useState(false);
  const [rows, setRows] = useState<GridRowsProp>([])
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  }
  const onValidationAlertClose = () => {
    setValidationAlert([]);
  }
  const getUpdatedRows = () : any[] => {
    let update: any[] = []
    CustomLogger.info("ServicesTable/getUpdatedRows/rows", rows);
    if (rows) {
       update = rows.map((row) => {
          if(row._id == ""){
            return {
              
              date: new Date(row.date),
              engien_meter: row.engien_meter,
              type: row.type,
              description: row.description
            }  
          }
          return {
            _id: row._id,
            date: new Date(row.date),
            engien_meter: row.engien_meter,
            type: row.type,
            description: row.description
          }
      })
    
  }
  return update;
}
  async function onSave(): Promise<void> {
    let payLoad: any;
    try {
      setValidationAlert([]);
       const update = { 
        _id: selectedDevice?._id == undefined ? "" : selectedDevice?._id,
        update: {
          maintanance: {
            services: getUpdatedRows()
          }
        } 
      }
        CustomLogger.info("ServicesTable/OnUpdate/update", update);
        payLoad = await updateOneDevice(update).unwrap();
        setIsNeedSave(false) 
        CustomLogger.info("ServicesTable/OnUpdate/payload", payLoad);
     
      if (payLoad.error) {
        setValidationAlert(getValidationFromError(payLoad.error, onValidationAlertClose));
      }
      refetch();
    }
    catch (error) {
      console.error("ServicesTable/OnSave/error", error);
      setValidationAlert(getValidationFromError(error, onValidationAlertClose));
    }

  }
  
  const handleEditClick = (id: GridRowId) => () => {
    CustomLogger.log("ServicesTable/handleEditClick/id", id)
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
    const editedRow = rows.find((row) => row.id === id);
    if (editedRow) {
      editedRow.isEdit += 1;
      setRows(rows.map((row) => (row.id === id ? editedRow : row)))
    }
  }

  const handleSaveClick = (id: GridRowId) => () => {
   
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
  }

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id))
    setIsNeedSave(true)
  }

  const handleCancelClick = (id: GridRowId) => () => {
    CustomLogger.log("ServicesTable/handleCancelClick/id", id, rowModesModel)
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow)
      editedRow.isEdit -= 1;
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    CustomLogger.log("ServicesTable/processRowUpdate/newRow", newRow)
    const updatedRow = { ...newRow, isNew: false };
    const newRows = rows.map((row) => (row.id === newRow.id ? updatedRow : row))
    setRows(newRows)
    setIsNeedSave(true);
    CustomLogger.log("ServicesTable/processRowUpdate/updatedRow", updatedRow)
    return updatedRow
  }

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel) => void

  }
useEffect(() => {
    if(isNeedSave)
      onSave()
  },[isNeedSave]) 
  function EditToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel } = props;
    const handleClick = () => {
      const id = rows.length
      setRows((oldRows) => [...oldRows,
      { id: id, _id: "", date: new Date(), engien_meter: 0, type: "", description: "", isNew: true, isEdit: 0 }]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'date' }
      }))
    }
    return (
      <GridToolbarContainer>
        <Button color='primary' startIcon={<AddIcon />} onClick={handleClick} >Add Record</Button>
      </GridToolbarContainer>
    )
  }
  /*   const getServices = useMemo(() => (id: string, date: Date, engien_meter: number, type: string, description: string): Services => {
      CustomLogger.log("ServicesTable/getServices/selectedDevice", selectedDevice)
      let addService: Services = {
        
        _id: "",
        date: new Date(),
        engien_meter: 0,
        type: '',
        description: ''
      }
      CustomLogger.info("ServicesTable/getServices", addService, devices)
      return addService;
    }, [selectedDevice]) */

  const serviceRows = useMemo(() => {
    CustomLogger.info("ServicesTable/serviceRows", devices)
    if (devices == null || devices.data === null || Array.isArray(devices.data))
      return [];
    const rows = devices?.data?.maintanance.services.map((row: Services, index: number) => ({
      id: index,
      _id: row._id,
      date: new Date(row.date),
      type: row.type,
      engien_meter: row.engien_meter,
      description: `${row.description}`,
      isEdit: 0
      ,
    }))
    if (rows !== undefined) {
      CustomLogger.info("ServicesTable/servicesRows/rows", rows);
      setRows(rows)
      return rows
    }
    return []


  }, [devices])
  CustomLogger.log("ServicesTable/selectedDevice/", selectedDevice)
  const columns: GridColDef[] = [

    { field: '_id', type: 'string', hideable: true },
    {
      field: 'date', headerName: 'Date', type: 'date', sortable: true, editable: true,
      filterable: true, flex: 1, minWidth: 110
    },
    { field: 'type', headerName: 'Type', type: "singleSelect", valueOptions: Object.values(DEVICE_SERVICE), editable: true, minWidth: 80, flex: 1 },
    { field: 'engien_meter', headerName: 'Meter', type: 'number', minWidth: 70, flex: 1, editable: true },
    { field: 'description', headerName: 'Description', flex: 4, editable: true, minWidth: 70 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },

  ];

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
    <Box
      sx={{
        height: '100%',
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}>
      <DataGrid
        initialState={{
          columns: {
            columnVisibilityModel: {
              _id: false
            }
          }
        }
        }
        getRowHeight={() => 'auto'}
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel }
        }}

      /*         pageSizeOptions={[5, 10, 15, 20]}
              paginationModel={{ page, pageSize }}
              onPaginationModelChange={(newPageSize) => { setPageSize(newPageSize.pageSize), setPage(newPageSize.page) }}
              checkboxSelection={false}
              getRowId={(row) => row.id}
              disableRowSelectionOnClick
              onCellEditStop={(params, event) => setRowId(params.id.toString())}
              rowHeight={48} */

      />
    </Box>
  );
}