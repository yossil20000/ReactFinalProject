import { Check } from '@mui/icons-material';
import { Box, CircularProgress, Fab, Tooltip } from '@mui/material';
import { green } from '@mui/material/colors';
import { useEffect, useState } from 'react';
import { IOrder, OrderStatus } from '../../Interfaces/API/IAccount';
import PaymentIcon from '@mui/icons-material/Payment';
import PaidIcon from '@mui/icons-material/Paid';
import Delete from '@mui/icons-material/Delete';
import { IAddTransaction } from '../../Interfaces/API/IClub';
import { useClubAddOrderTransactionMutation, useDeleteOrderMutation } from '../../features/Account/accountApiSlice';
import { getValidationFromError } from '../../Utils/apiValidation.Parser';
import { IValidationAlertProps } from '../Buttons/TransitionAlert';
import ErrorDialog from '../ErrorDialog';
import ConfirmationDialog, { ConfirmationDialogProps } from '../ConfirmationDialog';
export interface ITransactionActionProps {
  params: any;
  rowId: string | null;
  setRowId: React.Dispatch<React.SetStateAction<string | null>>
  transaction: IAddTransaction
  orderId?: string
}
export default function TransactionAction(props: ITransactionActionProps) {
  const { rowId, setRowId, params, transaction, orderId } = props;
  const { id, _idMember, amount } = params.row;
  const [isloading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [confirmation,setConfirmation] =useState<ConfirmationDialogProps>({open: false} as ConfirmationDialogProps);
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([])
  const [AddTransaction, { isError, isLoading, error, isSuccess: transactionSccuess }] = useClubAddOrderTransactionMutation();
  const [deleteOrder, { isError: deleteIsError, isLoading: deleteIsLoading, error: deleteError, isSuccess: deleteSccuess }] = useDeleteOrderMutation();
  /*  console.log("TransactionAction/params",id,_idMember,rowId) */
  const handleConfirmation = (action: string) => {
    console.log("TransactionAction/handleConfirmation/",action)
    if(action == "ADD_TRANSACTION"){
      setConfirmation((prev) => ({...prev,
        open: true,action: "ADD_TRASACTION",content:"Please confirm \n Add Transaction operation", title: "Confirmation",
        onClose: onConfirmationClose }))
      console.log("TransactionAction/handleConfirmation/ADD_TRASACTION",confirmation)
    }
    else if(action === "DELETE_ORDER"){
      setConfirmation((prev) => ({...prev,
        open: true,action: "DELETE_ORDER",content:"Please, press Confirm to Delete item", title: "Confirmation",
        onClose: onConfirmationClose }))
      console.log("TransactionAction/handleConfirmation/DELETE_ORDER",confirmation)
    }

  }
  const onConfirmationClose = (value: boolean,action: string) => {
    setConfirmation((prev) => ({...prev, open: false}))
    console.log("TransactionAction/onConfirmationClose",confirmation)
    if(value){
      if(action === "DELETE_ORDER")
        handleDelete()
    }
  }
  const handleTransaction = async () => {
    console.log("TransactionAction/handleTransaction", id, params, transaction)
    setIsLoading(true);
    const result: boolean = true;
    await AddTransaction(transaction).unwrap().then((data) => {
      console.log("TransactionAction/handleTransaction/data", data)
      if (data.success === false) {
        const validation = getValidationFromError(data.errors, (): void => { });
        setValidationAlert(validation);
        setOpenError(true);
        return;
      }
      setIsSuccess(true);
      setIsLoading(false)
    }).catch((err) => {
      const validation = getValidationFromError(err, (): void => { });
      setValidationAlert(validation);
      setOpenError(true);
      setIsLoading(false)
      return;
    });
  }
  const handleDelete = async () => {
    console.log("TransactionAction/handleDelete", id, params, transaction)

    const result: boolean = true;
    if (orderId !== undefined) {
      
      setIsLoading(true);
      await deleteOrder(orderId).unwrap().then((data) => {
        console.log("TransactionAction/handleDelete/data", data)
        if (data.success === false) {
          setIsSuccess(false);
          const validation = getValidationFromError(data.errors, (): void => { });
          setValidationAlert(validation);
          setOpenError(true);
          return;
        }
        setIsLoading(false)
        setIsSuccess(true);
      }).catch((err) => {
        setIsLoading(false)
        setIsSuccess(false);
        const validation = getValidationFromError(err, (): void => { });
        setValidationAlert(validation);
        setOpenError(true);
        return;
      });
    }


  }

  useEffect(() => {
    if (rowId === params.id && isSuccess) setIsSuccess(false)
  }, [rowId])

  return (
    <Box  >
      {confirmation.open === true ? (<ConfirmationDialog title={confirmation.title} content={confirmation.content}
      open={confirmation.open} action={confirmation.action} keepMounted={confirmation.keepMounted}
      onClose={onConfirmationClose} />
      ): null}
      {openError === true ? (<ErrorDialog setOpen={setOpenError} open={openError} validationAlert={validationAlert} />) : null}
      {
        params.row.status.toString() === OrderStatus.CLOSE &&
        (
          <Fab color='primary' sx={{ width: 40, height: 40, backgroundColor: green[500], '&:hover': { bgcolor: green[700] }, }}>
            <Tooltip title={"Transaction Done"}>
              <PaidIcon />
            </Tooltip>
          </Fab>
        )
      }
      {(isSuccess == true && isloading == false) &&
        (
          <Fab color='primary' sx={{ width: 40, height: 40, backgroundColor: green[500], '&:hover': { bgcolor: green[700] }, }}>
            <Tooltip title={"Transaction Done"}>
              <Check />
            </Tooltip>
          </Fab>
        )
      }
      {params.row.status !== OrderStatus.CLOSE && isSuccess == false && isloading == false &&
        (
          <>
            {orderId === undefined ? (<></>) : (
              <Fab color='primary' sx={{ width: 40, height: 40 }} disabled={/* params.id !== rowId */ isSuccess || isloading} onClick={() => handleConfirmation("DELETE_ORDER")} >
                <Tooltip title={"Delete Order"}>
                  <Delete />
                </Tooltip>
              </Fab>
            )}

            <Fab color='primary' sx={{ width: 40, height: 40 }} disabled={/* params.id !== rowId */ isSuccess || isloading} onClick={() => handleConfirmation("ADD_TRANSACTION")} >
              <Tooltip title={"Place Transaction"}>
                <PaymentIcon />
              </Tooltip>

            </Fab>
          </>
        )
      }
      {isloading == true &&
        (
          <CircularProgress size={40} sx={{ color: green[500], zIndex: 1 }} />
        )
      }
    </Box>
  )

}