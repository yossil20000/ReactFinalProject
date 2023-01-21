import "../../Types/date.extensions"
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Grid, IconButton, Paper, styled, TablePagination, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import FullScreenLoader from "../../Components/FullScreenLoader";
import { useGetAllFlightsQuery, useDeleteFlightMutation } from "../../features/Flight/flightApi";
import IFlight, { IFlightCreate, IFlightDeleteApi, IFlightFilterDate, IFlightUpdate, FlightStatus } from "../../Interfaces/API/IFlight";


import GeneralCanDo, { CanDo } from "../../Utils/owner";
import { useAppSelector } from "../../app/hooks";
import { ILoginResult } from "../../Interfaces/API/ILogin";
import FilterButtons from "../../Components/Buttons/FilterButtons";
import UpdateFlightDialog from "./UpdateFlightDialog";
import SortButtons, { ISortCell, Order } from "../../Components/Buttons/SortButtons";
import CreateFlightDialog from "./CreateFlightDialog";

import AddCircleOutlineSharpIcon from '@mui/icons-material/AddCircleOutlineSharp';
import { IReservationFilterDate } from "../../Interfaces/API/IFlightReservation";
import { IDateFilter } from "../../Interfaces/IDateFilter";
import { getMonthFilter, getTodayFilter, getWeekFilter } from "../../Utils/filtering";
const StyledAccordion = styled(Box)(({ theme }) => ({
  color: theme?.palette.primary.main,
  "& .MuiAccordionSummary-content:nth-of-type(2n+1)":
    { backgroundColor: "gray", color: "white" }
}
))

interface IFlightData {
  _id: string; _id_member: string; name: string; description: string;
  device_id: string; date: Date; member_id: string; validOperation: CanDo;
  hobbs_start: number; hobbs_stop: number; engien_start: number; engien_stop: number; status: FlightStatus;
}

function createdata(flight: IFlight, validOperation: CanDo): IFlightData {
  return {
    _id: flight._id, _id_member: flight.member._id, description: flight.description,
    name: flight.member.family_name, device_id: flight.device.device_id,
    date: new Date(flight.date), member_id: flight.member.member_id,
    hobbs_start: flight.hobbs_start, hobbs_stop: flight.hobbs_stop, engien_start: flight.engien_start, engien_stop: flight.engien_stop, status: flight.status,
    validOperation: validOperation
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
  /* console.log("descendingComparator", a, b, orderBy) */
  if (b[orderBy] < a[orderBy]) { return -1 }
  if (b[orderBy] > a[orderBy]) { return 1 }
  return 0;
}


const todayDate = new Date();
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
  const [openFlightAdd, setOpenFlightAdd] = useState(false);
  const [openFlightUpdate, setOpenFlightUpdate] = useState(false);
  const [flightUpdate, setFlightUpdate] = useState<IFlightUpdate>(flightUpdateIntitial);
  const [DeleteFlight] = useDeleteFlightMutation();
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof IFlightData>("_id");
  const [flightsData, setFilghtData] = useState<IFlightData[]>([]);
  const [expanded, setExpanded] = useState<string | false>('panel0');
  const [isByDateRange, setIsByDateRange] = useState(false);
  const [isFilterOwner, setIsFilterOwner] = useState(false);
  const [filterBydate, setFilterByDate] = useState(0);
  const [filterDate, setFilterDate] = useState<IReservationFilterDate>({} as IReservationFilterDate);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const login: ILoginResult = useAppSelector<ILoginResult>((state) => state.authSlice);
  const { isLoading, isError, error, data: flights, refetch } = useGetAllFlightsQuery({ from: filterDate.from, to: filterDate.to } as IFlightFilterDate);
  function getFlightData(flights: IFlight[]): IFlightData[] {
    return flights.map((flight) => createdata(flight, GeneralCanDo(flight.member._id, login.member._id, login.member.roles)))
  }
  useEffect(() => {
    if (isError) {
      console.log("FlightPage/useEffect/error", (error as any)); flightsData
    }

  }, [isLoading]);
  const getFilteredData = (): IFlightData[] => {
    console.log("getFilteredData/flightData", flightsData)
    if (flightsData === undefined) return [];
    const filterdData: IFlightData[] = flightsData?.filter((flight) => {
      console.log("flightdat/filter", flightsData);

      if (!isFilterOwner) return true;
      if (isFilterOwner && flight.validOperation & CanDo.Owner) return true;
      return true;
    })
      .sort(getComparator(order, orderBy))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return filterdData;
  }

  useEffect(() => {
    console.log("FlightPage/useEffect/flight.data", flights === undefined ? "Undefined" : flights)
    if (flights?.data !== undefined) {
      const flightData = getFlightData(flights?.data)
      console.log('FlightPage/useEffect/flightData', flightData)
      setFilghtData(flightData);
    }

  }, [flights?.data])



  if (isLoading) {
    return (
      <div className='main' style={{ overflow: 'auto' }}>
        <FullScreenLoader />
      </div>
    )
  }

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof IFlightData) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }


  const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleDeleteClick = async (event: React.MouseEvent<unknown>, _id: string) => {
    const flightDelete: IFlightDeleteApi = {
      _id: _id
    }

    console.log("Flight/Delete /", _id);
    try {
      await DeleteFlight(flightDelete)
        .unwrap()
        .then((payload) => {
          console.log("DeleteFlight Fullfill", payload)
          refetch();
        });
    }
    catch (err) {
      console.log("DeleteFlight/err", err)
    }
  }
  const handleFilterOwner = () => {
    setIsFilterOwner(!isFilterOwner);
  }

  const handleFilterClick = (selectedIndex: number) => {
    console.log("handleFilterClick", selectedIndex);
    let filterDate: IDateFilter | null = null;
    switch (selectedIndex) {
      case 0:
        filterDate = getTodayFilter();
        break;
      case 1:
        filterDate = getWeekFilter(todayDate);
        break;
      case 2:
        filterDate = getMonthFilter(todayDate);
        break;

    }
    if (selectedIndex == 3)
      setIsByDateRange(true);
    else
      setIsByDateRange(false);
    if (filterDate) {
      /* setFromDateFilter(filterDate.from);
      setToDateFilter(filterDate.to); */
      setFilterDate(filterDate as IReservationFilterDate)
    }
    console.log("handleFilterClick", selectedIndex, isByDateRange);

  }
  const isInDateRange = (row: IFlightData): boolean => {
    console.log("isInDateRange/filterBydate", filterBydate)
    switch (filterBydate) {
      case 0:
        return row.date.isSameDate(todayDate);
      case 1:
        return row.date.getWeek() == todayDate.getWeek();
      case 2:
        return row.date.isSameMonth(todayDate);
      case 3:
        if (filterDate.from && filterDate.to)
          return row.date >= filterDate.from && row.date <= filterDate.to
        break;
    }
    return true;
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
      console.log("RenderFlightUpdate/filter", flight);
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
    /* console.log("FlightPage/handleOnSave/value", value); */
  }
  const handleEditClick = async (event: React.MouseEvent<unknown>, _id: string) => {
    fillFlightUpdate(_id);
    setOpenFlightUpdate(true);
  }
  const handleUpdateOnClose = () => {
    setOpenFlightUpdate(false);
  }

  const handleAddClick = async () => {
    setOpenFlightAdd(true);
  }
  const handleAddOnSave = (value: IFlightCreate) => {
    refetch();
    setOpenFlightAdd(false);
    console.log("FlightPage/handleAddOnSave/value", value);

  }

  const handleAddOnClose = () => {
    setOpenFlightAdd(false);
  }
  const getFilteredDataMemo = getFilteredData()
  return (
    <>
      <div className='header'><Typography variant="h6" align="center">Flight Page</Typography></div>
      <div className='main' style={{ overflow: "auto" }} >
        {openFlightUpdate && <UpdateFlightDialog onClose={handleUpdateOnClose} value={flightUpdateIntitial} open={openFlightUpdate} onSave={handleUpdateOnSave} />}
        {openFlightAdd && <CreateFlightDialog onClose={handleAddOnClose} value={flightAddIntitial} open={openFlightAdd} onSave={handleAddOnSave} />}
        <Box sx={{ width: '100%', height: '100%' }}>
          <Paper sx={{ width: '100%', mb: 1 }}>
            <FilterButtons filterDate={filterDate} setFilterDate={setFilterDate} isByDateRange={isByDateRange} OnFilterOwner={handleFilterOwner} isFilterOwner={isFilterOwner}
              handleFilterClick={handleFilterClick} />
            <Box display={'flex'} justifyContent={"space-between"}>
              <Tooltip title="Add Flight">
                <IconButton color={'info'} onClick={handleAddClick}><AddCircleOutlineSharpIcon /></IconButton>
              </Tooltip>
              <TablePagination
                rowsPerPageOptions={[1, 5, 10, 25]}
                component="div"
                count={flightsData?.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Box>

            <SortButtons sortCells={sortCells} onRequestSort={handleRequestSort} order={order} orderBy={orderBy} />
            <StyledAccordion >
              {

                getFilteredDataMemo.map((row: IFlightData, index: number) => {
                  return (
                    <Accordion key={row._id} expanded={expanded === `panel${index}`} onChange={handleChange(`panel${index}`)}
                    >
                      <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                        <Typography variant='caption'> {row.device_id} , {new Date(row.date).toLocaleString()}</Typography>
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
                                      {(row.validOperation & CanDo.Delete) ? <Button onClick={(event) => handleDeleteClick(event, row._id)}>Delete</Button> : null}
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
      </div>
      <footer className='footer' style={{ overflowY: "hidden" }}>

      </footer>
    </>

  )
}
export default FlightPage;