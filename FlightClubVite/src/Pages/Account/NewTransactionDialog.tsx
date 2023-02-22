import '../../Types/Number.extensions'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, LinearProgress, TextField } from '@mui/material';
import { useCallback, useState } from 'react'
import ClubAccountsCombo from '../../Components/Accounts/ClubAccountsCombo';
import { InputComboItem } from '../../Components/Buttons/ControledCombo';
import { IValidationAlertProps, ValidationAlert } from '../../Components/Buttons/TransitionAlert';
import TypesCombo from '../../Components/Buttons/TypesCombo';
import Item from '../../Components/Item';
import { useCreateExpenseMutation, useClubAccountQuery, useClubAddTransactionMutation } from '../../features/Account/accountApiSlice';
import { EAccountType, IAddTransaction, IClubAccount, PaymentMethod, Transaction_OT, Transaction_Type } from '../../Interfaces/API/IClub';
import { IExpenseBase, IUpsertExpanse, newExpense, Utilizated } from '../../Interfaces/API/IExpense';
import { setProperty } from '../../Utils/setProperty';
import { getValidationFromError } from '../../Utils/apiValidation.Parser';
import FullScreenLoader from '../../Components/FullScreenLoader';
import UtilizatedCombo from '../../Components/Buttons/UtilizatedCombo';
import PaymentMethodCombo from '../../Components/Buttons/PaymentMethodCombo';
import { MemberType } from '../../Interfaces/API/IMember';
export interface NewTransactionDialogProps {

  onClose: () => void;
  onSave: (value: IExpenseBase) => void;
  open: boolean;
}
let newTransaction : IAddTransaction={
  source: {
    _id: "",
    accountType: ""
  },
  destination: {
    _id:"" ,
    accountType: "" 
  },
  amount: Number("-1"),
  type: Transaction_Type.TRANSFER,
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
  /* console.log("getTransaction/getAccountType/memberType",memberType , MemberType.Club) */
  /* console.log("getTransaction/getAccountType/memberType == MemberType.Club.toString()",memberType,memberType == MemberType.Club.toString()) */
 if(memberType === undefined){
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

function NewTransactionDialog({ onClose, onSave, open, ...other }: NewTransactionDialogProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<IAddTransaction>(newTransaction);
  const [AddTransaction, { isError, isLoading, error, isSuccess: transactionSccuess }] = useClubAddTransactionMutation();
  const { data: bankAccounts, isLoading: isQuery } = useClubAccountQuery();
  const [bank, setBank] = useState<IClubAccount | undefined>();

  const [selectedSource, setSelectedSource] = useState<InputComboItem>()
  const [selectedDestination, setSelectedDestination] = useState<InputComboItem>()
  
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const UpdateSourceAccountFields = (): IAddTransaction => {
    let newObj : IAddTransaction = selectedTransaction
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
        type: Transaction_OT.TRANSFER,
        _id: ''
      },
      payment: {
        method: PaymentMethod.TRANSFER,
        referance: selectedTransaction.payment.referance
      },
      description: selectedTransaction.description,
      date: new Date()
    }
    console.log("NewTransactionDialog/UpdateSourceAccountFields/selectedSource", selectedSource, selectedDestination)
    console.log("NewTransactionDialog/UpdateSourceAccountFields/newobj", newObj)
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
    console.log("NewTransactionDialog/onSave", selectedTransaction)
    setValidationAlert([]);
 const transaction = UpdateSourceAccountFields()
    if (transaction !== undefined) {
      await AddTransaction(transaction).unwrap().then((data) => {
        console.log("NewTransactionDialog/onSave/", data);
        if (data.success) {
          setIsSaved(true)
        }
      }).catch((err) => {
        const validation = getValidationFromError(err, handleOnValidatiobClose);
        setValidationAlert(validation);
        console.log("NewTransactionDialog/onSave/error", err.data.errors);
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

    return <ClubAccountsCombo title={"Source"} selectedItem={selectedSource} onChanged={onSelectedSource} source={"_NewTransactions/Source"} />
  }
  const RenderDestination = (): JSX.Element => {

    return <ClubAccountsCombo title={"Destination"} selectedItem={selectedDestination} onChanged={OnselectedDestination} source={"_CreateExspense/Destination"} filter={{}} />

  }

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    
    console.log("NewTransaction/handleNumberChange", event.target.name, event.target.value)
    const number : number = Number(event.target.value)/10
    if(isNaN(number)) return;
    const newObj: IAddTransaction = SetProperty(selectedTransaction, event.target.name, number) as IAddTransaction;
    
    setSelectedTransaction(newObj)
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    
    console.log("NewTransaction/handleChange", event.target.name, event.target.value)
    const newObj: IAddTransaction = SetProperty(selectedTransaction, event.target.name, event.target.value) as IAddTransaction;

    setSelectedTransaction(newObj)
  };
  const SetProperty = (obj: any, path: string, value: any): any => {
    let newObj = { ...obj };
    newObj = setProperty(newObj, path, value);
    console.log("NewTransaction/SetProperty/newobj", newObj)
    return newObj;
  }
  const onComboChanged = (item: InputComboItem, prop: string): void => {
    setSelectedTransaction(setProperty(selectedTransaction, prop, item.lable))

    console.log("CNewTransactionDialog/onComboChanged/selectedTransaction", selectedTransaction)
  }
  return (

    <Dialog
      sx={{ '& .MuiDialog-paper': { width: "80%", maxHeight: "auto" } }}
      maxWidth="lg" open={open} {...other}>
      <DialogTitle>Create Transaction</DialogTitle>
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
              <Grid item xs={6}>
              <TextField fullWidth={true} onChange={handleChange} id="payment.referance" name="payment.referance"
              disabled
              label="Pay Method" placeholder="Payment Method" variant="standard"
              value={selectedTransaction?.payment.method} required
              helperText="" error={false} InputLabelProps={{ shrink: true }} />
            </Grid>
          <Grid item xs={6}>
            <TextField fullWidth={true} onChange={handleChange} id="payment.referance" name="payment.referance"
              multiline
              label="Pay Referance" placeholder="Payment Referance" variant="standard"
              value={selectedTransaction?.payment.referance} required
              helperText="" error={false} InputLabelProps={{ shrink: true }} />
          </Grid>
              <Grid item xs={6}>
                <TextField fullWidth={true} onChange={handleChange} id="amount" name="amount"
                  
                  type="number"
                  label="Amount" placeholder="Amount" variant="standard"
                  value={selectedTransaction?.amount} required
                  helperText="" error={false} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12}>
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

export default NewTransactionDialog