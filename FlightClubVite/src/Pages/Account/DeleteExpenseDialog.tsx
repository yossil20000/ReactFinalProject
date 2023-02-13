import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, LinearProgress, TextField } from '@mui/material';
import { useCallback, useState } from 'react'
import ClubAccountsCombo from '../../Components/Accounts/ClubAccountsCombo';
import { InputComboItem, newInputComboItem } from '../../Components/Buttons/ControledCombo';
import { IValidationAlertProps, ValidationAlert } from '../../Components/Buttons/TransitionAlert';
import TypesCombo from '../../Components/Buttons/TypesCombo';
import Item from '../../Components/Item';
import { useDeleteExpenseMutation, useClubAccountQuery } from '../../features/Account/accountApiSlice';
import { IClubAccount } from '../../Interfaces/API/IClub';
import { IExpense, IExpenseBase, IUpsertExpanse } from '../../Interfaces/API/IExpense';
import { setProperty } from '../../Utils/setProperty';
import { getValidationFromError } from '../../Utils/apiValidation.Parser';
import FullScreenLoader from '../../Components/FullScreenLoader';
export interface DeleteExpenseDialogProps {

  onClose: () => void;
  onSave: (value: IExpenseBase) => void;
  open: boolean;
  value: IExpense;
}

function DeleteExpenseDialog({ onClose, onSave, open, value, ...other }: DeleteExpenseDialogProps) {
  const [DeleteExpense, { isError, isLoading }] = useDeleteExpenseMutation();

  const [selectedExpense, setSelectedExpense] = useState<IExpense>(value);


  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const [isSaved, setIsSaved] = useState(false);


  const handleOnCancel = () => {
    setValidationAlert([])
    if (isSaved)
      onSave(selectedExpense)
    else
      onClose()
  }
  const handleOnValidatiobClose = useCallback(() => {
    setValidationAlert([])

  }, [])
  const handleOnSave = async () => {
    console.log("DeleteExspenseDialog/onSave", selectedExpense)
    setValidationAlert([]);

    if (selectedExpense) {
      await DeleteExpense(selectedExpense._id).unwrap().then((data) => {
        console.log("UpdateExspenseDialog/onSave/", data);
        if (data.success) {
          setIsSaved(true)
        }


      }).catch((err) => {
        const validation = getValidationFromError(err, handleOnValidatiobClose);
        setValidationAlert(validation);
        console.log("UpdateExspenseDialog/onSave/error", err.data.errors);
      });
    }



  }


  return (

    <Dialog
      sx={{ '& .MuiDialog-paper': { width: "80%", maxHeight: "auto" } }}
      maxWidth="lg" open={open} {...other}>
      <DialogTitle>Delete Expense</DialogTitle>
      {(isLoading) ? (
        <>
          <FullScreenLoader />
        </>
      ) : (
        <>
          <DialogContent>

            <Grid container sx={{ width: "100%" }} justifyContent="center" columns={12}>
              <Grid item xs={12}   >
                {`Expense from ${value.source.account_id} to ${value.destination.account_id}`}
              </Grid >
              <Grid item xs={12} >
                {`Amount: ${value.amount}`}
              </Grid>
              <Grid item xs={12} >
                {`Description: ${value.description}`}
              </Grid>
              <Grid item xs={12} >
                {`Confirm to delete`}
              </Grid>
            </Grid>
          </DialogContent>
        </>
      )}

      <DialogActions>

        <Grid container sx={{ width: "100%" }} justifyContent="center">
          {true ? (<><LinearProgress /></>) : null}
          {validationAlert.map((item) => (
            <Grid item xs={12}>
              <Item>

                <ValidationAlert {...item} />
              </Item>
            </Grid>
          ))}
          {isLoading ? (
            <>
              <Grid item xs={12} alignItems={'center'}><Item>Loading</Item></Grid>
              <Grid item xs={12}><Item><LinearProgress /></Item></Grid>
            </>) : (
            <>
              <Grid item xs={12} md={6} xl={6}>
                <Item><Button variant="outlined" sx={{ width: "100%" }}
                  onClick={handleOnCancel}>

                  {isSaved === true ? "Close " : "Cancle"}
                </Button></Item>
              </Grid>
              <Grid item xs={12} md={6} xl={6}>

                <Item><Button variant="outlined" sx={{ width: "100%" }}

                  disabled={isSaved === true ? true : false}
                  onClick={handleOnSave}>
                  {isSaved === true ? "Deleted" : "Delete"}
                </Button></Item>
              </Grid></>
          )}


        </Grid>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteExpenseDialog