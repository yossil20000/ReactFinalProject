/* import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'; */

import { alpha, Box, Button,  FormControlLabel,  Grid, IconButton, Paper,  Switch, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField, Toolbar, Tooltip, Typography } from '@mui/material';
import React, {  useEffect, useState } from 'react'


import { visuallyHidden } from '@mui/utils';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import MediaQuery from "react-responsive";
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';


import { useFetchAllReservationsQuery } from '../../features/Reservations/reservationsApiSlice';
import GeneralCanDo, { CanDo } from '../../Utils/owner';
import { useAppSelector } from '../../app/hooks';
import SplitedButton, { ISplitButtonProps } from '../../Components/Buttons/SplitedButton';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';

import { ThemeProvider, createTheme } from '@mui/material/styles';

interface ItableData {
  _id_reservaion: string; _id_member: string; name: string;
  device_name: string; date_from: Date; date_to: Date; member_id: string; validOperation: CanDo;
}

function createdata(_id_reservaion: string, _id_member: string, member_id: string,
  name: string, device_name: string, date_from: Date, date_to: Date, validOperation: CanDo): ItableData {
  return { _id_reservaion, _id_member, member_id, name: name, device_name, date_from, date_to, validOperation } as ItableData
}



function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  console.log("descendingComparator", a, b, orderBy)
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
}
function EnhancedTableHead(props: IEnhancedTableHeadProps) {
  const {  order, orderBy,   onRequestSort } =
    props;
  const createSortHandler = (property: keyof ItableData) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };
  return (

    <TableHead>
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

        </TableCell>
      </TableRow>
    </TableHead>

  )
}

interface EnhancedTableToolbarProps {
  
  isFilterOwner: boolean;
  OnFilterOwner: () => void;
  handleFilterClick(selectedIndex : number) : number;
}
const defaultMaterialThem = createTheme({
  
})
const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const {  OnFilterOwner, isFilterOwner ,handleFilterClick} = props;
  const [value,setValue] = useState<Date | null>(new Date());
  const handleChange = (newValue: Date | null) => {
    setValue(newValue);
  };
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
      <SplitedButton options={["Today", 'Week',"Month","All"]} handleClick={handleFilterClick}/>
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <ThemeProvider theme={defaultMaterialThem}>
        <DateTimePicker 
          label="From Date"
          value={value}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} size={'small'} helperText={null} sx={{label:{color:"#2196f3"}, ml:{sm:1},}}/>}
        />
         <DateTimePicker 
         
          label="To Date"
          value={value}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} size={'small'}  color={'error'} sx={{label:{color:"#2196f3"}, ml:{sm:1}}}/>}
        />
        </ThemeProvider>
     
      </LocalizationProvider>
     
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

function ReservationsPage() {
  const login = useAppSelector((state) => state.authSlice);
  const { data: reservations, isFetching } = useFetchAllReservationsQuery();
  const [rows, setRows] = useState<ItableData[]>([])


  console.log("ReservationsPage", reservations?.data)

  useEffect(() => {

    let rows = reservations?.data.map((item) => {
      return createdata(item._id, item.member._id, item.member.member_id, `${item.member.family_name} ${item.member.first_name}`, item.device.device_id, item.date_from, item.date_to, GeneralCanDo(item.member._id, login.member._id, login.member.roles))
    })
    console.log('UseEffect/rows/be', rows)
    if (rows === undefined) {
      rows = [];
    }
    setRows(rows);
    console.log('UseEffect/rows', rows)

  }, [reservations?.data])
  const RenderReservations = () => {
    return (
      <ol>
        {reservations?.data.map((r, i) => (

          <li key={i}>{new Date(r.date_from).toLocaleString()}</li>
        ))}
      </ol>

    )
  }

  /* Table Section */
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof ItableData>('_id_reservaion');
 
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isFilterOwner, setIsFilterOwner] = useState(false);
  const [filterBydate,setFilterByDate] = useState(0);
  const handleFilterClick = (selectedIndex: number) :number => {
    console.log("handleFilterClick", selectedIndex);
    setFilterByDate(selectedIndex);
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

  return (
    <div className='main' style={{ overflow: 'auto' }}>

      <MediaQuery minWidth={768}>
        {rows ? (
          <Box sx={{ width: '100%', overflow: 'auto' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
              <EnhancedTableToolbar  OnFilterOwner={handleFilterOwner} isFilterOwner={isFilterOwner} handleFilterClick={handleFilterClick} />
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
                <Table
                  sx={{ minWidth: 750 }}
                  aria-labelledby="tableTitle"
                  size={dense ? 'small' : 'medium'}
                >
                  <EnhancedTableHead
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                  />
                  <TableBody>
                    {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                     rows.slice().sort(getComparator(order, orderBy)) */}

                    {rows.filter((r) => {

                      if(filterBydate != 0)
                      {
                        
                      }
                      if (!isFilterOwner) return true
                      if (isFilterOwner && r.validOperation & CanDo.Owner) return true;
                      return false;
                    })
                      .sort(getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row: ItableData) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row._id_reservaion}
                          >

                            <TableCell align="left">{row.device_name}</TableCell>
                            <TableCell align="left">{new Date(row.date_from).toLocaleString()}</TableCell>
                            <TableCell align="left">{new Date(row.date_to).toLocaleString()}</TableCell>
                            <TableCell align="left">{row.name}</TableCell>
                            <TableCell align="left">{row.member_id}</TableCell>
                            <TableCell align="left">{(row.validOperation & CanDo.Edit) ? <Button>Edit</Button> : null}</TableCell>
                            <TableCell align="left">{(row.validOperation & CanDo.Delete) ? <Button>Delete</Button> : null}</TableCell>
                          </TableRow>
                        );
                      })}
                    {emptyRows > 0 && (
                      <TableRow
                        style={{
                          height: (dense ? 33 : 53) * emptyRows,
                        }}
                      >
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

            </Paper>
            <FormControlLabel
              control={<Switch checked={dense} onChange={handleChangeDense} />}
              label="Dense padding"
            />
          </Box>

        ) : (<div>Loading</div>)}
      </MediaQuery>
      <MediaQuery maxWidth={767}>
        <Box sx={{ width: '100%' }}>
          <Paper sx={{ width: '100%', mb: 2 }}>
            <EnhancedTableToolbar  OnFilterOwner={handleFilterOwner} isFilterOwner={isFilterOwner} handleFilterClick={handleFilterClick}/>
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
              <Table
                sx={{ maxWidth: 700 }}
                aria-labelledby="tableTitle"
                size="small"
              >
                <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                />
              </Table>
            </TableContainer>
            {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                     rows.slice().sort(getComparator(order, orderBy)) */}

            {
              rows.filter((r) => {
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
                            {(row.validOperation & CanDo.Edit) ? <Button>Edit</Button> : null}
                             
                            </Typography>
                            <Typography>
                            {(row.validOperation & CanDo.Delete) ? <Button>Delete</Button> : null}
                            </Typography>

                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  );
                })
            }
          </Paper>
          <FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label="Dense padding"
          />
        </Box>
      </MediaQuery>


    </div>
  )
}

export default ReservationsPage