import { useTheme } from '@emotion/react'
import { Dialog, DialogTitle, DialogContent, Card, CardContent, Grid, Divider, TextField, CardActions, Button, ThemeProvider, LinearProgress } from '@mui/material'
import { LocalizationProvider, MobileDateTimePicker } from '@mui/x-date-pickers'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { DateTime } from 'luxon'
import React, { useCallback, useState } from 'react'
import { IValidationAlertProps, ValidationAlert } from '../../Components/Buttons/TransitionAlert'
import Item from '../../Components/Item'
import { useCreateExpenseOrderMutation } from '../../features/Account/accountApiSlice'
import { getValidationFromError } from '../../Utils/apiValidation.Parser'
import { LabelType } from '../../Components/Buttons/MultiOptionCombo'
import MembersOptionCombo from '../../Components/Members/MembersOptionCombo'
import { SetProperty } from '../../Utils/setProperty'

export interface ICreateOrderExpenseDialoqProps {
  onClose: () => void;
  onSave: (value: ICreateOrderExpense) => void;
  open: boolean;
}
export interface ICreateOrderExpense {
  all: boolean;
  members_Id: string[];
  amount: number;
  description: string;
  date: Date
}
function CreateOrderExpenseDialoq({ open, onClose, onSave, ...other }: ICreateOrderExpenseDialoqProps) {
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<ICreateOrderExpense>({ all: true, members_Id: [], amount: 0, description: "", date: new Date() });
  const [isSaved, setIsSaved] = useState(false);
  const [CreateExpenseOrder, { isError, isLoading }] = useCreateExpenseOrderMutation()
  const theme = useTheme()

  const onMemberChanged = (items: LabelType[]) => {
    CustomLogger.log("CreateOrderExpenseDialoq/item", items)
    let members = new Array();
    members = items.map((item) => item._id)
    CustomLogger.info("CreateOrderExpenseDialoq/members", members, selectedMembers)
    setSelectedMembers(prev => ({ ...prev, all: false, members_Id: members }))
  }
  const handleOnCancel = () => {
    setValidationAlert([])

    onClose()
  }
  async function handleOnSave(): Promise<void> {
    CustomLogger.log("CreateOrderExpenseDialoq/handleOnSave", selectedMembers)
    try {
      setValidationAlert([])
      setIsSaved(false)
      CreateExpenseOrder(selectedMembers).unwrap().then((results) => {
        const newLocal = "CreateOrderExpenseDialoq/handleOnSave/result"
        CustomLogger.info(newLocal, results)
        if (results.success) {
          setIsSaved(true)
        }
      }).catch((err) => {
        const validation = getValidationFromError(err, handleOnValidatiobClose)
        setValidationAlert(validation)
        CustomLogger.error("CreateOrderExpenseDialoq/handleOnSave/error", err)
      })

    }
    catch (error) {
      CustomLogger.error("CreateOrderExpenseDialoq/handleOnSave/error", error)
      const validation = getValidationFromError(error, handleOnValidatiobClose)
      setValidationAlert(validation)

    }
  }
  const handleOnValidatiobClose = useCallback(() => {
    setValidationAlert([])

  }, [])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    CustomLogger.log("CreateOrderExpenseDialoq/handleChange", event.target.name, event.target.value)
    setSelectedMembers(prev => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  };
  const handleDateChange = (newValue: any | null) => {
    let newDate = (newValue?.toJSDate() === undefined ? new Date() : newValue?.toJSDate()).getMidDayDate();
    
    setSelectedMembers(prev => ({ ...prev, date: newDate }))
  };
  const OnSelectedChanged = (selectedMembers: LabelType[]) => {
    CustomLogger.log("CreateOrderExpenseDialoq/OnSelectedChanged", selectedMembers)
    onMemberChanged(selectedMembers)
  }
  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {


    const newObj: ICreateOrderExpense = SetProperty(selectedMembers, event.target.name, Number(event.target.value).setFix(2)) as ICreateOrderExpense;
    CustomLogger.log("CreateOrderExpenseDialoq/handleNumberChange", event.target.name, event.target.value, newObj)
    setSelectedMembers(newObj)
  };
  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: "100%", maxHeight: "auto" } }}
      maxWidth="lg"

      open={open} {...other}>
      <DialogTitle>Create Order Expense</DialogTitle>
      <DialogContent>
        <Card variant="outlined">
          <CardContent>
            <Grid container sx={{ width: "100%" }} justifyContent="center" columns={12}>
              <Grid item xs={12} sm={12}>
                <TextField fullWidth={true} onChange={handleNumberChange} id="amount" name="amount"

                  type={"number"}
                  label="Amount" placeholder="Amount" variant="standard"
                  value={selectedMembers?.amount} required
                  helperText="" error={false} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item sx={{ marginLeft: "0px" ,marginTop:"1ch"}} xs={12} sm={12}  >
                {/*  <Item sx={{ marginLeft: "0px" }}> */}
                <LocalizationProvider adapterLocale={"en-gb"} dateAdapter={AdapterLuxon}>
                  <ThemeProvider theme={theme}>
                    <MobileDateTimePicker
                      sx={{ width: "100%", paddingLeft: "0ch" }}
                      label="Date"
                      value={DateTime.fromJSDate(selectedMembers.date)}
                      onChange={handleDateChange}
                    />
                  </ThemeProvider>
                </LocalizationProvider>
                {/* </Item> */}
              </Grid>
              <Grid item xs={12} height={'100%'}>
                <MembersOptionCombo OnSelectedChanged={OnSelectedChanged} />
                <Divider light />
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
              {true ? (<><LinearProgress /></>) : null}
              {validationAlert.map((item) => (
                <Grid item xs={12}>
                  <Item>
                    <ValidationAlert {...item} />
                  </Item>
                </Grid>
              ))}
              {(isLoading) ? (
                <>
                  <Grid item xs={12} alignItems={'center'}><Item>Loading</Item></Grid>
                  <Grid item xs={12}><Item><LinearProgress /></Item></Grid>
                </>
              ) : (
                <>
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
                      {isSaved === true ? "Created" : "Create"}
                    </Button></Item>
                  </Grid>
                </>
              )
              }

            </Grid>
          </CardActions>
        </Card>

      </DialogContent>
    </Dialog>
  )
}

export default CreateOrderExpenseDialoq