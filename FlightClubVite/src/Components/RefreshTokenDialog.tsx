import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { LOCAL_STORAGE } from '../Enums/localStroage'
import { useRefreshMutation, } from '../features/Auth/authApiSlice'
import { setCredentials } from '../features/Auth/authSlice'
import { ILoginResult, IRefreshToken } from '../Interfaces/API/ILogin'
import { getValidationFromError } from '../Utils/apiValidation.Parser'
import { getFromLocalStorage } from '../Utils/localStorage'
import { IValidationAlertProps, ValidationAlert } from './Buttons/TransitionAlert'
import Item from './Item'

import { logOut } from '../features/Auth/authSlice';
export  interface IRefreshDialogProps {
  open: boolean,
  expired: number,
  onClose: (action: boolean) => void
}
function RefreshTokenDialog({open,expired,onClose} : IRefreshDialogProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/home" } };
  const login = useAppSelector((state) => state.authSlice);
  const [refresh] = useRefreshMutation()
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const [isSaved,setIsSaved] = useState(false);

  const handleOnCancel = () => {
    setValidationAlert([])
/*     if(isSaved)
      onSave(value)
    else */
      onClose(false)
  }
  const handleOnValidatiobClose = useCallback(() => {
    setValidationAlert([])

  }, [])
  if(expired < 0){
    console.log("RefreshTokenDialog/expired/", expired);
    onClose(true);
  }
  const handleOnSave = async () => {
    
    let refreshProps: IRefreshToken = {
      member_id: login?.member.member_id,
      username: login?.member.username
    }

    await refresh(refreshProps).unwrap().then((payload) => {
      console.log("RefreshTokenDialog/onSave/", payload);
      if(payload.data.access_token !== undefined){
        
        
      }

      console.log('RefreshTokenDialog/fullfil', payload);
      let loging_info = getFromLocalStorage<ILoginResult>(LOCAL_STORAGE.LOGIN_INFO);
      console.log("RefreshTokenDialog/localStorage:before", loging_info);
      dispatch(setCredentials(payload.data));
      /* setLocalStorage<ILoginResult>(LOCAL_STORAGE.LOGIN_INFO, payload.data); */
      loging_info = getFromLocalStorage<ILoginResult>(LOCAL_STORAGE.LOGIN_INFO);

      console.log("RefreshTokenDialog/localStorage", loging_info);
      /* navigate(`/${ROUTES.HOME}`); */
      
   onClose(true);
      
    })
    .catch((err) => {
      const validation = getValidationFromError(err, handleOnValidatiobClose);
      setValidationAlert(validation);
      console.log("RefreshTokenDialog/onSave/error", err.data.errors);
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
              onClick={handleOnCancel}>

              {isSaved === true ? "Close ": "Cancle"}
            </Button></Item>
          </Grid>
          <Grid item xs={12} md={6} xl={6}>
            <Item><Button variant="outlined" sx={{ width: "100%" } } 
            disabled={isSaved === true ? true : false}
              onClick={handleOnSave}>
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