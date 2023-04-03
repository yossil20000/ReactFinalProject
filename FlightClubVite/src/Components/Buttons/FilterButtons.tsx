import { alpha,Box, Button, createTheme, IconButton, TextField, ThemeProvider, Toolbar, Tooltip, useMediaQuery } from "@mui/material";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DateTime } from "luxon";
import SplitedButton from "./SplitedButton";
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import { IReservationFilterDate } from "../../Interfaces/API/IFlightReservation";
export interface EnhancedTableToolbarProps {
  setFilterDate: React.Dispatch<React.SetStateAction<IReservationFilterDate>>;
  filterDate: IReservationFilterDate;
  isFilterOwner: boolean;
  OnFilterOwner: () => void;
  handleFilterClick(selectedIndex: number) : void;
  isByDateRange: boolean;
  
}
const defaultMaterialThem = createTheme({

})

export default  function FilterButtons(props: EnhancedTableToolbarProps) {
  const { isByDateRange, OnFilterOwner, isFilterOwner, handleFilterClick, filterDate, setFilterDate } = props;
  const dateRangeBP = useMediaQuery('(min-width:410px)');
  CustomLogger.log("EnhancedTableToolbar/isbydateRange", isByDateRange);
  const handleFromDateFilterChange = (newValue: DateTime | null) => {
    if (newValue !== null) {
      let newDate = newValue?.toJSDate();
      if (newDate && filterDate.to && newDate <= filterDate.to){
        setFilterDate((prev) => ({ ...prev, from: new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), 0, 0, 0) }));
      }
        
    }
  };
  const handleToDateFilterChange = (newValue: DateTime | null) => {
    if (newValue !== null) {
      let newDate = newValue?.toJSDate();
      if (newDate !== null && filterDate.from && newDate >= filterDate.from) {
        setFilterDate((prev) => ({ ...prev, to: new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), 23, 59, 59) }));
      }
    }

  };
  const selectedDateFilterOptions = ["Today", 'Week', "Month", "ByRange"];

  return (
    <Toolbar
      sx={{
        zIndex: "100",
        pl: { sm: 1 },
        pr: { xs: 1, sm: 1 },
        ...(isFilterOwner && {
          bgcolor: (them) =>
            alpha(them.palette.primary.main, them.palette.action.activatedOpacity),
        }),
      }}
    >
      <Box display={"flex"} justifyContent={"space-between"} sx={{ flexGrow: 1 }}>
        <SplitedButton options={selectedDateFilterOptions} handleClick={handleFilterClick} />
        {isByDateRange || dateRangeBP ? (
          <LocalizationProvider dateAdapter={AdapterLuxon}>
            <ThemeProvider theme={defaultMaterialThem}>
              <MobileDatePicker
                label="From Date"
                value={filterDate.from}
                onChange={handleFromDateFilterChange}
                renderInput={(params) => <TextField {...params} size={'small'} helperText={null} sx={{ label: { color: "#2196f3" }, ml: { sm: 1 }, }} />}
              />
              <MobileDatePicker

                label="To Date"
                value={filterDate.to}
                onChange={handleToDateFilterChange}
                renderInput={(params) => <TextField {...params} size={'small'} color={'error'} sx={{ label: { color: "#2196f3" }, ml: { sm: 1 } }} />}
              />
            </ThemeProvider>

          </LocalizationProvider>

        ) :
          (null)

        }

      </Box>
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