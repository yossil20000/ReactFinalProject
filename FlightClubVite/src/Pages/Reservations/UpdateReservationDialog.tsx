import { ThemeProvider } from "@emotion/react";
import { Dialog, DialogTitle, DialogContent, Grid, TextField, Button, createTheme, Paper, styled, CircularProgress } from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import TransitionAlert, { ITransitionAlrertProps, IValidationAlertProps, ValidationAlert } from "../../Components/Buttons/TransitionAlert";
import { useUpdateReservationMutation } from "../../features/Reservations/reservationsApiSlice";
import { IReservationUpdate, ReservationUpdate } from "../../Interfaces/API/IReservation";
import { getValidationFromError } from "../../Utils/apiValidation.Parser";

export interface UpdateReservationDialogProps {
  value: IReservationUpdate;
  onClose: () => void;
  onSave: (value: IReservationUpdate) => void;
  open: boolean;
}
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
const defaultMaterialThem = createTheme({

})
let transitionAlertInitial : ITransitionAlrertProps ={
  severity: "error",
  alertTitle: "Error",
  alertMessage: "Unknown Error",
  open: false,
  onClose: () => {}
}
function UpdateReservationDialog({value,onClose,onSave,open,...other}: UpdateReservationDialogProps) {
  
  console.log("UpdateReserationDialog/value", value)
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const [updateReservation,{isError,isLoading,error,isSuccess}] = useUpdateReservationMutation();
  const [reservationUpdate,setReservationUpdate] = useState<IReservationUpdate>(value);
  const [dateErrorAlert,setdateErrorAlert] = useState<ITransitionAlrertProps>(transitionAlertInitial);
  const onCloseDateError = () => {
    setdateErrorAlert((prev) => ({...prev,open:false}))
  }
const handleCloseValidarion = () => {
  setValidationAlert([])
}
  useEffect(() => {
    console.log("UpdateReservationDialog/useEffect",isError,isSuccess,isLoading )
    if(isSuccess){
      
      setdateErrorAlert((prev) => ({...prev,alertTitle:"Reservation Update",alertMessage:"Reservation Update Successfully",open:true,onClose:onClose,severity: "success"}))
      
    }
    if(isError){
      if(Array.isArray((error as any).data.errors)){
        (error as any).data.errors.forEach((element : any) => {
          console.log("Error", element);
        });
        const validation = getValidationFromError((error as any).data.errors,handleCloseValidarion);
      setValidationAlert(validation);
      }
      else{
        console.log("Error/single",(error as any).data.errors.message )
      }
    }
  },[isLoading])
  
  const handleFromDateFilterChange = (newValue: DateTime | null) => {
    let newDate = newValue?.toJSDate() === undefined ? new Date() : newValue?.toJSDate();
    setReservationUpdate(prev => ({ ...prev, date_from: newDate }))
  };
  const handleToDateFilterChange = (newValue: DateTime | null) => {
    let newDate = newValue?.toJSDate() === undefined ? new Date() : newValue?.toJSDate();
    setReservationUpdate(prev => ({ ...prev, date_to: newDate }))
  };
  const handleOnCancel = () => {
    onClose()
  }
  const handleOnSave = async () => {
    console.log("UpdateReserationDialog/onSave", reservationUpdate)
    let reservation = new ReservationUpdate();
    reservation.copy(reservationUpdate);
    console.log("UpdateReserationDialog/onSave/reservation", reservation)
    if(!reservation.IsValid())
    {
      setdateErrorAlert((prev) => ({...prev,alertTitle:"Date Input Error",alertMessage:"Date_to must be greater then date_from",open:true,onClose:onCloseDateError}))
      return;
    }
    
    
    try {
      const result = await updateReservation(reservationUpdate);
      console.log("UpdateReserationDialog/onSave/result", result ,reservationUpdate)

    }
    catch(error){
      console.log("UpdateReserationDialog/onSave/error",error)
    }
    
    //onSave(reservationUpdate);

  }
  return (
    <Dialog 
     sx={{'& .MuiDialog-paper': {width:"80%",maxHeight: "auto"}}}
     maxWidth="sm"
    
     open={open} {...other}>
    <DialogTitle>Reservation Update</DialogTitle>
    <DialogContent>
    <Grid container sx={{ width: "100%" }} justifyContent="center">
    
    <Grid item sx={{ marginLeft: "0px" }} xs={12} md={6} xl={6} >
      <Item sx={{ marginLeft: "0px" }}>
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <ThemeProvider theme={defaultMaterialThem}>
            <DateTimePicker
            disableMaskedInput
              label="From Date"
              mask=''
              value={reservationUpdate.date_from}
              onChange={handleFromDateFilterChange}
              renderInput={(params) => <TextField {...params} size={'small'} helperText={null} sx={{ width: "100%", label: { color: "#2196f3" }, ml: { sm: 1 }, marginLeft: "0" }} />}
            />

          </ThemeProvider>

        </LocalizationProvider>
      </Item>

    </Grid>
    <Grid item xs={12} md={6} xl={6}>
      <Item >
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <ThemeProvider theme={defaultMaterialThem}>
            <DateTimePicker
              mask=''
              disableMaskedInput
              label="To Date"
              value={reservationUpdate.date_to}
              onChange={handleToDateFilterChange}
              renderInput={(params) => <TextField {...params} size={'small'} helperText={null} sx={{ width: "100%", label: { color: "#2196f3" }, ml: { sm: 1 }, }} />}
            />

          </ThemeProvider>

        </LocalizationProvider>
      </Item>

    </Grid>
    <Grid item xs={12}>
      <Item>
      {isLoading && <CircularProgress size='1rem' color='primary' />}
        <TransitionAlert {...dateErrorAlert}/>
      </Item>
    </Grid>
    <Grid item xs={12} md={6} xl={6} sx={{ marginLeft: "0px" }}>
      <Item>
      <TextField
      disabled
      id="outlined-disabled"
      label="Device"
      fullWidth
      value={reservationUpdate.device_name}
    />
      </Item>
    </Grid>
    <Grid item xs={12} md={6} xl={6}>
      <Item>
      <TextField
      disabled
      id="outlined-disabled"
      label="Member"
      fullWidth
      defaultValue={reservationUpdate.member_name}
    />

      </Item>
    </Grid>
    {validationAlert.map((item) => (
            <Grid item xs={12}>
              <Item>
                <ValidationAlert {...item} />
              </Item>
            </Grid>
          ))}
    <Grid item xs={12} md={6} xl={6}>
      <Item><Button variant="outlined" sx={{ width: "100%" }}
        onClick={handleOnCancel}>

        Cancle
      </Button></Item>
    </Grid>
    <Grid item xs={12} md={6} xl={6}>
      <Item><Button variant="outlined" sx={{ width: "100%" }}
        onClick={handleOnSave}>
        Save
      </Button></Item>
    </Grid>
  </Grid>
    </DialogContent>
  </Dialog>
  )
}

export default UpdateReservationDialog;