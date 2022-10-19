import { ThemeProvider } from "@emotion/react";
import { Dialog, DialogTitle, DialogContent, Grid, Typography, TextField, Button, createTheme, Paper, styled, CircularProgress } from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { ITransitionAlrertProps, IValidationAlertProps, ValidationAlert } from "../../Components/Buttons/TransitionAlert";
import { useUpdateFlightMutation } from "../../features/Flight/flightApi"
import { CFlightUpdate, IFlightUpdate, IFlightUpdateApi } from "../../Interfaces/API/IFlight";
import { IValidation } from "../../Interfaces/IValidation";


export interface UpdateFlightDialogProps {
  value: IFlightUpdate;
  onClose: () => void;
  onSave: (value: IFlightUpdate) => void;
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
  severity: "success",
  alertTitle: "Update Flight",
  alertMessage: "Operation succeed",
  open: false,
  onClose: () => { }
}
function UpdateFlightDialog({ value, onClose, onSave, open, ...other }: UpdateFlightDialogProps) {

  console.log("UpdateFlightDialog/value", value)

  const [updateFlight, { isError, isLoading, error, isSuccess }] = useUpdateFlightMutation();
  const [flightUpdate, setFlightUpdate] = useState<IFlightUpdate>(value);
  const [alert, setAlert] = useState<ITransitionAlrertProps>(transitionAlertInitial);
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);

  const onCloseDateError = () => {
    setAlert((prev) => ({ ...prev, open: false }))
  }
  
  useEffect(() => {
    console.log("UpdateFlightDialog/useEffect", isError, isSuccess, isLoading)
    if (isSuccess) {

      setAlert((prev) => ({ ...prev, alertTitle: "Flight Update", alertMessage: "Flight Update Successfully", open: true, onClose: onClose, severity: "success" }))

    }
    if (isError) {
      if ((error as any).data.errors !== undefined) {
        if (Array.isArray((error as any).data.errors)) {
          (error as any).data.errors.forEach((element: any) => {
            console.log("UpdateFlightDialog/useEffect/Error", element);
          });
        }
        else {
          console.log("UpdateFlightDialog/useEffect/Error/single", (error as any).data.errors)
        }
      }
      if ((error as any).data.validation !== undefined) {
        let validation: IValidationAlertProps[];
        console.log("UpdateFlightDialog/useEffect/data", (error as any).data)
        validation = (error as any).data.validation.errors.map((item: IValidation) => {
          const alert : IValidationAlertProps  = {...(item as IValidationAlertProps)};
          alert.onClose = handleOnCancel;
          alert.open = true
          return alert;

        })
        setValidationAlert(validation);
        console.log("UpdateFlightDialog/useEffect/validation", validation )
      }

    }
  }, [isLoading])

  const handleFromDateFilterChange = (newValue: DateTime | null) => {
    let newDate = newValue?.toJSDate() === undefined ? new Date() : newValue?.toJSDate();
    setFlightUpdate(prev => ({ ...prev, date_from: newDate }))
  };
  const handleToDateFilterChange = (newValue: DateTime | null) => {
    let newDate = newValue?.toJSDate() === undefined ? new Date() : newValue?.toJSDate();
    setFlightUpdate(prev => ({ ...prev, date_to: newDate }))
  };

  const handleFligtChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleFligtChange", event.target.name, event.target.value)
    setFlightUpdate(prev => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };
  const handleOnCancel = () => {
    setValidationAlert([])
    onClose()
  }
  const handleOnSave = async () => {
    console.log("UpdateFlightDialog/onSave", flightUpdate)
    let flight = new CFlightUpdate();
    flight.copy(flightUpdate);
    console.log("UpdateFlightDialog/onSave/flight", flight)
    /*     if(!flight.IsDateValid())
        {
          setdateErrorAlert((prev) => ({...prev,alertTitle:"Date Input Error",alertMessage:"Date_to must be greater then date_from",open:true,onClose:onCloseDateError}))
          return;
        } */

    console.log("UpdateFlightDialog/onSave/date_from", flightUpdate.date_from?.toUTCString())

    await updateFlight(flightUpdate as IFlightUpdateApi).unwrap().then((data) => {
      console.log("updateFlightDialoq/onSave/", data);
      onSave(flightUpdate);
    }).catch((err) => {
      console.log("updateFlightDialoq/onSave/error", err.data.errors);
    });
    

  }
  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: "80%", maxHeight: "auto" } }}
      maxWidth="sm"

      open={open} {...other}>
      <DialogTitle>Flight Update</DialogTitle>
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
                    value={flightUpdate.date_from}
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
                    value={flightUpdate.date_to}
                    onChange={handleToDateFilterChange}
                    renderInput={(params) => <TextField {...params} size={'small'} helperText={null} sx={{ width: "100%", label: { color: "#2196f3" }, ml: { sm: 1 }, }} />}
                  />

                </ThemeProvider>

              </LocalizationProvider>
            </Item>

          </Grid>
          {/*     <Grid item xs={12}>
      <Item>
      {isLoading && <CircularProgress size='1rem' color='primary' />}
        <TransitionAlert {...dateErrorAlert}/>
      </Item>
    </Grid> */}
          {validationAlert.map((item) => (
            <Grid item xs={12}>
            <Item>
            
              <ValidationAlert {...item}/>
            </Item>
          </Grid> 
          ))}
           <Grid item xs={12} md={6} xl={6} sx={{ marginLeft: "0px" }}>
            <Item>
              <TextField
               sx={{ marginLeft: "0px" , width:"100%"}}
                name="engien_start"
                label="Engien start"
                value={flightUpdate.engien_start}
                onChange={handleFligtChange}
              />
            </Item>
          </Grid>
          <Grid item xs={12} md={6} xl={6} sx={{ marginLeft: "0px" }}>
            <Item>
              <TextField
               sx={{ marginLeft: "0px" , width:"100%"}}
                name="engien_stop"
                label="Engien stop"
                value={flightUpdate.engien_stop}
                onChange={handleFligtChange}
              />
            </Item>
          </Grid>
          <Grid item xs={12} md={6} xl={6} sx={{ marginLeft: "0px" }}>
            <Item>
              <TextField
               sx={{ marginLeft: "0px" , width:"100%"}}
                name="hobbs_start"
                id="hobbs_start"
                label="hobbs_start"
                key={"hobbs_start"}
                value={flightUpdate.hobbs_start}
                onChange={handleFligtChange}
              />
            </Item>
          </Grid>
          <Grid item xs={12} md={6} xl={6} sx={{ marginLeft: "0px" }}>
            <Item>
              <TextField
               sx={{ marginLeft: "0px" , width:"100%"}}
                name="hobbs_stop"
                id="hobbs_stop"
                label="hobbs_stop"
                key={"hobbs_stop"}
                value={flightUpdate.hobbs_stop}
                onChange={handleFligtChange}
              />
            </Item>
          </Grid>
          <Grid item xs={12} md={12} xl={12} sx={{ marginLeft: "0px" , width:"100%"}}>
            <Item>
              <TextField
                sx={{ marginLeft: "0px" , width:"100%"}}
                name="description"
                id="outlined-disabled"
                label="Description"
                onChange={handleFligtChange}
                value={flightUpdate.description}
              />
            </Item>
          </Grid>
          <Grid item xs={12} md={6} xl={6} sx={{ marginLeft: "0px" }}>
            <Item>
              <TextField
               sx={{ marginLeft: "0px" , width:"100%"}}
                disabled
                id="outlined-disabled"
                label="Device"

                value={flightUpdate.device_name}
              />
            </Item>
          </Grid>
          <Grid item xs={12} md={6} xl={6}>
            <Item>
              <TextField sx={{ marginLeft: "0px" , width:"100%"}}
                disabled
                id="outlined-disabled"
                label="Member"
                defaultValue={flightUpdate.member_name}
              />

            </Item>
          </Grid>
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

export default UpdateFlightDialog;