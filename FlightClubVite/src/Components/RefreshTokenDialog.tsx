import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material'
import { useCallback, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { LOCAL_STORAGE } from '../Enums/localStroage'
import { useRefreshMutation, } from '../features/Auth/authApiSlice'
import { setCredentials } from '../features/Auth/authSlice'
import { ILoginResult, IRefreshToken } from '../Interfaces/API/ILogin'
import { getValidationFromError } from '../Utils/apiValidation.Parser'
import { getFromLocalStorage } from '../Utils/localStorage'
import { IValidationAlertProps, ValidationAlert } from './Buttons/TransitionAlert'
import Item from './Item'
/* import wLogger from '../wLogger' */

export  interface IRefreshDialogProps {
  open: boolean,
  expired: number,
  onClose: (action: boolean) => void
}
function RefreshTokenDialog({open,expired,onClose} : IRefreshDialogProps) {
  /* const logger = wLogger({ logName: "RefreshTokenDialog", level: 'warn' }); 
  logger.warn("Testing winston")  */

  const dispatch = useAppDispatch();
  const login = useAppSelector((state) => state.authSlice);
  const [refresh] = useRefreshMutation()
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const [isSaved,setIsSaved] = useState(false);
 
  const handleOnCancel = (action: boolean) => {
    console.error("Errors from custom logger")
    
    setValidationAlert([])
/*     if(isSaved)
      onSave(value)
    else */
      onClose(action)
  }
  const handleOnValidatiobClose = useCallback(() => {
    setValidationAlert([])

  }, [])
  if(expired < 0){
    CustomLogger.info("RefreshTokenDialog/expired/", expired);
    onClose(true);
  }

  const handleOnSave = async (action: boolean) => {
    
    let refreshProps: IRefreshToken = {
      member_id: login?.member.member_id,
      username: login?.member.username
    }
    await refresh(refreshProps).unwrap().then((payload) => {
      CustomLogger.info("RefreshTokenDialog/onSave/", payload);
      if(payload.data.access_token !== undefined){
        
        
      }

      CustomLogger.info('RefreshTokenDialog/fullfil', payload);
      let loging_info = getFromLocalStorage<ILoginResult>(LOCAL_STORAGE.LOGIN_INFO);
      CustomLogger.info("RefreshTokenDialog/localStorage:before", loging_info);
      dispatch(setCredentials(payload.data));
      /* setLocalStorage<ILoginResult>(LOCAL_STORAGE.LOGIN_INFO, payload.data); */
      loging_info = getFromLocalStorage<ILoginResult>(LOCAL_STORAGE.LOGIN_INFO);

      CustomLogger.info("RefreshTokenDialog/localStorage", loging_info);
      /* navigate(`/${ROUTES.HOME}`); */
      setIsSaved(true)
       onClose(action);
      
    })
    .catch((err) => {
      const validation = getValidationFromError(err, handleOnValidatiobClose);
      setValidationAlert(validation);
      CustomLogger.error("RefreshTokenDialog/onSave/error", err.data.errors);
    })

  }
  return (

    <Dialog open={open}>
      <DialogTitle>{`Loging Expired in ${expired}`}</DialogTitle>
      <DialogContent>Please, press renew or cancle</DialogContent>
      <DialogActions>
      <Grid container sx={{ width: "100%" }} justifyContent="center">
          <Grid item xs={12} md={6} xl={6}>
            <Item><Button variant="outlined" sx={{ width: "100%" }}
              onClick={() => handleOnCancel(isSaved)}>

              {isSaved === true ? "Close ": "Logout"}
            </Button></Item>
          </Grid>
          <Grid item xs={12} md={6} xl={6}>
            <Item><Button variant="outlined" sx={{ width: "100%" } } 
            /* disabled={isSaved === true ? true : false} */
              onClick={() => handleOnSave(true)}>
              {isSaved === true ? "Renewed" : "Renew"}
            </Button></Item>
          </Grid>
          {validationAlert.map((item) => (
            <Grid item xs={12}>
              <Item>

                <ValidationAlert {...item} />
              </Item>
            </Grid>
          ))}
        </Grid>
      </DialogActions>
    </Dialog>
  )
}

export default RefreshTokenDialog