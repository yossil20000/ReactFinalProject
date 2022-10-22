import { ThemeProvider } from "@emotion/react";
import { Preview } from "@mui/icons-material";
import { Dialog, DialogTitle, DialogContent, Grid, Typography, TextField, Button, createTheme, Paper, styled, CircularProgress, Autocomplete } from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { is } from "immer/dist/internal";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import InputCombo, { InputComboItem } from "../../Components/Buttons/InputCombo";
import TransitionAlert, { ITransitionAlrertProps, IValidationAlertProps, ValidationAlert } from "../../Components/Buttons/TransitionAlert";
import DevicesCombo from "../../Components/Devices/DevicesCombo";
import MembersCombo from "../../Components/Members/MembersCombo";
import { useCreateFlightMutation } from "../../features/Flight/flightApi"
import { useCreateReservationMutation } from "../../features/Reservations/reservationsApiSlice";
import { CFlightCreate, IFlightCreate, IFlightCreateApi } from "../../Interfaces/API/IFlight";
import { IReservationCreateApi } from "../../Interfaces/API/IReservation";
import { IDeviceCombo, IMemberCombo } from "../../Interfaces/IFlightReservationProps";
import { IValidation } from "../../Interfaces/IValidation";


export interface CreateReservationDialogProps {
  value: IReservationCreateApi;
  onClose: () => void;
  onSave: (value: IReservationCreateApi) => void;
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
  alertTitle: "Create Flight",
  alertMessage: "Operation succeed",
  open: false,
  onClose: () => { }
}
function CreateReservationDialog({ value, onClose, onSave, open, ...other }: CreateReservationDialogProps) {

  console.log("CreateReservationDialog/value", value)

  const [CreateReservation, { isError, isLoading, error, isSuccess }] = useCreateReservationMutation();
  const [reservationCreate, setReservationCreate] = useState<IReservationCreateApi>(value);
  const [alert, setAlert] = useState<ITransitionAlrertProps>(transitionAlertInitial);
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const [deviceDescription, setDeviceDescription] = useState("");
  useEffect(() => {
    console.log("CreateReservationDialog/useEffect", isError, isSuccess, isLoading)
    if (isSuccess) {

      setAlert((prev) => ({ ...prev, alertTitle: "Reservation Create", alertMessage: "Reserva Create Successfully", open: true, onClose: onClose, severity: "success" }))

    }
    if (isError) {
      if ((error as any).data.errors !== undefined) {
        let validation: IValidationAlertProps[] = [];
        if (Array.isArray((error as any).data.errors)) {
          
          validation = (error as any).data?.errors.map((item: string) => {
            const alert: IValidationAlertProps = {
              location: '',
              msg: item,
              param: '',
              value: "",
              open: true,
              onClose: handleOnCancel
            };
            return alert;
          })
          setValidationAlert(validation);
        }
        else {
          console.log("CreateReservationDialog/useEffect/Error/single", (error as any).data.errors)
          validation.push({
            location: '',
              msg: (error as any).data.errors,
              param: '',
              value: "",
              open: true,
              onClose: handleOnCancel
          })
          setValidationAlert(validation);
        }
      }
      
      if ((error as any).data.validation !== undefined) {
        let validation: IValidationAlertProps[];
        console.log("CreateReservationDialog/useEffect/data", (error as any).data)
        validation = (error as any).data.validation.errors.map((item: IValidation) => {
          const alert: IValidationAlertProps = { ...(item as IValidationAlertProps) };
          alert.onClose = handleOnCancel;
          alert.open = true
          return alert;

        })
        setValidationAlert(validation);
        console.log("CreateReservationDialog/useEffect/validation", validation)
      }

    }
  }, [isLoading])

  const handleFromDateFilterChange = (newValue: DateTime | null) => {
    let newDate = newValue?.toJSDate() === undefined ? new Date() : newValue?.toJSDate();
    setReservationCreate(prev => ({ ...prev, date_from: newDate }))
  };
  const handleToDateFilterChange = (newValue: DateTime | null) => {
    let newDate = newValue?.toJSDate() === undefined ? new Date() : newValue?.toJSDate();
    setReservationCreate(prev => ({ ...prev, date_to: newDate }))
  };

  
  const handleOnCancel = () => {
    setValidationAlert([])
    onClose()
  }
  const handleOnSave = async () => {
    console.log("CreateReservationDialog/onSave", reservationCreate)
    console.log("CreateReservationDialog/onSave/date_from", reservationCreate.date_from?.toUTCString())

    await CreateReservation(reservationCreate as IFlightCreateApi).unwrap().then((data) => {
      console.log("CreateFlightDialoq/onSave/", data);
      onSave(reservationCreate);
    }).catch((err) => {
      console.log("CreateFlightDialoq/onSave/error", err.data.errors);
    });


  }

  const onDeviceChanged = (item: InputComboItem) => {
    setReservationCreate(prev => ({ ...prev, _id_device: item._id }))
    setDeviceDescription(item.description);
  }
  const onMemberChanged = (item: InputComboItem) => {
    setReservationCreate(prev => ({ ...prev, _id_member: item._id }))
  }
  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: "80%", maxHeight: "auto" } }}
      maxWidth="sm"

      open={open} {...other}>
      <DialogTitle>Reservation Create</DialogTitle>
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
                    value={reservationCreate.date_from}
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
                    value={reservationCreate.date_to}
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

                <ValidationAlert {...item} />
              </Item>
            </Grid>
          ))}

          <Grid item xs={12} md={6} xl={6} sx={{ marginLeft: "0px" }}>
            <Item>
              <DevicesCombo onChanged={onDeviceChanged} />

            </Item>
          </Grid>
          <Grid item xs={12} md={6} xl={6}>
            <Item>
              <MembersCombo onChanged={onMemberChanged} />
            </Item>
          </Grid>
          <Grid item xs={12} md={12} xl={12} sx={{ marginLeft: "0px", width: "100%" }}>
            <Item>
              <TextField
                disabled
                sx={{ marginLeft: "0px", width: "100%" }}
                name="description"
                id="outlined-disabled"
                label="Status"
                
                value={deviceDescription}
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

export default CreateReservationDialog;