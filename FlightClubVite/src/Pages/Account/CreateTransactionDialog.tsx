import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Fab, Grid, IconButton, LinearProgress, TextField, Tooltip, Typography } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react'

import Item from '../../Components/Item';
import FullScreenLoader from '../../Components/FullScreenLoader';
import { IExpense } from '../../Interfaces/API/IExpense';
import { EAccountType, IAddTransaction, PaymentMethod, Transaction_OT, Transaction_Type } from '../../Interfaces/API/IClub';
import { IValidationAlertProps, ValidationAlert } from '../../Components/Buttons/TransitionAlert';
import { useClubAddTransactionMutation, useFetchAccountSearchQuery } from '../../features/Account/accountApiSlice';
import { getValidationFromError } from '../../Utils/apiValidation.Parser';
import { MemberType } from '../../Interfaces/API/IMember';
import PaymentMethodCombo from '../../Components/Buttons/PaymentMethodCombo';
import { setProperty } from '../../Utils/setProperty';
import { InputComboItem } from '../../Components/Buttons/ControledCombo';
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
  type: Transaction_Type.CREDIT,
  order: {
    type: Transaction_OT.ORDER,
    _id: ""
  },
  payment: {
    method: PaymentMethod.TRANSFER,
    referance: ""
  },
  description: '',
  date: new Date()
}

function CreateTransactionDialog({ onClose, onSave, open, value, ...other }: CreateTransactionDialogProps) {
  const [accountFilter, setAccountFilter] = useState({})
  const { data: accounts, isLoading: accountLoading, refetch } = useFetchAccountSearchQuery(accountFilter);
  const [selectedTransaction, setSelectedTransaction] = useState<IAddTransaction>(newTransaction);
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [AddTransaction, { isError, isLoading, error, isSuccess: transactionSccuess }] = useClubAddTransactionMutation();

  const getAccountId = (id: string): string => {
    const account = accounts?.data?.find((account) => account.account_id == id)
    if (account !== undefined) {
      return account.account_id;
    }
    return "";
  }
  const handleOnCancel = () => {
    setValidationAlert([])
    if (isSaved)
      onSave()
    else
      onClose()
  }
  useEffect(() => {
    console.log("CreateTransactionDialog/accounts", accounts)
  }, [accounts])

  const handleOnValidatiobClose = useCallback(() => {
    setValidationAlert([])

  }, [])

  const handleOnSave = async () => {
    console.log("CreateTransactionDialog/onSave", selectedTransaction)
    setValidationAlert([]);

    if (selectedTransaction !== undefined) {
      await AddTransaction(selectedTransaction).unwrap().then((data) => {
        console.log("CreateTransactionDialog/onSave/", data);
        if (data.success) {
          setIsSaved(true)
        }
      }).catch((err) => {
        const validation = getValidationFromError(err, handleOnValidatiobClose);
        setValidationAlert(validation);
        console.log("CreateTransactionDialog/onSave/error", err.data.errors);
      });
    }
  }
  const getAccountType = (memberType: string): string => {
    /* console.log("getTransaction/getAccountType/memberType",memberType , MemberType.Club) */
    /* console.log("getTransaction/getAccountType/memberType == MemberType.Club.toString()",memberType,memberType == MemberType.Club.toString()) */

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
      console.log("CreateTransactionDialog/filterAccount/values", values)
      const valuesFilter: filter = {
        member: [value.source.id, value.destination.id]
      }
      console.log("CreateTransactionDialog/filterAccount/valuesfilter", valuesFilter)
      return valuesFilter;
    }
    return []


  }
  useEffect(() => {
    if (value !== undefined) {
      if (Object.keys(value).length > 0) {
        console.log("CreateTransactionDialog/value", value)
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
          type: Transaction_Type.CREDIT,
          order: {
            type: Transaction_OT.EXPENSE,
            _id: value._id
          },
          payment: {
            method: PaymentMethod.TRANSFER,
            referance: ""
          },
          description: value.description,
          date: new Date()
        }
        setSelectedTransaction(newTransaction);
        const filter = filterAccount;
        setAccountFilter(filter);
        refetch()
        console.log("CreateTransactionDialog/transaction", newTransaction, filter)
      }
    }

  }, [value])
  const SetProperty = (obj: any, path: string, value: any): any => {
    let newObj = { ...obj };
    newObj = setProperty(newObj, path, value);
    console.log("CreateTransactionDialog/SetProperty/newobj", newObj)
    return newObj;
  }
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("CreateTransactionDialog/handleChange", event.target.name, event.target.value)
    const newObj: IAddTransaction = SetProperty(selectedTransaction, event.target.name, event.target.value) as IAddTransaction;

    setSelectedTransaction(newObj)
  };
  const onComboChanged = (item: InputComboItem, prop: string): void => {
    setSelectedTransaction(setProperty(selectedTransaction, prop, item.lable))

    console.log("CreateTransactionDialog/onComboChanged/selectedTransaction", selectedTransaction)
  }
  return (
    <Dialog sx={{ '& .MuiDialog-paper': { width: "80%", maxHeight: "auto" } }}
      maxWidth="lg" open={open} {...other}>
      <DialogTitle textAlign={"center"}>Add Expense Transaction</DialogTitle>
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
            <PaymentMethodCombo onChanged={(item) => onComboChanged(item, "payment.method")} source={""}
              selectedItem={{ lable: selectedTransaction.payment.method === undefined ? "" : selectedTransaction.payment.method.toString(), _id: "", description: "" }} />
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