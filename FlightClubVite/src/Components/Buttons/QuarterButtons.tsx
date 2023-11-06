import { Box, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from "@mui/material"
import { EQuarterOption } from "../../Utils/enums";
import { useState } from "react";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DateTime } from "luxon";

export interface IQuarterFilter {
  quarter: EQuarterOption;
  year: number;
}
export interface IQuarterButtonsProps {
  quarterFilter: IQuarterFilter;
  onChange: (filter: IQuarterFilter) => void;
}

function QuarterButtons(props: IQuarterButtonsProps) {
  const [quarter, setQuarter] = useState<EQuarterOption>(props.quarterFilter.quarter);
  const [year, setYear] = useState<Date>(new Date(props.quarterFilter.year, 1, 0))

  const handleQuarterChanged = (
    event: React.MouseEvent<HTMLElement>,
    newQuarter: EQuarterOption) => {
    if (newQuarter !== null) {
      setQuarter(newQuarter);
      props.onChange({ quarter: newQuarter, year: year.getFullYear() })
    }
  };

  return (
    <Box display={'flex'} justifyContent={"center"} width={'100%'}>
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <DatePicker label={'year'} views={['year']}
            value={DateTime.fromJSDate(year)}
            onChange={(newValue) => {
              console.log("DatePicker", newValue)
              if (newValue !== null) {
                setYear(newValue.toJSDate());
                props.onChange({ quarter: quarter, year: newValue.year })
              }
            }} />
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