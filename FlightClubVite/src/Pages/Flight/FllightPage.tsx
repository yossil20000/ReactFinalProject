import "../../Types/date.extensions"
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Container, Grid, Paper, styled, TablePagination, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import FullScreenLoader from "../../Components/FullScreenLoader";
import { useGetAllFlightsQuery, useDeleteFlightMutation } from "../../features/Flight/flightApi";
import IFlight, { IFlightCreate, IFlightDeleteApi, IFlightUpdate, Status } from "../../Interfaces/API/IFlight";
import Message from '../../Components/Message'
import { grid } from "@mui/system";


import GeneralCanDo, { CanDo } from "../../Utils/owner";
import { useAppSelector } from "../../app/hooks";
import { ILoginResult } from "../../Interfaces/API/ILogin";
import FilterButtons from "../../Components/Buttons/FilterButtons";
import UpdateFlightDialog from "./UpdateFlightDialog";
import SortButtons, { ISortCell, Order } from "../../Components/Buttons/SortButtons";
import CreateFlightDialog from "./CreateFlightDialog";

const StyledAccordion = styled(Box)(({ theme }) => ({
  color: theme?.palette.primary.main,
  "& .MuiAccordionSummary-content:nth-of-type(2n+1)":
    { backgroundColor: "gray", color: "white" }
}
))

interface IFlightData {
  _id: string; _id_member: string; name: string; description: string;
  device_id: string; date_from: Date; date_to: Date; member_id: string; validOperation: CanDo;
  hobbs_start: number; hobbs_stop: number; engien_start: number; engien_stop: number;
}

function createdata(flight: IFlight, validOperation: CanDo): IFlightData {
  return {
    _id: flight._id, _id_member: flight.member._id, description: flight.description,
    name: flight.member.family_name, device_id: flight.device.device_id,
    date_from: new Date(flight.date_from), date_to: new Date(flight.date_to), member_id: flight.member.member_id,
    hobbs_start: flight.hobbs_start, hobbs_stop: flight.hobbs_stop, engien_start: flight.engien_start, engien_stop: flight.engien_stop,
    validOperation: validOperation
  }
}


const sortCells: ISortCell<IFlightData>[] = [
  { id: "_id", label: "Device", numeric: false },
  { id: "date_from", label: "From", numeric: false },
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
  date_from: new Date(),
  date_to: new Date(),
  _id: "",
  device_name: "",
  member_name: "",
  hobbs_start: 0,
  hobbs_stop: 0,
  engien_start: 0,
  engien_stop: 0,
  description: "",
  status: Status.CREATED
}
let flightAddIntitial: IFlightCreate = {
  date_from: new Date(),
  date_to: new Date(),

  device_name: "",
  member_name: "",
  hobbs_start: 0,
  hobbs_stop: 0,
  engien_start: 0,
  engien_stop: 0,
  description: "",
  status: Status.CREATED,
  _id_device: "",
  _id_member: ""
}
const FlightPage = () => {
  const [openFlightAdd, setOpenFlightAdd] = useState(false);
  const [openFlightUpdate, setOpenFlightUpdate] = useState(false);
  const [flightAdd, setFlightAdd] = useState<IFlightCreate>(flightAddIntitial)
  const [flightUpdate, setFlightUpdate] = useState<IFlightUpdate>(flightUpdateIntitial);
  const [DeleteFlight] = useDeleteFlightMutation();
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof IFlightData>("_id");
  const [flightsData, setFilghtData] = useState<IFlightData[]>([]);
  const [expanded, setExpanded] = useState<string | false>('panel0');
  const [isByDateRange, setIsByDateRange] = useState(false);
  const [isFilterOwner, setIsFilterOwner] = useState(false);
  const [filterBydate, setFilterByDate] = useState(0);
  const [fromDateFilter, setFromDateFilter] = useState<Date | null>(new Date());
  const [toDateFilter, setToDateFilter] = useState<Date | null>(todayDate.clone().addDays(1));
  const [page, setPage] = useState(0);
  const [filteredData, setFilteredData] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const login: ILoginResult = useAppSelector((state) => state.authSlice);
  const { isLoading, isError, isSuccess, error, data: flights, refetch } = useGetAllFlightsQuery();
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
    const filterdData: IFlightData[] = flightsData?.filter((flight) => {
      console.log("flightdat/filter", flightsData);
      if (!isInDateRange(flight)) return false;
      if (!isFilterOwner) return true;
      if (isFilterOwner && flight.validOperation & CanDo.Owner) return true;
      return true;
    }).sort(getComparator(order, orderBy));

    return filterdData;
  }
  useEffect(() => {
    console.log("FlightPage/useEffect/flight.data", flights === undefined ? "Undefined" : flights)
    if (flights?.data !== undefined) {

      setFilghtData(getFlightData(flights?.data));
      //setFilteredData( getFilteredData());
    }

  }, [flights?.data])

  useEffect(() => {
    // setFilteredData( getFilteredData());

  }, [order, orderBy, isByDateRange, filterBydate, fromDateFilter, toDateFilter])

  if (isLoading) {
    return (
      <div className='main' style={{ overflow: 'auto' }}>
        <FullScreenLoader />
      </div>
    )
  }
  if (flights !== undefined || flights !== null) {
    console.log("Flights", flights);
  }
  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof IFlightData) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }


  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
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
  const handleFilterClick = (selectedIndex: number): number => {
    console.log("handleFilterClick", selectedIndex);
    if (selectedIndex == 3)
      setIsByDateRange(true);
    else
      setIsByDateRange(false);
    setFilterByDate(selectedIndex);
    console.log("handleFilterClick", selectedIndex, isByDateRange);
    return selectedIndex;
  }
  const isInDateRange = (row: IFlightData): boolean => {
    console.log("isInDateRange/filterBydate", filterBydate)
    switch (filterBydate) {
      case 0:
        return row.date_from.isSameDate(todayDate);
      case 1:
        return row.date_from.getWeek() == todayDate.getWeek();
      case 2:
        return row.date_from.isSameMonth(todayDate);
      case 3:
        if (fromDateFilter && toDateFilter)
          return row.date_from >= fromDateFilter && row.date_from <= toDateFilter
        break;
    }
    return true;
  }
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  function fillFlightUpdate(id: string) {
    const flight = flightsData.filter(item => item._id === id)
    if (flight.length === 1) {
      console.log("RenderFlightUpdate/filter", flight);
      flightUpdateIntitial._id = flight[0]._id;
      flightUpdateIntitial.date_from = flight[0].date_from;
      flightUpdateIntitial.date_to = flight[0].date_to;
      flightUpdateIntitial.device_name = flight[0].device_id;
      flightUpdateIntitial.member_name = `${flight[0].name} ${flight[0].member_id}`
      flightUpdateIntitial.hobbs_start = flight[0].hobbs_start;
      flightUpdateIntitial.hobbs_stop = flight[0].hobbs_stop;
      flightUpdateIntitial.engien_start = flight[0].engien_start;
      flightUpdateIntitial.engien_stop = flight[0].engien_stop;
      flightUpdateIntitial.description = flight[0].description;
      setFlightUpdate(flightUpdateIntitial);
    }
  }

  const handleUpdateOnSave = (value: IFlightUpdate) => {
    refetch();
    setOpenFlightUpdate(false);
    console.log("FlightPage/handleOnSave/value", value);

  }
  const handleEditClick = async (event: React.MouseEvent<unknown>, _id: string) => {
    fillFlightUpdate(_id);
    setOpenFlightUpdate(true);
  }
  const handleUpdateOnClose = () => {
    setOpenFlightUpdate(false);
  }
  const handleAddClick = async (event: React.MouseEvent<unknown>) => {

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
  return (
    <>
      <div className='header'><Typography variant="h6" align="center">Flight Page</Typography></div>
      <div className='main' style={{overflow: "auto"}} >
        {openFlightUpdate && <UpdateFlightDialog onClose={handleUpdateOnClose} value={flightUpdateIntitial} open={openFlightUpdate} onSave={handleUpdateOnSave} />}
        {openFlightAdd && <CreateFlightDialog onClose={handleAddOnClose} value={flightAddIntitial} open={openFlightAdd} onSave={handleAddOnSave} />}
        <Box sx={{ width: '100%', height: '100%' }}>
          <Paper sx={{ width: '100%', mb: 2 }}>
            <FilterButtons handleAddFlight={handleAddClick} isByDateRange={isByDateRange} OnFilterOwner={handleFilterOwner} isFilterOwner={isFilterOwner}
              handleFilterClick={handleFilterClick} setFromDateFilter={setFromDateFilter} fromDateFilter={fromDateFilter} setToDateFilter={setToDateFilter} toDateFilter={toDateFilter} />
            <SortButtons sortCells={sortCells} onRequestSort={handleRequestSort} order={order} orderBy={orderBy} />
            <StyledAccordion >
              {

                getFilteredData().sort(getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: IFlightData, index: number) => {
                    return (
                      <Accordion key={row._id} expanded={expanded === `panel${index}`} onChange={handleChange(`panel${index}`)}
                      >
                        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                          <Typography variant='caption'> {row.device_id} , {new Date(row.date_from).toLocaleString()} {"=>"} {new Date(row.date_to).toLocaleString()}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={1}>
                            <Grid item sm={12}>
                              <Typography variant='caption'>description: {row.description}</Typography>
                            </Grid>
                            <Grid item xs={3} >

                              <Typography >
                                {row.name}
                              </Typography>
                              <Typography>
                                {row.member_id}
                              </Typography>
                            </Grid>
                            <Grid item sm={4} >
                              <Typography>
                                {`Hobbs Start: ${row.hobbs_start}`}
                              </Typography>
                              <Typography>
                                {`Hobbs Stop: ${row.hobbs_stop}`}
                              </Typography>
                            </Grid>
                            <Grid item sm={4} >
                              <Typography>
                                {`Engien Start: ${row.engien_start}`}
                              </Typography>
                              <Typography>
                                {`Engien Stop: ${row.engien_stop}`}
                              </Typography>

                            </Grid>
                            <Grid item sm={1} >
                              <Typography>
                                {(row.validOperation & CanDo.Edit) ? <Button onClick={(event) => handleEditClick(event, row._id)}>Edit</Button> : null}
                              </Typography>
                              <Typography>
                                {(row.validOperation & CanDo.Delete) ? <Button onClick={(event) => handleDeleteClick(event, row._id)}>Delete</Button> : null}
                              </Typography>

                            </Grid>
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
        <TablePagination
          rowsPerPageOptions={[1, 5, 10, 25]}
          component="div"
          count={flightsData?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </footer>
    </>

  )
}
export default FlightPage;