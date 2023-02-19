import { Check, Save } from '@mui/icons-material';
import { Box, CircularProgress, Fab, Tooltip } from '@mui/material';
import { green } from '@mui/material/colors';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { OrderStatus } from '../../Interfaces/API/IAccount';
import PaymentIcon from '@mui/icons-material/Payment';
import PaidIcon from '@mui/icons-material/Paid';
import { EAccountType, IAddTransaction, IClubAccountCombo } from '../../Interfaces/API/IClub';
import { useClubAddOrderTransactionMutation } from '../../features/Account/accountApiSlice';
import { getValidationFromError } from '../../Utils/apiValidation.Parser';
import { IValidationAlertProps } from '../Buttons/TransitionAlert';
import ErrorDialog from '../ErrorDialog';
export interface ITransactionActionProps {
  params: any;
  rowId: string | null;
  setRowId: React.Dispatch<React.SetStateAction<string | null>>
  transaction: IAddTransaction
}
export default function TransactionAction(props: ITransactionActionProps) {
  const { rowId, setRowId, params,transaction } = props;
  const { id, _idMember ,amount} = params.row;
  const [isloading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [validationAlert,setValidationAlert] = useState<IValidationAlertProps[]>([])
  const [AddTransaction, { isError, isLoading, error, isSuccess: transactionSccuess }] = useClubAddOrderTransactionMutation();
  
  /*  console.log("TransactionAction/params",id,_idMember,rowId) */

  const handleTransaction = async () => {
    console.log("TransactionAction/handleTransaction", id, params,transaction)
    setIsLoading(true);
    const result: boolean = true;
    await AddTransaction(transaction).unwrap().then((data) => {
      console.log("TransactionAction/handleTransaction/data", data)
      if (data.success === false) {
        const validation = getValidationFromError(data.errors, () : void =>{});
        setValidationAlert(validation);
        setOpenError(true);
        return;
      }
    }).catch((err) => {
      const validation = getValidationFromError(err, () : void =>{});
      setValidationAlert(validation);
      setOpenError(true);
      return;
    });
    
    setInterval(() => {
      if (result) {
        
        setIsSuccess(true);
        setRowId(null);

      }
      setIsLoading(false)
    }, 2000)

    /* setIsLoading(false) */
  }

  useEffect(() => {
    if (rowId === params.id && isSuccess) setIsSuccess(false)
  }, [rowId])

  return (
    <Box  >
      {openError === true ? (<ErrorDialog setOpen={setOpenError} open={openError} validationAlert={validationAlert}/>) : null}
      {
        params.row.status.toString() === OrderStatus.CLOSE  &&
        (
          <Fab color='primary' sx={{ width: 40, height: 40, backgroundColor: green[500], '&:hover': { bgcolor: green[700] }, }}>
            <Tooltip title={"Transaction Done"}>
              <PaidIcon />
            </Tooltip>
          </Fab>
        )
      }
       { ( isSuccess == true && isloading == false) &&
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
          <Fab color='primary' sx={{ width: 40, height: 40 }} disabled={/* params.id !== rowId */ isSuccess || isloading} onClick={handleTransaction} >
            <Tooltip title={"Place Transaction"}>
              <PaymentIcon />
            </Tooltip>

          </Fab>
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