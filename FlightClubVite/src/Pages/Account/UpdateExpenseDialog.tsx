import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, LinearProgress, TextField } from '@mui/material';
import { useCallback, useEffect, useState } from 'react'
import ClubAccountsCombo from '../../Components/Accounts/ClubAccountsCombo';
import { InputComboItem, newInputComboItem } from '../../Components/Buttons/ControledCombo';
import { IValidationAlertProps, ValidationAlert } from '../../Components/Buttons/TransitionAlert';
import TypesCombo from '../../Components/Buttons/TypesCombo';
import Item from '../../Components/Item';
import MembersCombo from '../../Components/Members/MembersCombo';
import { useUpdateExpenseMutation, useClubAccountQuery } from '../../features/Account/accountApiSlice';
import { IClubAccount } from '../../Interfaces/API/IClub';
import { IExpense, IExpenseBase, IUpsertExpanse } from '../../Interfaces/API/IExpense';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { setProperty,getSelectedItem } from '../../Utils/setProperty';
import { getValidationFromError } from '../../Utils/apiValidation.Parser';
import FullScreenLoader from '../../Components/FullScreenLoader';
import { MemberType } from '../../Interfaces/API/IMember';
export interface UpdateExpenseDialogProps {

  onClose: () => void;
  onSave: (value: IExpenseBase) => void;
  open: boolean;
  value: IExpense;
}
const filterData: IUpsertExpanse = {

}
function UpdateExpenseDialog({ onClose, onSave, open,value, ...other }: UpdateExpenseDialogProps) {
  const [UpdateExpense, { isError, isLoading }] = useUpdateExpenseMutation();
  const { data: bankAccounts, isLoading: isQuery } = useClubAccountQuery();
  const [bank, setBank] = useState<IClubAccount | undefined>();

  const [selectedExpense, setSelectedExpense] = useState<IExpense>(value);
  const [selectedMember, setSelectedMember] = useState<InputComboItem>()
  const [selectedClub, setSelectedClub] = useState<InputComboItem>()
  const [selectedType, setSelectedType] = useState<InputComboItem>()


  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const UpdateSourceAccountFields = (): IExpense => {
    let newObj = selectedExpense;
    console.log("UpdateExspenseDialog/UpdateSourceAccountFields/selectedMember", selectedMember,selectedClub)
    if (flipSource) {
      newObj = setProperty(selectedExpense, "source.id", selectedMember?._id)
      newObj = setProperty(newObj, "source.type", selectedMember?.key)
      newObj = setProperty(newObj, "source.display", selectedMember?.lable)
      newObj = setProperty(newObj, "destination.id", selectedClub?._id)
      newObj = setProperty(newObj, "destination.type", selectedClub?.key)
      newObj = setProperty(newObj, "destination.display", selectedClub?.lable)
    }
    else {
      newObj = setProperty(selectedExpense, "destination.id", selectedMember?._id)
      newObj = setProperty(newObj, "destination.type", selectedMember?.key)
      newObj = setProperty(newObj, "destination.display", selectedMember?.lable)
      newObj = setProperty(newObj, "source.id", selectedClub?._id)
      newObj = setProperty(newObj, "source.type", selectedClub?.key)
      newObj = setProperty(newObj, "source.display", selectedClub?.lable)
    }
    console.log("UpdateExspenseDialog/UpdateSourceAccountFields/newobj", newObj)
    //setSelectedExpense(newObj);
    return newObj
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
    console.log("UpdateExspenseDialog/onSave", selectedExpense)
    setValidationAlert([]);

    /* account.copy(accountUpdate); */

    if (selectedMember !== undefined) {

      const expanse = UpdateSourceAccountFields()
      const filterData: IUpsertExpanse = {
        update: expanse
      }
      console.log("UpdateExspenseDialog/onSave/filterData", filterData)
      await UpdateExpense(filterData).unwrap().then((data) => {
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
  const onMemberChanged = (item: InputComboItem) => {
    console.log("onMemberChanged/item", item)
    setSelectedMember(item)
    /* UpdateSourceAccountFields() */
  }

  const OnSelectedClubAccount = (item: InputComboItem): void => {
    let bankFound: IClubAccount | undefined = undefined;
    setSelectedClub(item);
    if (bankAccounts?.data !== undefined && bankAccounts?.data.length > 0) {
      bankFound = bankAccounts?.data.find((bank) => (bank._id === item._id))
      console.log("ExpenseDialog/OnSelectedClubAccount/item,bank", item, bankFound)
      setBank(bankFound)

    }
    UpdateSourceAccountFields()
  }


  const [flipSource, setFlipSource] = useState(false);
  const RenderSource = (flip: boolean): JSX.Element => {

    return <ClubAccountsCombo title={flip ? "Source" : "Destination"} onChanged={OnSelectedClubAccount} source={"_ExpenseDialogs"} selectedItem={newInputComboItem}/>
  }
  const RenderDestination = (flip: boolean): JSX.Element => {

    return <MembersCombo title={flip ? "Destination" : "Source"} selectedItem={selectedMember} onChanged={onMemberChanged} source={"_UpdateExspense/members"} filter={{}} />

  }
  const [sourceCombo, setSourceCombo] = useState<JSX.Element>(RenderSource(false))
  const [destinationCombo, setDestinationCombo] = useState<JSX.Element>(RenderDestination(true))
  const onFipSource = () => {
    console.log("ExpenseDialog/flipSource")
    const destination = destinationCombo;
    const source = sourceCombo
    const flip = flipSource
    if (flip) {
      setSourceCombo(RenderSource(flip))
      setDestinationCombo(RenderDestination(flip))
    }
    else {
      setSourceCombo(RenderDestination(flip))
      setDestinationCombo(RenderSource(flip))
    }
    setFlipSource(!flip);
  }
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("ExpenseDialog/handleChange", event.target.name, event.target.value)
    const newObj: IExpense = SetProperty(selectedExpense, event.target.name, event.target.value) as IExpense;

    setSelectedExpense(newObj)
  };
  const SetProperty = (obj: any, path: string, value: any): any => {
    let newObj = { ...obj };
    newObj = setProperty(newObj, path, value);
    console.log("ExpenseDialog/SetProperty/newobj", newObj)
    return newObj;
  }
  const onTypeChanged = (item: InputComboItem) => {
    console.log("ExpenseDialog/onTypeChanged/item", item)
    setSelectedType(item)

    setSelectedExpense(setProperty(selectedExpense, item._id.toLowerCase(), item.lable))
  }
  useEffect(() => {
    console.log("UpdateExpenseDialog/value",value)
    if(value.destination.type === MemberType.Club){
    
    }
      },[])
  return (

    <Dialog
      sx={{ '& .MuiDialog-paper': { width: "80%", maxHeight: "auto" } }}
      maxWidth="lg" open={open} {...other}>
      <DialogTitle>Update Expense</DialogTitle>
      {(isQuery && isLoading) ? (
        <>
          <FullScreenLoader />
        </>
      ) : (
        <>
          <DialogContent>

            <Grid container sx={{ width: "100%" }} justifyContent="center" columns={12}>
              <Grid item xs={12} sm={5}  >
                {sourceCombo}

              </Grid >
              <Grid item xs={12} sm={2} >
                <Box display={'flex'} justifyContent={"center"} alignContent={"baseline"}>
                  <IconButton style={{ fontSize: "40px" }} onClick={onFipSource} >
                    <ChangeCircleIcon fontSize='inherit' />
                  </IconButton>
                </Box>
              </Grid>
              <Grid item xs={12} sm={5}>
                {destinationCombo}
              </Grid>
              <Grid item xs={6}>
                <TypesCombo title={'Expense'} selectedItem={getSelectedItem(selectedExpense.expense)} onChanged={onTypeChanged} source={"_UpdateExspense/Type"} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth={true} onChange={handleChange} id="units" name="units"
                  type={"number"}
                  label="Units" placeholder="Units" variant="standard"
                  value={selectedExpense?.units} required
                  helperText="" error={false} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth={true} onChange={handleChange} id="pricePeUnit" name="pricePeUnit"
                  type={"number"}
                  label="Unit Price" placeholder="Per Unit" variant="standard"
                  value={selectedExpense?.pricePeUnit} required
                  helperText="" error={false} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth={true} onChange={handleChange} id="amount" name="amount"
                  type={"number"}
                  label="Amount" placeholder="Amount" variant="standard"
                  value={selectedExpense?.amount} required
                  helperText="" error={false} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth={true} onChange={handleChange} id="description" name="description"
                  multiline
                  label="Description" placeholder="Expense Description" variant="standard"
                  value={selectedExpense?.description} required
                  helperText="" error={false} InputLabelProps={{ shrink: true }} />
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
            <Grid item xs={12}><Item><LinearProgress  /></Item></Grid>
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
              {isSaved === true ? "Updated" : "Update"}
            </Button></Item>
          </Grid></>
          )}


        </Grid>
      </DialogActions>
    </Dialog>
  )
}

export default UpdateExpenseDialog