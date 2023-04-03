import { Check } from '@mui/icons-material';
import { Box, CircularProgress, Fab, Tooltip } from '@mui/material';
import { green } from '@mui/material/colors';

import { useEffect, useState } from 'react';
import { OrderStatus } from '../../Interfaces/API/IAccount';
import PaymentIcon from '@mui/icons-material/Payment';
import PaidIcon from '@mui/icons-material/Paid';

import ErrorDialog from '../../Components/ErrorDialog';
import { IValidationAlertProps } from '../../Components/Buttons/TransitionAlert';
import IReservation from '../../Interfaces/API/IReservation';
import { useDeleteReservationMutation, useUpdateReservationMutation } from '../../features/Reservations/reservationsApiSlice';
export interface IReservationActionProps {
  params: any;
  rowId: string | null;
  setRowId: React.Dispatch<React.SetStateAction<string | null>>
  reservation: IReservation
}
export default function ReservationAction(props: IReservationActionProps) {
  const { rowId, setRowId, params,reservation } = props;
  const { id, _idMember ,amount} = params.row;
  const [isloading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [validationAlert,setValidationAlert] = useState<IValidationAlertProps[]>([])
  const [updateReservation, { isError: isUpdateError, isLoading: updateLoading, error: updateError, isSuccess: updateSccuess }] = useUpdateReservationMutation();
  const [deleteReservation, { isError: isDeleteError, isLoading: deleteLoading, error: deleteError, isSuccess: deleteSccuess }] = useDeleteReservationMutation();
  
  /*  CustomLogger.info("ReservationAction/params",id,_idMember,rowId) */

  const handleReservation = async () => {
    CustomLogger.log("ReservationAction/handleReservation", id, params,reservation)
    setIsLoading(true);
    const result: boolean = true;
    setInterval(() => {
      if (result) {
        setIsSuccess(true);
        setRowId(null);
      }
      setIsLoading(false)
    }, 2000)
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
            <Tooltip title={"Reservation Done"}>
              <PaidIcon />
            </Tooltip>
          </Fab>
        )
      }
       { ( isSuccess == true && isloading == false) &&
        (
          <Fab color='primary' sx={{ width: 40, height: 40, backgroundColor: green[500], '&:hover': { bgcolor: green[700] }, }}>
            <Tooltip title={"Reservation Done"}>
              <Check />
            </Tooltip>
          </Fab>
        )
      }
      {params.row.status !== OrderStatus.CLOSE && isSuccess == false && isloading == false &&
        (
          <Fab color='primary' sx={{ width: 40, height: 40 }} disabled={/* params.id !== rowId */ isSuccess || isloading} onClick={handleReservation} >
            <Tooltip title={"Place Reservation"}>
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