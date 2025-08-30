import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, LinearProgress, TextField, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react'

import Item from '../../Components/Item';
import { IExpense } from '../../Interfaces/API/IExpense';
import { EAccountType, IAddTransaction, PaymentMethod, Transaction_OT, Transaction_Type } from '../../Interfaces/API/IClub';
import { IValidationAlertProps, ValidationAlert } from '../../Components/Buttons/TransitionAlert';
import { useClubAddTransactionMutation, useFetchAccountSearchQuery } from '../../features/Account/accountApiSlice';
import { getValidationFromError } from '../../Utils/apiValidation.Parser';
import { MemberType } from '../../Interfaces/API/IMember';
import PaymentMethodCombo from '../../Components/Buttons/PaymentMethodCombo';
import { setProperty } from '../../Utils/setProperty';
import { InputComboItem } from '../../Components/Buttons/ControledCombo';
import TransactionTypeCombo from '../../Components/Buttons/TransactionTypeCombo';
import { QuarterType } from '../../Utils/enums';
interface filter {
  member: string[]
}
export interface CreateTransactionDialogProps {
  value: IExpense | undefined
  onClose: () => void;
  onSave: () => void;
  open: boolean;
}


const newTransaction: IAddTransaction = {
  source: {
    _id: '',
    accountType: ''
  },
  destination: {
    _id: '',
    accountType: ''
  },
  amount: 0,
  engine_fund_amount: 0,
  type: Transaction_Type.DEBIT,
  order: {
    type: Transaction_OT.ORDER,
    _id: "",
    quarter: QuarterType.NONE
  },
  payment: {
    method: PaymentMethod.TRANSFER,
    referance: ""
  },
  description: '',
  date: new Date(),
  supplier: ''
}

function CreateTransactionDialog({ onClose, onSave, open, value, ...other }: CreateTransactionDialogProps) {
  const [accountFilter, setAccountFilter] = useState({})
  const { data: accounts, isLoading: accountLoading, refetch } = useFetchAccountSearchQuery(accountFilter);
  const [selectedTransaction, setSelectedTransaction] = useState<IAddTransaction>(newTransaction);
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [AddTransaction, { isError, isLoading, error, isSuccess: transactionSccuess }] = useClubAddTransactionMutation();

  const handleOnCancel = () => {
    setValidationAlert([])
    if (isSaved)
      onSave()
    else
      onClose()
  }
  useEffect(() => {
    CustomLogger.info("CreateTransactionDialog/accounts", accounts)
  }, [accounts])

  const handleOnValidatiobClose = useCallback(() => {
    setValidationAlert([])
  }, [])

  const handleOnSave = async () => {
    CustomLogger.log("CreateTransactionDialog/onSave", selectedTransaction)
    setValidationAlert([]);

    if (selectedTransaction !== undefined) {
      await AddTransaction(selectedTransaction).unwrap().then((data) => {
        CustomLogger.info("CreateTransactionDialog/onSave/", data);
        if (data.success) {
          setIsSaved(true)
        }
      }).catch((err) => {
        const validation = getValidationFromError(err, handleOnValidatiobClose);
        setValidationAlert(validation);
        CustomLogger.error("CreateTransactionDialog/onSave/error", err.data.errors);
      });
    }
  }
  const getAccountType = (memberType: string): string => {
    /* CustomLogger.info("getTransaction/getAccountType/memberType",memberType , MemberType.Club) */
    /* CustomLogger.info("getTransaction/getAccountType/memberType == MemberType.Club.toString()",memberType,memberType == MemberType.Club.toString()) */

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


  const filterAccount = () => {

    const values: string[] = []
    if (value) {
      values.push(value.source.id)
      values.push(value.destination.id)
      CustomLogger.info("CreateTransactionDialog/filterAccount/values", values)
      const valuesFilter: filter = {
        member: [value.source.id, value.destination.id]
      }
      CustomLogger.info("CreateTransactionDialog/filterAccount/valuesfilter", valuesFilter)
      return valuesFilter;
    }
    return []


  }
  useEffect(() => {
    if (value !== undefined) {
      if (Object.keys(value).length > 0) {
        CustomLogger.info("CreateTransactionDialog/value", value)
        const newTransaction: IAddTransaction = {
          source: {
            _id: value.source.account_id,
            accountType: getAccountType(value.source.type)
          },
          destination: {
            _id: value.destination.account_id,
            accountType: getAccountType(value.destination.type)
          },
          amount: value.amount,
          engine_fund_amount: 0,
          type: Transaction_Type.DEBIT,
          order: {
            type: Transaction_OT.EXPENSE,
            _id: value._id,
            quarter: QuarterType.NONE
          },
          payment: {
            method: PaymentMethod.NONE,
            referance: ""
          },
          description: value.description,
          date: new Date(),
          supplier: value.supplier === undefined ? "Unknown" : value.supplier
        }
        setSelectedTransaction(newTransaction);
        const filter = filterAccount;
        setAccountFilter(filter);
        refetch()
        CustomLogger.info("CreateTransactionDialog/transaction", newTransaction, filter)
      }
    }

  }, [value])
  const SetProperty = (obj: any, path: string, value: any): any => {
    let newObj = { ...obj };
    newObj = setProperty(newObj, path, value);
    CustomLogger.log("CreateTransactionDialog/SetProperty/newobj", newObj)
    return newObj;
  }
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    CustomLogger.log("CreateTransactionDialog/handleChange", event.target.name, event.target.value)
    const newObj: IAddTransaction = SetProperty(selectedTransaction, event.target.name, event.target.value) as IAddTransaction;
    setSelectedTransaction(newObj)
  };
  
  const onComboChanged = (item: InputComboItem, prop: string): void => {
    setSelectedTransaction(setProperty(selectedTransaction, prop, item.label))
    CustomLogger.log("CreateTransactionDialog/onComboChanged/selectedTransaction", selectedTransaction)
  }
  return (
    <Dialog sx={{ '& .MuiDialog-paper': { width: "80%", maxHeight: "auto" } }}
      maxWidth="lg" open={open} {...other}>
      <DialogTitle textAlign={"center"}>Add Expense Transaction</DialogTitle>
      <div>Credit: (-) destination </div>
      <div>Debit:  (+) destination </div>
      <DialogContent>
        <Grid container sx={{ width: "100%" }} justifyContent="center" columns={12}>
          <Grid item xs={12}><Divider /></Grid>
          <Grid item xs={12} sm={6}>
            <Grid container sx={{ width: "100%" }} justifyContent="center" columns={3}>
              <Grid item xs={3}>
                <Typography textAlign={'center'} >Transaction Source</Typography>
              </Grid>
              <Grid item xs={6}><Divider /></Grid>

              <Grid item xs={1}>
                Account
              </Grid>
              <Grid item xs={2}>
                {selectedTransaction.source._id}
              </Grid>
              <Grid item xs={1}>
                Acoount Type
              </Grid>
              <Grid item xs={2}>
                {selectedTransaction.source.accountType}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid container sx={{ width: "100%" }} justifyContent="center" columns={3}>
              <Grid item xs={3}>
                <Typography textAlign={'center'} >Transaction Destination</Typography>
              </Grid>
              <Grid item xs={6}><Divider /></Grid>
              <Grid item xs={1}>
                Account
              </Grid>
              <Grid item xs={2}>
                {selectedTransaction.destination._id}
              </Grid>
              <Grid item xs={1}>
                Account Type
              </Grid>
              <Grid item xs={2}>
                {selectedTransaction.destination.accountType}
              </Grid>
            </Grid>

          </Grid>
          <Grid item xs={12}><Divider /></Grid>
          <Grid item xs={12}>
            <Typography textAlign={'center'} >Transaction description</Typography>
          </Grid>
          <Grid item xs={12}><Divider /></Grid>
          <Grid item xs={12}>
            <Typography textAlign={'center'} >{`Amount: ${selectedTransaction.amount}`}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography textAlign={'center'} >{`Date: ${new Date(selectedTransaction.date).toLocaleDateString()}`}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography textAlign={'center'} >{`Description: ${selectedTransaction.description}`}</Typography>
          </Grid>
          <Grid item xs={12}><Divider /></Grid>
          <Grid item xs={12}>
            <Typography textAlign={'center'} >Payment method</Typography>
          </Grid>
          <Grid item xs={6}>
                <TransactionTypeCombo onChanged={(item) => onComboChanged(item, "type")} source={""}
                  selectedItem={{ label: selectedTransaction.type === undefined ? "" : selectedTransaction.type.toString(), _id: "", description: "" }} />
              </Grid>
          <Grid item xs={6}>
            <PaymentMethodCombo disable={true} onChanged={(item) => onComboChanged(item, "payment.method")} source={""}
              selectedItem={{ label: selectedTransaction.payment.method === undefined ? "" : selectedTransaction.payment.method.toString(), _id: "", description: "" }} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth={true} onChange={handleChange} id="payment.referance" name="payment.referance"
              multiline
              label="Pay Referance" placeholder="Payment Referance" variant="standard"
              value={selectedTransaction?.payment.referance} required
              helperText="" error={false} InputLabelProps={{ shrink: true }} />
          </Grid>

        </Grid>
      </DialogContent>
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

export default CreateTransactionDialog