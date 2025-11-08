/* import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'; */
import "../../Types/date.extensions"

import { Box, Button, Grid, List, ListItem, ListItemButton, ListItemIcon, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, TableSortLabel, ToggleButton, ToggleButtonGroup, Tooltip, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { visuallyHidden } from '@mui/utils';
import MediaQuery from "react-responsive";
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps, } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

import { useFetchAllReservationsQuery, useDeleteReservationMutation } from '../../features/Reservations/reservationsApiSlice';
import GeneralCanDo, { CanDo } from '../../Utils/owner';
import { useAppSelector } from '../../app/hooks';


import { ILoginResult } from "../../Interfaces/API/ILogin.js";
import IReservation, { GetInitReservationAdd, IReservationCreateApi, IReservationDelete, IReservationUpdate } from "../../Interfaces/API/IReservation.js";
import UpdateReservationDialog from "./UpdateReservationDialog";
import CreateReservationDialog from "./CreateReservationDialog.js";
import { IReservationFilterDate } from "../../Interfaces/API/IFlightReservation.js";
import { getFullMonthFilter } from "../../Interfaces/IDateFilter.js";
import { getDayFilter, getMonthFilter, getTodayFilter, getWeekFilter } from "../../Utils/filtering.js";
import DatePickerDate from "../../Components/Buttons/DatePickerDate.js";
import GeneralDrawer from "../../Components/GeneralDrawer.js";
import DateRangeIcon from '@mui/icons-material/DateRange';
import { SetProperty } from "../../Utils/setProperty.js";
import TodayIcon from '@mui/icons-material/Today';
import CalendarViewWeekIcon from '@mui/icons-material/CalendarViewWeek';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TableChartIcon from '@mui/icons-material/TableChart';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import ActionButtons, { EAction } from "../../Components/Buttons/ActionButtons.js";
import TableViewIcon from '@mui/icons-material/TableView';
import CalnanderViewDay from "../../Components/Calander/CalnanderViewDay.js";
import { EfilterMode, EviewMode } from "../../Utils/enums";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FullScreenLoader from "../../Components/FullScreenLoader";
import MembersCombo from "../../Components/Members/MembersCombo";
import { MemberType } from "../../Interfaces/API/IMember";
import { InputComboItem } from "../../Components/Buttons/ControledCombo";
import ConfirmationDialog, { ConfirmationDialogProps } from "../../Components/ConfirmationDialog";
import CalanderViewMonth, { IDisplayCell } from "../../Components/Calander/CalanderViewMonth";
import { DateTime } from "luxon";
import useClubNotices from "../../hooks/useClubNotices";
//consts size
const xsPixels = '0.83rem';
const smPixels = '1.3rem';
const mdPixels = '1.5rem';
//const dateFilter: IDateFilter = fullMonthFilter;
interface ItableData {
  _id_reservaion: string; _id_member: string; name: string;
  device_name: string; date_from: Date; date_to: Date; member_id: string; validOperation: CanDo;
}

function createdata(_id_reservaion: string, _id_member: string, member_id: string,
  name: string, device_name: string, date_from: Date, date_to: Date, validOperation: CanDo): ItableData {
  return { _id_reservaion, _id_member, member_id, name, device_name, date_from: new Date(date_from), date_to: new Date(date_to), validOperation } as ItableData
}
function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  /* CustomLogger.info("descendingComparator", a, b, orderBy) */
  if (b[orderBy] < a[orderBy]) { return -1 }
  if (b[orderBy] > a[orderBy]) { return 1 }
  return 0;
}
type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string | Date | boolean },
  b: { [key in Key]: number | string | Date | boolean },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof ItableData;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  { id: "device_name", label: "Device", numeric: false, disablePadding: true },
  { id: "date_from", label: "From", numeric: false, disablePadding: true },
  { id: "date_to", label: "To", numeric: false, disablePadding: true },
  { id: "name", label: "Name", numeric: false, disablePadding: true },
  { id: "member_id", label: "IdNumber", numeric: false, disablePadding: true },


]
interface IEnhancedTableHeadProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof ItableData) => void;
  order: Order;
  orderBy: string;
  /* handleReservationAdd: () => void; */
}
function EnhancedTableHead(props: IEnhancedTableHeadProps) {

  const { order, orderBy, onRequestSort } =
    props;
  const createSortHandler = (property: keyof ItableData) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (

    <TableHead style={{ minWidth: "320px" }}>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'center' : 'center'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order == 'desc' ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}


      </TableRow>
    </TableHead>

  )
}

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9em' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));
let reservationUpdateIntitial: IReservationUpdate = {
  date_from: new Date(),
  date_to: new Date(),
  _id: "",
  device_name: "",
  member_name: "",
  timeOffset: 0,
  time_from: 0,
  time_to: 0
}



function ReservationsPage() {
  const theme = useTheme();
   const [clubNotices, alertView] = useClubNotices();
   
  const [viewMode, setViewMode] = useState<EviewMode>(EviewMode.E_VM_MONTH);
  const [dateRef, setDateRef] = useState(new Date())
  const [openFilter, setOpenFilter] = useState(false)
  const [filterDate, setFilterDate] = useState<IReservationFilterDate>(getFullMonthFilter(new Date()) as IReservationFilterDate);
  const [openReservationAdd, setOpenReservationAdd] = useState(false);
  const login: ILoginResult = useAppSelector<ILoginResult>((state) => state.authSlice);
  const { data: reservations, isError, isLoading, isSuccess, error, refetch } = useFetchAllReservationsQuery(filterDate);
  const [rows, setRows] = useState<ItableData[]>([])
  const [DeleteReservation] = useDeleteReservationMutation();
  const [isReservationUpdate, setIsReservationUpdate] = useState(false);
  const [reservationUpdate, setReservationUpdate] = useState<IReservationUpdate>(reservationUpdateIntitial);
  const [filterMode, setFilterMode] = useState<EfilterMode>(EfilterMode.E_FM_MONTH)
  const [selectedMember, setSelectedMember] = useState<InputComboItem>();
  const [confirmation, setConfirmation] = useState<ConfirmationDialogProps>({ open: false, isOperate: false } as ConfirmationDialogProps);
  function SetReservationUpdate(id_reservation: string) {
    const reservation = rows.filter(item => item._id_reservaion === id_reservation)
    if (reservation.length === 1 && reservation[0].name) {
      CustomLogger.info("RenderReservationUpdate/filter", reservation);
      reservationUpdateIntitial._id = reservation[0]._id_reservaion;
      reservationUpdateIntitial.date_from = reservation[0].date_from;
      reservationUpdateIntitial.date_to = reservation[0].date_to;
      reservationUpdateIntitial.device_name = reservation[0].device_name;
      reservationUpdateIntitial.member_name = `${reservation[0].name} ${reservation[0].member_id}`
      reservationUpdateIntitial.time_from = reservation[0].date_from.getTime()
      reservationUpdateIntitial.timeOffset = reservation[0].date_from.getTimezoneOffset()
      reservationUpdateIntitial.time_to = reservation[0].date_to.getTime()
      setReservationUpdate(reservationUpdateIntitial);
    }
  }
  useEffect(() => {
    let rows: ItableData[] = []
    if (reservations?.data) {
      const rows1 = reservations?.data.filter((item) => filterReservation(item))
      /* CustomLogger.info('Reservation/UseEffect/rows/rows1',reservations?.data, rows1) */
      rows = rows1.map((item) => {
        if (item.member)
          return createdata(item._id, item.member._id, item.member.member_id, `${item.member.family_name} ${item.member.first_name}`, item.device.device_id, item.date_from, item.date_to, GeneralCanDo(item.member._id, login.member._id, login.member.roles))
        return createdata(item._id, "_id", "member_id", `family_name .first_name`, item.device.device_id, item.date_from, item.date_to, GeneralCanDo("_id", login.member._id, login.member.roles))
      })
    }
    CustomLogger.info('Reservation/UseEffect/rows/be', rows)
    if (rows === undefined) {
      rows = [];
    }
    setRows(rows);
    CustomLogger.info('UseEffect/rows', rows)

  }, [reservations?.data, selectedMember])

  /* Table Section */
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof ItableData>('_id_reservaion');

  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [isFilterOwner, setIsFilterOwner] = useState(false);
 useEffect(() => {
  CustomLogger.info("useEffect/filterDate", filterDate)
  refetch()
 },[filterDate])
  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof ItableData) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  // Avoid a layout jump when reaching the last page with empty rows.

  const [expanded, setExpanded] = React.useState<string | false>('panel0');

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const handleDelete = async (_id: string) => {
    const reservationDelete: IReservationDelete = {
      _id: _id
    }
    CustomLogger.log("Delete /", _id);
    try {
      const payload = await DeleteReservation(reservationDelete)
        .unwrap()
        .then((payload) => {
          CustomLogger.info("DeleteReservation Fullfill", payload)
          refetch();
          setConfirmation((prev) => ({ ...prev, open: false, isOperate: false }))
        });
    }
    catch (err) {
      CustomLogger.error("DeleteReservation/err", err)
      setConfirmation((prev) => ({ ...prev, open: false, isOperate: false }))
    }
  }

  const handleEditClick = async (event: React.MouseEvent<unknown>, _id: string) => {
    SetReservationUpdate(_id);
    setIsReservationUpdate(true);
  }
  const handleUpdateOnClose = () => {
    setIsReservationUpdate(false);
  }
  const handleUpdateOnSave = (value: IReservationUpdate) => {
    setIsReservationUpdate(false);
    CustomLogger.log("UpdateReservationDialog/handleOnSave/value", value);

  }
  const handleAddOnSave = (value: IReservationCreateApi) => {
    refetch();
    setOpenReservationAdd(false);
    CustomLogger.info("ReservationPage/handleAddOnSave/value", value);

  }
  const handleAddOnClose = () => {
    setOpenReservationAdd(false);
  }

  function onAction(action: EAction, event?: React.MouseEvent<HTMLButtonElement, MouseEvent>, item?: string) {
    event?.defaultPrevented
    CustomLogger.log("ReservationPage/onAction", event?.target, action, item)
    switch (action) {
      case EAction.ADD:
        setOpenReservationAdd(true);
        break;
    }
  }
  const onFilterModeNext = () => {
    switch (filterMode) {
      case EfilterMode.E_FM_DAY:
        onNextDay();
        break;
      case EfilterMode.E_FM_MONTH:
        onNextMonth();
        break;
      case EfilterMode.E_FM_WEEK:
        onNextWeek()
        break;

    }
    
  }
  const onFilterModePrev = () => {
    switch (filterMode) {
      case EfilterMode.E_FM_DAY:
        onPrevDay();
        break;
      case EfilterMode.E_FM_MONTH:
        onPrevMonth();
        break;
      case EfilterMode.E_FM_WEEK:
        onPrevWeek()
        break;

    }
  }
  const onDateChanged = (key: string, value: Date | null) => {
    CustomLogger.log("ReservationPage/onDateChanged", key, value)
    if (value == null)
      return;

    const newFilter = SetProperty(filterDate, key, new Date(value));
    setFilterDate(newFilter)
    /* refetch() */
  }
  const OnMonthViewDateChange = (date: Date) => {
    CustomLogger.log("ReservationPage/OnMonthViewDateChange", date)
    setDateRef(date)
    const newFilter: IReservationFilterDate = getFullMonthFilter(date) as IReservationFilterDate;
    setFilterDate(newFilter)
    /* refetch() */
    CustomLogger.log("ReservationPage/OnMonthViewDateChange_newFilter", newFilter)
  }
  const onTodayChanged = () => {
    const filter = getTodayFilter();
    setFilterDate(filter);
    setFilterMode(EfilterMode.E_FM_DAY)
  }
  const onWeekChanged = () => {
    setDateRef(new Date())
    const filter = getWeekFilter(new Date());
    setFilterDate(filter);
    setFilterMode(EfilterMode.E_FM_WEEK)
  }
  const onPrevDay = () => {
    const newRefDate = dateRef.addDays(-1)
    setDateRef(newRefDate)
    const filter = getDayFilter(newRefDate);
    setFilterDate(filter);
  }
  const onNextDay = () => {
    const newRefDate = dateRef.addDays(1)
    setDateRef(newRefDate)
    const filter = getDayFilter(newRefDate);
    setFilterDate(filter);
  }
  const onPrevWeek = () => {
    const newRefDate = dateRef.addDays(-7)
    setDateRef(newRefDate)
    const filter = getWeekFilter(newRefDate);
    setFilterDate(filter);
  }
  const onNextWeek = () => {
    const newRefDate = dateRef.addDays(7)
    setDateRef(newRefDate)
    const filter = getWeekFilter(newRefDate);
    setFilterDate(filter);
  }
  const onMonthChanged = () => {
    setDateRef(new Date())
    const filter = getMonthFilter(new Date());
    setFilterDate(filter);
    setFilterMode(EfilterMode.E_FM_MONTH)

  }
  const onPrevMonth = () => {
    const newRefDate = dateRef.addDays(-30)
    setDateRef(newRefDate)
    const filter = getMonthFilter(newRefDate);
    setFilterDate(filter);
  }
  const onNextMonth = () => {
    const newRefDate = dateRef.addDays(30)
    setDateRef(newRefDate)
    const filter = getMonthFilter(newRefDate);
    setFilterDate(filter);
  }
  const handleViewMode = (event: React.MouseEvent<HTMLElement>, newView: EviewMode | null) => {
    if (newView !== null)
      setViewMode(newView);
    if (newView === EviewMode.E_VM_MONTH) {
      setFilterMode(EfilterMode.E_FM_MONTH)
      OnMonthViewDateChange(dateRef)
    }
  };
 const getMonthReservations = () : IDisplayCell[] => {
  let monthViewDisplay : IDisplayCell[] = [];
  const numOfDays = DateTime.local(dateRef.getFullYear(), dateRef.getMonth()+1).daysInMonth as number
  const today  :Date = new Date()
  Array.from({ length: numOfDays }).map((_,index) => {
    const date = index +1
    const viewDayReservation = reservations?.data.filter((element) => new Date(new Date(dateRef.getFullYear(), dateRef.getMonth(),date)).isIntersec(new Date(element.date_from),new Date(element.date_to)))
    let displayStyle : React.CSSProperties  = {backgroundColor: '#cce3f6', fontWeight: 'bold'}
    if(today.isSameDate(new Date(dateRef.getFullYear(),dateRef.getMonth(),index+1))) displayStyle = {backgroundColor: '#dfecf6'}
    monthViewDisplay[date] = { 
    display : <><b style={{fontSize: '1.2em'}}>{`Resrve ${viewDayReservation?.length}`}</b>{ ``}</>,
     displayStyle: displayStyle,
     headerStyle: (viewDayReservation?.length === undefined  || viewDayReservation?.length == 0) ? {backgroundColor: "#9abce1", color: "#0067fe", fontSize:"1em"} : {backgroundColor: "#99cccc", color: "#0067fe", fontSize:"1.1em"}
  }})
  CustomLogger.info("ReservationPage/getMonthReservations/monthViewDisplay", monthViewDisplay)
  return monthViewDisplay
 }
  const getViewDayReservations = (): IReservation[] => {
    
    const viewDayReservation = reservations?.data.filter((element) => dateRef.isIntersec(new Date(element.date_from),new Date(element.date_to)))
    CustomLogger.info("ReservationPage/getViewDayReservations/dateRef,viewDayReservation", dateRef,viewDayReservation)
    if (viewDayReservation !== undefined)
      return viewDayReservation;
    return []
  }
  if (isLoading) {
    CustomLogger.info('ReservationPage/isLoading', isLoading)
    return (
      <div className='main' style={{ overflow: 'auto' }}>
        <FullScreenLoader />
      </div>
    )
  }
  if (error) {
    if ('status' in error) {
      // you can access all properties of `FetchBaseQueryError` here
      const errMsg = 'error' in error ? error.error : JSON.stringify(error.data)
      CustomLogger.error('ReservationPage/error', errMsg)
      return (
        <div>
          <div>An error has occurred:</div>
          <div>{errMsg}</div>
        </div>
      )
    } else {
      // you can access all properties of `SerializedError` here
      return <div>{error.message}</div>
    }
  }
  const onMemberChanged = (item: InputComboItem) => {
    setSelectedMember(item)
  }
  const filterReservation = function (reservation: IReservation): Boolean {
    /* CustomLogger.log("FlightPage/filterMember/", flights === undefined ? "Undefined" : flight) */
    if (selectedMember?._id.trim().length === 0) return true;
    if (reservation.member._id == selectedMember?._id) {
      CustomLogger.log("Reservation/filterReservation/", selectedMember, reservation, true)
      return true;
    }
    CustomLogger.log("Reservation/filterReservation/", selectedMember, reservation, false)
    return false

  }
  const onConfirmationClose = (value: boolean, action: string) => {
    CustomLogger.info("Reservation/onConfirmationClose", confirmation, value)
    if (value) {
      if (action === "DELETE_RESERVATION") {
        setConfirmation((prev) => ({ ...prev, isOperate: true }))
        handleDelete(confirmation.key === undefined ? "" : confirmation.key)
      }
      else
        setConfirmation((prev) => ({ ...prev, open: false }))
      CustomLogger.info("Reservation/OnDeleteFlight/key", confirmation.key)
    }
    else
      setConfirmation((prev) => ({ ...prev, open: false, isOperate: false }))

  }
  const handleConfirmation = (action: string, id: string) => {
    CustomLogger.info("Reservation/handleConfirmation/", action)
    if (action === "DELETE_RESERVATION") {
      setConfirmation((prev) => ({
        ...prev,
        open: true, action: action, content: "Please, press Confirm to Delete Reservation", title: "Confirmation", key: id,
        onClose: onConfirmationClose
      }))
      CustomLogger.info("Reservation/handleConfirmation/DELETE_FLIGHT", confirmation)
    }
  }
  const onCellSelect = (value: Date) => {
    console.log('Reservation/onCellSelect/value,dateRef',value,dateRef)
    setViewMode(EviewMode.E_VM_NORMAL)
    setDateRef(value)
    setFilterMode(EfilterMode.E_FM_DAY)
  }
  return (
    <>

      <div className='header'>
        <Box sx={{ width: '100%' }}>
          <>{alertView}</>
          {isReservationUpdate && <UpdateReservationDialog onClose={handleUpdateOnClose} value={reservationUpdate} open={isReservationUpdate} onSave={handleUpdateOnSave} />}
          {openReservationAdd && <CreateReservationDialog onClose={handleAddOnClose} value={GetInitReservationAdd()} open={openReservationAdd} onSave={handleAddOnSave} />}
          {viewMode === EviewMode.E_VM_MONTH ?
            (
              <Typography variant="h6" align="center">{`Reservations`}</Typography>
            ) : (
              <Typography variant="h6" align="center">{`Reservations ${filterDate.from.getDisplayDate()} : ${filterDate.to.getDisplayDate()}`}</Typography>
            )}


          <Box display={'flex'} justifyContent={"space-between"}>
            {viewMode != EviewMode.E_VM_MONTH ?
              (
                <Box display={'flex'} justifyContent={"flex-start"}>
                  <Tooltip title="Filtering">
                    <ToggleButton value={""} aria-label="close" size="medium" onClick={() => setOpenFilter(true)}>
                      <FilterAltIcon fontSize="inherit" />
                    </ToggleButton>
                  </Tooltip>
                  <Tooltip title="Prev Reservations">
                    <ToggleButton value={EviewMode.E_VM_DAY} aria-lable="prev-selection" onClick={onFilterModePrev} size="small"> <NavigateBeforeIcon /></ToggleButton>
                  </Tooltip>
                  <Tooltip title="Next Reservations">
                    <ToggleButton value={EviewMode.E_VM_NORMAL} aria-lable="next-selection" onClick={onFilterModeNext} size="small"> <NavigateNextIcon /></ToggleButton>
                  </Tooltip>
                  <GeneralDrawer open={openFilter} setOpen={setOpenFilter}>
                    <List sx={{ display: 'flex', flexDirection: 'column' }}>
                      <ListItem key={"fromDate"} disablePadding>
                        <ListItemButton>
                          <ListItemIcon>
                            <DateRangeIcon />
                          </ListItemIcon>
                          <DatePickerDate value={filterDate.from === undefined ? new Date() : filterDate.from} param="from" lable='From Date' onChange={onDateChanged} />

                        </ListItemButton>

                      </ListItem>
                      <ListItem key={"toDate"} disablePadding>
                        <ListItemButton>
                          <ListItemIcon>
                            <DateRangeIcon />
                          </ListItemIcon>
                          <DatePickerDate value={filterDate.to === undefined ? new Date() : filterDate.to} param={"to"} lable='To Date' onChange={onDateChanged} />

                        </ListItemButton>

                      </ListItem>
                      <ListItem key={"member"}>
                        <MembersCombo onChanged={onMemberChanged} source={"_ReservationPage/member"} filter={{ filter: { member_type: MemberType.Member } }} />
                      </ListItem>
                      <ListItem key={'today'} disablePadding>
                        <ListItemButton onClick={onTodayChanged}>
                          <ListItemIcon>
                            <TodayIcon />
                          </ListItemIcon>
                        </ListItemButton>
                        <ListItemButton onClick={onPrevDay}>
                          <ListItemIcon>
                            <NavigateBeforeIcon />
                          </ListItemIcon>
                        </ListItemButton>

                        <ListItemButton onClick={onTodayChanged} sx={{ textAlign: 'center' }}>Today</ListItemButton>
                        <ListItemButton>
                          <ListItemIcon onClick={onNextDay}>
                            <NavigateNextIcon />
                          </ListItemIcon>
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
                        <ListItemButton onClick={onWeekChanged} sx={{ textAlign: 'center' }}>This Week</ListItemButton>
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
                        <ListItemButton onClick={onMonthChanged} sx={{ textAlign: 'center' }}>This Month</ListItemButton>
                        <ListItemButton onClick={onNextMonth}>
                          <ListItemIcon>
                            <NavigateNextIcon />
                          </ListItemIcon>
                        </ListItemButton>
                      </ListItem>
                    </List>
                  </GeneralDrawer>
                </Box>
              ) :
              (<></>)}

            <Box display={'flex'} justifyContent={"flex-end"}>
              <ToggleButtonGroup value={viewMode} exclusive aria-label="view mode" onChange={handleViewMode}>
                <ToggleButton value={EviewMode.E_VM_DAY} aria-lable="day view" size="small"> <Tooltip title="Switch to day view"><TodayIcon /></Tooltip></ToggleButton>
                <ToggleButton value={EviewMode.E_VM_NORMAL} aria-lable="normal view" size="small"> <Tooltip title="Switch to table view"><TableChartIcon /></Tooltip></ToggleButton>
                <ToggleButton value={EviewMode.E_VM_MONTH} aria-lable="month view" size="small"> <Tooltip title="Switch to month view"><TableViewIcon /></Tooltip></ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <Box display={'flex'} justifyContent={"flex-end"}>
              <Tooltip title="Add Flight">
                <ActionButtons OnAction={onAction} show={[EAction.ADD]} item="" display={[{ key: EAction.ADD, value: "rESERVATION" }]} />
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </div >
      <div className='main' style={{ overflow: 'auto', height: "100%" }}>
        <Box sx={{ width: '100%', height: '100%' }}>
          <Paper sx={{ height: "100%", width: '100%', mb: 1 }}>
            {viewMode === EviewMode.E_VM_NORMAL ? (
              <>
                <TableContainer>
                  <Table stickyHeader={true}
                    sx={{ minWidth: 300 }}
                    aria-labelledby="tableTitle"
                    size={dense ? 'small' : 'medium'}
                  >
                    <EnhancedTableHead
                      order={order}
                      orderBy={orderBy}
                      onRequestSort={handleRequestSort}

                    />
                    <MediaQuery minWidth={768}>
                      <TableBody sx={{ "& tr:nth-of-type(2n+1)": { backgroundColor: theme.palette.grey[300], color: "white", "& .MuiTableCell-root": { color: "black" } }, "color": "red" }}>
                        {
                          rows.filter((r) => {
                            /* if (!isInDateRange(r)) return false; */
                            
                            if(filterMode == EfilterMode.E_FM_DAY)
                            {
                              const sameDateRef : boolean =  dateRef.isIntersec(new Date(r.date_from),new Date(r.date_to))
                              if(sameDateRef == false) return false;
                            }
                            if (!isFilterOwner) return true
                            if (isFilterOwner && r.validOperation & CanDo.Owner) return true;
                            return false;
                          }).sort(getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row: ItableData) => {

                              return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row._id_reservaion}>
                                  <TableCell align="left">{row.device_name}</TableCell>
                                  <TableCell align="left">{(new Date(row.date_from)).getDisplayDateTime()}</TableCell>
                                  <TableCell align="left">{(new Date(row.date_to)).getDisplayDateTime()}</TableCell>
                                  <TableCell align="left">{row.name}</TableCell>
                                  <TableCell align="left">{row.member_id}</TableCell>
                                  <TableCell align="left">{(row.validOperation & CanDo.Edit) ? <Button onClick={(event) => handleEditClick(event, row._id_reservaion)}>Edit</Button> : null}</TableCell>
                                  <TableCell align="left">{(row.validOperation & CanDo.Delete) ? <Button onClick={(event) => handleConfirmation("DELETE_RESERVATION", row._id_reservaion)}>Delete</Button> : null}</TableCell>
                                </TableRow>
                              );
                            })}
                      </TableBody>
                      <TableFooter>
                        {confirmation.open === true ? (<ConfirmationDialog title={confirmation.title} content={confirmation.content}
                          open={confirmation.open} action={confirmation.action} keepMounted={confirmation.keepMounted}
                          onClose={onConfirmationClose} isOperate={false} />
                        ) : null}
                      </TableFooter>
                    </MediaQuery>

                  </Table>
                </TableContainer>
                <MediaQuery maxWidth={767}>
                  {
                    rows.filter((r) => {

                      /* if (!isInDateRange(r)) return false; */
                      if(filterMode == EfilterMode.E_FM_DAY)
                      {
                        const sameDateRef : boolean =  dateRef.isIntersec(new Date(r.date_from),new Date(r.date_to))
                        if(sameDateRef == false) return false;
                      }
                      if (!isFilterOwner) return true
                      if (isFilterOwner && r.validOperation & CanDo.Owner) return true;
                      return false;
                    })
                      .sort(getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row: ItableData, index: number) => {
                        return (
                          <Accordion key={row._id_reservaion} expanded={expanded === `panel${index}`} onChange={handleChange(`panel${index}`)}>
                            <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                              <Typography sx={{ fontSize: {xs:xsPixels, sm:smPixels, md:mdPixels} }} variant='caption'> {new Date(row.date_from).getWeekDayDateDisplay()} {"=>"} {new Date(row.date_to).getWeekDayDateDisplay()}</Typography>
                            </AccordionSummary>
                            <AccordionDetails >
                              <Grid container spacing={1}>
                                <Grid item xs={4} sm={4}>
                                  <Typography sx={{ fontSize: {xs:xsPixels, sm:smPixels, md:mdPixels} }}>
                                    {row.name}
                                  </Typography>
                                </Grid>
                                <Grid item xs={3} sm={4}>           
                                  <Typography sx={{ fontSize: {xs:xsPixels, sm:smPixels, md:mdPixels} }}>
                                    {row.member_id}
                                  </Typography>
                                </Grid>

                                <Grid item xs={2} sm={2} >
                                  <Typography >
                                    {(row.validOperation & CanDo.Edit) ? <Button onClick={(event) => handleEditClick(event, row._id_reservaion)}>Edit</Button> : null}
                                  </Typography>
                                
                                </Grid>
                                <Grid item xs={3} sm={2} >
                                 <Typography >
                                    {confirmation.open === true ? (<ConfirmationDialog title={confirmation.title} content={confirmation.content}
                                      open={confirmation.open} action={confirmation.action} keepMounted={confirmation.keepMounted}
                                      onClose={onConfirmationClose} isOperate={false} />
                                    ) : null}
                                    {(row.validOperation & CanDo.Delete) ? <Button onClick={(event) => handleConfirmation("DELETE_RESERVATION", row._id_reservaion)}>Delete</Button> : null}
                                  </Typography>

                                </Grid>
                                <Grid item xs={4} sm={4}>
                                  <Typography sx={{ fontSize: {xs:'0.83rem', sm:'1.2rem', md:'1.5rem'} }}>
                                    {`Plane: ${row.device_name}`}
                                  </Typography>
                                </Grid>
                                <Grid item xs={8} sm={8}>
                                  <Typography sx={{ fontSize: {xs:'0.83rem', sm:'1.2rem', md:'1.5rem'} }}>
                                    {`_id: ${row._id_reservaion}`}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>
                        );
                      })
                  }
                </MediaQuery>
              </>)
              : viewMode === EviewMode.E_VM_MONTH ? (
                <CalanderViewMonth value={dateRef} onChange={OnMonthViewDateChange} cellDisplay={getMonthReservations()} onCellSelect={onCellSelect}/>
              ) : (
                <CalnanderViewDay title={`Reservation ${dateRef.toLocaleDateString()}`} reservations={getViewDayReservations()} />
              )}
          </Paper>
        </Box>
      </div>
      <div className='footer' style={{ overflow: 'hidden', height: 'auto' }}>
        <TablePagination
          rowsPerPageOptions={[25, 50, 100]}
          component="div"
          count={rows ? rows.length : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </>
  )
}

export default ReservationsPage