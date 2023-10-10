import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
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
  render?: React.ReactNode
}

export interface IColumnGroupingTableProps<T> {
 columns: Column[],
 header: GroupHeader[],
 rows: T[],
 action:IActionButtonsProps,
 rowsPerPage: number,
 page: number
}

export default function ColumnGroupingTable<T,>(props: IColumnGroupingTableProps<T>) {
  const keyId = React.useId();

 function RenderCell<T>(row: T, column: Column) {
  const value = row[column.id as keyof   T] as unknown as string;
  let render = row[column.render as keyof   T] as unknown as React.ReactNode;
  if(value !== ""){
    render = (<>{column.format  
      ? column.format(value)
      : value}</>)
  }
  return (
    <>
     {render }
    </>
   
  )
 }
  return (
    <Paper sx={{ width: '100%'  }}>
      <TableContainer sx={{ maxHeight: "100%" }}>
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
                  {column.label === "" ? column.render : column.label}
                </TableCell>
              )})}
            </TableRow>
            
          </TableHead>
          <TableBody>
            {props.rows
              .slice(props.page * props.rowsPerPage, props.page * props.rowsPerPage + props.rowsPerPage)
              .map((row,index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={`${keyId}-${index}`}>
                    {props.columns.map((column) => {
                      const value = row[column.id as keyof   T] as unknown as string;
                      if(!column.isCell || column.id === "action")
                        return;
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {/* {column.format  
                            ? column.format(value)
                            : value} */}
                            <>{RenderCell(row,column) }</>
                        </TableCell>
                      );
                    })}
                    { props.action.show.length> 0 ? (
                    <TableCell>
                      <Box display={'flex'} justifyContent={'space-around'}>
                        <ActionButtons OnAction={props.action.OnAction} show={props.action.show} item={row["_id" as keyof   T] as unknown as string} disable={props.action.disable}/>
                      </Box>
                    </TableCell>) : (null)
              }
                  </TableRow>
                );
              })}

          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}