import * as React from 'react';
import { styled, ThemeProvider, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import { createTheme, ListItemIcon } from '@mui/material';
import { LocalizationProvider, MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';

import DateRangeIcon from '@mui/icons-material/DateRange';
import { IFilterItems } from '../Interfaces/IDateFilter';
import { DateTime } from 'luxon';
const drawerWidth = 320;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  height: '0',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export interface FilterDrawerProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  onFilterChanged: (key: string, value: any) => void
  items: IFilterItems[];
  children?: string | JSX.Element | JSX.Element[] | (() => JSX.Element);
}
export default function FilterDrawer({ setOpen, open, onFilterChanged, items, children }: FilterDrawerProps) {
  const theme = useTheme();
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const defaultMaterialThem = createTheme({

  })
  const onDateChanged = (key: string, value: Date | null) => {
    CustomLogger.log("FilterDrawer/onDateChanged", key, value)
    const found = items.find((item) => item.key === key)
    CustomLogger.info("FilterDrawer/onDateChanged/found", found)
    if (found) {
      found.setValue(value)
      onFilterChanged(found.key, value)
    }

  }
  const getDate = (key: string): Date => {
    const found = items.find((item) => item.key === key)
    if (found) {
      CustomLogger.info("FilterDrawer/getDate", key, found.value)
      return new Date(found.value)
    }
    return new Date()
  }
  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        sx={{
          width: 'auto',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List sx={{ display: 'flex', flexDirection: 'column' }}>
          <ListItem key={"fromDate"} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <DateRangeIcon />
              </ListItemIcon>
              <LocalizationProvider adapterLocale={"en-gb"} dateAdapter={AdapterLuxon}>
                <ThemeProvider theme={defaultMaterialThem}>
                  <MobileDateTimePicker
                    views={["year", "month", "day"]}
                    label="From Date"
                    value={DateTime.fromJSDate(getDate("fromDate"))}
                    onChange={(value) => onDateChanged("fromDate", value == undefined ? new Date() : value?.toJSDate())}
                  />
                </ThemeProvider>
              </LocalizationProvider>
            </ListItemButton>
          </ListItem>
          <ListItem key={"toDate"} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <DateRangeIcon />
              </ListItemIcon>
              <LocalizationProvider adapterLocale={"en-gb"} dateAdapter={AdapterLuxon}>
                <ThemeProvider theme={defaultMaterialThem}>
                  <MobileDateTimePicker
                    views={["year", "month", "day"]}
                    label="To Date"
                    value={DateTime.fromJSDate(getDate('toDate'))}
                    onChange={(value) => onDateChanged("toDate", value == undefined ? new Date() : value?.toJSDate())}
                  />
                </ThemeProvider>
              </LocalizationProvider>
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        {children === undefined ? null : <>{children}</>}
      </Drawer>
    </Box>
  );
}