import { alpha,Box, createTheme, IconButton, TextField, ThemeProvider, Toolbar, Tooltip } from "@mui/material";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DateTime } from "luxon";
import SplitedButton from "./SplitedButton";
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';

export interface EnhancedTableToolbarProps {
  fromDateFilter: Date | null;
  setFromDateFilter: React.Dispatch<React.SetStateAction<Date | null>>;
  setToDateFilter: React.Dispatch<React.SetStateAction<Date | null>>;
  toDateFilter: Date | null;
  isFilterOwner: boolean;
  OnFilterOwner: () => void;
  handleFilterClick(selectedIndex: number): number;
  isByDateRange: boolean;
}
const defaultMaterialThem = createTheme({

})

export default  function FilterButtons(props: EnhancedTableToolbarProps) {
  const { isByDateRange, OnFilterOwner, isFilterOwner, handleFilterClick, setFromDateFilter, setToDateFilter, fromDateFilter, toDateFilter } = props;
  console.log("isbydateRange", isByDateRange);
  const handleFromDateFilterChange = (newValue: DateTime | null) => {
    let newDate = newValue?.toJSDate();
    if (newDate && toDateFilter && newDate <= toDateFilter)
      setFromDateFilter(new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), 0, 0, 0));
  };
  const handleToDateFilterChange = (newValue: DateTime | null) => {
    let newDate = newValue?.toJSDate();
    if (newDate && fromDateFilter && newDate >= fromDateFilter)
      setToDateFilter(new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), 23, 59, 59));
  };
  const selectedDateFilterOptions = ["Today", 'Week', "Month", "ByRange", "All"];

  return (
    <Toolbar
      sx={{

        pl: { sm: 1 },
        pr: { xs: 1, sm: 1 },
        ...(isFilterOwner && {
          bgcolor: (them) =>
            alpha(them.palette.primary.main, them.palette.action.activatedOpacity),
        }),
      }}
    >
      <SplitedButton options={selectedDateFilterOptions} handleClick={handleFilterClick} />
      {isByDateRange ? (
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <ThemeProvider theme={defaultMaterialThem}>
            <MobileDatePicker
              label="From Date"
              value={fromDateFilter}
              onChange={handleFromDateFilterChange}
              renderInput={(params) => <TextField {...params} size={'small'} helperText={null} sx={{ label: { color: "#2196f3" }, ml: { sm: 1 }, }} />}
            />
            <MobileDatePicker

              label="To Date"
              value={toDateFilter}
              onChange={handleToDateFilterChange}
              renderInput={(params) => <TextField {...params} size={'small'} color={'error'} sx={{ label: { color: "#2196f3" }, ml: { sm: 1 } }} />}
            />
          </ThemeProvider>

        </LocalizationProvider>
      ) :
        (null)

      }


      <Box sx={{ flexGrow: 1 }} />


      {isFilterOwner == false ? (
        <Tooltip title="Show Mine">
          <IconButton onClick={OnFilterOwner}>
            <PeopleIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Show All">

          <IconButton onClick={OnFilterOwner}>
            <PersonIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  )
}