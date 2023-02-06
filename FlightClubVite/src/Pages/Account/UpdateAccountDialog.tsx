import { Dialog, DialogTitle, DialogContent, createTheme, Paper, styled, Grid, Button, Card, CardContent, Typography, CardActions, Divider, TextField } from "@mui/material";
import { DateTime } from "luxon";
import { useCallback, useEffect, useState } from "react";
import { InputComboItem } from "../../Components/Buttons/ControledCombo";
import MemberTypeCombo from "../../Components/Buttons/MemberTypeCombo";
import StatusCombo from "../../Components/Buttons/StatusCombo";
import { ITransitionAlrertProps, IValidationAlertProps, ValidationAlert } from "../../Components/Buttons/TransitionAlert";
import MembersCombo from "../../Components/Members/MembersCombo";
import { useUpdateAccountMutation } from "../../features/Account/accountApiSlice";
import { COrderCreate, IAccount, IAccountBase, IOrderBase, newAccount } from "../../Interfaces/API/IAccount";
import { getValidationFromError } from "../../Utils/apiValidation.Parser";
import { getSelectedItem,setProperty } from "../../Utils/setProperty";

export interface UpdateAccountDialogProps {
  value: IAccount;
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
function UpdateAccountDialog({ value, onClose, onSave, open, ...other }: UpdateAccountDialogProps) {



  const [UpdateAccount, { isError, isLoading, error, isSuccess }] = useUpdateAccountMutation();
  
  const [alert, setAlert] = useState<ITransitionAlrertProps>(transitionAlertInitial);
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<IAccount>(value)
  useEffect(() => {
    console.log("UpdateAccountDialog/useEffect", isError, isSuccess, isLoading)
    if (isSuccess) {
      setAlert((prev) => ({ ...prev, alertTitle: "Account Update", alertMessage: "Account Update Successfully", open: true, onClose: onClose, severity: "success" }))
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
      onSave(selectedAccount)
    else
      onClose()
  }
  const handleOnValidatiobClose = useCallback(() => {
    setValidationAlert([])

  }, [])
  const handleOnSave = async () => {
    console.log("UpdateAccountDialog/onSave", selectedAccount)
    setValidationAlert([]);
    
    if (selectedAccount !== undefined) {
      await UpdateAccount(selectedAccount).unwrap().then((data) => {
        console.log("UpdateAccountDialog/onSave/", data);
        if (data.data._id !== undefined) {
          setIsSaved(true)
        }
        /* onSave(value); */


      }).catch((err) => {
        console.log("UpdateAccountDialog/onSave/error", err.data.errors);
      });
    }



  }
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("UpdateAccountDialog/handleChange", event.target.name, event.target.value)
    const newObj: IAccount = SetProperty(selectedAccount, event.target.name, event.target.value) as IAccount;

    setSelectedAccount(newObj)
  };
  const SetProperty = (obj: any, path: string, value: any): any => {
    let newObj = { ...obj };
    newObj = setProperty(newObj, path, value);
    console.log("UpdateAccountDialog/SetProperty/newobj", newObj)
    return newObj;
  }
  const onComboChanged = (item: InputComboItem, prop:string): void => {
    console.log("UpdateAccountDialog/onComboChanged/item", item, prop,selectedAccount);
    const newObj: IAccount = SetProperty(selectedAccount, prop, item.lable) as IAccount;
    setSelectedAccount(newObj)
  }

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: "80%", maxHeight: "auto" } }}
      maxWidth="md"

      open={open} {...other}>
      <DialogTitle>Update Accont {value.account_id} , {value.member.family_name} {value.member.member_id}</DialogTitle>
      <DialogContent>
        <Card variant="outlined">
          <CardContent>
            <Grid container>
              <Grid item xs={12}>
              <StatusCombo onChanged={(item) => onComboChanged(item, "status")} source={"_"} selectedItem={getSelectedItem(selectedAccount?.status.toString())} />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  
                  type={"text"}
                  sx={{ marginLeft: "0px", width: "100%", fontSize: 25 }}
                  name="description"
                  id="description"
                  variant="standard"
                  key={"description"}
                  value={selectedAccount.description}
                  InputLabelProps={{ shrink: true }}
                  label="description"
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

          </CardContent>
          <CardActions>
            <Grid container sx={{ width: "100%" }} justifyContent="center" columns={12}>

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
                  {isSaved === true ? "Updated" : "Update"}
                </Button></Item>
              </Grid>

            </Grid>
          </CardActions>
        </Card>

      </DialogContent>
    </Dialog>
  )
}

export default UpdateAccountDialog;