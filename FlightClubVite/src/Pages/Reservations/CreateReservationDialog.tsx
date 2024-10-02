import { ThemeProvider } from "@emotion/react";
import { Dialog, DialogTitle, DialogContent, Grid, TextField, Button, createTheme, Paper, styled, Box, ToggleButton, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { LocalizationProvider, MobileDateTimePicker } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { InputComboItem } from "../../Components/Buttons/ControledCombo";
import { ITransitionAlrertProps, IValidationAlertProps, ValidationAlert } from "../../Components/Buttons/TransitionAlert";
import DeviceDetailes from "../../Components/Devices/DeviceDetailes";
import DeviceMemberCombo from "../../Components/Devices/DeviceMemberCombo";
import DevicesCombo from "../../Components/Devices/DevicesCombo";
import { useCreateReservationMutation } from "../../features/Reservations/reservationsApiSlice";
import { IReservationCreateApi } from "../../Interfaces/API/IReservation";
import { getValidationFromError } from "../../Utils/apiValidation.Parser";
import { useAppSelector } from "../../app/hooks";
import { Role } from "../../Interfaces/API/IMember";
import { UseIsAuthorized } from "../../Components/RequireAuth";
import { GridExpandMoreIcon } from "@mui/x-data-grid";
import { validationError, Inputs } from "../../Types/Validation";
const source: string = "CreateReservation"

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
  const login = useAppSelector((state) => state.authSlice);
  const isAuthorized = UseIsAuthorized({ roles: [Role.admin] })
  const [showAllMemebers, setShowAllMembers] = useState(false)
  CustomLogger.log("CreateReservationDialog/value", value)
  const [CreateReservation, { isError, isLoading, error, isSuccess }] = useCreateReservationMutation();
  const [reservationCreate, setReservationCreate] = useState<IReservationCreateApi>(value);
  const [alert, setAlert] = useState<ITransitionAlrertProps>(transitionAlertInitial);
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const [deviceDescription, setDeviceDescription] = useState("");
  const [selectedDevice, setSelectedDevice] = useState<InputComboItem>({} as InputComboItem)
  const [selectedMember, setSelectedMember] = useState<InputComboItem>({} as InputComboItem)
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
        error.date_to += `, date_to must be ${diffDaysLimit +1} days max`
      }
    }
    setInputValid(error.date_from == "" && error.date_to == "")
    setValidator(error)
    CustomLogger.info("CreateFlightDialog/validate/error",error)
    return error;
  }


  useEffect(() => {

    CustomLogger.info("CreateReservationDialog/useEffect", isError, isSuccess, isLoading)
    if (isSuccess) {
      setAlert((prev) => ({ ...prev, alertTitle: "Reservation Create", alertMessage: "Reserva Create Successfully", open: true, onClose: onClose, severity: "success" }))
    }
    if (isError) {
      const validation = getValidationFromError(error, handleCloseValidarion);
      setValidationAlert(validation);
      return;
    }

  }, [isLoading])

  const handleFromDateFilterChange = (newValue: DateTime | null) => {
    let newDate = newValue?.toJSDate() === undefined ? new Date() : newValue?.toJSDate();
    newDate.setSeconds(0, 0)
    let date_to = new Date(newDate).addHours(1)
    setReservationCreate(prev => ({ ...prev, date_from: newDate, date_to: date_to }))
    const errors = validate({date_from: newDate, date_to:date_to })
    setValidator(errors)
  };
  const handleToDateFilterChange = (newValue: DateTime | null) => {
    CustomLogger.log("CreateFlightDialoq/handleToDateFilterChange/", newValue);
    let newDate = newValue?.toJSDate() === undefined ? new Date() : newValue?.toJSDate();
    newDate.setSeconds(0, 0)
    CustomLogger.info("CreateFlightDialoq/handleToDateFilterChange/", newDate);
    setReservationCreate(prev => ({ ...prev, date_to: newDate }))
    CustomLogger.info("CreateFlightDialoq/handleToDateFilterChange/", reservationCreate);
    const errors = validate({date_from: reservationCreate.date_from  , date_to: newDate })
    setValidator(errors)
  };

  /*   useEffect(() => {
      login.member._id
      let defaultMember:InputComboItem = {
        _id: login.member._id,
        lable: `${login.member.family_name} ${login.member.member_id}`,
        description: ""
      }
      setSelectedMember(defaultMember)
      onMemberChanged(defaultMember)
      setReservationCreate(prev => ({ ...prev, _id_member: login.member._id }))
      CustomLogger.info("CreateReservationDialog/useEffect/setReservationCreate",login.member._id)
     },[value]) */

  const handleOnCancel = () => {
    setValidationAlert([])
    onClose()
  }
  const handleCloseValidarion = () => {
    setValidationAlert([])
  }
  const handleOnSave = async () => {
    setValidationAlert([])
    CustomLogger.info("CreateReservationDialog/onSave", reservationCreate)
    CustomLogger.log("CreateReservationDialog/onSave/date_from", reservationCreate.date_from?.toUTCString())

    await CreateReservation(reservationCreate as IReservationCreateApi).unwrap().then((data) => {
      CustomLogger.info("CreateFlightDialoq/onSave/", data);
      onSave(reservationCreate);
    }).catch((err) => {
      CustomLogger.error("CreateFlightDialoq/onSave/error", err.data.errors);
    });
  }

  const onDeviceChanged = (item: InputComboItem) => {
    setReservationCreate(prev => ({ ...prev, _id_device: item._id }))
    setDeviceDescription(item.description);
    setSelectedDevice(item)
  }
  const onMemberChanged = (item: InputComboItem) => {
    setReservationCreate(prev => ({ ...prev, _id_member: item._id }))
    CustomLogger.log("CreateFlightDialoq/onMemberChanged/item", item);
  }
  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: "80%", maxHeight: "auto" } }}
      maxWidth="sm"
      open={open} {...other}>
      <DialogTitle>Reservation Create</DialogTitle>
      <DialogContent>
        <Grid container sx={{ width: "100%" }} justifyContent="center" >
          <Grid item sx={{ marginLeft: "0px" }} xs={12} md={6} xl={6} >
            <Box sx={{ marginLeft: "0px", marginTop: '1ch', width: "100%" }}>
              <LocalizationProvider adapterLocale={"en-gb"} dateAdapter={AdapterLuxon}>
                <ThemeProvider theme={defaultMaterialThem}>
                  <MobileDateTimePicker
                    sx={{ width: "100%" }}
                    ampm={false}
                    label="From Date"
                    value={DateTime.fromJSDate(reservationCreate?.date_from == undefined ? new Date() : reservationCreate?.date_from)}
                    onChange={handleFromDateFilterChange}
                    slotProps={inputValid == false ? { 
                      textField: { color: "error" ,
                        helperText: validator.date_from
                      },
                    }: {}}
                  />
                </ThemeProvider>
              </LocalizationProvider>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} xl={6} sx={{ marginTop: '1ch' }}>
            <Box >
              <LocalizationProvider adapterLocale={"en-gb"} dateAdapter={AdapterLuxon} >
                <ThemeProvider theme={defaultMaterialThem}>
                  <MobileDateTimePicker
                    sx={{ width: "100%" }}
                    ampm={false}
                    label="To Date"
                    value={DateTime.fromJSDate(reservationCreate?.date_to == undefined ? new Date() : reservationCreate?.date_to)}
                    onChange={handleToDateFilterChange}       
                    slotProps={inputValid == false ? {
                      textField: { color: "error",
                        helperText: validator.date_to,
                      },
                    }: {}}
                  />
                </ThemeProvider>
              </LocalizationProvider>
            </Box>
          </Grid>
          {/*     <Grid item xs={12}>
      <Item>
      {isLoading && <CircularProgress size='1rem' color='primary' />}
        <TransitionAlert {...dateErrorAlert}/>
      </Item>
    </Grid> */}
          <Grid item xs={12} sm={isAuthorized ? 5 : 6} sx={{ marginLeft: "0px", marginTop: '2ch' }}>
            <DevicesCombo onChanged={onDeviceChanged} source={source} filter={true} />
          </Grid>
          <Grid item xs={isAuthorized ? 10 : 12} sm={isAuthorized ? 5 : 6} sx={{ marginTop: '2ch' }}>
            <DeviceMemberCombo onChanged={onMemberChanged} source={source} filter={{ showAllMemebers: showAllMemebers }} selectedDepended={selectedDevice} selectedItem={selectedMember} />
          </Grid>
          {isAuthorized === true ? (
            <Grid xs={isAuthorized ? 2 : 0} sm={isAuthorized ? 2 : 6} sx={{ marginTop: '2ch' }}>
              <ToggleButton sx={{ width: "100%" }} value='check' selected={showAllMemebers} onChange={() => { setShowAllMembers((prev) => !prev) }}>ADMIN</ToggleButton >
            </Grid>
          ) : (<></>)}
          <Grid item xs={12} md={12} xl={12} sx={{ marginLeft: "0px", width: "100%", marginTop: '2ch' }}>
            <TextField
              disabled
              sx={{ marginLeft: "0px", width: "100%" }}
              name="description"
              id="outlined-disabled"
              label="Status"
              value={deviceDescription}
              multiline
            />
          </Grid>
          <Accordion sx={{width: "100%"}}>
            <AccordionSummary style={{ height: "48px" }} expandIcon={<GridExpandMoreIcon />} aria-controls="general-content" id="general-header">Device Detailes</AccordionSummary>
            <AccordionDetails>
              <Grid item xs={12} sx={{ marginLeft: "0px", width: "100%", marginTop: '2ch' }}>
                <DeviceDetailes id_device={selectedDevice?._id === undefined ? "" : selectedDevice?._id} />
              </Grid>
            </AccordionDetails>
          </Accordion>

          {validationAlert.map((item) => (
            <Grid item xs={12} sx={{ marginTop: '2ch' }}>
              <ValidationAlert {...item} />
            </Grid>
          ))}
          <Grid item xs={12} md={6} xl={6} sx={{ marginTop: '2ch' }}>
            <Button variant="outlined" sx={{ width: "100%" }}
              onClick={handleOnCancel}>
              Cancle
            </Button>
          </Grid>
          <Grid item xs={12} md={6} xl={6} sx={{ marginTop: '2ch' }}>
            <Button variant="outlined" sx={{ width: "100%" }} disabled={!inputValid} 
              onClick={handleOnSave}>
              Save
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default CreateReservationDialog;