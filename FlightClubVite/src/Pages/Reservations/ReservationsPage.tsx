/* import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'; */
import "../../Types/date.extensions.js"

import { alpha, Box, Button, FormControlLabel, Grid, IconButton, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField, Toolbar, Tooltip, Typography, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { visuallyHidden } from '@mui/utils';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import MediaQuery from "react-responsive";
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps, } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

import { useFetchAllReservationsQuery, useDeleteReservationMutation } from '../../features/Reservations/reservationsApiSlice';
import GeneralCanDo, { CanDo } from '../../Utils/owner';
import { useAppSelector } from '../../app/hooks';
import SplitedButton from '../../Components/Buttons/SplitedButton';

import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DateTime } from 'luxon';
import { ILoginResult } from "../../Interfaces/API/ILogin.js";
import IReservation, { IReservationCreateApi, IReservationDelete, IReservationUpdate } from "../../Interfaces/API/IReservation.js";
import UpdateReservationDialog from "./UpdateReservationDialog";
import CreateReservationDialog from "./CreateReservationDialog.js";
import { IReservationFilterDate } from "../../Interfaces/API/IFlightReservation.js";

const todayDate = new Date();

interface ItableData {
  _id_reservaion: string; _id_member: string; name: string;
  device_name: string; date_from: Date; date_to: Date; member_id: string; validOperation: CanDo;
}

function createdata(_id_reservaion: string, _id_member: string, member_id: string,
  name: string, device_name: string, date_from: Date, date_to: Date, validOperation: CanDo): ItableData {
  return { _id_reservaion, _id_member, member_id, name, device_name, date_from: new Date(date_from), date_to: new Date(date_to), validOperation } as ItableData
}
function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  /* console.log("descendingComparator", a, b, orderBy) */
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
  handleReservationAdd: () => void;
}
function EnhancedTableHead(props: IEnhancedTableHeadProps) {

  const { order, orderBy, onRequestSort, handleReservationAdd } =
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
        <TableCell>

        </TableCell>
        <TableCell>
          <Button onClick={handleReservationAdd} >Add</Button>
        </TableCell>
      </TableRow>
    </TableHead>

  )
}

interface EnhancedTableToolbarProps {
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
const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const { isByDateRange, OnFilterOwner, isFilterOwner, handleFilterClick, setFromDateFilter, setToDateFilter, fromDateFilter, toDateFilter } = props;
  
  
  const dateRangeBP = useMediaQuery('(min-width:410px)');
  console.log("EnhancedTableToolbar/isbydateRange", isByDateRange);
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
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
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
  member_name: ""

}

let reservationAddIntitial: IReservationCreateApi = {
  date_from: new Date(),
  date_to: new Date(),
  _id_member: "",
  _id_device: ""
}
const reservationFilter : IReservationFilterDate = {
  from: new Date(),
  to: (new Date()).addDays(30),
  currentOffset: (new Date()).getTimezoneOffset()
}

function ReservationsPage() {
  const [fromDateFilter, setFromDateFilter] = useState<Date | null>(new Date());
  const [toDateFilter, setToDateFilter] = useState<Date | null>(todayDate.clone().addDays(30));
  const [openReservationAdd, setOpenReservationAdd] = useState(false);
  const login: ILoginResult = useAppSelector((state) => state.authSlice);
  const { data: reservations, isError, isLoading, isSuccess, error, refetch } = useFetchAllReservationsQuery({from: fromDateFilter,to:toDateFilter} as IReservationFilterDate);
  const [rows, setRows] = useState<ItableData[]>([])

  const [isByDateRange, setIsByDateRange] = useState(false);
  const [DeleteReservation] = useDeleteReservationMutation();

  const [isReservationUpdate, setIsReservationUpdate] = useState(false);

  const [reservationUpdate, setReservationUpdate] = useState<IReservationUpdate>(reservationUpdateIntitial);
  console.log("ReservationsPage", reservations?.data)

  function SetReservationUpdate(id_reservation: string) {
    const reservation = rows.filter(item => item._id_reservaion === id_reservation)
    if (reservation.length === 1 && reservation[0].name) {
      console.log("RenderReservationUpdate/filter", reservation);
      reservationUpdateIntitial._id = reservation[0]._id_reservaion;
      reservationUpdateIntitial.date_from = reservation[0].date_from;
      reservationUpdateIntitial.date_to = reservation[0].date_to;
      reservationUpdateIntitial.device_name = reservation[0].device_name
      reservationUpdateIntitial.member_name = `${reservation[0].name} ${reservation[0].member_id}`
      setReservationUpdate(reservationUpdateIntitial);
    }
  }
  useEffect(() => {
    let rows: ItableData[] = []
    if (reservations?.data) {
      rows = reservations?.data.map((item) => {
        if (item.member)
          return createdata(item._id, item.member._id, item.member.member_id, `${item.member.family_name} ${item.member.first_name}`, item.device.device_id, item.date_from, item.date_to, GeneralCanDo(item.member._id, login.member._id, login.member.roles))
        return createdata(item._id, "_id", "member_id", `family_name .first_name`, item.device.device_id, item.date_from, item.date_to, GeneralCanDo("_id", login.member._id, login.member.roles))
      })
    }
    console.log('UseEffect/rows/be', rows)
    if (rows === undefined) {
      rows = [];
    }
    setRows(rows);
    console.log('UseEffect/rows', rows)

  }, [reservations?.data])

  /* Table Section */
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof ItableData>('_id_reservaion');

  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isFilterOwner, setIsFilterOwner] = useState(false);
  const [filterBydate, setFilterByDate] = useState(0);


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
  const handleFilterOwner = () => {
    setIsFilterOwner(!isFilterOwner);
  }
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

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };



  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const [expanded, setExpanded] = React.useState<string | false>('panel0');

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const isInDateRange = (row: ItableData): boolean => {

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


  const handleDeleteClick = async (event: React.MouseEvent<unknown>, _id: string) => {
    const reservationDelete: IReservationDelete = {
      _id: _id
    }
    console.log("Delete /", _id);
    try {
      const payload = await DeleteReservation(reservationDelete)
        .unwrap()
        .then((payload) => {
          console.log("DeleteReservation Fullfill", payload)
          refetch();
        });
    }
    catch (err) {
      console.log("DeleteReservation/err", err)
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
    console.log("UpdateReservationDialog/handleOnSave/value", value);

  }
  const handleAddOnSave = (value: IReservationCreateApi) => {
    refetch();
    setOpenReservationAdd(false);
    console.log("ReservationPage/handleAddOnSave/value", value);

  }
  const handleAddOnClose = () => {
    setOpenReservationAdd(false);
  }
  const handleAddClick = async () => {

    setOpenReservationAdd(true);
  }

  return (
    <>

      <div className='header'><Typography variant="h6" align="center">Reservation Page</Typography></div>
      <div className='main' style={{ overflow: 'auto' }}>
        {isReservationUpdate && <UpdateReservationDialog onClose={handleUpdateOnClose} value={reservationUpdate} open={isReservationUpdate} onSave={handleUpdateOnSave} />}
        {openReservationAdd && <CreateReservationDialog onClose={handleAddOnClose} value={reservationAddIntitial} open={openReservationAdd} onSave={handleAddOnSave} />}
        <Box sx={{ width: '100%', height: '100%' }}>
          <Paper sx={{ width: '100%', mb: 2 }}>
            <EnhancedTableToolbar isByDateRange={isByDateRange} OnFilterOwner={handleFilterOwner} isFilterOwner={isFilterOwner} handleFilterClick={handleFilterClick} setFromDateFilter={setFromDateFilter} fromDateFilter={fromDateFilter} setToDateFilter={setToDateFilter} toDateFilter={toDateFilter} />
            <TablePagination
              rowsPerPageOptions={[1, 5, 10, 25]}
              component="div"
              count={rows ? rows.length : 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <TableContainer>
              <Table stickyHeader={true}
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={dense ? 'small' : 'medium'}
              >
                <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  handleReservationAdd={handleAddClick}
                />
                <MediaQuery minWidth={768}>
                  <TableBody sx={{ "& tr:nth-of-type(2n+1)": { backgroundColor: "gray", color: "white", "& .MuiTableCell-root": { color: "white" } }, "color": "red" }}>
                    {

                      rows.filter((r) => {
                        if (!isInDateRange(r)) return false;
                        if (!isFilterOwner) return true
                        if (isFilterOwner && r.validOperation & CanDo.Owner) return true;
                        return false;
                      }).sort(getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row: ItableData) => {
                          return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={row._id_reservaion}>
                              <TableCell align="left">{row.device_name}</TableCell>
                              <TableCell align="left">{new Date(row.date_from).toLocaleString()}</TableCell>
                              <TableCell align="left">{new Date(row.date_to).toLocaleString()}</TableCell>
                              <TableCell align="left">{row.name}</TableCell>
                              <TableCell align="left">{row.member_id}</TableCell>
                              <TableCell align="left">{(row.validOperation & CanDo.Edit) ? <Button onClick={(event) => handleEditClick(event, row._id_reservaion)}>Edit</Button> : null}</TableCell>
                              <TableCell align="left">{(row.validOperation & CanDo.Delete) ? <Button onClick={(event) => handleDeleteClick(event, row._id_reservaion)}>Delete</Button> : null}</TableCell>
                            </TableRow>
                          );
                        })}
                  </TableBody>
                </MediaQuery>

              </Table>
            </TableContainer>
            <MediaQuery maxWidth={767}>
              {
                rows.filter((r) => {

                  if (!isInDateRange(r)) return false;
                  if (!isFilterOwner) return true
                  if (isFilterOwner && r.validOperation & CanDo.Owner) return true;
                  return false;
                })
                  .sort(getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row: ItableData, index: number) => {
                    return (
                      <Accordion key={row._id_reservaion} expanded={expanded === `panel${index}`} onChange={handleChange(`panel${index}`)}>
                        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                          <Typography variant='caption'> {row.device_name} , {new Date(row.date_from).toLocaleString()} {"=>"} {new Date(row.date_to).toLocaleString()}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={1}>
                            <Grid item xs={3} >
                              <Typography>
                                {row.name}
                              </Typography>
                            </Grid>
                            <Grid item sm={3} >
                              <Typography>
                                Id:
                              </Typography>
                              <Typography>
                                {row.member_id}
                              </Typography>
                            </Grid>
                            <Grid item sm={3} >
                              <Typography>
                                {(row.validOperation & CanDo.Edit) ? <Button onClick={(event) => handleEditClick(event, row._id_reservaion)}>Edit</Button> : null}

                              </Typography>
                              <Typography>
                                {(row.validOperation & CanDo.Delete) ? <Button onClick={(event) => handleDeleteClick(event, row._id_reservaion)}>Delete</Button> : null}
                              </Typography>

                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    );
                  })
              }
            </MediaQuery>
          </Paper>
          {/*         <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Dense padding"
        /> */}
        </Box>




      </div>

    </>
  )
}

export default ReservationsPage