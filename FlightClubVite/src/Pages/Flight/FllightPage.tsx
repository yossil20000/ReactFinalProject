import "../../Types/date.extensions"
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Grid, List, ListItem, ListItemButton, ListItemIcon, Paper, styled, TablePagination, ToggleButton, Tooltip, Typography } from "@mui/material";
import { Fragment, SetStateAction, useEffect, useState } from "react";
import FullScreenLoader from "../../Components/FullScreenLoader";
import { useGetAllFlightsQuery, useDeleteFlightMutation } from "../../features/Flight/flightApi";
import IFlight, { IFlightCreate, IFlightDeleteApi, IFlightFilterDate, IFlightUpdate, FlightStatus, CFlightToReport, IFlightData } from "../../Interfaces/API/IFlight";
import GeneralCanDo, { CanDo } from "../../Utils/owner";
import { useAppSelector } from "../../app/hooks";
import { ILoginResult } from "../../Interfaces/API/ILogin";
import UpdateFlightDialog from "./UpdateFlightDialog";
import SortButtons, { ISortCell, Order } from "../../Components/Buttons/SortButtons";
import CreateFlightDialog from "./CreateFlightDialog";

import { IReservationFilterDate } from "../../Interfaces/API/IFlightReservation";
import { IDateFilter, newDateFilter } from "../../Interfaces/IDateFilter";
import { getDayFilter, getMonthFilter, getTodayFilter, getWeekFilter } from "../../Utils/filtering";

import GeneralDrawer from "../../Components/GeneralDrawer.js";
import DateRangeIcon from '@mui/icons-material/DateRange';
import { SetProperty } from "../../Utils/setProperty.js";
import TodayIcon from '@mui/icons-material/Today';
import CalendarViewWeekIcon from '@mui/icons-material/CalendarViewWeek';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import ActionButtons, { EAction } from "../../Components/Buttons/ActionButtons.js";
import DatePickerDate from "../../Components/Buttons/DatePickerDate";
import ContainerPage, { ContainerPageFooter, ContainerPageHeader, ContainerPageMain } from "../Layout/Container";
import { EfilterMode } from "../../Utils/enums";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { MemberType, Role } from "../../Interfaces/API/IMember";
import ConfirmationDialog, { ConfirmationDialogProps } from "../../Components/ConfirmationDialog";
import MembersCombo from "../../Components/Members/MembersCombo";
import { InputComboItem } from "../../Components/Buttons/ControledCombo";
import ReportDialog from "../../Components/Report/Exel/ReportDialog";
import GridTable from "../../Components/Tables/GridTable";
import { GridActionsCellItem, GridColDef, GridRowModes, GridRowsProp, GridValidRowModel } from "@mui/x-data-grid";
import { GridInitialStateCommunity } from "@mui/x-data-grid/models/gridStateCommunity";
import { DEVICE_SERVICE } from "../../Interfaces/API/IDevice";

const dateFilter: IDateFilter = {
  from: (new Date()).getStartOfYear(),
  to: (new Date()).getEndOfYear(),
  currentOffset: 0
}
const StyledAccordion = styled(Box)(({ theme }) => ({
  color: theme?.palette.primary.main,
  "& .MuiAccordionSummary-content:nth-of-type(2n+1)":
    { backgroundColor: theme.palette.grey[300], color: "black" }
}
))


function createdata(flight: IFlight, validOperation: CanDo): IFlightData {
  return {
    _id: flight._id, _id_member: flight.member._id, description: flight.description,
    name: flight.member.family_name, device_id: flight.device.device_id,
    date: new Date(flight.date), member_id: flight.member.member_id,
    hobbs_start: flight.hobbs_start, hobbs_stop: flight.hobbs_stop, engien_start: flight.engien_start, engien_stop: flight.engien_stop, status: flight.status,
    validOperation: validOperation, duration: flight.duration, reuired_hobbs: flight.reuired_hobbs, timeOffset: flight.timeOffset
  }
}


const sortCells: ISortCell<IFlightData>[] = [
  { id: "_id", label: "Device", numeric: false },
  { id: "date", label: "From", numeric: false },
  { id: "hobbs_start", label: "Hobbs.S", numeric: false },
  { id: "engien_start", label: "Engine.S", numeric: false },
  { id: "name", label: "IdNumber", numeric: false },


]
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


function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  /* CustomLogger.info("descendingComparator", a, b, orderBy) */
  if (b[orderBy] < a[orderBy]) { return -1 }
  if (b[orderBy] > a[orderBy]) { return 1 }
  return 0;
}


let flightUpdateIntitial: IFlightUpdate = {
  date: new Date(),
  _id: "",
  device_name: "",
  member_name: "",
  hobbs_start: 0,
  hobbs_stop: 0,
  engien_start: 0,
  engien_stop: 0,
  description: "",
  status: FlightStatus.CREATED,
  reuired_hobbs: false,
  duration: 0,
  timeOffset: 0
}
let flightAddIntitial: IFlightCreate = {
  date: new Date(),
  device_name: "",
  member_name: "",
  hobbs_start: 0,
  hobbs_stop: 0,
  engien_start: 0,
  engien_stop: 0,
  description: "",
  status: FlightStatus.CREATED,
  _id_device: "",
  _id_member: "",
  reuired_hobbs: false,
  duration: 0,
  timeOffset: 0
}
const FlightPage = () => {
  const [dateRef, setDateRef] = useState(new Date())
  const [openFilter, setOpenFilter] = useState(false)
  const [openFlightAdd, setOpenFlightAdd] = useState(false);
  const [openExport, setOpenExport] = useState(false);
  const [openFlightUpdate, setOpenFlightUpdate] = useState(false);
  const [DeleteFlight] = useDeleteFlightMutation();
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof IFlightData>("_id");
  const [flightsData, setFilghtData] = useState<IFlightData[]>([]);
  const [expanded, setExpanded] = useState<string | false>('panel0');
  const [isFilterOwner, setIsFilterOwner] = useState(false);
  const [filterDate, setFilterDate] = useState<IReservationFilterDate>(dateFilter as IReservationFilterDate);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const login: ILoginResult | undefined = useAppSelector<ILoginResult | undefined>((state) => state.authSlice);
  const { isLoading, isError, error, data: flights, refetch } = useGetAllFlightsQuery({ from: filterDate.from, to: filterDate.to } as IFlightFilterDate);
  const [filterMode, setFilterMode] = useState<EfilterMode>(EfilterMode.E_FM_MONTH);
  const [confirmation, setConfirmation] = useState<ConfirmationDialogProps>({ open: false } as ConfirmationDialogProps);
  const [selectedMember, setSelectedMember] = useState<InputComboItem>()
  const [rows, setRows] = useState<GridRowsProp>([])
  function getFlightData(flights: IFlight[]): IFlightData[] {
    return flights.map((flight) => createdata(flight, GeneralCanDo(flight.member._id, login === undefined ? "" : login.member._id, login === undefined ? [Role.guest] : login?.member.roles)))
  }
  const getFilteredData = (): IFlightData[] => {
    CustomLogger.info("getFilteredData/flightData", flightsData)
    if (flightsData === undefined) return [];
    const filterdData: IFlightData[] = flightsData?.filter((flight) => {
      CustomLogger.log("getFilteredData/filter", flight);
      if (!isFilterOwner) return true;
      if (isFilterOwner && flight.validOperation & CanDo.Owner) return true;
      return true;
    })
      .sort(getComparator(order, orderBy))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return filterdData;
  }


  const filterMember = function (flight: IFlightData): Boolean {
    /* CustomLogger.log("FlightPage/filterMember/", flights === undefined ? "Undefined" : flight) */
    if (selectedMember?._id.trim().length === 0) return true;
    if (flight._id_member == selectedMember?._id) {
      /* CustomLogger.log("FlightPage/filterMember/", selectedMember, flight, true) */
      return true;
    }
    /* CustomLogger.log("FlightPage/filterMember/", selectedMember, flight, false) */
    return false

  }
  useEffect(() => {
    CustomLogger.log("FlightPage/useEffect/flight.data", flights === undefined ? "Undefined" : flights)
    if (flights?.data !== undefined) {
      let flightData = getFlightData(flights?.data).filter((filter) => filterMember(filter))
      CustomLogger.info('FlightPage/useEffect/flightData', flightData, selectedMember, flightData?.length)
      setFilghtData(flightData);
    }

  }, [flights?.data, selectedMember])



  if (isLoading) {
    CustomLogger.info('FlightPage/isLoading', isLoading)
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
      CustomLogger.error('FlightPage/error', errMsg)
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

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof IFlightData) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }


  const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleDelete = async (_id: string) => {
    const flightDelete: IFlightDeleteApi = {
      _id: _id
    }

    CustomLogger.log("Flight/Delete /", _id);
    try {
      await DeleteFlight(flightDelete)
        .unwrap()
        .then((payload) => {
          CustomLogger.info("DeleteFlight Fullfill", payload)
          refetch();

        });
    }
    catch (err) {
      CustomLogger.error("DeleteFlight/err", err)
    }
  }
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }
  function fillFlightUpdate(id: string) {
    const flight = flightsData.filter(item => item._id === id)
    if (flight.length === 1) {
      CustomLogger.info("RenderFlightUpdate/filter", flight);
      flightUpdateIntitial._id = flight[0]._id;
      flightUpdateIntitial.date = flight[0].date;
      flightUpdateIntitial.device_name = flight[0].device_id;
      flightUpdateIntitial.member_name = `${flight[0].name} ${flight[0].member_id}`
      flightUpdateIntitial.hobbs_start = flight[0].hobbs_start;
      flightUpdateIntitial.hobbs_stop = flight[0].hobbs_stop;
      flightUpdateIntitial.engien_start = flight[0].engien_start;
      flightUpdateIntitial.engien_stop = flight[0].engien_stop;
      flightUpdateIntitial.description = flight[0].description;
      flightUpdateIntitial.status = flight[0].status;
      /* setFlightUpdate(flightUpdateIntitial); */
    }
  }

  const handleUpdateOnSave = () => {
    refetch();
    setOpenFlightUpdate(false);
    /* CustomLogger.info("FlightPage/handleOnSave/value", value); */
  }
  const handleEditClick = async (event: React.MouseEvent<unknown>, _id: string) => {
    fillFlightUpdate(_id);
    setOpenFlightUpdate(true);
  }
  const handleUpdateOnClose = () => {
    setOpenFlightUpdate(false);
  }

  const handleAddOnSave = (value: IFlightCreate) => {
    refetch();
    setOpenFlightAdd(false);
    CustomLogger.log("FlightPage/handleAddOnSave/value", value);

  }

  const handleAddOnClose = () => {
    setOpenFlightAdd(false);
    setOpenExport(false)
  }
  const getFilteredDataMemo = getFilteredData()
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
  function onAction(action: EAction, event?: React.MouseEvent<HTMLButtonElement, MouseEvent>, item?: string) {
    event?.defaultPrevented
    CustomLogger.log("FlightPage/onAction", event?.target, action, item)
    switch (action) {
      case EAction.ADD:
        setOpenFlightAdd(true);
        break;
      case EAction.SAVE:
        setOpenExport(true)
    }
  }
  const onDateChanged = (key: string, value: Date | null) => {
    CustomLogger.info("FlightPage/onDateChanged", key, value)
    if (value == null)
      return;
    const newFilter = SetProperty(filterDate, key, new Date(value));
    setFilterDate(newFilter)
    refetch()
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
  const onConfirmationClose = (value: boolean, action: string) => {
    CustomLogger.info("FlightPage/onConfirmationClose", confirmation, value)
    if (value) {
      if (action === "DELETE_FLIGHT")
        handleDelete(confirmation.key === undefined ? "" : confirmation.key)
      else
        setConfirmation((prev) => ({ ...prev, open: false }))
      CustomLogger.info("FlightPage/OnDeleteFlight/key", confirmation.key)
    }
    else
      setConfirmation((prev) => ({ ...prev, open: false }))
  }

  const handleConfirmation = (action: string, id: string) => {
    CustomLogger.info("FlightPage/handleConfirmation/", action)
    if (action === "DELETE_FLIGHT") {
      setConfirmation((prev) => ({
        ...prev,
        open: true, action: action, content: "Please, press Confirm to Delete Flight", title: "Confirmation", key: id,
        onClose: onConfirmationClose
      }))
      CustomLogger.info("FlightPage/handleConfirmation/DELETE_FLIGHT", confirmation)
    }
  }

  const onMemberChanged = (item: InputComboItem) => {
    setSelectedMember(item)
  }

  /*   useEffect(() => {
      if (isError) {
        CustomLogger.error("FlightPage/useEffect/error", (error as any)); flightsData
      }
    }, [isLoading]); */
  if (isLoading) {
    CustomLogger.info('FlightPage/isLoading', isLoading)
    return (
      <div className='main' style={{ overflow: 'auto' }}>
        <FullScreenLoader />
      </div>
    )
  }
  if (error) {
    if ('status' in error) {
      // you can access all properties of `FetchBaseQueryError` here
      const errMsg = 'error' in error ? error : JSON.stringify(error)
      CustomLogger.error('FlightPage/error', errMsg)
      return (
        <div>
          <div>AccountFlightPage</div>
          <div>An error has occurred:</div>
          <div>{errMsg}</div>
        </div>
      )
    } else {
      // you can access all properties of `SerializedError` here
      return <div>{error}</div>
    }
  }
  let initialState: GridInitialStateCommunity = {
    columns: {
      columnVisibilityModel: {
        _id: false
      }
    },
    pagination: { paginationModel: { pageSize: 20 } },
  }
  const onSave = () => {

  }
  const columns: GridColDef[] = [

    { field: '_id', type: 'string', hideable: true },
    {
      field: 'date', headerName: 'Date', type: 'date', sortable: true, editable: true,
      filterable: true, flex: 1, minWidth: 110
    },
    { field: 'engien_start', headerName: 'Engien Start', type: 'number', minWidth: 160, flex: 1, editable: true },
    { field: 'engien_stop', headerName: 'Engien Stop', type: 'number', minWidth: 160, flex: 1, editable: true },
    { field: 'member_id', headerName: 'Id Number', type: 'number', minWidth: 170, flex: 1, editable: true },


  ];
  return (
    <>
      <ContainerPage>
        <>
          <ContainerPageHeader>
            <Box marginTop={0} display={'flex'} flexDirection={'column'}>
              <Typography variant="h6" align="center">{`Flights ${filterDate.from.getDisplayDate()} - ${filterDate.to.getDisplayDate()}`}</Typography>
              <Box sx={{ width: '100%', mb: 1, display: "flex", justifyContent: "space-between" }} >
                <Box display={'flex'} justifyContent={"flex-start"}>
                  <ToggleButton value={""} aria-label="close" size="medium" onClick={() => setOpenFilter(true)}>
                    <FilterAltIcon fontSize="inherit" />
                  </ToggleButton>
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
                        <MembersCombo onChanged={onMemberChanged} source={"_FlightPage/member"} filter={{ filter: { member_type: MemberType.Member } }} />
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
                        <ListItemButton onClick={onTodayChanged} sx={{ textAlign: 'center' }}>Day</ListItemButton>
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
                  <ToggleButton value={""} aria-lable="prev-selection" size="medium" onClick={onFilterModePrev}>
                    <Tooltip title="Switch to day view"><NavigateBeforeIcon fontSize="inherit" /></Tooltip>
                  </ToggleButton>
                  <ToggleButton value={""} aria-lable="next-selection" size="medium" onClick={onFilterModeNext}> <NavigateNextIcon fontSize="inherit" /></ToggleButton>
                </Box>
                <Box display={'flex'} justifyContent={"flex-end"}>
                  <Tooltip title="Add Flight">
                    <ActionButtons OnAction={onAction} show={[EAction.ADD, EAction.SAVE]} item="" display={[{ key: EAction.ADD, value: "flight" }, { key: EAction.SAVE, value: "Export" }]} />
                  </Tooltip>
                </Box>
              </Box>
            </Box>
          </ContainerPageHeader>
          <ContainerPageMain>
            <Fragment>

              {openFlightUpdate && <UpdateFlightDialog onClose={handleUpdateOnClose} value={flightUpdateIntitial} open={openFlightUpdate} onSave={handleUpdateOnSave} />}
              {openFlightAdd && <CreateFlightDialog onClose={handleAddOnClose} value={flightAddIntitial} open={openFlightAdd} onSave={handleAddOnSave} />}
              {openExport && <ReportDialog onClose={handleAddOnClose} open={openExport} table={(new CFlightToReport(flightsData)).getFlightToExel()} action="FlightExport" />}
              <Box sx={{ width: '100%', height: '100%' }}>

                <Paper sx={{ width: '100%', mb: 1 }}>
                {false ? (
                    <GridTable title={"Flight"} style={{}} children={<></>} rows={rows} setRows={setRows} columns={columns} initialState={initialState} onSave={onSave} actionColumn={true}></GridTable>
                  ) : (<></>)}
                  <SortButtons sortCells={sortCells} onRequestSort={handleRequestSort} order={order} orderBy={orderBy} />
                  <StyledAccordion >
                    {
                      getFilteredDataMemo.map((row: IFlightData, index: number) => {
                        return (
                          <Accordion key={row._id} expanded={expanded === `panel${index}`} onChange={handleChange(`panel${index}`)}
                          >
                            <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                              <Typography variant='caption'> {row.device_id} , {row.date.getDisplayDate()}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Grid container spacing={1} columns={12}>
                                <Grid item xs={6}>
                                  <Typography variant='caption'  >description: {row.description}</Typography>
                                </Grid>
                                <Grid item xs={6} >

                                  <Typography >
                                    {row.name}
                                  </Typography>
                                  <Typography>
                                    {row.member_id}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} >
                                  <Typography>
                                    {`Hobbs Start: ${row.hobbs_start}`}
                                  </Typography>
                                  <Typography>
                                    {`Hobbs Stop: ${row.hobbs_stop}`}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} >
                                  <Typography>
                                    {`Engien Start: ${row.engien_start}`}
                                  </Typography>
                                  <Typography>
                                    {`Engien Stop: ${row.engien_stop}`}
                                  </Typography>
                                </Grid>
                                {
                                  row.status !== FlightStatus.CREATED ? (null) :
                                    (
                                      <>

                                        <Grid item xs={6} >
                                          <Typography>
                                            {(row.validOperation & CanDo.Edit) ? <Button onClick={(event) => handleEditClick(event, row._id)}>Edit</Button> : null}
                                          </Typography>
                                        </Grid>
                                        <Grid item xs={6} >
                                          <Typography>
                                            {confirmation.open === true ? (<ConfirmationDialog title={confirmation.title} content={confirmation.content}
                                              open={confirmation.open} action={confirmation.action} keepMounted={confirmation.keepMounted}
                                              onClose={onConfirmationClose} isOperate={false} />
                                            ) : null}
                                            {(row.validOperation & CanDo.Delete) ? <Button onClick={(event) => handleConfirmation("DELETE_FLIGHT", row._id)}>Delete</Button> : null}
                                          </Typography>
                                        </Grid>
                                      </>
                                    )
                                }

                              </Grid>
                            </AccordionDetails>
                          </Accordion>
                        )
                      })
                    }
                  </StyledAccordion>
                </Paper>
              </Box>
            </Fragment>
          </ContainerPageMain>
          <ContainerPageFooter>
            <TablePagination
              rowsPerPageOptions={[1, 5, 10, 25, 50]}
              component="div"
              count={flightsData?.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </ContainerPageFooter>
        </>
      </ContainerPage>


      <footer className='footer' style={{ overflowY: "hidden" }}>

      </footer>
    </>

  )
}
export default FlightPage;