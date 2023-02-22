import '../../Types/Number.extensions'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, LinearProgress, TextField } from '@mui/material';
import { useCallback, useState } from 'react'
import ClubAccountsCombo from '../../Components/Accounts/ClubAccountsCombo';
import { InputComboItem, newInputComboItem } from '../../Components/Buttons/ControledCombo';
import { IValidationAlertProps, ValidationAlert } from '../../Components/Buttons/TransitionAlert';
import TypesCombo from '../../Components/Buttons/TypesCombo';
import Item from '../../Components/Item';
import { useUpdateExpenseMutation, useClubAccountQuery } from '../../features/Account/accountApiSlice';
import { IClubAccount } from '../../Interfaces/API/IClub';
import { IExpense, IExpenseBase, IUpsertExpanse } from '../../Interfaces/API/IExpense';
import { setProperty } from '../../Utils/setProperty';
import { getValidationFromError } from '../../Utils/apiValidation.Parser';
import FullScreenLoader from '../../Components/FullScreenLoader';
export interface UpdateExpenseDialogProps {

  onClose: () => void;
  onSave: (value: IExpenseBase) => void;
  open: boolean;
  value: IExpense;
}

function UpdateExpenseDialog({ onClose, onSave, open, value, ...other }: UpdateExpenseDialogProps) {
  const [UpdateExpense, { isError, isLoading }] = useUpdateExpenseMutation();
  const { data: bankAccounts, isLoading: isQuery } = useClubAccountQuery();
  const [bank, setBank] = useState<IClubAccount | undefined>();

  const [selectedExpense, setSelectedExpense] = useState<IExpense>(value);
  const [selectedSource, setSelectedSource] = useState<InputComboItem>()
  const [selectedDestination, setSelectedDestination] = useState<InputComboItem>()
  const [selectedType, setSelectedType] = useState<InputComboItem>()
  const [selectedCategory, setSelectedCategory] = useState<InputComboItem>()


  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const UpdateSourceAccountFields = (): IExpenseBase => {
    let newObj = selectedExpense;
    console.log("CreateExspenseDialog/UpdateSourceAccountFields/selectedSource", selectedSource, selectedDestination)
    newObj = setProperty(selectedExpense, "source.id", selectedSource?._id)
    newObj = setProperty(newObj, "source.type", selectedSource?.key)
    newObj = setProperty(newObj, "source.display", selectedSource?.lable)
    newObj = setProperty(newObj, "source.account_id", selectedSource?.key2);
    newObj = setProperty(newObj, "destination.id", selectedDestination?._id)
    newObj = setProperty(newObj, "destination.type", selectedDestination?.key)
    newObj = setProperty(newObj, "destination.display", selectedDestination?.lable)
    newObj = setProperty(newObj, "destination.account_id", selectedDestination?.key2)

    console.log("CreateExspenseDialog/UpdateSourceAccountFields/newobj", newObj)
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

    if (selectedSource !== undefined) {

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
  const onSelectedSource = (item: InputComboItem) => {
    console.log("onSelectedSource/item", item)
    setSelectedSource(item)
  }

  const OnselectedDestination = (item: InputComboItem): void => {
    setSelectedDestination(item);
  }

  const RenderSource = (): JSX.Element => {

    return <ClubAccountsCombo title={"Source"} selectedItem={selectedSource} onChanged={onSelectedSource} source={"_ExpenseDialogs/Source"} />
  }
  const RenderDestination = (): JSX.Element => {

    return <ClubAccountsCombo title={"Destination"} selectedItem={selectedDestination} onChanged={OnselectedDestination} source={"_CreateExspense/Destination"} filter={{}} />

  }
  const [sourceCombo, setSourceCombo] = useState<JSX.Element>(RenderSource())
  const [destinationCombo, setDestinationCombo] = useState<JSX.Element>(RenderDestination())

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("ExpenseDialog/handleChange", event.target.name, event.target.value)
    const newObj: IExpense = SetProperty(selectedExpense, event.target.name, event.target.value) as IExpense;

    setSelectedExpense(newObj)
  };
  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    
    console.log("ExpenseDialog/handleNumberChange", event.target.name, event.target.value)
    const newObj: IExpense = SetProperty(selectedExpense, event.target.name, Number(event.target.value).setFix(2)) as IExpense;
    newObj.amount = Number((newObj.units * newObj.pricePeUnit).toFixed(2))
    setSelectedExpense(newObj)
  };

  const SetProperty = (obj: any, path: string, value: any): any => {
    let newObj = { ...obj };
    newObj = setProperty(newObj, path, value);
    console.log("ExpenseDialog/SetProperty/newobj", newObj)
    return newObj;
  }
  const onCategoryChanged = (item: InputComboItem) => {
    console.log("ExpenseDialog/onCategoryChanged/item", item)
    setSelectedCategory(item)
   /*  setSelectedType(newInputComboItem) */
    setSelectedExpense(setProperty(selectedExpense, `expense.category`, item.lable))
   /*  setSelectedExpense(setProperty(selectedExpense, `expense.type`, "")) */
  }
  const onTypeChanged = (item: InputComboItem) => {
    console.log("ExpenseDialog/onTypeChanged/item", item)
    setSelectedType(item)

    setSelectedExpense(setProperty(selectedExpense, `expense.type`, item.lable))
  }

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
              <Grid item xs={12} sm={6}  >
                {sourceCombo}
              </Grid >
              <Grid item xs={12} sm={6}>
                {destinationCombo}
              </Grid>
              <Grid item xs={6}>
                <TypesCombo selectedKey='Expense' title={'Category'} selectedValue={selectedExpense.expense.category} selectedItem={selectedCategory} onChanged={onCategoryChanged} source={"_CreateExspense/category"} />
              </Grid>
              <Grid item xs={6}>
                <TypesCombo selectedKey={`Expense.${selectedExpense.expense.category}`} title={"Type"} selectedValue={selectedExpense.expense.type} selectedItem={selectedType} onChanged={onTypeChanged} source={"_CreateExspense/Type"} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth={true} onChange={handleNumberChange} id="units" name="units"
                  type={"number"}
                  label="Units" placeholder="Units" variant="standard"
                  value={selectedExpense?.units} required
                  helperText="" error={false} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth={true} onChange={handleNumberChange} id="pricePeUnit" name="pricePeUnit"
                  type={"number"}
                  label="Unit Price" placeholder="Per Unit" variant="standard"
                  value={selectedExpense?.pricePeUnit} required
                  helperText="" error={false} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth={true} onChange={handleChange} id="amount" name="amount"
                  disabled
                  type={"number"}
                  label="Amount" placeholder="Amount" variant="standard"
                  value={selectedExpense?.amount } required
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