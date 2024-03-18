import { DateTime } from 'luxon'
import { Box, Theme, ThemeProvider, createTheme } from "@mui/system"
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
  onChange?: (value: Date) => void
  cellDisplay?: IDisplayCell[]
}
let emptyCell: IDisplayCell[] = [{
  display: <></>,
  displayStyle: {},
  headerStyle: {}
}]
const useStyles = (them: Theme) => ({
  root: {
    fontSize: '14px',
    // Match [md, ∞)
    //       [900px, ∞)
    [them.breakpoints.up('sm')]: {
      fontSize: '32px',
    },
    [them.breakpoints.up('md')]: {
      fontSize: '32px',
    },
  },
});
const CalanderViewMonth: React.FC<Props> = ({ value = new Date(), onChange, cellDisplay }) => {
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

  const style = useStyles(useTheme())
  return (
    
      <Box sx={{ width: "100%", height: "100%" }}>
        <Grid container sx={{ width: "100%", height: "100%" }}>
          <Grid item sx={{ width: "100%", height: "100%" }} style={style.root}>
            <div style={{ width: "100%" }} className="font-bold border-t border-l grid grid-cols-7  items-center justify-center text-center;" >
              <Cell onClick={prevYear}>{'<<'}</Cell>
              <Cell onClick={prevMonth}>{'<'}</Cell>
              <Cell onClick={() => onChange && onChange(new Date())} className="col-span-3">{`${value.toLocaleString('default', { month: 'long' })} ${value.getFullYear()}`}</Cell>
              <Cell onClick={nextMonth}>{'>'}</Cell>
              <Cell onClick={nextYear}>{'>>'}</Cell>

              {daysOfWeek.map((day) => (
                <Cell style={{ backgroundColor: "#9abce1", color: "#0067fe", height: "100%" }} key={day} className="text-sm font-bold">{day}</Cell>
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
                  return (<CellFlight headerStyle={headerStyle} displayStyle={cellProperty} display={cell} key={date}>{`${date} ${daysOfWeek[new Date(value.getFullYear(), value.getMonth(), date).getDay()]}`}</CellFlight>)
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