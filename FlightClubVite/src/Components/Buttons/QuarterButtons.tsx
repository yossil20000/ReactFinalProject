import { Box, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from "@mui/material"
import { EQuarterOption } from "../../Utils/enums";
import { useEffect, useState } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DateTime } from "luxon";
import { IQuarterFilter } from "../../Interfaces/IDateFilter";
import { borders } from '@mui/system';

export interface IQuarterButtonsProps {
  quarterFilter: IQuarterFilter;
  onChange: (filter: IQuarterFilter) => void;
}

function QuarterButtons(props: IQuarterButtonsProps) {
  const [quarter, setQuarter] = useState<EQuarterOption>(props.quarterFilter.quarter);
  const [year, setYear] = useState<Date>(new Date(props.quarterFilter.year, 1, 0))
  useEffect(() => {
    CustomLogger.info("QuarterButtons/props", props)
    setQuarter(props.quarterFilter.quarter)
  }, [props.quarterFilter.quarter])

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
      <LocalizationProvider adapterLocale={"en-gb"} dateAdapter={AdapterLuxon}>
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
        <ToggleButton sx={{visibility: "visible" , width: 10}} value={EQuarterOption.E_QO_Q0} aria-lable="quarter 0" size="small"> <Tooltip title="Select Q0" ><Typography>N</Typography></Tooltip></ToggleButton>
        <ToggleButton value={EQuarterOption.E_QO_Q1} aria-lable="quarter 1" size="small"> <Tooltip title="Select Q1" ><Typography>Q1</Typography></Tooltip></ToggleButton>
        <ToggleButton value={EQuarterOption.E_QO_Q2} aria-lable="quarter 2" size="small"> <Tooltip title="Select Q2" ><Typography>Q2</Typography></Tooltip></ToggleButton>
        <ToggleButton value={EQuarterOption.E_QO_Q3} aria-lable="quarter 3" size="small"> <Tooltip title="Select Q3" ><Typography>Q3</Typography></Tooltip></ToggleButton>
        <ToggleButton value={EQuarterOption.E_QO_Q4} aria-lable="quarter 4" size="small"> <Tooltip title="Select Q4" ><Typography>Q4</Typography></Tooltip></ToggleButton>
      </ToggleButtonGroup>
    </Box>
  )
}

export default QuarterButtons