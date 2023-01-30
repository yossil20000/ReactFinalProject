import { Dialog, DialogTitle, DialogContent, createTheme, Paper, styled, Grid, Button, Card, CardContent, Typography, CardActions, Divider } from "@mui/material";
import { DateTime } from "luxon";
import { useCallback, useEffect, useState } from "react";
import { InputComboItem } from "../../Components/Buttons/ControledCombo";
import { ITransitionAlrertProps, IValidationAlertProps, ValidationAlert } from "../../Components/Buttons/TransitionAlert";
import MembersCombo from "../../Components/Members/MembersCombo";
import { useCreateAccountMutation, useCreateOrderMutation } from "../../features/Account/accountApiSlice";
import { COrderCreate, IAccount, IAccountBase, IOrderBase, newAccount } from "../../Interfaces/API/IAccount";
import { getValidationFromError } from "../../Utils/apiValidation.Parser";

export interface CreateAccountDialogProps {
  
  onClose: () => void;
  onSave: (value: IAccount) => void;
  open: boolean;
}
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
const defaultMaterialThem = createTheme({

})
let transitionAlertInitial: ITransitionAlrertProps = {
  severity: "success",
  alertTitle: "Create Account",
  alertMessage: "Operation succeed",
  open: false,
  onClose: () => { }
}
function CreateAccountDialog({  onClose, onSave, open, ...other }: CreateAccountDialogProps) {

  

  const [createAccount, { isError, isLoading, error, isSuccess }] = useCreateAccountMutation();
  const [accountCreate, setAccountCreate] = useState<IAccount>(newAccount);
  const [alert, setAlert] = useState<ITransitionAlrertProps>(transitionAlertInitial);
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedMember,setSelectedMember] = useState<InputComboItem>()
  useEffect(() => {
    console.log("CreateAccountDialog/useEffect", isError, isSuccess, isLoading)
    if (isSuccess) {
      setAlert((prev) => ({ ...prev, alertTitle: "Account Create", alertMessage: "Account Create Successfully", open: true, onClose: onClose, severity: "success" }))
    }
    if (isError) {
      const validation = getValidationFromError(error, handleOnValidatiobClose);
      setValidationAlert(validation);
      return;
    }
  }, [isLoading])


  const handleOnCancel = () => {
    setValidationAlert([])
    if (isSaved)
      onSave(accountCreate)
    else
      onClose()
  }
  const handleOnValidatiobClose = useCallback(() => {
    setValidationAlert([])

  }, [])
  const handleOnSave = async () => {
    console.log("CreateAccountDialog/onSave", accountCreate)
    setValidationAlert([]);
    let account = newAccount;
    /* account.copy(accountCreate); */
    console.log("CreateAccountDialog/onSave/account", account)
   if(selectedMember !== undefined){
    await createAccount(selectedMember?._id).unwrap().then((data) => {
      console.log("CreateAccountDialog/onSave/", data);
      if (data.data._id !== undefined) {
        setIsSaved(true)
      }
      /* onSave(value); */


    }).catch((err) => {
      console.log("CreateAccountDialog/onSave/error", err.data.errors);
    });
   }



  }
  const onMemberChanged = (item: InputComboItem) => {
    setSelectedMember(item)
}
  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: "80%", maxHeight: "auto" } }}
      maxWidth="sm"

      open={open} {...other}>
      <DialogTitle>Account Create</DialogTitle>
      <DialogContent>
        <Card variant="outlined">
          <CardContent>
            <Grid container sx={{ width: "100%" }} justifyContent="center">
              <MembersCombo onChanged={onMemberChanged} source={"_CreateAccount/members"} />
            </Grid>

          </CardContent>
          <CardActions>
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
          </CardActions>
        </Card>

      </DialogContent>
    </Dialog>
  )
}

export default CreateAccountDialog;