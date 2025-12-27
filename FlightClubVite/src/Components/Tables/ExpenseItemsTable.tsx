import { useState, useEffect } from "react";
import "../../Types/date.extensions"
import { IValidationAlertProps } from "../Buttons/TransitionAlert";
import { GridRowsProp, GridRowModesModel, GridActionsCellItem, GridColDef, GridRowModes, DataGrid, GridEventListener, GridRowEditStopReasons, GridRowModel, GridRowId, GridToolbarContainer } from "@mui/x-data-grid";

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { Box } from "@mui/system";
import { Button } from "@mui/material";
import { useCreateExpenseItemMutation, useDeleteExpenseItemMutation, useFetchAllExpenseItemsQuery, useUpdateExpenseItemMutation } from "../../features/expenseItem/expenseItemApiSlice";
import { IExpenseItem } from "../../Interfaces/API/IExpenseItem";
import { useFetchAllTypesQuery, useFetchTypesQuery } from "../../features/Account/accountApiSlice";

export interface IExpenseItemsTableProps {
  validationAlert: IValidationAlertProps[],
  setValidationAlert: React.Dispatch<React.SetStateAction<IValidationAlertProps[]>>
  onError: (errors: any) => void
}

function ExpenseItemsTable({validationAlert,setValidationAlert,onError}: IExpenseItemsTableProps) {
  const { isError, isLoading, isSuccess, isFetching, error, data: expenseItems,refetch } = useFetchAllExpenseItemsQuery();
  const { data: categories } = useFetchTypesQuery("EXPENSE");
  const {data: types} = useFetchAllTypesQuery();
  
  const [updateExpenseItem] = useUpdateExpenseItemMutation();
  const [createExpenseItem] = useCreateExpenseItemMutation();
  const [deleteExpenseItem] = useDeleteExpenseItemMutation();
  const [rows, setRows] = useState<GridRowsProp>([])
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
  
  useEffect(() => {
    CustomLogger.info("ExpenseItemsTable/categories", categories);
    CustomLogger.info("ExpenseItemsTable/types", types);
  }, [categories,types])
  async function onSave(row: GridRowModel): Promise<void> {
    let payLoad: any;
    try {
      
      
      if (row === undefined)
        return
      const saveRow: IExpenseItem = {
        _id: row._id as string,
        item_name: row.item_name as string,
        expense:{
          category: row.expense?.category as string,
          type: row.expense?.type as string,
          utilizated: row.expense?.utilizated as string
        }
      }
      if (saveRow !== undefined && saveRow?._id !== "") {
        payLoad = await updateExpenseItem(saveRow).unwrap();
        CustomLogger.info("ExpenseItemsTable/updateExpenseItem/payload", payLoad);
        if (payLoad.error) {
          /* setValidationAlert(getValidationFromError(payLoad.error, onValidationAlertClose)); */
        }

      }
      else {
        payLoad = await createExpenseItem(saveRow).unwrap();
        CustomLogger.info("ExpenseItemsTable/createExpenseItem/payload", payLoad);
        if (payLoad.error) {
          CustomLogger.info("ExpenseItemsTable/error", error);
      /*     setValidationAlert(getValidationFromError(payLoad.error, onValidationAlertClose)); */
        }

      }
    }
    catch (error: any) {
      CustomLogger.error("ExpenseItemsTable/validationAlert/error", error);
      /* const validationError = getValidationFromError(error, onValidationAlertClose) */
      /* setValidationAlert(validationError); */
      onError(error)
    }
    finally {
      //refetch();
    }

  }

  function onDelete(_id: string): void {
    let payLoad: any;
    try {
      setValidationAlert([]);
      if (_id !== "") {
        payLoad = deleteExpenseItem(_id).unwrap();
        CustomLogger.info("ExpenseItemsTable/OnDelete/payload", payLoad);
        if (payLoad.error) {
          /* setValidationAlert(getValidationFromError(payLoad.error, onValidationAlertClose)); */
        }

      }
    }
    catch (error) {
      console.error("ExpenseItemsTable/OnSave/error", error);
      /* 
      const validation = getValidationFromError(error, onValidationAlertClose);
      setValidationAlert(validation); */

    }
    finally {
      refetch();
    }

  }

  useEffect(() => {
    CustomLogger.log("ExpenseItemsTable/callback/notice")
    let rows = expenseItems?.data?.map((row, index) => ({
      id:index,
      _id: row._id,
      item_name: row.item_name,
      category: row.expense.category,
      type: row.expense.type,
      utilizated: row.expense.utilizated,
      
    }))
    CustomLogger.info("ExpenseItemsTable/callback/filteed", rows)
    if (rows === undefined)
      rows = []
    setRows(rows)
  }, [expenseItems])

  const handleEditClick = (id: GridRowId) => () => {

    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
    const editedRow = rows.find((row) => row.id === id);
    if (editedRow) {
      CustomLogger.log("ExpenseItemsTable/handleEditClick/id", id, editedRow)
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
    CustomLogger.log("ExpenseItemsTable/handleCancelClick/id", id, rowModesModel)
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
    { field: 'item_name', headerName: 'Item Name', type: 'string',flex:2,editable: true,hideable: true, minWidth: 40 },
    {
      field: 'category', headerName: 'category', type: 'singleSelect', valueOptions:  [], sortable: true, editable: true,
      filterable: true, flex: 1, minWidth: 140
    },
    {
      field: 'type', headerName: 'type', type: 'singleSelect', valueOptions: [], sortable: true, editable: true,
      filterable: true, flex: 1, minWidth: 140
    },
    { field: 'utilizated', headerName: 'utilizated', type: 'singleSelect', valueOptions: [], flex: 1, editable: true, minWidth: 140 },
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
    CustomLogger.log("ExpenseItemsTable/processRowUpdate/newRow", newRow)
    const updatedRow = { ...newRow, isNew: false };
    const newRows = rows.map((row) => (row.id === newRow.id ? updatedRow : row))
    setRows(newRows)
    onSave(newRow);
    CustomLogger.log("ExpenseItemsTable/processRowUpdate/updatedRow", updatedRow)
    return updatedRow
  }

  function EditToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel } = props;
    const handleClick = () => {
      const id = rows.length
      setRows((oldRows) => [...oldRows,
      { id: id,_id: "",item_name: "", category: "", type: "", utilizated: "", isNew: true, isEdit: 0 }]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'date' }
      }))
    }
    return (
      <GridToolbarContainer>
        <Button color='primary' startIcon={<AddIcon />} onClick={handleClick} >Add Item Record</Button>
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
export default ExpenseItemsTable