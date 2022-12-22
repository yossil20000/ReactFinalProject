import { ThemeProvider } from "@emotion/react";
import { Dialog, DialogTitle, DialogContent, Grid, TextField, Button, createTheme, Paper, styled } from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DateTime } from "luxon";
import { useCallback, useEffect, useState } from "react";
import { InputComboItem } from "../../Components/Buttons/ControledCombo";
import { ITransitionAlrertProps, IValidationAlertProps, ValidationAlert } from "../../Components/Buttons/TransitionAlert";
import DevicesCombo from "../../Components/Devices/DevicesCombo";
import MembersCombo from "../../Components/Members/MembersCombo";
import { useCreateFlightMutation } from "../../features/Flight/flightApi"
import { CFlightCreate, IFlightCreate, IFlightCreateApi } from "../../Interfaces/API/IFlight";
import { IValidation } from "../../Interfaces/IValidation";
import { getValidationFromError } from "../../Utils/apiValidation.Parser";
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

  console.log("CreateFlightDialog/value", value)

  const [CreateFlight, { isError, isLoading, error, isSuccess }] = useCreateFlightMutation();
  const [flightCreate, setFlightCreate] = useState<IFlightCreate>(value);
  const [alert, setAlert] = useState<ITransitionAlrertProps>(transitionAlertInitial);
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);

  const [devicesItems, setDevicesItem] = useState<InputComboItem[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<InputComboItem | undefined>();
  const [membersItems, setMembersItem] = useState<InputComboItem[]>([]);
  const [selectedMember, setSelectedMember] = useState<InputComboItem | undefined>();

  const onCloseDateError = () => {
    setAlert((prev) => ({ ...prev, open: false }))
  }

  useEffect(() => {
    console.log("CreateFlightDialog/useEffect", isError, isSuccess, isLoading)
    if (isSuccess) {

      setAlert((prev) => ({ ...prev, alertTitle: "Flight Create", alertMessage: "Flight Create Successfully", open: true, onClose: onClose, severity: "success" }))

    }
    if (isError) {

      const validation = getValidationFromError(error,handleOnValidatiobClose);
      setValidationAlert(validation);
      return;
      

    }
  }, [isLoading])

  const handleFromDateFilterChange = (newValue: DateTime | null) => {
    let newDate = newValue?.toJSDate() === undefined ? new Date() : newValue?.toJSDate();
    setFlightCreate(prev => ({ ...prev, date_from: newDate }))
  };
  const handleToDateFilterChange = (newValue: DateTime | null) => {
    let newDate = newValue?.toJSDate() === undefined ? new Date() : newValue?.toJSDate();
    setFlightCreate(prev => ({ ...prev, date_to: newDate }))
  };

  const handleFligtChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleFligtChange", event.target.name, event.target.value)
    setFlightCreate(prev => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };
  const handleOnCancel = () => {
    setValidationAlert([])
    onClose()
  }
  const handleOnValidatiobClose = useCallback(() => {
    setValidationAlert([])
    
  },[])
  const handleOnSave = async () => {
    console.log("CreateFlightDialog/onSave", flightCreate)
    let flight = new CFlightCreate();
    flight.copy(flightCreate);
    console.log("CreateFlightDialog/onSave/flight", flight)
    /*     if(!flight.IsDateValid())
        {
          setdateErrorAlert((prev) => ({...prev,alertTitle:"Date Input Error",alertMessage:"Date_to must be greater then date_from",open:true,onClose:onCloseDateError}))
          return;
        } */

    console.log("CreateFlightDialog/onSave/date_from", flightCreate.date_from?.toUTCString())

    await CreateFlight(flightCreate as IFlightCreateApi).unwrap().then((data) => {
      console.log("CreateFlightDialoq/onSave/", data);
      onSave(flightCreate);
    }).catch((err) => {
      console.log("CreateFlightDialoq/onSave/error", err.data.errors);
    });


  }
  const onDeviceChanged = (item: InputComboItem) => {
    setFlightCreate(prev => ({ ...prev, _id_device: item._id }))
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

          <Grid item sx={{ marginLeft: "0px" }} xs={12} md={6} xl={6} >
            <Item sx={{ marginLeft: "0px" }}>
              <LocalizationProvider dateAdapter={AdapterLuxon}>
                <ThemeProvider theme={defaultMaterialThem}>
                  <DateTimePicker
                    disableMaskedInput
                    label="From Date"
                    mask=''
                    value={flightCreate.date_from}
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
                    value={flightCreate.date_to}
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

          <Grid item xs={12} md={6} xl={6} sx={{ marginLeft: "0px" }}>
            <Item>
              <TextField
                type={"number"}
                sx={{ marginLeft: "0px", width: "100%" }}
                name="engien_start"
                label="Engien start"
                value={flightCreate.engien_start}
                onChange={handleFligtChange}
                InputLabelProps={{ shrink: true }}
              />
            </Item>
          </Grid>
          <Grid item xs={12} md={6} xl={6} sx={{ marginLeft: "0px" }}>
            <Item>
              <TextField
                type={"number"}
                sx={{ marginLeft: "0px", width: "100%" }}
                name="engien_stop"
                label="Engien stop"
                value={flightCreate.engien_stop}
                onChange={handleFligtChange}
                InputLabelProps={{ shrink: true }}
              />
            </Item>
          </Grid>
          <Grid item xs={12} md={6} xl={6} sx={{ marginLeft: "0px" }}>
            <Item>
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
              />
            </Item>
          </Grid>
          <Grid item xs={12} md={6} xl={6} sx={{ marginLeft: "0px" }}>
            <Item>
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
              />
            </Item>
          </Grid>
          <Grid item xs={12} md={12} xl={12} sx={{ marginLeft: "0px", width: "100%" }}>
            <Item>
              <TextField
                sx={{ marginLeft: "0px", width: "100%" }}
                name="description"
                id="outlined-disabled"
                label="Description"
                onChange={handleFligtChange}
                value={flightCreate.description}
                InputLabelProps={{ shrink: true }}
              />
            </Item>
          </Grid>
          <Grid item xs={12} md={6} xl={6} sx={{ marginLeft: "0px" }}>
            <Item>
              <DevicesCombo onChanged={onDeviceChanged} source={source}/>

            </Item>
          </Grid>
          <Grid item xs={12} md={6} xl={6}>
            <Item>
              <MembersCombo onChanged={onMemberChanged} source={source}/>
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
          {validationAlert.map((item) => (
            <Grid item xs={12}>
              <Item>

                <ValidationAlert {...item} />
              </Item>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default CreateFlightDialog;