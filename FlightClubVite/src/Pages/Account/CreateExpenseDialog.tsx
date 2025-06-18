import '../../Types/Number.extensions'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, LinearProgress, TextField, ThemeProvider, useTheme } from '@mui/material';
import { useCallback, useState } from 'react'
import ClubAccountsCombo from '../../Components/Accounts/ClubAccountsCombo';
import { InputComboItem } from '../../Components/Buttons/ControledCombo';
import { IValidationAlertProps, ValidationAlert } from '../../Components/Buttons/TransitionAlert';
import TypesCombo from '../../Components/Buttons/TypesCombo';
import Item from '../../Components/Item';
import { useCreateExpenseMutation, useClubAccountQuery } from '../../features/Account/accountApiSlice';
import { IExpenseBase, IUpsertExpanse, newExpense } from '../../Interfaces/API/IExpense';
import { setProperty } from '../../Utils/setProperty';
import { getValidationFromError } from '../../Utils/apiValidation.Parser';
import FullScreenLoader from '../../Components/FullScreenLoader';
import UtilizatedCombo from '../../Components/Buttons/UtilizatedCombo';
import { MemberType } from '../../Interfaces/API/IMember';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DateTime } from 'luxon';
import SizePerUnitCombo from '../../Components/Buttons/SizePerUnitCombo';
export interface CreateExpenseDialogProps {

  onClose: () => void;
  onSave: (value: IExpenseBase) => void;
  open: boolean;
}

function CreateExpenseDialog({ onClose, onSave, open, ...other }: CreateExpenseDialogProps) {
  const theme = useTheme()
  const [createExpense, { isError, isLoading }] = useCreateExpenseMutation();
  const { data: bankAccounts, isLoading: isQuery } = useClubAccountQuery(true);
  const [selectedExpense, setSelectedExpense] = useState<IExpenseBase>(newExpense);
  const [selectedSource, setSelectedSource] = useState<InputComboItem>()
  const [selectedDestination, setSelectedDestination] = useState<InputComboItem>()
  const [selectedType, setSelectedType] = useState<InputComboItem>()
  const [selectedCategory, setSelectedCategory] = useState<InputComboItem>()
  const [selectedSPU, setSelectedSPU] = useState<InputComboItem>()
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const UpdateSourceAccountFields = (): IExpenseBase => {
    let newObj = selectedExpense;
    CustomLogger.info("CreateExspenseDialog/UpdateSourceAccountFields/selectedSource", selectedSource, selectedDestination)
    newObj = setProperty(selectedExpense, "source.id", selectedSource?._id)
    newObj = setProperty(newObj, "source.type", selectedSource?.key)
    newObj = setProperty(newObj, "source.display", selectedSource?.lable)
    newObj = setProperty(newObj, "source.account_id", selectedSource?.key2);
    newObj = setProperty(newObj, "destination.id", selectedDestination?._id)
    newObj = setProperty(newObj, "destination.type", selectedDestination?.key)
    newObj = setProperty(newObj, "destination.display", selectedDestination?.lable)
    newObj = setProperty(newObj, "destination.account_id", selectedDestination?.key2)
    if(selectedExpense.description == "") {
      newObj = setProperty(newObj, "description", `|${selectedExpense.expense.category}|${selectedExpense.expense.type}|${selectedExpense.expense.utilizated}|${selectedDestination?.lable}|`)
    }
    CustomLogger.info("CreateExspenseDialog/UpdateSourceAccountFields/newobj", newObj)

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
    CustomLogger.log("CreateExspenseDialog/onSave/selectedExpense", selectedExpense)
    setValidationAlert([]);
    if (selectedSource !== undefined) {
      const expanse = UpdateSourceAccountFields()
      const filterData: IUpsertExpanse = {
        update: expanse
      }
      await createExpense(filterData).unwrap().then((data) => {
        CustomLogger.info("CreateExspenseDialog/onSave/data", data);
        if (data.success) {
          setIsSaved(true)
        }

      }).catch((err) => {
        const validation = getValidationFromError(err, handleOnValidatiobClose);
        setValidationAlert(validation);
        CustomLogger.error("CreateExspenseDialog/onSave/error", err.data.errors);
      });
    }



  }
  const onSelectedSource = (item: InputComboItem) => {
    CustomLogger.log("onSelectedSource/item", item)
    setSelectedSource(item)
  }

  const OnselectedDestination = (item: InputComboItem): void => {
    setSelectedDestination(item);
    SetProperty(selectedExpense, `supplier`, item.description)

  }

  const RenderSource = (): JSX.Element => {
    return <ClubAccountsCombo title={"Source"} selectedItem={selectedSource} onChanged={onSelectedSource} source={"_ExpenseDialogs/Source"} includesType={[MemberType.Club]} />
  }
  const RenderDestination = (): JSX.Element => {

    return <ClubAccountsCombo title={"Destination"} selectedItem={selectedDestination} onChanged={OnselectedDestination} source={"_CreateExspense/Destination"} filter={{}} includesType={[MemberType.Member,MemberType.Supplier]}/>

  }

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    CustomLogger.log("ExpenseDialog/handleNumberChange", event.target.name, event.target.value)
    const newObj: IExpenseBase = SetProperty(selectedExpense, event.target.name, Number(event.target.value).setFix(2)) as IExpenseBase;
    newObj.amount = Number((newObj.units * newObj.pricePeUnit).toFixed(2))
    setSelectedExpense(newObj)
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    CustomLogger.log("ExpenseDialog/handleChange", event.target.name, event.target.value)
    const newObj: IExpenseBase = SetProperty(selectedExpense, event.target.name, event.target.value) as IExpenseBase;
    setSelectedExpense(newObj)
  };
  const SetProperty = (obj: any, path: string, value: any): any => {
    let newObj = { ...obj };
    newObj = setProperty(newObj, path, value);
    CustomLogger.info("ExpenseDialog/SetProperty/newobj", newObj)
    return newObj;
  }
  const onCategoryChanged = (item: InputComboItem) => {
    CustomLogger.log("ExpenseDialog/onCategoryChanged/item", item)
    setSelectedCategory(item)
    setSelectedExpense(setProperty(selectedExpense, `expense.category`, item.lable))
    

  }
  const onTypeChanged = (item: InputComboItem) => {
    CustomLogger.log("ExpenseDialog/onTypeChanged/item", item)
    setSelectedType(item)
    setSelectedExpense(setProperty(selectedExpense, `expense.type`, item.lable))
/*     if(selectedExpense.description == "" || selectedExpense.description.includes("|") ){
      setSelectedExpense(SetProperty(selectedExpense,'description',`|${selectedExpense.expense.category}|${item.lable}|`))
    } */
  }
  const onSPUChanged = (item: InputComboItem) => {
    CustomLogger.log("ExpenseDialog/onSPUChanged/item", item)
    setSelectedSPU(item)
    setSelectedExpense(setProperty(selectedExpense, `sizePerUnit`, item.lable))
/*     if(selectedExpense.description == "" || selectedExpense.description.includes("|") ){
      setSelectedExpense(SetProperty(selectedExpense,'description',`|${selectedExpense.expense.category}|${item.lable}|`))
    } */
  }
  const onComboChanged = (item: InputComboItem, prop: string): void => {
    setSelectedExpense(setProperty(selectedExpense, prop, item.lable))
    CustomLogger.log("selectedExpense", selectedExpense)
  }
  const handleDateChange = (newValue: DateTime | null) => {
    let newDate = newValue?.toJSDate() === undefined ? new Date() : newValue?.toJSDate();
    newDate.setSeconds(0, 0);
    setSelectedExpense(prev => ({ ...prev, date: newDate }))
  };
  return (

    <Dialog
      sx={{ '& .MuiDialog-paper': { width: "80%", maxHeight: "auto" } }}
      maxWidth="lg" open={open} {...other}>
      <DialogTitle>Create Expense</DialogTitle>
      {(isQuery && isLoading) ? (
        <>
          <FullScreenLoader />
        </>
      ) : (
        <>
          <DialogContent>
            <Grid container sx={{ width: "100%" }} justifyContent="center" columns={12} rowGap={1}>
              <Grid item xs={12} sm={6}  >
                {RenderSource()}
              </Grid >
              <Grid item xs={12} sm={6}>
                {RenderDestination()}
              </Grid>
              <Grid item xs={12} sm={4}>
                <TypesCombo selectedKey='Expense' title={'Category'} selectedValue={selectedExpense.expense.category} onChanged={onCategoryChanged} source={"_CreateExspense/Category"} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TypesCombo selectedKey={`Expense.${selectedCategory?.lable}`} title={"Type"} selectedValue={selectedExpense.expense.type} selectedItem={selectedType} onChanged={onTypeChanged} source={"_CreateExspense/Type"} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <UtilizatedCombo onChanged={(item) => onComboChanged(item, "expense.utilizated")} source={""}
                  selectedItem={{ lable: selectedExpense.expense.utilizated === undefined ? "" : selectedExpense.expense.utilizated.toString(), _id: "", description: "" }} />
              </Grid>
              <Grid item xs={12} sm={4}>
              <SizePerUnitCombo onChanged={onSPUChanged} source={'_CreateExspense/SizePerUnit'} selectedItem={{ lable: selectedExpense.sizePerUnit === undefined ? "" : selectedExpense.sizePerUnit, _id: "", description: "" }}/>
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField fullWidth={true} onChange={handleNumberChange} id="units" name="units"
                  type={"number"}
                  label="Units" placeholder="Units" variant="standard"
                  value={selectedExpense?.units} required
                  helperText="" error={false} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField fullWidth={true} onChange={handleNumberChange} id="pricePeUnit" name="pricePeUnit"
                  type={"number"}
                  label="Unit Price" placeholder="Per Unit" variant="standard"
                  value={selectedExpense?.pricePeUnit} required
                  helperText="" error={false} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField fullWidth={true} onChange={handleNumberChange} id="amount" name="amount"
                  disabled
                  type={"number"}
                  label="Amount" placeholder="Amount" variant="standard"
                  value={selectedExpense?.amount} required
                  helperText="" error={false} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={4 }sx={{paddingRight: "2ch"}}>
              <LocalizationProvider adapterLocale={"en-gb"} dateAdapter={AdapterLuxon}>
                    <ThemeProvider theme={theme}>
                      <MobileDatePicker
                        sx={{ width:"100%"} }  
                        label="Date"
                        value={DateTime.fromJSDate(selectedExpense.date)}
                        onChange={handleDateChange}
                        
                      />
                    </ThemeProvider>
                  </LocalizationProvider>
              </Grid>
              
              <Grid item xs={8}>
                <TextField fullWidth={true} onChange={handleChange} id="description" name="description"
                  multiline
                  label="Description" placeholder="Expense Description" variant="standard"
                  value={selectedExpense?.description} required
                  helperText="" error={false} InputLabelProps={{ shrink: true }} />
              </Grid>
{/*               <Grid item xs={6}>
            <EnumTCombo qw={PaymentMethod} />
            
          </Grid> */}
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
                  {isSaved === true ? "Created" : "Create"}
                </Button></Item>
              </Grid></>
          )}


        </Grid>
      </DialogActions>
    </Dialog>
  )
}

export default CreateExpenseDialog