import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import ActionButtons, { IActionButtonsProps } from './Buttons/ActionButtons';
import { Box } from '@mui/material';

export interface GroupHeader {
  id: string,
  align?: 'right' | 'left' | 'center';
  colSpan: number;
}
export interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | "left" | 'center';
  format?: (value: number | any) => string;
  isCell:boolean;
}

export interface IColumnGroupingTableProps<T> {
 columns: Column[],
 header: GroupHeader[],
 rows: T[],
 action:IActionButtonsProps
}
export default function ColumnGroupingTable<T,>(props: IColumnGroupingTableProps<T>) {
  const keyId = React.useId();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%' }}>
      <TableContainer sx={{ Height: "100%" }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {props.columns.map((column) => {
                if(column.isCell) return(
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              )})}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row,index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={`${keyId}-${index}`}>
                    {props.columns.map((column) => {
                      const value = row[column.id as keyof   T] as string;
                      if(!column.isCell || column.id === "action")
                        return;
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {value}
                        </TableCell>
                      );
                    })}
                    <TableCell>
                      <Box display={'flex'} justifyContent={'space-around'}>
                        <ActionButtons OnAction={props.action.OnAction} show={props.action.show} item={row["_id" as keyof   T] as string}/>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}

          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={props.rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}