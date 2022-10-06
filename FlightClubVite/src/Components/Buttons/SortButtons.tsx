import { Box, TableCell, TableSortLabel } from "@mui/material";

import { visuallyHidden } from '@mui/utils';

export interface ISortCell<T> {
  id: keyof T ;
  label: string;
  numeric: boolean;
}
export interface ISortButtonsProps<T> {

  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void;
  order: Order;
  orderBy: string;
  sortCells: ISortCell<T>[];

}
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

export type Order = 'asc' | 'desc';
function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  /* console.log("descendingComparator", a, b, orderBy) */
  if (b[orderBy] < a[orderBy]) { return -1 }
  if (b[orderBy] > a[orderBy]) { return 1 }
  return 0;
}
export default function SortButtons<T>(props: ISortButtonsProps<T>) {
  
  const { order, orderBy, onRequestSort ,sortCells} =
    props;
  const createSortHandler = (property: keyof T) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };
  let n =`repeat(${sortCells.length+1},1fr)`;
  return (
    <Box display="flex" justifyContent={"space-around"}>
        {sortCells.map((sortCell : ISortCell<T>, index: number) => (
          <Box gridColumn='span 1' key={index.toString()}>
          <TableCell
            key={sortCell.id.toString()}
            align={sortCell.numeric ? 'left' : 'left'}
            
            sortDirection={orderBy === sortCell.id ? order : false}>
            <TableSortLabel
              active={orderBy === sortCell.id}
              direction={orderBy === sortCell.id ? order : 'asc'}
              onClick={createSortHandler(sortCell.id)}
            >
              {sortCell.label}
              {orderBy === sortCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order == 'desc' ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
          </Box>
        ))}

      </Box>
    

  )
}