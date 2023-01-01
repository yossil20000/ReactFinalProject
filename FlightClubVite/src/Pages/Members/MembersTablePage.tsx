

import { alpha, Avatar, Box, Button, FormControlLabel, Grid, IconButton, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Toolbar, Tooltip, Typography } from '@mui/material';
import React, {  useEffect, useState } from 'react'


import { visuallyHidden } from '@mui/utils';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import MediaQuery from "react-responsive";
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

import { useFetcAllMembersQuery, useFetchAllClubNoticeQuery,useUpdateStatusMutation } from '../../features/Users/userSlice'
import { useAppSelector } from '../../app/hooks'
import GeneralCanDo, { CanDo } from '../../Utils/owner';
import { IMemberStatus, Status } from '../../Interfaces/API/IMember';

interface ItableData {
  _id: string, member_id: string, family_name: string, first_name: string, email: string, phone: string,validOperation: CanDo,status: Status,image: string
}

function createdata(_id: string, member_id: string, family_name: string, first_name: string, email: string, phone: string, validOperation: CanDo,status:Status,image: string): ItableData {
  return { _id, member_id, family_name, first_name, email, phone,validOperation,status ,image} as ItableData
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
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
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
  
  { id: "member_id", label: "Id Number", numeric: false, disablePadding: true },
  { id: "first_name", label: "Name", numeric: false, disablePadding: true },
  { id: "email", label: "Email", numeric: false, disablePadding: true },
  { id: "phone", label: "Phone", numeric: false, disablePadding: true },
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
            align={headCell.numeric ? 'right' : 'left'}
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
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const { numSelected } = props;
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
       <Box sx={{ flexGrow: 1 }} />
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
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
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

function MembersTablePage() {
  const login = useAppSelector((state) => state.authSlice);
  const [updateStatsMember] = useUpdateStatusMutation();
  const { data: members, isFetching } = useFetcAllMembersQuery();
  const { data: message, isFetching: isFetchingMessage } = useFetchAllClubNoticeQuery();
  const [rows, setRows] = useState<ItableData[]>([])

  const DrawMessage = () => {
    if (isFetchingMessage) return (<>Fetcing message</>)
    if (message?.success) return (<>MEssage Succeed</>)
    return (<span>Un Known</span>)
  }
  useEffect(() => {

    let rows = members?.data.map((item) => {
      return createdata(item._id, item.member_id, item.family_name, `${item.family_name}, ${item.first_name}`, item.contact.email, `${item.contact.phone.country}-${item.contact.phone.area}-${item.contact.phone.number}`,GeneralCanDo(item._id, login.member._id, login.member.roles),item.status,item.image)
    })
    console.log('UseEffect/rows/be', rows)
    if (rows === undefined) {
      rows = [];
    }
    setRows(rows);
    console.log('UseEffect/rows', rows)

  }, [members?.data])

  /* Table Section */
  const [order, setOrder] = useState<Order>('asc');
const [orderBy, setOrderBy] = useState<keyof ItableData>('_id');
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof ItableData) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows?.map((n) => n._id);
      setSelected(newSelecteds);
      return
    }
    setSelected([]);
  }
  const handleDeleteClick = async (event: React.MouseEvent<unknown>, _id: string) => {
    console.log("Delete /",_id);
    try{
      const newStatus : IMemberStatus = {
        _id: _id,
        status: Status.Suspended
      }
      const payload = await updateStatsMember(newStatus)
      .unwrap()
      .then((payload) => {
        console.log("DeleteMember Fullfill", payload)
      });
    }
    catch(err){

    }
  }
  const handleEditClick = (event: React.MouseEvent<unknown>, _id: string) => {
    console.log("Edit /",_id);
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
    <div className='main' style={{overflow: 'auto'}}>

      <MediaQuery minWidth={768}>
        {rows ? (
          <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
              <EnhancedTableToolbar numSelected={selected ? selected.length : 0} />
              <TablePagination sx={{overflow:'visible'}} 
                rowsPerPageOptions={[1,5, 10, 25]}
                component="div"
                count={rows ? rows.length : 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
              <TableContainer >
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
                    {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).sort(getComparator(order, orderBy))
                      .map((row: ItableData, index: number) => {
                        const isItemSelected = isSelected(row._id);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            hover
                            
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row._id}
                            selected={isItemSelected}
                          >
                            <TableCell align="left">{row.member_id}</TableCell>
                            <TableCell align="left"><Box display={'flex'} alignItems={'center'}>{row?.image !== "" ? (<Avatar alt="Remy Sharp" src={row?.image} /> ) : null}{row.first_name}</Box></TableCell>
                            <TableCell align="left">{row.email}</TableCell>
                            <TableCell align="left">{row.phone}</TableCell>
                            {/* <TableCell align="left">{(row.validOperation & CanDo.Edit) ? <Button onClick={(event) => handleEditClick(event, row._id)}>Edit</Button> : null}</TableCell>
                            <TableCell align="left">{(row.validOperation & CanDo.Delete) ? <Button onClick={(event) => handleDeleteClick(event, row._id)}>{row.status === Status.Active ? "Susspend" : "Activate"}</Button> : null}</TableCell> */}
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
          </Box>

        ) : (<div>Loading</div>)}
      </MediaQuery>
      <MediaQuery maxWidth={767}>
        <Box sx={{ width: '100%' }}>
          <Paper sx={{ width: '100%', mb: 2 }}>
            <EnhancedTableToolbar numSelected={selected ? selected.length : 0} />
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
              <TablePagination
                rowsPerPageOptions={[1,5, 10, 25]}
                component="div"
                count={rows ? rows.length : 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
            {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                     rows.slice().sort(getComparator(order, orderBy)) */}

            {rows.sort(getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row: ItableData, index: number) => {
                const isItemSelected = isSelected(row._id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (

                <Accordion key={row._id} expanded={expanded === `panel${index}` } onChange={handleChange(`panel${index}`)}>
                  <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                    <Typography>{row.first_name}, {row.member_id}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid  container spacing={0.5} padding={1} columns={{ xs: 2 }} sx={{ width: "100%" }} justifyContent="center" >
                      <Grid item xs={1}>
                      <Typography>email: {row.email}</Typography>
                      <Typography>Phone: {row.phone}</Typography>
                      </Grid>
                      <Grid item xs={1} sx={{display: "flex" , justifyContent: "flex-end"}} >
                      {row?.image !== "" ? (<Avatar alt="Remy Sharp" src={row?.image} /> ) : null}
                      </Grid>
                    </Grid>
                  
                  </AccordionDetails>
                </Accordion>

                );
              })}
          </Paper>

        </Box>
      </MediaQuery>


    </div>
  )
}

export default MembersTablePage