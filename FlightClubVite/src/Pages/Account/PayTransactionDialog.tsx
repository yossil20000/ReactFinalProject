import '../../Types/Number.extensions'
import { Accordion, AccordionDetails, AccordionSummary, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, LinearProgress, TextField, ThemeProvider, useTheme } from '@mui/material';
import { useCallback, useEffect, useState } from 'react'
import ClubAccountsCombo from '../../Components/Accounts/ClubAccountsCombo';
import { InputComboItem } from '../../Components/Buttons/ControledCombo';
import { IValidationAlertProps, ValidationAlert } from '../../Components/Buttons/TransitionAlert';
import Item from '../../Components/Item';
import { useClubAccountQuery, useClubAddTransactionPaymentMutation } from '../../features/Account/accountApiSlice';
import { EAccountType, IAddTransaction, IPaymentRecipe, PaymentMethod, Transaction_OT, Transaction_Type, getTransactionToPaymentReciept } from '../../Interfaces/API/IClub';
import { IExpenseBase } from '../../Interfaces/API/IExpense';
import { setProperty } from '../../Utils/setProperty';
import { getValidationFromError } from '../../Utils/apiValidation.Parser';
import FullScreenLoader from '../../Components/FullScreenLoader';
import { MemberType } from '../../Interfaces/API/IMember';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DateTime } from 'luxon';
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';
import TransactionTypeCombo from '../../Components/Buttons/TransactionTypeCombo';
import { GridExpandMoreIcon } from '@mui/x-data-grid';
export interface PayTransactionDialogProps {

  onClose: () => void;
  onSave: (value: IExpenseBase) => void;
  open: boolean;
}
let newTransaction: IAddTransaction = {
  source: {
    _id: "",
    accountType: ""
  },
  destination: {
    _id: "",
    accountType: ""
  },
  amount: Number("0"),

  type: Transaction_Type.DEBIT,
  order: {
    type: Transaction_OT.TRANSFER,
    _id: ''
  },
  payment: {
    method: PaymentMethod.TRANSFER,
    referance: ''
  },
  description: '',
  date: new Date()
}
const getAccountType = (memberType: string | undefined): string => {
  /* CustomLogger.info("getTransaction/getAccountType/memberType",memberType , MemberType.Club) */
  /* CustomLogger.info("getTransaction/getAccountType/memberType == MemberType.Club.toString()",memberType,memberType == MemberType.Club.toString()) */
  if (memberType === undefined) {
    memberType = ""
  }

  switch (memberType) {
    case MemberType.Club:
      return EAccountType.EAT_BANK;
    case MemberType.Member:
      return EAccountType.EAT_ACCOUNT;
    case MemberType.Supplier:
      return EAccountType.EAT_SUPPLIERS
    default:
      return ""
  }
}

function PayTransactionDialog({ onClose, onSave, open, ...other }: PayTransactionDialogProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<IAddTransaction>(newTransaction);
  const [AddTransaction, { isError, isLoading, error, isSuccess: transactionSccuess }] = useClubAddTransactionPaymentMutation();
  const { data: bankAccounts, isLoading: isQuery } = useClubAccountQuery(true);
  const [flipSource, setFlipSource] = useState(false)
  const theme = useTheme()
  const [selectedSource, setSelectedSource] = useState<InputComboItem>()
  const [selectedDestination, setSelectedDestination] = useState<InputComboItem>()
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const [recipe, setRecipe] = useState<IPaymentRecipe>()

  const [isSaved, setIsSaved] = useState(false);
  useEffect(() => {
    if (selectedTransaction) {
      const recipe = getTransactionToPaymentReciept().getReciep(selectedTransaction)
      console.info("PayTransactionDialog/recipe", recipe)
      setRecipe(recipe);
    }
  }, [selectedTransaction])
  const UpdateSourceAccountFields = (): IAddTransaction => {
    let newObj: IAddTransaction = selectedTransaction
    newObj = {
      source: {
        _id: selectedSource?.key2 === undefined ? "" : selectedSource?.key2,
        accountType: getAccountType(selectedSource?.key)
      },
      destination: {
        _id: selectedDestination?.key2 === undefined ? "" : selectedDestination?.key2,
        accountType: getAccountType(selectedDestination?.key)
      },
      type: selectedTransaction.type,
      amount: selectedTransaction.amount,
      order: {
        type: selectedTransaction.order.type,
        _id: ''
      },
      payment: {
        method: selectedTransaction.payment.method,
        referance: JSON.stringify(recipe)
      },
      description: selectedTransaction.description,
      date: new Date()
    }
    CustomLogger.log("PayTransactionDialog/UpdateSourceAccountFields/selectedSource", selectedSource, selectedDestination)
    CustomLogger.log("PayTransactionDialog/UpdateSourceAccountFields/newobj", newObj)
    //setSelectedExpense(newObj);
    setSelectedTransaction(newObj);
    return newObj
  }

  const handleOnCancel = () => {
    setValidationAlert([])

    onClose()
  }
  const handleOnValidatiobClose = useCallback(() => {
    setValidationAlert([])

  }, [])

  const handleOnSave = async () => {
    CustomLogger.log("PayTransactionDialog/onSave", selectedTransaction)
    setValidationAlert([]);
    const transaction = UpdateSourceAccountFields()
    if (transaction !== undefined) {
      await AddTransaction(transaction).unwrap().then((data) => {
        CustomLogger.info("PayTransactionDialog/onSave/", data);
        if (data.success) {
          setIsSaved(true)
        }
      }).catch((err) => {
        const validation = getValidationFromError(err, handleOnValidatiobClose);
        setValidationAlert(validation);
        CustomLogger.error("PayTransactionDialog/onSave/error", err.data.errors);
      });
    }
  }

  const onSelectedSource = (item: InputComboItem) => {
    CustomLogger.log("onSelectedSource/item", item)
    setSelectedSource(item)
  }

  const OnselectedDestination = (item: InputComboItem): void => {

    setSelectedDestination(item);
  }

  const RenderSource = (): JSX.Element => {
    return <ClubAccountsCombo title={"Source"} selectedItem={selectedSource} onChanged={onSelectedSource} source={"_NewTransactions/Source"} includesType={[MemberType.Club]} />
    /* return flipSource === false ?
     
    :
    <ClubAccountsCombo title={"DE"} selectedItem={selectedDestination} onChanged={onSelectedSource} source={"_CreateExspense/Destination"} filter={{}} includesType={[MemberType.Member, MemberType.Supplier]} /> */
  }
  const RenderDestination = (): JSX.Element => {
    return <ClubAccountsCombo title={"Destination"} selectedItem={selectedDestination} onChanged={OnselectedDestination} source={"_CreateExspense/Destination"} filter={{}} includesType={[MemberType.Member, MemberType.Supplier]} />
    /* return flipSource === false ?
    <ClubAccountsCombo title={"Destination"} selectedItem={selectedDestination} onChanged={OnselectedDestination} source={"_CreateExspense/Destination"} filter={{}} includesType={[MemberType.Member, MemberType.Supplier]} />
    :
    <ClubAccountsCombo title={"Destination"} selectedItem={selectedDestination} onChanged={OnselectedDestination} source={"_NewTransactions/Source"} includesType={[MemberType.Club]} /> */
  }
  const handleFlipClick = () => {
    CustomLogger.log("NewTransaction/handleFlipClick", flipSource,)
    setFlipSource((prev) => !prev)

  }
  const handleNumericChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    CustomLogger.log("NewTransaction/handleChange", event.target.name, event.target.value)

    if (event.target.name = "amount") {
      event.target.value = Math.abs(Number(event.target.value)).toString()
    }
    const newObj: IAddTransaction = SetProperty(selectedTransaction, event.target.name, event.target.value) as IAddTransaction;

    setSelectedTransaction(newObj)
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    CustomLogger.log("NewTransaction/handleChange", event.target.name, event.target.value)
    const newObj: IAddTransaction = SetProperty(selectedTransaction, event.target.name, event.target.value) as IAddTransaction;
    setSelectedTransaction(newObj)
  };
  const handleRecipeChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    CustomLogger.log("NewTransaction/handleRecipeChange", event.target.name, event.target.value)
    const newObj: IPaymentRecipe = SetProperty(recipe, event.target.name, event.target.value) as IPaymentRecipe;
    setRecipe(newObj)
  };
  const SetProperty = (obj: any, path: string, value: any): any => {
    let newObj = { ...obj };
    newObj = setProperty(newObj, path, value);
    CustomLogger.log("NewTransaction/SetProperty/newobj", newObj)
    return newObj;
  }
  const handleDateChange = (newValue: DateTime | null) => {
    let newDate = newValue?.toJSDate() === undefined ? new Date() : newValue?.toJSDate();
    newDate.setSeconds(0, 0);
    setSelectedTransaction(prev => ({ ...prev, date: newDate }))
  };
  const onComboChanged = (item: InputComboItem, prop: string): void => {
    setSelectedTransaction(setProperty(selectedTransaction, prop, item.lable))
    CustomLogger.log("PayTransactionDialog/onComboChanged/selectedTransaction", selectedTransaction)
  }
  const getRecipeSummary = () => {
    return (<>Payment Info</>)
  }
  const getRecipeDetailes = () => {
    return (
      <Grid container sx={{ width: "100%" }} justifyContent="center" columns={12} rowGap={1}>
        <Grid item xs={12} md={4}>
          <TextField fullWidth={true} onChange={handleRecipeChange} id="bank" name="bank"
            label="Bank" placeholder="Bank" variant="standard"
            value={recipe?.bank} required
            helperText="" error={false} InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField fullWidth={true} onChange={handleRecipeChange} id="branch" name="branch"
            label="Branch" placeholder="Branch" variant="standard"
            value={recipe?.branch} required
            helperText="" error={false} InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField fullWidth={true} onChange={handleRecipeChange} id="accountId" name="accountId"
            label="Account Id" placeholder="AccountId" variant="standard"
            value={recipe?.accountId} required
            helperText="" error={false} InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth={true} onChange={handleRecipeChange} id="referance" name="referance"
            multiline
            label="Referance" placeholder="Referance" variant="standard"
            value={recipe?.referance} required
            helperText="" error={false} InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField fullWidth={true} onChange={handleChange} id="description" name="description"
            multiline
            label="Description" placeholder="Expense Description" variant="standard"
            value={selectedTransaction?.description} required
            helperText="" error={false} InputLabelProps={{ shrink: true }} />
        </Grid>
      </Grid>)
  }
  return (

    <Dialog
      sx={{ '& .MuiDialog-paper': { width: "80%", maxHeight: "auto" } }}
      maxWidth="lg" open={open} {...other}>
      <DialogTitle>
        <div>Create Payment Transaction</div>
      </DialogTitle>
      {(isQuery && isLoading) ? (
        <>
          <FullScreenLoader />
        </>
      ) : (
        <>
          <DialogContent>
            <Grid container sx={{ width: "100%" }} justifyContent="center" columns={12} rowGap={1}>
              <Grid item xs={11} sm={5}  >
                {RenderSource()}
              </Grid >
              <Grid item xs={2} textAlign={"center"} margin={"auto"}>
                <IconButton color="primary" aria-label="flip source and destination" onClick={handleFlipClick}>
                  <FlipCameraAndroidIcon />
                </IconButton>
              </Grid>
              <Grid item xs={11} sm={5}>
                {RenderDestination()}
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField fullWidth={true} onChange={handleChange} id="payment.method" name="payment.method"
                  disabled
                  label="Pay Method" placeholder="Payment Method" variant="standard"
                  value={selectedTransaction?.payment.method} required
                  helperText="" error={false} InputLabelProps={{ shrink: true }} />
              </Grid>

              <Grid item xs={12} md={3}>
                <TransactionTypeCombo onChanged={(item) => onComboChanged(item, "type")} source={""}
                  selectedItem={{ lable: selectedTransaction.type === undefined ? "" : selectedTransaction.type.toString(), _id: "", description: "" }} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth={true} onChange={handleNumericChange} id="amount" name="amount"
                  type="number"
                  label="Amount" placeholder="Amount" variant="standard"
                  value={selectedTransaction?.amount} required
                  helperText="" error={false} InputLabelProps={{ shrink: true }}
                  inputProps={{ max: 1000, min: 1 }} />
              </Grid>
              <Grid item sx={{ marginLeft: "0px" }} xs={12} md={3}>
                <LocalizationProvider adapterLocale={"en-gb"} dateAdapter={AdapterLuxon}>
                  <ThemeProvider theme={theme}>
                    <MobileDatePicker
                      sx={{ width: '100%', paddingLeft: '0px' }}
                      label="Date"
                      value={DateTime.fromJSDate(selectedTransaction.date)}
                      onChange={handleDateChange}
                    />
                  </ThemeProvider>
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <Accordion>
                  <AccordionSummary expandIcon={<GridExpandMoreIcon />} aria-control="device-report" id='device_report'>
                    {getRecipeSummary()}
                  </AccordionSummary>
                  <AccordionDetails>{getRecipeDetailes()}</AccordionDetails>
                </Accordion>
              </Grid>
              <Grid item xs={12}>
                <Accordion>
                  <AccordionSummary expandIcon={<GridExpandMoreIcon />} aria-control="device-report" id='device_report'>
                    Payment Summary
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid>
                      <Grid item xs={12}>
                        <TextField fullWidth={true} onChange={handleChange} id="payment.referance" name="payment.referance"
                          disabled
                          multiline
                          label="Pay Referance" placeholder="Payment Referance" variant="standard"
                          value={JSON.stringify(recipe)} required
                          helperText="" error={false} InputLabelProps={{ shrink: true }} />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
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
                  {isSaved === true ? "Created" : "Create"}
                </Button></Item>
              </Grid></>
          )}


        </Grid>
      </DialogActions>
    </Dialog>
  )
}

export default PayTransactionDialog