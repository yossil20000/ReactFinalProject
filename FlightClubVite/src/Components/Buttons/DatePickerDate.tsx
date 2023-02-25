import { ThemeProvider } from "@emotion/react";
import { createTheme, TextField } from "@mui/material";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
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
      <MobileDatePicker
        disableMaskedInput
        label={lable}

        mask=''
        value={value}
        onChange={(value) => onChange(param, value)}
        renderInput={(params) => <TextField {...params} size={'small'} helperText={null} sx={{ width: "100%", label: { color: "#2196f3" }, ml: { sm: 1 }, marginLeft: "0" }} />}
      />

    </ThemeProvider>

  </LocalizationProvider>
  )
}