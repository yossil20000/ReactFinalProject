import { Box, TextField, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from "@mui/material"
import { EQuarterOption } from "../../Utils/enums";
import { useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";

export interface IQuarterButtonsProps {
  quarter: number;
  year: number
}

function QuarterButtons(props: IQuarterButtonsProps) {
  const [quarter, setQuarter] = useState<EQuarterOption>(props.quarter);
  const [year, setYear] = useState<Date | null>(new Date(props.year,1,0))
  
  const handleQuarterChanged = (
    event: React.MouseEvent<HTMLElement>,
    newQuarter: EQuarterOption | null,) => {
    if (newQuarter !== null)
      setQuarter(newQuarter);
  };

  return (
    <Box display={'flex'} justifyContent={"center"} width={'100%'}>
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <DatePicker
          views={['year']}
          label="Year"
          value={year}
          onChange={(newValue) => {
            setYear(newValue);
          }}
          renderInput={(params) => <TextField {...params} helperText={null} />}
        />
      </LocalizationProvider>
      <ToggleButtonGroup value={quarter} exclusive aria-label="quarter select" onChange={handleQuarterChanged} >
        <ToggleButton value={EQuarterOption.E_QO_Q1} aria-lable="quarter 1" size="small"> <Tooltip title="Select Q1" ><></></Tooltip><Typography>Q1</Typography></ToggleButton>
        <ToggleButton value={EQuarterOption.E_QO_Q2} aria-lable="quarter 2" size="small"> <Tooltip title="Select Q2" ><></></Tooltip><Typography>Q2</Typography></ToggleButton>
        <ToggleButton value={EQuarterOption.E_QO_Q3} aria-lable="quarter 3" size="small"> <Tooltip title="Select Q3" ><Typography>Q3</Typography></Tooltip></ToggleButton>
        <ToggleButton value={EQuarterOption.E_QO_Q4} aria-lable="quarter 4" size="small"> <Tooltip title="Select Q4" ><></></Tooltip><Typography>Q4</Typography></ToggleButton>
      </ToggleButtonGroup>
    </Box>
  )
}

export default QuarterButtons