import { ThemeProvider } from "@emotion/react";
import { Dialog, DialogTitle, DialogContent, Grid, TextField, Button, createTheme, Paper, styled, CircularProgress, Box } from "@mui/material";
import { LocalizationProvider, DateTimePicker, MobileDateTimePicker } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import TransitionAlert, { ITransitionAlrertProps, IValidationAlertProps, ValidationAlert } from "../../Components/Buttons/TransitionAlert";
import { useUpdateReservationMutation } from "../../features/Reservations/reservationsApiSlice";
import { IReservationUpdate, ReservationUpdate } from "../../Interfaces/API/IReservation";
import { getValidationFromError } from "../../Utils/apiValidation.Parser";
import { green } from "@mui/material/colors";
import { Inputs, validationError } from "../../Types/Validation";


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
let transitionAlertInitial: ITransitionAlrertProps = {
  severity: "error",
  alertTitle: "Error",
  alertMessage: "Unknown Error",
  open: false,
  onClose: () => { }
}
function UpdateReservationDialog({ value, onClose, onSave, open, ...other }: UpdateReservationDialogProps) {

  CustomLogger.log("UpdateReserationDialog/value", value)
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const [updateReservation, { isError, isLoading, error, isSuccess }] = useUpdateReservationMutation();
  const [reservationUpdate, setReservationUpdate] = useState<IReservationUpdate>(value);
  const [dateErrorAlert, setdateErrorAlert] = useState<ITransitionAlrertProps>(transitionAlertInitial);
  const [validator,setValidator] = useState<validationError>({
    date_from: "",
    date_to: "",
  })
  const [inputValid,setInputValid] = useState(true)
  const validate = (inputs: Inputs) : validationError => {
    const diffDaysLimit = 2
    const error : validationError = {
      date_from: "",
      date_to: "",
    }
    if(inputs.date_from && inputs.date_to){
      const diffAbs = (inputs.date_from.getTime() - new Date().getTime()) / 3600000
      const diffTo = (inputs.date_from.getTime() - inputs.date_to.getTime() )
      const diffDays = Math.round((inputs.date_to.getTime() - inputs.date_from.getTime()) / 3600000/24)
      CustomLogger.info("CreateFlightDialog/validate/from,to,diffAbs,diffDuration",inputs.date_from,inputs.date_to,diffAbs,diffTo, diffDays)
      if(diffAbs< -1)
      {
        error.date_from = "date_from not less then current time"
      }
      if(diffTo >= 0){
        error.date_to = "date_to must be greater then date_from"
      }
      if(diffDays > diffDaysLimit)
      {
        error.date_to += `, date_to must be less then ${diffDaysLimit +1} days`
      }
    }
    setInputValid(error.date_from == "" && error.date_to == "")
    setValidator(error)
    CustomLogger.info("CreateFlightDialog/validate/error",error)
    return error;
  }
  const onCloseDateError = () => {
    setdateErrorAlert((prev) => ({ ...prev, open: false }))
  }
  const handleCloseValidarion = () => {
    setValidationAlert([])
  }
  useEffect(() => {
    CustomLogger.info("UpdateReservationDialog/useEffect", isError, isSuccess, isLoading)
    if (isSuccess) {
      setdateErrorAlert((prev) => ({ ...prev, alertTitle: "Reservation Update", alertMessage: "Reservation Update Successfully", open: true, onClose: onClose, severity: "success" }))
    }
    if (isError) {
      if (Array.isArray((error as any).data.errors)) {
        (error as any).data.errors.forEach((element: any) => {
          CustomLogger.error("Error", element);
        });
        const validation = getValidationFromError((error as any).data.errors, handleCloseValidarion);
        setValidationAlert(validation);
      }
      else {
        CustomLogger.error("Error/single", (error as any).data.errors.message)
      }
    }
  }, [isLoading])

  const handleFromDateFilterChange = (newValue: DateTime | null) => {
    let newDate = newValue?.toJSDate() === undefined ? new Date() : newValue?.toJSDate();
    newDate.setSeconds(0, 0)
    let date_to = new Date(newDate).addHours(1)
    setReservationUpdate(prev => ({ ...prev, date_from: newDate }))
    const errors = validate({date_from: newDate, date_to:date_to })
    setValidator(errors)
  };

  const handleToDateFilterChange = (newValue: DateTime | null) => {
    let newDate = newValue?.toJSDate() === undefined ? new Date() : newValue?.toJSDate();
    newDate.setSeconds(0, 0)
    setReservationUpdate(prev => ({ ...prev, date_to: newDate }))
    const errors = validate({date_from: reservationUpdate.date_from  , date_to: newDate })
    setValidator(errors)
  };

  const handleOnCancel = () => {
    onClose()
  }

  const handleOnSave = async () => {
    CustomLogger.info("UpdateReserationDialog/onSave", reservationUpdate)
    let reservation = new ReservationUpdate();
    reservation.copy(reservationUpdate);
    CustomLogger.info("UpdateReserationDialog/onSave/reservation", reservation, reservationUpdate)
    if (!reservation.IsValid()) {
      setdateErrorAlert((prev) => ({ ...prev, alertTitle: "Date Input Error", alertMessage: "Date_to must be greater then date_from", open: true, onClose: onCloseDateError }))
      return;
    }
    try {
      const result = await updateReservation(reservationUpdate);
      CustomLogger.info("UpdateReserationDialog/onSave/result", result, reservationUpdate)
    }
    catch (error) {
      CustomLogger.error("UpdateReserationDialog/onSave/error", error)
    }
  }

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: "80%", maxHeight: "auto" } }}
      maxWidth="sm"
      open={open} {...other}>
      <DialogTitle>Reservation Update</DialogTitle>
      <DialogContent>
        <Grid container sx={{ width: "100%" }} justifyContent="center">
          <Grid item sx={{ marginLeft: "0px" }} xs={12} md={6} xl={6} >
            <Item sx={{ marginLeft: "0px" }}>
              <LocalizationProvider adapterLocale={"en-gb"} dateAdapter={AdapterLuxon} >
                <ThemeProvider theme={defaultMaterialThem}>
                  <MobileDateTimePicker
                    label="From Date"
                    value={DateTime.fromJSDate(reservationUpdate.date_from)}
                    onChange={handleFromDateFilterChange}
                    ampm={false}
                    slotProps={inputValid == false ? { 
                      textField: { color: "error" ,
                        helperText: validator.date_from
                      },
                    }: {}}
                  />
                </ThemeProvider>
              </LocalizationProvider>
            </Item>
          </Grid>
          <Grid item xs={12} md={6} xl={6}>
            <Item >
              <LocalizationProvider adapterLocale={"en-gb"} dateAdapter={AdapterLuxon}>
                <ThemeProvider theme={defaultMaterialThem}>
                  <MobileDateTimePicker
                    label="To Date"
                    ampm={false}
                    value={DateTime.fromJSDate(reservationUpdate.date_to)}
                    onChange={handleToDateFilterChange}
                    slotProps={inputValid == false ? {
                      textField: { color: "error",
                        helperText: validator.date_to,
                      },
                    }: {}}
                  />
                </ThemeProvider>
              </LocalizationProvider>
            </Item>
          </Grid>
          <Grid item xs={12}>
            <Item>
              <TransitionAlert {...dateErrorAlert} />
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
          <Grid item xs={12} md={6} xl={6} height={"100%"}>
            <Item><Button variant="outlined" sx={{ marginTop: 1 , marginBottom : 1, width: "100%" }}
              onClick={handleOnCancel}>
              Close
            </Button></Item>
          </Grid>

          <Grid item xs={12} md={6} xl={6}>
            <Item>
              <Box sx={{ m: 1, position: 'relative' }}>
                {isLoading && (
                  <CircularProgress
                    size={24}
                    sx={{
                      color: green[500],
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-12px',
                      marginLeft: '-12px',
                    }}
                  />

                )}
                <Button disabled={isLoading || !inputValid} variant="outlined" sx={{ width: "100%" }} 
                  onClick={handleOnSave}>
                  Save
                </Button>
              </Box>
            </Item>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateReservationDialog;