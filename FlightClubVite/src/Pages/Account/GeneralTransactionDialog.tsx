import '../../Types/Number.extensions'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, LinearProgress, TextField, ThemeProvider, useTheme } from '@mui/material';
import { useCallback, useEffect, useState } from 'react'
import ClubAccountsCombo from '../../Components/Accounts/ClubAccountsCombo';
import { InputComboItem } from '../../Components/Buttons/ControledCombo';
import { IValidationAlertProps, ValidationAlert } from '../../Components/Buttons/TransitionAlert';
import Item from '../../Components/Item';
import { useClubAccountQuery, useClubAddTransactionTypeMutation } from '../../features/Account/accountApiSlice';
import { EAccountType, IAddTransaction, IClubAccount, PaymentMethod, Transaction_OT, Transaction_Type } from '../../Interfaces/API/IClub';
import { IExpenseBase } from '../../Interfaces/API/IExpense';
import { setProperty } from '../../Utils/setProperty';
import { getValidationFromError } from '../../Utils/apiValidation.Parser';
import FullScreenLoader from '../../Components/FullScreenLoader';
import { MemberType } from '../../Interfaces/API/IMember';
import TransactionTypeCombo from '../../Components/Buttons/TransactionTypeCombo';
import { LocalizationProvider, MobileDatePicker, MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DateTime } from 'luxon';
import Transaction_OTCombo from '../../Components/Buttons/Transaction_OTCombo';
import { QuarterType } from '../../Utils/enums';

export interface GeneralTransactionDialogProps {

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
  engine_fund_amount: Number("0"),
  type: Transaction_Type.CREDIT,
  order: {
    type: Transaction_OT.OTHER,
    _id: '',
    quarter: QuarterType.NONE
  },
  payment: {
    method: PaymentMethod.NONE,
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

function GeneralTransactionDialog({ onClose, onSave, open, ...other }: GeneralTransactionDialogProps) {
  const theme = useTheme()
  const [selectedTransaction, setSelectedTransaction] = useState<IAddTransaction>(newTransaction);
  const [AddTransaction, { isError, isLoading, error, isSuccess: transactionSccuess }] = useClubAddTransactionTypeMutation();
  const { data: bankAccounts, isLoading: isQuery } = useClubAccountQuery(true);
  const [bank, setBank] = useState<IClubAccount | undefined>();

  const [selectedSource, setSelectedSource] = useState<InputComboItem>()
  const [selectedDestination, setSelectedDestination] = useState<InputComboItem>()

  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const [isSaved, setIsSaved] = useState(false);

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
     engine_fund_amount: selectedTransaction.engine_fund_amount,
      order: {
        type: selectedTransaction.order.type,
        _id: '',
        quarter: QuarterType.NONE
      },
      payment: {
        method: PaymentMethod.NONE,
        referance: selectedTransaction.payment.referance
      },
      description: selectedTransaction.description,
      date: selectedTransaction.date
    }
    CustomLogger.log("GeneralTransactionDialog/UpdateSourceAccountFields/selectedSource", selectedSource, selectedDestination)
    CustomLogger.log("GeneralTransactionDialog/UpdateSourceAccountFields/newobj", newObj)
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
    CustomLogger.log("GeneralTransactionDialog/onSave", selectedTransaction)
    setValidationAlert([]);
    const transaction = UpdateSourceAccountFields()
    if (transaction !== undefined) {
      CustomLogger.log("GeneralTransactionDialog/transaction", transaction);
      await AddTransaction(transaction).unwrap().then((data) => {
        CustomLogger.info("GeneralTransactionDialog/onSave/", data);
        if (data.success) {
          setIsSaved(true)
        }
      }).catch((err) => {
        const validation = getValidationFromError(err, handleOnValidatiobClose);
        setValidationAlert(validation);
        CustomLogger.error("GeneralTransactionDialog/onSave/error", err.data.errors);
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

    return <ClubAccountsCombo title={"Source"} selectedItem={selectedSource} onChanged={onSelectedSource} source={"_GeneralTransactionDialogs/Source"} includesType={[MemberType.Club]}/>
  }
  const RenderDestination = (): JSX.Element => {

    return <ClubAccountsCombo title={"Destination"} selectedItem={selectedDestination} onChanged={OnselectedDestination} source={"_CreateExspense/Destination"} filter={{}} includesType={[MemberType.Member,MemberType.Supplier]} />

  }

  const handleNumericChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    CustomLogger.log("GeneralTransactionDialog/handleChange", event.target.name, event.target.value)

    if (event.target.name = "amount") {
      event.target.value = Math.abs(Number(event.target.value)).toString()
    }
    const newObj: IAddTransaction = SetProperty(selectedTransaction, event.target.name, event.target.value) as IAddTransaction;

    setSelectedTransaction(newObj)
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    CustomLogger.log("GeneralTransactionDialog/handleChange", event.target.name, event.target.value)
    const newObj: IAddTransaction = SetProperty(selectedTransaction, event.target.name, event.target.value) as IAddTransaction;
    setSelectedTransaction(newObj)
    
  };
  const SetProperty = (obj: any, path: string, value: any): any => {
    let newObj = { ...obj };
    newObj = setProperty(newObj, path, value);
    CustomLogger.log("GeneralTransactionDialog/SetProperty/newobj", newObj)
    return newObj;
  }
  const onComboChanged = (item: InputComboItem, prop: string): void => {
    setSelectedTransaction(setProperty(selectedTransaction, prop, item.lable))
    CustomLogger.log("GeneralTransactionDialog/onComboChanged/selectedTransaction", selectedTransaction)
  }
  const handleDateChange = (newValue: DateTime | null) => {
    CustomLogger.info("GeneralTransactionDialog/handleDateChange", newValue)
    let newDate = newValue?.toJSDate() === undefined ? new Date() : newValue?.toJSDate();
    newDate.setSeconds(0, 0);
    const newObj = setProperty(selectedTransaction, "date", newDate)
    setSelectedTransaction(newObj)
  };
  return (

    <Dialog
      sx={{ '& .MuiDialog-paper': { width: "80%", maxHeight: "auto" } }}
      maxWidth="lg" open={open} {...other}>
      <DialogTitle>Create Transaction</DialogTitle>
      <div>Credit: (-) destination </div>
      <div>Debit:  (+) destination </div>
      {(isQuery && isLoading) ? (
        <>
          <FullScreenLoader />
        </>
      ) : (
        <>
          <DialogContent>
            <Grid container sx={{ width: "100%" }} justifyContent="center" columns={12}>
              <Grid item xs={12} sm={6}  >
                {RenderSource()}
              </Grid >
              <Grid item xs={12} sm={6}>
                {RenderDestination()}
              </Grid>
              <Grid item sx={{ marginLeft: "",marginTop:"0.6rem", paddingLeft: "0.2rem" ,paddingBottom:"1.2rem"}} xs={12} md={3}>
                <LocalizationProvider adapterLocale={"en-gb"} dateAdapter={AdapterLuxon}>
                  <ThemeProvider theme={theme}>
                    <MobileDateTimePicker
                      sx={{ width: '100%', paddingRight:{xs:'0px' , md:'1ch'}}}
                      label="Date"
                      value={DateTime.fromJSDate(selectedTransaction.date)}
                      onChange={handleDateChange}
                    />
                  </ThemeProvider>
                </LocalizationProvider>
              </Grid>
              <Grid item sx={{ marginLeft: "0px",marginTop:"0.6rem" ,paddingRight:{xs:'0px' , md:'1ch'}}} xs={12} md={3}>
                <TransactionTypeCombo onChanged={(item) => onComboChanged(item, "type")} source={""}
                  selectedItem={{ lable: selectedTransaction.type === undefined ? "" : selectedTransaction.type.toString(), _id: "", description: "" }} />
              </Grid>
              <Grid item sx={{ marginLeft: "0px",marginTop:"0.6rem",paddingRight:{xs:'0px' , md:'1ch'} }} xs={12} md={3}>
                <Transaction_OTCombo onChanged={(item) => onComboChanged(item, "order.type")} source={""}
                  selectedItem={{ lable: selectedTransaction.order.type === undefined ? "" : selectedTransaction.order.type.toString(), _id: "", description: "" }} />
              </Grid>
              <Grid item  sx={{ marginLeft: "0px", marginTop:"0.6rem" }} xs={12} md={3}>
                <TextField fullWidth={true} onChange={handleNumericChange} id="amount" name="amount"
                  type="number"
                  label="Amount" placeholder="Amount" variant="standard"
                  value={selectedTransaction?.amount} required
                  helperText="" error={false} InputLabelProps={{ shrink: true }}
                  inputProps={{ max: 10000000, min: 1 }} />
              </Grid>
              <Grid item xs={12} >
                <TextField fullWidth={true} onChange={handleChange} id="description" name="description"
                  multiline
                  label="Description" placeholder="Expense Description" variant="standard"
                  value={selectedTransaction?.description} required
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
                  {isSaved === true ? "Created" : "Create"}
                </Button></Item>
              </Grid></>
          )}
        </Grid>
      </DialogActions>
    </Dialog>
  )
}

export default GeneralTransactionDialog