import { useTheme } from '@emotion/react'
import { Dialog, DialogTitle, DialogContent, Card, CardContent, Grid, Typography, Divider, TextField, CardActions, Button, Checkbox, FormControlLabel, ThemeProvider } from '@mui/material'
import { LocalizationProvider, DateTimePicker, DatePicker, MobileDateTimePicker } from '@mui/x-date-pickers'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { DateTime } from 'luxon'
import React, { useCallback, useState } from 'react'
import { InputComboItem } from '../../Components/Buttons/ControledCombo'
import { IValidationAlertProps, ValidationAlert } from '../../Components/Buttons/TransitionAlert'
import DeviceMemberCombo from '../../Components/Devices/DeviceMemberCombo'
import DevicesCombo from '../../Components/Devices/DevicesCombo'
import Item from '../../Components/Item'
import { useCreateQuarterOrderMutation } from '../../features/Account/accountApiSlice'
import { getValidationFromError } from '../../Utils/apiValidation.Parser'
const source: string = "CreateQuarterDialoq"
export interface ICreateQuarterDialoqProps {
  onClose: () => void;
  onSave: (value: ICreateQuarterExpense) => void;
  open: boolean;
}
export interface ICreateQuarterExpense {
  all: boolean;
  members_Id: string[];
  device_Id: string;
  description: string;
  date: Date
}
function CreateQuarterDialoq({ open, onClose, onSave, ...other }: ICreateQuarterDialoqProps) {
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<InputComboItem>({} as InputComboItem)
  const [selectedMembers, setSelectedMembers] = useState<ICreateQuarterExpense>({ all: true, members_Id: [], device_Id: "", description: "", date: new Date() });
  const [isSaved, setIsSaved] = useState(false);
  const [requestAllItems, setRequestAllItems] = useState(false);
  const [CreateQuarterOrder] = useCreateQuarterOrderMutation()
  const theme = useTheme()
  const onDeviceChanged = (item: InputComboItem) => {
    setSelectedDevice(item)
    setSelectedMembers(prev => ({ ...prev, all: false, device_Id: item._id }))
  }
  const onMemberChanged = (item: InputComboItem) => {
    CustomLogger.log("CreateQuarterDialoq/item", item)
    let members = new Array();
    members.push(item._id)
    CustomLogger.info("CreateQuarterDialoq/members", members, selectedMembers)
    setSelectedMembers(prev => ({ ...prev, all: false, members_Id: members }))
  }
  const handleOnCancel = () => {
    setValidationAlert([])
    if (isSaved) {/* onSave(value) */ }
    else
      onClose()
  }
  const handleOnSave = async () => {
    CustomLogger.log("CreateQuarterDialoq/handleOnSave", selectedMembers)
    try {
      setValidationAlert([])
      const results = await CreateQuarterOrder(selectedMembers).unwrap()
      CustomLogger.info("CreateQuarterDialoq/handleOnSave/result", results)
    }
    catch (error) {
      const validation = getValidationFromError(error, handleOnValidatiobClose);
      setValidationAlert(validation);
      CustomLogger.error("CreateQuarterDialoq/handleOnSave/error", error)
    }
  }
  const handleOnValidatiobClose = useCallback(() => {
    setValidationAlert([])

  }, [])
  const getAllMembers = (items: InputComboItem[]) => {

    CustomLogger.log("CreateQuarterDialoq/getAllMembers", items, selectedMembers)
    const members = items.map((item) => item._id)
    setSelectedMembers(prev => ({ ...prev, all: true, members_Id: members }))
  }
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    CustomLogger.log("CreateQuarterDialoq/handleBoolainChange", event.target.name, event.target.checked)
    setRequestAllItems(event.target.checked)

  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    CustomLogger.log("CreateQuarterDialoq/handleChange", event.target.name, event.target.value)
    setSelectedMembers(prev => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  };
  const handleDateChange = (newValue: DateTime | null) => {
    let newDate = newValue?.toJSDate() === undefined ? new Date() : newValue?.toJSDate();
    newDate.setSeconds(0, 0);
    setSelectedMembers(prev => ({ ...prev, date: newDate }))
  };
  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: "100%", maxHeight: "auto" } }}
      maxWidth="lg"

      open={open} {...other}>
      <DialogTitle>Create Quarter Expense</DialogTitle>
      <DialogContent>
        <Card variant="outlined">
          <CardContent>
            <Grid container sx={{ width: "100%" }} justifyContent="center" columns={12}>
              <Grid item xs={12}>
                <Item>
                  <DevicesCombo onChanged={onDeviceChanged} source={source} filter={true} />
                </Item>
              </Grid>
              <Grid item xs={3}>
                <FormControlLabel control={<Checkbox onChange={handleFilterChange} name={"active_only"} checked={requestAllItems} sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }} />} label="Select All" />
              </Grid>
              <Grid item xs={9}>
                <DeviceMemberCombo requestItems={requestAllItems} getAllItems={getAllMembers} title='Select All Members' onChanged={onMemberChanged} source={source} filter={true} selectedDepended={selectedDevice} />
                <Divider light />
              </Grid>
              <Grid item sx={{ marginLeft: "0px" }} xs={12}  >
                <Item sx={{ marginLeft: "0px" }}>
                  <LocalizationProvider dateAdapter={AdapterLuxon}>
                    <ThemeProvider theme={theme}>
                      <MobileDateTimePicker 
                        label="Date"
                        value={DateTime.fromJSDate(selectedMembers.date)}
                        onChange={handleDateChange}
                      />
                    </ThemeProvider>
                  </LocalizationProvider>
                </Item>
              </Grid>
              <Grid item xs={12}>

                <TextField
                  type={"text"}
                  sx={{ marginLeft: "0px", width: "100%", fontSize: 25 }}
                  name="description"
                  id="description"
                  variant="standard"
                  key={"description"}
                  value={selectedMembers.description}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  label="description"
                />
              </Grid>
              <Grid item xs={12}>
                <Divider light />
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Grid container sx={{ width: "100%" }} justifyContent="center">
              <Grid item xs={12} md={6} xl={6}>
                <Item><Button variant="outlined" sx={{ width: "100%" }}
                  onClick={handleOnCancel}>

                  {isSaved === true ? "Close " : "Cancle"}
                </Button></Item>
              </Grid>
              <Grid item xs={12} md={6} xl={6}>
                <Item><Button variant="outlined" sx={{ width: "100%" }}
                  disabled={isSaved === true ? true : false}
                  onClick={handleOnSave}>
                  {isSaved === true ? "Saved" : "Save"}
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
          </CardActions>
        </Card>

      </DialogContent>
    </Dialog>
  )
}

export default CreateQuarterDialoq