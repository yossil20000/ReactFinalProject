import { useState, useEffect } from "react";
import "../../Types/date.extensions"
import IClubNotice, {  } from "../../Interfaces/API/IClubNotice";
import { getValidationFromError } from "../../Utils/apiValidation.Parser";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { useFetchAllNoticesQuery, useUpdateNoticeMutation, useCreateNoticeMutation, useDeleteNoticeMutation } from "../../features/clubNotice/noticeApiSlice";
import { IValidationAlertProps } from "../Buttons/TransitionAlert";
import { GridRowsProp, GridRowModesModel, GridActionsCellItem, GridColDef, GridRowModes, DataGrid, GridEventListener, GridRowEditStopReasons, GridRowModel, GridRowId, GridToolbarContainer } from "@mui/x-data-grid";

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { Box } from "@mui/system";
import { Button } from "@mui/material";
type RowChange = {
  _id: string,
  operation: "DELETE" | "ADD" | "UPDATE" | "NONE";
}
export interface INoticesTableProps {
  validationAlert: IValidationAlertProps[],
  setValidationAlert: React.Dispatch<React.SetStateAction<IValidationAlertProps[]>>
  onError: (errors: any) => void
}

function NoticesTable({validationAlert,setValidationAlert,onError}: INoticesTableProps) {
  const { isError, isLoading, isSuccess, isFetching, error, data: notices,refetch } = useFetchAllNoticesQuery();
  const [updateNotice] = useUpdateNoticeMutation();
  const [createNotice] = useCreateNoticeMutation();
  const [deleteNotice] = useDeleteNoticeMutation();
  const [rows, setRows] = useState<GridRowsProp>([])
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})

  /* useEffect(() => {
  CustomLogger.info("NoticesTable/isError,isLoading,isSuccess,isFetching", isError,error,isSuccess,isLoading,isFetching);
 },[isError,isLoading,isSuccess,isFetching])
 */
/*   const onValidationAlertClose = () => {
    setValidationAlert([]);
  }
 */
  async function onSave(row: GridRowModel): Promise<void> {
    let payLoad: any;
    try {
      
      
      if (row === undefined)
        return
      const saveRow: IClubNotice = {
        _id: row._id,
        title: row.title,
        description: row.description,
        issue_date: row.issue_date,
        due_date: row.due_date,
        isExpired: row.isExpired,
        isPublic: row.isPublic
      }
      if (saveRow !== undefined && saveRow?._id !== "") {
        payLoad = await updateNotice(saveRow).unwrap();
        CustomLogger.info("NoticesTable/updateNotice/payload", payLoad);
        if (payLoad.error) {
          /* setValidationAlert(getValidationFromError(payLoad.error, onValidationAlertClose)); */
        }

      }
      else {
        payLoad = await createNotice(saveRow).unwrap();
        CustomLogger.info("NoticesTable/createNotice/payload", payLoad);
        if (payLoad.error) {
          CustomLogger.info("NoticesTable/error", error);
      /*     setValidationAlert(getValidationFromError(payLoad.error, onValidationAlertClose)); */
        }

      }
    }
    catch (error: any) {
      CustomLogger.error("NoticesTable/validationAlert/error", error);
      /* const validationError = getValidationFromError(error, onValidationAlertClose) */
      /* setValidationAlert(validationError); */
      onError(error)
    }
    finally {
      refetch();
    }

  }

  function onDelete(_id: string): void {
    let payLoad: any;
    try {
      setValidationAlert([]);
      if (_id !== "") {
        payLoad = deleteNotice(_id).unwrap();
        CustomLogger.info("NoticesTable/OnDelete/payload", payLoad);
        if (payLoad.error) {
          /* setValidationAlert(getValidationFromError(payLoad.error, onValidationAlertClose)); */
        }

      }
    }
    catch (error) {
      console.error("DeviceTab/OnSave/error", error);
      /* 
      const validation = getValidationFromError(error, onValidationAlertClose);
      setValidationAlert(validation); */

    }
    finally {
      refetch();
    }

  }

  useEffect(() => {
    CustomLogger.log("NoticesTable/callback/notice")
    let rows = notices?.data?.map((row, index) => ({
      id: index,
      _id: row._id,
      issue_date: row.issue_date,
      due_date: row.due_date,
      title: row.title,
      isExpired: row.isExpired,
      isPublic: row.isPublic,
      description: row.description

    }))
    CustomLogger.info("NoticesTable/callback/filteed", rows)
    if (rows === undefined)
      rows = []
    setRows(rows)
  }, [notices])

  const handleEditClick = (id: GridRowId) => () => {

    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
    const editedRow = rows.find((row) => row.id === id);
    if (editedRow) {
      CustomLogger.log("NoticesTable/handleEditClick/id", id, editedRow)
      editedRow.isEdit += 1;
      setRows(rows.map((row) => (row.id === id ? editedRow : row)))
    }
  }

  const handleSaveClick = (id: GridRowId) => () => {

    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
  }

  const handleDeleteClick = (id: GridRowId) => () => {
    const deleteRow = rows.find((row) => row.id == id)
    if (deleteRow !== undefined && deleteRow._id !== "")
      onDelete(deleteRow._id)
    else
      setRows(rows.filter((row) => row.id !== id))

  }

  const handleCancelClick = (id: GridRowId) => () => {
    CustomLogger.log("NoticesTable/handleCancelClick/id", id, rowModesModel)
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
  const columns: GridColDef[] = [

    { field: '_id', type: 'string', hideable: true },
    { field: 'id', type: 'string', hideable: true, minWidth: 40, maxWidth: 40 },
    {
      field: 'issue_date', headerName: 'Issue Date', type: 'date', sortable: true, editable: true,
      filterable: true, flex: 1, minWidth: 140, maxWidth: 140
    },
    {
      field: 'due_date', headerName: 'Due Date', type: 'date', sortable: true, editable: true,
      filterable: true, flex: 1, minWidth: 140, maxWidth: 140
    },
    { field: 'isExpired', headerName: 'Expired', type: 'boolean', flex: 1, editable: true, minWidth: 130, maxWidth: 130 },
    { field: 'isPublic', headerName: 'Public', type: 'boolean', flex: 1, editable: true, minWidth: 130, maxWidth: 130 },
    { field: 'title', headerName: 'Title', type: 'string', flex: 3, editable: true, minWidth: 130 },
    { field: 'description', headerName: 'Description', flex: 4, editable: true, minWidth: 140 },
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
  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel) => void

  }
  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  }
  const processRowUpdate = (newRow: GridRowModel) => {
    CustomLogger.log("NoticesTable/processRowUpdate/newRow", newRow)
    const updatedRow = { ...newRow, isNew: false };
    const newRows = rows.map((row) => (row.id === newRow.id ? updatedRow : row))
    setRows(newRows)
    onSave(newRow);
    CustomLogger.log("NoticesTable/processRowUpdate/updatedRow", updatedRow)
    return updatedRow
  }

  function EditToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel } = props;
    const handleClick = () => {
      const id = rows.length
      setRows((oldRows) => [...oldRows,
      { id: id, _id: "", issue_date: new Date(), due_date: new Date(), isExpired: true, isPublic: true, title: "", description: "", isNew: true, isEdit: 0 }]);
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
  return (
    <Box
    display={'flex'} flexDirection={'column'}
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

        pageSizeOptions={[5, 10, 15, 20, 50, 100]}
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
      />
    </Box>
  )
}
export default NoticesTable