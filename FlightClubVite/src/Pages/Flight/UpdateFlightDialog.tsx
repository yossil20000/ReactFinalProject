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
import { getValidationFromError } from "../../Utils/apiValidation.Parser";


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

  CustomLogger.log("UpdateFlightDialog/value", value)
  const [updateFlight, { isError, isLoading, error, isSuccess }] = useUpdateFlightMutation();
  const [flightUpdate, setFlightUpdate] = useState<IFlightUpdate>(value);
  const [alert, setAlert] = useState<ITransitionAlrertProps>(transitionAlertInitial);
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);

  useEffect(() => {
    CustomLogger.info("UpdateFlightDialog/useEffect", isError, isSuccess, isLoading)
    if (isSuccess) {

      setAlert((prev) => ({ ...prev, alertTitle: "Flight Update", alertMessage: "Flight Update Successfully", open: true, onClose: onClose, severity: "success" }))

    }
    if (isError) {
      const validation = getValidationFromError(error, handleOnCancel);
      setValidationAlert(validation);
      return;

    }
  }, [isLoading])

  const handleFromDateFilterChange = (newValue: DateTime | null) => {
    let newDate = newValue?.toJSDate() === undefined ? new Date() : newValue?.toJSDate();
    setFlightUpdate(prev => ({ ...prev, date: newDate }))
  };

  const handleFligtChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    CustomLogger.log("handleFligtChange", event.target.name, event.target.value)
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
    CustomLogger.log("UpdateFlightDialog/onSave", flightUpdate)
    let flight = new CFlightUpdate();
    flight.copy(flightUpdate);
    CustomLogger.info("UpdateFlightDialog/onSave/flight", flight)
    CustomLogger.info("UpdateFlightDialog/onSave/date", flightUpdate.date?.toUTCString())

    await updateFlight(flightUpdate as IFlightUpdateApi).unwrap().then((data) => {
      CustomLogger.info("updateFlightDialoq/onSave/", data);
      onSave(flightUpdate);
    }).catch((err) => {
      CustomLogger.error("updateFlightDialoq/onSave/error", err.data.errors);
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

          <Grid item sx={{ marginLeft: "0px" }} xs={12} md={12} xl={12} >
            <Item sx={{ marginLeft: "0px" }}>
              <LocalizationProvider dateAdapter={AdapterLuxon}>
                <ThemeProvider theme={defaultMaterialThem}>
                  <DateTimePicker
                    disableMaskedInput
                    label="Date"
                    mask=''
                    value={flightUpdate.date}
                    onChange={handleFromDateFilterChange}
                    renderInput={(params) => <TextField {...params} size={'small'} helperText={null} sx={{ width: "100%", label: { color: "#2196f3" }, ml: { sm: 1 }, marginLeft: "0" }} />}
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
              <TextField
                type={"number"}
                sx={{ marginLeft: "0px", width: "100%" }}
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
                type={"number"}
                sx={{ marginLeft: "0px", width: "100%" }}
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
                type={"number"}
                sx={{ marginLeft: "0px", width: "100%" }}
                name="hobbs_start"
                id="hobbs_start"
                label="hobbs_start"
                key={"hobbs_start"}
                value={flightUpdate.hobbs_start}
                onChange={handleFligtChange}
                helperText={flightUpdate.reuired_hobbs ? "" : "Hobbs is optional"}
                error={!flightUpdate.reuired_hobbs}
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
                value={flightUpdate.hobbs_stop}
                onChange={handleFligtChange}
                helperText={flightUpdate.reuired_hobbs ? "" : "Hobbs is optional"}
                error={!flightUpdate.reuired_hobbs}
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
                value={flightUpdate.description}
              />
            </Item>
          </Grid>
          <Grid item xs={12} md={6} xl={6} sx={{ marginLeft: "0px" }}>
            <Item>
              <TextField
                sx={{ marginLeft: "0px", width: "100%" }}
                disabled
                id="outlined-disabled"
                label="Device"
                value={flightUpdate.device_name}
              />
            </Item>
          </Grid>
          <Grid item xs={12} md={6} xl={6}>
            <Item>
              <TextField sx={{ marginLeft: "0px", width: "100%" }}
                disabled
                id="outlined-disabled"
                label="Member"
                defaultValue={flightUpdate.member_name}
              />
            </Item>
          </Grid>
          <Grid item xs={12} md={6} xl={6}>
            <Item>
              <Button variant="outlined" sx={{ width: "100%" }}
                onClick={handleOnCancel}>
                Cancle
              </Button>
            </Item>
          </Grid>
          <Grid item xs={12} md={6} xl={6}>
            <Item>
              <Button variant="outlined" sx={{ width: "100%" }}
                onClick={handleOnSave}>
                Save
              </Button>
            </Item>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateFlightDialog;