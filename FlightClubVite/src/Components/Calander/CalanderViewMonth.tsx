import { DateTime } from 'luxon'
import { Box, Theme, ThemeProvider, createTheme, fontSize } from "@mui/system"
import Cell from "./Cell"
import CellFlight from './CellFlight';
import { useTheme } from '@mui/material/styles';

import { Grid, createStyles, makeStyles } from '@mui/material';

const daysOfWeek = [
  'Sun', 'Mon', 'Tue', 'Wed', "Thu", "Fri", "Sat"
]
console.log("CalanderViewMonth/styles")
export interface IDisplayCell {
  display: React.ReactNode;
  displayStyle: React.CSSProperties
  headerStyle: React.CSSProperties
}
interface Props {
  value?: Date;
  onChange: (value: Date) => void
  cellDisplay?: IDisplayCell[],
  onCellSelect: (value: Date) => void
}
let emptyCell: IDisplayCell[] = [{
  display: <></>,
  displayStyle: {},
  headerStyle: {}
}]
/* const useStyles = (them: Theme) => ({
  root: {
    fontSize: '12px',
    // Match [md, ∞)
    //       [900px, ∞)
    [them.breakpoints.down('sm')]: {
      fontSize: '3px',
    },
    [them.breakpoints.up('md')]: {
      fontSize: '32px',
    },
  },
}); */
const CalanderViewMonth: React.FC<Props> = ({ value = new Date(), onChange, cellDisplay,onCellSelect }) => {
  const startDate = DateTime.local(value.getFullYear(), value.getMonth() + 1).startOf('month')
  const endDate = DateTime.local(value.getFullYear(), value.getMonth() + 1).endOf('month')
  const numOfDays = DateTime.local(value.getFullYear(), value.getMonth() + 1).daysInMonth as number
  const prefixDays = startDate.weekday
  const suffixDays = 7 - (endDate.weekday === 7 ? 1 : endDate.weekday + 1)
  const prevMonth = () => { console.log("CalanderViewMonth/prevMonth"); onChange && onChange(new Date(value.getFullYear(), value.getMonth() - 1)) }
  const nextMonth = () => { console.log("CalanderViewMonth/prevMonth"); onChange && onChange(new Date(value.getFullYear(), value.getMonth() + 1)) }
  const prevYear = () => { console.log("CalanderViewMonth/prevMonth"); onChange && onChange(new Date(value.getFullYear() - 1, value.getMonth())) }
  const nextYear = () => { console.log("CalanderViewMonth/prevMonth"); onChange && onChange(new Date(value.getFullYear() + 1, value.getMonth())) }
  console.log("CalanderViewMonth", startDate, endDate, numOfDays, prefixDays, suffixDays, value)
  console.log("CalanderViewMonth/cellDispaly", cellDisplay)

  /* const style = useStyles(useTheme()) */
  const onCellClick = (id: string) => {
    console.log('CalanderViewMonth/onCellClick/id',id)
    onCellSelect(new Date(value.getFullYear(),value.getMonth(),Number(id)))
  }
  return (
    
      <Box sx={{ width: "100%", height: "100%" }}>
        <Grid container sx={{ width: "100%", height: "100%" }}>
          <Grid item sx={{ width: "100%", height: "100%" ,fontSize:{xs:"0.562rem",sm:"0.75rem",md:"0.875rem",lg:"1rem",xl:"1.125rem"}}} >
            <div style={{ width: "100%"}} className="font-bold border-t border-l grid grid-cols-7  items-center justify-center text-center;" >
              <Cell onClick={prevYear} sx={{fontSize:{xs:"1rem",sm:"1.5rem"}}}>{'<<'}</Cell>
              <Cell onClick={prevMonth} sx={{fontSize:{xs:"1rem",sm:"1.5rem"}}}>{'<'}</Cell>
              <Cell onClick={() => onChange && onChange(new Date())} className="col-span-3" sx={{fontSize:{xs:"1rem",sm:"1.5rem"}}}>{`${value.toLocaleString('default', { month: 'long' })} ${value.getFullYear()}`}</Cell>
              <Cell onClick={nextMonth} sx={{fontSize:{xs:"1rem",sm:"1.5rem"}}}>{'>'} </Cell>
              <Cell onClick={nextYear} sx={{fontSize:{xs:"1rem",sm:"1.5rem"}}}>{'>>'}</Cell>

              {daysOfWeek.map((day) => (
                <Cell sx={{fontSize:{xs:"1rem",sm:"1.2rem"}, lineHeight:{xs:"1rem",sm:"1.4rem"}}}style={{ backgroundColor: "#9abce1", color: "#0067fe", height: "100%" }} key={day} className="text-sm font-bold">{day}</Cell>
              ))}
              {Array.from({ length: prefixDays === 7 ? 0 : prefixDays }).map((_, index) => {
                return (<Cell className={'cell_header'}></Cell>)
              })}
              {

                Array.from({ length: numOfDays }).map((_, index) => {
                  const date = index + 1;
                  let cell: React.ReactNode
                  let cellProperty: React.CSSProperties;
                  let headerStyle: React.CSSProperties;
                  cellProperty = { backgroundColor: "#9abce1" }
                  headerStyle = { backgroundColor: "#9abce1", color: "#0067fe" }
                  if (cellDisplay === undefined) {
                    cell = <></>;


                  }
                  else {
                    cell = cellDisplay[date].display === undefined ? <></> : cellDisplay[date].display
                    cellProperty = cellDisplay[date].displayStyle === undefined ? { backgroundColor: "red" } : cellDisplay[date].displayStyle
                    headerStyle = cellDisplay[date].headerStyle === undefined ? headerStyle : cellDisplay[date].headerStyle

                  }
                  return (<CellFlight id={date.toString()} onCellClick={onCellClick} headerStyle={headerStyle} displayStyle={cellProperty} display={cell} key={date}>{`${date} ${daysOfWeek[new Date(value.getFullYear(), value.getMonth(), date).getDay()]}`}</CellFlight>)
                })
              }
              {Array.from({ length: suffixDays == 7 ? 0 : suffixDays }).map((_, index) => {
                return (<Cell className={'cell_header'}></Cell>)
              })}
            </div>
          </Grid>

        </Grid>
      </Box>
    

  )
}

export default CalanderViewMonth