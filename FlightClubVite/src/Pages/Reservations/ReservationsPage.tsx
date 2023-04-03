
import { Box, Button, Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { useState } from 'react';
import { ITransactionTableFilter } from '../../Components/TransactionTable';

import ContainerPage, { ContainerPageHeader, ContainerPageMain, ContainerPageFooter } from '../Layout/Container';

import React from 'react';
import { IDateFilter, IFilterItems, newDateFilter } from '../../Interfaces/IDateFilter';
import ActionButtons, { EAction } from '../../Components/Buttons/ActionButtons';


import ReservationTable, { IReservationTableFilter } from '../../Components/ReservationTable';
import DatePickerDate from '../../Components/Buttons/DatePickerDate';
import GeneralDrawer from '../../Components/GeneralDrawer';
import { IReservationFilterDate } from '../../Interfaces/API/IFlightReservation';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { SetProperty } from "../../Utils/setProperty.js";
import FilterListIcon from '@mui/icons-material/FilterList';
import CreateReservationDialog from './CreateReservationDialog';
import { IReservationCreateApi } from '../../Interfaces/API/IReservation';
import TodayIcon from '@mui/icons-material/Today';
import CalendarViewWeekIcon from '@mui/icons-material/CalendarViewWeek';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { getMonthFilter, getTodayFilter, getWeekFilter } from '../../Utils/filtering';

const dateFilter: IDateFilter = newDateFilter;


function ReservationPage() {
  const [openFilter, setOpenFilter] = useState(false)
  /* const [dateTo,setDateTo] = useLocalStorage("_filter/dateTo", dateFilter.to)
  const [dateFrom,setDateFrom] = useLocalStorage("_filter/dateFrom", dateFilter.from) */
  const [dateTo, setDateTo] = useState(dateFilter.to)
  const [dateFrom, setDateFrom] = useState(dateFilter.from)
  const [dateRef, setDateRef] = useState(new Date())
  const [filter, setFilter] = useState<ITransactionTableFilter>({ dateFilter: dateFilter } as ITransactionTableFilter);
  const [openReservationAdd, setOpenReservationAdd] = useState(false);

  function onAction(action: EAction, event?: React.MouseEvent<HTMLButtonElement, MouseEvent>, item?: string) {
    event?.defaultPrevented
    CustomLogger.log("AccountExpenseTab/onAction", event?.target, action, item)
    switch (action) {
      case EAction.ADD:
        setOpenReservationAdd(true);
        break;
    }
  }
  const handleAddOnClose = () => {
    setOpenReservationAdd(false);

  }
  const handleAddOnSave = () => {


    setOpenReservationAdd(false);


  }
  const onDateChanged = (key: string, value: Date | null) => {
    CustomLogger.log("AccountOrdersTab/onDateChanged", key, value)
    if (value === null) return;
    const newFilter = SetProperty(filter, key, new Date(value));
    setFilter(newFilter)
    CustomLogger.info("AccountOrdersTab/onDateChanged/newFilter", newFilter)
  }
  const onTodayChanged = () => {
    const todayFilter = getTodayFilter();
    setFilter({ dateFilter: todayFilter } as ITransactionTableFilter);
  }
  const onWeekChanged = () => {
    setDateRef(new Date())
    const todayFilter = getWeekFilter(new Date());
    setFilter({ dateFilter: todayFilter } as ITransactionTableFilter);

  }
  const onPrevWeek = () => {
    const newRefDate = dateRef.addDays(-7)
    setDateRef(newRefDate)
    const todayFilter = getWeekFilter(newRefDate);
    setFilter({ dateFilter: todayFilter } as ITransactionTableFilter);
  }
  const onNextWeek = () => {
    const newRefDate = dateRef.addDays(7)
    setDateRef(newRefDate)
    const todayFilter = getWeekFilter(newRefDate);
    setFilter({ dateFilter: todayFilter } as ITransactionTableFilter);
  }
  const onMonthChanged = () => {
    setDateRef(new Date())
    const todayFilter = getMonthFilter(new Date());
    setFilter({ dateFilter: todayFilter } as ITransactionTableFilter);

  }
  const onPrevMonth = () => {
    const newRefDate = dateRef.addDays(-30)
    setDateRef(newRefDate)
    const todayFilter = getMonthFilter(newRefDate);
    setFilter({ dateFilter: todayFilter } as ITransactionTableFilter);
  }
  const onNextMonth = () => {
    const newRefDate = dateRef.addDays(30)
    setDateRef(newRefDate)
    const todayFilter = getMonthFilter(newRefDate);
    setFilter({ dateFilter: todayFilter } as ITransactionTableFilter);
  }
  let reservationAddIntitial: IReservationCreateApi = {
    date_from: new Date(),
    date_to: new Date(),
    _id_member: "",
    _id_device: ""
  }
  return (
    <>
      <ContainerPage>
        <>
          <ContainerPageHeader>
            <Box marginTop={2} display={'flex'} flexDirection={'row'}>

              <Grid container width={"100%"} height={"100%"} gap={0} columns={12}>
                <Grid item xs={12}>
                  <Typography variant="h6" align="center">Reservation Page</Typography>
                </Grid>
                <Grid item xs={1}>
                  <IconButton aria-label="close" color="inherit" size="small" onClick={() => setOpenFilter(true)}>
                    <FilterListIcon fontSize="inherit" />
                  </IconButton>
                </Grid>
                <Grid item xs={11}>
                  <ActionButtons OnAction={onAction} show={[EAction.ADD]} item="" display={[{ key: EAction.ADD, value: "rESERVATION" }]} />
                </Grid>


              </Grid>
            </Box>
          </ContainerPageHeader>
          <ContainerPageMain>
            <>
              {openReservationAdd && <CreateReservationDialog onClose={handleAddOnClose} value={reservationAddIntitial} open={openReservationAdd} onSave={handleAddOnSave} />}
              <GeneralDrawer open={openFilter} setOpen={setOpenFilter}>
                <List sx={{ display: 'flex', flexDirection: 'column' }}>
                  <ListItem key={"fromDate"} disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <DateRangeIcon />
                      </ListItemIcon>
                      <DatePickerDate value={filter.dateFilter.from === undefined ? new Date() : filter.dateFilter.from} param="dateFilter.from" lable='From Date' onChange={onDateChanged} />

                    </ListItemButton>

                  </ListItem>
                  <ListItem key={"toDate"} disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <DateRangeIcon />
                      </ListItemIcon>
                      <DatePickerDate value={filter.dateFilter.to === undefined ? new Date() : filter.dateFilter.to} param={"dateFilter.to"} lable='To Date' onChange={onDateChanged} />

                    </ListItemButton>

                  </ListItem>
                  <ListItem key={'today'} disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <TodayIcon />
                      </ListItemIcon>
                      <Button onClick={onTodayChanged}>Today</Button>
                    </ListItemButton>
                  </ListItem>
                  <ListItem key={'week'} disablePadding>
                    <ListItemButton onClick={onWeekChanged}>
                      <ListItemIcon>
                        <CalendarViewWeekIcon />
                      </ListItemIcon>
                    </ListItemButton>
                    <ListItemButton onClick={onPrevWeek}>
                      <ListItemIcon>
                        <NavigateBeforeIcon />
                      </ListItemIcon>
                    </ListItemButton>

                    <ListItemButton onClick={onWeekChanged} sx={{ textAlign: 'center' }}>Week</ListItemButton>
                    <ListItemButton>
                      <ListItemIcon onClick={onNextWeek}>
                        <NavigateNextIcon />
                      </ListItemIcon>
                    </ListItemButton>


                  </ListItem>
                  <ListItem key={'month'} disablePadding>
                    <ListItemButton onClick={onMonthChanged}>
                      <ListItemIcon>
                        <CalendarMonthIcon />
                      </ListItemIcon>
                    </ListItemButton>
                    <ListItemButton onClick={onPrevMonth}>
                      <ListItemIcon>
                        <NavigateBeforeIcon />
                      </ListItemIcon>
                    </ListItemButton>

                    <ListItemButton onClick={onMonthChanged} sx={{ textAlign: 'center' }}>Month</ListItemButton>
                    <ListItemButton onClick={onNextMonth}>
                      <ListItemIcon>
                        <NavigateNextIcon />
                      </ListItemIcon>
                    </ListItemButton>


                  </ListItem>

                </List>


              </GeneralDrawer>

              <ReservationTable filter={filter as IReservationTableFilter} />

            </>

          </ContainerPageMain>
          <ContainerPageFooter>
            <>
              reservation
            </>
          </ContainerPageFooter>
        </>

      </ContainerPage>
    </>


  )
}

export default ReservationPage
