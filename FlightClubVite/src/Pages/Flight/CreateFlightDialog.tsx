import { ThemeProvider } from "@emotion/react";
import { Dialog, DialogTitle, DialogContent, Grid, TextField, Button, createTheme, Paper, styled, Box, ToggleButton } from "@mui/material";
import { LocalizationProvider, MobileDateTimePicker } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DateTime } from "luxon";
import { useCallback, useEffect, useState } from "react";
import { InputComboItem } from "../../Components/Buttons/ControledCombo";
import { ITransitionAlrertProps, IValidationAlertProps, ValidationAlert } from "../../Components/Buttons/TransitionAlert";
import DevicesFlightCombo from "../../Components/Devices/DeviceFlightCombo";
import DeviceMemberCombo from "../../Components/Devices/DeviceMemberCombo";
import { useCreateFlightMutation } from "../../features/Flight/flightApi"
import { CFlightCreate, IFlightCreate, IFlightCreateApi } from "../../Interfaces/API/IFlight";
import { getValidationFromError } from "../../Utils/apiValidation.Parser";
import { UseIsAuthorized } from "../../Components/RequireAuth";
import { Role } from "../../Interfaces/API/IMember";
const source: string = "CreateFlight"

export interface CreateFlightDialogProps {
  value: IFlightCreate;
  onClose: () => void;
  onSave: (value: IFlightCreate) => void;
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


function CreateFlightDialog({ value, onClose, onSave, open, ...other }: CreateFlightDialogProps) {
  const isAuthorized = UseIsAuthorized({ roles: [Role.admin] })
  const [showAllMemebers, setShowAllMembers] = useState(false)
  CustomLogger.info("CreateFlightDialog/value", value)

  const [CreateFlight, { isError, isLoading, error, isSuccess }] = useCreateFlightMutation();
  const [flightCreate, setFlightCreate] = useState<IFlightCreate>(value);
  const [alert, setAlert] = useState<ITransitionAlrertProps>(transitionAlertInitial);
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<InputComboItem>({} as InputComboItem)

  useEffect(() => {
    CustomLogger.info("CreateFlightDialog/useEffect", isError, isSuccess, isLoading)
    if (isSuccess) {
      setAlert((prev) => ({ ...prev, alertTitle: "Flight Create", alertMessage: "Flight Create Successfully", open: true, onClose: onClose, severity: "success" }))
    }
    if (isError) {
      const validation = getValidationFromError(error, handleOnValidatiobClose);
      setValidationAlert(validation);
      return;
    }
  }, [isLoading])

  const handleFromDateFilterChange = (newValue: DateTime | null) => {
    let newDate = newValue?.toJSDate() === undefined ? new Date() : newValue?.toJSDate();
    newDate.setSeconds(0, 0)
    setFlightCreate(prev => ({ ...prev, date: newDate }))
  };

  const handleFligtChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    CustomLogger.info("handleFligtChange", event.target.name, event.target.value)
    let duration = 0;
    switch (event.target.name) {
      case "engien_start":
        duration = flightCreate.engien_stop - Number(event.target.value)
        break;
      case "engien_stop":
        duration = Number(event.target.value) - flightCreate.engien_start
        break;
    }
    duration = Number(duration.toFixed(1))
    setFlightCreate(prev => ({
      ...prev,
      [event.target.name]: event.target.value, duration: duration === 0 ? prev.duration : duration
    }));
  };
  const handleOnCancel = () => {
    setValidationAlert([])
    onClose()
  }
  const handleOnValidatiobClose = useCallback(() => {
    setValidationAlert([])

  }, [])
  const handleOnSave = async () => {
    CustomLogger.info("CreateFlightDialog/onSave", flightCreate)
    let flight = new CFlightCreate();
    flight.copy(flightCreate);
    CustomLogger.info("CreateFlightDialog/onSave/flight", flight)
    CustomLogger.info("CreateFlightDialog/onSave/date", flightCreate.date?.toUTCString())

    await CreateFlight(flightCreate as IFlightCreateApi).unwrap().then((data) => {
      CustomLogger.info("CreateFlightDialoq/onSave/", data);
      onSave(flightCreate);
    }).catch((err) => {
      CustomLogger.info("CreateFlightDialoq/onSave/error", err.data.errors);
    });


  }
  const onDeviceChanged = (item: InputComboItem, has_hobbs: boolean) => {

    setFlightCreate(prev => ({ ...prev, _id_device: item._id, reuired_hobbs: has_hobbs }))
    setSelectedDevice(item)
  }
  const onMemberChanged = (item: InputComboItem) => {
    setFlightCreate(prev => ({ ...prev, _id_member: item._id }))
  }
  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: "80%", maxHeight: "auto" } }}
      maxWidth="sm"
      open={open} {...other}>
      <DialogTitle>Flight Create</DialogTitle>
      <DialogContent>
        <Grid container sx={{ width: "100%" }} justifyContent="center">
          <Grid item xs={12} sm={isAuthorized ? 5 : 6} sx={{ marginLeft: "0px" }}>
            <DevicesFlightCombo onChanged={onDeviceChanged} source={source} filter={true} />
          </Grid>

          <Grid item xs={isAuthorized ? 10 : 12} sm={isAuthorized ? 5 : 6} >
            <DeviceMemberCombo onChanged={onMemberChanged} source={source} filter={{ showAllMemebers: showAllMemebers }} selectedDepended={selectedDevice} />
          </Grid>

          {isAuthorized === true ? (
            <Grid xs={isAuthorized ? 2 : 0} sm={isAuthorized ? 2 : 6}>
              <ToggleButton sx={{ width: "100%" }} value='check' selected={showAllMemebers} onChange={() => { setShowAllMembers((prev) => !prev) }}>ADMIN</ToggleButton >
            </Grid>
          ) : (<></>)}


          <Grid item sx={{ marginLeft: "0px", width: "100%" }} xs={12} md={4}  >
            <Box sx={{ marginLeft: "0px", marginTop: '2ch', width: "100%" }}>
              <LocalizationProvider adapterLocale={"en-gb"} dateAdapter={AdapterLuxon}>
                <ThemeProvider theme={defaultMaterialThem}>
                  <MobileDateTimePicker
                    sx={{ width: "100%" }}
                    views={['year', 'month', 'day']}
                    label="Date"
                    value={DateTime.fromJSDate(flightCreate.date)}
                    onChange={handleFromDateFilterChange}
                  />
                </ThemeProvider>
              </LocalizationProvider>
            </Box>

          </Grid>
          <Grid item xs={6} md={4} xl={4} sx={{ marginLeft: "0px", marginTop: '2ch' }}>
            <TextField
              type={"number"}
              sx={{ marginLeft: "0px", width: "100%" }}
              name="flight_time"
              label="Flight Time"
              value={flightCreate.flight_time}
              onChange={handleFligtChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6} md={4} xl={4} sx={{ marginLeft: "0px", marginTop: '2ch' }}>
            <TextField
              type={"number"}
              sx={{ marginLeft: "0px", width: "100%" }}
              name="fuel_start"
              label="Start Fuel"
              value={flightCreate.fuel_start}
              onChange={handleFligtChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6} md={6} xl={6} sx={{ marginLeft: "0px", marginTop: '2ch' }}>
            <TextField
              type={"number"}
              sx={{ marginLeft: "0px", width: "100%" }}
              name="engien_start"
              label="TACH start"
              value={flightCreate.engien_start}
              onChange={handleFligtChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6} md={6} xl={6} sx={{ marginLeft: "0px", marginTop: '2ch' }}>
            <TextField
              type={"number"}
              sx={{ marginLeft: "0px", width: "100%" }}
              name="engien_stop"
              label="TACH stop"
              value={flightCreate.engien_stop}
              onChange={handleFligtChange}
              InputLabelProps={{ shrink: true }}
              helperText={`Duration: ${flightCreate.duration}`}
            />
          </Grid>
          <Grid item xs={12} md={6} xl={6} sx={{ marginLeft: "0px", marginTop: '2ch' ,display:"none"}}>
            <TextField
              type={"number"}
              sx={{ marginLeft: "0px", width: "100%" }}
              name="hobbs_start"
              id="hobbs_start"
              label="hobbs_start"
              key={"hobbs_start"}
              value={flightCreate.hobbs_start}
              onChange={handleFligtChange}
              InputLabelProps={{ shrink: true }}
              helperText={flightCreate.reuired_hobbs ? "" : "Hobbs is optional"}
              error={!flightCreate.reuired_hobbs}
            />
          </Grid>
          <Grid item xs={12} md={6} xl={6} sx={{ marginLeft: "0px", marginTop: '2ch' }} display={"none"}>
            <TextField
              type={"number"}
              sx={{ marginLeft: "0px", width: "100%" }}
              name="hobbs_stop"
              id="hobbs_stop"
              label="hobbs_stop"
              key={"hobbs_stop"}
              value={flightCreate.hobbs_stop}
              onChange={handleFligtChange}
              InputLabelProps={{ shrink: true }}
              helperText={flightCreate.reuired_hobbs ? "" : "Hobbs is optional"}
              error={!flightCreate.reuired_hobbs}
            />
          </Grid>
          <Grid item xs={12} md={12} xl={12} sx={{ marginLeft: "0px", width: "100%", marginTop: '2ch' }}>
            <TextField
              sx={{ marginLeft: "0px", width: "100%" }}
              name="description"
              id="outlined-disabled"
              label="Description"
              onChange={handleFligtChange}
              value={flightCreate.description}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          {validationAlert.map((item) => (
            <Grid item xs={12}>
              <Item>
                <ValidationAlert {...item} />
              </Item>
            </Grid>
          ))}
          <Grid item xs={12} md={6} xl={6} sx={{ marginTop: '2ch' }}>
            <Button variant="outlined" sx={{ width: "100%" }}
              onClick={handleOnCancel}>
              Cancle
            </Button>
          </Grid>
          <Grid item xs={12} md={6} xl={6} sx={{ marginTop: '2ch' }}>
            <Button variant="outlined" sx={{ width: "100%" }}
              onClick={handleOnSave}>
              Save
            </Button>
          </Grid>

        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default CreateFlightDialog;