
import { Box, Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon, Typography } from '@mui/material';
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
const dateFilter: IDateFilter = newDateFilter;

function ReservationPage() {
  const [openFilter, setOpenFilter] = useState(false)
  /* const [dateTo,setDateTo] = useLocalStorage("_filter/dateTo", dateFilter.to)
  const [dateFrom,setDateFrom] = useLocalStorage("_filter/dateFrom", dateFilter.from) */
  const [dateTo, setDateTo] = useState(dateFilter.to)
  const [dateFrom, setDateFrom] = useState(dateFilter.from)
  const [filter, setFilter] = useState<ITransactionTableFilter>({ dateFilter: dateFilter } as ITransactionTableFilter);
  const [openReservationAdd, setOpenReservationAdd] = useState(false);


  const onFilterChanged = (key: string, value: any): void => {
    console.log("onFilterChanged/key,value,filter", key, value, filter)
    const newKey = key == 'fromDate' ? "from" : key == 'toDate' ? 'to' : "";
    if (newKey == "") { console.log("onFilterChanged/ value not set", key); return }

    const newObj = SetProperty(filter, `dateFilter.${newKey}`, new Date(value));
    setFilter(newObj);

  }
  const getItems = (): IFilterItems[] => {
    return [{ key: "toDate", value: dateTo, setValue: setDateTo }, { key: "fromDate", value: dateFrom, setValue: setDateFrom }] as IFilterItems[]
  }
  function onAction(action: EAction, event?: React.MouseEvent<HTMLButtonElement, MouseEvent>, item?: string) {
    event?.defaultPrevented
    console.log("AccountExpenseTab/onAction", event?.target, action, item)
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
    console.log("AccountOrdersTab/onDateChanged", key, value)
    if(value === null) return;
    const newFilter = SetProperty(filter, key, new Date(value));
    setFilter(newFilter)
    console.log("AccountOrdersTab/onDateChanged/newFilter", newFilter)
  }
  let reservationAddIntitial: IReservationCreateApi = {
    date_from: new Date(),
    date_to: new Date(),
    _id_member: "",
    _id_device: ""
  }
  return (
    <>
      <div className='header'><Typography variant="h6" align="center">Reservation Page</Typography></div>
      <div className='main' style={{ overflow: 'auto' }}>
        <ContainerPage>
          <>
            <ContainerPageHeader>
              <Box marginTop={2}>
                <Grid container width={"100%"} height={"100%"} gap={0} columns={12}>
                  <Grid item xs={1}>
                    <IconButton aria-label="close" color="inherit" size="small" onClick={() => setOpenFilter(true)}>
                      <FilterListIcon fontSize="inherit" />
                    </IconButton>
                  </Grid>
                  <Grid item xs={3}>
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

                  </List>


                </GeneralDrawer>

                <ReservationTable filter={filter as IReservationTableFilter} />

              </>

            </ContainerPageMain>
            <ContainerPageFooter>
              <>
                footer
              </>
            </ContainerPageFooter>
          </>

        </ContainerPage>
      </div>
      <div className='footer'>main footer</div>
    </>


  )
}

export default ReservationPage
