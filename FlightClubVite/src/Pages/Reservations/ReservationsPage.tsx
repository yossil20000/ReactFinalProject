/* import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'; */

import Checkbox from '@mui/material/Checkbox';
import { alpha, Box, Button, FormControlLabel, IconButton, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Toolbar, Tooltip, Typography } from '@mui/material';
import React, { Component, useEffect, useState } from 'react'


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
import { Iso } from '@mui/icons-material';
import GeneralCanDo, { CanDo } from '../../Utils/owner';
import { useAppSelector } from '../../app/hooks';


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

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
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
  { id: "member_id", label: "IdNumber", numeric: false, disablePadding: true }

]
interface IEnhancedTableHeadProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof ItableData) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}
function EnhancedTableHead(props: IEnhancedTableHeadProps) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
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
      </TableRow>
    </TableHead>

  )
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  isFilterOwner: boolean;
  OnFilterOwner: () => void;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const { numSelected, OnFilterOwner, isFilterOwner } = props;
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (them) =>
            alpha(them.palette.primary.main, them.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color='inherit' variant='subtitle1' component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
          Memebrs
        </Typography>
      )}
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color='inherit' variant='subtitle1' component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
          Memebrs
        </Typography>
      )}
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color='inherit' variant='subtitle1' component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
          Memebrs
        </Typography>
      )}
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
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isFilterOwner, setIsFilterOwner] = useState(false);

  const handleFilterOwner = () => {
    setIsFilterOwner(!isFilterOwner);
  }
  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof ItableData) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows?.map((n) => n._id_reservaion);
      setSelected(newSelecteds);
      return
    }
    setSelected([]);
  }

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

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

  const isSelected = (name: string) => selected?.indexOf(name) !== -1;

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
              <EnhancedTableToolbar numSelected={selected ? selected.length : 0} OnFilterOwner={handleFilterOwner} isFilterOwner={isFilterOwner} />
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
                    numSelected={selected ? selected.length : 0}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={rows ? rows.length : 0}
                  />
                  <TableBody>
                    {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                     rows.slice().sort(getComparator(order, orderBy)) */}

                    {rows.filter((r) => {
                      if (!isFilterOwner) return true
                      if (isFilterOwner && r.validOperation & CanDo.Owner) return true;
                      return false;
                    })
                      .sort(getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row: ItableData, index: number) => {
                        const isItemSelected = isSelected(row._id_reservaion);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            hover
                            onClick={(event) => handleClick(event, row._id_reservaion)}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row._id_reservaion}
                            selected={isItemSelected}
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
            <EnhancedTableToolbar numSelected={selected ? selected.length : 0} OnFilterOwner={handleFilterOwner} isFilterOwner={isFilterOwner} />
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
                  numSelected={selected ? selected.length : 0}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={rows ? rows.length : 0}
                />

              </Table>

            </TableContainer>
            {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                     rows.slice().sort(getComparator(order, orderBy)) */}

            {rows.sort(getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row: ItableData, index: number) => {
                const isItemSelected = isSelected(row._id_reservaion);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (

                  <Accordion key={row._id_reservaion} expanded={expanded === `panel${index}`} onChange={handleChange(`panel${index}`)}>
                    <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                      <Typography> {row.device_name} , {new Date(row.date_from).toLocaleString()} {"=>"} {new Date(row.date_to).toLocaleString()}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography> Order by: {row.name} , {row.member_id}</Typography>

                    </AccordionDetails>
                  </Accordion>

                );
              })}
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