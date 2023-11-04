import { ThemeProvider } from "@emotion/react";
import { createTheme, TextField } from "@mui/material";
import { LocalizationProvider, MobileDatePicker, MobileDateTimePicker } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DateTime } from "luxon";
export interface IDatePickerProps {
  param: string;
  lable: string;
  value: Date;
  onChange: (key: string ,value: Date | null, keyboardInputValue?: string | undefined) => void
}
export default function DatePickerDate({value,param,lable, onChange}: IDatePickerProps){
  const defaultMaterialThem = createTheme({

  })
  return(
    <LocalizationProvider dateAdapter={AdapterLuxon}>
    <ThemeProvider theme={defaultMaterialThem}>
      <MobileDateTimePicker  
      views={["year","month",'day']} 
      defaultValue={DateTime.now()}
        label={lable}
        value={DateTime.fromJSDate( value)}
        onChange={(value) => onChange(param, value == undefined ? new Date() : value?.toJSDate() )} 
      />
    </ThemeProvider>
  </LocalizationProvider>
  )
}