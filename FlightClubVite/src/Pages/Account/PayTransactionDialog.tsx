import '../../Types/Number.extensions'
import { Accordion, AccordionDetails, AccordionSummary, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, LinearProgress, TextField, ThemeProvider, useTheme } from '@mui/material';
import { useCallback, useEffect, useState } from 'react'
import ClubAccountsCombo from '../../Components/Accounts/ClubAccountsCombo';
import { InputComboItem } from '../../Components/Buttons/ControledCombo';
import { IValidationAlertProps, ValidationAlert } from '../../Components/Buttons/TransitionAlert';
import Item from '../../Components/Item';
import { useClubAccountQuery, useClubAddTransactionPaymentMutation } from '../../features/Account/accountApiSlice';
import { EAccountType, IAddTransaction, IPaymentRecipe, PayInfo, PaymentMethod, Transaction_OT, Transaction_Type, getTransactionToPaymentReciept, newPayInfo } from '../../Interfaces/API/IClub';
import { IExpenseBase } from '../../Interfaces/API/IExpense';
import { setProperty } from '../../Utils/setProperty';
import { getValidationFromError, getValidationFromUserMessage } from '../../Utils/apiValidation.Parser';
import FullScreenLoader from '../../Components/FullScreenLoader';
import { MemberType } from '../../Interfaces/API/IMember';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DateTime } from 'luxon';
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';
import TransactionTypeCombo from '../../Components/Buttons/TransactionTypeCombo';
import { GridExpandMoreIcon } from '@mui/x-data-grid';
import { QuarterType } from '../../Utils/enums';
export interface PayTransactionDialogProps {

  onClose: () => void;
  onSave: (value: IExpenseBase) => void;
  open: boolean;
  value?: IAddTransaction | undefined;
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

function PayTransactionDialog({ onClose, onSave, open,value, ...other }: PayTransactionDialogProps) {
  /* const [selectedTransaction, setSelectedTransaction] = useState<IAddTransaction>(newTransaction);
  const [recipe, setRecipe] = useState<IPaymentRecipe>() */
  const theme = useTheme()
  const [AddTransaction, { isError, isLoading, error, isSuccess: transactionSccuess }] = useClubAddTransactionPaymentMutation();
  const { data: bankAccounts, isLoading: isQuery } = useClubAccountQuery(true);

  const [payInfo,setPayInfo] = useState<PayInfo>(newPayInfo)
  const [selectedSource, setSelectedSource] = useState<InputComboItem>({_id:"", label:"INIT", description:""})
  const [selectedDestination, setSelectedDestination] = useState<InputComboItem>({_id:"", label:"INIT", description:""})
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
    
  const [sourceCombo, setSourceCombo] = useState<JSX.Element>(<></>);
  const [destinationCombo, setDestinationCombo] = useState<JSX.Element>(<></>);

  const [isSaved, setIsSaved] = useState(false);

useEffect(() => {
      let item : InputComboItem = {
        _id: value?.source._id === undefined ? "" : value?.source._id,
        label: "",
        key: value?.source.accountType,
        key2: value?.source._id,
        description: "",
      };
      setSelectedSource(item);
      setSourceCombo(RenderSource(item));
  item = {
      _id: value?.destination._id === undefined ? "" : value?.destination._id,
      label: "",
      key: value?.destination.accountType,
      key2: value?.destination._id,
      description: "",
    };
    setSelectedDestination(item)
    setDestinationCombo(RenderDestination(item))        
  if(value !== undefined){
    setPayInfo({selectedTransaction:value, recipe: getTransactionToPaymentReciept().getReciep(value)})
  }

}, [value])

  const UpdateSourceAccountFields = (): IAddTransaction => {
    let newObj: IAddTransaction = payInfo.selectedTransaction
    newObj = {
      source: {
        _id: selectedSource?.key2 === undefined ? "" : selectedSource?.key2,
        accountType: getAccountType(selectedSource?.key)
      },
      destination: {
        _id: selectedDestination?.key2 === undefined ? "" : selectedDestination?.key2,
        accountType: getAccountType(selectedDestination?.key)
      },
      type: payInfo.selectedTransaction.type,
      amount: payInfo.selectedTransaction.amount,
      engine_fund_amount: payInfo.selectedTransaction.engine_fund_amount,
      order: {
        type: payInfo.selectedTransaction.order.type,
        _id: '',
        quarter: QuarterType.NONE
      },
      payment: {
        method: payInfo.selectedTransaction.payment.method,
        referance: JSON.stringify(payInfo.recipe)
      },
      description: payInfo.selectedTransaction.description,
      date: payInfo.selectedTransaction.date,
      value_date: payInfo.selectedTransaction.value_date,
      supplier: payInfo.selectedTransaction.supplier // Add supplier property
    }
    CustomLogger.log("PayTransactionDialog/UpdateSourceAccountFields/selectedSource", selectedSource, selectedDestination)
    CustomLogger.log("PayTransactionDialog/UpdateSourceAccountFields/newobj", newObj)
    //setSelectedExpense(newObj);
    setPayInfo({selectedTransaction: newObj,recipe: payInfo.recipe});
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
    CustomLogger.log("PayTransactionDialog/onSave", payInfo.selectedTransaction)
    setValidationAlert([]);
    const transaction = UpdateSourceAccountFields()
    if(transaction.amount === undefined || transaction.amount ==0){
      const validation = getValidationFromUserMessage("Amount must be not equal 0", transaction.amount?.toString() ?? "","amount", handleOnValidatiobClose);
      setValidationAlert(validation);
      return
    }
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

  const RenderSource = (defaultIem: InputComboItem): JSX.Element => {
    return <ClubAccountsCombo title={"Source"} selectedItem={defaultIem} onChanged={onSelectedSource} source={"_NewTransactions/Source"} includesType={[MemberType.Club]} />
    /* return flipSource === false ?
     
    :
    <ClubAccountsCombo title={"DE"} selectedItem={selectedDestination} onChanged={onSelectedSource} source={"_CreateExspense/Destination"} filter={{}} includesType={[MemberType.Member, MemberType.Supplier]} /> */
  }
  const RenderDestination = (defaultIem: InputComboItem): JSX.Element => {
    return <ClubAccountsCombo title={"Destination"} selectedItem={defaultIem} onChanged={OnselectedDestination} source={"_CreateExspense/Destination"} filter={{}} includesType={[MemberType.Member, MemberType.Supplier]} />
    /* return flipSource === false ?
    <ClubAccountsCombo title={"Destination"} selectedItem={selectedDestination} onChanged={OnselectedDestination} source={"_CreateExspense/Destination"} filter={{}} includesType={[MemberType.Member, MemberType.Supplier]} />
    :
    <ClubAccountsCombo title={"Destination"} selectedItem={selectedDestination} onChanged={OnselectedDestination} source={"_NewTransactions/Source"} includesType={[MemberType.Club]} /> */
  }
  

  const handleNumericChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    CustomLogger.log("NewTransaction/handleChange", event.target.name, event.target.value)

    if (event.target.name = "amount") {
      if(Number(event.target.value)<0){
          event.target.value = Math.abs(Number(event.target.value)).toString()
      }
      
    }
    let newObj: IAddTransaction = SetProperty(payInfo.selectedTransaction, event.target.name, event.target.value) as IAddTransaction;
    const recipe = getTransactionToPaymentReciept().getReciep(newObj,payInfo.recipe)
    newObj = SetProperty(newObj, "payment.referance", JSON.stringify(recipe)) as IAddTransaction;
    setPayInfo({selectedTransaction: newObj, recipe: recipe})
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    CustomLogger.log("NewTransaction/handleChange", event.target.name, event.target.value)
    const newObj: IAddTransaction = SetProperty(payInfo.selectedTransaction, event.target.name, event.target.value) as IAddTransaction;
    const recipe = getTransactionToPaymentReciept().getReciep(newObj,payInfo.recipe)
    setPayInfo({selectedTransaction: newObj, recipe: recipe})
  };
/*   const updateRecipe = (newRecipe : IPaymentRecipe) => {
    const recipe = getTransactionToPaymentReciept().getReciep(newObj,payInfo.recipe)
    const newObj = SetProperty(payInfo.selectedTransaction, "payment.referance", JSON.stringify(newRecipe)) as IAddTransaction;
    setPayInfo({selectedTransaction: newObj, recipe: recipe})
  } */
  const handleRecipeChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    CustomLogger.log("NewTransaction/handleRecipeChange", event.target.name, event.target.value)
    let recipe: IPaymentRecipe = SetProperty(payInfo.recipe, event.target.name, event.target.value) as IPaymentRecipe;
    recipe = getTransactionToPaymentReciept().getReciep(payInfo.selectedTransaction,recipe)
    setPayInfo({selectedTransaction:payInfo.selectedTransaction,recipe: recipe})
  };
  const SetProperty = (obj: any, path: string, value: any): any => {
    let newObj = { ...obj };
    newObj = setProperty(newObj, path, value);
    CustomLogger.log("NewTransaction/SetProperty/newobj", newObj)
    return newObj;
  }
  const handleDateChange = (newValue: DateTime | null,field:string="date") => {
    let newDate = newValue?.toJSDate() === undefined ? new Date() : newValue?.toJSDate();
    newDate.setSeconds(0, 0);
    const newObj = setProperty(payInfo.selectedTransaction, field, newDate)
    const recipe = getTransactionToPaymentReciept().getReciep(newObj,payInfo.recipe)
    setPayInfo({selectedTransaction:newObj,recipe: recipe})
  };
  const onComboChanged = (item: InputComboItem, prop: string): void => {
    const newObj = setProperty(payInfo.selectedTransaction, prop, item.label)
    const recipe = getTransactionToPaymentReciept().getReciep(newObj,payInfo.recipe)
    setPayInfo({selectedTransaction:newObj,recipe: recipe})
    CustomLogger.log("PayTransactionDialog/onComboChanged/selectedTransaction", payInfo.selectedTransaction)
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
            value={payInfo.recipe?.bank} required
            helperText="" error={false} InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField fullWidth={true} onChange={handleRecipeChange} id="branch" name="branch"
            label="Branch" placeholder="Branch" variant="standard"
            value={payInfo.recipe?.branch} required
            helperText="" error={false} InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField fullWidth={true} onChange={handleRecipeChange} id="accountId" name="accountId"
            label="Account Id" placeholder="AccountId" variant="standard"
            value={payInfo.recipe?.accountId} required
            helperText="" error={false} InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth={true} onChange={handleRecipeChange} id="referance" name="referance"
            multiline
            label="Referance" placeholder="Referance" variant="standard"
            value={payInfo.recipe?.referance} required
            helperText="" error={false} InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth={true} onChange={handleRecipeChange} id="reciepeId" name="reciepeId"
            multiline
            label="Reciepe Id" placeholder="reciepeId" variant="standard"
            value={payInfo.recipe?.reciepeId} required
            helperText="" error={false} InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField fullWidth={true} onChange={handleChange} id="description" name="description"
            multiline
            label="Description" placeholder="Expense Description" variant="standard"
            value={payInfo.selectedTransaction?.description} required
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
              <Grid item xs={12} sm={6}  >
                {sourceCombo}
              </Grid >

              <Grid item xs={12} sm={6}>
                {destinationCombo}
              </Grid>
              <Grid item sx={{ marginLeft: "0px" }} xs={6}  md={6}>
                <LocalizationProvider adapterLocale={"en-gb"} dateAdapter={AdapterLuxon}>
                  <ThemeProvider theme={theme}>
                    <MobileDatePicker
                      sx={{ width: '100%', paddingLeft: '0px',paddingRight:{xs:'0px' , md:'1ch'} }}
                      label="Payment Date"
                      value={DateTime.fromJSDate(payInfo.selectedTransaction.date)}
                      onChange={(value) => handleDateChange(value, "date")}
                    />
                  </ThemeProvider>
                </LocalizationProvider>
              </Grid>
              <Grid item sx={{ marginLeft: "0px" }} xs={6}  md={6}>
                <LocalizationProvider adapterLocale={"en-gb"} dateAdapter={AdapterLuxon}>
                  <ThemeProvider theme={theme}>
                    <MobileDatePicker
                      sx={{ width: '100%', paddingLeft: '0px',paddingRight:{xs:'0px' , md:'1ch'} }}
                      label="Value Date for Yearly Report"
                      value={DateTime.fromJSDate(payInfo.selectedTransaction.value_date)}
                      onChange={(value) => handleDateChange(value, "value_date")}
                    />
                  </ThemeProvider>
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={4} sx={{paddingRight:{xs:'0px' , md:'1ch'} }}>
                <TransactionTypeCombo onChanged={(item) => onComboChanged(item, "type")} source={""}
                  selectedItem={{ label: payInfo.selectedTransaction.type === undefined ? "" : payInfo.selectedTransaction.type.toString(), _id: "", description: "" }} />
              </Grid>
              <Grid item xs={12} md={4} sx={{paddingRight:{xs:'0px' , md:'1ch'} }}>
                <TextField fullWidth={true} onChange={handleNumericChange} id="amount" name="amount"
                  type="number"
                  label="Amount" placeholder="Amount" variant="standard"
                  value={payInfo.selectedTransaction?.amount} required
                  helperText="" error={false} InputLabelProps={{ shrink: true }}
                  inputProps={{ max: 1000, min: 1 }} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth={true} onChange={handleChange} id="payment.method" name="payment.method"
                  disabled
                  label="Pay Method" placeholder="Payment Method" variant="standard"
                  value={payInfo.selectedTransaction?.payment.method} required
                  helperText="" error={false} InputLabelProps={{ shrink: true }} />
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
                          value={JSON.stringify(payInfo.recipe)} required
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