import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Fab, Grid, IconButton, LinearProgress, TextField, Tooltip } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react'

import Item from '../../Components/Item';
import FullScreenLoader from '../../Components/FullScreenLoader';
import { IExpense } from '../../Interfaces/API/IExpense';
import { EAccountType, IAddTransaction } from '../../Interfaces/API/IClub';
import { IValidationAlertProps, ValidationAlert } from '../../Components/Buttons/TransitionAlert';
import { useClubAddTransactionMutation, useFetchAccountSearchQuery } from '../../features/Account/accountApiSlice';
import { getValidationFromError } from '../../Utils/apiValidation.Parser';
import { MemberType } from '../../Interfaces/API/IMember';
interface filter {
  member: string[]
}
export interface CreateTransactionDialogProps {
  value: IExpense
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
  order: '',
  description: '',
  date: new Date()
}

function CreateTransactionDialog({ onClose, onSave, open, value, ...other }: CreateTransactionDialogProps) {
  const [accountFilter, setAccountFilter] = useState({})
  const { data: accounts, isLoading: accountLoading,refetch} = useFetchAccountSearchQuery(accountFilter);
  const [selectedTransaction, setSelectedTransaction] = useState<IAddTransaction>(newTransaction);
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [AddTransaction, { isError, isLoading, error, isSuccess: transactionSccuess }] = useClubAddTransactionMutation();
  
  const getAccountId = (id: string) : string => {
    const account = accounts?.data?.find((account) => account.account_id == id)
    if(account !== undefined){
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
  },[accounts])

  const handleOnValidatiobClose = useCallback(() => {
    setValidationAlert([])

  }, [])

  const handleOnSave = async () => {
    console.log("CreateTransactionDialog/onSave", selectedTransaction)
    setValidationAlert([]);

    if (selectedTransaction !== undefined) {
      await AddTransaction(selectedTransaction).unwrap().then((data) => {
        console.log("CreateExspenseDialog/onSave/", data);
        if (data.success) {
          setIsSaved(true)
        }
      }).catch((err) => {
        const validation = getValidationFromError(err, handleOnValidatiobClose);
        setValidationAlert(validation);
        console.log("CreateExspenseDialog/onSave/error", err.data.errors);
      });
    }
  }
  const getAccountType = (memberType: MemberType) : string =>
  {
    switch(memberType){
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
  
  const filterAccount = ()=> {
    
    const values : string[] = []
    values.push(value.source.id)
    values.push(value.destination.id)
    console.log("getTransaction/values",values)
    const valuesFilter : filter = {
      member: [value.source.id,value.destination.id]
    }
    console.log("getTransaction/valuesfilter",valuesFilter)

    return valuesFilter;
  }
  useEffect(() => {
    if (value !== undefined || Object.keys(value).length > 0) {

      console.log("getTransaction/value",value)
      const newTransaction: IAddTransaction = {
        source: {
          _id: value.source.account_id,
          accountType: getAccountType(value.source.type)
        },
        destination: {
          _id: value.destination.display,
          accountType: getAccountType(value.destination.type)
        },
        amount: value.amount,
        order: '',
        description: value.description,
        date: new Date()
      }
      setSelectedTransaction(newTransaction);
      const filter = filterAccount;
      setAccountFilter(filter);
      refetch()
    console.log("getTransaction/transaction",newTransaction,filter)
    }
    
  }, [value])
  return (
    <Dialog sx={{ '& .MuiDialog-paper': { width: "80%", maxHeight: "auto" } }}
      maxWidth="lg" open={open} {...other}>
      <DialogTitle textAlign={"center"}>Add Expense Transaction</DialogTitle>
      <DialogContent>
        <Grid container sx={{ width: "100%" }} justifyContent="center" columns={12}>

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