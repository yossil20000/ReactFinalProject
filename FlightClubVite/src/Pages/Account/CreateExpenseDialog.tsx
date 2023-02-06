import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import { useCallback, useState } from 'react'
import { InputComboItem } from '../../Components/Buttons/ControledCombo';
import { IValidationAlertProps, ValidationAlert } from '../../Components/Buttons/TransitionAlert';
import Item from '../../Components/Item';
import MembersCombo from '../../Components/Members/MembersCombo';
import { useAddUpdateExpenseMutation, useFetchExpenseQuery } from '../../features/Account/accountApiSlice';
import { newAccount } from '../../Interfaces/API/IAccount';
import { IExpense, IExpenseBase, IUpsertExpanse, newExpense } from '../../Interfaces/API/IExpense';
import { IFilter } from '../../Interfaces/API/IFilter';

export interface CreateExpenseDialogProps {

  onClose: () => void;
  onSave: (value: IExpenseBase) => void;
  open: boolean;
}
const filterData: IUpsertExpanse = {

}
function CreateExpenseDialog({ onClose, onSave, open, ...other }: CreateExpenseDialogProps) {
  const [createExpense, { isError, isLoading }] = useAddUpdateExpenseMutation();
  const [selectedExpense, setSelectedExpense] = useState<IExpenseBase>(newExpense);
  const [selectedMember, setSelectedMember] = useState<InputComboItem>()
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const onMemberChanged = (item: InputComboItem) => {
    setSelectedMember(item)
  }
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
    console.log("CreateExspenseDialog/onSave", selectedExpense)
    setValidationAlert([]);
    let account = newAccount;
    /* account.copy(accountCreate); */
    console.log("CreateExspenseDialog/onSave/account", account)
    if (selectedMember !== undefined) {
      const filterData: IUpsertExpanse = {
        update: selectedExpense
      }
      await createExpense(filterData).unwrap().then((data) => {
        console.log("CreateExspenseDialog/onSave/", data);
        if (data.data._id !== undefined) {
          setIsSaved(true)
        }
        /* onSave(value); */


      }).catch((err) => {
        console.log("CreateExspenseDialog/onSave/error", err.data.errors);
      });
    }



  }
  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: "80%", maxHeight: "auto" } }}
      maxWidth="lg" open={open} {...other}>
      <DialogTitle>Create Expense</DialogTitle>
      <DialogContent>
        <Grid container sx={{ width: "100%" }} justifyContent="center" columns={12}>
          <Grid item xs={6}>
            <MembersCombo title='Source' selectedItem={selectedMember} onChanged={onMemberChanged} source={"_CreateExspense/members"} filter={{}} />
          </Grid>
          <Grid item xs={6}>
            <MembersCombo title='Destination' selectedItem={selectedMember} onChanged={onMemberChanged} source={"_CreateExspense/members"} filter={{}} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Grid container sx={{ width: "100%" }} justifyContent="center">
          {validationAlert.map((item) => (
            <Grid item xs={12}>
              <Item>

                <ValidationAlert {...item} />
              </Item>
            </Grid>
          ))}
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
              {isSaved === true ? "Created" : "Create"}
            </Button></Item>
          </Grid>

        </Grid>
      </DialogActions>
    </Dialog>
  )
}

export default CreateExpenseDialog