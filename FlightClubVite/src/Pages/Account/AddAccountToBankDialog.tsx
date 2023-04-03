import { Dialog, DialogTitle, DialogContent, createTheme, Paper, styled, Grid, Button, Card, CardContent, Typography, CardActions, useTheme } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { InputComboItem } from "../../Components/Buttons/ControledCombo";
import { ITransitionAlrertProps, IValidationAlertProps, ValidationAlert } from "../../Components/Buttons/TransitionAlert";
import { useClubAddAccountMutation, useUpdateAccountMutation } from "../../features/Account/accountApiSlice";
import { IAccount } from "../../Interfaces/API/IAccount";
import { IClubAccount, IClubAddAccount } from "../../Interfaces/API/IClub";
import { getValidationFromError } from "../../Utils/apiValidation.Parser";
import { setProperty } from "../../Utils/setProperty";

export interface AddAccountToBankDialogProps {
  bank: IClubAccount;
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
function AddAccountToBankDialog({ value, onClose, onSave, open, bank, ...other }: AddAccountToBankDialogProps) {
  const theme = useTheme();


  const [AddAccount, { isError, isLoading, error, isSuccess }] = useClubAddAccountMutation();


  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<IAccount>(value)
  useEffect(() => {
    CustomLogger.info("AddAccountToBankDialog/useEffect/isError, isSuccess, isLoading", isError, isSuccess, isLoading)

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
    CustomLogger.log("AddAccountToBankDialog/onSave", selectedAccount)
    setValidationAlert([]);

    if (selectedAccount !== undefined) {
      const accountToBank: IClubAddAccount = {
        _id: bank._id,
        account_id: value._id
      }
      await AddAccount(accountToBank).unwrap().then((data) => {
        CustomLogger.info("AddAccountToBankDialog/onSave/", data);
        if (data.success) {
          setIsSaved(true)
        }
      }).catch((err) => {
        CustomLogger.error("AddAccountToBankDialog/onSave/error", err.data.errors);
      });
    }



  }
 
  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: "80%", maxHeight: "auto" } }}
      maxWidth="md"

      open={open} {...other}>
      <DialogTitle align="center">
        Add Account To Bank
      </DialogTitle>
      <DialogContent>
        <Card variant="outlined">
          <CardContent>
            <Grid container>
              <Grid item xs={3}>

              </Grid>
              <Grid item xs={3}>
                <Typography>
                  Brand
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>
                  Branch
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>
                  Account
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>
                  Bank:
                </Typography>
              </Grid>

              <Grid item xs={3}>

              </Grid>
              <Grid item xs={3}>
                <Typography>
                  {bank.club.brand}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>
                  {bank.club.branch}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>
                  {bank.club.account_id}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>
                  Add Account:
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography color={value.member !== null ? "primary.main" : "secondary"}>
                  {value.member !== null ? `${value?.member?.family_name} / ${value?.member?.member_id}` : "Account Detailed UnSet"}
                </Typography>
              </Grid>
              <Grid item xs={3}>

              </Grid>
              <Grid item xs={3}>
                <Typography>
                  {bank.club.brand}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>
                  {bank.club.branch}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>
                  {value?.account_id}
                </Typography>
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
                  {isSaved === true ? "Added" : "Add"}
                </Button></Item>
              </Grid>

            </Grid>
          </CardActions>
        </Card>

      </DialogContent>
    </Dialog>
  )
}

export default AddAccountToBankDialog;