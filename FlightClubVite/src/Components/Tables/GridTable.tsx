import { Button } from "@mui/material";
import { Box } from "@mui/system";
import { DataGrid, GridActionsCellItem, GridColDef, GridEventListener, GridRowEditStopReasons, GridRowId, GridRowModel, GridRowModes, GridRowModesModel, GridRowsProp, GridToolbarContainer, GridValidRowModel } from "@mui/x-data-grid";
import { GridInitialStateCommunity } from "@mui/x-data-grid/models/gridStateCommunity";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { useEffect, useState } from "react";

type GridTableProps = {
  // 👇️ type as React.CSSProperties
  title: string;
  style: React.CSSProperties;
  children: React.ReactNode;
  rows: readonly GridValidRowModel[];
  setRows: React.Dispatch<React.SetStateAction<readonly GridValidRowModel[]>>;
  columns: GridColDef[];
  initialState: GridInitialStateCommunity;
  onSave: () => void;
  actionColumn: boolean;
};
interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel) => void

}

function GridTable({style,children,rows,setRows,columns,initialState,onSave,title,actionColumn}: GridTableProps) {

  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
  const [isNeedSave, setIsNeedSave] = useState(false);
  useEffect(() => {
    if(isNeedSave)
      onSave()
  },[isNeedSave]) 
  function EditToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel } = props;
    const handleClick = () => {
      CustomLogger.log(`${title}/EditToolbar/updatedRow`, title,rows.length)
      const id = rows.length
      setRows((oldRows) => [...oldRows,
      { id: id}]);
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
  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }
  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  }
  const processRowUpdate = (newRow: GridRowModel) => {
    CustomLogger.log(`${title}/processRowUpdate/newRow`, newRow)
    const updatedRow = { ...newRow, isNew: false };
    const newRows = rows.map((row) => (row.id === newRow.id ? updatedRow : row))
    setRows(newRows)
    setIsNeedSave(true);
    CustomLogger.log(`${title}/processRowUpdate/updatedRow`, updatedRow)
    return updatedRow
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
  const action : GridColDef =    {
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
   }
   const newColumns : GridColDef[] = actionColumn ? [...columns,action] : [...columns] 
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
      <>{title}</>
    <DataGrid
      initialState={initialState}
      pageSizeOptions={[5, 10,15,20,50,100]}
      
      getRowHeight={() => 'auto'}
      rows={rows}
      columns={newColumns}
      editMode="row"
      rowModesModel={rowModesModel}
      onRowModesModelChange={handleRowModesModelChange}
      onRowEditStop={handleRowEditStop}
      processRowUpdate={processRowUpdate}
      slots={{
        toolbar:null
      }}
      slotProps={{
        toolbar: { setRows, setRowModesModel }
      }}
    />
  </Box>
  )
}

export default GridTable